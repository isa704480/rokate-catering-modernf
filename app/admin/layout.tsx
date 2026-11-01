/**
 * Admin uchun root layout.
 * Decap CMS va Login sahifasida keraksiz scrollbar paydo bo'lmasligi,
 * butun ekran to'liq va silliq ishlashi uchun html, body stillari to'g'rilangan.
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" style={{ height: "100%", margin: 0, padding: 0 }}>
      <body
        style={{
          height: "100%",
          margin: 0,
          padding: 0,
          background: "#f7f4ee",
          fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",
        }}
      >
        {children}
      </body>
    </html>
  );
}
