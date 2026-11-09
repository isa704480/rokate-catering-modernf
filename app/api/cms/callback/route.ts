import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GitHub OAuth — 2-qadam.
 *
 * GitHub shu manzilga `code` bilan qaytaradi. Biz uni token'ga almashtiramiz
 * va token'ni Decap CMS turgan oynaga postMessage orqali uzatamiz.
 * Token brauzerdan nariga chiqmaydi, serverda saqlanmaydi.
 */

function page(body: string) {
  return new NextResponse(`<!doctype html><meta charset="utf-8">${body}`, {
    status: 200,
    headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" },
  });
}

function fail(message: string) {
  return page(
    `<body style="font:15px/1.6 system-ui;padding:40px;max-width:40em;margin:auto">
       <h1 style="font-size:18px">Не удалось войти</h1>
       <p>${message}</p>
     </body>`
  );
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const cookieState = request.headers
    .get("cookie")
    ?.split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith("cms_oauth_state="))
    ?.slice("cms_oauth_state=".length);

  if (!code) return fail("GitHub не вернул код авторизации. Попробуйте ещё раз.");
  if (!state || state !== cookieState)
    return fail("Проверка безопасности не прошла. Закройте окно и войдите заново.");

  const clientId = process.env.GITHUB_OAUTH_ID;
  const clientSecret = process.env.GITHUB_OAUTH_SECRET;
  if (!clientId || !clientSecret) return fail("На сервере не заданы ключи GitHub OAuth.");

  let token = "";
  try {
    const res = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: { "content-type": "application/json", accept: "application/json" },
      body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code }),
    });
    const data = (await res.json()) as { access_token?: string; error_description?: string };
    if (!data.access_token) return fail(data.error_description || "GitHub не выдал токен доступа.");
    token = data.access_token;
  } catch {
    return fail("Не удалось связаться с GitHub. Проверьте соединение и попробуйте снова.");
  }

  /* Decap CMS kutadigan almashuv: avval oyna "authorizing" xabarini oladi,
     keyin natijani qaytaramiz. */
  const payload = JSON.stringify({ token, provider: "github" });
  return page(
    `<body style="font:15px/1.6 system-ui;padding:40px;text-align:center">Входим…</body>
     <script>
       (function () {
         var result = 'authorization:github:success:' + ${JSON.stringify(payload)};
         function receive(e) {
           if (!window.opener) return;
           window.opener.postMessage(result, e.origin);
           window.removeEventListener('message', receive, false);
           setTimeout(function () { window.close(); }, 300);
         }
         window.addEventListener('message', receive, false);
         if (window.opener) window.opener.postMessage('authorizing:github', '*');
         else document.body.textContent = 'Окно админ-панели закрыто. Откройте /admin и войдите снова.';
       })();
     </script>`
  );
}
