/**
 * Admin route: generates site images using Gemini and returns them as downloadable files.
 * Protected by ADMIN_SECRET env var.
 *
 * Usage: GET /api/admin/generate-images?secret=YOUR_ADMIN_SECRET&name=hero-visual
 * Or:    GET /api/admin/generate-images?secret=YOUR_ADMIN_SECRET  (returns all as JSON)
 */

const ENDPOINT =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-image-preview:generateContent";

const IMAGES = [
  {
    name: "hero-visual",
    aspectRatio: "4:3",
    prompt:
      "Minimalist isometric illustration of an AI agent network - interconnected glowing teal nodes on a clean light gray background. Abstract data flows between stylized server and brain icons. Professional Dutch B2B tech aesthetic. No text. Soft shadows, lots of white space.",
  },
  {
    name: "services-flow",
    aspectRatio: "16:9",
    prompt:
      "Clean flat-design workflow diagram: a robot AI icon on the left sends data through 5 connected modules (chat bubble, gear, document, bar chart, lightbulb) to a business person on the right. Light gray background, teal accent arrows. Professional, minimal, no text.",
  },
  {
    name: "process-steps",
    aspectRatio: "3:2",
    prompt:
      "Minimal flat infographic showing 3 sequential steps connected by curved lines: Step 1 blueprint with magnifying glass, Step 2 building blocks with lightning bolt, Step 3 rocket launching upward. Light background, teal circular markers, subtle shadows. No text.",
  },
  {
    name: "about-visual",
    aspectRatio: "4:3",
    prompt:
      "Elegant minimal illustration of the Netherlands province of Limburg as a subtle geographic outline with small glowing teal node dots scattered across it representing AI connectivity. Very light, mostly white space, delicate contour lines. No text.",
  },
];

async function generateOne(name: string, prompt: string, aspectRatio: string, apiKey: string) {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "x-goog-api-key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseModalities: ["IMAGE"],
        imageConfig: { aspectRatio, imageSize: "2K" },
      },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    return { name, error: `HTTP ${res.status}: ${err.slice(0, 300)}` };
  }

  const json = await res.json() as { candidates?: { content?: { parts?: { inline_data?: { data: string; mime_type: string } }[] } }[] };
  const parts = json?.candidates?.[0]?.content?.parts ?? [];
  const imgPart = parts.find((p) => p.inline_data?.data);

  if (!imgPart?.inline_data) {
    return { name, error: `No image in response: ${JSON.stringify(json).slice(0, 200)}` };
  }

  return { name, data: imgPart.inline_data.data, mime: imgPart.inline_data.mime_type };
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const secret = url.searchParams.get("secret");
  const specificName = url.searchParams.get("name");

  const adminSecret = process.env.ADMIN_SECRET;
  const geminiKey = process.env.GEMINI_API_KEY;

  // Auth check
  if (!adminSecret || secret !== adminSecret) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!geminiKey) {
    return new Response(JSON.stringify({ error: "GEMINI_API_KEY not configured on this server" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const targets = specificName
    ? IMAGES.filter((img) => img.name === specificName)
    : IMAGES;

  if (targets.length === 0) {
    return new Response(JSON.stringify({ error: `Unknown image name: ${specificName}` }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // If single image requested, return as PNG download
  if (specificName && targets.length === 1) {
    const result = await generateOne(targets[0].name, targets[0].prompt, targets[0].aspectRatio, geminiKey);
    if ("error" in result) {
      return new Response(JSON.stringify({ error: result.error }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
    const buf = Buffer.from(result.data!, "base64");
    return new Response(buf, {
      headers: {
        "Content-Type": result.mime ?? "image/png",
        "Content-Disposition": `attachment; filename="${specificName}.png"`,
      },
    });
  }

  // Multiple images: return JSON with base64 data + preview HTML
  const accept = request.headers.get("accept") ?? "";
  const results = [];
  for (const img of targets) {
    const result = await generateOne(img.name, img.prompt, img.aspectRatio, geminiKey);
    results.push(result);
    await new Promise((r) => setTimeout(r, 1000));
  }

  if (accept.includes("text/html")) {
    const html = `<!DOCTYPE html>
<html lang="nl">
<head><meta charset="utf-8"><title>Generated Images</title>
<style>body{font-family:sans-serif;padding:2rem;background:#f2f3f5}
img{max-width:100%;border-radius:8px;border:1px solid #ddd}
.img-block{margin-bottom:2rem;background:white;padding:1rem;border-radius:8px}
h2{font-size:1rem;margin:0 0 .5rem}a{display:inline-block;margin-top:.5rem;color:#0a7a5c}</style>
</head><body>
<h1>Gegenereerde afbeeldingen</h1>
<p>Sla elke afbeelding op als <code>public/images/NAAM.png</code> en commit naar git.</p>
${results.map((r) => "error" in r
  ? `<div class="img-block"><h2>${r.name}</h2><p style="color:red">Fout: ${r.error}</p></div>`
  : `<div class="img-block"><h2>${r.name}.png</h2>
     <img src="data:${r.mime};base64,${r.data}" alt="${r.name}">
     <br><a href="/api/admin/generate-images?secret=${secret}&name=${r.name}" download="${r.name}.png">⬇ Download ${r.name}.png</a>
     </div>`
).join("")}
</body></html>`;
    return new Response(html, { headers: { "Content-Type": "text/html" } });
  }

  return new Response(
    JSON.stringify(results.map((r) => ("error" in r ? { name: r.name, error: r.error } : { name: r.name, size: r.data!.length }))),
    { headers: { "Content-Type": "application/json" } }
  );
}
