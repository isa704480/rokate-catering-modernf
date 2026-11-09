"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  BarController,
  BarElement,
  CategoryScale,
  Chart,
  Filler,
  LineController,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
  type ChartConfiguration,
} from "chart.js";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { leadDate, useLeads } from "./useLeads";
import type { LeadItem } from "./AdminLeadsPanel";

Chart.register(
  LineController, LineElement, PointElement, Filler,
  BarController, BarElement,
  CategoryScale, LinearScale, Tooltip
);

/* --------------------------------------------------------------- ranglar */

/* Holat ranglari validator bilan tekshirilgan: yorqinlik, to'yinganlik,
   rang ko'rmaslikda ajralish va oq fonga nisbatan kontrast — hammasi o'tdi. */
const C = {
  ink: "#1c2340",
  muted: "#5b6179",
  line: "#e3dccd",
  surface: "#ffffff",
  bg: "#f7f4ee",
  green: "#2f5e46",
  gold: "#c9a96a",
  statusNew: "#b07718",
  statusContacted: "#3568c4",
  statusDone: "#18895a",
};

/* ----------------------------------------------------------------- matn */

const T = {
  ru: {
    title: "Статистика",
    subtitle: "Сводка по заявкам с сайта",
    total: "Всего заявок",
    newOnes: "Новые",
    week: "За 7 дней",
    avgGuests: "Гостей в среднем",
    processed: "Обработано",
    byDay: "Заявки по дням",
    byDayNote: "Последние 14 дней",
    byType: "Типы мероприятий",
    byTypeNote: "Пять самых частых",
    byStatus: "Статусы заявок",
    byLang: "Язык сайта",
    partner: "Партнёрство",
    inquiry: "Заявка на кейтеринг",
    statusNew: "Новые",
    statusContacted: "Связались",
    statusDone: "Завершено",
    empty: "Пока нет данных. Графики появятся, когда придут первые заявки.",
    noType: "Не указан",
    leads: "заявок",
    danger: "Очистка данных",
    dangerNote:
      "Удаление необратимо. Заявки исчезнут и из этой панели, и из базы. Выгрузите нужное заранее.",
    clearProcessed: "Удалить обработанные",
    clearAll: "Удалить все заявки",
    exportCsv: "Скачать все в CSV",
    confirmWord: "УДАЛИТЬ",
    confirmHint: (n: number, word: string) =>
      `Будет удалено заявок: ${n}. Чтобы подтвердить, введите слово ${word}.`,
    confirmPh: "Введите слово для подтверждения",
    cancel: "Отмена",
    confirm: "Удалить навсегда",
    working: "Удаляем…",
    doneMsg: (n: number) => `Удалено заявок: ${n}`,
    nothing: "Нечего удалять",
  },
  en: {
    title: "Statistics",
    subtitle: "Overview of inquiries from the site",
    total: "Total inquiries",
    newOnes: "New",
    week: "Last 7 days",
    avgGuests: "Avg. guests",
    processed: "Processed",
    byDay: "Inquiries per day",
    byDayNote: "Last 14 days",
    byType: "Event types",
    byTypeNote: "Five most frequent",
    byStatus: "Inquiry status",
    byLang: "Site language",
    partner: "Partnership",
    inquiry: "Catering inquiry",
    statusNew: "New",
    statusContacted: "Contacted",
    statusDone: "Completed",
    empty: "No data yet. Charts will appear once the first inquiries arrive.",
    noType: "Not specified",
    leads: "inquiries",
    danger: "Clearing data",
    dangerNote:
      "Deletion cannot be undone. Inquiries disappear from this panel and from the database. Export anything you need first.",
    clearProcessed: "Delete processed",
    clearAll: "Delete all inquiries",
    exportCsv: "Download all as CSV",
    confirmWord: "DELETE",
    confirmHint: (n: number, word: string) =>
      `This will delete ${n} inquiries. Type ${word} to confirm.`,
    confirmPh: "Type the word to confirm",
    cancel: "Cancel",
    confirm: "Delete permanently",
    working: "Deleting…",
    doneMsg: (n: number) => `Deleted: ${n}`,
    nothing: "Nothing to delete",
  },
} as const;

type Lang = keyof typeof T;

/* ------------------------------------------------------------ hisoblash */

const DAY = 86_400_000;

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}

function useMetrics(leads: LeadItem[], lang: Lang) {
  return useMemo(() => {
    const t = T[lang];
    const today = startOfDay(new Date());

    const days: { label: string; value: number }[] = [];
    for (let i = 13; i >= 0; i--) {
      const ts = today - i * DAY;
      const d = new Date(ts);
      days.push({
        label: `${String(d.getDate()).padStart(2, "0")}.${String(d.getMonth() + 1).padStart(2, "0")}`,
        value: 0,
      });
    }

    const types = new Map<string, number>();
    let weekCount = 0;
    let guestsSum = 0;
    let guestsN = 0;
    const status = { new: 0, contacted: 0, completed: 0 };
    const langs = { ru: 0, en: 0 };

    for (const lead of leads) {
      const d = leadDate(lead);
      if (d) {
        const idx = 13 - Math.round((today - startOfDay(d)) / DAY);
        if (idx >= 0 && idx < 14) days[idx].value += 1;
        if (today - startOfDay(d) < 7 * DAY) weekCount += 1;
      }

      const key = (lead.eventType || "").trim() || (lead.kind === "partner" ? t.partner : t.noType);
      types.set(key, (types.get(key) ?? 0) + 1);

      const g = Number(String(lead.guests ?? "").replace(/[^\d]/g, ""));
      if (Number.isFinite(g) && g > 0) {
        guestsSum += g;
        guestsN += 1;
      }

      const st = lead.status ?? "new";
      if (st === "contacted") status.contacted += 1;
      else if (st === "completed") status.completed += 1;
      else status.new += 1;

      if (lead.language === "en") langs.en += 1;
      else langs.ru += 1;
    }

    const topTypes = [...types.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);

    return {
      days,
      topTypes,
      status,
      langs,
      total: leads.length,
      week: weekCount,
      avgGuests: guestsN ? Math.round(guestsSum / guestsN) : 0,
      processed: status.contacted + status.completed,
    };
  }, [leads, lang]);
}

/* -------------------------------------------------------------- grafika */

function useChart(config: ChartConfiguration | null) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !config) return;
    const chart = new Chart(el, config);
    return () => chart.destroy();
  }, [config]);
  return ref;
}

const GRID = { color: C.line, drawTicks: false };
const TICK = { color: C.muted, font: { size: 12, family: "inherit" }, padding: 8 };

const tooltipStyle = {
  backgroundColor: C.ink,
  padding: 10,
  cornerRadius: 8,
  titleFont: { size: 12, weight: "normal" as const },
  bodyFont: { size: 13, weight: "bold" as const },
  displayColors: false,
};

function Card({
  title,
  note,
  children,
  delay = 0,
}: {
  title: string;
  note?: string;
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] }}
      style={{
        background: C.surface,
        border: `1px solid ${C.line}`,
        borderRadius: 20,
        padding: "22px 24px 18px",
      }}
    >
      <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: C.ink }}>{title}</h3>
      {note && <p style={{ margin: "4px 0 0", fontSize: 13, color: C.muted }}>{note}</p>}
      <div style={{ marginTop: 18 }}>{children}</div>
    </motion.section>
  );
}

function Tile({
  label,
  value,
  accent,
  index,
}: {
  label: string;
  value: string | number;
  accent: string;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      style={{
        background: C.surface,
        border: `1px solid ${C.line}`,
        borderRadius: 18,
        padding: "18px 20px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <span
        aria-hidden="true"
        style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 4, background: accent }}
      />
      <p style={{ margin: 0, fontSize: 12.5, color: C.muted, letterSpacing: "0.02em" }}>{label}</p>
      <p style={{ margin: "6px 0 0", fontSize: 30, fontWeight: 700, color: C.ink, lineHeight: 1.1 }}>
        {value}
      </p>
    </motion.div>
  );
}

/* ------------------------------------------------------------ komponent */

/**
 * Statistika faqat haqiqiy arizalardan hisoblanadi.
 * Manba — Firestore'dagi "leads" to'plami, ya'ni "Заявки клиентов"
 * bo'limi o'qiydigan o'sha ro'yxatning o'zi. Boshqa manba yo'q:
 * namunaviy yoki o'ylab topilgan ma'lumot bu yerda ishlatilmaydi.
 */
export default function AdminStats({ lang }: { lang: Lang }) {
  const { leads, loading } = useLeads();
  const m = useMetrics(leads, lang);
  const t = T[lang] ?? T.ru;

  const lineCfg = useMemo<ChartConfiguration | null>(() => {
    if (!m.total) return null;
    return {
      type: "line",
      data: {
        labels: m.days.map((d) => d.label),
        datasets: [
          {
            data: m.days.map((d) => d.value),
            borderColor: C.green,
            borderWidth: 2,
            tension: 0.3,
            fill: true,
            backgroundColor: "rgba(47, 94, 70, 0.08)",
            pointRadius: 0,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: C.green,
            pointHoverBorderColor: C.surface,
            pointHoverBorderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: "index", intersect: false },
        plugins: {
          legend: { display: false },
          tooltip: { ...tooltipStyle, callbacks: { label: (c) => `${c.parsed.y} ${t.leads}` } },
        },
        scales: {
          x: { grid: { display: false }, ticks: { ...TICK, maxRotation: 0, autoSkipPadding: 16 }, border: { color: C.line } },
          y: { beginAtZero: true, grid: GRID, ticks: { ...TICK, precision: 0 }, border: { display: false } },
        },
      },
    };
  }, [m, t]);

  const typeCfg = useMemo<ChartConfiguration | null>(() => {
    if (!m.topTypes.length) return null;
    return {
      type: "bar",
      data: {
        labels: m.topTypes.map(([k]) => (k.length > 22 ? k.slice(0, 21) + "…" : k)),
        datasets: [
          {
            data: m.topTypes.map(([, v]) => v),
            backgroundColor: C.green,
            hoverBackgroundColor: C.ink,
            borderRadius: 4,
            borderSkipped: false,
            barThickness: 18,
          },
        ],
      },
      options: {
        indexAxis: "y",
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { ...tooltipStyle, callbacks: { label: (c) => `${c.parsed.x} ${t.leads}` } },
        },
        scales: {
          x: { beginAtZero: true, grid: GRID, ticks: { ...TICK, precision: 0 }, border: { display: false } },
          y: { grid: { display: false }, ticks: TICK, border: { color: C.line } },
        },
      },
    };
  }, [m, t]);

  const statusCfg = useMemo<ChartConfiguration | null>(() => {
    if (!m.total) return null;
    return {
      type: "bar",
      data: {
        labels: [t.statusNew, t.statusContacted, t.statusDone],
        datasets: [
          {
            data: [m.status.new, m.status.contacted, m.status.completed],
            backgroundColor: [C.statusNew, C.statusContacted, C.statusDone],
            borderRadius: 4,
            borderSkipped: false,
            barThickness: 18,
          },
        ],
      },
      options: {
        indexAxis: "y",
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { ...tooltipStyle, callbacks: { label: (c) => `${c.parsed.x} ${t.leads}` } },
        },
        scales: {
          x: { beginAtZero: true, grid: GRID, ticks: { ...TICK, precision: 0 }, border: { display: false } },
          y: { grid: { display: false }, ticks: TICK, border: { color: C.line } },
        },
      },
    };
  }, [m, t]);

  const lineRef = useChart(lineCfg);
  const typeRef = useChart(typeCfg);
  const statusRef = useChart(statusCfg);

  if (loading) {
    return (
      <p style={{ padding: "40px 0", textAlign: "center", color: C.muted }}>
        {lang === "ru" ? "Загрузка…" : "Loading…"}
      </p>
    );
  }

  return (
    <div style={{ display: "grid", gap: 18 }}>
      <motion.header
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: C.ink }}>{t.title}</h2>
        <p style={{ margin: "4px 0 0", fontSize: 14, color: C.muted }}>{t.subtitle}</p>
      </motion.header>

      <div
        style={{
          display: "grid",
          gap: 14,
          gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
        }}
      >
        <Tile index={0} label={t.total} value={m.total} accent={C.green} />
        <Tile index={1} label={t.newOnes} value={m.status.new} accent={C.statusNew} />
        <Tile index={2} label={t.week} value={m.week} accent={C.statusContacted} />
        <Tile index={3} label={t.processed} value={m.processed} accent={C.statusDone} />
        <Tile index={4} label={t.avgGuests} value={m.avgGuests || "—"} accent={C.gold} />
      </div>

      {!m.total ? (
        <Card title={t.byDay}>
          <p style={{ margin: 0, color: C.muted, fontSize: 14 }}>{t.empty}</p>
        </Card>
      ) : (
        <>
          <Card title={t.byDay} note={t.byDayNote} delay={0.05}>
            <div style={{ height: 240 }}>
              <canvas ref={lineRef} role="img" aria-label={`${t.byDay}. ${t.byDayNote}`} />
            </div>
          </Card>

          <div style={{ display: "grid", gap: 18, gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
            <Card title={t.byType} note={t.byTypeNote} delay={0.1}>
              <div style={{ height: 190 }}>
                <canvas ref={typeRef} role="img" aria-label={t.byType} />
              </div>
            </Card>

            <Card title={t.byStatus} delay={0.15}>
              <div style={{ height: 190 }}>
                <canvas ref={statusRef} role="img" aria-label={t.byStatus} />
              </div>
              <LangSplit ru={m.langs.ru} en={m.langs.en} label={t.byLang} />
            </Card>
          </div>
        </>
      )}

      <DangerZone leads={leads} lang={lang} />
    </div>
  );
}

/* Til bo'yicha taqsimot — grafik emas, ikkita son yetarli. */
function LangSplit({ ru, en, label }: { ru: number; en: number; label: string }) {
  return (
    <div style={{ marginTop: 18, paddingTop: 16, borderTop: `1px solid ${C.line}` }}>
      <p style={{ margin: 0, fontSize: 12.5, color: C.muted }}>{label}</p>
      <div style={{ display: "flex", gap: 24, marginTop: 8 }}>
        <span style={{ fontSize: 15, color: C.ink }}>
          <b style={{ fontSize: 20 }}>{ru}</b> &nbsp;RU
        </span>
        <span style={{ fontSize: 15, color: C.ink }}>
          <b style={{ fontSize: 20 }}>{en}</b> &nbsp;EN
        </span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------ ma'lumot tozalash */

function toCsv(leads: LeadItem[]) {
  const cols = [
    "id", "kind", "status", "name", "phone", "email", "company", "field",
    "eventType", "date", "guests", "place", "package", "comment", "language", "page",
  ] as const;
  const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const head = [...cols, "createdAt"].join(",");
  const rows = leads.map((l) =>
    [...cols.map((c) => esc(l[c])), esc(leadDate(l)?.toISOString() ?? "")].join(",")
  );
  return "﻿" + [head, ...rows].join("\r\n");
}

function DangerZone({ leads, lang }: { leads: LeadItem[]; lang: Lang }) {
  const t = T[lang] ?? T.ru;
  const [mode, setMode] = useState<null | "processed" | "all">(null);
  const [word, setWord] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState("");

  const targets = useMemo(() => {
    if (mode === "all") return leads;
    if (mode === "processed") return leads.filter((l) => l.status === "contacted" || l.status === "completed");
    return [];
  }, [mode, leads]);

  async function run() {
    setBusy(true);
    let n = 0;
    try {
      /* Ro'yxatdagi hujjatlar birma-bir o'chiriladi. Sahifa yangilanmaydi —
         onSnapshot o'zgarishni o'zi ko'rsatadi. */
      for (const lead of targets) {
        await deleteDoc(doc(db, "leads", lead.id));
        n += 1;
      }
      setDone(t.doneMsg(n));
    } catch {
      setDone(lang === "ru" ? "Не удалось удалить. Проверьте соединение." : "Delete failed. Check the connection.");
    } finally {
      setBusy(false);
      setMode(null);
      setWord("");
    }
  }

  function download() {
    const blob = new Blob([toCsv(leads)], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `rokate-leads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const btn: React.CSSProperties = {
    padding: "10px 16px",
    borderRadius: 999,
    fontSize: 13.5,
    fontWeight: 600,
    cursor: "pointer",
    border: `1px solid ${C.line}`,
    background: C.surface,
    color: C.ink,
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      style={{
        background: C.surface,
        border: `1px solid ${C.line}`,
        borderRadius: 20,
        padding: "22px 24px",
      }}
    >
      <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: C.ink }}>{t.danger}</h3>
      <p style={{ margin: "6px 0 0", fontSize: 13.5, color: C.muted, maxWidth: "62ch", lineHeight: 1.6 }}>
        {t.dangerNote}
      </p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 16 }}>
        <button type="button" style={btn} onClick={download} disabled={!leads.length}>
          {t.exportCsv}
        </button>
        <button type="button" style={btn} onClick={() => { setDone(""); setMode("processed"); }}>
          {t.clearProcessed}
        </button>
        <button
          type="button"
          style={{ ...btn, borderColor: "#d8b2b2", color: "#8d2b2b" }}
          onClick={() => { setDone(""); setMode("all"); }}
        >
          {t.clearAll}
        </button>
      </div>

      {done && <p style={{ margin: "14px 0 0", fontSize: 13.5, color: C.statusDone }}>{done}</p>}

      {mode && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          style={{ overflow: "hidden" }}
        >
          <div style={{ marginTop: 18, paddingTop: 18, borderTop: `1px solid ${C.line}` }}>
            {targets.length === 0 ? (
              <p style={{ margin: 0, fontSize: 13.5, color: C.muted }}>{t.nothing}</p>
            ) : (
              <>
                <p style={{ margin: 0, fontSize: 13.5, color: C.ink }}>
                  {t.confirmHint(targets.length, t.confirmWord)}
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 12 }}>
                  <input
                    value={word}
                    onChange={(e) => setWord(e.target.value)}
                    placeholder={t.confirmPh}
                    style={{
                      padding: "10px 14px",
                      borderRadius: 10,
                      border: `1px solid ${C.line}`,
                      fontSize: 14,
                      minWidth: 240,
                      color: C.ink,
                      background: C.bg,
                    }}
                  />
                  <button
                    type="button"
                    disabled={word.trim().toUpperCase() !== t.confirmWord || busy}
                    onClick={run}
                    style={{
                      ...btn,
                      background: word.trim().toUpperCase() === t.confirmWord ? "#8d2b2b" : "#e7e1d6",
                      color: word.trim().toUpperCase() === t.confirmWord ? "#fff" : C.muted,
                      borderColor: "transparent",
                      cursor: word.trim().toUpperCase() === t.confirmWord ? "pointer" : "not-allowed",
                    }}
                  >
                    {busy ? t.working : t.confirm}
                  </button>
                  <button type="button" style={btn} onClick={() => { setMode(null); setWord(""); }}>
                    {t.cancel}
                  </button>
                </div>
              </>
            )}
          </div>
        </motion.div>
      )}
    </motion.section>
  );
}
