"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Icon, WhatsAppIcon } from "./Icon";
import { Logo } from "./Logo";

type Props = {
  locale: "en" | "ru";
  logo: string | null;
  wa: string;
  labels: { services: string; packages: string; portfolio: string; menu: string; contact: string; proposal: string; lang: string; close: string };
  homeHref: string;
};

function switchLocale(pathname: string, to: "en" | "ru") {
  const clean = pathname.replace(/^\/(ru|en)(?=\/|$)/, "") || "/";
  return to === "en" ? clean : clean === "/" ? "/ru" : `/ru${clean}`;
}

export function Header({ locale, logo, wa, labels, homeHref }: Props) {
  const pathname = usePathname() || "/";
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    const close = () => setOpen(false);
    window.addEventListener("rk:close-menu", close);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("rk:close-menu", close);
    };
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  // Sahifa almashganda menyuni yopish
  useEffect(() => setOpen(false), [pathname]);

  /** Til almashtirish: sahifa qayta yuklanmaydi, foydalanuvchi turgan joyda qoladi. */
  const changeLocale = (e: React.MouseEvent<HTMLAnchorElement>, to: "en" | "ru") => {
    e.preventDefault();
    if (to === locale) return;
    setOpen(false);
    document.documentElement.style.overflow = "";
    // Qaysi bo'limda turganimizni eslab qolamiz (tillarda matn uzunligi farq qiladi)
    const sections = Array.from(document.querySelectorAll<HTMLElement>("main [data-section]"));
    const current = sections.find((el) => { const r = el.getBoundingClientRect(); return r.top <= 80 && r.bottom > 80; });
    const key = current?.dataset.section;
    const ratio = current ? (80 - current.getBoundingClientRect().top) / current.offsetHeight : 0;
    const y = window.scrollY;
    const target = switchLocale(pathname, to) + window.location.search + window.location.hash;
    router.push(target, { scroll: false });
    let tries = 0;
    const restore = () => {
      if (document.documentElement.lang !== to && tries++ < 60) { requestAnimationFrame(restore); return; }
      const el = key ? document.querySelector<HTMLElement>(`main [data-section="${key}"]`) : null;
      const top = el ? el.getBoundingClientRect().top + window.scrollY + ratio * el.offsetHeight - 80 : y;
      window.scrollTo({ top, behavior: "instant" as ScrollBehavior });
      if (tries < 1000) { tries = 1000; setTimeout(restore, 180); } // rasmlar joylashgach yana bir marta aniqlash
    };
    requestAnimationFrame(restore);
  };

  const nav = [
    { href: `${homeHref}#directions`, label: labels.services },
    { href: `${homeHref}#packages`, label: labels.packages },
    { href: `${homeHref}#portfolio`, label: labels.portfolio },
    { href: `${homeHref === "/" ? "" : homeHref}/menu`, label: labels.menu },
    { href: `${homeHref}#request`, label: labels.contact },
  ];

  const LangLinks = ({ big = false }: { big?: boolean }) => (
    <>
      {(["en", "ru"] as const).map((l) => (
        <a key={l} href={switchLocale(pathname, l)} hrefLang={l} onClick={(e) => changeLocale(e, l)}
           aria-current={l === locale ? "true" : undefined}
           className={big
             ? `btn !min-h-[40px] !px-4 text-[13px] uppercase ${l === locale ? "btn-primary" : "btn-outline"}`
             : `px-2 py-1 rounded-full uppercase tracking-wider ${l === locale ? "text-ink" : "text-ink-muted hover:text-ink"}`}>
          {l}
        </a>
      ))}
    </>
  );

  return (
    <>
      {/* Modern Dynamic: suzib turgan "pill" header */}
      <header className="sticky top-0 z-40 px-3 pt-3">
        <div className={`mx-auto max-w-[1280px] rounded-full border transition-all duration-300 ${scrolled || open ? "border-line bg-white/85 shadow-[0_10px_30px_rgba(16,24,43,.08)] backdrop-blur-xl" : "border-transparent bg-white/70 backdrop-blur-md"}`}>
        <div className="flex h-[64px] items-center justify-between gap-6 pl-5 pr-2 lg:pl-7">
          <Link href={homeHref} aria-label="Rokate Catering" onClick={() => setOpen(false)}>
            <Logo logo={logo} />
          </Link>

          <nav className="hidden lg:flex items-center gap-1 text-[14px] font-semibold" aria-label="Main">
            {nav.map((n) => (
              <a key={n.href} href={n.href} className="rounded-full px-4 py-2 transition-colors hover:bg-ink hover:text-white">{n.label}</a>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-5">
            <div className="flex items-center gap-1 text-[13px] font-semibold" aria-label={labels.lang}>
              <LangLinks />
            </div>
            <a href={`${homeHref}#request`} className="btn btn-primary !min-h-[48px] !px-6 text-[14px]" data-event="cta_click" data-location="header">
              {labels.proposal}
            </a>
          </div>

          <div className="flex lg:hidden items-center gap-1">
            {wa && (
              <a href={wa} target="_blank" rel="noopener" aria-label="WhatsApp" data-location="header"
                 className="grid h-11 w-11 place-items-center rounded-full text-green">
                <WhatsAppIcon size={22} />
              </a>
            )}
            <button type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open} aria-controls="mobile-menu"
                    aria-label={open ? labels.close : "Menu"} className="grid h-11 w-11 place-items-center rounded-full">
              <Icon name={open ? "close" : "menu"} size={26} />
            </button>
          </div>
        </div>
        </div>
      </header>

      {/* Mobil menyu header'dan TASHQARIDA: header'dagi backdrop-filter fixed elementni "qamab" qo'yadi */}
      <div id="mobile-menu"
           className={`lg:hidden fixed inset-x-0 top-[84px] bottom-0 z-40 overflow-y-auto bg-bg transition-[opacity,transform] duration-300 ${
             open ? "opacity-100 translate-y-0" : "pointer-events-none invisible opacity-0 -translate-y-2"}`}
           aria-hidden={!open}>
        <nav className="container-x flex flex-col pt-4 pb-32" aria-label="Mobile">
          {nav.map((n) => (
            <a key={n.href} href={n.href} onClick={() => setOpen(false)} tabIndex={open ? 0 : -1}
               className="flex items-center justify-between font-display text-[26px] uppercase tracking-tight py-4 border-b border-line">
              {n.label}
              <Icon name="arrow" size={20} className="text-gold" />
            </a>
          ))}
          <div className="mt-8 flex items-center gap-2"><LangLinks big /></div>
          <a href={`${homeHref}#request`} onClick={() => setOpen(false)} tabIndex={open ? 0 : -1}
             className="btn btn-primary mt-6" data-location="mobile_menu">
            {labels.proposal}
          </a>
        </nav>
      </div>
    </>
  );
}
