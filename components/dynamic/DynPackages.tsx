"use client";
import { useRef } from "react";
import { Icon } from "@/components/Icon";
import { Img } from "@/components/Img";
import { RequestPackageButton } from "@/components/RequestPackageButton";
import { formatPrice, t } from "@/lib/i18n";
import type { HomeData, Locale } from "@/lib/types";
import { DynHead } from "./Sections";

/** Paketlar: gorizontal karusel (swipe / tugmalar), laym narx belgisi. */
export function DynPackages({ data, offers, locale, kicker }: {
  data: HomeData["packages"]; offers: HomeData["offers"]; locale: Locale; kicker: string;
}) {
  const track = useRef<HTMLDivElement>(null);
  if (!data.items.length && !offers.length) return null;
  const d = t(locale);
  const scroll = (dir: number) => {
    const el = track.current;
    const card = el?.querySelector<HTMLElement>("[data-card]");
    el?.scrollBy({ left: dir * ((card?.offsetWidth || 340) + 16), behavior: "smooth" });
  };
  return (
    <section id="packages" className="section" data-section="packages">
      <div className="container-x">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <DynHead kicker={kicker} title={data.title} text={data.text} />
          <div className="hidden gap-2 md:flex">
            <button type="button" onClick={() => scroll(-1)} aria-label={d.prev} className="grid h-14 w-14 place-items-center rounded-full border border-line bg-white hover:bg-ink hover:text-white"><Icon name="chevronLeft" size={22} /></button>
            <button type="button" onClick={() => scroll(1)} aria-label={d.next} className="grid h-14 w-14 place-items-center rounded-full bg-ink text-white hover:bg-black"><Icon name="chevronRight" size={22} /></button>
          </div>
        </div>

        {offers.map((o) => (
          <div key={o.id} className="reveal mt-10 flex flex-col gap-6 overflow-hidden rounded-[28px] bg-lime p-6 sm:flex-row sm:items-center sm:p-8">
            {o.image && <Img img={o.image} sizes="200px" className="aspect-square w-full rounded-[20px] object-cover sm:w-44" />}
            <div className="flex-1">
              <p className="text-[12px] font-bold uppercase tracking-[0.14em]">{d.badge.seasonal}{o.ends_at ? ` · ${d.offerUntil} ${new Date(o.ends_at).toLocaleDateString(locale === "ru" ? "ru-RU" : "en-GB", { day: "numeric", month: "long" })}` : ""}</p>
              <h3 className="dyn-title mt-2 text-[1.8rem]">{o.title}</h3>
              {o.text && <p className="mt-2 text-ink/75">{o.text}</p>}
            </div>
            <RequestPackageButton slug={o.package || ""} label={o.cta_text || d.cta.request} className="btn bg-ink text-white hover:bg-black" />
          </div>
        ))}
      </div>

      {/* karusel chap tomoni sarlavha bilan bir chiziqda boshlanadi */}
      <div ref={track} className="no-scrollbar mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-6 [--pad:20px] md:[--pad:40px] xl:[--pad:64px]"
           style={{ paddingInline: "max(var(--pad), calc((100vw - 1280px) / 2 + var(--pad)))", scrollPaddingInline: "max(var(--pad), calc((100vw - 1280px) / 2 + var(--pad)))" }}>
        {data.items.map((p) => {
          const guests = d.guests(p.guests_min, p.guests_max);
          return (
            <article key={p.slug} data-card className="reveal group flex w-[84%] shrink-0 snap-start flex-col overflow-hidden rounded-[28px] border border-line bg-white sm:w-[48%] lg:w-[31%] xl:w-[28%]">
              <div className="relative m-2 overflow-hidden rounded-[22px]">
                <Img img={p.image} sizes="(min-width:1024px) 30vw, 85vw" className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1.5 text-[12px] font-bold backdrop-blur">
                  {p.price_from != null ? `${d.price.from} ${formatPrice(locale, p.price_from)} ${d.price.currency}` : d.price.onRequest}
                </span>
                {p.badge && <span className="absolute right-3 top-3 rounded-full bg-lime px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider">{d.badge[p.badge] || p.badge}</span>}
              </div>
              <div className="flex flex-1 flex-col p-6 pt-4">
                {guests && <p className="flex items-center gap-2 text-[13px] font-semibold text-ink-muted"><Icon name="users" size={16} />{guests}</p>}
                <h3 className="dyn-title mt-2 text-[1.45rem]">{p.name}</h3>
                {p.short_text && <p className="mt-3 text-[15px] leading-relaxed text-ink-muted">{p.short_text}</p>}
                {p.contents.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {p.contents.slice(0, 5).map((c) => <span key={c} className="rounded-full bg-sand px-3 py-1 text-[12px] font-medium">{c}</span>)}
                  </div>
                )}
                <div className="mt-auto pt-6">
                  <RequestPackageButton slug={p.slug} label={d.cta.requestPackage} className="btn btn-primary w-full" />
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
