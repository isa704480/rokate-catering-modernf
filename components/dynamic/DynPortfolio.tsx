"use client";
import { useState } from "react";
import { Lightbox } from "@/components/Gallery";
import { Icon } from "@/components/Icon";
import { Img } from "@/components/Img";
import type { Img as ImgT, Project } from "@/lib/types";

const SPANS = ["lg:col-span-2 lg:row-span-2", "", "lg:row-span-2", "", "lg:col-span-2", "", ""];

/** Bento portfolio: har xil o'lchamdagi yumaloq kartochkalar, hover'da ma'lumot. */
export function DynPortfolio({ items, labels, loc }: {
  items: Project[]; labels: { close: string; prev: string; next: string; photo: string }; loc: Record<string, string>;
}) {
  const [open, setOpen] = useState<ImgT[] | null>(null);
  if (!items.length) return null;
  return (
    <>
      <div className="mt-10 grid auto-rows-[220px] grid-cols-2 gap-3 sm:gap-4 lg:auto-rows-[240px] lg:grid-cols-4">
        {items.map((p, i) => {
          const images = [p.cover, ...p.images].filter(Boolean) as ImgT[];
          return (
            <button key={p.slug} type="button" onClick={() => setOpen(images)} data-event="portfolio_open" data-label={p.slug}
                    className={`group reveal relative overflow-hidden rounded-[24px] text-left ${i === 0 ? "col-span-2 row-span-2" : ""} ${SPANS[i % SPANS.length]}`}>
              <Img img={p.cover} sizes="(min-width:1024px) 50vw, 50vw" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b1120]/85 via-transparent to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-100" />
              <div className="absolute inset-x-0 bottom-0 p-4 text-white lg:p-5">
                <span className="mb-2 inline-block rounded-full bg-lime px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-ink">{p.event_type || loc[p.location_type]}</span>
                <h3 className={`dyn-title ${i === 0 ? "text-[clamp(1.4rem,2.4vw,2.2rem)]" : "text-[1rem] lg:text-[1.1rem]"}`}>{p.title}</h3>
              </div>
              <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[12px] font-bold text-ink opacity-0 transition-opacity group-hover:opacity-100">
                <Icon name="camera" size={14} />{images.length}
              </span>
            </button>
          );
        })}
      </div>
      {open && <Lightbox images={open} index={0} onClose={() => setOpen(null)} labels={labels} />}
    </>
  );
}
