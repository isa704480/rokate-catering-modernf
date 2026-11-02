import type { Metadata } from "next";
import { Icon } from "@/components/Icon";
import { PageHero } from "@/components/PageHero";
import { PartnerForm } from "@/components/PartnerForm";
import { FaqSection } from "@/components/sections/WhyFaq";
import { api } from "@/lib/api";
import { isLocale, t } from "@/lib/i18n";
import { buildMeta } from "@/lib/seo";
import { href, paragraphs } from "@/lib/site";
import type { Locale, PartnersData, SiteData } from "@/lib/types";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const [p, site] = await Promise.all([api<PartnersData>("partners", locale), api<SiteData>("site", locale)]);
  return buildMeta(locale, "/partners", p?.seo ?? null, site, p?.title);
}

export default async function PartnersPage({ params }: Props) {
  const { locale: l } = await params;
  const locale = l as Locale;
  const p = await api<PartnersData>("partners", locale);
  if (!p) return null;
  const d = t(locale);
  return (
    <>
      <PageHero eyebrow="B2B" title={p.title} intro={p.intro} image={p.image}
                crumbs={[{ href: href(locale, "/"), label: d.nav.home }, { href: href(locale, "/partners"), label: d.nav.partners }]} />
      <section className="section pt-0 lg:pt-0">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            {p.audience_title && <h2 className="reveal text-[2.2rem]">{p.audience_title}</h2>}
            <ul className="mt-6 space-y-3">
              {p.audience.map((a) => (
                <li key={a} className="reveal flex items-start gap-3 text-[16px]"><Icon name="check" size={20} className="mt-0.5 shrink-0 text-green" />{a}</li>
              ))}
            </ul>
            {p.offer_title && <h2 className="reveal mt-12 text-[2.2rem]">{p.offer_title}</h2>}
            <div className="prose-rk reveal mt-4">{paragraphs(p.offer_text).map((x, i) => <p key={i}>{x}</p>)}</div>
          </div>
          <div id="partner-form" className="reveal card p-6 sm:p-8 lg:col-span-7 lg:p-10">
            <h2 className="text-[2.2rem]">{p.form_title || d.form.partnerSubmit}</h2>
            <div className="mt-8">
              <PartnerForm locale={locale} labels={d.form} thankYouHref={`${href(locale, "/thank-you")}?type=partner`} />
            </div>
          </div>
        </div>
      </section>
      <FaqSection title="FAQ" items={p.faq} eyebrow="B2B" />
    </>
  );
}
