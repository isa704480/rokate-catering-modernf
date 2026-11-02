import { WhatsAppIcon } from "@/components/Icon";
import { Img } from "@/components/Img";
import type { HomeData } from "@/lib/types";

export function Hero({ hero, wa, waLabel, ctaHref, area }: {
  hero: HomeData["hero"]; wa: string; waLabel: string; ctaHref: string; area?: string;
}) {
  return (
    <section className="relative" data-section="hero">
      {/* Mobil: to'liq ekranli surat + matn ustida. Desktop: chapda matn, o'ngda baland surat. */}
      <div className="lg:container-x lg:grid lg:grid-cols-12 lg:gap-12 lg:pt-10 lg:pb-24">
        <div className="relative h-[calc(100svh-72px)] min-h-[560px] lg:order-2 lg:col-span-6 lg:col-start-7 lg:h-[min(80vh,820px)] lg:min-h-0">
          {hero.video ? (
            <video className="absolute inset-0 h-full w-full object-cover lg:rounded-[4px]" autoPlay muted loop playsInline
                   poster={hero.image?.src} aria-hidden="true">
              <source src={hero.video} type="video/mp4" />
            </video>
          ) : (
            <Img img={hero.image} priority sizes="(min-width: 1024px) 50vw, 100vw"
                 className="absolute inset-0 h-full w-full object-cover lg:rounded-[4px]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d1428]/85 via-[#0d1428]/25 to-transparent lg:hidden" />
          <div className="hidden lg:block absolute -left-6 -bottom-6 h-40 w-40 border border-gold/60 -z-10" aria-hidden="true" />

          {/* Mobil matn */}
          <div className="absolute inset-x-0 bottom-0 px-5 pb-[calc(96px+env(safe-area-inset-bottom))] text-white lg:hidden">
            {hero.eyebrow && <p className="eyebrow !text-gold-soft">{hero.eyebrow}</p>}
            <h1 className="mt-3 text-[2.6rem] leading-[1.02]">{hero.title}</h1>
            {hero.subtitle && <p className="mt-4 text-[16px] leading-relaxed text-white/85">{hero.subtitle}</p>}
            <div className="mt-6 flex flex-wrap gap-3">
              <a href={ctaHref} className="btn btn-light" data-event="cta_click" data-location="hero">{hero.cta}</a>
              {wa && (
                <a href={wa} target="_blank" rel="noopener" className="btn btn-ghost-light" data-location="hero">
                  <WhatsAppIcon size={18} />{waLabel}
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Desktop matn */}
        <div className="hidden lg:flex lg:order-1 lg:col-span-6 flex-col justify-center pr-6">
          {hero.eyebrow && <p className="eyebrow">{hero.eyebrow}</p>}
          <h1 className="mt-6 text-[clamp(3.2rem,5.4vw,5.4rem)] leading-[0.98]">{hero.title}</h1>
          {hero.subtitle && <p className="lead mt-7 max-w-lg !text-[18px]">{hero.subtitle}</p>}
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a href={ctaHref} className="btn btn-primary" data-event="cta_click" data-location="hero">{hero.cta}</a>
            {wa && (
              <a href={wa} target="_blank" rel="noopener" className="btn btn-outline" data-location="hero">
                <WhatsAppIcon size={18} className="text-[#1f9d55]" />{waLabel}
              </a>
            )}
          </div>
          {area && <p className="mt-12 text-[13px] uppercase tracking-[0.2em] text-ink-muted">{area}</p>}
        </div>
      </div>
    </section>
  );
}
