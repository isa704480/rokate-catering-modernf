import type { Locale } from "./types";
import { DEMO } from "./demo";
import demoData from "./demo-data.json";

const API = (process.env.API_INTERNAL_URL || "http://localhost:8002").replace(/\/$/, "");

/** Django API'dan ma'lumot olish. Kesh: 10 daqiqa + admin saqlaganda darhol yangilanadi (tag "cms"). */
export async function api<T>(path: string, lang: Locale): Promise<T | null> {
  if (DEMO) {
    const v = (demoData as unknown as Record<string, Record<string, unknown>>)[lang]?.[path];
    return (v ?? null) as T | null;
  }
  const sep = path.includes("?") ? "&" : "?";
  const res = await fetch(`${API}/api/v1/${path}${sep}lang=${lang}`, {
    next: { revalidate: 600, tags: ["cms"] },
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`API ${path}: ${res.status}`);
  return (await res.json()) as T;
}
