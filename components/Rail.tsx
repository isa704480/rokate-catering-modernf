"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Gorizontal lenta. Yo'riqnoma: aylanish faqat galereya, paketlar va portfolioda
 * bo'ladi va mobil versiyada aylanishini ko'rsatuvchi aniq belgi bilan.
 */
export default function Rail({
  children,
  hint,
  dark = false,
  className = "",
}: {
  children: React.ReactNode;
  hint: string;
  dark?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [more, setMore] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const check = () => setMore(el.scrollWidth - el.clientWidth - el.scrollLeft > 24);
    check();
    el.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => {
      el.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, []);

  return (
    <div className="relative">
      <div ref={ref} className={`rail ${dark ? "rail-dark" : ""} ${more ? "rail-mask" : ""} ${className}`}>
        {children}
      </div>
      <p
        className={`mt-1 flex items-center gap-1.5 text-[12px] transition-opacity duration-300 sm:hidden ${
          more ? "opacity-100" : "opacity-0"
        } ${dark ? "text-bg/60" : "text-ink-soft"}`}
        aria-hidden="true"
      >
        <span>{hint}</span>
        <svg width="14" height="8" viewBox="0 0 14 8" fill="none" aria-hidden="true">
          <path d="M1 4h11M9 1l3 3-3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </p>
    </div>
  );
}
