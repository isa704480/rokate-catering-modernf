"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Logo from "./Logo";
import { t, href } from "@/lib/i18n";
import type { Locale } from "@/lib/content";
import { track } from "@/lib/track";

export default function Header({ locale, whatsapp }: { locale: Locale; whatsapp: string }) {
  const s = t(locale);
  const pathname = usePathname() || `/${locale}`;
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Tilni almashtirganda o'sha sahifada qolamiz
  const swap = (to: Locale) => {
    const rest = pathname.replace(/^\/(en|ru)/, "");
    return `/${to}${rest}`;
  };

  const nav = [
    { label: s.nav.directions, to: `${href(locale)}#directions` },
    { label: s.nav.packages, to: href(locale, "/menu") },
    { label: s.nav.portfolio, to: `${href(locale)}#portfolio` },
    { label: s.nav.contact, to: `${href(locale)}#contact` },
  ];

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        solid || open ? "bg-bg/95 backdrop-blur-sm border-b border-line" : "bg-transparent"
      }`}
    >
      <div className="container-x flex h-[68px] items-center justify-between gap-4 md:h-[76px]">
        <Link href={href(locale)} className="shrink-0" aria-label="Rokate Catering">
          <Logo className="h-9 w-auto md:h-11" />
        </Link>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Rokate">
          {nav.map((n) => (
            <Link key={n.to} href={n.to} className="text-[15px] font-medium hover:text-green">
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 md:gap-3">
          <div className="hidden items-center text-[13px] font-semibold sm:flex" role="group" aria-label={s.langLabel}>
            {(["en", "ru"] as Locale[]).map((l, i) => (
              <span key={l} className="flex items-center">
                {i > 0 && <span className="px-1.5 text-line">/</span>}
                <Link
                  href={swap(l)}
                  className={l === locale ? "text-ink" : "text-ink-soft hover:text-ink"}
                  aria-current={l === locale ? "true" : undefined}
                >
                  {l.toUpperCase()}
                </Link>
              </span>
            ))}
          </div>

          <Link
            href={`${href(locale)}#contact`}
            className="btn btn-primary hidden !px-5 !py-2.5 !text-[14px] md:inline-flex"
          >
            {s.request}
          </Link>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-line lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? s.menuClose : s.menuOpen}
          >
            <svg width="18" height="14" viewBox="0 0 18 14" fill="none" aria-hidden="true">
              {open ? (
                <path d="M2 2l14 10M16 2L2 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              ) : (
                <path d="M0 1h18M0 7h18M0 13h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div id="mobile-nav" className="border-t border-line bg-bg lg:hidden">
          <div className="container-x flex flex-col gap-1 py-4">
            {nav.map((n) => (
              <Link
                key={n.to}
                href={n.to}
                onClick={() => setOpen(false)}
                className="border-b border-line/70 py-3.5 text-[17px] font-semibold last:border-0"
              >
                {n.label}
              </Link>
            ))}
            <div className="mt-3 flex items-center gap-3">
              <a
                href={`https://wa.me/${whatsapp}`}
                onClick={() => track("whatsapp_click", { place: "menu" })}
                className="btn btn-wa flex-1"
                target="_blank"
                rel="noopener"
              >
                {s.whatsapp}
              </a>
              <Link href={`${href(locale)}#contact`} onClick={() => setOpen(false)} className="btn btn-primary flex-1">
                {s.requestShort}
              </Link>
            </div>
            <div className="mt-4 flex items-center gap-3 text-[14px] font-semibold">
              <span className="text-ink-soft">{s.langLabel}:</span>
              {(["en", "ru"] as Locale[]).map((l) => (
                <Link
                  key={l}
                  href={swap(l)}
                  onClick={() => setOpen(false)}
                  className={l === locale ? "text-ink underline underline-offset-4" : "text-ink-soft"}
                >
                  {l.toUpperCase()}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
