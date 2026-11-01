"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Senior darajadagi Gorizontal lenta (Modern Dynamic):
 * Desktopda silliq navigatsiya tugmalari (chap/o'ng strelkalar),
 * Mobil versiyada esa silliq snap-scroll va animatsion ishoralar bilan.
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
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    const el = ref.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollWidth - el.clientWidth - el.scrollLeft > 15);
  };

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, []);

  const scrollBy = (offset: number) => {
    if (!ref.current) return;
    ref.current.scrollBy({ left: offset, behavior: "smooth" });
  };

  return (
    <div className="group/rail relative">
      {/* Desktop uchun zamonaviy navigatsiya boshqaruv tugmalari */}
      <div className="pointer-events-none absolute -top-14 right-0 hidden items-center gap-2 md:flex">
        <button
          type="button"
          onClick={() => scrollBy(-340)}
          disabled={!canScrollLeft}
          aria-label="Previous"
          className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface text-ink transition-all duration-200 hover:scale-105 hover:bg-sand disabled:pointer-events-none disabled:opacity-30"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => scrollBy(340)}
          disabled={!canScrollRight}
          aria-label="Next"
          className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full border border-line bg-green text-bg transition-all duration-200 hover:scale-105 hover:bg-green-deep disabled:pointer-events-none disabled:opacity-30"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      <div
        ref={ref}
        className={`rail scroll-smooth ${dark ? "rail-dark" : ""} ${canScrollRight ? "rail-mask" : ""} ${className}`}
      >
        {children}
      </div>

      <p
        className={`mt-2 flex items-center gap-1.5 text-[12px] font-medium transition-opacity duration-300 md:hidden ${
          canScrollRight ? "opacity-100" : "opacity-0"
        } ${dark ? "text-bg/75" : "text-ink-soft"}`}
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
