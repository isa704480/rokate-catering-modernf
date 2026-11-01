/**
 * Cloudflare Pages Function — /api/lead
 *
 * Sayt statik, server yo'q. Formalar faqat shu funksiya orqali ishlaydi:
 * Turnstile tekshiruvi -> Telegram botga xabar -> email (Resend).
 *
 * Cloudflare Pages -> Settings -> Environment variables da sozlanadi:
 *   TURNSTILE_SECRET     Turnstile maxfiy kaliti (ixtiyoriy, lekin tavsiya etiladi)
 *   TELEGRAM_BOT_TOKEN   @BotFather bergan token
 *   TELEGRAM_CHAT_ID     arizalar tushadigan chat yoki guruh id'si
 *   RESEND_API_KEY       Resend kaliti (bepul tarif)
 *   LEAD_EMAIL_TO        arizalar tushadigan pochta
 *   LEAD_EMAIL_FROM      jo'natuvchi, masalan "Rokate <site@rokatecatering.com>"
 *   LEAD_RATE_LIMIT      KV namespace (ixtiyoriy) — bir IP uchun cheklov
 */

type Env = {
  TURNSTILE_SECRET?: string;
  TELEGRAM_BOT_TOKEN?: string;
  TELEGRAM_CHAT_ID?: string;
  RESEND_API_KEY?: string;
  LEAD_EMAIL_TO?: string;
  LEAD_EMAIL_FROM?: string;
  LEAD_RATE_LIMIT?: KVNamespace;
};

type PagesContext = { request: Request; env: Env };
type PagesFunction = (ctx: PagesContext) => Promise<Response>;

type KVNamespace = {
  get(key: string): Promise<string | null>;
  put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void>;
};

type Lead = Record<string, string | undefined> & { kind?: string };

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

const clean = (v: unknown, max = 600) =>
  String(v ?? "")
    .replace(/[\u0000-\u001f\u007f]/g, " ")
    .trim()
    .slice(0, max);

export const onRequestPost: PagesFunction = async ({ request, env }) => {
  let data: Lead;
  try {
    data = (await request.json()) as Lead;
  } catch {
    return json(400, { error: "bad_json" });
  }

  // 1. Spam qopqoni — odam bu maydonni ko'rmaydi
  if (clean(data.website)) return json(200, { ok: true });

  // 2. Bir IP uchun cheklov (KV ulangan bo'lsa)
  const ip = request.headers.get("CF-Connecting-IP") ?? "unknown";
  if (env.LEAD_RATE_LIMIT) {
    const key = `lead:${ip}`;
    const count = Number((await env.LEAD_RATE_LIMIT.get(key)) ?? 0);
    if (count >= 5) return json(429, { error: "rate_limited" });
    await env.LEAD_RATE_LIMIT.put(key, String(count + 1), { expirationTtl: 600 });
  }

  // 3. Turnstile
  if (env.TURNSTILE_SECRET) {
    const token = clean(data.turnstile, 3000);
    if (!token) return json(400, { error: "captcha_missing" });
    const verify = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret: env.TURNSTILE_SECRET, response: token, remoteip: ip }),
    });
    const result = (await verify.json()) as { success?: boolean };
    if (!result.success) return json(400, { error: "captcha_failed" });
  }

  const isPartner = data.kind === "partner";
  const name = clean(data.name, 120);
  const phone = clean(data.phone, 60);
  const email = clean(data.email, 160);
  if (!name) return json(400, { error: "name_required" });
  if (!isPartner && !phone) return json(400, { error: "phone_required" });
  if (isPartner && !phone && !email) return json(400, { error: "contact_required" });

  const rows: [string, string][] = isPartner
    ? [
        ["Имя", name],
        ["Компания", clean(data.company, 160)],
        ["Сфера", clean(data.field, 160)],
        ["Телефон", phone],
        ["Email", email],
        ["Сообщение", clean(data.comment)],
      ]
    : [
        ["Имя", name],
        ["Телефон", phone],
        ["Дата", clean(data.date, 40)],
        ["Гостей", clean(data.guests, 20)],
        ["Тип", clean(data.eventType, 120)],
        ["Площадка", clean(data.place, 160)],
        ["Пакет", clean(data.package, 120)],
        ["Комментарий", clean(data.comment)],
      ];

  const meta: [string, string][] = [
    ["Язык", clean(data.language, 5)],
    ["Страница", clean(data.page, 200)],
    ["Источник", clean(data.utm_source, 120)],
    ["Кампания", clean(data.utm_campaign, 120)],
    ["Referrer", clean(data.referrer, 200)],
  ];

  const title = isPartner ? "Заявка от партнёра" : "Новая заявка с сайта";
  const lines = [...rows, ...meta].filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`);
  const text = `${title}\n\n${lines.join("\n")}`;

  const waLink = phone ? `https://wa.me/${phone.replace(/\D/g, "")}` : "";
  const sent: string[] = [];
  const failed: string[] = [];

  // 4. Telegram
  if (env.TELEGRAM_BOT_TOKEN && env.TELEGRAM_CHAT_ID) {
    try {
      const res = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: env.TELEGRAM_CHAT_ID,
          text: waLink ? `${text}\n\n${waLink}` : text,
          disable_web_page_preview: true,
        }),
      });
      res.ok ? sent.push("telegram") : failed.push("telegram");
    } catch {
      failed.push("telegram");
    }
  }

  // 5. Email
  if (env.RESEND_API_KEY && env.LEAD_EMAIL_TO && env.LEAD_EMAIL_FROM) {
    try {
      const html = `<h2>${title}</h2><table cellpadding="6">${[...rows, ...meta]
        .filter(([, v]) => v)
        .map(([k, v]) => `<tr><td><b>${k}</b></td><td>${escapeHtml(v)}</td></tr>`)
        .join("")}</table>${waLink ? `<p><a href="${waLink}">WhatsApp</a></p>` : ""}`;
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: env.LEAD_EMAIL_FROM,
          to: [env.LEAD_EMAIL_TO],
          subject: `${title}: ${name}`,
          html,
          ...(email ? { reply_to: email } : {}),
        }),
      });
      res.ok ? sent.push("email") : failed.push("email");
    } catch {
      failed.push("email");
    }
  }

  if (!sent.length) {
    // Hech bir kanal sozlanmagan yoki ishlamadi — arizani yo'qotmaslik uchun xato qaytaramiz,
    // sayt esa mijozga WhatsApp havolasini ko'rsatadi.
    console.error("lead not delivered", { failed, hasTelegram: !!env.TELEGRAM_BOT_TOKEN, hasEmail: !!env.RESEND_API_KEY });
    return json(503, { error: "not_delivered" });
  }

  return json(200, { ok: true, sent });
};

function escapeHtml(s: string) {
  return s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c] as string);
}
