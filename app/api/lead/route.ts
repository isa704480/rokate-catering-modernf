import { NextResponse } from "next/server";

/**
 * Ariza qabul qiluvchi yo'l — /api/lead
 *
 * Ikkala forma ham shu yerga yuboradi: asosiy ariza va hamkorlar formasi.
 * Ariza ikki joyga boradi: Telegram botga va email'ga (Resend orqali).
 *
 * Deploy qilgan joyda (Vercel yoki Cloudflare) shu o'zgaruvchilarni qo'ying:
 *   TELEGRAM_BOT_TOKEN   @BotFather bergan token
 *   TELEGRAM_CHAT_ID     arizalar tushadigan chat yoki guruh id'si
 *   RESEND_API_KEY       Resend kaliti (bepul tarif)
 *   LEAD_EMAIL_TO        arizalar tushadigan pochta (rokate.catering@gmail.com)
 *   LEAD_EMAIL_FROM      jo'natuvchi, masalan "Rokate <site@rokatecatering.com>"
 *   TURNSTILE_SECRET     spamdan himoya (ixtiyoriy)
 *
 * Hech biri qo'yilmasa, forma 503 oladi va mijozga WhatsApp havolasi ko'rsatiladi —
 * ariza yo'qolmaydi, lekin ishga tushirishdan oldin albatta sozlang.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Lead = Record<string, unknown>;

const clean = (v: unknown, max = 600) =>
  String(v ?? "")
    .replace(/[\u0000-\u001f\u007f]/g, " ")
    .trim()
    .slice(0, max);

const escapeHtml = (s: string) =>
  s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c] as string);

export async function POST(request: Request) {
  let data: Lead;
  try {
    data = (await request.json()) as Lead;
  } catch {
    return NextResponse.json({ error: "bad_json" }, { status: 400 });
  }

  // Spam qopqoni — odam bu maydonni ko'rmaydi, bot to'ldiradi
  if (clean(data.website)) return NextResponse.json({ ok: true });

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "";

  // Turnstile
  const turnstileSecret = process.env.TURNSTILE_SECRET;
  if (turnstileSecret) {
    const token = clean(data.turnstile_token ?? data.turnstile, 3000);
    if (!token) return NextResponse.json({ error: "captcha_missing" }, { status: 400 });
    const verify = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret: turnstileSecret, response: token, remoteip: ip }),
    });
    const result = (await verify.json()) as { success?: boolean };
    if (!result.success) return NextResponse.json({ error: "captcha_failed" }, { status: 400 });
  }

  const isPartner = clean(data.kind) === "partner";
  const name = clean(data.name, 120);
  const phone = clean(data.phone, 60);
  const email = clean(data.email, 160);

  if (!name) return NextResponse.json({ error: "name_required" }, { status: 400 });
  if (!isPartner && !phone) return NextResponse.json({ error: "phone_required" }, { status: 400 });
  if (isPartner && !phone && !email) return NextResponse.json({ error: "contact_required" }, { status: 400 });

  const rows: [string, string][] = isPartner
    ? [
        ["Имя", name],
        ["Компания", clean(data.company, 160)],
        ["Сфера", clean(data.field, 160)],
        ["Телефон", phone],
        ["Email", email],
        ["Сообщение", clean(data.message ?? data.comment)],
      ]
    : [
        ["Имя", name],
        ["Телефон", phone],
        ["Дата", clean(data.event_date ?? data.date, 40)],
        ["Гостей", clean(data.guests, 20)],
        ["Тип", clean(data.event_type ?? data.eventType, 120)],
        ["Площадка", clean(data.location_type ?? data.place, 160)],
        ["Пакет", clean(data.package, 120)],
        ["Комментарий", clean(data.comment)],
      ];

  const meta: [string, string][] = [
    ["Язык", clean(data.language, 5)],
    ["Страница", clean(data.source_page ?? data.page, 200)],
    ["Источник", clean(data.utm_source ?? data.source, 120)],
    ["Кампания", clean(data.utm_campaign ?? data.campaign, 120)],
  ];

  const title = isPartner ? "Заявка от партнёра" : "Новая заявка с сайта";
  const all = [...rows, ...meta].filter(([, v]) => v);
  const text = `${title}\n\n${all.map(([k, v]) => `${k}: ${v}`).join("\n")}`;
  const waLink = phone ? `https://wa.me/${phone.replace(/\D/g, "")}` : "";

  const sent: string[] = [];

  // Telegram
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (botToken && chatId) {
    try {
      const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: waLink ? `${text}\n\n${waLink}` : text,
          disable_web_page_preview: true,
        }),
      });
      if (res.ok) sent.push("telegram");
    } catch {
      /* quyida tekshiriladi */
    }
  }

  // Email
  const resendKey = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_EMAIL_TO;
  const from = process.env.LEAD_EMAIL_FROM;
  if (resendKey && to && from) {
    try {
      const html = `<h2>${title}</h2><table cellpadding="6">${all
        .map(([k, v]) => `<tr><td><b>${k}</b></td><td>${escapeHtml(v)}</td></tr>`)
        .join("")}</table>${waLink ? `<p><a href="${waLink}">WhatsApp</a></p>` : ""}`;
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from,
          to: [to],
          subject: `${title}: ${name}`,
          html,
          ...(email ? { reply_to: email } : {}),
        }),
      });
      if (res.ok) sent.push("email");
    } catch {
      /* quyida tekshiriladi */
    }
  }

  if (!sent.length) {
    console.error("Ariza yetkazilmadi", { telegram: !!botToken, email: !!resendKey });
    return NextResponse.json({ error: "not_delivered" }, { status: 503 });
  }

  return NextResponse.json({ ok: true, sent });
}
