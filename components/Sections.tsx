import Img from "./Img";
import Rail from "./Rail";
import { t } from "@/lib/i18n";
import type { Locale } from "@/lib/content";
import type { Home, Project } from "@/lib/types";

export function Paragraphs({ text, className = "body" }: { text: string; className?: string }) {
  return (
    <>
      {text.split(/\n{2,}/).map((p, i) => (
        <p key={i} className={`${className} ${i > 0 ? "mt-4" : ""}`}>
          {p}
        </p>
      ))}
    </>
  );
}

/** Rokate haqida va afzalliklar. */
export function About({ home }: { home: Home }) {
  return (
    <section className="container-x py-16 md:py-24">
      <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] md:gap-16">
        <div>
          <h2 className="h2">{home.about.title}</h2>
        </div>
        <div className="min-w-0">
          <Paragraphs text={home.about.text} className="body text-[16px] md:text-[17px]" />
          <ul className="mt-9">
            {home.about.advantages.map((a) => (
              <li key={a.title} className="border-t border-line py-4 last:border-b sm:flex sm:gap-8">
                <h3 className="text-[16px] font-bold sm:w-[46%] sm:shrink-0">{a.title}</h3>
                <p className="mt-1 text-[15px] leading-relaxed text-ink-soft sm:mt-0">{a.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/** "Мы работаем — вы отдыхаете" — haqiqiy ketma-ketlik, shuning uchun raqamlangan. */
export function Relax({ home }: { home: Home }) {
  return (
    <section className="bg-sand">
      <div className="container-x py-16 md:py-24">
        <div className="max-w-2xl">
          <h2 className="h2">{home.relax.title}</h2>
          <p className="lede mt-3">{home.relax.text}</p>
        </div>
        <ol className="mt-10 grid gap-x-10 gap-y-0 sm:grid-cols-2 lg:grid-cols-3">
          {home.relax.steps.map((step, i) => (
            <li key={step.title} className="border-t border-gold/40 py-5">
              <div className="flex items-baseline gap-3">
                <span className="text-[13px] font-bold tabular-nums text-gold-deep">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="text-[17px] font-bold">{step.title}</h3>
              </div>
              <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/** Qo'shimcha xizmatlar — hamkorlar orqali. */
export function Services({ home }: { home: Home }) {
  return (
    <section className="container-x py-16 md:py-24">
      <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-3">
        <h2 className="h2">{home.services.title}</h2>
        <p className="text-[15px] text-ink-soft">{home.services.note}</p>
      </div>
      <ul className="mt-9 grid gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
        {home.services.items.map((it) => (
          <li key={it.title} className="border-t border-line py-5">
            <h3 className="text-[17px] font-bold">{it.title}</h3>
            <p className="mt-1.5 text-[15px] leading-relaxed text-ink-soft">{it.text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** Portfolio — gorizontal lenta (yo'riqnomada ruxsat etilgan joylardan biri). */
export function Portfolio({ locale, home, projects }: { locale: Locale; home: Home; projects: Project[] }) {
  const s = t(locale);
  if (!projects.length) return null;

  return (
    <section id="portfolio" className="scroll-mt-20 bg-sand">
      <div className="container-x py-16 md:py-24">
        <div className="max-w-2xl">
          <h2 className="h2">{home.portfolio.title}</h2>
          <p className="lede mt-3">{home.portfolio.text}</p>
        </div>
        <div className="mt-10">
          <Rail hint={s.scrollHint}>
            {projects.map((p) => (
              <figure key={p.slug} className="w-[230px] md:w-[290px]">
                <div className="aspect-[4/5] overflow-hidden rounded-tile bg-line/40">
                  <Img src={p.photo} alt={p.title} sizes="290px" className="h-full w-full object-cover" />
                </div>
                <figcaption className="mt-3">
                  <h3 className="text-[15px] font-bold">{p.title}</h3>
                  <p className="mt-0.5 text-[13px] text-ink-soft">
                    {p.kind}, {p.place}
                  </p>
                </figcaption>
              </figure>
            ))}
          </Rail>
        </div>
      </div>
    </section>
  );
}
