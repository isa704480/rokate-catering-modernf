"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { track } from "@/lib/track";
import { Turnstile, turnstileToken } from "./Turnstile";

type Labels = { name: string; company: string; field: string; phone: string; email: string; message: string;
  partnerSubmit: string; sending: string; required: string; contactRequired: string; error: string; rate: string; phonePh: string };

export function PartnerForm({ locale, labels, thankYouHref }: { locale: string; labels: Labels; thankYouHref: string }) {
  const router = useRouter();
  const [state, setState] = useState<"idle" | "sending" | "error">("idle");
  const [msg, setMsg] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const v = (k: string) => String(fd.get(k) || "").trim();
    if (!v("name")) { setState("error"); setMsg(`${labels.name}: ${labels.required}`); return; }
    if (!v("phone") && !v("email")) { setState("error"); setMsg(labels.contactRequired); return; }
    setState("sending");
    if (process.env.NEXT_PUBLIC_DEMO_MODE === "1") {
      // DEMO: backend ulanmagan — ariza saqlanmaydi, faqat "rahmat" sahifasi
      track("partner_lead", { page: "/partners" });
      router.push(thankYouHref);
      return;
    }
    try {
      const res = await fetch("/api/v1/partner-requests", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: v("name"), company: v("company"), field: v("field"), phone: v("phone"), email: v("email"),
                               message: v("message"), website: v("website"), language: locale, turnstile_token: turnstileToken(form) }),
      });
      if (res.status === 429) throw new Error(labels.rate);
      if (!res.ok) throw new Error(labels.error);
      track("partner_lead", { page: "/partners" });
      router.push(thankYouHref);
    } catch (err) {
      setState("error");
      setMsg(err instanceof Error ? err.message : labels.error);
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-5 sm:grid-cols-2">
      <div><label className="label" htmlFor="p-name">{labels.name} *</label><input id="p-name" name="name" className="field" autoComplete="name" /></div>
      <div><label className="label" htmlFor="p-company">{labels.company}</label><input id="p-company" name="company" className="field" autoComplete="organization" /></div>
      <div className="sm:col-span-2"><label className="label" htmlFor="p-field">{labels.field}</label><input id="p-field" name="field" className="field" /></div>
      <div><label className="label" htmlFor="p-phone">{labels.phone}</label><input id="p-phone" name="phone" type="tel" className="field" placeholder={labels.phonePh} autoComplete="tel" /></div>
      <div><label className="label" htmlFor="p-email">{labels.email}</label><input id="p-email" name="email" type="email" className="field" autoComplete="email" /></div>
      <div className="sm:col-span-2"><label className="label" htmlFor="p-msg">{labels.message}</label><textarea id="p-msg" name="message" rows={4} className="field resize-y" /></div>
      <div className="hidden" aria-hidden="true"><input name="website" tabIndex={-1} autoComplete="off" /></div>
      <div className="sm:col-span-2"><Turnstile /></div>
      <div className="sm:col-span-2">
        <button type="submit" className="btn btn-primary w-full sm:w-auto" disabled={state === "sending"}>
          {state === "sending" ? labels.sending : labels.partnerSubmit}
        </button>
      </div>
      {state === "error" && <p role="alert" className="sm:col-span-2 rounded-lg bg-red-50 px-4 py-3 text-[14px] text-red-800">{msg}</p>}
    </form>
  );
}
