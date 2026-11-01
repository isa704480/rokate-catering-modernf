import type { Metadata } from "next";
import { Paragraphs } from "@/components/Sections";
import { doc, localeFrom, LOCALES } from "@/lib/content";
import { pageMeta } from "@/lib/seo";
import type { PageDoc } from "@/lib/types";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = localeFrom(await params);
  return { ...pageMeta("privacy", locale, "/privacy"), robots: { index: false, follow: true } };
}

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = localeFrom(await params);
  const page = doc<PageDoc>("pages/privacy", locale);

  return (
    <section className="container-x py-12 md:py-20">
      <h1 className="h2 max-w-3xl">{page.title}</h1>
      <p className="lede mt-4">{page.lede}</p>
      <div className="mt-10 max-w-3xl">
        {page.blocks.map((b) => (
          <section key={b.title} className="border-t border-line py-6 last:border-b">
            <h2 className="text-[18px] font-bold">{b.title}</h2>
            <div className="mt-2">
              <Paragraphs text={b.text} className="body text-[15px]" />
            </div>
          </section>
        ))}
      </div>
    </section>
  );
}
