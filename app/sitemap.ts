import type { MetadataRoute } from "next";
import { services } from "@/lib/services";
import { tagPages } from "@/lib/tag-pages";

export default function sitemap(): MetadataRoute.Sitemap {
  const servicePages: MetadataRoute.Sitemap = services.map((s) => ({
    url: `https://maisonblender.com/diensten/${s.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const tagPageEntries: MetadataRoute.Sitemap = tagPages.map((t) => ({
    url: `https://maisonblender.com/diensten/${t.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const staticPages: MetadataRoute.Sitemap = [
    { url: "https://maisonblender.com", lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
    { url: "https://maisonblender.com/quickscan", lastModified: new Date(), changeFrequency: "monthly", priority: 0.85 },
    { url: "https://maisonblender.com/strategiegesprek", lastModified: new Date(), changeFrequency: "monthly", priority: 0.85 },
    { url: "https://maisonblender.com/brand-ambassador", lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: "https://maisonblender.com/privacybeleid", lastModified: new Date(), changeFrequency: "yearly", priority: 0.5 },
    { url: "https://maisonblender.com/eu-ai-act", lastModified: new Date(), changeFrequency: "yearly", priority: 0.5 },
    { url: "https://maisonblender.com/toegankelijkheidsaudit", lastModified: new Date(), changeFrequency: "monthly", priority: 0.75 },
    { url: "https://maisonblender.com/toegankelijkheidsverklaring", lastModified: new Date(), changeFrequency: "yearly", priority: 0.6 },
    { url: "https://maisonblender.com/labs", lastModified: new Date(), changeFrequency: "weekly", priority: 0.75 },
    { url: "https://maisonblender.com/labs/tools-vergelijker", lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: "https://maisonblender.com/labs/prompt-starter-kit", lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: "https://maisonblender.com/labs/kennisbank", lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
  ];

  return [...staticPages, ...servicePages, ...tagPageEntries];
}
