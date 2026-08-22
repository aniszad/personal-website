import type { MetadataRoute } from "next";
import { PAGES, SITE } from "@/lib/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const sectionRoutes = PAGES.map((page) => ({
    url: `${SITE.url}${page.href}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: SITE.url,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1,
    },
    ...sectionRoutes,
  ];
}
