"use client";
import { useRef, useState } from "react";
import { Lightbox } from "@/components/Gallery";
import { Icon } from "@/components/Icon";
import { Img } from "@/components/Img";
import type { Img as ImgT, Project } from "@/lib/types";

/** Portfolio: gorizontal karusel (swipe / tugmalar), bosilganda — lightbox galereya. */
export function Portfolio({ items, labels, loc }: {
  items: Project[]; labels: { close: string; prev: string; next: string; photo: string }; loc: Record<string, string>;
}) {
  const [open, setOpen] = useState<{ images: ImgT[]; index: number } | null>(null);
  const track = useRef<HTMLDivElement>(null);
  if (!items.length) return null;

  const scroll = (dir: number) => {
    const el = track.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-card]");
    el.scrollBy({ left: dir * ((card?.offsetWidth || 320) + 20), behavior: "smooth" });
  };

  return (
    <>
      <div className="mt-8 hidden justify-end gap-2 md:flex">
        <button type="button" onClick={() => scroll(-1)} aria-label={labels.prev}
                className="grid h-12 w-12 place-items-center rounded-full border border-line hover:border-ink"><Icon name="chevronLeft" size={22} /></button>
        <button type="button" onClick={() => scroll(1)} aria-label={labels.next}
                className="grid h-12 w-12 place-items-center rounded-full border border-line hover:border-ink"><Icon name="chevronRight" size={22} /></button>
      </div>
      <div ref={track}
           className="mt-6 -mx-5 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-px-5 px-5 pb-4 md:mx-0 md:scroll-px-0 md:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {items.map((p) => {
          const images = [p.cover, ...p.images].filter(Boolean) as ImgT[];
          return (
            <button key={p.slug} type="button" data-card onClick={() => setOpen({ images, index: 0 })}
                    className="group img-zoom relative block w-[78%] shrink-0 snap-start overflow-hidden text-left sm:w-[46%] lg:w-[31.5%]"
                    data-event="portfolio_open" data-label={p.slug}>
              <Img img={p.cover} sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 80vw" className="aspect-[4/5] w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d1428]/80 via-[#0d1428]/5 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 text-white lg:p-6">
                {(p.event_type || p.location_type) && (
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-soft">{p.event_type || loc[p.location_type]}</p>
                )}
                <h3 className="mt-1.5 text-[1.7rem] leading-tight">{p.title}</h3>
                <p className="mt-2 inline-flex items-center gap-1.5 text-[12px] text-white/75">
                  <Icon name="camera" size={14} />{images.length} · {labels.photo}
                </p>
              </div>
            </button>
          );
        })}
      </div>
      {open && <Lightbox images={open.images} index={open.index} onClose={() => setOpen(null)} labels={labels} />}
    </>
  );
}
