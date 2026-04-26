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

// Shared visual style — MUST match hero-visual.png and about-visual.png exactly.
// Key traits: near-white background, sparse triangular mesh lines, teal glowing
// circular nodes, isometric 3D objects with soft shadows, extreme minimalism.
// NO cartoon style. NO colorful icons. NO dark backgrounds. NO text.
const STYLE =
  "STYLE: near-white (#f2f3f5) background. Sparse thin light-gray triangular mesh lines. " +
  "Small teal (#4af0c4) glowing circular nodes at mesh intersections. " +
  "Isometric 3D objects in light gray/white with teal accents and very soft drop shadows. " +
  "Extreme minimalism — maximum white space, understated, clinical precision. " +
  "NO cartoon style. NO flat colorful icons. NO gradients. NO dark elements. NO text. " +
  "Match the exact visual DNA of a minimal tech infographic: server+brain+network style.";

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
      `${STYLE} SUBJECT: Horizontal isometric workflow — 7 small teal glowing circular nodes in a straight line connected by thin gray lines, with a minimal isometric AI core shape on the far left and an abstract human silhouette outline on the far right. Pure mesh-and-node aesthetic. No boxes, no arrows, no icons.`,
  },
  {
    name: "process-steps",
    aspectRatio: "3:2",
    prompt:
      `${STYLE} SUBJECT: Three isometric 3D platforms or surfaces arranged diagonally, connected by thin teal curved lines. Each platform holds one minimal isometric object: platform 1 a small clipboard shape, platform 2 a gear shape, platform 3 a small rocket shape. Triangular mesh lines radiate from each platform. Teal node at each connection point.`,
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
      `${STYLE} SUBJECT: Three isometric 3D interface panels floating in space, connected by thin teal lines. Each panel is a minimal gray-white floating surface with one small teal accent shape: left panel a grid pattern, center panel a circular gear outline, right panel a checkmark outline. Triangular mesh lines extend from the panels. No robot arm, no cartoon elements.`,
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
