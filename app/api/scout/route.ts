import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

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
    const authHeader = request.headers.get("authorization");
    const secret = process.env.SCOUT_SECRET;

    if (secret && authHeader !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const openRouterKey = process.env.OPENROUTER_API_KEY;

    if (!openRouterKey) {
      return NextResponse.json(
        { error: "Missing OPENROUTER_API_KEY" },
        { status: 500 }
      );
    }

    const { data: existingOffers } = await supabase
      .from("offers")
      .select("brand,title,category")
      .eq("active", true)
      .limit(50);

    const existing = (existingOffers ?? [])
      .map((offer) => `${offer.brand}: ${offer.title}`)
      .join("\n");

    const prompt = `
Eres BENIA SCOUT, un investigador de oportunidades para usuarios de España y la UE.

Tu objetivo es encontrar UNA oportunidad real, actual y potencialmente interesante para BENIA.

BUSCA en la web información reciente sobre:
- cuentas bancarias y fintech
- crypto y exchanges
- cashback
- apps financieras
- herramientas Business
- bonos de bienvenida
- programas de referidos
- promociones temporales

REGLAS DE VERIFICACIÓN:

1. No inventes promociones, recompensas, condiciones ni enlaces.
2. Prioriza fuentes oficiales de la empresa.
3. La oportunidad debe poder comprobarse en una fuente web.
4. Si una recompensa aparece en una fuente secundaria pero no puede verificarse, reduce mucho el score o descártala.
5. No confundas una promoción para todos con un programa de referidos personalizado.
6. No uses una oferta ya existente en BENIA salvo que exista una promoción claramente nueva o mejorada.
7. El score debe ser de 0 a 100, no de 0 a 10.
8. Si no encuentras una oportunidad suficientemente verificable, devuelve opportunity como null.

OFERTAS QUE BENIA YA TIENE:

${existing || "Ninguna"}

Evalúa principalmente:
- valor económico real
- facilidad de conseguir la recompensa
- disponibilidad para usuarios de España
- vigencia
- confianza de la fuente
- claridad de condiciones
- interés comercial para BENIA

Devuelve ÚNICAMENTE JSON válido, sin markdown:

{
  "opportunity": {
    "brand": "nombre",
    "category": "Finanzas | Crypto | Apps | Business | Ofertas",
    "title": "título corto",
    "reward": "recompensa exacta según la fuente",
    "description": "descripción factual breve",
    "score": 0,
    "reason": "explicación breve del score",
    "source_url": "https://...",
    "source_name": "nombre de la fuente",
    "expires_at": "YYYY-MM-DD o null",
    "verification_notes": [
      "dato comprobado",
      "condición importante"
    ]
  }
}

Si no hay una oportunidad suficientemente fiable:

{
  "opportunity": null
}
`;

    const aiResponse = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${openRouterKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://benia.vercel.app",
          "X-Title": "BENIA Scout",
        },
        body: JSON.stringify({
          model: "openrouter/free",

          plugins: [
            {
              id: "web",
              max_results: 8,
              search_prompt:
                "Busca información actual y verificable sobre promociones y programas de referidos. Prioriza fuentes oficiales y fechas recientes.",
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
      const errorText = await aiResponse.text();

      return NextResponse.json(
        {
          error: "OpenRouter error",
          details: errorText,
        },
        { status: 502 }
      );
    }

    const aiData = await aiResponse.json();

    const content =
      aiData?.choices?.[0]?.message?.content;

    if (!content) {
      return NextResponse.json(
        { error: "No response from AI" },
        { status: 502 }
      );
    }

    let analysis;

    try {
      analysis = extractJson(content);
    } catch {
      return NextResponse.json(
        {
          error: "AI returned invalid JSON",
          raw: content,
        },
        { status: 502 }
      );
    }

    const opportunity = analysis?.opportunity;

    if (opportunity) {
      opportunity.score = Math.max(
        0,
        Math.min(100, Number(opportunity.score) || 0)
      );
    }

    return NextResponse.json({
      success: true,
      scout: analysis,
      searched_web: true,
      message: opportunity
        ? "BENIA Scout ha encontrado y analizado una oportunidad web."
        : "BENIA Scout no ha encontrado una oportunidad suficientemente verificable.",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Scout failed",
        details:
          error instanceof Error
            ? error.message
            : "Unknown error",
      },
      { status: 500 }
    );
  }
}
