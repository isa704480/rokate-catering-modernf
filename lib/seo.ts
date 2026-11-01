import type { Metadata } from "next";
import { doc, LOCALES, type Locale } from "./content";
import type { Settings, Seo } from "./types";

/**
 * Har bir sahifa uchun Title, Description, canonical, hreflang va Open Graph.
 * Matnlar content/seo.json da — Roman ularni CMS orqali o'zgartira oladi.
 */
export function pageMeta(key: keyof Seo | string, locale: Locale, path = "/"): Metadata {
  const settings = doc<Settings>("settings", locale);
  const seo = doc<Seo>("seo", locale);
  const entry = seo[key] ?? seo.home;
  const base = settings.siteUrl.replace(/\/$/, "");
  const url = `${base}/${locale}${path === "/" ? "" : path}`;

  const languages: Record<string, string> = {};
  for (const l of LOCALES) languages[l] = `${base}/${l}${path === "/" ? "" : path}`;
  languages["x-default"] = languages.en;

  return {
    metadataBase: new URL(base),
    title: entry.title,
    description: entry.description,
    alternates: { canonical: url, languages },
    openGraph: {
      type: "website",
      siteName: "Rokate Catering",
      title: entry.title,
      description: entry.description,
      url,
      locale: locale === "ru" ? "ru_RU" : "en_US",
      images: [{ url: `${base}/media/yacht-deck-table__w1500.webp`, width: 1500, height: 2000, alt: "Rokate Catering" }],
    },
    twitter: { card: "summary_large_image", title: entry.title, description: entry.description },
    robots: { index: true, follow: true },
  };
}
