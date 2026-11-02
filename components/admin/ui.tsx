"use client";
import { createContext, useCallback, useContext, useState } from "react";
import { AIcon } from "./AIcon";

/* ---------- Toast ---------- */
type Toast = { id: number; text: string; kind: "ok" | "error" };
const ToastCtx = createContext<(text: string, kind?: Toast["kind"]) => void>(() => {});

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Toast[]>([]);
  const push = useCallback((text: string, kind: Toast["kind"] = "ok") => {
    const id = Date.now() + Math.random();
    setItems((x) => [...x, { id, text, kind }]);
    setTimeout(() => setItems((x) => x.filter((t) => t.id !== id)), 3500);
  }, []);
  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-20 z-[60] flex flex-col items-center gap-2 px-4 lg:bottom-6">
        {items.map((t) => (
          <div key={t.id} role="status"
               className={`pointer-events-auto flex items-center gap-2 rounded-xl px-4 py-3 text-[14px] font-medium shadow-lg ${
                 t.kind === "ok" ? "bg-green-deep text-white" : "bg-rose-600 text-white"}`}>
            <AIcon name={t.kind === "ok" ? "check" : "help"} size={18} />{t.text}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}
export const useToast = () => useContext(ToastCtx);

/* ---------- Primitives ---------- */
export function Btn({ kind = "primary", className = "", ...p }: React.ButtonHTMLAttributes<HTMLButtonElement> & { kind?: "primary" | "ghost" | "danger" | "outline" }) {
  const k = {
    primary: "bg-green text-white hover:bg-green-deep disabled:opacity-60",
    outline: "border border-line bg-white text-ink hover:border-ink/40",
    ghost: "text-ink-muted hover:bg-sand hover:text-ink",
    danger: "text-rose-700 hover:bg-rose-50",
  }[kind];
  return <button type="button" {...p} className={`inline-flex h-10 items-center justify-center gap-2 rounded-lg px-4 text-[14px] font-semibold transition-colors ${k} ${className}`} />;
}

export function Switch({ checked, onChange, label, disabled }: { checked: boolean; onChange: (v: boolean) => void; label?: string; disabled?: boolean }) {
  return (
    <button type="button" role="switch" aria-checked={checked} aria-label={label} disabled={disabled}
            onClick={(e) => { e.stopPropagation(); onChange(!checked); }}
            className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${checked ? "bg-green" : "bg-zinc-300"} disabled:opacity-50`}>
      <span className={`inline-block h-5 w-5 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-5" : "translate-x-0.5"}`} />
    </button>
  );
}

export function Card({ className = "", ...p }: React.HTMLAttributes<HTMLDivElement>) {
  return <div {...p} className={`rounded-2xl border border-line bg-white ${className}`} />;
}

export function Spinner() {
  return <div className="flex justify-center py-16"><span className="h-8 w-8 animate-spin rounded-full border-2 border-line border-t-green" /></div>;
}

export function PageHead({ title, sub, actions }: { title: string; sub?: string; actions?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-sans text-[26px] font-bold tracking-tight text-ink">{title}</h1>
        {sub && <p className="mt-1 text-[14px] text-ink-muted">{sub}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export const inputCls =
  "w-full rounded-lg border border-line bg-white px-3 py-2.5 text-[15px] text-ink outline-none transition focus:border-green focus:ring-2 focus:ring-green/15 disabled:bg-sand/60";
