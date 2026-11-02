import { Icon, WhatsAppIcon } from "@/components/Icon";
import { InquiryForm } from "@/components/InquiryForm";
import { t } from "@/lib/i18n";
import { href, telLink, waLink } from "@/lib/site";
import type { Locale, Package, SiteData } from "@/lib/types";

export function RequestSection({ locale, site, title, text, packages, source, defaultLocation, context }: {
  locale: Locale; site: SiteData; title: string; text: string; packages: Package[]; source: string;
  defaultLocation?: string; context?: string;
}) {
  const d = t(locale);
  const wa = waLink(site.whatsapp_number, site.whatsapp_text, context);
  return (
    <section id="request" className="section bg-sand/60" data-section="request">
      <div className="container-x grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="reveal">
            <p className="eyebrow">{d.nav.contact}</p>
            <h2 className="h2 mt-4">{title || d.cta.proposal}</h2>
            {text && <p className="lead mt-5">{text}</p>}
          </div>
          <ul className="reveal mt-8 space-y-4 text-[15px]">
            {wa && (
              <li>
                <a href={wa} target="_blank" rel="noopener" data-location="request"
                   className="btn w-full justify-start border border-line bg-surface !px-5 hover:border-ink sm:w-auto">
                  <WhatsAppIcon size={20} className="text-[#1f9d55]" />WhatsApp
                </a>
              </li>
            )}
            {site.phone && <li><a href={telLink(site.phone)} className="inline-flex items-center gap-3 link-underline" data-location="request"><Icon name="phone" size={18} className="text-green" />{site.phone}</a></li>}
            {site.email && <li><a href={`mailto:${site.email}`} className="inline-flex items-center gap-3 link-underline" data-location="request"><Icon name="mail" size={18} className="text-green" />{site.email}</a></li>}
            {site.service_area && <li className="inline-flex items-center gap-3 text-ink-muted"><Icon name="pin" size={18} className="text-green" />{site.service_area}</li>}
          </ul>
        </div>
        <div className="reveal card p-6 sm:p-8 lg:col-span-8 lg:p-10">
          <InquiryForm
            locale={locale}
            labels={d.form}
            eventTypes={site.event_types.map((e) => ({ value: e.slug, label: e.name }))}
            locations={site.locations.map((l) => ({ value: l.value, label: d.loc[l.value] || l.label }))}
            packages={packages.map((p) => ({ value: p.slug, label: p.name }))}
            defaultLocation={defaultLocation}
            thankYouHref={href(locale, "/thank-you")}
            privacyHref={href(locale, "/privacy")}
            source={source}
          />
        </div>
      </div>
    </section>
  );
}
