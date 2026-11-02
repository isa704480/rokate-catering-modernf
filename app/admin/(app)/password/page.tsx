"use client";
import { useState } from "react";
import { Btn, Card, inputCls, PageHead, useToast } from "@/components/admin/ui";
import { PanelError, papi } from "@/lib/panel";

export default function PasswordPage() {
  const toast = useToast();
  const [old, setOld] = useState("");
  const [next, setNext] = useState("");
  const [rep, setRep] = useState("");
  const [error, setError] = useState("");
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (next !== rep) return setError("Пароли не совпадают");
    try {
      await papi("password", { json: { old, new: next } });
      toast("Пароль изменён");
      setOld(""); setNext(""); setRep("");
    } catch (err) {
      setError(err instanceof PanelError ? err.data.error || "Ошибка" : "Ошибка");
    }
  }
  return (
    <>
      <PageHead title="Сменить пароль" />
      <Card className="max-w-md p-6">
        <form onSubmit={submit} className="space-y-4">
          <label className="block"><span className="mb-1.5 block text-[13px] font-semibold">Текущий пароль</span><input type="password" className={inputCls} value={old} onChange={(e) => setOld(e.target.value)} autoComplete="current-password" /></label>
          <label className="block"><span className="mb-1.5 block text-[13px] font-semibold">Новый пароль (минимум 10 символов)</span><input type="password" className={inputCls} value={next} onChange={(e) => setNext(e.target.value)} autoComplete="new-password" /></label>
          <label className="block"><span className="mb-1.5 block text-[13px] font-semibold">Повторите новый пароль</span><input type="password" className={inputCls} value={rep} onChange={(e) => setRep(e.target.value)} autoComplete="new-password" /></label>
          {error && <p className="rounded-lg bg-rose-50 px-3 py-2 text-[14px] text-rose-700">{error}</p>}
          <Btn type="submit" disabled={!old || !next}>Сохранить</Btn>
        </form>
      </Card>
    </>
  );
}
