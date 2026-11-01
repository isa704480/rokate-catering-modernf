"use client";

import { track } from "@/lib/track";

/** WhatsApp havolasi — GA4 hodisasi bilan. */
export function WhatsAppLink({
  whatsapp,
  children,
  className,
  place,
}: {
  whatsapp: string;
  children: React.ReactNode;
  className?: string;
  place: string;
}) {
  return (
    <a
      href={`https://wa.me/${whatsapp}`}
      target="_blank"
      rel="noopener"
      onClick={() => track("whatsapp_click", { place })}
      className={className}
    >
      {children}
    </a>
  );
}
