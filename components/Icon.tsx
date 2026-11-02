import type { ReactNode, SVGProps } from "react";

/** Ingichka chiziqli ikonlar. Nomlar backend'dagi ICON_CHOICES bilan bir xil. */
const P: Record<string, ReactNode> = {
  chef: <path d="M7 17.5v-4A4 4 0 0 1 6.2 6a4 4 0 0 1 5.8-2.6A4 4 0 0 1 17.8 6a4 4 0 0 1-.8 7.5v4M7 17.5h10M7 21h10" />,
  yacht: <path d="M12 3v13M12 4.5 18 15h-6M11 7 6.5 15H11M3 18h18l-2.5 3h-13z" />,
  villa: <path d="M3 11.5 12 4l9 7.5M5 10v10h14V10M10 20v-5h4v5" />,
  office: <path d="M4 21V4h10v17M14 9h6v12M7.5 8h3M7.5 12h3M7.5 16h3M17 13h.5M17 17h.5M2 21h20" />,
  desert: (<><circle cx="16.5" cy="7.5" r="2.5" /><path d="M2 18.5c4-4 8-4 12 0M9.5 18c3.5-3.5 8.5-4 12.5-1M2 21h20" /></>),
  glass: <path d="M9 3h6l-.5 6.5a2.5 2.5 0 0 1-5 0zM12 12.5V20M9 21h6" />,
  plate: (<><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="3" /><path d="M2.5 4v6.5M4.5 4v6.5M2.5 8h2M3.5 10.5V20M21 4c-1.5 1-2 3.5-2 6.5h2V20" /></>),
  chair: <path d="M6.5 3v9h11V3M5 12h14v3H5zM6.5 15v6M17.5 15v6" />,
  flower: (<><circle cx="12" cy="8" r="2" /><path d="M12 6V3.5M12 10v11M14 8h2.5M7.5 8H10M13.4 6.6l1.8-1.8M8.8 11.2l1.8-1.8M13.4 9.4l1.8 1.8M8.8 4.8l1.8 1.8M12 17c-2.5-2.5-5-2.5-6-1.5 1.2 2.4 3.6 2.6 6 1.5zM12 15c2-2 4.2-2.2 5.5-1.2-1 2.2-3.3 2.4-5.5 1.2" /></>),
  balloon: <path d="M12 3a5.5 5.5 0 0 0-5.5 5.5C6.5 13 12 16.5 12 16.5s5.5-3.5 5.5-8A5.5 5.5 0 0 0 12 3zM11 18h2l-1-1.5zM12 18c0 2-2 2-2 3.5" />,
  camera: (<><path d="M3.5 7.5h3.5l2-3h6l2 3h3.5V19h-17z" /><circle cx="12" cy="13" r="3.5" /></>),
  music: (<><path d="M9 18V5.5l11-2V16" /><circle cx="6" cy="18" r="3" /><circle cx="17" cy="16" r="3" /></>),
  car: <path d="M3 13.5 5 7.5h14l2 6V18H3zM3 13.5h18M6.5 18v2.5M17.5 18v2.5M7 15.8h.01M17 15.8h.01" />,
  sparkle: <path d="M11 3l1.7 5.3L18 10l-5.3 1.7L11 17l-1.7-5.3L4 10l5.3-1.7zM18.5 15.5l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z" />,
  people: (<><circle cx="9" cy="8" r="3" /><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6M15.5 5.2a3 3 0 0 1 0 5.6M21 20c0-2.8-1.7-5.2-4.2-5.9" /></>),
  star: <path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z" />,
  clock: (<><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></>),
  shield: <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6zM9 12l2 2 4-4" />,
  leaf: <path d="M5 19C5 10 10 5 20 4c0 10-5 15-15 15zM5 19l8-8" />,
  calendar: <path d="M4 6h16v15H4zM4 10.5h16M8 3v4M16 3v4" />,
  key: (<><circle cx="15.5" cy="8.5" r="4.5" /><path d="M12.3 11.7 3 21M6.5 17.5l2 2M9 15l2 2" /></>),
  frame: <path d="M4 4h16v16H4zM4 15.5l5-5 5 5 2.5-2.5L20 16.5M15.5 8.5h.01" />,
  // UI
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  plus: <path d="M12 5v14M5 12h14" />,
  menu: <path d="M4 8h16M4 16h16" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  chevronLeft: <path d="m15 5-7 7 7 7" />,
  chevronRight: <path d="m9 5 7 7-7 7" />,
  phone: <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />,
  mail: <path d="M3 6h18v12H3zM3 7l9 6 9-6" />,
  instagram: (<><rect x="3.5" y="3.5" width="17" height="17" rx="5" /><circle cx="12" cy="12" r="4" /><path d="M17.3 6.7h.01" /></>),
  pin: (<><path d="M12 21s-7-6.1-7-11.5a7 7 0 0 1 14 0C19 14.9 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" /></>),
  download: <path d="M12 4v11M7 10l5 5 5-5M5 20h14" />,
  check: <path d="m5 12.5 4.5 4.5L19 7" />,
  users: (<><circle cx="9" cy="8" r="3" /><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6M16 11a3 3 0 1 0 0-6M21 20c0-3-2-5.5-5-6" /></>),
};

export function Icon({ name, size = 24, ...rest }: { name: string; size?: number } & SVGProps<SVGSVGElement>) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}
         strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...rest}>
      {P[name] ?? P.star}
    </svg>
  );
}

export function WhatsAppIcon({ size = 20, ...rest }: { size?: number } & SVGProps<SVGSVGElement>) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...rest}>
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm0 18.15h-.01a8.23 8.23 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.25-8.23 2.2 0 4.27.86 5.83 2.42a8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.22-8.24 8.22zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.11-.22-.17-.47-.29z" />
    </svg>
  );
}
