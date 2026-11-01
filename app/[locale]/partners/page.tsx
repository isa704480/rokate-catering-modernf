import type { Metadata } from "next";
import { PageHero, Blocks, ListCols } from "@/components/PageParts";
import PartnerForm from "@/components/PartnerForm";
import { Contact } from "@/components/Contacts";
import { doc, localeFrom, LOCALES } from "@/lib/content";
import { pageMeta } from "@/lib/seo";
import { t } from "@/lib/i18n";
import type { PageDoc, Settings } from "@/lib/types";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = localeFrom(await params);
  return pageMeta("partners", locale, "/partners");
}

export default async function PartnersPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = localeFrom(await params);
  const s = t(locale);
  const page = doc<PageDoc>("pages/partners", locale);
  const settings = doc<Settings>("settings", locale);

  return (
    <>
      <PageHero page={page} />
      <Blocks page={page} />
      <ListCols page={page} />

      <section id="contact" className="scroll-mt-20 border-t border-line">
        <div className="container-x py-16 md:py-24">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] lg:gap-16">
            <div>
              <h2 className="h2">{s.partners}</h2>
              <div className="mt-8">
                <h3 className="text-[13px] font-bold uppercase tracking-[0.18em] text-ink-soft">{s.nav.contact}</h3>
                <ul className="mt-4 space-y-2.5 text-[16px] font-medium">
                  <Contact settings={settings} />
                </ul>
                <p className="mt-4 text-[14px] text-ink-soft">{settings.hours}</p>
              </div>
            </div>
            <div className="min-w-0 rounded-card border border-line bg-surface p-5 md:p-8">
              <PartnerForm locale={locale} siteKey={settings.turnstileSiteKey} whatsapp={settings.whatsapp} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
