import type { Metadata } from "next";
import CmsLoader from "./CmsLoader";

/**
 * Admin panel (Decap CMS) — avval public/admin/index.html edi.
 * Endi oddiy Next sahifa: /admin ga kirganda CMS skripti client'da yuklanadi.
 * Kontent sozlamalari: public/admin/config.yml (CMS uni o'qiydi).
 */
export const metadata: Metadata = {
  title: "Rokate Catering — редактирование сайта",
  robots: { index: false, follow: false },
  icons: { icon: "/favicon.svg" },
};

export default function AdminPage() {
  return (
    <>
      {/* Decap CMS uchun config manzili (rasmiy usul):
          https://decapcms.org/docs/configuration-options/
          Sahifa /admin da (slashesiz) joylashgani uchun CMS config'ni
          avtomatik topa olmaydi — shu link orqali aniq ko'rsatiladi.
          React 19 bu tegni avtomatik <head> ga ko'taradi. */}
      <link href="/admin/config.yml" type="text/yaml" rel="cms-config-url" />
      <CmsLoader />
    </>
  );
}
