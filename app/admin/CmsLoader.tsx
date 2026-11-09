"use client";

import { useEffect, useState, type FormEvent } from "react";
import AdminLeadsPanel from "@/components/admin/AdminLeadsPanel";
import AdminStats from "@/components/admin/AdminStats";

const CMS_SCRIPT = "https://unpkg.com/decap-cms@3.8.3/dist/decap-cms.js";

/**
 * Parol — statik saytda bu panelni tasodifiy kirib qolganlardan yopadi.
 * Saqlash faqat GitHub hisobi orqali amalga oshadi.
 */
const DEFAULT_PASSWORD = "RokateAdmin2026!";
const SESSION_KEY = "rokate-cms-auth";

/* ------------------------------------------------------------------ UI text */

const UI = {
  ru: {
    subtitle: "Rokate Catering — управление контентом сайта",
    password: "Пароль",
    passwordPh: "Введите пароль",
    enter: "Войти в панель",
    error: "Неверный пароль. Попробуйте снова.",
    loadingTitle: "Загрузка панели управления",
    loadingDesc: "Подключаем редактор Decap CMS…",
    note: "Сохранение контента синхронизируется через GitHub-аккаунт владельца.",
    tabLeads: "Заявки клиентов",
    tabStats: "Статистика",
    tabCms: "Контент сайта",
    viewSite: "На сайт ↗",
    logout: "Выйти",
  },
  en: {
    subtitle: "Rokate Catering — site content management",
    password: "Password",
    passwordPh: "Enter password",
    enter: "Sign in to Dashboard",
    error: "Incorrect password. Please try again.",
    loadingTitle: "Loading Control Panel",
    loadingDesc: "Connecting Decap CMS editor…",
    note: "Content changes are synced via the site owner's GitHub account.",
    tabLeads: "Client inquiries",
    tabStats: "Statistics",
    tabCms: "Site content",
    viewSite: "View site ↗",
    logout: "Log out",
  },
} as const;

type Lang = keyof typeof UI;

/* ------------------------------------------------- Decap UI premium styles & fixes */

const ADMIN_CSS = `
  /* Decap CMS ustiga qo'yiladigan eng kam uslublar.
     MUHIM: Decap ichki elementlarining joylashuvi (position, display, padding)
     o'zgartirilmaydi — bir marta urinib ko'rilgan edi, natijada obyekt
     maydonlari va butun tahrirlagich ko'rinmay qolgan. Faqat bizning
     yuqori panelimiz uchun joy ochamiz va rang beramiz. */

  :root { --rk-head: 54px; }

  html, body {
    margin: 0 !important;
    padding: 0 !important;
    overflow-x: hidden !important;
    background-color: #f7f4ee !important;
  }

  #nc-root {
    min-height: calc(100vh - var(--rk-head)) !important;
    background-color: #f7f4ee !important;
  }

  /* Tahrirlash oynasi sahifa boshiga yopishtirilgan (absolute, top: 0).
     Bizning qora panel 54px joy olgani uchun uni shuncha pastga suramiz.
     z-index: Decap'ning "Записи / Медиафайлы" paneli 300 da turadi,
     tahrirlagich uni to'liq yopishi kerak. */
  #nc-root [class*="EditorContainer"] {
    top: var(--rk-head) !important;
    height: calc(100vh - var(--rk-head)) !important;
    z-index: 400 !important;
  }

  /* Decap'ning o'z paneli bizniki tagida tursin */
  #nc-root [class*="AppHeader"] {
    top: var(--rk-head) !important;
  }
`;

/* ---------------------------------------------------------------- component */

export default function CmsLoader() {
  const [authed, setAuthed] = useState(false);
  const [checked, setChecked] = useState(false);
  const [lang, setLang] = useState<Lang>("ru");
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);
  const [ready, setReady] = useState(false);
  const [activeTab, setActiveTab] = useState<"leads" | "stats" | "cms">("leads");

  const s = UI[lang];

  useEffect(() => {
    /* localStorage, sessionStorage emas: brauzer yopilsa ham esda qoladi,
       shunda parol har safar so'ralmaydi. "Выйти" bosilganda o'chiriladi. */
    try {
      if (localStorage.getItem(SESSION_KEY) === "1") setAuthed(true);
    } catch {
      /* brauzer xotirani bloklagan bo'lsa — parol qaytadan so'raladi */
    }
    setChecked(true);
  }, []);

  useEffect(() => {
    if (!authed) return;

    if (!document.querySelector(`script[src^="${CMS_SCRIPT}"]`)) {
      const script = document.createElement("script");
      script.src = CMS_SCRIPT;
      document.body.appendChild(script);
    }
    if (!document.getElementById("cms-admin-css")) {
      const style = document.createElement("style");
      style.id = "cms-admin-css";
      style.textContent = ADMIN_CSS;
      document.head.appendChild(style);
    }

    const timer = window.setInterval(() => {
      const root = document.getElementById("nc-root");
      if (root && root.childElementCount > 0) {
        window.clearInterval(timer);
        setReady(true);
      }
    }, 200);

    return () => window.clearInterval(timer);
  }, [authed]);

  function submit(e: FormEvent) {
    e.preventDefault();
    const correctPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || DEFAULT_PASSWORD;
    if (value === correctPassword) {
      try {
        localStorage.setItem(SESSION_KEY, "1");
      } catch {
        /* xotira ishlamasa ham shu seansda kirgan bo'ladi */
      }
      setAuthed(true);
      setError(false);
    } else {
      setError(true);
    }
  }

  /* ------------------------------------------------------------- login form */

  if (!authed) {
    if (!checked) return null;
    return (
      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px 16px",
          boxSizing: "border-box",
          background: "radial-gradient(ellipse at top, #faf7f0 0%, #f1ecdf 100%)",
          color: "#1c2340",
          fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
          overflowY: "auto",
        }}
      >
        <style>{`
          .rk-card {
            transition: transform 0.25s ease, box-shadow 0.25s ease;
          }
          .rk-input:focus {
            outline: none;
            border-color: #2f5e46 !important;
            box-shadow: 0 0 0 3px rgba(47, 94, 70, 0.16) !important;
          }
          .rk-btn {
            transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          }
          .rk-btn:hover {
            background: #20412f !important;
            transform: translateY(-1px);
            box-shadow: 0 8px 24px rgba(47, 94, 70, 0.28) !important;
          }
          .rk-btn:active {
            transform: translateY(0);
          }
          .rk-lang:hover {
            border-color: #2f5e46 !important;
            color: #2f5e46 !important;
          }
        `}</style>

        <form
          onSubmit={submit}
          className="rk-card"
          style={{
            width: "100%",
            maxWidth: 420,
            background: "#ffffff",
            border: "1px solid #e7dfd1",
            borderRadius: 24,
            padding: "36px 32px",
            boxShadow: "0 20px 50px -10px rgba(28, 35, 64, 0.1), 0 1px 3px rgba(0, 0, 0, 0.04)",
            boxSizing: "border-box",
            position: "relative",
          }}
        >
          {/* Yuqori: Til tugmalari */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 26,
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "4px 10px",
                background: "#f4f0e6",
                borderRadius: 999,
                fontSize: 12,
                fontWeight: 600,
                color: "#6b7280",
                letterSpacing: ".04em",
                textTransform: "uppercase",
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "#2f5e46",
                }}
              />
              Admin panel
            </div>

            <div style={{ display: "flex", gap: 6 }}>
              {(["ru", "en"] as Lang[]).map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLang(l)}
                  className="rk-lang"
                  style={{
                    border: "1px solid " + (lang === l ? "#2f5e46" : "#e0d8ca"),
                    background: lang === l ? "#2f5e46" : "transparent",
                    color: lang === l ? "#ffffff" : "#4b5563",
                    borderRadius: 999,
                    padding: "5px 12px",
                    font: "600 12px/1 system-ui",
                    cursor: "pointer",
                    textTransform: "uppercase",
                    transition: "all 0.15s ease",
                  }}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          {/* Logotip & Nom */}
          <div style={{ marginBottom: 24, textAlign: "left" }}>
            <div
              style={{
                fontSize: 28,
                fontWeight: 800,
                letterSpacing: "-.03em",
                color: "#1c2340",
                display: "flex",
                alignItems: "baseline",
                gap: 8,
              }}
            >
              Rokate
              <span
                style={{
                  color: "#c9a96a",
                  fontSize: 12,
                  letterSpacing: ".24em",
                  fontWeight: 700,
                  textTransform: "uppercase",
                }}
              >
                Catering
              </span>
            </div>
            <p
              style={{
                margin: "8px 0 0",
                color: "#60667e",
                fontSize: 14,
                lineHeight: 1.5,
              }}
            >
              {s.subtitle}
            </p>
          </div>

          {/* Input qismi */}
          <div style={{ marginBottom: 20 }}>
            <label
              style={{
                display: "block",
                fontSize: 13,
                fontWeight: 600,
                color: "#2e344d",
                marginBottom: 8,
              }}
            >
              {s.password}
            </label>
            <div style={{ position: "relative" }}>
              <input
                type="password"
                className="rk-input"
                value={value}
                onChange={(e) => {
                  setValue(e.target.value);
                  setError(false);
                }}
                placeholder={s.passwordPh}
                autoFocus
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  border: "1.5px solid " + (error ? "#e04434" : "#ded7ca"),
                  borderRadius: 12,
                  padding: "13px 16px",
                  fontSize: 15,
                  background: "#fcfbf8",
                  color: "#1c2340",
                  transition: "all 0.2s ease",
                }}
              />
            </div>

            {error && (
              <div
                style={{
                  color: "#c73020",
                  fontSize: 13,
                  marginTop: 8,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  fontWeight: 500,
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                </svg>
                {s.error}
              </div>
            )}
          </div>

          {/* Kirish tugmasi */}
          <button
            type="submit"
            className="rk-btn"
            style={{
              width: "100%",
              border: 0,
              borderRadius: 14,
              padding: "14px 24px",
              background: "#2f5e46",
              color: "#ffffff",
              fontSize: 15,
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 6px 18px rgba(47, 94, 70, 0.22)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            <span>{s.enter}</span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>

          {/* Izoh */}
          <div
            style={{
              marginTop: 22,
              paddingTop: 18,
              borderTop: "1px solid #f0e9dc",
              display: "flex",
              alignItems: "flex-start",
              gap: 8,
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#8a90a2"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ flexShrink: 0, marginTop: 2 }}
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
            <p
              style={{
                margin: 0,
                fontSize: 12.5,
                lineHeight: 1.5,
                color: "#787e92",
              }}
            >
              {s.note}
            </p>
          </div>
        </form>
      </main>
    );
  }

  /* ------------------------------------------------------------------- CMS & LEADS */

  return (
    <div style={{ minHeight: "100vh", background: "#f7f4ee" }}>
      {/* Global Admin Header - Tabbing between Leads (Arizalar) and CMS */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 9000,
          background: "#1c2340",
          color: "#ffffff",
          padding: "10px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0 4px 18px rgba(0,0,0,0.12)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: "-.02em" }}>
            Rokate <span style={{ color: "#c9a96a", fontSize: 11, letterSpacing: ".2em" }}>CATERING</span>
          </div>

          <nav style={{ display: "flex", gap: 6 }}>
            {([
              ["leads", s.tabLeads],
              ["stats", s.tabStats],
              ["cms", s.tabCms],
            ] as const).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setActiveTab(key)}
                style={{
                  position: "relative",
                  border: 0,
                  background: activeTab === key ? "#2f5e46" : "rgba(255,255,255,0.08)",
                  color: "#ffffff",
                  padding: "7px 16px",
                  borderRadius: 999,
                  fontSize: 13.5,
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "background 0.18s ease",
                }}
              >
                {label}
              </button>
            ))}
          </nav>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* Lang Switcher in Header */}
          <div style={{ display: "flex", gap: 4, background: "rgba(255,255,255,0.08)", padding: 3, borderRadius: 999 }}>
            {(["ru", "en"] as Lang[]).map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLang(l)}
                style={{
                  border: 0,
                  background: lang === l ? "#2f5e46" : "transparent",
                  color: "#ffffff",
                  fontSize: 11.5,
                  fontWeight: 700,
                  padding: "4px 10px",
                  borderRadius: 999,
                  cursor: "pointer",
                  textTransform: "uppercase",
                }}
              >
                {l}
              </button>
            ))}
          </div>

          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            style={{
              color: "#c9a96a",
              textDecoration: "none",
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            {s.viewSite}
          </a>
          <button
            type="button"
            onClick={() => {
              try {
                localStorage.removeItem(SESSION_KEY);
                sessionStorage.removeItem(SESSION_KEY);
              } catch {
                /* e'tiborsiz */
              }
              setAuthed(false);
            }}
            style={{
              border: "1px solid rgba(255,255,255,0.2)",
              background: "transparent",
              color: "#ffffff",
              padding: "4px 12px",
              borderRadius: 8,
              fontSize: 12,
              cursor: "pointer",
            }}
          >
            {s.logout}
          </button>
        </div>
      </header>

      {/* Tab: Leads */}
      {activeTab === "leads" && (
        <main style={{ padding: "16px 0 40px" }}>
          <AdminLeadsPanel lang={lang} />
        </main>
      )}

      {/* Tab: Statistika */}
      {activeTab === "stats" && (
        <main style={{ padding: "20px 24px 48px", maxWidth: 1180, margin: "0 auto" }}>
          <AdminStats lang={lang} />
        </main>
      )}

      {/* Tab: CMS */}
      <div style={{ display: activeTab === "cms" ? "block" : "none" }}>
        <div id="nc-root" style={ready ? undefined : { minHeight: "80vh" }} />
        {!ready && (
          <div
            style={{
              padding: "80px 20px",
              textAlign: "center",
              color: "#1c2340",
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                border: "3.5px solid #ded5c3",
                borderTopColor: "#2f5e46",
                borderRadius: "50%",
                animation: "rk-spin 0.8s linear infinite",
                margin: "0 auto 16px",
              }}
            />
            <style>{`
              @keyframes rk-spin {
                to { transform: rotate(360deg); }
              }
            `}</style>
            <h2 style={{ margin: "0 0 6px", fontSize: 18, fontWeight: 700 }}>
              {s.loadingTitle}
            </h2>
            <p style={{ margin: 0, fontSize: 14, color: "#656b82" }}>
              {s.loadingDesc}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
