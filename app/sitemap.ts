import type { MetadataRoute } from "next";
import { href, SITE_URL } from "@/lib/site";
import { DEMO } from "@/lib/demo";
import demoData from "@/lib/demo-data.json";

export const dynamic = "force-static";

const API = (process.env.API_INTERNAL_URL || "http://localhost:8002").replace(/\/$/, "");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let items: { path: string; updated: string }[] = [{ path: "/", updated: new Date().toISOString() }];
  if (DEMO) items = demoData.sitemap;
  else try {
    const res = await fetch(`${API}/api/v1/sitemap`, { next: { revalidate: 3600, tags: ["cms"] } });
    if (res.ok) items = await res.json();
  } catch {
    /* build paytida backend ishlamasligi mumkin */
  }
  return items.map((i) => ({
    url: `${SITE_URL}${href("en", i.path)}`,
    lastModified: i.updated,
    alternates: { languages: { en: `${SITE_URL}${href("en", i.path)}`, ru: `${SITE_URL}${href("ru", i.path)}` } },
  }));
}
