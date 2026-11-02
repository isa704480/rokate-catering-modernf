import { t } from "@/lib/i18n";
import { href, telLink, waLink } from "@/lib/site";
import type { Locale, SiteData } from "@/lib/types";
import { Icon, WhatsAppIcon } from "./Icon";

/** Mobil pastki panel: WhatsApp · Qo'ng'iroq · Ariza */
export function MobileBar({ locale, site, context }: { locale: Locale; site: SiteData; context?: string }) {
  const d = t(locale);
  const wa = waLink(site.whatsapp_number, site.whatsapp_text, context);
  const home = href(locale, "/");
  const items = [
    wa && { href: wa, label: d.cta.whatsapp, icon: <WhatsAppIcon size={20} />, ext: true },
    site.phone && { href: telLink(site.phone), label: d.cta.call, icon: <Icon name="phone" size={20} /> },
    { href: `${home}#request`, label: d.cta.request, icon: <Icon name="mail" size={20} />, primary: true },
  ].filter(Boolean) as { href: string; label: string; icon: React.ReactNode; ext?: boolean; primary?: boolean }[];

  return (
    <div className="lg:hidden fixed inset-x-0 bottom-0 z-30 border-t border-line bg-bg/95 backdrop-blur-md pb-[env(safe-area-inset-bottom)]"
         data-section="mobile_bar">
      <div className="grid gap-2 px-3 py-2.5" style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0,1fr))` }}>
        {items.map((i) => (
          <a key={i.label} href={i.href} {...(i.ext ? { target: "_blank", rel: "noopener" } : {})} data-location="mobile_bar"
             className={`flex h-12 items-center justify-center gap-2 rounded-full text-[14px] font-semibold ${
               i.primary ? "bg-green text-white" : "border border-line bg-surface text-ink"}`}>
            <span className={i.primary ? "" : i.label === d.cta.whatsapp ? "text-[#1f9d55]" : "text-green"}>{i.icon}</span>
            {i.label}
          </a>
        ))}
      </div>
    </div>
  );
}
