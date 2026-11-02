"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AIcon } from "@/components/admin/AIcon";
import { useMe } from "@/components/admin/Shell";
import { Card, PageHead, Spinner } from "@/components/admin/ui";
import { papi, STATUS_COLORS } from "@/lib/panel";

type Dash = {
  kpis: { label: string; value: number; link: string; accent?: boolean }[];
  recent: { id: number; created_at: string; name: string; phone: string; event_type: string; guests: number | null; status: string; status_label: string; source: string }[];
  counts: { packages: number; projects: number; offers: number };
};

export default function Dashboard() {
  const { me } = useMe();
  const [d, setD] = useState<Dash | null>(null);
  useEffect(() => { papi<Dash>("dashboard").then(setD).catch(() => {}); }, []);
  if (!d) return <Spinner />;
  const quick = [
    { href: "/admin/r/packages/new", label: "Новый пакет", icon: "gift" },
    { href: "/admin/r/portfolio/new", label: "Новый проект в портфолио", icon: "photo" },
    { href: "/admin/r/offers/new", label: "Сезонное предложение", icon: "tag" },
    { href: "/admin/r/home", label: "Тексты главной страницы", icon: "home" },
    { href: "/admin/r/settings", label: "Контакты и уведомления", icon: "settings" },
  ];
  return (
    <>
      <PageHead title={`Добрый день${me?.user.name ? `, ${me.user.name}` : ""}!`} sub="Заявки, пакеты, портфолио и тексты сайта Rokate Catering." />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {d.kpis.map((k) => (
          <Link key={k.label} href={`/admin/r/${k.link}`}
                className={`rounded-2xl border p-4 transition hover:shadow-md sm:p-5 ${k.accent && k.value ? "border-green bg-green text-white" : "border-line bg-white"}`}>
            <p className={`text-[13px] ${k.accent && k.value ? "text-white/80" : "text-ink-muted"}`}>{k.label}</p>
            <p className="mt-2 text-[32px] font-bold leading-none">{k.value}</p>
          </Link>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
        <Card className="p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-sans text-[17px] font-bold">Последние заявки</h2>
            <Link href="/admin/r/inquiries" className="text-[13px] font-semibold text-green">Все заявки →</Link>
          </div>
          {d.recent.length === 0 ? (
            <p className="py-6 text-[14px] text-ink-muted">Заявок пока нет. Они появятся здесь, как только клиент отправит форму на сайте.</p>
          ) : (
            <ul className="divide-y divide-line">
              {d.recent.map((r) => (
                <li key={r.id}>
                  <Link href={`/admin/r/inquiries/${r.id}`} className="flex flex-wrap items-center gap-x-4 gap-y-1 py-3 hover:bg-sand/40 sm:flex-nowrap">
                    <span className="w-24 shrink-0 text-[13px] text-ink-muted">{r.created_at}</span>
                    <span className="min-w-0 flex-1 font-semibold">{r.name}<span className="ml-2 font-normal text-ink-muted">{r.phone}</span></span>
                    <span className="text-[13px] text-ink-muted">{[r.event_type, r.guests ? `${r.guests} гост.` : ""].filter(Boolean).join(" · ")}</span>
                    <span className={`rounded-full px-2.5 py-1 text-[12px] font-semibold ${STATUS_COLORS[r.status] || ""}`}>{r.status_label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>
        <div className="space-y-6">
          <Card className="p-5">
            <h2 className="mb-3 font-sans text-[17px] font-bold">Быстрые действия</h2>
            <div className="space-y-2">
              {quick.map((q) => (
                <Link key={q.href} href={q.href} className="flex items-center gap-3 rounded-lg border border-line px-3 py-2.5 text-[14px] hover:border-green hover:text-green">
                  <AIcon name={q.icon} size={18} />{q.label}
                </Link>
              ))}
            </div>
          </Card>
          <Card className="p-5 text-[14px]">
            <h2 className="mb-3 font-sans text-[17px] font-bold">На сайте сейчас</h2>
            <p className="flex justify-between py-1"><span className="text-ink-muted">Пакетов</span><b>{d.counts.packages}</b></p>
            <p className="flex justify-between py-1"><span className="text-ink-muted">Проектов в портфолио</span><b>{d.counts.projects}</b></p>
            <p className="flex justify-between py-1"><span className="text-ink-muted">Активных предложений</span><b>{d.counts.offers}</b></p>
          </Card>
        </div>
      </div>
    </>
  );
}
