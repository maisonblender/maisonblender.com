import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);

  if (!body || !body.naam || !body.email || !body.bericht) {
    return Response.json({ error: "Vul alle verplichte velden in." }, { status: 400 });
  }

  const { naam, bedrijf, email, bericht } = body as {
    naam: string;
    bedrijf?: string;
    email: string;
    bericht: string;
  };

  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    // Fallback: log to console in dev, still return success to user
    console.log("Contact form submission (no RESEND_API_KEY set):", { naam, bedrijf, email, bericht });
    return Response.json({ ok: true });
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "website@maisonblender.com",
      to: ["info@maisonblender.com"],
      reply_to: email,
      subject: `Nieuw contactformulier: ${naam}${bedrijf ? ` (${bedrijf})` : ""}`,
      text: `Naam: ${naam}\nBedrijf: ${bedrijf ?? "-"}\nE-mail: ${email}\n\nBericht:\n${bericht}`,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    console.error("Resend error:", err);
    return Response.json({ error: "Verzenden mislukt. Probeer het later opnieuw." }, { status: 502 });
  }

  return Response.json({ ok: true });
}
