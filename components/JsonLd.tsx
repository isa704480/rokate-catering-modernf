import type { Settings, Direction } from "@/lib/types";
import type { Locale } from "@/lib/content";

/** schema.org — Google va AI-qidiruv uchun (yo'riqnomaning 9-bo'limi). */
export default function JsonLd({
  settings,
  locale,
  directions = [],
}: {
  settings: Settings;
  locale: Locale;
  directions?: Direction[];
}) {
  const url = settings.siteUrl.replace(/\/$/, "");

  const business = {
    "@context": "https://schema.org",
    "@type": "FoodEstablishment",
    additionalType: "https://schema.org/CateringService",
    "@id": `${url}/#business`,
    name: "Rokate Catering",
    description:
      locale === "ru"
        ? "Выездной кейтеринг в Дубае и Абу-Даби: яхты, виллы, офисы, частные ужины и свадьбы."
        : "Off-site catering in Dubai and Abu Dhabi: yachts, villas, offices, private dinners and weddings.",
    url: `${url}/${locale}`,
    telephone: settings.phone,
    email: settings.email,
    image: `${url}/media/yacht-deck-table__w1500.webp`,
    logo: `${url}/media/logo-mark.webp`,
    slogan: "Taste | Style | Quality",
    priceRange: "$$-$$$",
    servesCuisine: ["European", "Mediterranean", "Seafood"],
    areaServed: [
      { "@type": "City", name: "Dubai" },
      { "@type": "City", name: "Abu Dhabi" },
    ],
    address: { "@type": "PostalAddress", addressCountry: "AE", addressLocality: "Dubai" },
    sameAs: [`https://instagram.com/${settings.instagram}`, `https://t.me/${settings.telegram}`],
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        opens: "09:00",
        closes: "22:00",
      },
    ],
  };

  const services = directions.map((d) => ({
    "@context": "https://schema.org",
    "@type": "Service",
    name: d.title,
    description: d.short,
    serviceType: d.title,
    provider: { "@id": `${url}/#business` },
    areaServed: [
      { "@type": "City", name: "Dubai" },
      { "@type": "City", name: "Abu Dhabi" },
    ],
    ...(d.page ? { url: `${url}/${locale}${d.page}` } : {}),
  }));

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify([business, ...services]) }}
    />
  );
}
