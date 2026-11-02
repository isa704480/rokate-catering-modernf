"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { type ChildBlock, type ChildRow, type Item, PanelError, papi, type Schema, slugify, type Values } from "@/lib/panel";
import { AIcon } from "./AIcon";
import { ChildList } from "./ChildList";
import { type FileState, FieldInput } from "./FieldInput";
import { useMe } from "./Shell";
import { Btn, Card, Spinner, useToast } from "./ui";

function initialValues(schema: Schema): Values {
  const v: Values = {};
  for (const f of Object.values(schema.fields)) {
    if (f.readonly) continue;
    v[f.name] = f.translated ? { en: "", ru: "" } : f.type === "bool" ? ["is_published", "is_featured", "show_on_home", "has_page", "is_available"].includes(f.name) : f.type === "m2m" ? [] : null;
    if (f.type === "select" && f.required && f.options?.length) v[f.name] = f.options[0].value;
  }
  return v;
}

export function Editor({ schema, id }: { schema: Schema; id: number | "new" }) {
  const router = useRouter();
  const toast = useToast();
  const { refresh } = useMe();
  const isNew = id === "new";
  const [item, setItem] = useState<Item | null>(null);
  const [values, setValues] = useState<Values>(() => initialValues(schema));
  const [children, setChildren] = useState<Record<string, ChildRow[]>>({});
  const [files, setFiles] = useState<Record<string, FileState>>({});
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [tab, setTab] = useState(0);
  const [dirty, setDirty] = useState(false);
  const [busy, setBusy] = useState(false);
  const [slugTouched, setSlugTouched] = useState(!isNew);

  useEffect(() => {
    if (isNew) return;
    papi<Item>(`r/${schema.key}/${id}`).then((it) => {
      setItem(it);
      setValues((v) => ({ ...v, ...it.values }));
      setChildren(it.children);
    }).catch(() => toast("Не удалось загрузить", "error"));
  }, [schema.key, id, isNew, toast]);

  // saqlanmagan o'zgarishlar haqida ogohlantirish
  useEffect(() => {
    const h = (e: BeforeUnloadEvent) => { if (dirty) { e.preventDefault(); e.returnValue = ""; } };
    window.addEventListener("beforeunload", h);
    return () => window.removeEventListener("beforeunload", h);
  }, [dirty]);

  const set = (name: string, v: any) => {
    setDirty(true);
    setValues((old) => {
      const next = { ...old, [name]: v };
      if (schema.slug_from === name && !slugTouched && "slug" in schema.fields) next.slug = slugify(v?.en || "");
      return next;
    });
    if (name === "slug") setSlugTouched(true);
  };

  // xatolarni (name_en, name_ru) maydon nomiga bog'lash
  const fieldErrors = useMemo(() => {
    const out: Record<string, string[]> = {};
    for (const [k, v] of Object.entries(errors)) {
      const base = k.replace(/_(en|ru)$/, "");
      const lang = k.match(/_(en|ru)$/)?.[1];
      out[base] = [...(out[base] || []), ...v.map((m) => (lang ? `${lang.toUpperCase()}: ${m}` : m))];
    }
    return out;
  }, [errors]);

  const tabHasError = (i: number) => schema.tabs[i].fields.some((f) => typeof f === "string" && fieldErrors[f]);

  async function save() {
    setBusy(true);
    setErrors({});
    const fd = new FormData();
    for (const f of Object.values(schema.fields)) {
      if (f.readonly) continue;
      const v = values[f.name];
      if (f.translated) { fd.append(`${f.name}_en`, v?.en ?? ""); fd.append(`${f.name}_ru`, v?.ru ?? ""); }
      else if (f.type === "bool") { if (v) fd.append(f.name, "on"); }
      else if (f.type === "m2m") (v || []).forEach((x: any) => fd.append(f.name, String(x)));
      else if (f.type === "image" || f.type === "file") {
        if (files[f.name]?.file) fd.append(f.name, files[f.name].file!);
        else if (files[f.name]?.clear) fd.append(`${f.name}-clear`, "on");
      } else fd.append(f.name, v === null || v === undefined ? "" : String(v));
    }
    try {
      if (isNew) {
        const r = await papi<{ id: number }>(`r/${schema.key}`, { form: fd });
        setDirty(false);
        toast("Создано");
        router.replace(`/admin/r/${schema.key}/${r.id}`);
      } else {
        const r = await papi<Item>(`r/${schema.key}/${id}`, { form: fd });
        setItem(r);
        setValues((v) => ({ ...v, ...r.values }));
        setFiles({});
        setDirty(false);
        toast("Сохранено — сайт обновится через пару секунд");
        refresh();
      }
    } catch (e) {
      if (e instanceof PanelError && e.data.errors) {
        setErrors(e.data.errors);
        const firstBad = schema.tabs.findIndex((t) => t.fields.some((f) => typeof f === "string" && Object.keys(e.data.errors!).some((k) => k.replace(/_(en|ru)$/, "") === f)));
        if (firstBad >= 0) setTab(firstBad);
        toast("Проверьте поля, отмеченные красным", "error");
      } else toast("Не удалось сохранить", "error");
    }
    setBusy(false);
  }

  async function remove() {
    if (!confirm(`Удалить «${item?.str}»? Это действие нельзя отменить.`)) return;
    try {
      await papi(`r/${schema.key}/${id}`, { method: "DELETE" });
      setDirty(false);
      toast("Удалено");
      router.replace(`/admin/r/${schema.key}`);
    } catch { toast("Не удалось удалить", "error"); }
  }

  if (!isNew && !item) return <Spinner />;
  const title = isNew ? `Новый: ${schema.one.toLowerCase()}` : schema.singleton ? schema.title : item!.str;
  const editable = schema.can_change;

  return (
    <>
      <div className="mb-5">
        {!schema.singleton && (
          <Link href={`/admin/r/${schema.key}`} className="mb-2 inline-flex items-center gap-1 text-[13px] font-semibold text-ink-muted hover:text-green">
            <AIcon name="chevronLeft" size={16} />{schema.title}
          </Link>
        )}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="font-sans text-[24px] font-bold tracking-tight">{title}</h1>
          {item?.url && (
            <a href={item.url} target="_blank" rel="noopener" className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-green">
              <AIcon name="external" size={16} />Смотреть на сайте
            </a>
          )}
        </div>
      </div>

      {schema.tabs.length > 1 && (
        <div className="-mx-4 mb-5 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          <div className="inline-flex gap-1 rounded-xl bg-sand/70 p-1">
            {schema.tabs.map((t, i) => (
              <button key={t.title} type="button" onClick={() => setTab(i)}
                      className={`relative whitespace-nowrap rounded-lg px-3.5 py-2 text-[14px] font-semibold transition ${tab === i ? "bg-white text-ink shadow-sm" : "text-ink-muted hover:text-ink"}`}>
                {t.title}
                {tabHasError(i) && <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-rose-500" />}
              </button>
            ))}
          </div>
        </div>
      )}

      {schema.tabs.map((t, ti) => (
        <div key={t.title} hidden={ti !== tab}>
          <Card className={`p-4 sm:p-6 ${t.readonly ? "bg-sand/30" : ""}`}>
            <div className={t.readonly ? "grid gap-5 sm:grid-cols-2" : "space-y-6"}>
              {t.fields.map((f) => {
                if (typeof f !== "string") {
                  const block = f as ChildBlock;
                  return (
                    <div key={block.child} className="border-t border-line pt-6 first:border-0 first:pt-0">
                      {isNew ? (
                        <p className="rounded-xl bg-sand/60 px-4 py-3 text-[14px] text-ink-muted">«{block.title}» можно добавить после первого сохранения.</p>
                      ) : (
                        <ChildList resKey={schema.key} parentId={item!.id} block={block} rows={children[block.child] || []}
                                   onChange={(c) => setChildren(c)} />
                      )}
                    </div>
                  );
                }
                const def = schema.fields[f];
                if (!def) return null;
                const val = def.readonly ? item?.values[f] : values[f];
                return (
                  <FieldInput key={f} f={editable ? def : { ...def, readonly: true }} value={val} onChange={(v) => set(f, v)}
                              file={files[f]} onFile={(s) => { setFiles((x) => ({ ...x, [f]: s })); setDirty(true); }}
                              error={fieldErrors[f]} />
                );
              })}
            </div>
          </Card>
        </div>
      ))}

      {editable && (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white/95 backdrop-blur lg:left-72">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-10">
            <div>
              {!isNew && schema.can_delete && <Btn kind="danger" onClick={remove}><AIcon name="trash" size={16} /><span className="hidden sm:inline">Удалить</span></Btn>}
            </div>
            <div className="flex items-center gap-3">
              {dirty && <span className="hidden text-[13px] text-amber-700 sm:inline">Есть несохранённые изменения</span>}
              <Btn onClick={save} disabled={busy} className="min-w-[140px]"><AIcon name="save" size={16} />{busy ? "Сохраняем…" : "Сохранить"}</Btn>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
