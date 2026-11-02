import { Img } from "@/components/Img";
import { paragraphs } from "@/lib/site";
import type { HomeData } from "@/lib/types";

export function About({ about }: { about: HomeData["about"] }) {
  if (!about.title) return null;
  return (
    <section id="about" className="section" data-section="about">
      <div className="container-x grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="reveal lg:col-span-5">
          <div className="relative aspect-[4/5] overflow-hidden">
            <Img img={about.image} sizes="(min-width:1024px) 40vw, 100vw" className="h-full w-full object-cover" />
          </div>
        </div>
        <div className="lg:col-span-6 lg:col-start-7">
          <div className="reveal">
            {about.eyebrow && <p className="eyebrow">{about.eyebrow}</p>}
            <h2 className="h2 mt-4">{about.title}</h2>
          </div>
          <div className="reveal mt-6 space-y-4">
            {paragraphs(about.text).map((p, i) => <p key={i} className="lead">{p}</p>)}
          </div>
          {about.stats.length > 0 && (
            <dl className="reveal mt-10 grid grid-cols-2 gap-6 border-t border-line pt-8 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
              {about.stats.map((s) => (
                <div key={s.label}>
                  <dt className="sr-only">{s.label}</dt>
                  <dd className="font-display text-[2.6rem] leading-none text-green">{s.value}</dd>
                  <dd className="mt-2 text-[13px] text-ink-muted">{s.label}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </div>
    </section>
  );
}
