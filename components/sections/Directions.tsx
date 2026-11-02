import Link from "next/link";
import { Icon } from "@/components/Icon";
import { Img } from "@/components/Img";
import { SectionHead } from "@/components/SectionHead";
import { href } from "@/lib/site";
import type { HomeData, Locale } from "@/lib/types";

export function Directions({ data, formats, locale, more, requestHref, eyebrow }: {
  data: HomeData["directions"]; formats: HomeData["formats"]; locale: Locale; more: string; requestHref: string; eyebrow: string;
}) {
  if (!data.items.length) return null;
  return (
    <section id="directions" className="section bg-sand/60" data-section="directions">
      <div className="container-x">
        <SectionHead eyebrow={eyebrow} title={data.title} />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {data.items.map((s, i) => {
            const target = s.has_page ? href(locale, `/catering/${s.slug}`) : requestHref;
            const Inner = (
              <>
                <div className="relative aspect-[3/4] overflow-hidden">
                  <Img img={s.image} sizes="(min-width:1024px) 25vw, (min-width:640px) 50vw, 100vw" className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d1428]/80 via-[#0d1428]/10 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                    <h3 className="text-[1.9rem]">{s.title}</h3>
                    {s.card_text && <p className="mt-2 text-[14px] leading-relaxed text-white/80">{s.card_text}</p>}
                    <span className="mt-4 inline-flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.15em] text-gold-soft">
                      {more}<Icon name="arrow" size={16} className="transition-transform duration-500 group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>
              </>
            );
            return s.has_page ? (
              <Link key={s.slug} href={target} className="group img-zoom reveal block" style={{ transitionDelay: `${i * 80}ms` }}>{Inner}</Link>
            ) : (
              <a key={s.slug} href={target} className="group img-zoom reveal block" style={{ transitionDelay: `${i * 80}ms` }}>{Inner}</a>
            );
          })}
        </div>

        {formats.items.length > 0 && (
          <div className="reveal mt-16 grid gap-6 border-t border-line pt-10 lg:grid-cols-12">
            <h3 className="font-display text-[1.8rem] lg:col-span-3">{formats.title}</h3>
            <ul className="flex flex-wrap gap-2.5 lg:col-span-9">
              {formats.items.map((f) => (
                <li key={f} className="rounded-full border border-line bg-surface px-4 py-2 text-[14px]">{f}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
