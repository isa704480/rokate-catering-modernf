"use client";
import { useCallback, useEffect, useState } from "react";
import { Icon } from "./Icon";
import type { Img as ImgT } from "@/lib/types";

/** Lightbox: rasmni katta ko'rsatish, chap/o'ng, Esc, swipe. */
export function Lightbox({ images, index, onClose, labels }: {
  images: ImgT[]; index: number; onClose: () => void; labels: { close: string; prev: string; next: string };
}) {
  const [i, setI] = useState(index);
  const [x0, setX0] = useState<number | null>(null);
  const n = images.length;
  const go = useCallback((dir: number) => setI((v) => (v + dir + n) % n), [n]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    };
    document.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.documentElement.style.overflow = ""; };
  }, [go, onClose]);

  const img = images[i];
  if (!img) return null;
  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center bg-[#0b1120]/95"
         onClick={onClose}
         onTouchStart={(e) => setX0(e.touches[0].clientX)}
         onTouchEnd={(e) => { if (x0 !== null) { const dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 50) go(dx > 0 ? -1 : 1); setX0(null); } }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={img.srcset ? img.srcset.split(", ").at(-1)!.split(" ")[0] : img.src} alt={img.alt}
           className="max-h-[88vh] max-w-[92vw] object-contain" onClick={(e) => e.stopPropagation()} />
      <button type="button" aria-label={labels.close} onClick={onClose}
              className="absolute right-3 top-3 grid h-12 w-12 place-items-center rounded-full text-white hover:bg-white/10"><Icon name="close" size={26} /></button>
      {n > 1 && (
        <>
          <button type="button" aria-label={labels.prev} onClick={(e) => { e.stopPropagation(); go(-1); }}
                  className="absolute left-2 top-1/2 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full text-white hover:bg-white/10 sm:grid"><Icon name="chevronLeft" size={28} /></button>
          <button type="button" aria-label={labels.next} onClick={(e) => { e.stopPropagation(); go(1); }}
                  className="absolute right-2 top-1/2 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full text-white hover:bg-white/10 sm:grid"><Icon name="chevronRight" size={28} /></button>
          <p className="absolute bottom-5 left-1/2 -translate-x-1/2 text-[13px] tracking-widest text-white/70">{i + 1} / {n}</p>
        </>
      )}
    </div>
  );
}
