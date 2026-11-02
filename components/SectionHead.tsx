export function SectionHead({ eyebrow, title, text, center = false, light = false, className = "" }: {
  eyebrow?: string; title?: string; text?: string; center?: boolean; light?: boolean; className?: string;
}) {
  if (!title && !eyebrow) return null;
  return (
    <div className={`reveal max-w-2xl ${center ? "mx-auto text-center" : ""} ${className}`}>
      {eyebrow && <p className={`eyebrow ${light ? "!text-gold-soft" : ""}`}>{eyebrow}</p>}
      {title && <h2 className={`h2 mt-4 ${light ? "text-white" : ""}`}>{title}</h2>}
      {text && <p className={`lead mt-5 ${light ? "!text-white/75" : ""}`}>{text}</p>}
    </div>
  );
}
