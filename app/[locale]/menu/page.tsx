import type { Metadata } from "next";
import Link from "next/link";
import { Icon, WhatsAppIcon } from "@/components/Icon";
import { PageHero } from "@/components/PageHero";
import { api } from "@/lib/api";
import { formatPrice, isLocale, t } from "@/lib/i18n";
import { buildMeta } from "@/lib/seo";
import { href, waLink } from "@/lib/site";
import type { Locale, MenuData, SiteData } from "@/lib/types";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const site = await api<SiteData>("site", locale);
  return buildMeta(locale, "/menu", null, site, `${t(locale).menu.title} — ${site?.company_name ?? "Rokate Catering"}`);
}

export default async function MenuPage({ params }: Props) {
  const { locale: l } = await params;
  const locale = l as Locale;
  const [menu, site] = await Promise.all([api<MenuData>("menu", locale), api<SiteData>("site", locale)]);
  const d = t(locale);
  if (!menu || !site) return null;
  const wa = waLink(site.whatsapp_number, site.whatsapp_text, d.menu.title);
  const home = href(locale, "/");

  return (
    <>
      <PageHero eyebrow={site.company_name} title={d.menu.title} intro={menu.intro}
                crumbs={[{ href: home, label: d.nav.home }, { href: href(locale, "/menu"), label: d.menu.title }]} />
      <section className="pb-20 lg:pb-28">
        <div className="container-x">
          {menu.pdf && (
            <a href={menu.pdf} target="_blank" rel="noopener" className="btn btn-primary mb-10" data-event="menu_pdf_download">
              <Icon name="download" size={18} />{d.cta.downloadMenu}
            </a>
          )}
          <nav className="sticky top-[72px] z-10 -mx-5 mb-8 flex gap-2 overflow-x-auto bg-bg/95 px-5 py-3 backdrop-blur md:mx-0 md:px-0" aria-label={d.menu.title}>
            {menu.categories.map((c, i) => (
              <a key={c.name} href={`#cat-${i}`} className="shrink-0 rounded-full border border-line bg-surface px-4 py-2 text-[14px] hover:border-ink">{c.name}</a>
            ))}
          </nav>
          <div className="grid gap-x-16 gap-y-14 lg:grid-cols-2">
            {menu.categories.map((c, i) => (
              <div key={c.name} id={`cat-${i}`} className="reveal scroll-mt-36">
                <h2 className="border-b border-gold/50 pb-3 text-[2.2rem]">{c.name}</h2>
                <ul className="mt-2">
                  {c.items.map((it) => (
                    <li key={it.name} className="flex items-baseline justify-between gap-6 border-b border-line py-4">
                      <div>
                        <p className="text-[16px] font-semibold">{it.name}</p>
                        {it.description && <p className="mt-1 text-[14px] text-ink-muted">{it.description}</p>}
                      </div>
                      {it.price != null && <p className="shrink-0 font-display text-[1.3rem]">{formatPrice(locale, it.price)} {d.price.currency}</p>}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="reveal mt-20 grid gap-6 rounded-[var(--radius-card)] bg-green-deep p-8 text-white lg:grid-cols-[1fr_auto] lg:items-center lg:p-12">
            <div>
              <h2 className="text-[2.2rem] text-white">{d.menu.notSure}</h2>
              <p className="mt-3 max-w-xl text-white/75">{d.menu.notSureText}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href={`${home}#packages`} className="btn btn-light">{d.nav.packages}</Link>
              {wa && <a href={wa} target="_blank" rel="noopener" className="btn btn-ghost-light" data-location="menu"><WhatsAppIcon size={18} />WhatsApp</a>}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
