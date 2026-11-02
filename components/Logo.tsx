/** Matnli logotip. Admin'da SVG logotip yuklansa — o'sha ishlatiladi. */
export function Logo({ logo, light = false }: { logo?: string | null; light?: boolean }) {
  if (logo) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={logo} alt="Rokate Catering" className="h-9 w-auto" />;
  }
  return (
    <span className={`inline-flex flex-col leading-none ${light ? "text-white" : "text-ink"}`}>
      <span className="font-display text-[30px] italic font-semibold tracking-tight">Rokate</span>
      <span className="mt-0.5 pl-0.5 text-[9px] font-semibold tracking-[0.42em] text-gold">CATERING</span>
    </span>
  );
}
