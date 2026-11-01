import manifest from "@/public/media/manifest.json";

type Entry = { w: number; h: number; widths: number[]; blur?: string; ext?: string };
const MEDIA = manifest as unknown as Record<string, Entry>;

type Props = {
  /** "/media/yacht-deck-table__w960.webp" yoki CMS yuklagan "/media/uploads/x.jpg" */
  src: string;
  alt: string;
  sizes?: string;
  className?: string;
  priority?: boolean;
};

/**
 * Build vaqtida tayyorlangan rasmlar uchun srcset qo'yadi.
 * CMS orqali yangi yuklangan rasmda variant bo'lmaydi — u asl holida ko'rsatiladi.
 * Ikkala holatda ham kontentda bitta to'liq yo'l saqlanadi, shuning uchun
 * Decap CMS'da rasm oldindan ko'rinadi.
 */
export default function Img({ src, alt, sizes = "100vw", className = "", priority = false }: Props) {
  if (!src) return null;

  const path = src.startsWith("/") ? src : `/${src}`;
  const match = /^\/media\/([^/]+?)(?:__w\d+)?\.(?:webp|jpe?g|png|avif)$/i.exec(path);
  const entry = match ? MEDIA[match[1]] : undefined;
  const loading = priority ? "eager" : "lazy";

  if (!entry || !entry.widths?.length) {
    return <img src={path} alt={alt} className={className} loading={loading} decoding="async" />;
  }

  const base = match![1];
  const fallback = entry.widths[entry.widths.length - 1];

  return (
    <img
      src={`/media/${base}__w${fallback}.webp`}
      srcSet={entry.widths.map((w) => `/media/${base}__w${w}.webp ${w}w`).join(", ")}
      sizes={sizes}
      alt={alt}
      width={entry.w}
      height={entry.h}
      className={className}
      loading={loading}
      decoding="async"
      fetchPriority={priority ? "high" : undefined}
      style={
        entry.blur
          ? { backgroundImage: `url(${entry.blur})`, backgroundSize: "cover", backgroundPosition: "center" }
          : undefined
      }
    />
  );
}
