import type { Metadata } from "next";
import { PageHero, Blocks, ListCols, Gallery } from "@/components/PageParts";
import Packages from "@/components/Packages";
import ContactSection from "@/components/ContactSection";
import JsonLd from "@/components/JsonLd";
import { doc, collection, localeFrom, LOCALES } from "@/lib/content";
import { pageMeta } from "@/lib/seo";
import type { PageDoc, Settings, Pkg, Home } from "@/lib/types";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = localeFrom(await params);
  return pageMeta("corporate", locale, "/corporate-catering");
}

export default async function CorporatePage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = localeFrom(await params);
  const page = doc<PageDoc>("pages/corporate-catering", locale);
  const settings = doc<Settings>("settings", locale);
  const home = doc<Home>("home", locale);
  const packages = collection<Pkg>("packages", locale);

  return (
    <>
      <JsonLd settings={settings} locale={locale} />
      <PageHero page={page} />
      <Blocks page={page} />
      <ListCols page={page} />
      <Gallery locale={locale} page={page} />
      <Packages locale={locale} items={packages} title={home.packagesTitle} text={home.packagesText} />
      <ContactSection locale={locale} settings={settings} title={home.cta.title} text={home.cta.text} />
    </>
  );
}
