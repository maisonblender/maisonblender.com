import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

// System prompt: AI business consultant for Southern Limburg companies
const SYSTEM_PROMPT = `Je bent een AI-adviseur van Maison Blender, het toonaangevende AI-bureau van Zuid-Limburg, Nederland. Je helpt ondernemers en bedrijven in de regio begrijpen hoe AI hun bedrijf kan transformeren.

Je stijl:
- Concreet en praktisch: geef altijd specifieke, actionable voorbeelden
- Regionaal relevant: noem voorbeelden die relevant zijn voor Zuid-Limburgse bedrijven (horeca, retail, MKB, maakindustrie, zorg, logistiek)
- Inspirerend maar realistisch: toon de echte mogelijkheden zonder beloftes te overdrijven
- Beknopt: max 3-4 alinea's, gebruik bullets voor concrete punten

Maison Blender bouwt: custom AI-agents, workflow-automatisering, RAG-systemen, MCP-servers, data-integraties. Onze klanten besparen gemiddeld 40+ uur per week.

Eindig altijd met een uitnodiging om contact op te nemen voor een gratis strategiegesprek.`;

export async function POST(request: Request) {
  const { messages } = await request.json();

  const stream = client.messages.stream({
    // Using Haiku for low-latency, cost-effective public demo
    model: "claude-haiku-4-5",
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages,
  });

  const readableStream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      try {
        for await (const event of stream) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
      } finally {
        controller.close();
      }
    },
  });

  return new Response(readableStream, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
