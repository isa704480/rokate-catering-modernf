import { Img } from "@/components/Img";
import type { HomeData } from "@/lib/types";

export function Relax({ data, cta, ctaHref }: { data: HomeData["relax"]; cta: string; ctaHref: string }) {
  if (!data.title) return null;
  return (
    <section className="relative overflow-hidden bg-green-deep text-white" data-section="relax">
      <div className="grid lg:grid-cols-2">
        <div className="relative min-h-[420px] lg:min-h-[760px]">
          <Img img={data.image} sizes="(min-width:1024px) 50vw, 100vw" className="absolute inset-0 h-full w-full object-cover" />
        </div>
        <div className="container-x !max-w-none flex flex-col justify-center py-16 lg:px-20 lg:py-24">
          <div className="reveal max-w-xl">
            {data.eyebrow && <p className="eyebrow !text-lime">{data.eyebrow}</p>}
            <h2 className="mt-5 text-[clamp(2.6rem,5vw,4.4rem)] italic text-white">{data.title}</h2>
            {data.text && <p className="mt-6 text-[17px] leading-relaxed text-white/75">{data.text}</p>}
          </div>
          {data.steps.length > 0 && (
            <ol className="mt-12 grid max-w-xl gap-x-10 gap-y-8 sm:grid-cols-2">
              {data.steps.map((s, i) => (
                <li key={s.title} className="reveal border-t border-white/20 pt-5" style={{ transitionDelay: `${i * 90}ms` }}>
                  <span className="font-display text-[15px] italic text-gold-soft">0{i + 1}</span>
                  <h3 className="mt-2 font-sans text-[17px] font-semibold tracking-normal">{s.title}</h3>
                  {s.text && <p className="mt-2 text-[14px] leading-relaxed text-white/65">{s.text}</p>}
                </li>
              ))}
            </ol>
          )}
          <div className="reveal mt-12">
            <a href={ctaHref} className="btn btn-light" data-event="cta_click" data-location="relax">{cta}</a>
          </div>
        </div>
      </div>
    </section>
  );
}
