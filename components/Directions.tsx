"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Img from "./Img";
import Rail from "./Rail";
import { t, href } from "@/lib/i18n";
import type { Locale } from "@/lib/content";
import type { Direction } from "@/lib/types";

/**
 * Sahifaning asosiy bloki. Yo'riqnoma: beshala yo'nalish darhol ko'rinadi,
 * hech biri ikkinchisidan katta emas, mobil versiyada vertikal ro'yxat.
 * Yacht va Corporate o'z sahifasiga, qolgan uchtasi galereyaga olib boradi.
 */
export default function Directions({
  locale,
  items,
  title,
  text,
}: {
  locale: Locale;
  items: Direction[];
  title: string;
  text: string;
}) {
  const s = t(locale);
  const [open, setOpen] = useState<Direction | null>(null);

  return (
    <section id="directions" className="scroll-mt-20 bg-green text-bg">
      <div className="container-x py-16 md:py-24">
        <div className="max-w-2xl">
          <h2 className="h2">{title}</h2>
          <p className="mt-3 text-[16px] leading-relaxed text-bg/80 md:text-[17px]">{text}</p>
        </div>

        <ul className="mt-10 md:mt-14">
          {items.map((d, i) => (
            <li key={d.slug} className={i > 0 ? "border-t border-line-dark" : ""}>
              <div className="grid gap-5 py-7 md:grid-cols-[minmax(0,1fr)_minmax(0,2.1fr)] md:gap-10 md:py-9">
                <div className="min-w-0">
                  <h3 className="h3">{d.title}</h3>
                  <p className="mt-2 max-w-[42ch] text-[15px] leading-relaxed text-bg/80">{d.short}</p>
                  {d.page ? (
                    <Link href={href(locale, d.page)} className="link-underline mt-3 inline-block text-[15px] font-semibold">
                      {s.more}
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setOpen(d)}
                      className="link-underline mt-3 inline-block text-[15px] font-semibold"
                    >
                      {s.openGallery}
                    </button>
                  )}
                </div>

                <div className="min-w-0">
                  <Rail hint={s.scrollHint} dark>
                    {d.photos.map((p) => (
                      <div key={p} className="h-[186px] w-[148px] overflow-hidden rounded-[10px] md:h-[216px] md:w-[172px]">
                        <Img
                          src={p}
                          alt={d.title}
                          sizes="172px"
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ))}
                  </Rail>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {open && <GalleryModal locale={locale} direction={open} onClose={() => setOpen(null)} />}
    </section>
  );
}

function GalleryModal({
  locale,
  direction,
  onClose,
}: {
  locale: Locale;
  direction: Direction;
  onClose: () => void;
}) {
  const s = t(locale);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[60] overflow-y-auto bg-ink/70 p-4 backdrop-blur-sm md:p-8"
      role="dialog"
      aria-modal="true"
      aria-label={direction.title}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="mx-auto max-w-4xl rounded-[18px] bg-bg p-5 text-ink md:p-8">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h3 className="h3">{direction.title}</h3>
            <p className="mt-2 max-w-[52ch] text-[15px] leading-relaxed text-ink-soft">{direction.short}</p>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line"
            aria-label={s.closeGallery}
          >
            <svg width="16" height="16" viewBox="0 0 18 14" fill="none" aria-hidden="true">
              <path d="M2 2l14 10M16 2L2 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3">
          {direction.photos.map((p) => (
            <div key={p} className="aspect-[4/5] overflow-hidden rounded-[10px]">
              <Img src={p} alt={direction.title} sizes="(min-width:768px) 30vw, 45vw" className="h-full w-full object-cover" />
            </div>
          ))}
        </div>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <Link href={`${href(locale)}#contact`} onClick={onClose} className="btn btn-primary sm:flex-1">
            {s.request}
          </Link>
          <button type="button" onClick={onClose} className="btn btn-ghost sm:flex-1">
            {s.closeGallery}
          </button>
        </div>
      </div>
    </div>
  );
}
