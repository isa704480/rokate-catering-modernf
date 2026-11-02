export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3002").replace(/\/$/, "");
export const LOCALES = ["en", "ru"] as const;

/** Til uchun yo'l: EN — prefikssiz, RU — /ru */
export function href(locale: string, path = "/") {
  const p = path.startsWith("/") ? path : `/${path}`;
  if (locale === "en") return p;
  return p === "/" ? "/ru" : `/ru${p}`;
}

export function absolute(url: string | null | undefined) {
  if (!url) return undefined;
  return url.startsWith("http") ? url : `${SITE_URL}${url}`;
}

/** WhatsApp havolasi: tayyor matn + qaysi sahifadan kelgani */
export function waLink(number: string, text: string, context?: string) {
  if (!number) return "";
  const msg = [text, context ? `(${context})` : ""].filter(Boolean).join(" ");
  return `https://wa.me/${number}${msg ? `?text=${encodeURIComponent(msg)}` : ""}`;
}

export function telLink(phone: string) {
  return phone ? `tel:${phone.replace(/[^\d+]/g, "")}` : "";
}

export function paragraphs(text: string) {
  return (text || "").split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
}
