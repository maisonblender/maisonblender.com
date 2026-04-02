/**
 * Maison Blender — AI Image Generator
 *
 * Generates site visuals using Google Gemini image generation API.
 * Saves PNG files to public/images/ — Next.js serves them statically.
 *
 * Runs automatically during `next build` when GEMINI_API_KEY is set.
 * To regenerate images, set REGENERATE_IMAGES=true alongside the API key.
 *
 * Local usage:
 *   GEMINI_API_KEY=xxx node scripts/generate-images.mjs
 */

import { writeFileSync, mkdirSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = resolve(__dirname, "../public/images");

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const REGENERATE = process.env.REGENERATE_IMAGES === "true";

if (!GEMINI_API_KEY) {
  console.log("ℹ️  GEMINI_API_KEY not set — skipping image generation.");
  process.exit(0);
}

mkdirSync(OUT_DIR, { recursive: true });

const ENDPOINT =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-image-preview:generateContent";

async function generateImage(name, prompt, aspectRatio = "16:9") {
  const outPath = resolve(OUT_DIR, `${name}.png`);

  if (!REGENERATE && existsSync(outPath)) {
    console.log(`⏭️  Skipping ${name}.png (already exists, set REGENERATE_IMAGES=true to force)`);
    return;
  }

  console.log(`⏳  Generating: ${name}.png …`);

  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "x-goog-api-key": GEMINI_API_KEY,
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
    console.error(`❌  Gemini API error ${res.status} for "${name}":\n${err}`);
    return;
  }

  const json = await res.json();
  const parts = json?.candidates?.[0]?.content?.parts ?? [];
  const imgPart = parts.find((p) => p.inline_data?.data);

  if (!imgPart) {
    console.error(`❌  No image returned for "${name}". Response: ${JSON.stringify(json).slice(0, 200)}`);
    return;
  }

  const buf = Buffer.from(imgPart.inline_data.data, "base64");
  writeFileSync(outPath, buf);
  console.log(`✅  ${name}.png saved (${Math.round(buf.length / 1024)} KB)`);
}

const images = [
  {
    name: "hero-visual",
    aspectRatio: "4:3",
    prompt:
      "Minimalist isometric illustration of an AI agent network — interconnected glowing teal nodes on a clean light gray (#f2f3f5) background. Abstract data flows between stylized server and brain icons. Professional Dutch B2B tech aesthetic. No text. Soft shadows, lots of white space. Hero section visual for an AI automation agency.",
  },
  {
    name: "services-flow",
    aspectRatio: "16:9",
    prompt:
      "Clean flat-design workflow diagram: a robot AI icon on the left sends data through 5 connected modules (chat bubble, gear cog, document, bar chart, lightbulb) to a satisfied business person on the right. Light gray (#f2f3f5) background, teal (#4af0c4) accent arrows. Professional, minimal, no text labels.",
  },
  {
    name: "process-steps",
    aspectRatio: "3:2",
    prompt:
      "Minimal flat infographic showing 3 sequential steps connected by smooth curved lines: Step 1 blueprint with magnifying glass, Step 2 building blocks with lightning bolt, Step 3 rocket launching upward. Light off-white background, teal circular step markers, subtle drop shadows. Professional B2B style, no text.",
  },
  {
    name: "about-visual",
    aspectRatio: "4:3",
    prompt:
      "Elegant minimal illustration of the Netherlands province of Limburg as a subtle geographic outline with small glowing teal dot nodes scattered across it representing AI connectivity and digital infrastructure. Very light, mostly white space, delicate contour lines, professional and understated. Suitable as a company section background element. No text.",
  },
];

console.log(`\n🎨  Maison Blender image generator`);
console.log(`📁  Output → public/images/\n`);

for (const img of images) {
  await generateImage(img.name, img.prompt, img.aspectRatio);
  await new Promise((r) => setTimeout(r, 1200)); // avoid rate limits
}

console.log(`\n✓  Image generation complete.\n`);
