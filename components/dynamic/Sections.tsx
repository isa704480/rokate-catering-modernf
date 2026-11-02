/**
 * Direction 3 — Modern Dynamic.
 * Zamonaviy digital: katta Unbounded sarlavhalar, yumaloq (28px) kartochkalar, bento-grid,
 * laym aksent, to'q ko'k bloklar, harakatlanuvchi lenta (marquee).
 */
import Link from "next/link";
import { Icon, WhatsAppIcon } from "@/components/Icon";
import { Img } from "@/components/Img";
import { href, paragraphs } from "@/lib/site";
import type { HomeData, Locale } from "@/lib/types";

export function DynHead({ kicker, title, text, light = false, center = false, small = false }: {
  kicker: string; title?: string; text?: string; light?: boolean; center?: boolean; small?: boolean;
}) {
  return (
    <div className={`reveal ${center ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}`}>
      <p className={`eyebrow ${light ? "!text-white" : ""}`}>{kicker}</p>
      {title && <h2 className={`dyn-title mt-5 ${small ? "text-[clamp(1.9rem,3.4vw,3rem)]" : "text-[clamp(1.75rem,5vw,4.4rem)]"} ${light ? "text-white" : ""}`}>{title}</h2>}
      {text && <p className={`mt-5 max-w-xl text-[17px] leading-relaxed ${center ? "mx-auto" : ""} ${light ? "text-white/70" : "text-ink-muted"}`}>{text}</p>}
    </div>
  );
}

/* ------------------------------------------------------------------ HERO */
export function DynHero({ hero, chips, wa, waLabel, cta }: {
  hero: HomeData["hero"]; chips: string[]; wa: string; waLabel: string; cta: string;
}) {
  return (
    <section className="px-3 pt-3" data-section="hero">
      <div className="relative mx-auto flex h-[calc(100svh-100px)] min-h-[600px] max-w-[1600px] items-end overflow-hidden rounded-[28px] bg-ink lg:rounded-[40px]">
        {hero.video ? (
          <video className="absolute inset-0 h-full w-full object-cover" autoPlay muted loop playsInline poster={hero.image?.src} aria-hidden="true">
            <source src={hero.video} type="video/mp4" />
          </video>
        ) : (
          <Img img={hero.image} priority sizes="100vw" className="absolute inset-0 h-full w-full scale-105 object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b1120]/95 via-[#0b1120]/35 to-[#0b1120]/10" />

        {/* yuqori o'ngda "suzuvchi" teglar */}
        <div className="absolute right-4 top-4 hidden flex-wrap justify-end gap-2 sm:flex lg:right-8 lg:top-8">
          {chips.map((c) => (
            <span key={c} className="glass rounded-full px-4 py-2 text-[13px] font-semibold text-white">{c}</span>
          ))}
        </div>

        <div className="relative w-full px-5 pb-[calc(96px+env(safe-area-inset-bottom))] text-white sm:px-8 lg:px-14 lg:pb-14">
          {hero.eyebrow && (
            <p className="glass inline-flex items-center gap-2 rounded-full px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.14em]">
              <span className="h-2 w-2 rounded-full bg-lime" />{hero.eyebrow}
            </p>
          )}
          <h1 className="dyn-title mt-6 max-w-[15ch] text-[clamp(1.85rem,7.2vw,7.4rem)] text-white">{hero.title}</h1>
          <div className="mt-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            {hero.subtitle && <p className="max-w-lg text-[17px] leading-relaxed text-white/80">{hero.subtitle}</p>}
            <div className="flex flex-wrap gap-3">
              <a href="#request" className="btn btn-primary !min-h-[56px] !px-7 text-[15px]" data-event="cta_click" data-location="hero">
                {cta}<Icon name="arrow" size={18} />
              </a>
              {wa && (
                <a href={wa} target="_blank" rel="noopener" className="btn glass !min-h-[56px] !px-6 text-white hover:bg-white/25" data-location="hero">
                  <WhatsAppIcon size={18} />{waLabel}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ MARQUEE (formatlar lentasi) */
export function DynMarquee({ items }: { items: string[] }) {
  if (!items.length) return null;
  const row = [...items, ...items];
  return (
    <div className="overflow-hidden py-6 lg:py-8" aria-hidden="true">
      <div className="-rotate-1 bg-lime py-4">
        <div className="marquee">
          {[0, 1].map((k) => (
            <div key={k} className="flex shrink-0 items-center">
              {row.map((f, i) => (
                <span key={`${k}-${i}`} className="flex items-center whitespace-nowrap font-display text-[clamp(1.1rem,2.2vw,1.8rem)] uppercase tracking-tight text-ink">
                  <span className="px-6">{f}</span><Icon name="sparkle" size={22} />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ ABOUT */
export function DynAbout({ about, facts }: { about: HomeData["about"]; facts: string[] }) {
  if (!about.title) return null;
  return (
    <section id="about" className="section" data-section="about">
      <div className="container-x grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-7">
          <p className="reveal eyebrow">{about.eyebrow}</p>
          <h2 className="reveal dyn-title mt-5 text-[clamp(1.6rem,4.4vw,3.8rem)]">{about.title}</h2>
          <div className="mt-8 space-y-4">
            {paragraphs(about.text).map((p, i) => <p key={i} className="reveal text-[17px] leading-relaxed text-ink-muted">{p}</p>)}
          </div>
          <div className="reveal mt-8 flex flex-wrap gap-2">
            {(about.stats.length ? about.stats.map((s) => `${s.value} ${s.label}`) : facts).map((f) => (
              <span key={f} className="rounded-full border border-line bg-white px-4 py-2 text-[14px] font-semibold">{f}</span>
            ))}
          </div>
        </div>
        <div className="reveal relative lg:col-span-5">
          <div className="overflow-hidden rounded-[28px]">
            <Img img={about.image} sizes="(min-width:1024px) 40vw, 100vw" className="aspect-[4/5] w-full object-cover" />
          </div>
          <div className="absolute -bottom-5 -left-3 rotate-[-4deg] rounded-2xl bg-lime px-5 py-4 font-display text-[15px] uppercase leading-tight shadow-lg sm:-left-6">
            Dubai<br />catering
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ DIRECTIONS (bento) */
export function DynDirections({ data, locale, more, kicker }: {
  data: HomeData["directions"]; locale: Locale; more: string; kicker: string;
}) {
  if (!data.items.length) return null;
  return (
    <section id="directions" className="section pt-0 lg:pt-0" data-section="directions">
      <div className="container-x">
        <DynHead kicker={kicker} title={data.title} />
        <div className="mt-10 grid auto-rows-[260px] gap-4 sm:grid-cols-2 lg:auto-rows-[300px] lg:grid-cols-4">
          {data.items.map((s, i) => {
            const target = s.has_page ? href(locale, `/catering/${s.slug}`) : "#request";
            const big = i === 0;
            // oxirgi kichik kartochka bo'sh katakni to'ldiradi (to'r doim to'liq bo'lsin)
            const fill = i === data.items.length - 1 && (data.items.length - 1) % 2 === 1;
            const inner = (
              <>
                <Img img={s.image} sizes={big ? "(min-width:1024px) 50vw, 100vw" : "(min-width:1024px) 25vw, 50vw"}
                     className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b1120]/85 via-[#0b1120]/15 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 text-white lg:p-7">
                  <div>
                    <h3 className={`dyn-title ${big ? "text-[clamp(1.8rem,3vw,2.8rem)]" : "text-[1.35rem]"}`}>{s.title}</h3>
                    {s.card_text && <p className={`mt-2 text-[14px] leading-relaxed text-white/75 ${big ? "max-w-md" : "line-clamp-2"}`}>{s.card_text}</p>}
                  </div>
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-lime text-ink transition-transform duration-500 group-hover:rotate-[-45deg]" aria-label={more}>
                    <Icon name="arrow" size={20} />
                  </span>
                </div>
              </>
            );
            const cls = `group reveal relative block overflow-hidden rounded-[28px] ${big ? "sm:col-span-2 sm:row-span-2" : ""} ${fill ? "sm:col-span-2" : ""}`;
            return s.has_page
              ? <Link key={s.slug} href={target} className={cls}>{inner}</Link>
              : <a key={s.slug} href={target} className={cls}>{inner}</a>;
          })}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ RELAX (sticky hikoya) */
export function DynRelax({ data, cta }: { data: HomeData["relax"]; cta: string }) {
  if (!data.title) return null;
  return (
    <section className="px-3" data-section="relax">
      <div className="mx-auto max-w-[1600px] overflow-hidden rounded-[28px] bg-ink text-white lg:rounded-[40px]">
        <div className="container-x grid grid-cols-1 gap-12 py-16 lg:grid-cols-2 lg:gap-16 lg:py-28 [&>*]:min-w-0">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <DynHead kicker={data.eyebrow || ""} light />
            <h2 className="reveal dyn-title mt-5 text-[clamp(1.9rem,5.6vw,5rem)] text-white">
              {data.title}
            </h2>
            {data.text && <p className="reveal mt-6 max-w-md text-[17px] leading-relaxed text-white/70">{data.text}</p>}
            <div className="reveal mt-8 overflow-hidden rounded-[24px]">
              <Img img={data.image} sizes="(min-width:1024px) 45vw, 100vw" className="aspect-[16/10] w-full object-cover" />
            </div>
            <a href="#request" className="reveal btn btn-primary mt-8" data-event="cta_click" data-location="relax">{cta}<Icon name="arrow" size={18} /></a>
          </div>
          <ol className="space-y-4">
            {data.steps.map((s, i) => (
              <li key={s.title} className="reveal rounded-[24px] border border-white/10 bg-white/[.04] p-7 transition-colors hover:border-lime/60 hover:bg-white/[.07] lg:p-9">
                <div className="flex items-start justify-between gap-6">
                  <h3 className="dyn-title min-w-0 flex-1 text-[clamp(1.25rem,2.4vw,2rem)] text-white">{s.title}</h3>
                  <span className="font-display text-[2.4rem] leading-none text-lime sm:text-[3.4rem]">{String(i + 1).padStart(2, "0")}</span>
                </div>
                {s.text && <p className="mt-4 max-w-md text-[16px] leading-relaxed text-white/65">{s.text}</p>}
                <div className="mt-6 h-1 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-lime" style={{ width: `${((i + 1) / data.steps.length) * 100}%` }} />
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ SERVICES (teglar buluti) */
export function DynServices({ data, kicker }: { data: HomeData["services"]; kicker: string }) {
  if (!data.items.length) return null;
  return (
    <section className="section" data-section="services">
      <div className="container-x text-center">
        <DynHead kicker={kicker} title={data.title} text={data.text} center />
        <ul className="reveal mx-auto mt-12 flex max-w-5xl flex-wrap justify-center gap-3">
          {data.items.map((s) => (
            <li key={s.title}
                className="group flex items-center gap-3 rounded-full border border-line bg-white py-2.5 pl-2.5 pr-6 text-[15px] font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:border-ink hover:bg-ink hover:text-white">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-lime text-ink"><Icon name={s.icon} size={20} /></span>
              {s.title}
            </li>
          ))}
        </ul>
        {data.note && <p className="reveal mt-8 text-[14px] text-ink-muted">* {data.note}</p>}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ WHY */
export function DynWhy({ data }: { data: HomeData["why"] }) {
  if (!data.items.length) return null;
  return (
    <section className="section pt-0 lg:pt-0" data-section="why">
      <div className="container-x">
        <DynHead kicker="Rokate" title={data.title} />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {data.items.map((w, i) => (
            <div key={w.title}
                 className={`reveal flex min-h-[260px] flex-col justify-between rounded-[28px] p-7 ${i === 0 ? "bg-lime text-ink" : i === 3 ? "bg-ink text-white" : "border border-line bg-white"}`}
                 style={{ transitionDelay: `${i * 80}ms` }}>
              <span className={`grid h-14 w-14 place-items-center rounded-full ${i === 0 ? "bg-ink text-lime" : i === 3 ? "bg-lime text-ink" : "bg-sand text-ink"}`}>
                <Icon name={w.icon} size={26} />
              </span>
              <div>
                <h3 className={`dyn-title text-[1.3rem] ${i === 3 ? "text-white" : ""}`}>{w.title}</h3>
                {w.text && <p className={`mt-3 text-[15px] leading-relaxed ${i === 3 ? "text-white/70" : i === 0 ? "text-ink/75" : "text-ink-muted"}`}>{w.text}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
