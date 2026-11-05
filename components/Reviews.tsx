import { DynHead } from "./dynamic/Sections";
import ReviewsSlider, { type SliderReview } from "./ReviewsSlider";
import reviewsData from "@/content/reviews.json";
import type { Locale } from "@/lib/types";

/**
 * Sharhlar bloki.
 *
 * Ma'lumot content/reviews.json dan olinadi — uni Roman admin paneldagi
 * "Отзывы" bo'limidan tahrirlaydi. Fayl build vaqtida qo'shilgani uchun
 * CMS'da saqlangandan keyin sayt qayta yig'ilganda yangilanadi.
 *
 * Sharhlar haqiqiy: Google profilidan ko'chirilgan. O'ylab topilgan sharh qo'yilmaydi.
 */

type Item = {
  author: string;
  rating?: number;
  kind_ru?: string;
  kind_en?: string;
  text_ru?: string;
  text_en?: string;
  hidden?: boolean;
};

const UI = {
  ru: {
    carousel: "Отзывы клиентов",
    prev: "Предыдущий отзыв",
    next: "Следующий отзыв",
    bullet: "Перейти к отзыву {{index}}",
  },
  en: {
    carousel: "Client reviews",
    prev: "Previous review",
    next: "Next review",
    bullet: "Go to review {{index}}",
  },
} as const;

function pick(item: Record<string, unknown>, base: string, locale: Locale): string {
  const value = item[`${base}_${locale}`];
  const fallback = item[`${base}_${locale === "ru" ? "en" : "ru"}`];
  return String((value || fallback) ?? "");
}

export function Reviews({ locale }: { locale: Locale }) {
  const data = reviewsData as unknown as Record<string, unknown> & { items: Item[] };
  const visible = (data.items ?? []).filter((r) => !r.hidden && (r.text_ru || r.text_en));
  if (!visible.length) return null;

  const slides: SliderReview[] = visible.map((r) => ({
    author: r.author,
    rating: r.rating ?? 5,
    kind: pick(r as unknown as Record<string, unknown>, "kind", locale),
    text: pick(r as unknown as Record<string, unknown>, "text", locale),
  }));

  const items = slides;

  const googleUrl = String(data.googleUrl ?? "");
  const ctaLabel = pick(data, "ctaLabel", locale);

  return (
    <section id="reviews" className="section" data-section="reviews">
      <div className="container-x">
        <DynHead
          kicker={pick(data, "kicker", locale)}
          title={pick(data, "title", locale)}
          text={pick(data, "text", locale)}
          small
        />

        <ReviewsSlider items={items} labels={UI[locale] ?? UI.en} />

        {googleUrl && ctaLabel && (
          <div className="mt-10">
            <a href={googleUrl} target="_blank" rel="noopener" className="btn btn-outline">
              <GoogleMark />
              {ctaLabel}
            </a>
          </div>
        )}
      </div>
    </section>
  );
}

function GoogleMark() {
  return (
    <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#4285F4" d="M45 24.5c0-1.6-.1-2.7-.4-3.9H24v7.1h12c-.2 1.8-1.5 4.6-4.4 6.5l6.7 5.2c4-3.7 6.7-9.1 6.7-14.9z" />
      <path fill="#34A853" d="M24 46c5.8 0 10.7-1.9 14.3-5.2l-6.7-5.2c-1.8 1.3-4.3 2.2-7.6 2.2-5.8 0-10.7-3.8-12.5-9.1l-7 5.4C8.1 41.1 15.4 46 24 46z" />
      <path fill="#FBBC05" d="M11.5 28.7c-.5-1.4-.7-2.8-.7-4.3s.3-3 .7-4.3l-7-5.4C3.2 17.6 2.5 20.7 2.5 24s.7 6.4 2 9.1l7-4.4z" />
      <path fill="#EA4335" d="M24 10.4c4.1 0 6.9 1.8 8.5 3.3l6-5.8C34.7 4.5 29.8 2 24 2 15.4 2 8.1 6.9 4.5 14.1l7 5.4c1.8-5.3 6.7-9.1 12.5-9.1z" />
    </svg>
  );
}
