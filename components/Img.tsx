import type { Img as ImgT } from "@/lib/types";

type Props = {
  img: ImgT;
  sizes?: string;
  className?: string;
  priority?: boolean;
  alt?: string;
};

/** Django variantlari (WebP srcset) bilan rasm. Yuklanayotganda blur-placeholder ko'rinadi. */
export function Img({ img, sizes = "100vw", className = "", priority = false, alt }: Props) {
  if (!img) return <div className={`bg-sand ${className}`} aria-hidden="true" />;

  /* srcset, o'lcham va blur faqat shu rasmning o'ziga tegishli bo'lsa ishlatiladi.
     Admin paneldan yangi rasm yuklansa, src o'zgaradi-yu eski srcset qolib ketadi —
     u holda brauzer eski rasmni ko'rsatib qo'yardi. Shuning uchun tekshiramiz. */
  const variants = img.srcset && img.srcset.includes(img.src) ? img.srcset : undefined;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={img.src}
      srcSet={variants}
      sizes={variants ? sizes : undefined}
      width={variants ? img.width ?? undefined : undefined}
      height={variants ? img.height ?? undefined : undefined}
      alt={alt ?? img.alt ?? ""}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : undefined}
      decoding="async"
      className={className}
      style={variants && img.blur ? { backgroundImage: `url(${img.blur})`, backgroundSize: "cover", backgroundPosition: "center" } : undefined}
    />
  );
}
