# Rokate Catering — sayt

Dubay va Abu-Dabidagi chiqib xizmat ko'rsatadigan keytering sayti. EN va RU tillarida.

**Arxitektura:** statik sayt. Server ham, ma'lumotlar bazasi ham yo'q.
Kontent shu repozitoriyaning `content/` papkasida JSON fayl sifatida yotadi,
Roman uni `/admin` dagi Decap CMS orqali tahrirlaydi. Saqlangandan keyin
Cloudflare Pages saytni qayta yig'adi — 1–2 daqiqa.

Yillik xarajat: faqat domen. Boshqa hech narsa uchun to'lanmaydi.

---

## Nimadan iborat

| Papka | Nima |
|---|---|
| `app/` | Sahifalar (Next.js App Router). `app/[locale]/` — ikkala til uchun bitta nusxa. |
| `components/` | Interfeys bo'laklari. |
| `content/` | **Saytdagi barcha matn va rasm havolalari.** Har maydon ikki tilda: `title_ru` va `title_en`. |
| `lib/` | Kontentni o'qish, tillar, SEO, GA4 hodisalari. |
| `public/media/` | Saytdagi rasmlar (WebP, uch o'lchamda). |
| `public/admin/` | Decap CMS — Romanning tahrirlash paneli. |
| `functions/api/lead.ts` | Formalarni qabul qiluvchi Cloudflare funksiyasi. |
| `cms-oauth-worker/` | CMS'ga GitHub orqali kirish uchun kichik worker. |
| `media-src/` | Rasmlarning asl nusxalari. `npm run media` shulardan WebP yasaydi. |

## Lokal ishga tushirish

Kerak: Node.js 20+.

```bash
npm install
npm run dev      # http://localhost:3000 -> /en ga yo'naltiradi
```

Yig'ish va statik natijani ko'rish:

```bash
npm run build    # natija: out/ papkasi
npm run preview  # http://localhost:4000
```

Yangi rasm qo'shish (`media-src/` ga qo'ying, keyin):

```bash
npm run media    # WebP variantlarini va manifest.json ni yangilaydi
```

---

## Cloudflare Pages'ga joylash

1. **Pages → Create → Connect to Git** → shu repozitoriya.
2. Build sozlamalari:
   - Framework preset: **None**
   - Build command: `npm run build`
   - Build output directory: `out`
   - Node version: `20`
3. **Settings → Environment variables** (formalar ishlashi uchun):

   | O'zgaruvchi | Nima uchun |
   |---|---|
   | `TELEGRAM_BOT_TOKEN` | @BotFather bergan token |
   | `TELEGRAM_CHAT_ID` | arizalar tushadigan chat yoki guruh |
   | `RESEND_API_KEY` | email yuborish uchun (bepul tarif) |
   | `LEAD_EMAIL_TO` | arizalar tushadigan pochta |
   | `LEAD_EMAIL_FROM` | jo'natuvchi, masalan `Rokate <site@rokatecatering.com>` |
   | `TURNSTILE_SECRET` | spamdan himoya (ixtiyoriy, lekin tavsiya etiladi) |

   Bulardan hech biri qo'yilmasa, forma ariza yubora olmaydi va mijozga
   WhatsApp havolasini ko'rsatadi — ariza yo'qolmaydi, lekin **ishga tushirishdan
   oldin albatta sozlang**.

4. Domenni **Custom domains** bo'limida ulang.
5. `content/settings.json` dagi `siteUrl` ni haqiqiy domenga o'zgartiring
   (yoki CMS'dagi «Настройки сайта» bo'limidan).

### Turnstile (spamdan himoya)

Cloudflare → Turnstile → yangi sayt. Site key ni `content/settings.json` ga
(`turnstileSiteKey`), secret key ni Pages o'zgaruvchilariga (`TURNSTILE_SECRET`) yozing.

---

## CMS'ni ulash

1. `cms-oauth-worker/worker.js` ni Cloudflare Worker sifatida joylashtiring
   (fayl ichida qadamba-qadam yozilgan).
2. `public/admin/config.yml` da ikki qatorni to'ldiring:
   - `repo: OWNER/REPO` — haqiqiy repozitoriya
   - `base_url:` — worker manzili
3. Roman `https://<sayt>/admin` ga kiradi va GitHub akkaunti bilan ulanadi.
   Uning GitHub akkaunti repozitoriyaga yozish huquqiga ega bo'lishi kerak.

Romanga mo'ljallangan qo'llanma: [`docs/cms-ru.md`](docs/cms-ru.md) (rus tilida).

---

## Tillar

- `/en` — asosiy, `/ru` — ruscha. Ildiz manzil brauzer tiliga qarab yo'naltiradi.
- Har bir sahifada `canonical` va uchta `hreflang` (en, ru, x-default).
- Kontentdagi har maydon ikki tilda. Tarjima bo'sh qolsa, ikkinchi til ishlatiladi —
  sayt hech qachon bo'sh joy ko'rsatmaydi.

## Analitika

`content/settings.json` dagi `gaId` ga GA4 identifikatorini yozing.
Kuzatiladigan hodisalar: `whatsapp_click`, `telegram_click`, `phone_click`,
`email_click`, `form_submit`, `partner_form_submit`.
UTM belgilari saqlanadi va ariza bilan birga yuboriladi.

## Zaxira nusxa

Alohida zaxira tizimi kerak emas: kod ham, kontent ham Git tarixida yotadi,
Cloudflare esa har bir nashrni saqlaydi va bir bosishda oldingi versiyaga qaytaradi.

---

## Tez ishga tushirish (Windows)

- **`start.bat`** — ishlab chiqish rejimi. Birinchi safar paketlarni o'zi o'rnatadi,
  keyin brauzerda `http://localhost:3000/ru` ochiladi. Kodni o'zgartirsangiz sahifa
  o'zi yangilanadi. Bu rejimda ildiz manzil (`/`) ochilmaydi — til bilan yozing.
- **`build.bat`** — statik versiyani yig'adi (`out/` papkasi) va uni
  `http://localhost:4000` da ko'rsatadi. Cloudflare Pages aynan shu natijani joylaydi.
  Bu yerda ildiz manzil ham, 404 sahifa ham ishlaydi.

`/admin` (CMS) faqat haqiqiy saytda ishlaydi — unga GitHub ulanishi kerak,
lokal kompyuterda ochilmaydi.
