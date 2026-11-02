"use client";
import { useState } from "react";
import { Lightbox } from "./Gallery";
import { Img } from "./Img";
import type { Img as ImgT } from "@/lib/types";

export function ServiceGallery({ images, labels }: { images: ImgT[]; labels: { close: string; prev: string; next: string } }) {
  const [idx, setIdx] = useState<number | null>(null);
  return (
    <>
      <div className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {images.map((img, i) => (
          <button key={i} type="button" onClick={() => setIdx(i)}
                  className="img-zoom reveal overflow-hidden">
            <Img img={img} sizes="(min-width:1024px) 25vw, 50vw" className="h-full w-full object-cover aspect-[3/4]" />
          </button>
        ))}
      </div>
      {idx !== null && <Lightbox images={images} index={idx} onClose={() => setIdx(null)} labels={labels} />}
    </>
  );
}
