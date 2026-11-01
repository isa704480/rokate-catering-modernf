import type { MetadataRoute } from "next";
import { doc, LOCALES } from "@/lib/content";
import type { Settings } from "@/lib/types";

export const dynamic = "force-static";

/** Ikkala til uchun umumiy sitemap, hreflang havolalari bilan. */
export default function sitemap(): MetadataRoute.Sitemap {
  const settings = doc<Settings>("settings", "en");
  const base = settings.siteUrl.replace(/\/$/, "");

  const paths = [
    { path: "", priority: 1 },
    { path: "/yacht-catering", priority: 0.9 },
    { path: "/corporate-catering", priority: 0.9 },
    { path: "/menu", priority: 0.8 },
    { path: "/partners", priority: 0.5 },
  ];

  const now = new Date();

  return paths.flatMap(({ path, priority }) =>
    LOCALES.map((locale) => ({
      url: `${base}/${locale}${path}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority,
      alternates: {
        languages: Object.fromEntries([
          ...LOCALES.map((l) => [l, `${base}/${l}${path}`]),
          ["x-default", `${base}/en${path}`],
        ]),
      },
    }))
  );
}
