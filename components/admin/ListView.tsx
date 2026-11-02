"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { type FieldDef, papi, type Schema, STATUS_COLORS } from "@/lib/panel";
import { AIcon } from "./AIcon";
import { Btn, Card, inputCls, PageHead, Spinner, Switch, useToast } from "./ui";

type Row = { id: number; str: string; cells: Record<string, any> };
type ListResp = { total: number; page: number; pages: number; rows: Row[] };

function Cell({ f, v, onToggle }: { f: FieldDef; v: any; onToggle?: () => void }) {
  if (f.type === "image") {
    return v?.thumb
      // eslint-disable-next-line @next/next/no-img-element
      ? <img src={v.thumb} alt="" className="h-12 w-12 rounded-lg object-cover" />
      : <div className="h-12 w-12 rounded-lg bg-sand" />;
  }
  if (f.type === "bool") return <Switch checked={!!v} onChange={() => onToggle?.()} label={f.label} />;
  if (f.type === "select") {
    if (!v) return <span className="text-ink-muted">—</span>;
    const color = STATUS_COLORS[v.value];
    return color
      ? <span className={`whitespace-nowrap rounded-full px-2.5 py-1 text-[12px] font-semibold ${color}`}>{v.label}</span>
      : <span>{v.label}</span>;
  }
  if (v === null || v === undefined || v === "") return <span className="text-ink-muted">—</span>;
  return <span>{String(v)}</span>;
}

export function ListView({ schema }: { schema: Schema }) {
  const router = useRouter();
  const sp = useSearchParams();
  const toast = useToast();
  const [data, setData] = useState<ListResp | null>(null);
  const [q, setQ] = useState(sp.get("q") || "");
  const filters = useMemo(() => Object.fromEntries(schema.filters.map((f) => [f.name, sp.get(f.name) || ""])), [schema, sp]);
  const page = Number(sp.get("page") || 1);

  const query = useCallback(() => {
    const p = new URLSearchParams();
    if (sp.get("q")) p.set("q", sp.get("q")!);
    for (const [k, v] of Object.entries(filters)) if (v) p.set(k, v);
    if (page > 1) p.set("page", String(page));
    return p.toString();
  }, [sp, filters, page]);

  const load = useCallback(() => {
    papi<ListResp>(`r/${schema.key}?${query()}`).then(setData).catch(() => toast("Не удалось загрузить", "error"));
  }, [schema.key, query, toast]);
  useEffect(() => { load(); }, [load]);

  // qidiruv (debounce)
  useEffect(() => {
    const t = setTimeout(() => {
      if ((sp.get("q") || "") === q) return;
      const p = new URLSearchParams(sp.toString());
      if (q) p.set("q", q); else p.delete("q");
      p.delete("page");
      router.replace(`?${p.toString()}`);
    }, 350);
    return () => clearTimeout(t);
  }, [q, sp, router]);

  const setFilter = (name: string, value: string) => {
    const p = new URLSearchParams(sp.toString());
    if (value) p.set(name, value); else p.delete(name);
    p.delete("page");
    router.replace(`?${p.toString()}`);
  };

  async function toggle(row: Row, field: string) {
    try {
      const r = await papi<{ value: boolean }>(`r/${schema.key}/${row.id}/toggle`, { json: { field } });
      setData((d) => d && { ...d, rows: d.rows.map((x) => (x.id === row.id ? { ...x, cells: { ...x.cells, [field]: r.value } } : x)) });
      toast("Сохранено");
    } catch {
      toast("Не удалось сохранить", "error");
    }
  }

  const canReorder = schema.orderable && !sp.get("q") && !Object.values(filters).some(Boolean) && (data?.pages ?? 1) === 1;
  async function move(idx: number, dir: -1 | 1) {
    if (!data) return;
    const rows = [...data.rows];
    const j = idx + dir;
    if (j < 0 || j >= rows.length) return;
    [rows[idx], rows[j]] = [rows[j], rows[idx]];
    setData({ ...data, rows });
    try {
      await papi(`r/${schema.key}/reorder`, { json: { ids: rows.map((r) => r.id) } });
    } catch {
      toast("Не удалось изменить порядок", "error");
      load();
    }
  }

  const exportHref = `/api/panel/r/${schema.key}/export?${query()}`;

  return (
    <>
      <PageHead
        title={schema.title}
        sub={data ? `Всего: ${data.total}` : undefined}
        actions={<>
          {schema.export && <a href={exportHref} className="inline-flex h-10 items-center gap-2 rounded-lg border border-line bg-white px-4 text-[14px] font-semibold hover:border-ink/40"><AIcon name="download2" size={18} />Excel (CSV)</a>}
          {schema.can_add && <Link href={`/admin/r/${schema.key}/new`} className="inline-flex h-10 items-center gap-2 rounded-lg bg-green px-4 text-[14px] font-semibold text-white hover:bg-green-deep"><AIcon name="plus" size={18} />Добавить</Link>}
        </>}
      />

      {(schema.search || schema.filters.length > 0) && (
        <div className="mb-4 flex flex-col gap-3 sm:flex-row">
          {schema.search && (
            <div className="relative flex-1">
              <AIcon name="search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Поиск…" className={`${inputCls} pl-10`} />
            </div>
          )}
          {schema.filters.map((f) => (
            <select key={f.name} value={filters[f.name]} onChange={(e) => setFilter(f.name, e.target.value)} className={`${inputCls} sm:w-56`}>
              <option value="">{f.label}: все</option>
              {f.options?.map((o) => <option key={String(o.value)} value={String(o.value)}>{o.label}</option>)}
            </select>
          ))}
        </div>
      )}

      {!data ? <Spinner /> : data.rows.length === 0 ? (
        <Card className="p-10 text-center text-ink-muted">Пока ничего нет.{schema.can_add && <> <Link className="font-semibold text-green" href={`/admin/r/${schema.key}/new`}>Добавить первый</Link></>}</Card>
      ) : (
        <>
          {/* desktop jadval */}
          <Card className="hidden overflow-hidden md:block">
            <table className="w-full text-left text-[14px]">
              <thead className="border-b border-line bg-sand/50 text-[12px] uppercase tracking-wide text-ink-muted">
                <tr>
                  {canReorder && <th className="w-16 px-3 py-3" />}
                  {schema.list.map((f) => <th key={f.name} className="px-3 py-3 font-semibold">{f.label}</th>)}
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {data.rows.map((row, i) => (
                  <tr key={row.id} className="cursor-pointer hover:bg-sand/30" onClick={() => router.push(`/admin/r/${schema.key}/${row.id}`)}>
                    {canReorder && (
                      <td className="px-2" onClick={(e) => e.stopPropagation()}>
                        <div className="flex flex-col">
                          <button type="button" aria-label="Выше" disabled={i === 0} onClick={() => move(i, -1)} className="rounded p-0.5 text-ink-muted hover:bg-sand disabled:opacity-25"><AIcon name="up" size={16} /></button>
                          <button type="button" aria-label="Ниже" disabled={i === data.rows.length - 1} onClick={() => move(i, 1)} className="rounded p-0.5 text-ink-muted hover:bg-sand disabled:opacity-25"><AIcon name="down" size={16} /></button>
                        </div>
                      </td>
                    )}
                    {schema.list.map((f, ci) => (
                      <td key={f.name} className={`px-3 py-3 ${ci === 0 || (ci === 1 && schema.list[0].type === "image") ? "font-semibold" : ""}`}
                          onClick={f.type === "bool" ? (e) => e.stopPropagation() : undefined}>
                        <Cell f={f} v={row.cells[f.name]} onToggle={() => toggle(row, f.name)} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>

          {/* mobil kartochkalar */}
          <div className="space-y-3 md:hidden">
            {data.rows.map((row, i) => {
              const img = schema.list.find((f) => f.type === "image");
              const bools = schema.list.filter((f) => f.type === "bool");
              const others = schema.list.filter((f) => f.type !== "image" && f.type !== "bool");
              const head = others.find((f) => ["name", "title", "question"].includes(f.name)) || others[0];
              const rest = head ? [head, ...others.filter((f) => f !== head)] : others;
              return (
                <Card key={row.id} className="flex gap-3 p-3" onClick={() => router.push(`/admin/r/${schema.key}/${row.id}`)}>
                  {img && <Cell f={img} v={row.cells[img.name]} />}
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold">{String(rest[0] ? (rest[0].type === "select" ? row.cells[rest[0].name]?.label ?? "" : row.cells[rest[0].name] ?? row.str) : row.str)}</p>
                    <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-[13px] text-ink-muted">
                      {rest.slice(1).map((f) => row.cells[f.name] !== null && row.cells[f.name] !== "" && (
                        <span key={f.name}>{f.type === "number" || f.type === "date" ? `${f.label}: ` : ""}<Cell f={f} v={row.cells[f.name]} /></span>
                      ))}
                    </div>
                    {bools.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-4" onClick={(e) => e.stopPropagation()}>
                        {bools.map((f) => (
                          <label key={f.name} className="flex items-center gap-2 text-[12px] text-ink-muted">
                            <Cell f={f} v={row.cells[f.name]} onToggle={() => toggle(row, f.name)} />{f.label}
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                  {canReorder && (
                    <div className="flex flex-col justify-center" onClick={(e) => e.stopPropagation()}>
                      <button type="button" aria-label="Выше" disabled={i === 0} onClick={() => move(i, -1)} className="rounded p-1 disabled:opacity-25"><AIcon name="up" size={18} /></button>
                      <button type="button" aria-label="Ниже" disabled={i === data.rows.length - 1} onClick={() => move(i, 1)} className="rounded p-1 disabled:opacity-25"><AIcon name="down" size={18} /></button>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>

          {data.pages > 1 && (
            <div className="mt-4 flex items-center justify-center gap-2">
              <Btn kind="outline" disabled={page <= 1} onClick={() => { const p = new URLSearchParams(sp.toString()); p.set("page", String(page - 1)); router.replace(`?${p}`); }}>←</Btn>
              <span className="text-[14px] text-ink-muted">{page} / {data.pages}</span>
              <Btn kind="outline" disabled={page >= data.pages} onClick={() => { const p = new URLSearchParams(sp.toString()); p.set("page", String(page + 1)); router.replace(`?${p}`); }}>→</Btn>
            </div>
          )}
        </>
      )}
    </>
  );
}
