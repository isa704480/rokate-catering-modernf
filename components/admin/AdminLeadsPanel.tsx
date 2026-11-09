"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
  Timestamp,
} from "firebase/firestore";

export interface LeadItem {
  id: string;
  kind?: "inquiry" | "partner";
  name?: string;
  phone?: string;
  date?: string;
  guests?: string;
  eventType?: string;
  place?: string;
  comment?: string;
  package?: string;
  company?: string;
  field?: string;
  email?: string;
  language?: string;
  page?: string;
  status?: "new" | "contacted" | "completed";
  createdAt?: Timestamp | { seconds: number; nanoseconds: number };
  createdClientTime?: string;
}

const TEXT = {
  ru: {
    title: "Входящие заявки",
    all: "Все",
    newOnly: "Новые",
    contactedOnly: "Обработаны",
    allReviewed: "Все заявки просмотрены",
    newBadge: "новые",
    soundOn: "Звук: Включён (Тиринь)",
    soundOff: "Звук: Выключен",
    loading: "Загрузка заявок...",
    emptyTitle: "Пока нет заявок",
    emptyDesc: "Когда клиент отправит форму на сайте, здесь моментально появится заявка со звуком «Тиринь».",
    newLabel: "Новая заявка",
    contactedLabel: "Связались",
    completedLabel: "Завершено",
    partnerBadge: "Партнёрство",
    unknownClient: "Клиент",
    justNow: "Только что",
    phone: "Телефон",
    eventDate: "Дата мероприятия",
    guestsCount: "Количество гостей",
    guestsUnit: "чел.",
    eventType: "Тип события",
    location: "Площадка/Локация",
    company: "Компания",
    commentLabel: "Комментарий клиента",
    whatsappBtn: "Написать в WhatsApp",
    callBtn: "Позвонить",
    markContacted: "✓ Отметить как обработанную",
    markNew: "Вернуть в новые",
    deleteConfirm: "Вы действительно хотите удалить эту заявку?",
  },
  en: {
    title: "Incoming Inquiries",
    all: "All",
    newOnly: "New",
    contactedOnly: "Contacted",
    allReviewed: "All inquiries reviewed",
    newBadge: "new",
    soundOn: "Sound: Enabled (Chime)",
    soundOff: "Sound: Muted",
    loading: "Loading inquiries...",
    emptyTitle: "No inquiries yet",
    emptyDesc: "When a customer submits a form, it will appear here in real-time with a 'Chime' alert.",
    newLabel: "New Inquiry",
    contactedLabel: "Contacted",
    completedLabel: "Completed",
    partnerBadge: "Partnership",
    unknownClient: "Client",
    justNow: "Just now",
    phone: "Phone",
    eventDate: "Event date",
    guestsCount: "Number of guests",
    guestsUnit: "guests",
    eventType: "Event type",
    location: "Venue/Location",
    company: "Company",
    commentLabel: "Client note",
    whatsappBtn: "Chat on WhatsApp",
    callBtn: "Call",
    markContacted: "✓ Mark as contacted",
    markNew: "Mark as new",
    deleteConfirm: "Are you sure you want to delete this inquiry?",
  },
};

export default function AdminLeadsPanel({ lang = "ru" }: { lang?: "ru" | "en" }) {
  const [leads, setLeads] = useState<LeadItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [filter, setFilter] = useState<"all" | "new" | "contacted">("all");

  const initialLoadRef = useRef(true);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const t = TEXT[lang] || TEXT.ru;

  // Real Web Audio API Chime / Bell sound
  const playChimeSound = () => {
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = audioCtxRef.current || new AudioCtx();
      audioCtxRef.current = ctx;

      if (ctx.state === "suspended") {
        ctx.resume();
      }

      const now = ctx.currentTime;
      // Tone 1 (880Hz - A5)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(880, now);
      gain1.gain.setValueAtTime(0, now);
      gain1.gain.linearRampToValueAtTime(0.3, now + 0.03);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.5);

      // Tone 2 (1318.5Hz - E6 "TIRING" chime)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(1318.5, now + 0.1);
      gain2.gain.setValueAtTime(0, now + 0.1);
      gain2.gain.linearRampToValueAtTime(0.45, now + 0.13);
      gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.9);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.1);
      osc2.stop(now + 0.95);
    } catch (e) {
      console.warn("Audio play error:", e);
    }
  };

  useEffect(() => {
    const q = query(collection(db, "leads"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const items: LeadItem[] = [];
        let hasNewIncoming = false;

        snapshot.docChanges().forEach((change) => {
          if (change.type === "added" && !initialLoadRef.current) {
            hasNewIncoming = true;
          }
        });

        snapshot.forEach((d) => {
          items.push({ id: d.id, ...d.data() } as LeadItem);
        });

        setLeads(items);
        setLoading(false);

        if (hasNewIncoming && soundEnabled) {
          playChimeSound();
        }

        if (initialLoadRef.current) {
          initialLoadRef.current = false;
        }
      },
      (err) => {
        console.error("Leads onSnapshot error:", err);
        setLoading(false);
      }
    );

    return () => unsub();
  }, [soundEnabled]);

  const updateStatus = async (id: string, st: "new" | "contacted" | "completed") => {
    try {
      await updateDoc(doc(db, "leads", id), { status: st });
    } catch (err) {
      console.error(err);
    }
  };

  const deleteLead = async (id: string) => {
    if (!window.confirm(t.deleteConfirm)) return;
    try {
      await deleteDoc(doc(db, "leads", id));
    } catch (err) {
      console.error(err);
    }
  };

  const newCount = leads.filter((l) => (l.status || "new") === "new").length;
  const filtered = leads.filter((l) => {
    if (filter === "all") return true;
    return (l.status || "new") === filter;
  });

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "16px 20px" }}>
      {/* Top action bar */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          padding: "16px 22px",
          background: "#ffffff",
          borderRadius: 18,
          border: "1px solid #e3dccd",
          boxShadow: "0 4px 20px rgba(28,35,64,.04)",
          marginBottom: 20,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#1c2340" }}>
            📥 {t.title}
          </h2>
          {newCount > 0 ? (
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "3px 12px",
                background: "#fbf3f3",
                color: "#8d2b2b",
                border: "1px solid #e3c3c3",
                borderRadius: 999,
                fontSize: 13,
                fontWeight: 700,
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#8d2b2b",
                  animation: "rk-pulse 1.5s infinite",
                }}
              />
              {newCount} {t.newBadge}
            </span>
          ) : (
            <span style={{ fontSize: 13, color: "#5b6179" }}>{t.allReviewed}</span>
          )}
        </div>

        {/* Filters and Sound button */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <div style={{ display: "inline-flex", background: "#fdfbf7", padding: 3, borderRadius: 12 }}>
            {(
              [
                { id: "all", label: t.all },
                { id: "new", label: `${t.newOnly} (${newCount})` },
                { id: "contacted", label: t.contactedOnly },
              ] as const
            ).map((btn) => (
              <button
                key={btn.id}
                type="button"
                onClick={() => setFilter(btn.id)}
                style={{
                  border: 0,
                  background: filter === btn.id ? "#ffffff" : "transparent",
                  color: filter === btn.id ? "#1c2340" : "#5b6179",
                  fontWeight: filter === btn.id ? 700 : 500,
                  fontSize: 13,
                  padding: "6px 14px",
                  borderRadius: 9,
                  cursor: "pointer",
                  boxShadow: filter === btn.id ? "0 2px 8px rgba(0,0,0,0.06)" : "none",
                  transition: "all 0.15s ease",
                }}
              >
                {btn.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => {
              playChimeSound();
              setSoundEnabled(!soundEnabled);
            }}
            title={soundEnabled ? t.soundOn : t.soundOff}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              border: "1px solid #e3dccd",
              background: soundEnabled ? "#f0f7f3" : "#fdfbf7",
              color: soundEnabled ? "#2f5e46" : "#5b6179",
              padding: "7px 14px",
              borderRadius: 12,
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            <span>{soundEnabled ? `🔔 ${t.soundOn}` : `🔕 ${t.soundOff}`}</span>
          </button>
        </div>
      </div>

      {/* Leads list */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "#5b6179" }}>
          {t.loading}
        </div>
      ) : filtered.length === 0 ? (
        <div
          style={{
            background: "#ffffff",
            borderRadius: 18,
            padding: "50px 20px",
            textAlign: "center",
            border: "1px solid #e3dccd",
            color: "#5b6179",
          }}
        >
          <div style={{ fontSize: 36, marginBottom: 10 }}>📭</div>
          <h3 style={{ margin: 0, fontSize: 17, color: "#1c2340" }}>{t.emptyTitle}</h3>
          <p style={{ margin: "6px 0 0", fontSize: 14 }}>{t.emptyDesc}</p>
        </div>
      ) : (
        <motion.div layout style={{ display: "grid", gap: 14 }}>
          <AnimatePresence initial={false}>
          {filtered.map((lead) => {
            const isNew = (lead.status || "new") === "new";
            const cleanPhone = (lead.phone || "").replace(/\D/g, "");
            const waUrl = cleanPhone ? `https://wa.me/${cleanPhone}` : null;

            return (
              <motion.div
                key={lead.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  background: "#ffffff",
                  borderRadius: 16,
                  border: isNew ? "1.5px solid #2f5e46" : "1px solid #e3dccd",
                  padding: "18px 22px",
                  boxShadow: isNew
                    ? "0 6px 20px rgba(47, 94, 70, 0.08)"
                    : "0 2px 10px rgba(28, 35, 64, 0.03)",
                  transition: "all 0.2s ease",
                  display: "grid",
                  gap: 12,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: 10,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span
                      style={{
                        padding: "4px 10px",
                        borderRadius: 8,
                        fontSize: 12,
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: ".04em",
                        background: isNew ? "#2f5e46" : "#efe9dc",
                        color: isNew ? "#ffffff" : "#5b6179",
                      }}
                    >
                      {isNew ? `✨ ${t.newLabel}` : lead.status === "contacted" ? t.contactedLabel : t.completedLabel}
                    </span>

                    {lead.kind === "partner" && (
                      <span
                        style={{
                          padding: "4px 8px",
                          borderRadius: 6,
                          fontSize: 11,
                          fontWeight: 700,
                          background: "#e8eefb",
                          color: "#3568c4",
                        }}
                      >
                        {t.partnerBadge}
                      </span>
                    )}

                    <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#1c2340" }}>
                      {lead.name || t.unknownClient}
                    </h3>
                  </div>

                  <div style={{ fontSize: 13, color: "#8a90a2" }}>
                    {lead.createdClientTime
                      ? new Date(lead.createdClientTime).toLocaleString(lang === "ru" ? "ru-RU" : "en-US")
                      : t.justNow}
                  </div>
                </div>

                {/* Details */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                    gap: 10,
                    background: "#fdfbf7",
                    padding: "12px 16px",
                    borderRadius: 12,
                    fontSize: 14,
                  }}
                >
                  <div>
                    <span style={{ color: "#5b6179", fontSize: 12, display: "block" }}>{t.phone}:</span>
                    <strong style={{ color: "#1c2340" }}>{lead.phone || "—"}</strong>
                  </div>

                  {lead.date && (
                    <div>
                      <span style={{ color: "#5b6179", fontSize: 12, display: "block" }}>{t.eventDate}:</span>
                      <strong style={{ color: "#1c2340" }}>{lead.date}</strong>
                    </div>
                  )}

                  {lead.guests && (
                    <div>
                      <span style={{ color: "#5b6179", fontSize: 12, display: "block" }}>{t.guestsCount}:</span>
                      <strong style={{ color: "#1c2340" }}>{lead.guests} {t.guestsUnit}</strong>
                    </div>
                  )}

                  {lead.eventType && (
                    <div>
                      <span style={{ color: "#5b6179", fontSize: 12, display: "block" }}>{t.eventType}:</span>
                      <strong style={{ color: "#1c2340" }}>{lead.eventType}</strong>
                    </div>
                  )}

                  {lead.place && (
                    <div>
                      <span style={{ color: "#5b6179", fontSize: 12, display: "block" }}>{t.location}:</span>
                      <strong style={{ color: "#1c2340" }}>{lead.place}</strong>
                    </div>
                  )}

                  {lead.company && (
                    <div>
                      <span style={{ color: "#5b6179", fontSize: 12, display: "block" }}>{t.company}:</span>
                      <strong style={{ color: "#1c2340" }}>{lead.company}</strong>
                    </div>
                  )}
                </div>

                {lead.comment && (
                  <div
                    style={{
                      background: "#fdfbf7",
                      padding: "10px 14px",
                      borderRadius: 10,
                      fontSize: 13.5,
                      color: "#1c2340",
                    }}
                  >
                    <strong>{t.commentLabel}:</strong> {lead.comment}
                  </div>
                )}

                {/* Action buttons */}
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 10,
                    paddingTop: 8,
                    borderTop: "1px solid #efe9dc",
                  }}
                >
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {waUrl && (
                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 6,
                          background: "#25d366",
                          color: "#ffffff",
                          textDecoration: "none",
                          fontSize: 13,
                          fontWeight: 700,
                          padding: "7px 14px",
                          borderRadius: 10,
                        }}
                      >
                        <span>{t.whatsappBtn}</span>
                      </a>
                    )}

                    {lead.phone && (
                      <a
                        href={`tel:${lead.phone}`}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 6,
                          background: "#efe9dc",
                          color: "#1c2340",
                          textDecoration: "none",
                          fontSize: 13,
                          fontWeight: 600,
                          padding: "7px 14px",
                          borderRadius: 10,
                        }}
                      >
                        {t.callBtn}
                      </a>
                    )}
                  </div>

                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    {isNew ? (
                      <button
                        type="button"
                        onClick={() => updateStatus(lead.id, "contacted")}
                        style={{
                          border: "1px solid #2f5e46",
                          background: "transparent",
                          color: "#2f5e46",
                          padding: "6px 12px",
                          borderRadius: 8,
                          fontSize: 12.5,
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                      >
                        {t.markContacted}
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => updateStatus(lead.id, "new")}
                        style={{
                          border: "1px solid #e3dccd",
                          background: "transparent",
                          color: "#5b6179",
                          padding: "6px 12px",
                          borderRadius: 8,
                          fontSize: 12.5,
                          cursor: "pointer",
                        }}
                      >
                        {t.markNew}
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => deleteLead(lead.id)}
                      style={{
                        border: 0,
                        background: "transparent",
                        color: "#8a90a2",
                        cursor: "pointer",
                        padding: "6px 8px",
                        fontSize: 13,
                      }}
                      title="Delete"
                    >
                      🗑
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
