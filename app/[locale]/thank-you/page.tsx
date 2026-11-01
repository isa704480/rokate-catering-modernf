import type { Metadata } from "next";
import Link from "next/link";
import { WhatsAppLink } from "@/components/Contacts2";
import { doc, localeFrom, LOCALES } from "@/lib/content";
import { pageMeta } from "@/lib/seo";
import { t, href } from "@/lib/i18n";
import type { Settings } from "@/lib/types";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = localeFrom(await params);
  return { ...pageMeta("thanks", locale, "/thank-you"), robots: { index: false, follow: false } };
}

export default async function ThankYouPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = localeFrom(await params);
  const s = t(locale);
  const settings = doc<Settings>("settings", locale);

  return (
    <section className="container-x flex min-h-[62vh] items-center py-16">
      <div className="max-w-xl">
        <div className="rule w-12" />
        <h1 className="h2 mt-6">{s.thanks.title}</h1>
        <p className="lede mt-4">{s.thanks.text}</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <WhatsAppLink whatsapp={settings.whatsapp} className="btn btn-wa sm:px-8" place="thank_you">
            {s.whatsapp}
          </WhatsAppLink>
          <Link href={href(locale)} className="btn btn-ghost sm:px-8">
            {s.backHome}
          </Link>
        </div>
      </div>
    </section>
  );
}
