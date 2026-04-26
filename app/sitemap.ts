// File: app/sitemap.ts
// Purpose: Dynamische sitemap voor maisonblender.com.
// Wordt door Next.js geserveerd op /sitemap.xml.
//
// Bronnen (single source of truth):
//   - lib/services.ts        → /diensten/[slug] (hoofd-diensten)
//   - lib/tag-pages.ts       → /diensten/[slug] (tag/long-tail pagina's)
//   - lib/kennisbank.ts      → /labs/kennisbank/[slug] (artikelen)
//
// Statische pagina's staan onderaan in `staticPages`. `BUILD_TIME` zorgt dat
// `lastModified` één waarde per build krijgt (i.p.v. een nieuwe Date per request),
// wat caching en SEO-signalen consistent houdt.

import type { MetadataRoute } from "next";
import { services } from "@/lib/services";
import { tagPages } from "@/lib/tag-pages";
import { kennisbankPosts, lastModifiedDate } from "@/lib/kennisbank";

const SITE_URL = "https://maisonblender.com";
const BUILD_TIME = new Date();

export default function sitemap(): MetadataRoute.Sitemap {
  const servicePages: MetadataRoute.Sitemap = services.map((s) => ({
    url: `${SITE_URL}/diensten/${s.slug}`,
    lastModified: BUILD_TIME,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const tagPageEntries: MetadataRoute.Sitemap = tagPages.map((t) => ({
    url: `${SITE_URL}/diensten/${t.slug}`,
    lastModified: BUILD_TIME,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const kennisbankEntries: MetadataRoute.Sitemap = kennisbankPosts.map((p) => ({
    url: `${SITE_URL}/labs/kennisbank/${p.slug}`,
    lastModified: lastModifiedDate(p),
    changeFrequency: "monthly",
    priority: 0.65,
  }));

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}`, lastModified: BUILD_TIME, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/quickscan`, lastModified: BUILD_TIME, changeFrequency: "monthly", priority: 0.85 },
    { url: `${SITE_URL}/strategiegesprek`, lastModified: BUILD_TIME, changeFrequency: "monthly", priority: 0.85 },
    { url: `${SITE_URL}/brand-ambassador`, lastModified: BUILD_TIME, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/studio`, lastModified: BUILD_TIME, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/team`, lastModified: BUILD_TIME, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/toegankelijkheidsaudit`, lastModified: BUILD_TIME, changeFrequency: "monthly", priority: 0.75 },
    { url: `${SITE_URL}/labs`, lastModified: BUILD_TIME, changeFrequency: "weekly", priority: 0.75 },
    { url: `${SITE_URL}/labs/kennisbank`, lastModified: BUILD_TIME, changeFrequency: "weekly", priority: 0.75 },
    { url: `${SITE_URL}/labs/tools-vergelijker`, lastModified: BUILD_TIME, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/labs/prompt-starter-kit`, lastModified: BUILD_TIME, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/labs/nieuwsbrief`, lastModified: BUILD_TIME, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/labs/webinar`, lastModified: BUILD_TIME, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/eu-ai-act`, lastModified: BUILD_TIME, changeFrequency: "yearly", priority: 0.5 },
    { url: `${SITE_URL}/privacybeleid`, lastModified: BUILD_TIME, changeFrequency: "yearly", priority: 0.5 },
    { url: `${SITE_URL}/toegankelijkheidsverklaring`, lastModified: BUILD_TIME, changeFrequency: "yearly", priority: 0.6 },
  ];

  return [...staticPages, ...servicePages, ...tagPageEntries, ...kennisbankEntries];
}
