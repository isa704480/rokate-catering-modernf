import { FaqAccordion } from "@/components/FaqAccordion";
import { Icon } from "@/components/Icon";
import { SectionHead } from "@/components/SectionHead";
import type { Faq, HomeData } from "@/lib/types";

export function WhyUs({ data }: { data: HomeData["why"] }) {
  if (!data.items.length) return null;
  return (
    <section className="section bg-sand/60" data-section="why">
      <div className="container-x">
        <SectionHead eyebrow="Rokate" title={data.title} center />
        <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {data.items.map((w, i) => (
            <div key={w.title} className="reveal text-center" style={{ transitionDelay: `${i * 80}ms` }}>
              <span className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-gold/50 text-green">
                <Icon name={w.icon} size={28} />
              </span>
              <h3 className="mt-5 text-[1.6rem]">{w.title}</h3>
              {w.text && <p className="mx-auto mt-3 max-w-xs text-[15px] leading-relaxed text-ink-muted">{w.text}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FaqList({ items }: { items: Faq[] }) {
  return <FaqAccordion items={items} />;
}

export function FaqSection({ title, items, eyebrow }: { title: string; items: Faq[]; eyebrow: string }) {
  if (!items.length) return null;
  return (
    <section className="section" data-section="faq">
      <div className="container-x grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-4"><SectionHead eyebrow={eyebrow} title={title} /></div>
        <div className="lg:col-span-8"><FaqList items={items} /></div>
      </div>
    </section>
  );
}
