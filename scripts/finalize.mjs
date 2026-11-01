/**
 * Build'dan keyin ikkita fayl yasaydi:
 *   out/index.html  — ildiz manzil; doim /en ga yo'naltiradi (default til — English,
 *                     keyin user o'zi header'dagi EN/RU almashtirgichida ozgartiradi)
 *   out/404.html    — topilmagan sahifa
 *
 * Ikkalasi ham o'zicha to'liq: Next'ning CSS fayliga bog'lanmaydi, chunki uning
 * nomi har build'da o'zgaradi. Shuning uchun uslublar fayl ichida yozilgan.
 */
import { writeFile } from "node:fs/promises";

const head = `<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="icon" href="/favicon.svg">
<style>
  :root { color-scheme: light }
  body {
    margin: 0; min-height: 100vh; display: grid; place-items: center;
    padding: 24px; background: #f7f4ee; color: #1c2340;
    font: 400 16px/1.6 system-ui, -apple-system, "Segoe UI", sans-serif;
  }
  .box { max-width: 34rem }
  .rule { width: 48px; height: 1px; background: #c9a96a; margin-bottom: 24px }
  h1 { font-size: clamp(1.6rem, 4vw, 2.4rem); line-height: 1.15; letter-spacing: -.03em; margin: 0 0 12px }
  p { color: #5b6179; margin: 0 0 28px }
  .row { display: flex; flex-wrap: wrap; gap: 12px }
  a {
    display: inline-flex; align-items: center; justify-content: center;
    border-radius: 999px; padding: 13px 26px; font-weight: 650; font-size: 15px;
    text-decoration: none; transition: background-color .2s, border-color .2s;
  }
  .primary { background: #2f5e46; color: #f7f4ee }
  .primary:hover { background: #20412f }
  .ghost { border: 1px solid #e3dccd; color: #1c2340 }
  .ghost:hover { border-color: #2f5e46 }
</style>`;

const redirect = `<!doctype html>
<html lang="en">
<head>
${head}
<title>Rokate Catering</title>
<meta name="robots" content="noindex">
<link rel="canonical" href="/en">
<link rel="alternate" hreflang="en" href="/en">
<link rel="alternate" hreflang="ru" href="/ru">
<link rel="alternate" hreflang="x-default" href="/en">
<meta http-equiv="refresh" content="0; url=/en">
<script>
  // Default til — English. Ru loyiha topshirig'ida: asosiy til EN.
  location.replace("/en");
</script>
</head>
<body>
  <div class="box">
    <div class="rule"></div>
    <h1>Rokate Catering</h1>
    <div class="row"><a class="primary" href="/en">English</a><a class="ghost" href="/ru">Русский</a></div>
  </div>
</body>
</html>
`;

const notFound = `<!doctype html>
<html lang="en">
<head>
${head}
<title>Page not found — Rokate Catering</title>
<meta name="robots" content="noindex">
</head>
<body>
  <div class="box">
    <div class="rule"></div>
    <h1>Page not found<br>Страница не найдена</h1>
    <p>The page does not exist or has moved.<br>Такой страницы нет или она была перенесена.</p>
    <div class="row"><a class="primary" href="/en">Rokate Catering</a><a class="ghost" href="/ru">Русская версия</a></div>
  </div>
</body>
</html>
`;

await writeFile("out/index.html", redirect);
await writeFile("out/404.html", notFound);
console.log("out/index.html va out/404.html tayyor.");
