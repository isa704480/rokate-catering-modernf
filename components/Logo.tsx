/** Logotip — asl qo'lyozma belgisi, fon shaffof qilingan va brend ranglariga o'tkazilgan. */
export default function Logo({ light = false, className = "h-10 w-auto" }: { light?: boolean; className?: string }) {
  return (
    <img
      src={light ? "/media/logo-mark-light.webp" : "/media/logo-mark.webp"}
      alt="Rokate Catering"
      className={className}
      width={560}
      height={469}
      decoding="async"
    />
  );
}
