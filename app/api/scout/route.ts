import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    const secret = process.env.SCOUT_SECRET;

    if (secret && authHeader !== `Bearer ${secret}`) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const openRouterKey = process.env.OPENROUTER_API_KEY;

    if (!openRouterKey) {
      return NextResponse.json(
        { error: "Missing OPENROUTER_API_KEY" },
        { status: 500 }
      );
    }

    const prompt = `
Eres BENIA SCOUT, un analista de oportunidades financieras y digitales.

Tu trabajo es identificar oportunidades potencialmente interesantes para usuarios de España.

Busca y analiza oportunidades como:
- cuentas bancarias
- fintech
- crypto
- exchanges
- cashback
- apps
- herramientas Business
- bonos de bienvenida
- programas de referidos
- promociones temporales

IMPORTANTE:
No inventes promociones, recompensas, enlaces ni condiciones.

Para esta primera prueba analiza conceptualmente qué características debería tener una buena oportunidad BENIA.

Devuelve únicamente JSON válido con esta estructura:

{
  "opportunity": {
    "brand": "nombre",
    "category": "Finanzas",
    "title": "título",
    "reward": "recompensa",
    "description": "descripción",
    "score": 0,
    "reason": "motivo del score"
  }
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
      analysis = JSON.parse(content);
    } catch {
      return NextResponse.json(
        {
          error: "AI returned invalid JSON",
          raw: content,
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      scout: analysis,
      message:
        "BENIA Scout ha analizado correctamente la oportunidad.",
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
