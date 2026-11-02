"use client";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

/** GA4 eventi (GA ulanmagan bo'lsa jim o'tadi). */
export function track(event: string, params: Record<string, unknown> = {}) {
  try {
    window.gtag?.("event", event, params);
  } catch {
    /* ignore */
  }
}

const KEY = "rk_attr";

export type Attribution = { utm_source?: string; utm_medium?: string; utm_campaign?: string; referrer?: string };

/** Birinchi tashrifdagi UTM va referrer'ni eslab qoladi (sessiya davomida). */
export function captureAttribution() {
  try {
    if (sessionStorage.getItem(KEY)) return;
    const q = new URLSearchParams(window.location.search);
    const data: Attribution = {
      utm_source: q.get("utm_source") || undefined,
      utm_medium: q.get("utm_medium") || undefined,
      utm_campaign: q.get("utm_campaign") || undefined,
      referrer: document.referrer && !document.referrer.startsWith(window.location.origin) ? document.referrer : undefined,
    };
    sessionStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    /* storage yopiq bo'lishi mumkin */
  }
}

export function getAttribution(): Attribution {
  try {
    return JSON.parse(sessionStorage.getItem(KEY) || "{}");
  } catch {
    return {};
  }
}
