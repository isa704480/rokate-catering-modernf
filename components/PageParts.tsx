import Img from "./Img";
import Rail from "./Rail";
import { Paragraphs } from "./Sections";
import { t } from "@/lib/i18n";
import type { Locale } from "@/lib/content";
import type { PageDoc } from "@/lib/types";

/** Ichki sahifalarning yuqori qismi: sarlavha, qisqa matn va bitta katta rasm. */
export function PageHero({ page }: { page: PageDoc }) {
  return (
    <section className="container-x pt-8 pb-12 md:pt-14 md:pb-16">
      <div className="grid items-end gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:gap-14">
        <div>
          <h1 className="h2">{page.title}</h1>
          <p className="lede mt-4">{page.lede}</p>
        </div>
        {page.photo && (
          <div className="tile-in aspect-[4/3] overflow-hidden rounded-tile bg-sand">
            <Img src={page.photo} alt={page.title} priority sizes="(min-width:768px) 48vw, 100vw" className="h-full w-full object-cover" />
          </div>
        )}
      </div>
    </section>
  );
}

/** Matn bloklari — ingichka chiziqlar bilan ajratilgan. */
export function Blocks({ page }: { page: PageDoc }) {
  if (!page.blocks?.length) return null;
  return (
    <section className="container-x pb-4">
      <div className="grid gap-x-10 md:grid-cols-3">
        {page.blocks.map((b) => (
          <div key={b.title} className="border-t border-gold/40 py-6">
            <h2 className="text-[18px] font-bold">{b.title}</h2>
            <div className="mt-2">
              <Paragraphs text={b.text} className="body text-[15px]" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/** Ro'yxat (formatlar, poводlar, hamkor turlari). */
export function ListCols({ page }: { page: PageDoc }) {
  if (!page.list?.length) return null;
  return (
    <section className="container-x py-12 md:py-16">
      {page.listTitle && <h2 className="h3">{page.listTitle}</h2>}
      <ul className="mt-6 grid gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
        {page.list.map((item) => (
          <li key={item} className="border-t border-line py-3.5 text-[16px] font-medium">
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}

/** Sahifa galereyasi — gorizontal lenta. */
export function Gallery({ locale, page }: { locale: Locale; page: PageDoc }) {
  const s = t(locale);
  if (!page.gallery?.length) return null;
  return (
    <section className="bg-sand">
      <div className="container-x py-14 md:py-20">
        <Rail hint={s.scrollHint}>
          {page.gallery.map((p) => (
            <div key={p} className="aspect-[4/5] w-[230px] overflow-hidden rounded-tile bg-line/40 md:w-[280px]">
              <Img src={p} alt={page.title} sizes="280px" className="h-full w-full object-cover" />
            </div>
          ))}
        </Rail>
      </div>
    </section>
  );
}
