import Link from "next/link";
import { t } from "@/lib/i18n";
import { href, telLink, waLink } from "@/lib/site";
import type { Locale, SiteData } from "@/lib/types";
import { Icon, WhatsAppIcon } from "./Icon";
import { Logo } from "./Logo";

export function Footer({ locale, site }: { locale: Locale; site: SiteData }) {
  const d = t(locale);
  const home = href(locale, "/");
  
  const wa = waLink(site.whatsapp_number, site.whatsapp_text);
  return (
    <footer className="bg-green-deep text-white/80" data-section="footer">
      <div className="container-x pt-16 pb-28 lg:pb-12">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div className="max-w-sm">
            <Logo logo={null} light />
            {site.tagline && <p className="mt-5 text-[15px] leading-relaxed">{site.tagline}</p>}
            {site.service_area && (
              <p className="mt-4 flex items-center gap-2 text-[14px] text-white/60"><Icon name="pin" size={16} />{site.service_area}</p>
            )}
          </div>

          <div>
            <h3 className="font-sans text-[12px] font-semibold uppercase tracking-[0.2em] text-gold-soft">{d.footer.explore}</h3>
            <ul className="mt-5 space-y-3 text-[15px]">
              <li><a className="link-underline" href={`${home}#directions`}>{d.nav.services}</a></li>
              <li><a className="link-underline" href={`${home}#packages`}>{d.nav.packages}</a></li>
              <li><a className="link-underline" href={`${home}#portfolio`}>{d.nav.portfolio}</a></li>
              <li><Link className="link-underline" href={href(locale, "/menu")}>{d.nav.menu}</Link></li>
              {site.nav_services.map((s) => (
                <li key={s.slug}><Link className="link-underline" href={href(locale, `/catering/${s.slug}`)}>{s.title}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-sans text-[12px] font-semibold uppercase tracking-[0.2em] text-gold-soft">{d.footer.contacts}</h3>
            <ul className="mt-5 space-y-3 text-[15px]">
              {wa && <li><a className="inline-flex items-center gap-2 link-underline" href={wa} target="_blank" rel="noopener" data-location="footer"><WhatsAppIcon size={16} />WhatsApp</a></li>}
              {site.phone && <li><a className="inline-flex items-center gap-2 link-underline" href={telLink(site.phone)} data-location="footer"><Icon name="phone" size={16} />{site.phone}</a></li>}
              {site.email && <li><a className="inline-flex items-center gap-2 link-underline" href={`mailto:${site.email}`} data-location="footer"><Icon name="mail" size={16} />{site.email}</a></li>}
              {site.instagram_url && <li><a className="inline-flex items-center gap-2 link-underline" href={site.instagram_url} target="_blank" rel="noopener" data-location="footer"><Icon name="instagram" size={16} />{d.footer.follow}</a></li>}
              {site.working_hours && <li className="text-white/60 text-[14px]">{site.working_hours}</li>}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/15 pt-6 text-[13px] text-white/55 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {site.company_name}. {d.footer.rights}</p>
          <div className="flex gap-6">
            <Link className="link-underline" href={href(locale, "/partners")}>{d.nav.partners}</Link>
            <Link className="link-underline" href={href(locale, "/privacy")}>{d.footer.privacy}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
