import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

function extractJson(text: string) {
  const cleaned = text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");

    if (start >= 0 && end > start) {
      return JSON.parse(cleaned.slice(start, end + 1));
    }

    throw new Error("AI returned invalid JSON");
  }
}

export async function GET(request: Request) {
  try {
    // Security
    const authHeader = request.headers.get("authorization");
    const secret = process.env.SCOUT_SECRET;

    if (secret && authHeader !== `Bearer ${secret}`) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // API keys
    const openRouterKey =
      process.env.OPENROUTER_API_KEY;

    const resendKey =
      process.env.RESEND_API_KEY;

    if (!openRouterKey) {
      return NextResponse.json(
        { error: "Missing OPENROUTER_API_KEY" },
        { status: 500 }
      );
    }

    if (!resendKey) {
      return NextResponse.json(
        { error: "Missing RESEND_API_KEY" },
        { status: 500 }
      );
    }

    // Existing BENIA offers
    const { data: existingOffers, error: offersError } =
      await supabaseAdmin
        .from("offers")
        .select("brand,title,category")
        .eq("active", true)
        .limit(100);

    if (offersError) {
      console.error("Offers read error:", offersError);
    }

    // Previous Scout opportunities
    const { data: previousScout, error: scoutError } =
      await supabaseAdmin
        .from("scout_opportunities")
        .select(
          "brand,title,status,source_url"
        )
        .limit(200);

    if (scoutError) {
      console.error(
        "Scout history read error:",
        scoutError
      );
    }

    const existing =
      (existingOffers ?? [])
        .map(
          (offer) =>
            `${offer.brand}: ${offer.title}`
        )
        .join("\n");

    const previous =
      (previousScout ?? [])
        .map(
          (offer) =>
            `${offer.brand}: ${offer.title} [${offer.status}] ${offer.source_url ?? ""}`
        )
        .join("\n");

    // AI prompt
    const prompt = `
Eres BENIA SCOUT.

Tu misión es encontrar UNA oportunidad REAL,
ACTUAL y VERIFICABLE para usuarios de España.

BUSCA oportunidades en:

- bancos
- fintech
- crypto
- exchanges
- cashback
- aplicaciones financieras
- herramientas Business
- bonos de bienvenida
- programas de referidos
- promociones temporales

REGLAS CRÍTICAS:

1. NO inventes promociones.
2. NO inventes recompensas.
3. NO inventes códigos.
4. NO inventes enlaces.
5. NO inventes condiciones.
6. Prioriza fuentes oficiales.
7. La fuente debe poder comprobarse.
8. Comprueba que la promoción sigue vigente.
9. Comprueba que está disponible para usuarios de España.
10. Evita oportunidades que ya estén en BENIA.
11. Evita oportunidades que ya hayan sido ignoradas.
12. El SCORE debe ser de 0 a 100.
13. Si no existe una oportunidad suficientemente fiable,
devuelve opportunity como null.
14. No confundas una promoción general con un referral personalizado.
15. Si existe una fecha límite, indícala.
16. Si una recompensa depende de condiciones,
explícalas claramente.
17. No presentes como confirmado ningún dato que
no aparezca respaldado por una fuente.

OFERTAS ACTUALES DE BENIA:

${existing || "Ninguna"}

OPORTUNIDADES YA DETECTADAS POR SCOUT:

${previous || "Ninguna"}

CRITERIOS DEL BENIA SCORE:

90-100 = oportunidad excepcional
80-89 = oportunidad muy interesante
70-79 = interesante y merece revisión
50-69 = interés limitado
0-49 = descartar

Valora:

- recompensa
- facilidad de conseguirla
- disponibilidad en España
- vigencia
- reputación de la empresa
- claridad de condiciones
- calidad de la fuente
- interés para usuarios de BENIA

Una recompensa alta con condiciones difíciles
NO debe recibir automáticamente una puntuación alta.

Devuelve ÚNICAMENTE JSON válido.

FORMATO:

{
  "opportunity": {
    "brand": "nombre",
    "category": "Finanzas | Crypto | Apps | Business | Ofertas",
    "title": "título corto",
    "reward": "recompensa exacta",
    "description": "descripción factual",
    "score": 0,
    "reason": "motivo del score",
    "source_url": "https://...",
    "source_name": "fuente",
    "expires_at": "YYYY-MM-DD o null",
    "verification_notes": [
      "dato comprobado",
      "condición importante"
    ]
  }
}

Si no encuentras una oportunidad suficientemente fiable:

{
  "opportunity": null
}
`;

    // OpenRouter + Web Search
    const aiResponse = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization:
            `Bearer ${openRouterKey}`,
          "Content-Type":
            "application/json",
          "HTTP-Referer":
            "https://benia.vercel.app",
          "X-Title":
            "BENIA Scout",
        },
        body: JSON.stringify({
          model: "openrouter/free",

          plugins: [
            {
              id: "web",
              max_results: 8,
              search_prompt:
                "Busca promociones financieras actuales en España. Prioriza fuentes oficiales, bases legales, páginas de promociones y documentos oficiales.",
            },
          ],

          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
        }),
      }
    );

    if (!aiResponse.ok) {
      const errorText =
        await aiResponse.text();

      return NextResponse.json(
        {
          error: "OpenRouter error",
          details: errorText,
        },
        { status: 502 }
      );
    }

    const aiData =
      await aiResponse.json();

    const content =
      aiData?.choices?.[0]?.message?.content;

    if (!content) {
      return NextResponse.json(
        {
          error:
            "No response from AI",
        },
        { status: 502 }
      );
    }

    let analysis;

    try {
      analysis =
        extractJson(content);
    } catch {
      return NextResponse.json(
        {
          error:
            "AI returned invalid JSON",
          raw: content,
        },
        { status: 502 }
      );
    }

    const opportunity =
      analysis?.opportunity;

    // No opportunity
    if (!opportunity) {
      return NextResponse.json({
        success: true,
        saved: false,
        emailed: false,
        opportunity: null,
        message:
          "BENIA Scout no ha encontrado una oportunidad suficientemente fiable.",
      });
    }

    // Normalize score
    opportunity.score =
      Math.max(
        0,
        Math.min(
          100,
          Number(
            opportunity.score
          ) || 0
        )
      );

    // Minimum score
    if (opportunity.score < 70) {
      return NextResponse.json({
        success: true,
        saved: false,
        emailed: false,
        scout: analysis,
        message:
          "La oportunidad no alcanza el mínimo BENIA SCORE de 70.",
      });
    }

    // Duplicate protection
    const duplicate =
      (previousScout ?? []).some(
        (item) =>
          item.brand?.toLowerCase() ===
            opportunity.brand?.toLowerCase() &&
          item.title?.toLowerCase() ===
            opportunity.title?.toLowerCase()
      );

    if (duplicate) {
      return NextResponse.json({
        success: true,
        saved: false,
        emailed: false,
        duplicate: true,
        scout: analysis,
        message:
          "La oportunidad ya había sido detectada anteriormente.",
      });
    }

    // Save pending opportunity
    const {
      data: savedOpportunity,
      error: insertError,
    } = await supabaseAdmin
      .from("scout_opportunities")
      .insert({
        brand:
          opportunity.brand,
        category:
          opportunity.category,
        title:
          opportunity.title,
        reward:
          opportunity.reward,
        description:
          opportunity.description,
        score:
          opportunity.score,
        reason:
          opportunity.reason,
        source_url:
          opportunity.source_url,
        source_name:
          opportunity.source_name,
        expires_at:
          opportunity.expires_at ||
          null,
        verification_notes:
          opportunity.verification_notes ??
          [],
        status:
          "pending",
        referral_url:
          null,
        referral_code:
          null,
      })
      .select()
      .single();

    if (insertError) {
      console.error(
        "Supabase insert error:",
        insertError
      );

      return NextResponse.json(
        {
          error:
            "Supabase insert error",
          details:
            insertError.message,
        },
        { status: 500 }
      );
    }

    // Email
    const emailHtml = `
      <div style="
        font-family:Arial,sans-serif;
        max-width:600px;
        margin:auto;
        padding:20px;
      ">

        <h1>🚨 Nueva oportunidad BENIA</h1>

        <h2>
          ${opportunity.brand}
        </h2>

        <p>
          <strong>
            ${opportunity.title}
          </strong>
        </p>

        <p>
          <strong>
            BENIA SCORE:
          </strong>
          ${opportunity.score}/100
        </p>

        <p>
          <strong>
            Recompensa:
          </strong>
          ${opportunity.reward}
        </p>

        <p>
          ${opportunity.description}
        </p>

        <hr />

        <p>
          <strong>
            Motivo del score:
          </strong>
          <br>
          ${opportunity.reason}
        </p>

        <p>
          <strong>
            Fuente:
          </strong>
          <br>
          <a href="${opportunity.source_url}">
            ${opportunity.source_name}
          </a>
        </p>

        <h3>
          Condiciones verificadas
        </h3>

        <ul>
          ${(opportunity.verification_notes ?? [])
            .map(
              (note: string) =>
                `<li>${note}</li>`
            )
            .join("")}
        </ul>

        <hr />

        <p>
          Estado:
          <strong>PENDIENTE</strong>
        </p>

        <p>
          Esta oportunidad todavía
          NO se ha publicado en BENIA.
        </p>

        <p>
          Añade tu código o enlace
          de referido cuando lo tengas.
        </p>

        <p>
          <a href="${opportunity.source_url}">
            🔎 Ver fuente oficial
          </a>
        </p>

      </div>
    `;

    const resendResponse =
      await fetch(
        "https://api.resend.com/emails",
        {
          method: "POST",
          headers: {
            Authorization:
              `Bearer ${resendKey}`,
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            from:
              "BENIA Scout <onboarding@resend.dev>",
            to:
              ["delivered@resend.dev"],
            subject:
              `🚨 BENIA Scout: ${opportunity.brand} — Score ${opportunity.score}`,
            html:
              emailHtml,
          }),
        }
      );

    const resendData =
      await resendResponse.json();

    if (!resendResponse.ok) {
      console.error(
        "Resend error:",
        resendData
      );

      return NextResponse.json({
        success: true,
        saved: true,
        emailed: false,
        scout:
          savedOpportunity,
        email_error:
          resendData,
        message:
          "Oportunidad guardada, pero el email no pudo enviarse.",
      });
    }

    return NextResponse.json({
      success: true,
      saved: true,
      emailed: true,
      scout:
        savedOpportunity,
      email:
        resendData,
      message:
        "BENIA Scout encontró, guardó y notificó una nueva oportunidad.",
    });

  } catch (error) {
    console.error(
      "Scout failed:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Scout failed",
        details:
          error instanceof Error
            ? error.message
            : "Unknown error",
      },
      { status: 500 }
    );
  }
}
