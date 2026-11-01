import type { Metadata, Viewport } from "next";
import "../globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileBar from "@/components/MobileBar";
import Analytics from "@/components/Analytics";
import { doc, LOCALES, localeFrom, type Locale } from "@/lib/content";
import type { Settings } from "@/lib/types";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  title: { default: "Rokate Catering", template: "%s" },
  icons: { icon: "/favicon.svg" },
};

export const viewport: Viewport = {
  themeColor: "#f7f4ee",
  width: "device-width",
  initialScale: 1,
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const locale = localeFrom(await params);
  const settings = doc<Settings>("settings", locale);

  return (
    <html lang={locale}>
      <body>
        <Header locale={locale} whatsapp={settings.whatsapp} />
        <main id="main" className="pt-[68px] md:pt-[76px]">
          {children}
        </main>
        <Footer locale={locale} settings={settings} />
        <MobileBar locale={locale} whatsapp={settings.whatsapp} />
        <Analytics gaId={settings.gaId} />
      </body>
    </html>
  );
}
