import { NextResponse, type NextRequest } from "next/server";

/**
 * Til marshrutlari:
 *   /            -> app/[locale=en]   (ingliz tili prefikssiz, asosiy)
 *   /ru/...      -> app/[locale=ru]
 *   /en/...      -> 308 redirect prefikssiz manzilga (dublikat bo'lmasligi uchun)
 */
export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  if (pathname === "/ru" || pathname.startsWith("/ru/")) return NextResponse.next();

  if (pathname === "/en" || pathname.startsWith("/en/")) {
    const url = req.nextUrl.clone();
    url.pathname = pathname.slice(3) || "/";
    return NextResponse.redirect(url, 308);
  }

  const url = req.nextUrl.clone();
  url.pathname = `/en${pathname === "/" ? "" : pathname}`;
  url.search = search;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/((?!api|admin|_next|media|static|favicon.ico|robots.txt|sitemap.xml|llms.txt|.*\\..*).*)"],
};
