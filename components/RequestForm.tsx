"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { t, href } from "@/lib/i18n";
import type { Locale } from "@/lib/content";
import { track, attribution } from "@/lib/track";
import Turnstile, { turnstileToken } from "./Turnstile";

/** Asosiy ariza formasi. Yuborilgandan keyin "rahmat" sahifasiga o'tadi. */
export default function RequestForm({
  locale,
  siteKey,
  whatsapp,
  pkg,
}: {
  locale: Locale;
  siteKey: string;
  whatsapp: string;
  pkg?: string;
}) {
  const s = t(locale);
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [state, setState] = useState<"idle" | "sending" | "error">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const v = (k: string) => String(fd.get(k) || "").trim();

    const errs: Record<string, string> = {};
    if (!v("name")) errs.name = s.form.required;
    if (!v("phone")) errs.phone = s.form.required;
    else if (v("phone").replace(/\D/g, "").length < 7) errs.phone = s.form.phoneInvalid;
    if (!v("date")) errs.date = s.form.required;
    if (!v("guests")) errs.guests = s.form.required;
    setErrors(errs);
    if (Object.keys(errs).length) {
      form.querySelector<HTMLElement>(`[name="${Object.keys(errs)[0]}"]`)?.focus();
      return;
    }

    setState("sending");
    setMessage("");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: "inquiry",
          name: v("name"),
          phone: v("phone"),
          date: v("date"),
          guests: v("guests"),
          eventType: v("eventType"),
          place: v("place"),
          comment: v("comment"),
          package: pkg || "",
          website: v("website"),
          language: locale,
          page: window.location.pathname,
          turnstile: turnstileToken(form),
          ...attribution(),
        }),
      });
      if (res.status === 429) throw new Error(s.form.rate);
      if (!res.ok) throw new Error(s.form.error);
      track("form_submit", { page: window.location.pathname, package: pkg });
      router.push(href(locale, "/thank-you"));
    } catch (err) {
      setState("error");
      setMessage(err instanceof Error ? err.message : s.form.error);
    }
  }

  const err = (k: string) =>
    errors[k] ? (
      <p className="mt-1.5 text-[13px] text-[#b4342b]">{errors[k]}</p>
    ) : null;

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="grid gap-4 sm:grid-cols-2">
      <div>
        <label className="label" htmlFor="f-name">
          {s.form.name} *
        </label>
        <input id="f-name" name="name" autoComplete="name" className="field" placeholder={s.form.namePh} aria-invalid={!!errors.name} />
        {err("name")}
      </div>
      <div>
        <label className="label" htmlFor="f-phone">
          {s.form.phone} *
        </label>
        <input
          id="f-phone"
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          className="field"
          placeholder={s.form.phonePh}
          aria-invalid={!!errors.phone}
        />
        {err("phone")}
      </div>
      <div>
        <label className="label" htmlFor="f-date">
          {s.form.date} *
        </label>
        <input id="f-date" name="date" type="date" className="field" aria-invalid={!!errors.date} />
        {err("date")}
      </div>
      <div>
        <label className="label" htmlFor="f-guests">
          {s.form.guests} *
        </label>
        <input
          id="f-guests"
          name="guests"
          type="number"
          min="1"
          inputMode="numeric"
          className="field"
          placeholder={s.form.guestsPh}
          aria-invalid={!!errors.guests}
        />
        {err("guests")}
      </div>
      <div>
        <label className="label" htmlFor="f-type">
          {s.form.kind}
        </label>
        <input id="f-type" name="eventType" className="field" placeholder={s.form.kindPh} />
      </div>
      <div>
        <label className="label" htmlFor="f-place">
          {s.form.place}
        </label>
        <input id="f-place" name="place" className="field" placeholder={s.form.placePh} />
      </div>
      <div className="sm:col-span-2">
        <label className="label" htmlFor="f-comment">
          {s.form.comment}
        </label>
        <textarea id="f-comment" name="comment" rows={3} className="field resize-y" placeholder={s.form.commentPh} />
      </div>

      {/* Spam qopqoni — odam ko'rmaydi, bot to'ldiradi */}
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
        <p className="mt-3 text-[13px] leading-relaxed text-ink-soft">
          {s.form.consent}{" "}
          <Link href={href(locale, "/privacy")} className="link-underline">
            {s.privacy.toLowerCase()}
          </Link>
          .
        </p>
      </div>
    </form>
  );
}
