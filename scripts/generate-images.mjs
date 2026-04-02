/**
 * Maison Blender — AI Image Generator
 *
 * Generates site visuals using Google Gemini image generation API.
 * Saves PNG files to public/images/ — commit them to git so Vercel
 * can serve them statically without needing a runtime API key.
 *
 * Usage:
 *   1. Add GEMINI_API_KEY=your_key to .env.local
 *   2. npm run generate-images
 *   3. git add public/images && git commit -m "Update generated images"
 *   4. git push
 */

import { writeFileSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = resolve(__dirname, "../public/images");

// Load .env.local
const envPath = resolve(__dirname, "../.env.local");
try {
  const { readFileSync } = await import("fs");
  const env = readFileSync(envPath, "utf-8");
  for (const line of env.split("\n")) {
    const [key, ...rest] = line.split("=");
    if (key && rest.length) process.env[key.trim()] = rest.join("=").trim();
  }
} catch {
  // .env.local may not exist in CI; rely on environment variables
}

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
  console.error("❌  GEMINI_API_KEY not set. Add it to .env.local");
  process.exit(1);
}

mkdirSync(OUT_DIR, { recursive: true });

const ENDPOINT =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-image-preview:generateContent";

async function generateImage(name, prompt, aspectRatio = "16:9") {
  console.log(`\n⏳  Generating: ${name}`);

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
    throw new Error(`Gemini API error ${res.status}: ${err}`);
  }

  const json = await res.json();
  const parts = json?.candidates?.[0]?.content?.parts ?? [];
  const imgPart = parts.find((p) => p.inline_data?.data);

  if (!imgPart) {
    throw new Error(`No image in response for "${name}": ${JSON.stringify(json)}`);
  }

  const buf = Buffer.from(imgPart.inline_data.data, "base64");
  const outPath = resolve(OUT_DIR, `${name}.png`);
  writeFileSync(outPath, buf);
  console.log(`✅  Saved: public/images/${name}.png (${Math.round(buf.length / 1024)}KB)`);
}

const images = [
  {
    name: "hero-visual",
    aspectRatio: "4:3",
    prompt:
      "Minimalist isometric illustration of an AI agent network — interconnected nodes with glowing teal (#4af0c4) lines on a clean white/light gray background. Abstract data flows between stylized server icons and brain-like clusters. Professional Dutch B2B tech aesthetic. No text, no labels. Soft shadows, lots of white space. Suitable as hero section visual for an AI automation agency website.",
  },
  {
    name: "services-flow",
    aspectRatio: "16:9",
    prompt:
      "Clean technical diagram showing a workflow automation pipeline: a robot/AI icon on the left sending data through interconnected modules (chat bubble, gear, document, chart) to a happy customer icon on the right. Flat design, light background (#f2f3f5), teal (#4af0c4) accent arrows and highlights. Minimal, professional, suitable for a B2B AI agency. No text labels.",
  },
  {
    name: "process-steps",
    aspectRatio: "3:2",
    prompt:
      "Minimal infographic showing 3 steps connected by smooth flowing lines: (1) magnifying glass over a blueprint — strategy (2) lightning bolt building blocks — prototype (3) rocket launch with upward arrow — scale. Clean flat illustration, light cream/gray background, teal accent color, soft drop shadows. Professional, modern, no text labels.",
  },
  {
    name: "about-visual",
    aspectRatio: "4:3",
    prompt:
      "Subtle abstract illustration of the Zuid-Limburg Netherlands region represented as an elegant minimalist map or geographic contour lines, with small glowing teal node dots scattered across it representing AI connectivity. Clean, professional, very light background, mostly white space. Suitable as a background element for an about/company section. No text.",
  },
];

console.log(`\n🎨  Generating ${images.length} images for maisonblender.com`);
console.log(`📁  Output: public/images/\n`);

let success = 0;
for (const img of images) {
  try {
    await generateImage(img.name, img.prompt, img.aspectRatio);
    success++;
    // Small delay to avoid rate limits
    await new Promise((r) => setTimeout(r, 1500));
  } catch (err) {
    console.error(`❌  Failed ${img.name}: ${err.message}`);
  }
}

console.log(`\n🏁  Done: ${success}/${images.length} images generated`);
console.log(`\nNext steps:`);
console.log(`  git add public/images`);
console.log(`  git commit -m "Add AI-generated site visuals"`);
console.log(`  git push`);
