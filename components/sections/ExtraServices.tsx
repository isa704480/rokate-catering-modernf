import { Icon } from "@/components/Icon";
import { SectionHead } from "@/components/SectionHead";
import type { HomeData } from "@/lib/types";

export function ExtraServices({ data, eyebrow }: { data: HomeData["services"]; eyebrow: string }) {
  if (!data.items.length) return null;
  return (
    <section className="section" data-section="services">
      <div className="container-x grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <SectionHead eyebrow={eyebrow} title={data.title} text={data.text} />
          {data.note && <p className="reveal mt-6 border-l-2 border-gold pl-4 text-[14px] italic text-ink-muted">{data.note}</p>}
        </div>
        <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-[var(--radius-card)] border border-line bg-line sm:grid-cols-3 lg:col-span-8 lg:grid-cols-4">
          {data.items.map((s) => (
            <li key={s.title} className="reveal flex flex-col gap-4 bg-bg p-5 sm:p-6">
              <Icon name={s.icon} size={30} className="text-green" />
              <div>
                <p className="text-[15px] font-semibold leading-snug">{s.title}</p>
                {s.description && <p className="mt-1 text-[13px] text-ink-muted">{s.description}</p>}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
