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
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={img.src}
      srcSet={img.srcset || undefined}
      sizes={sizes}
      width={img.width ?? undefined}
      height={img.height ?? undefined}
      alt={alt ?? img.alt ?? ""}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : undefined}
      decoding="async"
      className={className}
      style={img.blur ? { backgroundImage: `url(${img.blur})`, backgroundSize: "cover", backgroundPosition: "center" } : undefined}
    />
  );
}
