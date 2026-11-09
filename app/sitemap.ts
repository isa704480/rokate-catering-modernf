import type { MetadataRoute } from "next";
import { href, SITE_URL } from "@/lib/site";
import { SERVICE_SLUGS } from "@/lib/api";

export const dynamic = "force-static";

/** Sayt xaritasi. Sahifalar ro'yxati kodda — CMS'da yangi sahifa yaratilmaydi. */
const PATHS = [
  "/",
  "/menu",
  "/partners",
  ...SERVICE_SLUGS.map((s) => `/catering/${s}`),
  "/privacy",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const updated = new Date().toISOString();
  return PATHS.map((path) => ({
    url: `${SITE_URL}${href("en", path)}`,
    lastModified: updated,
    alternates: {
      languages: {
        en: `${SITE_URL}${href("en", path)}`,
        ru: `${SITE_URL}${href("ru", path)}`,
      },
    },
  }));
}
