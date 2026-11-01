import type { Metadata } from "next";
import Packages from "@/components/Packages";
import ContactSection from "@/components/ContactSection";
import { Paragraphs } from "@/components/Sections";
import { doc, collection, localeFrom, LOCALES } from "@/lib/content";
import { pageMeta } from "@/lib/seo";
import { t } from "@/lib/i18n";
import type { Settings, Pkg, Home } from "@/lib/types";

type Menu = {
  title: string;
  lede: string;
  menuTitle: string;
  menuNote: string;
  pdf: string;
  pdfLabel: string;
  sections: { title: string; text: string }[];
};

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = localeFrom(await params);
  return pageMeta("menu", locale, "/menu");
}

export default async function MenuPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = localeFrom(await params);
  const s = t(locale);
  const menu = doc<Menu>("menu", locale);
  const settings = doc<Settings>("settings", locale);
  const home = doc<Home>("home", locale);
  const packages = collection<Pkg>("packages", locale);

  return (
    <>
      <section className="container-x pt-8 pb-2 md:pt-14">
        <h1 className="h2 max-w-3xl">{menu.title}</h1>
        <p className="lede mt-4">{menu.lede}</p>
      </section>

      <Packages locale={locale} items={packages} title={home.packagesTitle} text={home.packagesText} showMenuLink={false} />

      {/* To'liq menyu — oddiy sahifa. Har bir taom alohida kartochka qilinmaydi. */}
      <section id="menu" className="scroll-mt-20 bg-sand">
        <div className="container-x py-16 md:py-24">
          <div className="grid gap-10 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.4fr)] md:gap-16">
            <div>
              <h2 className="h2">{menu.menuTitle}</h2>
              <p className="body mt-3 text-[15px]">{menu.menuNote}</p>
              {menu.pdf && (
                <a href={menu.pdf} target="_blank" rel="noopener" className="btn btn-ghost mt-6">
                  {menu.pdfLabel}
                </a>
              )}
            </div>
            <dl className="min-w-0">
              {menu.sections.map((sec) => (
                <div key={sec.title} className="border-t border-gold/40 py-5 last:border-b">
                  <dt className="text-[17px] font-bold">{sec.title}</dt>
                  <dd className="mt-1.5">
                    <Paragraphs text={sec.text} className="body text-[15px]" />
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <ContactSection locale={locale} settings={settings} title={home.cta.title} text={home.cta.text} />
    </>
  );
}
