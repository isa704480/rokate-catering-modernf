import RequestForm from "./RequestForm";
import { Contact } from "./Contacts";
import { t } from "@/lib/i18n";
import type { Locale } from "@/lib/content";
import type { Settings } from "@/lib/types";

export default function ContactSection({
  locale,
  settings,
  title,
  text,
}: {
  locale: Locale;
  settings: Settings;
  title: string;
  text: string;
}) {
  const s = t(locale);

  return (
    <section id="contact" className="scroll-mt-20 border-t border-line">
      <div className="container-x py-16 md:py-24">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] lg:gap-16">
          <div>
            <h2 className="h2">{title}</h2>
            <p className="lede mt-3">{text}</p>

            <div className="mt-8">
              <h3 className="text-[13px] font-bold uppercase tracking-[0.18em] text-ink-soft">{s.nav.contact}</h3>
              <ul className="mt-4 space-y-2.5 text-[16px] font-medium">
                <Contact settings={settings} />
              </ul>
              <p className="mt-4 text-[14px] text-ink-soft">{settings.hours}</p>
              <p className="text-[14px] text-ink-soft">{settings.city}</p>
            </div>
          </div>

          <div className="min-w-0 rounded-card border border-line bg-surface p-5 md:p-8">
            <RequestForm locale={locale} siteKey={settings.turnstileSiteKey} whatsapp={settings.whatsapp} />
          </div>
        </div>
      </div>
    </section>
  );
}
