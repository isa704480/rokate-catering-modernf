"use client";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { getAttribution, track } from "@/lib/track";
import { Turnstile, turnstileToken } from "./Turnstile";

type Opt = { value: string; label: string };
type Labels = {
  name: string; phone: string; date: string; type: string; guests: string; location: string; package: string; comment: string;
  choose: string; optional: string; namePh: string; phonePh: string; commentPh: string; submit: string; sending: string;
  required: string; phoneInvalid: string; error: string; rate: string; privacy: string; privacyLink: string;
};

export function InquiryForm({ locale, labels, eventTypes, locations, packages, defaultLocation = "", defaultPackage = "",
                              thankYouHref, privacyHref, source }: {
  locale: string; labels: Labels; eventTypes: Opt[]; locations: Opt[]; packages: Opt[];
  defaultLocation?: string; defaultPackage?: string; thankYouHref: string; privacyHref: string; source: string;
}) {
  const router = useRouter();
  const ref = useRef<HTMLFormElement>(null);
  const [pkg, setPkg] = useState(defaultPackage);
  const [state, setState] = useState<"idle" | "sending" | "error">("idle");
  const [error, setError] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const started = useRef(false);

  useEffect(() => {
    const onPkg = (e: Event) => setPkg((e as CustomEvent<string>).detail || "");
    window.addEventListener("rk:package", onPkg);
    return () => window.removeEventListener("rk:package", onPkg);
  }, []);

  const onFocus = () => {
    if (!started.current) { started.current = true; track("form_start", { form: "inquiry", page: source }); }
  };

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const v = (k: string) => String(fd.get(k) || "").trim();
    const errs: Record<string, string> = {};
    if (!v("name")) errs.name = labels.required;
    if (!v("phone")) errs.phone = labels.required;
    else if (v("phone").replace(/\D/g, "").length < 7) errs.phone = labels.phoneInvalid;
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setState("sending");
    setError("");
    const payload = {
      name: v("name"), phone: v("phone"), event_date: v("event_date") || null, event_type: v("event_type") || null,
      guests: v("guests") ? Number(v("guests")) : null, location_type: v("location_type"), package: v("package") || null,
      comment: v("comment"), website: v("website"), language: locale, source_page: source,
      turnstile_token: turnstileToken(form), ...getAttribution(),
    };
    if (process.env.NEXT_PUBLIC_DEMO_MODE === "1") {
      // DEMO: backend ulanmagan — ariza saqlanmaydi, faqat "rahmat" sahifasi
      track("generate_lead", { form: "inquiry", page: source });
      router.push(thankYouHref);
      return;
    }
    try {
      const res = await fetch("/api/v1/inquiries", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (res.status === 429) throw new Error(labels.rate);
      if (!res.ok) throw new Error(labels.error);
      track("generate_lead", { form: "inquiry", page: source, package: payload.package || undefined });
      router.push(thankYouHref);
    } catch (err) {
      setState("error");
      setError(err instanceof Error ? err.message : labels.error);
    }
  }

  const fieldErr = (k: string) => errors[k] && <p className="mt-1.5 text-[13px] text-red-700">{errors[k]}</p>;

  return (
    <form ref={ref} onSubmit={onSubmit} onFocus={onFocus} noValidate className="grid gap-5 sm:grid-cols-2">
      <div>
        <label className="label" htmlFor="f-name">{labels.name} *</label>
        <input id="f-name" name="name" autoComplete="name" className="field" placeholder={labels.namePh} aria-invalid={!!errors.name} />
        {fieldErr("name")}
      </div>
      <div>
        <label className="label" htmlFor="f-phone">{labels.phone} *</label>
        <input id="f-phone" name="phone" type="tel" autoComplete="tel" inputMode="tel" className="field" placeholder={labels.phonePh} aria-invalid={!!errors.phone} />
        {fieldErr("phone")}
      </div>
      <div>
        <label className="label" htmlFor="f-date">{labels.date}</label>
        <input id="f-date" name="event_date" type="date" className="field" />
      </div>
      <div>
        <label className="label" htmlFor="f-guests">{labels.guests}</label>
        <input id="f-guests" name="guests" type="number" min={1} max={5000} inputMode="numeric" className="field" placeholder="20" />
      </div>
      <div>
        <label className="label" htmlFor="f-type">{labels.type}</label>
        <select id="f-type" name="event_type" className="field" defaultValue="">
          <option value="">{labels.choose}</option>
          {eventTypes.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>
      <div>
        <label className="label" htmlFor="f-loc">{labels.location}</label>
        <select id="f-loc" name="location_type" className="field" defaultValue={defaultLocation}>
          <option value="">{labels.choose}</option>
          {locations.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>
      {packages.length > 0 && (
        <div className="sm:col-span-2">
          <label className="label" htmlFor="f-pkg">{labels.package} <span className="font-normal text-ink-muted">({labels.optional})</span></label>
          <select id="f-pkg" name="package" className="field" value={pkg} onChange={(e) => setPkg(e.target.value)}>
            <option value="">{labels.choose}</option>
            {packages.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
      )}
      <div className="sm:col-span-2">
        <label className="label" htmlFor="f-comment">{labels.comment}</label>
        <textarea id="f-comment" name="comment" rows={3} className="field resize-y" placeholder={labels.commentPh} />
      </div>
      {/* honeypot: odamlar ko'rmaydi, botlar to'ldiradi */}
      <div className="hidden" aria-hidden="true">
        <input name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="sm:col-span-2"><Turnstile /></div>
      <div className="sm:col-span-2 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[12px] text-ink-muted">
          {labels.privacy} <a href={privacyHref} className="underline underline-offset-2">{labels.privacyLink}</a>.
        </p>
        <button type="submit" className="btn btn-primary w-full sm:w-auto" disabled={state === "sending"}>
          {state === "sending" ? labels.sending : labels.submit}
        </button>
      </div>
      {state === "error" && <p role="alert" className="sm:col-span-2 rounded-lg bg-red-50 px-4 py-3 text-[14px] text-red-800">{error}</p>}
    </form>
  );
}
