"use client";
import { useState } from "react";
import { type ChildBlock, type ChildRow, type FieldDef, PanelError, papi } from "@/lib/panel";
import { AIcon } from "./AIcon";
import { type FileState, FieldInput } from "./FieldInput";
import { Btn, useToast } from "./ui";

type Props = { resKey: string; parentId: number; block: ChildBlock; rows: ChildRow[]; onChange: (children: Record<string, ChildRow[]>) => void };

function emptyValues(fields: FieldDef[]) {
  const v: Record<string, any> = {};
  for (const f of fields) v[f.name] = f.translated ? { en: "", ru: "" } : f.type === "bool" ? true : null;
  return v;
}

function toForm(fields: FieldDef[], values: Record<string, any>, files: Record<string, FileState>) {
  const fd = new FormData();
  for (const f of fields) {
    const v = values[f.name];
    if (f.translated) { fd.append(`${f.name}_en`, v?.en ?? ""); fd.append(`${f.name}_ru`, v?.ru ?? ""); }
    else if (f.type === "bool") { if (v) fd.append(f.name, "on"); }
    else if (f.type === "image" || f.type === "file") { if (files[f.name]?.file) fd.append(f.name, files[f.name].file!); }
    else fd.append(f.name, v ?? "");
  }
  return fd;
}

/** Bitta qator (masalan: menyu pozitsiyasi, qadam, galereya rasmi). */
function RowEditor({ block, row, index, total, onSave, onDelete, onMove }: {
  block: ChildBlock; row: ChildRow; index: number; total: number;
  onSave: (values: Record<string, any>, files: Record<string, FileState>) => Promise<boolean>;
  onDelete: () => void; onMove: (dir: -1 | 1) => void;
}) {
  const [values, setValues] = useState(row.values);
  const [files, setFiles] = useState<Record<string, FileState>>({});
  const [dirty, setDirty] = useState(false);
  const [busy, setBusy] = useState(false);
  const img = block.upload ? row.values[block.upload] : null;
  const fields = block.fields.filter((f) => f.name !== block.upload);

  return (
    <div className="flex gap-3 rounded-xl border border-line bg-white p-3 sm:p-4">
      {block.orderable && (
        <div className="flex flex-col justify-center gap-1">
          <button type="button" aria-label="Выше" disabled={index === 0} onClick={() => onMove(-1)} className="rounded p-1 text-ink-muted hover:bg-sand disabled:opacity-25"><AIcon name="up" size={16} /></button>
          <button type="button" aria-label="Ниже" disabled={index === total - 1} onClick={() => onMove(1)} className="rounded p-1 text-ink-muted hover:bg-sand disabled:opacity-25"><AIcon name="down" size={16} /></button>
        </div>
      )}
      {img && (
        <a href={img.url} target="_blank" rel="noopener" className="shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={img.thumb || img.url} alt="" className="h-24 w-24 rounded-lg object-cover sm:h-28 sm:w-28" />
        </a>
      )}
      <div className="min-w-0 flex-1 space-y-3">
        {fields.map((f) => (
          <FieldInput key={f.name} f={f} compact={!!block.upload} value={values[f.name]}
                      onChange={(v) => { setValues((x) => ({ ...x, [f.name]: v })); setDirty(true); }}
                      file={files[f.name]} onFile={(s) => { setFiles((x) => ({ ...x, [f.name]: s })); setDirty(true); }} />
        ))}
        <div className="flex flex-wrap justify-end gap-2">
          <Btn kind="danger" onClick={onDelete}><AIcon name="trash" size={16} />Удалить</Btn>
          {dirty && (
            <Btn disabled={busy} onClick={async () => { setBusy(true); if (await onSave(values, files)) setDirty(false); setBusy(false); }}>
              <AIcon name="save" size={16} />{busy ? "Сохраняем…" : "Сохранить"}
            </Btn>
          )}
        </div>
      </div>
    </div>
  );
}

export function ChildList({ resKey, parentId, block, rows, onChange }: Props) {
  const toast = useToast();
  const [adding, setAdding] = useState(false);
  const [newValues, setNewValues] = useState(() => emptyValues(block.fields));
  const [uploading, setUploading] = useState(false);
  const [drag, setDrag] = useState(false);
  const base = `r/${resKey}/${parentId}/c/${block.child}`;

  const fail = (e: unknown) => {
    const msg = e instanceof PanelError && e.data.errors ? Object.values(e.data.errors).flat().join(" ") : e instanceof PanelError ? e.data.error : "";
    toast(msg || "Ошибка сохранения", "error");
  };

  async function upload(list: FileList | File[]) {
    const files = Array.from(list);
    if (!files.length || !block.upload) return;
    setUploading(true);
    const fd = new FormData();
    files.forEach((f) => fd.append("files", f));
    try {
      const r = await papi(base, { form: fd });
      onChange(r.children);
      toast(`Добавлено фото: ${files.length}`);
    } catch (e) { fail(e); }
    setUploading(false);
  }

  async function saveRow(id: number, values: Record<string, any>, files: Record<string, FileState>) {
    try {
      const r = await papi(`${base}/${id}`, { form: toForm(block.fields.filter((f) => f.name !== block.upload), values, files) });
      onChange(r.children);
      toast("Сохранено");
      return true;
    } catch (e) { fail(e); return false; }
  }

  async function del(id: number) {
    if (!confirm("Удалить?")) return;
    try {
      const r = await papi(`${base}/${id}`, { method: "DELETE" });
      onChange(r.children);
      toast("Удалено");
    } catch (e) { fail(e); }
  }

  async function move(index: number, dir: -1 | 1) {
    const ids = rows.map((r) => r.id);
    const j = index + dir;
    [ids[index], ids[j]] = [ids[j], ids[index]];
    try {
      const r = await papi(`${base}/reorder`, { json: { ids } });
      onChange(r.children);
    } catch (e) { fail(e); }
  }

  async function create() {
    try {
      const r = await papi(base, { form: toForm(block.fields, newValues, {}) });
      onChange(r.children);
      setNewValues(emptyValues(block.fields));
      setAdding(false);
      toast("Добавлено");
    } catch (e) { fail(e); }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-sans text-[16px] font-bold">{block.title} <span className="font-normal text-ink-muted">· {rows.length}</span></h3>
      </div>

      {block.upload && (
        <label
          onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => { e.preventDefault(); setDrag(false); upload(e.dataTransfer.files); }}
          className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-4 py-8 text-center transition ${
            drag ? "border-green bg-green/5" : "border-line bg-white hover:border-green"}`}>
          <AIcon name="upload" size={28} className="text-green" />
          <span className="text-[15px] font-semibold">{uploading ? "Загружаем…" : "Перетащите фото сюда или нажмите, чтобы выбрать"}</span>
          <span className="text-[12px] text-ink-muted">Можно сразу много фото. JPG, PNG, HEIC (iPhone) — сайт сам их сожмёт.</span>
          <input type="file" multiple accept="image/*,.heic,.heif" className="sr-only" disabled={uploading}
                 onChange={(e) => { if (e.target.files) upload(e.target.files); e.target.value = ""; }} />
        </label>
      )}

      {rows.map((row, i) => (
        <RowEditor key={row.id} block={block} row={row} index={i} total={rows.length}
                   onSave={(v, f) => saveRow(row.id, v, f)} onDelete={() => del(row.id)} onMove={(d) => move(i, d)} />
      ))}

      {!block.upload && (adding ? (
        <div className="space-y-3 rounded-xl border-2 border-dashed border-green/40 bg-white p-4">
          {block.fields.map((f) => (
            <FieldInput key={f.name} f={f} value={newValues[f.name]} onChange={(v) => setNewValues((x) => ({ ...x, [f.name]: v }))} />
          ))}
          <div className="flex justify-end gap-2">
            <Btn kind="ghost" onClick={() => setAdding(false)}>Отмена</Btn>
            <Btn onClick={create}><AIcon name="plus" size={16} />Добавить</Btn>
          </div>
        </div>
      ) : (
        <Btn kind="outline" onClick={() => setAdding(true)}><AIcon name="plus" size={16} />Добавить</Btn>
      ))}
    </div>
  );
}
