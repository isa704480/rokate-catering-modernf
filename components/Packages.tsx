import Link from "next/link";
import Img from "./Img";
import Rail from "./Rail";
import { t, href } from "@/lib/i18n";
import type { Locale } from "@/lib/content";
import type { Pkg } from "@/lib/types";

/**
 * Tayyor paketlar. Pyramid Box shu yerda, boshqa variantlar qatorida —
 * alohida urg'u berilmaydi (yo'riqnomaning 6-bo'limi).
 */
export default function Packages({
  locale,
  items,
  title,
  text,
  showMenuLink = true,
}: {
  locale: Locale;
  items: Pkg[];
  title: string;
  text: string;
  showMenuLink?: boolean;
}) {
  const s = t(locale);
  if (!items.length) return null;

  return (
    <section id="packages" className="scroll-mt-20">
      <div className="container-x py-16 md:py-24">
        <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
          <div className="max-w-2xl">
            <h2 className="h2">{title}</h2>
            <p className="lede mt-3">{text}</p>
          </div>
          {showMenuLink && (
            <Link href={href(locale, "/menu")} className="link-underline text-[15px] font-semibold">
              {s.nav.menu}
            </Link>
          )}
        </div>

        <div className="mt-10">
          <Rail hint={s.scrollHint}>
            {items.map((p) => (
              <article
                key={p.slug}
                className="group flex w-[270px] shrink-0 flex-col overflow-hidden rounded-[20px] border border-line bg-surface shadow-[0_4px_20px_rgba(28,35,64,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(28,35,64,0.08)] md:w-[320px]"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-sand">
                  <Img src={p.photo} alt={p.title} sizes="320px" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <span className="absolute bottom-3 left-3 rounded-full bg-surface/90 px-3 py-1 text-[13px] font-extrabold text-ink shadow-sm backdrop-blur">
                    {p.price}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-[19px] font-bold text-ink">{p.title}</h3>
                  </div>
                  <p className="mt-1 flex items-center gap-1.5 text-[13px] font-semibold text-ink-soft">
                    <span>👥</span> {p.guests}
                  </p>
                  <ul className="mt-4 flex-1 space-y-2 border-t border-line/60 pt-4">
                    {p.includes.map((it) => (
                      <li key={it} className="flex gap-2.5 text-[14px] leading-snug text-ink-soft">
                        <span className="mt-[6px] h-[6px] w-[6px] shrink-0 rounded-full bg-gold" aria-hidden="true" />
                        {it}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 pt-2">
                    <Link href="#contact" className="btn btn-primary w-full !py-3 !text-[14px]">
                      {s.request}
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </Rail>
        </div>
      </div>
    </section>
  );
}
