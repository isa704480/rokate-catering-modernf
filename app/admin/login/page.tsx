"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { AIcon } from "@/components/admin/AIcon";
import { inputCls } from "@/components/admin/ui";
import { Logo } from "@/components/Logo";
import { ensureCsrf, PanelError, papi } from "@/lib/panel";

function LoginForm() {
  const router = useRouter();
  const next = useSearchParams().get("next") || "/admin";
  const [username, setU] = useState("");
  const [password, setP] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    ensureCsrf();
    papi("me", { noRedirect: true }).then(() => router.replace(next)).catch(() => {});
  }, [next, router]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await papi("login", { json: { username, password }, noRedirect: true });
      router.replace(next.startsWith("/admin") ? next : "/admin");
    } catch (err) {
      setError(err instanceof PanelError && err.data.error !== "validation" ? err.data.error || "Ошибка входа" : "Ошибка входа");
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="w-full max-w-sm rounded-2xl border border-line bg-white p-8 shadow-[0_20px_60px_rgba(21,32,64,.08)]">
      <Logo />
      <h1 className="mt-6 font-sans text-[22px] font-bold">Вход в админ-панель</h1>
      <p className="mt-1 text-[14px] text-ink-muted">Управление сайтом Rokate Catering</p>
      <label className="mt-6 block text-[13px] font-semibold" htmlFor="u">Логин</label>
      <input id="u" className={`${inputCls} mt-1.5`} autoComplete="username" value={username} onChange={(e) => setU(e.target.value)} autoFocus />
      <label className="mt-4 block text-[13px] font-semibold" htmlFor="p">Пароль</label>
      <input id="p" type="password" className={`${inputCls} mt-1.5`} autoComplete="current-password" value={password} onChange={(e) => setP(e.target.value)} />
      {error && <p role="alert" className="mt-4 rounded-lg bg-rose-50 px-3 py-2 text-[14px] text-rose-700">{error}</p>}
      <button type="submit" disabled={busy || !username || !password}
              className="mt-6 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-green font-semibold text-white hover:bg-green-deep disabled:opacity-60">
        <AIcon name="lock" size={18} />{busy ? "Входим…" : "Войти"}
      </button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <Suspense><LoginForm /></Suspense>
    </main>
  );
}
