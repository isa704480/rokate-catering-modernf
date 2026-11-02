"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { Logo } from "@/components/Logo";
import { ensureCsrf, type Me, papi } from "@/lib/panel";
import { AIcon } from "./AIcon";
import { Spinner } from "./ui";

const MeCtx = createContext<{ me: Me | null; refresh: () => void }>({ me: null, refresh: () => {} });
export const useMe = () => useContext(MeCtx);

export function Shell({ children }: { children: React.ReactNode }) {
  const [me, setMe] = useState<Me | null>(null);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const refresh = useCallback(() => { papi<Me>("me").then(setMe).catch(() => {}); }, []);
  useEffect(() => { ensureCsrf(); refresh(); }, [refresh]);
  useEffect(() => { setOpen(false); refresh(); }, [pathname, refresh]);

  async function logout() {
    await papi("logout", { method: "POST" }).catch(() => {});
    router.replace("/admin/login");
  }

  if (!me) return <Spinner />;

  const isActive = (key: string) => pathname === `/admin/r/${key}` || pathname.startsWith(`/admin/r/${key}/`);
  const linkCls = (active: boolean) =>
    `flex items-center gap-3 rounded-lg px-3 py-2 text-[14px] transition-colors ${active ? "bg-white/12 text-white font-semibold" : "text-white/70 hover:bg-white/8 hover:text-white"}`;

  const Sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center justify-between px-5">
        <Link href="/admin"><Logo light /></Link>
        <button type="button" className="grid h-10 w-10 place-items-center rounded-lg text-white lg:hidden" onClick={() => setOpen(false)} aria-label="Закрыть">
          <AIcon name="close" />
        </button>
      </div>
      <nav className="flex-1 overflow-y-auto px-3 pb-4">
        <Link href="/admin" className={linkCls(pathname === "/admin")}><AIcon name="dashboard" size={18} />Панель</Link>
        {me.nav.map((g) => (
          <div key={g.title} className="mt-5">
            <p className="px-3 pb-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-gold-soft/80">{g.title}</p>
            {g.items.map((it) => (
              <Link key={it.key} href={`/admin/r/${it.key}`} className={linkCls(isActive(it.key))}>
                <AIcon name={it.icon} size={18} />
                <span className="flex-1">{it.title}</span>
                {!!it.badge && <span className="rounded-full bg-lime px-2 py-0.5 text-[11px] font-bold text-ink">{it.badge}</span>}
              </Link>
            ))}
          </div>
        ))}
      </nav>
      <div className="border-t border-white/10 p-3">
        <a href="/" target="_blank" rel="noopener" className={linkCls(false)}><AIcon name="external" size={18} />Открыть сайт</a>
        <Link href="/admin/password" className={linkCls(pathname === "/admin/password")}><AIcon name="lock" size={18} />Сменить пароль</Link>
        <button type="button" onClick={logout} className={`${linkCls(false)} w-full`}><AIcon name="logout" size={18} />Выйти · {me.user.name}</button>
      </div>
    </div>
  );

  return (
    <MeCtx.Provider value={{ me, refresh }}>
      <div className="min-h-screen lg:pl-72">
        <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 bg-green-deep lg:block">{Sidebar}</aside>
        {/* mobil */}
        <div className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-line bg-white px-4 lg:hidden">
          <button type="button" onClick={() => setOpen(true)} className="grid h-10 w-10 place-items-center rounded-lg" aria-label="Меню"><AIcon name="menu" size={24} /></button>
          <Link href="/admin" className="font-display text-[22px] italic font-semibold">Rokate</Link>
          <a href="/" target="_blank" rel="noopener" className="grid h-10 w-10 place-items-center rounded-lg" aria-label="Сайт"><AIcon name="external" /></a>
        </div>
        <div className={`fixed inset-0 z-50 lg:hidden ${open ? "" : "pointer-events-none"}`}>
          <div className={`absolute inset-0 bg-black/40 transition-opacity ${open ? "opacity-100" : "opacity-0"}`} onClick={() => setOpen(false)} />
          <aside className={`absolute inset-y-0 left-0 w-[86%] max-w-xs bg-green-deep transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full"}`}>{Sidebar}</aside>
        </div>
        <main className="mx-auto max-w-6xl px-4 py-6 pb-28 sm:px-6 lg:px-10 lg:py-10">{children}</main>
      </div>
    </MeCtx.Provider>
  );
}
