import Link from "next/link";
import Logo from "./Logo";
import { t, href } from "@/lib/i18n";
import type { Locale } from "@/lib/content";
import type { Settings } from "@/lib/types";
import { Contact } from "./Contacts";

export default function Footer({ locale, settings }: { locale: Locale; settings: Settings }) {
  const s = t(locale);
  const year = new Date().getFullYear();

  return (
    <footer className="bg-green-deep text-bg">
      <div className="container-x py-14 md:py-16">
        <div className="grid gap-10 md:grid-cols-[1.1fr_1fr_1fr]">
          <div>
            <Logo light className="h-14 w-auto" />
            <p className="slogan mt-4 text-gold">Taste | Style | Quality</p>
            <p className="mt-4 max-w-[34ch] text-[15px] leading-relaxed text-bg/80">{settings.city}</p>
          </div>

          <div>
            <h2 className="text-[13px] font-bold uppercase tracking-[0.18em] text-bg/70">Rokate</h2>
            <ul className="mt-4 space-y-2.5 text-[15px]">
              <li>
                <Link href={`${href(locale)}#directions`} className="hover:text-gold">
                  {s.nav.directions}
                </Link>
              </li>
              <li>
                <Link href={href(locale, "/menu")} className="hover:text-gold">
                  {s.nav.packages}
                </Link>
              </li>
              <li>
                <Link href={href(locale, "/yacht-catering")} className="hover:text-gold">
                  Yacht Catering
                </Link>
              </li>
              <li>
                <Link href={href(locale, "/corporate-catering")} className="hover:text-gold">
                  Corporate Catering
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-[13px] font-bold uppercase tracking-[0.18em] text-bg/70">{s.nav.contact}</h2>
            <ul className="mt-4 space-y-2.5 text-[15px]">
              <Contact settings={settings} dark />
            </ul>
            <p className="mt-4 text-[14px] text-bg/75">{settings.hours}</p>
          </div>
        </div>

        <div className="mt-12 h-px bg-line-dark" />

        <div className="mt-5 flex flex-col gap-3 text-[13px] text-bg/75 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} Rokate Catering. {s.allRights}
          </p>
          <div className="flex items-center gap-5">
            <Link href={href(locale, "/partners")} className="hover:text-gold">
              {s.partners}
            </Link>
            <Link href={href(locale, "/privacy")} className="hover:text-gold">
              {s.privacy}
            </Link>
          </div>
        </div>
      </div>
      <div className="h-[72px] md:hidden" aria-hidden="true" />
    </footer>
  );
}
