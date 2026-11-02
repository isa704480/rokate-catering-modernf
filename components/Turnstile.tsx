"use client";
import Script from "next/script";

const KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

/** Cloudflare Turnstile (spamga qarshi). Kalit berilmasa — hech narsa chizilmaydi. */
export function Turnstile() {
  if (!KEY) return null;
  return (
    <>
      <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="lazyOnload" />
      <div className="cf-turnstile" data-sitekey={KEY} data-theme="light" />
    </>
  );
}

export function turnstileToken(form: HTMLFormElement) {
  return (form.querySelector('[name="cf-turnstile-response"]') as HTMLInputElement | null)?.value || "";
}
