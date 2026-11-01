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
                className="flex w-[260px] flex-col overflow-hidden rounded-card border border-line bg-surface md:w-[300px]"
              >
                <div className="aspect-[4/3] overflow-hidden bg-sand">
                  <Img src={p.photo} alt={p.title} sizes="300px" className="h-full w-full object-cover" />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="text-[18px] font-bold">{p.title}</h3>
                  <p className="mt-1 text-[13px] text-ink-soft">{p.guests}</p>
                  <ul className="mt-4 flex-1 space-y-2">
                    {p.includes.map((it) => (
                      <li key={it} className="flex gap-2.5 text-[14px] leading-snug text-ink-soft">
                        <span className="mt-[7px] h-[5px] w-[5px] shrink-0 rounded-full bg-gold" aria-hidden="true" />
                        {it}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-5 text-[17px] font-bold">{p.price}</p>
                  <Link href="#contact" className="btn btn-ghost mt-3 !py-2.5 !text-[14px]">
                    {s.request}
                  </Link>
                </div>
              </article>
            ))}
          </Rail>
        </div>
      </div>
    </section>
  );
}
