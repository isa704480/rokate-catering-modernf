/** GA4 hodisalari. Yo'riqnomaning 8-bo'limidagi ro'yxat. */
export type Ev =
  | "whatsapp_click"
  | "telegram_click"
  | "phone_click"
  | "email_click"
  | "form_submit"
  | "partner_form_submit";

export function track(event: Ev, params: Record<string, string | number | undefined> = {}) {
  if (typeof window === "undefined") return;
  const w = window as unknown as { dataLayer?: unknown[]; gtag?: (...a: unknown[]) => void };
  if (typeof w.gtag === "function") w.gtag("event", event, params);
  else (w.dataLayer ||= []).push({ event, ...params });
}

/** Reklama va Instagram bio uchun UTM belgilarini saqlab, formaga qo'shamiz. */
export function attribution() {
  if (typeof window === "undefined") return {};
  const q = new URLSearchParams(window.location.search);
  const keys = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;
  const out: Record<string, string> = {};
  for (const k of keys) {
    const v = q.get(k) || sessionStorage.getItem(k);
    if (v) {
      out[k] = v;
      try {
        sessionStorage.setItem(k, v);
      } catch {
        /* private rejimda yozib bo'lmasligi mumkin */
      }
    }
  }
  if (document.referrer && !document.referrer.includes(window.location.host)) out.referrer = document.referrer;
  return out;
}
