"use client";

import { useState } from "react";
import type { Faq as FaqItem } from "@/lib/types";

/** Bir vaqtda faqat bitta savol ochiq turadi. */
export default function Faq({ items, title }: { items: FaqItem[]; title: string }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="grid gap-8 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.4fr)] md:gap-14">
      <h2 className="h2">{title}</h2>
      <ul className="min-w-0">
        {items.map((f, i) => {
          const isOpen = open === i;
          return (
            <li key={f.q} className="border-t border-line last:border-b">
              <h3>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-${i}`}
                  className="flex w-full items-start justify-between gap-5 py-5 text-left"
                >
                  <span className="text-[16px] font-semibold md:text-[17px]">{f.q}</span>
                  <span
                    className={`mt-1 shrink-0 transition-transform duration-200 ${isOpen ? "rotate-45" : ""}`}
                    aria-hidden="true"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M8 1v14M1 8h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </span>
                </button>
              </h3>
              <div id={`faq-${i}`} hidden={!isOpen}>
                <p className="body pb-5 pr-8 text-[15px]">{f.a}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
