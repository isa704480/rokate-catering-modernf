import type { Metadata } from "next";
import { absolute, href, SITE_URL } from "./site";
import type { Locale, Seo, SiteData } from "./types";

/** Har bir sahifa uchun metadata: title, description, canonical, hreflang, Open Graph. */
export function buildMeta(locale: Locale, path: string, seo: Partial<Seo> | null, site: SiteData | null, fallbackTitle = ""): Metadata {
  const title = seo?.title || fallbackTitle || site?.seo.title || "Rokate Catering";
  const description = seo?.description || site?.seo.description || "";
  const image = seo?.image?.src || site?.seo.image?.src;
  const url = `${SITE_URL}${href(locale, path)}`;
  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: { en: `${SITE_URL}${href("en", path)}`, ru: `${SITE_URL}${href("ru", path)}`, "x-default": `${SITE_URL}${href("en", path)}` },
    },
    openGraph: {
      title,
      description,
      url,
      siteName: site?.company_name || "Rokate Catering",
      locale: locale === "ru" ? "ru_RU" : "en_US",
      type: "website",
      ...(image ? { images: [{ url: absolute(image)! }] } : {}),
    },
    twitter: { card: "summary_large_image", title, description },
    robots: seo?.noindex ? { index: false, follow: true } : undefined,
  };
}
