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


/* ------------------------------------------------------------ kanallar */

type Result = { ok: boolean; error?: string };

/** Telegram'ga yuboradi. Xato bo'lsa Telegram'ning o'z izohini qaytaradi. */
async function sendTelegram(text: string): Promise<Result> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN?.trim();
  const chatId = process.env.TELEGRAM_CHAT_ID?.trim();
  if (!botToken) return { ok: false, error: "TELEGRAM_BOT_TOKEN не задан" };
  if (!chatId) return { ok: false, error: "TELEGRAM_CHAT_ID не задан" };
  try {
    const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text, disable_web_page_preview: true }),
      signal: AbortSignal.timeout(8000),
    });
    if (res.ok) return { ok: true };
    const body = (await res.json().catch(() => ({}))) as { description?: string };
    return { ok: false, error: `Telegram ${res.status}: ${body.description ?? "неизвестная ошибка"}` };
  } catch (e) {
    return { ok: false, error: `Telegram недоступен: ${String(e).slice(0, 120)}` };
  }
}

/** Email yuboradi (Resend). Xato bo'lsa Resend'ning o'z izohini qaytaradi. */
async function sendEmail(subject: string, html: string, replyTo?: string): Promise<Result> {
  const key = process.env.RESEND_API_KEY?.trim();
  const to = process.env.LEAD_EMAIL_TO?.trim();
  const from = process.env.LEAD_EMAIL_FROM?.trim();
  if (!key) return { ok: false, error: "RESEND_API_KEY не задан" };
  if (!to) return { ok: false, error: "LEAD_EMAIL_TO не задан" };
  if (!from) return { ok: false, error: "LEAD_EMAIL_FROM не задан" };
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: to.split(",").map((x) => x.trim()).filter(Boolean),
        subject,
        html,
        ...(replyTo ? { reply_to: replyTo } : {}),
      }),
      signal: AbortSignal.timeout(8000),
    });
    if (res.ok) return { ok: true };
    const body = (await res.json().catch(() => ({}))) as { message?: string };
    return { ok: false, error: `Resend ${res.status}: ${body.message ?? "неизвестная ошибка"}` };
  } catch (e) {
    return { ok: false, error: `Resend недоступен: ${String(e).slice(0, 120)}` };
  }
}

/* ---------------------------------------------------------- diagnostika */

/**
 * GET /api/lead — sozlamalar tekshiruvi.
 *
 *   /api/lead              qaysi o'zgaruvchilar qo'yilganini ko'rsatadi (qiymatsiz)
 *   /api/lead?test=CHAT_ID  sinov xabarini Telegram va email'ga yuboradi va
 *                           har bir kanalning aniq xatosini qaytaradi
 *
 * Sinov faqat TELEGRAM_CHAT_ID ni bilgan odamga ishlaydi — begona odam
 * bu manzil orqali guruhga xabar yubora olmaydi.
 */
export async function GET(request: Request) {
  const env = (k: string) => Boolean(process.env[k]?.trim());
  const configured = {
    TELEGRAM_BOT_TOKEN: env("TELEGRAM_BOT_TOKEN"),
    TELEGRAM_CHAT_ID: env("TELEGRAM_CHAT_ID"),
    RESEND_API_KEY: env("RESEND_API_KEY"),
    LEAD_EMAIL_TO: env("LEAD_EMAIL_TO"),
    LEAD_EMAIL_FROM: env("LEAD_EMAIL_FROM"),
    TURNSTILE_SECRET: env("TURNSTILE_SECRET"),
    NEXT_PUBLIC_TURNSTILE_SITE_KEY: env("NEXT_PUBLIC_TURNSTILE_SITE_KEY"),
  };

  const key = new URL(request.url).searchParams.get("test");
  const chatId = process.env.TELEGRAM_CHAT_ID?.trim();
  const headers = { "cache-control": "no-store" };

  if (!key) {
    return NextResponse.json(
      { configured, hint: "Добавьте ?test=<TELEGRAM_CHAT_ID>, чтобы отправить пробное сообщение" },
      { headers }
    );
  }
  if (!chatId || key !== chatId) {
    return NextResponse.json({ configured, error: "Неверный ключ проверки" }, { status: 403, headers });
  }

  const stamp = new Date().toISOString().replace("T", " ").slice(0, 19);
  const [telegram, email] = await Promise.all([
    sendTelegram(`Проверка сайта Rokate Catering\nЕсли вы видите это сообщение — Telegram настроен.\n${stamp} UTC`),
    sendEmail(
      "Проверка сайта Rokate Catering",
      `<p>Если вы видите это письмо — e-mail настроен.</p><p>${stamp} UTC</p>`
    ),
  ]);
  return NextResponse.json({ configured, telegram, email }, { headers });
}

export async function POST(request: Request) {
  let data: Lead;
  try {
    data = (await request.json()) as Lead;
  } catch {
    return NextResponse.json({ error: "bad_json" }, { status: 400 });
  }

  // Spam qopqoni — odam bu maydonni ko'rmaydi, bot to'ldiradi
  if (clean(data.rk_hp)) return NextResponse.json({ ok: true });

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

  const subject = `${title}: ${name}`;
  const html = `<h2>${title}</h2><table cellpadding="6">${all
    .map(([k, v]) => `<tr><td><b>${k}</b></td><td>${escapeHtml(v)}</td></tr>`)
    .join("")}</table>${waLink ? `<p><a href="${waLink}">WhatsApp</a></p>` : ""}`;

  const [telegram, mail] = await Promise.all([
    sendTelegram(waLink ? `${text}\n\n${waLink}` : text),
    sendEmail(subject, html, email || undefined),
  ]);

  /* Har bir muvaffaqiyatsiz kanal Vercel loglariga aniq sababi bilan yoziladi.
     Bitta kanal ishlasa mijozga xato ko'rsatilmaydi, lekin sabab yo'qolmaydi. */
  if (!telegram.ok) console.error("[lead] Telegram:", telegram.error);
  if (!mail.ok) console.error("[lead] Email:", mail.error);

  const sent = [telegram.ok && "telegram", mail.ok && "email"].filter(Boolean) as string[];

  if (!sent.length) {
    return NextResponse.json({ error: "not_delivered" }, { status: 503 });
  }

  return NextResponse.json({ ok: true, sent });
}
