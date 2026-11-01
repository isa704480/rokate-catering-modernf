"use client";

import Link from "next/link";
import { t, href } from "@/lib/i18n";
import type { Locale } from "@/lib/content";
import { track } from "@/lib/track";

/** Mobil versiyada pastda doim turadigan panel — yo'riqnomaning 5-bo'limi. */
export default function MobileBar({ locale, whatsapp }: { locale: Locale; whatsapp: string }) {
  const s = t(locale);
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-bg/95 px-4 py-2.5 backdrop-blur-sm md:hidden">
      <div className="flex gap-2.5" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
        <a
          href={`https://wa.me/${whatsapp}`}
          target="_blank"
          rel="noopener"
          onClick={() => track("whatsapp_click", { place: "bottom_bar" })}
          className="btn btn-wa flex-1 !py-3"
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 2a10 10 0 00-8.6 15L2 22l5.2-1.4A10 10 0 1012 2zm0 18a8 8 0 01-4.1-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 1112 20zm4.4-5.9c-.2-.1-1.4-.7-1.6-.8s-.4-.1-.5.1-.6.8-.7.9-.3.2-.5 0a6.5 6.5 0 01-3.2-2.8c-.2-.4.2-.4.6-1.2a.4.4 0 000-.4c0-.1-.5-1.3-.7-1.7s-.4-.4-.5-.4h-.5a.9.9 0 00-.7.3A2.8 2.8 0 006 9.3a4.8 4.8 0 001 2.5 11 11 0 004.2 3.7c1.5.6 2 .6 2.8.5a2.4 2.4 0 001.6-1.1 2 2 0 00.1-1.1c0-.1-.2-.2-.4-.3z" />
          </svg>
          {s.whatsapp}
        </a>
        <Link href={`${href(locale)}#contact`} className="btn btn-primary flex-1 !py-3">
          {s.requestShort}
        </Link>
      </div>
    </div>
  );
}
