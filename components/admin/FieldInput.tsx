"use client";
import { useEffect, useMemo, useRef } from "react";
import type { FieldDef, FileVal } from "@/lib/panel";
import { AIcon } from "./AIcon";
import { inputCls, Switch } from "./ui";

/** Matn maydoni balandligi kontentga qarab o'sadi. */
function AutoTextarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const ref = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight + 2, 520)}px`;
  }, [props.value]);
  return <textarea ref={ref} rows={3} {...props} className={`${inputCls} resize-y leading-relaxed ${props.className || ""}`} />;
}

export type FileState = { file?: File; clear?: boolean };

function FilePicker({ f, value, state, onState }: { f: FieldDef; value: FileVal; state?: FileState; onState: (s: FileState) => void }) {
  const preview = useMemo(() => (state?.file && f.type === "image" ? URL.createObjectURL(state.file) : null), [state?.file, f.type]);
  const current = state?.clear ? null : value;
  const thumb = preview || (current && (current.thumb || (f.type === "image" ? current.url : null)));
  return (
    <div className="flex flex-wrap items-center gap-4">
      {f.type === "image" && (
        thumb
          // eslint-disable-next-line @next/next/no-img-element
          ? <img src={thumb} alt="" className="h-28 w-28 rounded-xl border border-line object-cover" />
          : <div className="grid h-28 w-28 place-items-center rounded-xl border border-dashed border-line text-ink-muted"><AIcon name="photo" size={28} /></div>
      )}
      <div className="flex flex-col gap-2 text-[13px]">
        {state?.file ? <span className="font-semibold text-green">Новый файл: {state.file.name}</span>
          : current ? <a href={current.url} target="_blank" rel="noopener" className="max-w-[260px] truncate text-ink-muted underline">{current.name}</a>
          : <span className="text-ink-muted">Файл не выбран</span>}
        <div className="flex flex-wrap gap-2">
          <label className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-lg border border-line bg-white px-3 font-semibold hover:border-green hover:text-green">
            <AIcon name="upload" size={16} />{current || state?.file ? "Заменить" : "Загрузить"}
            <input type="file" className="sr-only" accept={f.type === "image" ? "image/*,.heic,.heif" : f.name.includes("pdf") ? "application/pdf" : undefined}
                   onChange={(e) => { const file = e.target.files?.[0]; if (file) onState({ file }); e.target.value = ""; }} />
          </label>
          {(current || state?.file) && !f.required && (
            <button type="button" onClick={() => onState({ clear: true })} className="inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-rose-700 hover:bg-rose-50">
              <AIcon name="trash" size={16} />Удалить
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

type Props = {
  f: FieldDef;
  value: any;
  onChange: (v: any) => void;
  file?: FileState;
  onFile?: (s: FileState) => void;
  error?: string[];
  compact?: boolean;
};

export function FieldInput({ f, value, onChange, file, onFile, error, compact }: Props) {
  const label = (
    <span className="mb-1.5 block text-[13px] font-semibold text-ink">
      {f.label}{f.required && <span className="text-rose-600"> *</span>}
    </span>
  );
  const help = !compact && f.help && <span className="mt-1 block text-[12px] text-ink-muted">{f.help}</span>;
  const err = error && error.length > 0 && <span className="mt-1 block text-[12px] font-medium text-rose-600">{error.join(" ")}</span>;
  const counter = (v: string) => f.max_length && (f.seo || (v || "").length > f.max_length * 0.8)
    ? <span className={`ml-auto text-[11px] ${(v || "").length > f.max_length ? "text-rose-600" : "text-ink-muted"}`}>{(v || "").length}/{f.max_length}</span> : null;

  if (f.readonly) {
    let shown = value;
    if (f.type === "select" || f.type === "fk") shown = f.options?.find((o) => String(o.value) === String(value))?.label ?? value;
    if (f.translated && value) shown = [value.en, value.ru].filter(Boolean).join(" / ");
    return (
      <div>
        <span className="mb-1 block text-[12px] font-semibold uppercase tracking-wide text-ink-muted">{f.label}</span>
        {f.name === "phone" && shown ? (
          <a href={`https://wa.me/${String(shown).replace(/\D/g, "")}`} target="_blank" rel="noopener" className="text-[15px] font-semibold text-[#1f9d55] underline">
            {String(shown)} · WhatsApp
          </a>
        ) : f.name === "email" && shown ? (
          <a href={`mailto:${shown}`} className="text-[15px] underline">{String(shown)}</a>
        ) : (
          <p className="whitespace-pre-wrap break-words text-[15px]">{shown === null || shown === undefined || shown === "" ? "—" : String(shown)}</p>
        )}
      </div>
    );
  }

  if (f.translated) {
    const v = value || { en: "", ru: "" };
    return (
      <div>
        {label}
        <div className={`grid gap-3 ${compact ? "" : "md:grid-cols-2"}`}>
          {(["en", "ru"] as const).map((lang) => (
            <div key={lang}>
              <div className="mb-1 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-ink-muted">
                <span className={`rounded px-1.5 py-0.5 ${lang === "en" ? "bg-sky-100 text-sky-800" : "bg-rose-100 text-rose-800"}`}>{lang === "en" ? "EN" : "RU"}</span>
                {lang === "en" ? "English" : "Русский"}{counter(v[lang])}
              </div>
              {f.type === "textarea"
                ? <AutoTextarea value={v[lang] ?? ""} onChange={(e) => onChange({ ...v, [lang]: e.target.value })} />
                : <input className={inputCls} value={v[lang] ?? ""} maxLength={f.max_length} onChange={(e) => onChange({ ...v, [lang]: e.target.value })} />}
            </div>
          ))}
        </div>
        {help}{err}
      </div>
    );
  }

  let control: React.ReactNode;
  switch (f.type) {
    case "bool":
      return (
        <div className="flex items-start justify-between gap-4 rounded-xl border border-line bg-white px-4 py-3">
          <div>
            <span className="block text-[14px] font-semibold">{f.label}</span>
            {help}{err}
          </div>
          <Switch checked={!!value} onChange={onChange} label={f.label} />
        </div>
      );
    case "textarea":
      control = <AutoTextarea value={value ?? ""} onChange={(e) => onChange(e.target.value)} />;
      break;
    case "select":
    case "fk":
      control = (
        <select className={inputCls} value={value ?? ""} onChange={(e) => onChange(e.target.value === "" ? null : e.target.value)}>
          {(!f.required || f.type === "fk") && <option value="">—</option>}
          {f.options?.map((o) => <option key={String(o.value)} value={String(o.value)}>{o.label}</option>)}
        </select>
      );
      break;
    case "m2m": {
      const sel: (string | number)[] = value || [];
      control = (
        <div className="flex flex-wrap gap-2">
          {f.options?.map((o) => {
            const on = sel.map(String).includes(String(o.value));
            return (
              <button type="button" key={String(o.value)} onClick={() => onChange(on ? sel.filter((x) => String(x) !== String(o.value)) : [...sel, o.value])}
                      className={`rounded-full border px-3 py-1.5 text-[13px] transition ${on ? "border-green bg-green text-white" : "border-line bg-white hover:border-green"}`}>
                {on && "✓ "}{o.label}
              </button>
            );
          })}
        </div>
      );
      break;
    }
    case "image":
    case "file":
      control = <FilePicker f={f} value={value} state={file} onState={(s) => onFile?.(s)} />;
      break;
    case "number":
      control = <input type="number" inputMode="decimal" step={f.step || "1"} className={inputCls} value={value ?? ""} onChange={(e) => onChange(e.target.value === "" ? null : e.target.value)} />;
      break;
    case "date":
      control = <input type="date" className={inputCls} value={value ?? ""} onChange={(e) => onChange(e.target.value || null)} />;
      break;
    default:
      control = (
        <div className="relative">
          <input type={f.type === "email" ? "email" : f.type === "url" ? "url" : "text"} className={inputCls} value={value ?? ""} maxLength={f.max_length}
                 onChange={(e) => onChange(f.type === "slug" ? e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-") : e.target.value)} />
        </div>
      );
  }
  const Wrap = f.type === "image" || f.type === "file" || f.type === "m2m" ? "div" : "label";
  return (
    <Wrap className="block">
      <span className="flex items-center">{label}{f.type === "text" && counter(value)}</span>
      {control}
      {help}{err}
    </Wrap>
  );
}
