import type { Metadata, Viewport } from "next";
import "../globals.css";
import { ToastProvider } from "@/components/admin/ui";

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
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
