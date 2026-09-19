import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

function extractJson(text: string) {
  const cleaned = text.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/i, "").trim();
  try { return JSON.parse(cleaned); } catch {
    const start = cleaned.indexOf("{"); const end = cleaned.lastIndexOf("}");
    if (start >= 0 && end > start) return JSON.parse(cleaned.slice(start, end + 1));
    throw new Error("AI returned invalid JSON");
  }
}
function esc(v: unknown) { return String(v ?? "").replace(/[&<>\"]/g, (c) => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]!)); }

export async function GET(request: Request) {
  try {
    const secret = process.env.SCOUT_SECRET;
    if (secret && request.headers.get("authorization") !== `Bearer ${secret}`) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const openRouterKey = process.env.OPENROUTER_API_KEY;
    if (!openRouterKey) return NextResponse.json({ error: "Missing OPENROUTER_API_KEY" }, { status: 500 });

    const { data: existing } = await supabaseAdmin.from("offers").select("brand,title,category").eq("active", true).limit(100);
    const { data: history } = await supabaseAdmin.from("scout_opportunities").select("brand,title,status,source_url").limit(200);
    const existingText = (existing ?? []).map(x => `${x.brand}: ${x.title}`).join("\n") || "Ninguna";
    const historyText = (history ?? []).map(x => `${x.brand}: ${x.title} [${x.status}] ${x.source_url ?? ""}`).join("\n") || "Ninguna";

    const prompt = `Eres BENIA SCOUT. Encuentra UNA oportunidad REAL, ACTUAL y VERIFICABLE para usuarios de España. Busca bancos, fintech, crypto, exchanges, cashback, apps, Business y programas de referidos. Prioriza fuentes oficiales. NO inventes recompensas, condiciones, códigos ni enlaces. Distingue un programa público de afiliación de un enlace de referido personal. Si la evidencia es insuficiente devuelve {"opportunity":null}. No publiques una oportunidad solo porque un agregador la mencione.\n\nOFERTAS ACTUALES:\n${existingText}\n\nHISTORIAL SCOUT:\n${historyText}\n\nDevuelve solo JSON: {"opportunity":{"brand":"","category":"Finanzas | Crypto | Apps | Business | Ofertas","title":"","reward":"","description":"","score":0,"reason":"","source_url":"https://...","source_name":"","expires_at":"YYYY-MM-DD o null","verification_notes":[""]}} o {"opportunity":null}. El score 90-100 exige evidencia oficial fuerte y atractivo excepcional; 80-89 muy interesante; 70-79 interesante.`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${openRouterKey}`, "Content-Type": "application/json", "HTTP-Referer": "https://benia.vercel.app", "X-Title": "BENIA Scout" },
      body: JSON.stringify({
        model: "openrouter/free",
        plugins: [{ id: "web", max_results: 8, search_prompt: "Busca programas y promociones actuales para España. Prioriza webs oficiales, bases legales y páginas de referidos o afiliación." }],
        messages: [{ role: "user", content: prompt }],
      }),
    });
    if (!response.ok) return NextResponse.json({ error: "OpenRouter error", details: await response.text() }, { status: 502 });
    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content;
    if (!content) return NextResponse.json({ error: "No response from AI" }, { status: 502 });
    const analysis = extractJson(content);
    const opportunity = analysis?.opportunity;
    if (!opportunity) return NextResponse.json({ success: true, saved: false, opportunity: null, message: "No hay una oportunidad con evidencia suficiente." });

    opportunity.score = Math.max(0, Math.min(100, Number(opportunity.score) || 0));
    if (opportunity.score < 70) return NextResponse.json({ success: true, saved: false, message: "La oportunidad no alcanza 70/100.", scout: opportunity });

    const duplicate = (history ?? []).some(x => x.brand?.toLowerCase() === opportunity.brand?.toLowerCase() && x.title?.toLowerCase() === opportunity.title?.toLowerCase());
    if (duplicate) return NextResponse.json({ success: true, saved: false, duplicate: true, scout: opportunity });

    const { data: saved, error } = await supabaseAdmin.from("scout_opportunities").insert({
      brand: opportunity.brand, category: opportunity.category, title: opportunity.title, reward: opportunity.reward,
      description: opportunity.description, score: opportunity.score, reason: opportunity.reason, source_url: opportunity.source_url,
      source_name: opportunity.source_name, expires_at: opportunity.expires_at || null, verification_notes: opportunity.verification_notes ?? [],
      status: "pending", referral_url: null, referral_code: null,
    }).select().single();
    if (error) return NextResponse.json({ error: "Supabase insert error", details: error.message }, { status: 500 });

    let emailed = false;
    const resendKey = process.env.RESEND_API_KEY;
    const to = process.env.SCOUT_TO_EMAIL;
    if (resendKey && to) {
      const from = process.env.SCOUT_FROM_EMAIL || "BENIA Scout <onboarding@resend.dev>";
      const html = `<div style="font-family:Arial,sans-serif;max-width:650px;margin:auto"><h1>🚨 BENIA Scout</h1><h2>${esc(opportunity.brand)}</h2><p><b>${esc(opportunity.title)}</b></p><p><b>Score:</b> ${opportunity.score}/100</p><p><b>Recompensa:</b> ${esc(opportunity.reward)}</p><p>${esc(opportunity.description)}</p><p><b>Fuente:</b> <a href="${esc(opportunity.source_url)}">${esc(opportunity.source_name)}</a></p><ul>${(opportunity.verification_notes ?? []).map((n:string)=>`<li>${esc(n)}</li>`).join("")}</ul><p><b>Estado:</b> PENDIENTE. Todavía no se publica automáticamente.</p></div>`;
      const mail = await fetch("https://api.resend.com/emails", { method: "POST", headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" }, body: JSON.stringify({ from, to: [to], subject: `BENIA Scout: ${opportunity.brand} — ${opportunity.score}/100`, html }) });
      emailed = mail.ok;
    }
    return NextResponse.json({ success: true, saved: true, emailed, scout: saved, message: "Oportunidad guardada como pendiente; no se publica automáticamente." });
  } catch (error) {
    return NextResponse.json({ error: "Scout failed", details: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}
