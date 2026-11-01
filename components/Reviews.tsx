import type { Review } from "@/lib/types";

/**
 * Sharhlar. Bo'sh bo'lsa, blok umuman chiqmaydi —
 * o'ylab topilgan sharh qo'yilmaydi, Roman CMS orqali haqiqiylarini qo'shadi.
 */
export default function Reviews({ items, title }: { items: Review[]; title: string }) {
  if (!items.length) return null;

  return (
    <section className="container-x py-16 md:py-24">
      <h2 className="h2">{title}</h2>
      <ul className="mt-9 grid gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((r) => (
          <li key={r.slug} className="border-t border-gold/40 py-6">
            <blockquote className="text-[16px] leading-relaxed">{r.text}</blockquote>
            <p className="mt-3 text-[14px] font-semibold">
              {r.author}
              {r.kind ? <span className="font-normal text-ink-soft">, {r.kind}</span> : null}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
