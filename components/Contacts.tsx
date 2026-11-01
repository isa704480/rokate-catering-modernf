"use client";

import type { Settings } from "@/lib/types";
import { track } from "@/lib/track";

/** Aloqa havolalari — bosilganda GA4 hodisasi yuboriladi. */
export function Contact({ settings, dark = false }: { settings: Settings; dark?: boolean }) {
  const hover = dark ? "hover:text-gold" : "hover:text-green";
  return (
    <>
      <li>
        <a href={`tel:${settings.phone.replace(/\s/g, "")}`} onClick={() => track("phone_click")} className={hover}>
          {settings.phone}
        </a>
      </li>
      <li>
        <a
          href={`https://wa.me/${settings.whatsapp}`}
          target="_blank"
          rel="noopener"
          onClick={() => track("whatsapp_click", { place: "contacts" })}
          className={hover}
        >
          WhatsApp
        </a>
      </li>
      <li>
        <a
          href={`https://t.me/${settings.telegram}`}
          target="_blank"
          rel="noopener"
          onClick={() => track("telegram_click")}
          className={hover}
        >
          Telegram
        </a>
      </li>
      <li>
        <a
          href={`https://instagram.com/${settings.instagram}`}
          target="_blank"
          rel="noopener"
          className={hover}
        >
          Instagram
        </a>
      </li>
      <li>
        <a href={`mailto:${settings.email}`} onClick={() => track("email_click")} className={hover}>
          {settings.email}
        </a>
      </li>
    </>
  );
}
