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

  return [
    {
      url: "https://maisonblender.com",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    ...servicePages,
    ...tagPageEntries,
  ];
}
