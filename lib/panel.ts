"use client";

/** Frontend admin uchun API klient: Django sessiyasi + CSRF. */

export class PanelError extends Error {
  status: number;
  data: { error?: string; errors?: Record<string, string[]> };
  constructor(status: number, data: PanelError["data"]) {
    super(data?.error || `HTTP ${status}`);
    this.status = status;
    this.data = data || {};
  }
}

function csrfToken() {
  if (typeof document === "undefined") return "";
  return document.cookie.match(/(?:^|; )rk_md_csrftoken=([^;]+)/)?.[1] || "";
}

export async function ensureCsrf() {
  if (!csrfToken()) await fetch("/api/panel/csrf", { credentials: "same-origin" });
}

type Opts = { method?: string; json?: unknown; form?: FormData; noRedirect?: boolean };

export async function papi<T = any>(path: string, opts: Opts = {}): Promise<T> {
  const method = opts.method || (opts.json !== undefined || opts.form ? "POST" : "GET");
  if (method !== "GET") await ensureCsrf();
  const headers: Record<string, string> = { "X-CSRFToken": csrfToken() };
  let body: BodyInit | undefined;
  if (opts.form) body = opts.form;
  else if (opts.json !== undefined) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(opts.json);
  }
  const res = await fetch(`/api/panel/${path}`, { method, headers, body, credentials: "same-origin", cache: "no-store" });
  const data = await res.json().catch(() => ({}));
  if (res.status === 401 && !opts.noRedirect && typeof window !== "undefined") {
    window.location.href = `/admin/login?next=${encodeURIComponent(window.location.pathname + window.location.search)}`;
  }
  if (!res.ok) throw new PanelError(res.status, data);
  return data as T;
}

/* ---------- types ---------- */

export type FieldDef = {
  name: string;
  label: string;
  type: "text" | "textarea" | "slug" | "email" | "url" | "number" | "bool" | "date" | "datetime" | "select" | "fk" | "m2m" | "image" | "file";
  translated: boolean;
  required?: boolean;
  help?: string;
  readonly?: boolean;
  seo?: boolean;
  max_length?: number;
  step?: string;
  options?: { value: string | number; label: string }[];
};

export type ChildBlock = { child: string; title: string; upload?: string | null; orderable: boolean; fields: FieldDef[] };
export type Tab = { title: string; fields: (string | ChildBlock)[]; readonly?: boolean };

export type Schema = {
  key: string;
  title: string;
  one: string;
  singleton: boolean;
  fields: Record<string, FieldDef>;
  tabs: Tab[];
  list: FieldDef[];
  filters: FieldDef[];
  search: boolean;
  orderable: boolean;
  can_add: boolean;
  can_delete: boolean;
  can_change: boolean;
  export: boolean;
  slug_from: string | null;
  view_on_site: boolean;
};

export type FileVal = { url: string; name: string; thumb?: string } | null;
export type Tr = { en: string; ru: string };
export type Values = Record<string, any>;
export type ChildRow = { id: number; values: Values };
export type Item = { id: number; str: string; values: Values; children: Record<string, ChildRow[]>; url: string | null };

export type NavItem = { key: string; title: string; icon: string; singleton: boolean; badge?: number };
export type Me = { user: { username: string; name: string; superuser: boolean }; nav: { title: string; items: NavItem[] }[] };

export function slugify(s: string) {
  return (s || "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 50);
}

export const STATUS_COLORS: Record<string, string> = {
  new: "bg-sky-100 text-sky-800",
  contacted: "bg-amber-100 text-amber-800",
  won: "bg-emerald-100 text-emerald-800",
  lost: "bg-rose-100 text-rose-700",
  spam: "bg-zinc-200 text-zinc-600",
};
