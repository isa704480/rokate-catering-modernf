"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { t, href } from "@/lib/i18n";
import type { Locale } from "@/lib/content";
import { track, attribution } from "@/lib/track";
import Turnstile, { turnstileToken } from "./Turnstile";
import { saveLeadToFirestore } from "@/lib/leads";

/** Hamkorlar uchun forma. Komissiya va foizlar ko'rsatilmaydi. */
export default function PartnerForm({ locale, siteKey, whatsapp }: { locale: Locale; siteKey: string; whatsapp: string }) {
  const s = t(locale);
  const router = useRouter();
  const [state, setState] = useState<"idle" | "sending" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const v = (k: string) => String(fd.get(k) || "").trim();

    if (!v("name")) {
      setState("error");
      setMessage(`${s.form.name}: ${s.form.required}`);
      return;
    }
    if (!v("phone") && !v("email")) {
      setState("error");
      setMessage(s.form.contactRequired);
      return;
    }

    setState("sending");
    setMessage("");
    try {
      const attr = attribution();
      await saveLeadToFirestore({
        kind: "partner",
        name: v("name"),
        company: v("company"),
        field: v("field"),
        phone: v("phone"),
        email: v("email"),
        comment: v("message"),
        language: locale,
        page: typeof window !== "undefined" ? window.location.pathname : "",
        source: attr.utm_source,
        campaign: attr.utm_campaign,
      });

      try {
        await fetch("/api/lead", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            kind: "partner",
            name: v("name"),
            company: v("company"),
            field: v("field"),
            phone: v("phone"),
            email: v("email"),
            comment: v("message"),
            website: v("website"),
            language: locale,
            page: window.location.pathname,
            turnstile: turnstileToken(form),
            ...attr,
          }),
        });
      } catch (cfErr) {
        console.warn("Cloudflare function notice:", cfErr);
      }

      track("partner_form_submit", { page: "/partners" });
      router.push(href(locale, "/thank-you"));
    } catch (err) {
      setState("error");
      setMessage(err instanceof Error ? err.message : s.form.error);
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-4 sm:grid-cols-2">
      <div>
        <label className="label" htmlFor="p-name">
          {s.form.name} *
        </label>
        <input id="p-name" name="name" autoComplete="name" className="field" />
      </div>
      <div>
        <label className="label" htmlFor="p-company">
          {s.form.company}
        </label>
        <input id="p-company" name="company" autoComplete="organization" className="field" />
      </div>
      <div className="sm:col-span-2">
        <label className="label" htmlFor="p-field">
          {s.form.field}
        </label>
        <input id="p-field" name="field" className="field" placeholder={s.form.fieldPh} />
      </div>
      <div>
        <label className="label" htmlFor="p-phone">
          {s.form.phone}
        </label>
        <input id="p-phone" name="phone" type="tel" autoComplete="tel" className="field" placeholder={s.form.phonePh} />
      </div>
      <div>
        <label className="label" htmlFor="p-email">
          {s.form.email}
        </label>
        <input id="p-email" name="email" type="email" autoComplete="email" className="field" />
      </div>
      <div className="sm:col-span-2">
        <label className="label" htmlFor="p-message">
          {s.form.message}
        </label>
        <textarea id="p-message" name="message" rows={3} className="field resize-y" />
      </div>

      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute left-[-9999px] h-0 w-0" />

      <Turnstile siteKey={siteKey} locale={locale} />

      <div className="sm:col-span-2">
        <button type="submit" disabled={state === "sending"} className="btn btn-primary w-full disabled:opacity-60 sm:w-auto sm:min-w-[220px]">
          {state === "sending" ? s.form.sending : s.form.submit}
        </button>
        {state === "error" && (
          <p className="mt-3 text-[14px] text-[#b4342b]">
            {message}{" "}
            <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener" className="link-underline font-semibold">
              WhatsApp
            </a>
          </p>
        )}
      </div>
    </form>
  );
}
