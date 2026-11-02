"use client";
import { useState } from "react";
import { Icon } from "./Icon";
import type { Faq } from "@/lib/types";

/** FAQ: bir vaqtda faqat bitta savol ochiq turadi, yumshoq ochilib-yopiladi. */
export function FaqAccordion({ items }: { items: Faq[] }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="divide-y divide-line">
      {items.map((f, i) => {
        const isOpen = open === i;
        const id = `faq-${i}`;
        return (
          <div key={f.q} className="reveal">
            <h3 className="font-sans text-[17px] font-semibold tracking-normal">
              <button type="button" aria-expanded={isOpen} aria-controls={id} onClick={() => setOpen(isOpen ? null : i)}
                      className="flex w-full items-start justify-between gap-6 py-5 text-left">
                {f.q}
                <Icon name="plus" size={22} className={`mt-0.5 shrink-0 text-gold transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`} />
              </button>
            </h3>
            <div id={id} role="region"
                 className={`grid transition-[grid-template-rows] duration-300 ease-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
              <div className="overflow-hidden">
                <p className="pb-6 pr-10 text-[15px] leading-relaxed text-ink-muted">{f.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
