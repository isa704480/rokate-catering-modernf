import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Admin panel uchun GitHub OAuth — 1-qadam.
 *
 * Decap CMS "Login with GitHub" bosilganda shu manzilni yangi oynada ochadi.
 * Biz foydalanuvchini GitHub'ning ruxsat so'rash sahifasiga yuboramiz.
 * Qaytishi /api/cms/callback da.
 *
 * Kerakli muhit o'zgaruvchilari (Vercel → Settings → Environment Variables):
 *   GITHUB_OAUTH_ID      — GitHub OAuth App'ning Client ID
 *   GITHUB_OAUTH_SECRET  — uning Client Secret
 *   CMS_BASE_URL         — (ixtiyoriy) saytning asosiy manzili
 */
export function GET(request: Request) {
  const clientId = process.env.GITHUB_OAUTH_ID;
  if (!clientId) {
    return new NextResponse(
      "GITHUB_OAUTH_ID не задан. Добавьте переменные окружения на Vercel и пересоберите сайт.",
      { status: 500, headers: { "content-type": "text/plain; charset=utf-8" } }
    );
  }

  const origin = process.env.CMS_BASE_URL || new URL(request.url).origin;
  const state = crypto.randomUUID();

  const authorize = new URL("https://github.com/login/oauth/authorize");
  authorize.searchParams.set("client_id", clientId);
  authorize.searchParams.set("redirect_uri", `${origin}/api/cms/callback`);
  authorize.searchParams.set("scope", "repo,user");
  authorize.searchParams.set("state", state);

  const res = NextResponse.redirect(authorize.toString());
  res.cookies.set("cms_oauth_state", state, {
    httpOnly: true,
    secure: origin.startsWith("https"),
    sameSite: "lax",
    path: "/",
    maxAge: 600,
  });
  return res;
}
