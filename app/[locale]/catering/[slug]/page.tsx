import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { PackageCard } from "@/components/PackageCard";
import { PageHero } from "@/components/PageHero";
import { SectionHead } from "@/components/SectionHead";
import { ServiceGallery } from "@/components/ServiceGallery";
import { RequestSection } from "@/components/sections/RequestSection";
import { FaqSection } from "@/components/sections/WhyFaq";
import { api } from "@/lib/api";
import { isLocale, t } from "@/lib/i18n";
import { buildMeta } from "@/lib/seo";
import { href, paragraphs, SITE_URL } from "@/lib/site";
import type { Locale, ServiceData, SiteData } from "@/lib/types";

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const [s, site] = await Promise.all([api<ServiceData>(`services/${slug}`, locale), api<SiteData>("site", locale)]);
  if (!s) return {};
  return buildMeta(locale, `/catering/${slug}`, s.seo, site, s.headline);
}

export default async function ServicePage({ params }: Props) {
  const { locale: l, slug } = await params;
  const locale = l as Locale;
  const [s, site] = await Promise.all([api<ServiceData>(`services/${slug}`, locale), api<SiteData>("site", locale)]);
  if (!s || !site) notFound();
  const d = t(locale);
  const url = `${SITE_URL}${href(locale, `/catering/${slug}`)}`;

  return (
    <>
      <JsonLd data={[
        { "@context": "https://schema.org", "@type": "Service", name: s.headline, serviceType: s.title, url,
          provider: { "@type": "Organization", name: site.company_name, url: SITE_URL }, areaServed: site.service_area || "Dubai" },
        { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
          { "@type": "ListItem", position: 1, name: d.nav.home, item: `${SITE_URL}${href(locale, "/")}` },
          { "@type": "ListItem", position: 2, name: s.title, item: url }] },
      ]} />
      <PageHero eyebrow={s.title} title={s.headline} intro={s.intro} image={s.image}
                crumbs={[{ href: href(locale, "/"), label: d.nav.home }, { href: url, label: s.title }]} />

      {(s.body || s.options.length > 0) && (
        <section className="section pt-0 lg:pt-0">
          <div className="container-x grid gap-12 lg:grid-cols-12">
            <div className="prose-rk reveal lg:col-span-6 text-[17px]">
              {paragraphs(s.body).map((p, i) => <p key={i}>{p}</p>)}
            </div>
            {s.options.length > 0 && (
              <div className="lg:col-span-5 lg:col-start-8">
                <h2 className="reveal text-[2rem]">{d.service.options}</h2>
                <ul className="mt-6 divide-y divide-line border-y border-line">
                  {s.options.map((o) => (
                    <li key={o.title} className="reveal py-5">
                      <h3 className="font-sans text-[17px] font-semibold tracking-normal">{o.title}</h3>
                      {o.text && <p className="mt-1.5 text-[15px] text-ink-muted">{o.text}</p>}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}

      {s.packages.length > 0 && (
        <section className="section bg-sand/60">
          <div className="container-x">
            <SectionHead eyebrow={d.nav.packages} title={d.service.packages} />
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {s.packages.map((p) => <PackageCard key={p.slug} p={p} locale={locale} />)}
            </div>
          </div>
        </section>
      )}

      {s.gallery.length > 0 && (
        <section className="section">
          <div className="container-x">
            <SectionHead eyebrow={d.nav.portfolio} title={d.service.gallery} />
            <ServiceGallery images={s.gallery} labels={{ close: d.close, prev: d.prev, next: d.next }} />
          </div>
        </section>
      )}

      <section className="section bg-green-deep text-white">
        <div className="container-x">
          <h2 className="h2 reveal text-white">{d.service.process}</h2>
          <ol className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {d.service.steps.map(([title, text], i) => (
              <li key={title} className="reveal border-t border-white/20 pt-5">
                <span className="font-display text-[15px] italic text-gold-soft">0{i + 1}</span>
                <h3 className="mt-2 font-sans text-[17px] font-semibold tracking-normal">{title}</h3>
                <p className="mt-2 text-[14px] text-white/65">{text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <FaqSection title="FAQ" items={s.faq} eyebrow={s.title} />
      <RequestSection locale={locale} site={site} title={d.cta.proposal} text="" packages={s.packages}
                      source={`/catering/${slug}`} defaultLocation={s.location_type} context={s.title} />
    </>
  );
}
