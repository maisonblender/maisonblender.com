/**
 * Admin route: generates site images using Gemini and returns them as downloadable files.
 * Protected by ADMIN_SECRET env var, verzonden via de `x-admin-secret` header
 * (NIET via query string — dat zou in Vercel-logs en browser history terechtkomen).
 *
 * Usage:
 *   curl -H "x-admin-secret: $ADMIN_SECRET" \
 *     "https://maisonblender.com/api/admin/generate-images?name=hero-visual" \
 *     -o hero-visual.png
 *
 *   # Of voor de HTML preview met alle images:
 *   curl -H "x-admin-secret: $ADMIN_SECRET" -H "Accept: text/html" \
 *     "https://maisonblender.com/api/admin/generate-images" > preview.html
 */

import { timingSafeEqual } from "node:crypto";
import { escapeHtml } from "@/lib/security/escape";

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

/**
 * Constant-time string compare ter voorkoming van timing attacks die
 * kunnen onthullen hoe veel chars van het secret correct zijn.
 */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  try {
    return timingSafeEqual(Buffer.from(a), Buffer.from(b));
  } catch {
    return false;
  }
}

function unauthorized(): Response {
  return new Response(JSON.stringify({ error: "Unauthorized" }), {
    status: 401,
    headers: {
      "Content-Type": "application/json",
      // Hint voor de client dat hij een header moet sturen, geen query param
      "WWW-Authenticate": 'Header realm="admin", param="x-admin-secret"',
    },
  });
}

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
  const adminSecret = process.env.ADMIN_SECRET;
  const geminiKey = process.env.GEMINI_API_KEY;

  if (!adminSecret) return unauthorized();

  // Auth via header — query-string secrets lekken in access-logs en Referer.
  const provided = request.headers.get("x-admin-secret") ?? "";
  if (!safeEqual(provided, adminSecret)) return unauthorized();

  if (!geminiKey) {
    return new Response(JSON.stringify({ error: "GEMINI_API_KEY not configured on this server" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const url = new URL(request.url);
  const specificName = url.searchParams.get("name");

  const targets = specificName
    ? IMAGES.filter((img) => img.name === specificName)
    : IMAGES;

  if (targets.length === 0) {
    return new Response(JSON.stringify({ error: `Unknown image name: ${specificName}` }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Single image → direct download
  if (specificName && targets.length === 1) {
    const result = await generateOne(targets[0].name, targets[0].prompt, targets[0].aspectRatio, geminiKey);
    if ("error" in result) {
      return new Response(JSON.stringify({ error: result.error }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
    const buf = Buffer.from(result.data!, "base64");
    return new Response(new Uint8Array(buf), {
      headers: {
        "Content-Type": result.mime ?? "image/png",
        "Content-Disposition": `attachment; filename="${specificName}.png"`,
      },
    });
  }

  // Multiple → JSON of HTML preview
  const accept = request.headers.get("accept") ?? "";
  const results = [];
  for (const img of targets) {
    const result = await generateOne(img.name, img.prompt, img.aspectRatio, geminiKey);
    results.push(result);
    await new Promise((r) => setTimeout(r, 1000));
  }

  if (accept.includes("text/html")) {
    // BELANGRIJK: in de download-links verwijzen we naar dezelfde admin route,
    // maar zonder het secret in de URL. De gebruiker (browser) moet de header
    // zelf meesturen via een fetch + blob download (zie helper-script onderaan).
    // Op die manier komt het secret nooit in de browser-history of access-logs.
    const html = `<!DOCTYPE html>
<html lang="nl">
<head><meta charset="utf-8"><title>Generated Images</title>
<style>body{font-family:sans-serif;padding:2rem;background:#f2f3f5;max-width:900px;margin:0 auto}
img{max-width:100%;border-radius:8px;border:1px solid #ddd}
.img-block{margin-bottom:2rem;background:white;padding:1rem;border-radius:8px}
h2{font-size:1rem;margin:0 0 .5rem}
button{margin-top:.5rem;color:#0a7a5c;background:#fff;border:1px solid #0a7a5c;padding:.4rem .8rem;border-radius:6px;cursor:pointer;font:inherit}
button:hover{background:#0a7a5c;color:#fff}
.note{background:#fff3cd;border:1px solid #ffeaa7;padding:.6rem .8rem;border-radius:6px;font-size:.85rem;margin-bottom:1rem;color:#856404}</style>
</head><body>
<h1>Gegenereerde afbeeldingen</h1>
<p>Sla elke afbeelding op als <code>public/images/NAAM.png</code> en commit naar git.</p>
<div class="note">Voor download moet je het admin-secret nogmaals invoeren — het wordt niet in de URL meegestuurd om logs en browser-history schoon te houden.</div>
${results.map((r) => "error" in r
  ? `<div class="img-block"><h2>${escapeHtml(r.name)}</h2><p style="color:red">Fout: ${escapeHtml(r.error)}</p></div>`
  : `<div class="img-block"><h2>${escapeHtml(r.name)}.png</h2>
     <img src="data:${escapeHtml(r.mime ?? "image/png")};base64,${escapeHtml(r.data ?? "")}" alt="${escapeHtml(r.name)}">
     <br><button data-name="${escapeHtml(r.name)}">⬇ Download ${escapeHtml(r.name)}.png</button>
     </div>`
).join("")}
<script>
document.querySelectorAll('button[data-name]').forEach((btn) => {
  btn.addEventListener('click', async () => {
    const name = btn.getAttribute('data-name');
    const secret = window.prompt('Admin secret:');
    if (!secret) return;
    btn.disabled = true;
    btn.textContent = 'Downloading...';
    try {
      const res = await fetch('/api/admin/generate-images?name=' + encodeURIComponent(name), {
        headers: { 'x-admin-secret': secret },
      });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = name + '.png';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      btn.textContent = '✓ Gedownload — opnieuw';
    } catch (e) {
      btn.textContent = '✗ Fout: ' + (e instanceof Error ? e.message : String(e));
    } finally {
      btn.disabled = false;
    }
  });
});
</script>
</body></html>`;
    return new Response(html, { headers: { "Content-Type": "text/html" } });
  }

  return new Response(
    JSON.stringify(results.map((r) => ("error" in r ? { name: r.name, error: r.error } : { name: r.name, size: r.data!.length }))),
    { headers: { "Content-Type": "application/json" } }
  );
}
