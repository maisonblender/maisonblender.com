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
  const imgPart = parts.find((p) => p.inline_data?.data ?? p.inlineData?.data);

  if (!imgPart) {
    console.error(`❌  No image returned for "${name}". Response: ${JSON.stringify(json).slice(0, 200)}`);
    return;
  }

  const imgData = imgPart.inline_data?.data ?? imgPart.inlineData?.data;
  const buf = Buffer.from(imgData, "base64");
  writeFileSync(outPath, buf);
  console.log(`✅  ${name}.png saved (${Math.round(buf.length / 1024)} KB)`);
}

// Shared visual style applied to every prompt.
// Reference: hero-visual.png and about-visual.png — isometric/flat minimal,
// very light gray background, teal glowing nodes, thin mesh lines, no text.
const STYLE =
  "STYLE: very light gray (#f2f3f5) background, near-white, airy and minimal. " +
  "Isometric or flat 2D illustration. Teal (#4af0c4) glowing circular nodes and accent lines. " +
  "Thin light-gray geometric mesh or triangular network lines. " +
  "Soft drop shadows on 3D elements. Abundant white space. " +
  "Professional Dutch B2B tech aesthetic. Absolutely no text, no labels, no numbers. " +
  "High-contrast teal accents on a pale background only. No dark backgrounds.";

const images = [
  {
    name: "hero-visual",
    aspectRatio: "4:3",
    prompt:
      `${STYLE} SUBJECT: Isometric illustration of an AI agent network — a central server stack on the left connected via glowing teal node clusters to a crystalline AI brain on the right. Triangular mesh lines form a sparse network across the composition. Soft isometric depth on the server and brain objects.`,
  },
  {
    name: "services-flow",
    aspectRatio: "16:9",
    prompt:
      `${STYLE} SUBJECT: Flat workflow diagram — a robot AI icon on the far left connected by teal arrows through 5 sequential circular node modules (chat bubble, gear cog, document, bar chart, lightbulb) to a business person silhouette on the right. Nodes connected by thin geometric lines.`,
  },
  {
    name: "process-steps",
    aspectRatio: "3:2",
    prompt:
      `${STYLE} SUBJECT: Three sequential isometric steps connected by smooth teal curved lines — Step 1: a clipboard with magnifying glass, Step 2: two abstract building blocks with a lightning bolt, Step 3: a rocket launching upward. Teal circular markers at each step junction.`,
  },
  {
    name: "about-visual",
    aspectRatio: "4:3",
    prompt:
      `${STYLE} SUBJECT: The Netherlands province of Limburg as a delicate geographic outline. Small teal glowing circular nodes scattered across the interior representing connectivity. Thin triangular mesh lines connecting the nodes. One larger central node at Sittard. Vast white space around the outline.`,
  },

  // --- Service hero images (3:2) ---
  {
    name: "service-ai-chatbots",
    aspectRatio: "3:2",
    prompt:
      `${STYLE} SUBJECT: Isometric smartphone and desktop screen side by side, each showing a chat interface with floating teal and white chat bubble shapes. Abstract message-flow lines radiate from a central AI brain node to both screens. Sparse triangular mesh in the background.`,
  },
  {
    name: "service-ai-agents",
    aspectRatio: "3:2",
    prompt:
      `${STYLE} SUBJECT: Central glowing teal AI core node dispatching teal connector lines to three floating isometric modules: a document scanner, a cylindrical database, and an email envelope. Each module is a small 3D isometric object with soft shadow. Sparse triangular mesh background.`,
  },
  {
    name: "service-rpa-workflow",
    aspectRatio: "3:2",
    prompt:
      `${STYLE} SUBJECT: Isometric robotic arm connecting three floating software window panels via smooth teal curved lines. Left panel: data table. Center panel: rotating gear. Right panel: green checkmark. Soft isometric depth on each panel. Sparse mesh lines in background.`,
  },
  {
    name: "service-custom-software",
    aspectRatio: "3:2",
    prompt:
      `${STYLE} SUBJECT: Floating isometric laptop showing a modern dashboard UI with teal accent bar charts and modular panel layout. Surrounding the laptop: small API node circles connected by thin lines. Abstract code bracket shapes in the corners of the composition.`,
  },
  {
    name: "service-data-intelligence",
    aspectRatio: "3:2",
    prompt:
      `${STYLE} SUBJECT: Central isometric database cylinder with teal glow radiating thin lines to three floating analytics panels: a rising bar chart, a circular donut chart, and a line trend graph. All panels are flat 2D cards with teal accent highlights. Sparse triangular mesh.`,
  },
  {
    name: "service-ai-strategy",
    aspectRatio: "3:2",
    prompt:
      `${STYLE} SUBJECT: Isometric compass or unfolding roadmap on a flat surface with small teal glowing milestone nodes along a path. A magnifying glass with an AI circuit pattern hovers above the roadmap. Sparse triangular mesh lines extending from the milestone nodes.`,
  },

  // --- Feature visuals ---
  {
    name: "sessies-visual",
    aspectRatio: "4:3",
    prompt:
      `${STYLE} SUBJECT: Two abstract professional silhouettes at an isometric desk with a laptop. Teal workflow lines flow from the laptop to three floating node icons: a gear, a document, and a checkmark. Sparse triangular mesh in background. Warm yet minimal.`,
  },
  {
    name: "sessies-steps",
    aspectRatio: "3:2",
    prompt:
      `${STYLE} SUBJECT: Three sequential flat steps connected by smooth teal curved lines — Step 1: a briefing clipboard with magnifying glass, Step 2: two abstract figures at a laptop with AI spark nodes, Step 3: a launch arrow with teal checkmark. Teal circular markers at each junction.`,
  },
  {
    name: "brand-ambassador-visual",
    aspectRatio: "4:3",
    prompt:
      `${STYLE} SUBJECT: Isometric smartphone and desktop screen side by side, each displaying a branded chat window with a circular company avatar icon and floating teal and white chat bubbles. Abstract neural connection lines radiate from a central teal AI core node between the screens.`,
  },
  {
    name: "labs-hero",
    aspectRatio: "16:9",
    prompt:
      `${STYLE} SUBJECT: The Netherlands province of Limburg as a delicate geographic outline centered in the composition. Small teal glowing circular nodes represent connected towns and communities. Thin triangular mesh lines form a sparse network across the region. One prominent central node. Vast white space surrounding the outline.`,
  },
];

console.log(`\n🎨  Maison Blender image generator`);
console.log(`📁  Output → public/images/\n`);

for (const img of images) {
  await generateImage(img.name, img.prompt, img.aspectRatio);
  await new Promise((r) => setTimeout(r, 1200)); // avoid rate limits
}

console.log(`\n✓  Image generation complete.\n`);
