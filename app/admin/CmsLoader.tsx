"use client";

import { useEffect, useState, type FormEvent } from "react";

const CMS_SCRIPT = "https://unpkg.com/decap-cms@3.8.3/dist/decap-cms.js";

/**
 * Parol — statik saytda bu panelni tasodifiy kirib qolganlardan yopadi.
 * Saqlash faqat GitHub hisobi orqali amalga oshadi.
 */
const PASSWORD = "Rokate2026";
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
  },
} as const;

type Lang = keyof typeof UI;

/* ------------------------------------------------- Decap UI premium styles & fixes */

const ADMIN_CSS = `
  /* Ekran va sahifa chetlaridagi ortiqcha scrolllarni tozalash */
  html, body {
    margin: 0 !important;
    padding: 0 !important;
    height: 100% !important;
    width: 100% !important;
    overflow-x: hidden !important;
    background-color: #f7f4ee !important;
  }

  #nc-root {
    min-height: 100vh !important;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
    font-size: 15px !important;
    color: #1c2340 !important;
    background-color: #f7f4ee !important;
  }

  /* Shriftlar, input va selektorlar dizayni */
  #nc-root input, #nc-root textarea, #nc-root select {
    font-size: 15px !important;
    font-family: inherit !important;
    border-radius: 8px !important;
    border: 1px solid #dcd5c7 !important;
    background: #ffffff !important;
    transition: all 0.2s ease !important;
  }

  #nc-root input:focus, #nc-root textarea:focus, #nc-root select:focus {
    border-color: #2f5e46 !important;
    box-shadow: 0 0 0 3px rgba(47, 94, 70, 0.15) !important;
    outline: none !important;
  }

  /* Tugmalar uslubi */
  #nc-root button {
    font-size: 14px !important;
    font-weight: 600 !important;
    border-radius: 8px !important;
    transition: all 0.2s ease !important;
  }

  /* Header (yuqori panel) dizayni */
  #nc-root header {
    background: #ffffff !important;
    border-bottom: 1px solid #e5ded0 !important;
    box-shadow: 0 2px 12px rgba(28, 35, 64, 0.04) !important;
    min-height: 64px !important;
    padding: 0 16px !important;
  }

  /* Yon panel (Sidebar / Kolleksiyalar) */
  #nc-root [class*="SidebarContainer"] {
    background: #ffffff !important;
    border-right: 1px solid #e5ded0 !important;
    box-shadow: 2px 0 16px rgba(28, 35, 64, 0.03) !important;
    border-radius: 0 16px 16px 0 !important;
  }

  #nc-root [class*="SidebarContent"] {
    padding: 16px 12px !important;
  }

  #nc-root [class*="Sidebar"] h1, 
  #nc-root [class*="SidebarContainer"] h1 {
    font-size: 18px !important;
    font-weight: 700 !important;
    color: #1c2340 !important;
    padding-left: 8px !important;
    margin-bottom: 16px !important;
  }

  /* Tanlangan va hover qilingan kolleksiya tugmalari */
  #nc-root [class*="Sidebar"] a,
  #nc-root [class*="SidebarLink"],
  #nc-root [class*="ListItemLink"] {
    border-radius: 10px !important;
    padding: 10px 14px !important;
    margin-bottom: 4px !important;
    color: #434960 !important;
    font-weight: 500 !important;
    transition: all 0.15s ease !important;
  }

  #nc-root [class*="Sidebar"] a:hover,
  #nc-root [class*="SidebarLink"]:hover,
  #nc-root [class*="ListItemLink"]:hover {
    background: #f1ede3 !important;
    color: #1c2340 !important;
  }

  /* Faol link (yashil aksent) */
  #nc-root [class*="Sidebar"] a[class*="active"],
  #nc-root [class*="SidebarLink"][class*="active"],
  #nc-root [class*="ListItemLink"][class*="active"],
  #nc-root [aria-current="page"] {
    background: #2f5e46 !important;
    color: #ffffff !important;
    font-weight: 600 !important;
  }

  #nc-root [class*="Sidebar"] a[class*="active"] svg,
  #nc-root [class*="SidebarLink"][class*="active"] svg,
  #nc-root [class*="ListItemLink"][class*="active"] svg {
    fill: #ffffff !important;
  }

  /* Asosiy kontent kartalari */
  #nc-root [class*="Card"],
  #nc-root [class*="CollectionTop"],
  #nc-root [class*="ListCard"] {
    border-radius: 14px !important;
    border: 1px solid #e7e0d3 !important;
    box-shadow: 0 4px 20px rgba(28, 35, 64, 0.04) !important;
    background: #ffffff !important;
    transition: transform 0.2s ease, box-shadow 0.2s ease !important;
  }

  #nc-root [class*="Card"]:hover {
    box-shadow: 0 8px 26px rgba(28, 35, 64, 0.08) !important;
  }

  /* Asosiy tugmalar (Saqlash, Chop etish, Yaratish) */
  #nc-root button[class*="PublishButton"],
  #nc-root button[class*="SaveButton"],
  #nc-root a[class*="NewButton"],
  #nc-root [class*="AppHeaderActions"] button:not([class*="cancel"]) {
    background: #2f5e46 !important;
    color: #ffffff !important;
    border: none !important;
    border-radius: 999px !important;
    padding: 10px 22px !important;
    box-shadow: 0 4px 14px rgba(47, 94, 70, 0.25) !important;
  }

  #nc-root button[class*="PublishButton"]:hover,
  #nc-root a[class*="NewButton"]:hover {
    background: #20412f !important;
    transform: translateY(-1px) !important;
  }

  /* Mobil va ixcham ekranlar uchun moslashuv */
  @media (max-width: 899px) {
    #nc-root [class*="AppHeaderContent"] {
      flex-wrap: wrap !important;
      min-width: 0 !important;
      width: 100% !important;
      gap: 8px !important;
      padding: 10px 0 !important;
    }

    #nc-root [class*="AppHeaderContent"] nav {
      flex-wrap: wrap !important;
      min-width: 0 !important;
      gap: 6px 12px !important;
    }

    #nc-root [class*="AppHeaderActions"] {
      width: 100% !important;
      min-width: 0 !important;
      display: flex !important;
      justify-content: flex-end !important;
      gap: 8px !important;
      margin-top: 4px !important;
    }

    #nc-root [class*="SidebarContainer"] {
      position: static !important;
      width: 100% !important;
      max-width: 100% !important;
      height: auto !important;
      max-height: 48vh !important;
      border-radius: 0 0 16px 16px !important;
      border-right: none !important;
      border-bottom: 1px solid #e2dbcd !important;
      overflow-y: auto !important;
    }

    #nc-root [class*="AppMainContainer"], #nc-root main {
      margin-left: 0 !important;
      padding: 14px !important;
      width: 100% !important;
      box-sizing: border-box !important;
    }
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

  const s = UI[lang];

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY) === "1") {
      setAuthed(true);
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
    if (value === PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, "1");
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

  /* ------------------------------------------------------------------- CMS */

  return (
    <>
      <div id="nc-root" style={ready ? undefined : { position: "fixed", inset: 0 }} />
      {!ready && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "#f7f4ee",
            color: "#1c2340",
            fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
            padding: 24,
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              border: "3.5px solid #ded5c3",
              borderTopColor: "#2f5e46",
              borderRadius: "50%",
              animation: "rk-spin 0.8s linear infinite",
              marginBottom: 20,
            }}
          />
          <style>{`
            @keyframes rk-spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
          <h2 style={{ margin: "0 0 6px", fontSize: 19, fontWeight: 700 }}>
            {s.loadingTitle}
          </h2>
          <p style={{ margin: 0, fontSize: 14, color: "#656b82" }}>
            {s.loadingDesc}
          </p>
        </div>
      )}
    </>
  );
}
