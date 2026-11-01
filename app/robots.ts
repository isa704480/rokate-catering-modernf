import type { MetadataRoute } from "next";
import { doc } from "@/lib/content";
import type { Settings } from "@/lib/types";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  const settings = doc<Settings>("settings", "en");
  const base = settings.siteUrl.replace(/\/$/, "");

  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/en/thank-you", "/ru/thank-you"] }],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
