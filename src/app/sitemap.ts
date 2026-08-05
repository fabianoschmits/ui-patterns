import type { MetadataRoute } from "next";
import { patterns } from "@/data/patterns";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://uipatterns.dev";
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...patterns.map((pattern) => ({
      url: baseUrl + "/patterns/" + pattern.slug,
      lastModified: new Date(pattern.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
