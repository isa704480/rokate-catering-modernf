import type { ReactNode, SVGProps } from "react";
import { Icon } from "@/components/Icon";

/** Admin uchun qo'shimcha ikonlar (qolganlari sayt ikonlaridan olinadi). */
const P: Record<string, ReactNode> = {
  inbox: <path d="M3 13h5l1.5 3h5L16 13h5M3 13l2.5-8h13L21 13v6H3z" />,
  handshake: <path d="M2 11l4-4 4 2 3-2 3 1 6 5-3 3-4-3-3 2-4-2-3 3zM9 15l2 2M12 14l2 2" />,
  settings: (<><circle cx="12" cy="12" r="3" /><path d="M12 2.5v3M12 18.5v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2.5 12h3M18.5 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" /></>),
  home: <path d="M3 11.5 12 4l9 7.5M5.5 10v10h13V10M10 20v-5h4v5" />,
  help: (<><circle cx="12" cy="12" r="9" /><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6v.6M12 17h.01" /></>),
  file: <path d="M6 3h8l4 4v14H6zM14 3v4h4M9 12h6M9 16h6" />,
  gift: <path d="M4 10h16v11H4zM3 7h18v3H3zM12 7v14M12 7S10.5 3 8 3.5 7.5 7 12 7zM12 7s1.5-4 4-3.5S16.5 7 12 7" />,
  tag: <path d="M3 12V4h8l10 10-8 8zM7.5 8h.01" />,
  book: <path d="M4 5a2 2 0 0 1 2-2h13v15H6a2 2 0 0 0-2 2zM4 20a2 2 0 0 0 2 2h13v-4" />,
  pdf: <path d="M6 3h8l4 4v14H6zM14 3v4h4M8.5 15.5h1.5a1.25 1.25 0 0 0 0-2.5H8.5V18M13 13v5h1a2.5 2.5 0 0 0 0-5z" />,
  photo: (<><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="9" cy="10" r="2" /><path d="m21 16-5-5-9 9" /></>),
  logout: <path d="M15 4h4v16h-4M10 8l-4 4 4 4M6 12h10" />,
  external: <path d="M14 4h6v6M20 4l-9 9M18 14v6H4V6h6" />,
  search: (<><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>),
  trash: <path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v6M14 11v6" />,
  upload: <path d="M12 16V4M7 9l5-5 5 5M4 16v4h16v-4" />,
  save: <path d="M5 4h11l3 3v13H5zM8 4v5h7V4M8 20v-6h8v6" />,
  up: <path d="m6 15 6-6 6 6" />,
  down: <path d="m6 9 6 6 6-6" />,
  lock: (<><rect x="5" y="10" width="14" height="10" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></>),
  dashboard: <path d="M3 3h8v10H3zM13 3h8v6h-8zM13 11h8v10h-8zM3 15h8v6H3z" />,
  download2: <path d="M12 4v12M7 11l5 5 5-5M4 20h16" />,
  users2: (<><circle cx="9" cy="8" r="3" /><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6M16 11a3 3 0 1 0 0-6M21 20c0-3-2-5.5-5-6" /></>),
};

export function AIcon({ name, size = 20, ...rest }: { name: string; size?: number } & SVGProps<SVGSVGElement>) {
  if (!P[name]) return <Icon name={name} size={size} {...rest} />;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}
         strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...rest}>
      {P[name]}
    </svg>
  );
}
