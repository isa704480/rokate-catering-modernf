"use client";
import Script from "next/script";
import { useEffect } from "react";
import { captureAttribution, track } from "@/lib/track";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

/**
 * GA4 + kliklar kuzatuvi.
 * Har qanday elementga data-event="whatsapp_click" data-location="hero" qo'yilsa — bosilganda event yuboriladi.
 * wa.me, tel:, mailto:, instagram havolalari avtomatik aniqlanadi.
 */
export function Analytics() {
  useEffect(() => {
    captureAttribution();
    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement)?.closest?.("a,button") as HTMLElement | null;
      if (!el) return;
      const href = el.getAttribute("href") || "";
      const location = el.dataset.location || el.closest("[data-section]")?.getAttribute("data-section") || "";
      let event = el.dataset.event || "";
      if (!event) {
        if (href.includes("wa.me")) event = "whatsapp_click";
        else if (href.startsWith("tel:")) event = "phone_click";
        else if (href.startsWith("mailto:")) event = "email_click";
        else if (href.includes("instagram.com")) event = "instagram_click";
      }
      if (event) track(event, { location, page: window.location.pathname, ...(el.dataset.label ? { label: el.dataset.label } : {}) });
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  if (!GA_ID) return null;
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
      <Script id="ga4" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;
gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'granted'});
gtag('js',new Date());gtag('config','${GA_ID}');`}
      </Script>
    </>
  );
}
