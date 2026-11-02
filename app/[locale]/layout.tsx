import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import "../globals.css";
import { Analytics } from "@/components/Analytics";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { MobileBar } from "@/components/MobileBar";
import { RevealObserver } from "@/components/Reveal";
import { SmoothAnchors } from "@/components/SmoothAnchors";
import { api } from "@/lib/api";
import { isLocale, t } from "@/lib/i18n";
import { href, SITE_URL, waLink } from "@/lib/site";
import type { SiteData } from "@/lib/types";

export const viewport: Viewport = { themeColor: "#faf8f3", width: "device-width", initialScale: 1 };

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const site = await api<SiteData>("site", locale);
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: site?.seo.title || "Rokate Catering", template: `%s | ${site?.company_name || "Rokate Catering"}` },
    description: site?.seo.description,
    icons: { icon: "/favicon.svg" },
  };
}

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const site = (await api<SiteData>("site", locale))!;
  const d = t(locale);

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body className="min-h-screen" suppressHydrationWarning>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-surface focus:px-4 focus:py-2">
          Skip to content
        </a>
        <Header
          locale={locale}
          logo={site.logo}
          wa={waLink(site.whatsapp_number, site.whatsapp_text)}
          homeHref={href(locale, "/")}
          labels={{ ...d.nav, proposal: d.cta.proposal, lang: d.lang, close: d.close }}
        />
        <main id="main">{children}</main>
        <Footer locale={locale} site={site} />
        <MobileBar locale={locale} site={site} />
        <Analytics />
        <RevealObserver />
        <SmoothAnchors />
      </body>
    </html>
  );
}
