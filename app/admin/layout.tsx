import type { Metadata, Viewport } from "next";
import "../globals.css";
import { ToastProvider } from "@/components/admin/ui";
import { DEMO } from "@/lib/demo";

export const metadata: Metadata = {
  title: { default: "Rokate — админ", template: "%s · Rokate админ" },
  robots: { index: false, follow: false },
  icons: { icon: "/favicon.svg" },
};
export const viewport: Viewport = { themeColor: "#1f433b", width: "device-width", initialScale: 1 };

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body className="min-h-screen bg-[#f6f4ee]" suppressHydrationWarning>
        {DEMO ? (
          <main className="grid min-h-screen place-items-center p-6">
            <div className="max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">
              <h1 className="text-xl font-semibold text-[#1f433b]">Админ-панель</h1>
              <p className="mt-3 text-[15px] leading-relaxed text-neutral-600">
                Это демо-версия сайта. Админ-панель заработает после подключения сервера (backend).
              </p>
              <a href="/" className="mt-6 inline-block rounded-full bg-[#1f433b] px-5 py-2.5 text-sm text-white">На сайт</a>
            </div>
          </main>
        ) : (
          <ToastProvider>{children}</ToastProvider>
        )}
      </body>
    </html>
  );
}
