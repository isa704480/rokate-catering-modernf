/**
 * Decap CMS uchun GitHub OAuth proksisi — Cloudflare Worker.
 *
 * Decap brauzerda ishlaydi va GitHub'ga to'g'ridan-to'g'ri ulana olmaydi:
 * GitHub maxfiy kalitni (client secret) talab qiladi. Shu worker o'sha
 * almashinuvni bajaradi. Boshqa hech narsa qilmaydi va hech narsa saqlamaydi.
 *
 * O'rnatish:
 *   1. GitHub -> Settings -> Developer settings -> OAuth Apps -> New OAuth App
 *      Homepage URL:               https://<sayt manzili>
 *      Authorization callback URL: https://<worker manzili>/callback
 *   2. Cloudflare -> Workers -> Create Worker -> shu faylni joylashtiring.
 *   3. Worker sozlamalarida ikki o'zgaruvchi (Secret sifatida):
 *      GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET
 *   4. public/admin/config.yml dagi `base_url` ga worker manzilini yozing.
 */

const ALLOWED_ORIGIN = "https://github.com";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/auth") {
      const redirect = new URL("https://github.com/login/oauth/authorize");
      redirect.searchParams.set("client_id", env.GITHUB_CLIENT_ID);
      redirect.searchParams.set("scope", "repo,user");
      redirect.searchParams.set("redirect_uri", `${url.origin}/callback`);
      return Response.redirect(redirect.toString(), 302);
    }

    if (url.pathname === "/callback") {
      const code = url.searchParams.get("code");
      if (!code) return new Response("code topilmadi", { status: 400 });

      const res = await fetch("https://github.com/login/oauth/access_token", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          client_id: env.GITHUB_CLIENT_ID,
          client_secret: env.GITHUB_CLIENT_SECRET,
          code,
          redirect_uri: `${url.origin}/callback`,
        }),
      });

      const data = await res.json();
      const payload = data.access_token
        ? { token: data.access_token, provider: "github" }
        : { error: data.error_description || "token olinmadi" };
      const status = data.access_token ? "success" : "error";

      // Decap natijani ochilgan oynadan postMessage orqali kutadi
      const html = `<!doctype html><html><body><script>
(function () {
  function send() {
    window.opener.postMessage(
      'authorization:github:${status}:' + ${JSON.stringify(JSON.stringify(payload))},
      '*'
    );
  }
  window.addEventListener('message', send, { once: true });
  window.opener.postMessage('authorizing:github', '*');
})();
</script><p>GitHub bilan ulanmoqda…</p></body></html>`;

      return new Response(html, { headers: { "Content-Type": "text/html;charset=utf-8" } });
    }

    return new Response("Rokate CMS auth", { status: 200 });
  },
};

export { ALLOWED_ORIGIN };
