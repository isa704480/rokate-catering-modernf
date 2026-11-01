"use client";

import { useEffect, useRef } from "react";
import type { Locale } from "@/lib/content";

/**
 * Cloudflare Turnstile — spamdan himoya (yo'riqnomaning 3-bo'limi).
 * Kalit ko'rsatilmagan bo'lsa (lokal ishlab chiqish) hech narsa ko'rsatilmaydi.
 */
export default function Turnstile({ siteKey, locale }: { siteKey: string; locale: Locale }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!siteKey || !ref.current) return;
    const id = "cf-turnstile-script";
    if (!document.getElementById(id)) {
      const sc = document.createElement("script");
      sc.id = id;
      sc.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
      sc.async = true;
      sc.defer = true;
      document.head.appendChild(sc);
    }
  }, [siteKey]);

  if (!siteKey) return null;
  return (
    <div
      ref={ref}
      className="cf-turnstile sm:col-span-2"
      data-sitekey={siteKey}
      data-language={locale}
      data-theme="light"
    />
  );
}

/** Formadagi Turnstile javobini oladi. */
export function turnstileToken(form: HTMLFormElement): string {
  const el = form.querySelector<HTMLInputElement>('[name="cf-turnstile-response"]');
  return el?.value ?? "";
}
