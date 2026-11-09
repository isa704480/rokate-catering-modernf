import type { Locale } from "./types";

/* Sayt matnlari — content/ papkasidagi JSON fayllardan.
 *
 * Shu fayllarni admin panel (Decap CMS) tahrirlaydi. Roman saqlaganda
 * o'zgarish GitHub'ga yoziladi, Vercel saytni qayta yig'adi va yangi matn
 * saytda paydo bo'ladi.
 *
 * Import'lar ataylab statik: shunda fayllar build'ga qo'shilib ketadi va
 * serverda fayl tizimini o'qish kerak bo'lmaydi (Vercel'da bu ishonchliroq).
 */

import ruSite from "@/content/ru/site.json";
import ruHome from "@/content/ru/home.json";
import ruMenu from "@/content/ru/menu.json";
import ruPartners from "@/content/ru/partners.json";
import ruPrivacy from "@/content/ru/privacy.json";
import ruYacht from "@/content/ru/services/yacht-catering.json";
import ruPrivate from "@/content/ru/services/private-events.json";
import ruCorporate from "@/content/ru/services/corporate-catering.json";

import enSite from "@/content/en/site.json";
import enHome from "@/content/en/home.json";
import enMenu from "@/content/en/menu.json";
import enPartners from "@/content/en/partners.json";
import enPrivacy from "@/content/en/privacy.json";
import enYacht from "@/content/en/services/yacht-catering.json";
import enPrivate from "@/content/en/services/private-events.json";
import enCorporate from "@/content/en/services/corporate-catering.json";

type Bag = Record<string, unknown>;

const CONTENT: Record<Locale, Bag> = {
  ru: {
    site: ruSite,
    home: ruHome,
    menu: ruMenu,
    partners: ruPartners,
    "legal/privacy": ruPrivacy,
    "services/yacht-catering": ruYacht,
    "services/private-events": ruPrivate,
    "services/corporate-catering": ruCorporate,
  },
  en: {
    site: enSite,
    home: enHome,
    menu: enMenu,
    partners: enPartners,
    "legal/privacy": enPrivacy,
    "services/yacht-catering": enYacht,
    "services/private-events": enPrivate,
    "services/corporate-catering": enCorporate,
  },
};

/** Sahifa ma'lumotini oladi. Topilmasa null — chaqiruvchi 404 qaytaradi. */
export async function api<T>(path: string, lang: Locale): Promise<T | null> {
  const clean = path.split("?")[0];
  const value = CONTENT[lang]?.[clean] ?? CONTENT.ru?.[clean] ?? null;
  return value as T | null;
}

/** Sayt ichidagi xizmat sahifalari ro'yxati (sitemap va navigatsiya uchun). */
export const SERVICE_SLUGS = ["yacht-catering", "private-events", "corporate-catering"] as const;
