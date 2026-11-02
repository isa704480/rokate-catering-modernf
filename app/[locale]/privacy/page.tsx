import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/PageHero";
import { api } from "@/lib/api";
import { isLocale, t } from "@/lib/i18n";
import { buildMeta } from "@/lib/seo";
import { href } from "@/lib/site";
import type { LegalData, Locale, SiteData } from "@/lib/types";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const [p, site] = await Promise.all([api<LegalData>("legal/privacy", locale), api<SiteData>("site", locale)]);
  return buildMeta(locale, "/privacy", p?.seo ?? null, site, p?.title);
}

/** Oddiy matn: bo'sh qator — yangi paragraf, "## " — sarlavha, *matn* — kursiv. */
function Body({ text }: { text: string }) {
  return (
    <>
      {text.split(/\n\s*\n/).map((block, i) => {
        const lines = block.trim().split("\n");
        const head = lines[0].startsWith("## ") ? lines.shift()!.slice(3) : null;
        const rest = lines.join(" ").trim();
        const italic = /^\*(.+)\*$/.exec(rest);
        return (
          <div key={i}>
            {head && <h2>{head}</h2>}
            {rest && (italic ? <p><em>{italic[1]}</em></p> : <p>{rest}</p>)}
          </div>
        );
      })}
    </>
  );
}

export default async function Privacy({ params }: Props) {
  const { locale: l } = await params;
  const locale = l as Locale;
  const p = await api<LegalData>("legal/privacy", locale);
  if (!p) notFound();
  const d = t(locale);
  return (
    <>
      <PageHero title={p.title} crumbs={[{ href: href(locale, "/"), label: d.nav.home }, { href: href(locale, "/privacy"), label: p.title }]} />
      <section className="container-x pb-24">
        <div className="prose-rk max-w-2xl text-[16px]"><Body text={p.body} /></div>
      </section>
    </>
  );
}
