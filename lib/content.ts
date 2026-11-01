import fs from "node:fs";
import path from "node:path";

export type Locale = "en" | "ru";
export const LOCALES: Locale[] = ["en", "ru"];
export const DEFAULT_LOCALE: Locale = "en";

const ROOT = path.join(process.cwd(), "content");

/**
 * Kontentdagi har bir matn maydoni ikki tilda saqlanadi: `title_ru` va `title_en`.
 * Bu funksiya kerakli tilni tanlab, qo'shimchani olib tashlaydi:
 *   { title_ru: "Яхты", title_en: "Yachts" }  ->  { title: "Yachts" }
 * Agar tarjima bo'sh bo'lsa, ikkinchi til ishlatiladi — sayt hech qachon bo'sh qolmaydi.
 */
function localize<T>(value: unknown, locale: Locale): T {
  if (Array.isArray(value)) return value.map((v) => localize(v, locale)) as T;
  if (value === null || typeof value !== "object") return value as T;

  const src = value as Record<string, unknown>;
  const out: Record<string, unknown> = {};
  const other: Locale = locale === "ru" ? "en" : "ru";

  for (const [key, val] of Object.entries(src)) {
    const m = /^(.*)_(ru|en)$/.exec(key);
    if (!m) {
      out[key] = localize(val, locale);
      continue;
    }
    const [, base, lang] = m;
    if (lang !== locale) continue;
    const picked = val === "" || val === undefined || val === null ? src[`${base}_${other}`] : val;
    out[base] = localize(picked, locale);
  }
  return out as T;
}

function readJson(file: string): unknown {
  return JSON.parse(fs.readFileSync(path.join(ROOT, file), "utf8"));
}

/** Bitta fayl: content/<name>.json */
export function doc<T>(name: string, locale: Locale): T {
  return localize<T>(readJson(`${name}.json`), locale);
}

/** Papkadagi barcha fayllar, `order` bo'yicha tartiblanadi: content/<dir>/*.json */
export function collection<T extends { order?: number }>(dir: string, locale: Locale): T[] {
  const full = path.join(ROOT, dir);
  if (!fs.existsSync(full)) return [];
  const items = fs
    .readdirSync(full)
    .filter((f) => f.endsWith(".json"))
    .map((f) => {
      const raw = JSON.parse(fs.readFileSync(path.join(full, f), "utf8")) as Record<string, unknown>;
      return localize<T>({ slug: f.replace(/\.json$/, ""), ...raw }, locale);
    })
    .filter((item) => (item as { hidden?: boolean }).hidden !== true);
  return items.sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
}

/** Next marshrut parametri `string` bo'ladi — uni Locale turiga keltiramiz. */
export function asLocale(value: string): Locale {
  return (LOCALES as string[]).includes(value) ? (value as Locale) : DEFAULT_LOCALE;
}

/** Marshrut parametridan tilni olish: `const locale = localeFrom(await params);` */
export function localeFrom(p: { locale: string }): Locale {
  return asLocale(p.locale);
}
