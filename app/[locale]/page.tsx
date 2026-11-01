import type { Metadata } from "next";
import Hero from "@/components/Hero";
import Directions from "@/components/Directions";
import Packages from "@/components/Packages";
import Reviews from "@/components/Reviews";
import Faq from "@/components/Faq";
import ContactSection from "@/components/ContactSection";
import JsonLd from "@/components/JsonLd";
import { About, Relax, Services, Portfolio } from "@/components/Sections";
import { doc, collection, localeFrom, type Locale } from "@/lib/content";
import { pageMeta } from "@/lib/seo";
import type { Home, Settings, Direction, Pkg, Project, Review, Faq as FaqItem } from "@/lib/types";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = localeFrom(await params);
  return pageMeta("home", locale, "/");
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = localeFrom(await params);

  const settings = doc<Settings>("settings", locale);
  const home = doc<Home>("home", locale);
  const faq = doc<{ items: FaqItem[] }>("faq", locale);
  const directions = collection<Direction>("directions", locale);
  const packages = collection<Pkg>("packages", locale);
  const projects = collection<Project>("portfolio", locale);
  const reviews = collection<Review>("reviews", locale);

  return (
    <>
      <JsonLd settings={settings} locale={locale} directions={directions} />

      {/* Tartib yo'riqnomaning 6-bo'limi bo'yicha */}
      <Hero locale={locale} home={home} settings={settings} />
      <About home={home} />
      <Directions locale={locale} items={directions} title={home.directionsTitle} text={home.directionsText} />
      <Packages locale={locale} items={packages} title={home.packagesTitle} text={home.packagesText} />
      <Relax home={home} />
      <Services home={home} />
      <Portfolio locale={locale} home={home} projects={projects} />
      <Reviews items={reviews} title={home.portfolio.title} />

      <section className="container-x py-16 md:py-24">
        <Faq items={faq.items} title={home.faqTitle} />
      </section>

      <ContactSection locale={locale} settings={settings} title={home.cta.title} text={home.cta.text} />
    </>
  );
}
