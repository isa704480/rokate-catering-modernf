"use client";

import { useEffect, useRef } from "react";
import Swiper from "swiper";
import { A11y, Autoplay, Keyboard, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export type SliderReview = {
  author: string;
  rating: number;
  kind: string;
  text: string;
};

type Labels = {
  carousel: string;
  prev: string;
  next: string;
  bullet: string;
};

/**
 * Sharhlar karuseli — Swiper.js.
 * Cheksiz aylanadi (loop), o'zi harakatlanadi (autoplay) va o'q tugmalari bilan
 * boshqariladi. Sichqoncha ustiga kelganda yoki foydalanuvchi tegganda to'xtaydi.
 * Harakatni kamaytirish sozlamasi yoqilgan bo'lsa, avtomatik aylanish o'chadi.
 */
export default function ReviewsSlider({ items, labels }: { items: SliderReview[]; labels: Labels }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const pagRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const swiper = new Swiper(el, {
      modules: [Autoplay, Navigation, Pagination, Keyboard, A11y],
      loop: true,
      loopAddBlankSlides: false,
      speed: 650,
      spaceBetween: 20,
      grabCursor: true,
      watchSlidesProgress: true,
      autoHeight: false,
      slidesPerView: 1.08,
      breakpoints: {
        640: { slidesPerView: 2, spaceBetween: 20 },
        1024: { slidesPerView: 3, spaceBetween: 20 },
      },
      autoplay: reduced
        ? false
        : { delay: 4500, disableOnInteraction: false, pauseOnMouseEnter: true },
      keyboard: { enabled: true, onlyInViewport: true },
      navigation: { prevEl: prevRef.current, nextEl: nextRef.current },
      pagination: { el: pagRef.current, clickable: true, bulletElement: "button" },
      a11y: {
        enabled: true,
        containerMessage: labels.carousel,
        prevSlideMessage: labels.prev,
        nextSlideMessage: labels.next,
        paginationBulletMessage: labels.bullet,
      },
    });

    return () => {
      swiper.destroy(true, true);
    };
  }, [labels]);

  return (
    <div className="mt-12">
      <div className="mb-6 flex items-center justify-end gap-3">
        <button ref={prevRef} type="button" className="rev-arrow" aria-label={labels.prev}>
          <Arrow dir="left" />
        </button>
        <button ref={nextRef} type="button" className="rev-arrow" aria-label={labels.next}>
          <Arrow dir="right" />
        </button>
      </div>

      <div ref={rootRef} className="swiper" aria-roledescription="carousel">
        <div className="swiper-wrapper">
          {items.map((r, i) => (
            <div key={`${r.author}-${i}`} className="swiper-slide !h-auto">
              <Card review={r} />
            </div>
          ))}
        </div>
      </div>

      <div ref={pagRef} className="rev-dots mt-8 flex items-center gap-2" />
    </div>
  );
}

function Card({ review }: { review: SliderReview }) {
  return (
    <article className="flex h-full flex-col rounded-[28px] border border-line bg-white p-6 lg:p-7">
      <Stars count={review.rating} />
      <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-ink">{review.text}</blockquote>
      <footer className="mt-5 border-t border-line pt-4">
        <p className="text-[15px] font-semibold text-ink">{review.author}</p>
        {review.kind && <p className="mt-0.5 text-[13px] text-ink-muted">{review.kind}</p>}
      </footer>
    </article>
  );
}

function Stars({ count }: { count: number }) {
  const n = Math.max(0, Math.min(5, Math.round(count)));
  return (
    <div className="flex gap-1" role="img" aria-label={`${n}/5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} width="16" height="16" viewBox="0 0 20 20" aria-hidden="true">
          <path
            d="M10 1.6l2.5 5.1 5.6.8-4 3.9 1 5.6L10 14.4 4.9 17l1-5.6-4-3.9 5.6-.8z"
            fill={i < n ? "var(--color-gold)" : "var(--color-line)"}
          />
        </svg>
      ))}
    </div>
  );
}

function Arrow({ dir }: { dir: "left" | "right" }) {
  return (
    <svg width="18" height="14" viewBox="0 0 18 14" fill="none" aria-hidden="true">
      <path
        d={dir === "right" ? "M1 7h15M12 2l5 5-5 5" : "M17 7H2M6 2L1 7l5 5"}
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
