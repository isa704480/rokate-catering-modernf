"use client";

/** Paketni tanlab, ariza formasiga o'tkazadi (forma "rk:package" eventini tinglaydi). */
export function RequestPackageButton({ slug, label, className = "" }: { slug: string; label: string; className?: string }) {
  return (
    <a
      href="#request"
      className={className}
      data-event="package_request"
      data-label={slug}
      onClick={() => window.dispatchEvent(new CustomEvent("rk:package", { detail: slug }))}
    >
      {label}
    </a>
  );
}
