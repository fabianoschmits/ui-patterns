import type { MetadataRoute } from "next";
import { patterns } from "@/data/patterns";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://uipatterns.dev";
  const pages = ["", "/explore", "/categories", "/favorites"].map((path) => ({ url: baseUrl + path, lastModified: new Date(), changeFrequency: "weekly" as const, priority: path === "" ? 1 : .8 }));
  const patternPages = patterns.map((pattern) => ({ url: baseUrl + "/patterns/" + pattern.slug, lastModified: new Date(pattern.updatedAt), changeFrequency: "monthly" as const, priority: .7 }));
  return [...pages, ...patternPages];
}
