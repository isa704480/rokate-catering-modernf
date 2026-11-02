import Link from "next/link";
import { Img } from "./Img";
import type { Img as ImgT } from "@/lib/types";

export function PageHero({ eyebrow, title, intro, image, crumbs }: {
  eyebrow?: string; title: string; intro?: string; image?: ImgT; crumbs: { href: string; label: string }[];
}) {
  return (
    <section className="relative" data-section="page_hero">
      <div className="container-x grid gap-10 pt-8 pb-16 lg:grid-cols-12 lg:items-center lg:pt-14 lg:pb-24">
        <div className={image ? "lg:col-span-6" : "lg:col-span-9"}>
          <nav aria-label="Breadcrumb" className="text-[13px] text-ink-muted">
            {crumbs.map((c, i) => (
              <span key={c.href}>
                {i > 0 && <span className="mx-2 text-gold">/</span>}
                {i < crumbs.length - 1 ? <Link href={c.href} className="link-underline">{c.label}</Link> : <span>{c.label}</span>}
              </span>
            ))}
          </nav>
          {eyebrow && <p className="eyebrow mt-8">{eyebrow}</p>}
          <h1 className="mt-4 text-[clamp(2.7rem,5.5vw,4.8rem)]">{title}</h1>
          {intro && <p className="lead mt-6 max-w-xl !text-[18px]">{intro}</p>}
        </div>
        {image && (
          <div className="lg:col-span-6">
            <div className="relative aspect-[4/3] overflow-hidden lg:aspect-[5/4]">
              <Img img={image} priority sizes="(min-width:1024px) 50vw, 100vw" className="h-full w-full object-cover" />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
