import type { Locale } from "./types";

/* Sayt matnlari — content/ papkasidagi JSON fayllardan.
 *
 * Ikkita manba bor va ular bir xil fayllar:
 *
 * 1. JONLI. Sahifa chizilayotganda matn GitHub'dan o'qiladi va 30 soniya
 *    keshda turadi. Shuning uchun admin panelda saqlangan o'zgarish Vercel
 *    qayta yig'ishini kutmasdan saytda paydo bo'ladi.
 *
 * 2. ZAXIRA. Quyidagi statik import'lar — build ichidagi nusxa. GitHub
 *    javob bermasa, sayt shu nusxani ko'rsatadi va ishlashda davom etadi.
 *
 * Muhit o'zgaruvchilari (ixtiyoriy):
 *   GITHUB_CONTENT_TOKEN  — o'qish tokeni; u bilan o'zgarish ~30 soniyada chiqadi
 *   CONTENT_REPO          — "egasi/repo", standart: isa704480/rokate-catering-modernf
 *   CONTENT_BRANCH        — tarmoq, standart: main
 *   CONTENT_LIVE=off      — jonli o'qishni o'chiradi
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

const BUNDLED: Record<Locale, Bag> = {
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

/** API yo'li -> content/ ichidagi fayl nomi */
const FILES: Record<string, string> = {
  site: "site.json",
  home: "home.json",
  menu: "menu.json",
  partners: "partners.json",
  "legal/privacy": "privacy.json",
  "services/yacht-catering": "services/yacht-catering.json",
  "services/private-events": "services/private-events.json",
  "services/corporate-catering": "services/corporate-catering.json",
};

const REPO = process.env.CONTENT_REPO || "isa704480/rokate-catering-modernf";
const BRANCH = process.env.CONTENT_BRANCH || "main";
const TOKEN = process.env.GITHUB_CONTENT_TOKEN?.trim();
const LIVE = process.env.CONTENT_LIVE !== "off";

/** Keshni qancha ushlab turish (soniya). */
export const CONTENT_REVALIDATE = 30;

/**
 * Faylni GitHub'dan oladi. Xatolik bo'lsa null — chaqiruvchi zaxiraga o'tadi.
 *
 * Token bo'lsa — GitHub API: soatiga 5000 so'rov, yopiq repozitoriy bilan ham
 * ishlaydi, o'zgarish darhol ko'rinadi.
 * Token bo'lmasa yoki u ishlamasa — raw.githubusercontent.com: token kerak
 * emas, lekin CDN keshi tufayli o'zgarish bir necha daqiqada yetib keladi.
 */
async function fetchFrom(url: string, headers: Record<string, string>): Promise<Bag | null> {
  try {
    const res = await fetch(url, {
      headers: { "user-agent": "rokate-site", ...headers },
      next: { revalidate: CONTENT_REVALIDATE },
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) {
      console.error("[content]", res.status, url.replace(/\?.*$/, ""));
      return null;
    }
    const data = (await res.json()) as Bag;
    return data && typeof data === "object" && Object.keys(data).length ? data : null;
  } catch {
    return null;
  }
}

async function fetchPath(path: string): Promise<Bag | null> {
  if (TOKEN) {
    const viaApi = await fetchFrom(
      `https://api.github.com/repos/${REPO}/contents/${path}?ref=${BRANCH}`,
      { accept: "application/vnd.github.raw", authorization: `Bearer ${TOKEN}` }
    );
    if (viaApi) return viaApi;
    /* Token noto'g'ri yoki muddati o'tgan bo'lsa — tokensiz yo'lga o'tamiz */
  }
  return fetchFrom(`https://raw.githubusercontent.com/${REPO}/${BRANCH}/${path}`, {});
}

function fetchLive(file: string, lang: Locale) {
  return fetchPath(`content/${lang}/${file}`);
}

/** Tilga bog'liq bo'lmagan fayl (masalan content/reviews.json) — jonli, zaxira bilan. */
export async function liveFile<T>(pathInRepo: string, fallback: T): Promise<T> {
  if (!LIVE) return fallback;
  const live = await fetchPath(pathInRepo);
  return (live as T | null) ?? fallback;
}

/** Sahifa ma'lumotini oladi. Topilmasa null — chaqiruvchi 404 qaytaradi. */
export async function api<T>(path: string, lang: Locale): Promise<T | null> {
  const clean = path.split("?")[0];
  const file = FILES[clean];

  if (LIVE && file) {
    const live = await fetchLive(file, lang);
    if (live) return live as T;
  }

  const value = BUNDLED[lang]?.[clean] ?? BUNDLED.ru?.[clean] ?? null;
  return value as T | null;
}

/** Sayt ichidagi xizmat sahifalari ro'yxati (sitemap va navigatsiya uchun). */
export const SERVICE_SLUGS = ["yacht-catering", "private-events", "corporate-catering"] as const;
