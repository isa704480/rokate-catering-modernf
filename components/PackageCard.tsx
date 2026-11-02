import { Icon } from "./Icon";
import { Img } from "./Img";
import { RequestPackageButton } from "./RequestPackageButton";
import { formatPrice, t } from "@/lib/i18n";
import type { Locale, Package } from "@/lib/types";

export function PackageCard({ p, locale, requestHref }: { p: Package; locale: Locale; requestHref?: string }) {
  const d = t(locale);
  const guests = d.guests(p.guests_min, p.guests_max);
  return (
    <article className="card reveal group flex flex-col overflow-hidden">
      <div className="img-zoom relative aspect-[4/3] overflow-hidden">
        <Img img={p.image} sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw" className="h-full w-full object-cover" />
        {p.badge && (
          <span className="absolute left-4 top-4 rounded-full bg-lime px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-ink">
            {d.badge[p.badge] || p.badge}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-6 lg:p-7">
        {guests && (
          <p className="flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.12em] text-gold">
            <Icon name="users" size={16} />{guests}
          </p>
        )}
        <h3 className="mt-3 text-[1.9rem]">{p.name}</h3>
        {p.short_text && <p className="mt-3 text-[15px] leading-relaxed text-ink-muted">{p.short_text}</p>}
        {p.contents.length > 0 && (
          <ul className="mt-5 space-y-2 text-[14px]">
            {p.contents.slice(0, 5).map((c) => (
              <li key={c} className="flex gap-2.5"><Icon name="check" size={16} className="mt-0.5 shrink-0 text-green" />{c}</li>
            ))}
          </ul>
        )}
        <div className="mt-auto pt-6"><div className="flex items-end justify-between gap-4 border-t border-line pt-5">
          <p className="leading-tight">
            {p.price_from != null ? (
              <>
                <span className="text-[12px] uppercase tracking-[0.12em] text-ink-muted">{d.price.from} </span>
                <span className="font-display text-[1.7rem] text-ink">{formatPrice(locale, p.price_from)} {d.price.currency}</span>
                {p.price_note && <span className="block text-[12px] text-ink-muted">{p.price_note}</span>}
              </>
            ) : (
              <span className="text-[14px] font-medium text-ink-muted">{d.price.onRequest}</span>
            )}
          </p>
          {requestHref ? (
            <a href={requestHref} className="btn btn-outline !min-h-[42px] !px-4 text-[13px]">{d.cta.request}</a>
          ) : (
            <RequestPackageButton slug={p.slug} label={d.cta.request} className="btn btn-outline !min-h-[42px] !px-4 text-[13px]" />
          )}
        </div></div>
      </div>
    </article>
  );
}
