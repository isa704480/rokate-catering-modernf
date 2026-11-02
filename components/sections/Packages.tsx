import { Img } from "@/components/Img";
import { PackageCard } from "@/components/PackageCard";
import { RequestPackageButton } from "@/components/RequestPackageButton";
import { SectionHead } from "@/components/SectionHead";
import { formatPrice, t } from "@/lib/i18n";
import type { HomeData, Locale } from "@/lib/types";

export function Packages({ data, offers, locale, eyebrow }: { data: HomeData["packages"]; offers: HomeData["offers"]; locale: Locale; eyebrow: string }) {
  if (!data.items.length && !offers.length) return null;
  const d = t(locale);
  return (
    <section id="packages" className="section" data-section="packages">
      <div className="container-x">
        <SectionHead eyebrow={eyebrow} title={data.title} text={data.text} />

        {offers.map((o) => (
          <div key={o.id} className="reveal mt-12 grid overflow-hidden rounded-[var(--radius-card)] bg-green-deep text-white md:grid-cols-2">
            {o.image && <Img img={o.image} sizes="(min-width:768px) 50vw, 100vw" className="h-64 w-full object-cover md:h-full" />}
            <div className="flex flex-col justify-center p-8 lg:p-12">
              <p className="eyebrow !text-lime">
                {d.badge.seasonal}{o.ends_at ? ` · ${d.offerUntil} ${new Date(o.ends_at).toLocaleDateString(locale === "ru" ? "ru-RU" : "en-GB", { day: "numeric", month: "long" })}` : ""}
              </p>
              <h3 className="mt-4 text-[2.2rem] text-white">{o.title}</h3>
              {o.text && <p className="mt-4 text-white/80 leading-relaxed">{o.text}</p>}
              {o.price != null && <p className="mt-5 font-display text-[1.8rem]">{formatPrice(locale, o.price)} {d.price.currency}</p>}
              <div className="mt-7">
                <RequestPackageButton slug={o.package || ""} label={o.cta_text || d.cta.request} className="btn btn-light" />
              </div>
            </div>
          </div>
        ))}

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {data.items.map((p) => <PackageCard key={p.slug} p={p} locale={locale} />)}
        </div>
      </div>
    </section>
  );
}
