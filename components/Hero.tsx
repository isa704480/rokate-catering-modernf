import Link from "next/link";
import Img from "./Img";
import { t, href } from "@/lib/i18n";
import type { Locale } from "@/lib/content";
import type { Home, Settings } from "@/lib/types";
import { WhatsAppLink } from "./Contacts2";

/**
 * Birinchi ekran: Rokate universal kompaniya sifatida.
 * To'rt rasm — to'rt xil tadbir: ziyofat villada, ofisda, yaxtada, ochilishda.
 * Yo'riqnomada aytilgan video bo'lsa, birinchi katak o'rniga u turadi.
 */
export default function Hero({
  locale,
  home,
  settings,
}: {
  locale: Locale;
  home: Home;
  settings: Settings;
}) {
  const s = t(locale);
  const [p1, p2, p3, p4] = home.hero.photos;

  return (
    <section className="container-x pt-10 pb-14 md:pt-16 md:pb-20">
      <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-16">
        <div>
          <h1 className="display">{home.hero.title}</h1>
          <p className="lede mt-5">{home.hero.text}</p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="#contact" className="btn btn-primary sm:px-8">
              {s.request}
            </Link>
            <WhatsAppLink whatsapp={settings.whatsapp} className="btn btn-ghost sm:px-8" place="hero">
              {s.whatsapp}
            </WhatsAppLink>
          </div>

          <div className="mt-9 flex items-center gap-4">
            <div className="rule w-10 shrink-0" />
            <p className="text-[14px] leading-relaxed text-ink-soft">{settings.venues}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 md:gap-4">
          <div className="flex flex-col gap-3 md:gap-4">
            <Tile src={p1} alt={home.hero.title} ratio="aspect-[3/4]" delay={0} priority video={home.hero.video} />
            <Tile src={p4} alt={home.hero.title} ratio="aspect-[4/3]" delay={0.18} />
          </div>
          <div className="flex flex-col gap-3 md:gap-4 lg:pt-10">
            <Tile src={p2} alt={home.hero.title} ratio="aspect-[4/3]" delay={0.09} priority />
            <Tile src={p3} alt={home.hero.title} ratio="aspect-[3/4]" delay={0.27} />
          </div>
        </div>
      </div>
    </section>
  );
}

function Tile({
  src,
  alt,
  ratio,
  delay,
  priority = false,
  video,
}: {
  src: string;
  alt: string;
  ratio: string;
  delay: number;
  priority?: boolean;
  video?: string;
}) {
  return (
    <div
      className={`tile-in ${ratio} overflow-hidden rounded-tile bg-sand`}
      style={{ animationDelay: `${delay}s` }}
    >
      {video ? (
        <video
          className="h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          poster={src}
          aria-label={alt}
        >
          <source src={video} type="video/mp4" />
        </video>
      ) : (
        <Img
          src={src}
          alt={alt}
          priority={priority}
          sizes="(min-width:1024px) 26vw, 45vw"
          className="h-full w-full object-cover"
        />
      )}
    </div>
  );
}
