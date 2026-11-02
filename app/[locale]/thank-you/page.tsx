import type { Metadata } from "next";
import Link from "next/link";
import { Icon, WhatsAppIcon } from "@/components/Icon";
import { api } from "@/lib/api";
import { isLocale, t } from "@/lib/i18n";
import { href, waLink } from "@/lib/site";
import type { Locale, SiteData } from "@/lib/types";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function ThankYou({ params, searchParams }: {
  params: Promise<{ locale: string }>; searchParams: Promise<{ type?: string }>;
}) {
  const { locale: l } = await params;
  const { type } = await searchParams;
  if (!isLocale(l)) return null;
  const locale = l as Locale;
  const d = t(locale);
  const site = await api<SiteData>("site", locale);
  const partner = type === "partner";
  const wa = site ? waLink(site.whatsapp_number, site.whatsapp_text) : "";
  return (
    <section className="container-x flex min-h-[70vh] flex-col items-center justify-center py-24 text-center">
      <span className="grid h-20 w-20 place-items-center rounded-full bg-green text-white"><Icon name="check" size={36} /></span>
      <h1 className="mt-8 max-w-2xl text-[clamp(2.4rem,5vw,3.8rem)]">{partner ? d.thanks.partnerTitle : d.thanks.title}</h1>
      <p className="lead mt-5 max-w-lg">{partner ? d.thanks.partnerText : d.thanks.text}</p>
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        {wa && !partner && <a href={wa} target="_blank" rel="noopener" className="btn btn-primary" data-location="thank_you"><WhatsAppIcon size={18} />WhatsApp</a>}
        <Link href={href(locale, "/")} className="btn btn-outline">{d.cta.back}</Link>
      </div>
    </section>
  );
}
