"use client";
import { useEffect } from "react";

/**
 * "#bo'lim" havolalari: agar bo'lim shu sahifada bo'lsa — sahifani qayta yuklamasdan,
 * hozirgi joydan yumshoq skroll qiladi (/#packages, /ru#request, #faq ...).
 * Bo'lim boshqa sahifada bo'lsa — oddiy o'tish (Next.js keyin hash'ga skroll qiladi).
 */
export function SmoothAnchors() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as HTMLElement)?.closest?.("a[href*='#']") as HTMLAnchorElement | null;
      if (!a || a.target === "_blank") return;
      const url = new URL(a.href, window.location.href);
      if (url.origin !== window.location.origin || !url.hash || url.hash === "#") return;
      const el = document.getElementById(decodeURIComponent(url.hash.slice(1)));
      if (!el) return; // bu sahifada yo'q — oddiy navigatsiya
      e.preventDefault();
      window.dispatchEvent(new Event("rk:close-menu"));
      document.documentElement.style.overflow = "";
      // menyu yopilishi bilan bir kadr kutib, keyin skroll
      requestAnimationFrame(() => {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        if (window.location.hash !== url.hash) history.pushState(null, "", window.location.pathname + window.location.search + url.hash);
      });
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);
  return null;
}
