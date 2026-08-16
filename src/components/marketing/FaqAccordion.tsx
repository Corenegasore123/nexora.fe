"use client";

import { useId, useState } from "react";
import { Icon } from "@/components/icons/Icon";

export function FaqAccordion({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  const baseId = useId();

  return (
    <div className="faq-list">
      {items.map((item, i) => {
        const isOpen = open === i;
        const panelId = `${baseId}-panel-${i}`;
        const buttonId = `${baseId}-button-${i}`;

        return (
          <div key={item.q} className={`faq-item ${isOpen ? "faq-item-open" : ""}`}>
            <button
              id={buttonId}
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              className="faq-trigger"
              aria-expanded={isOpen}
              aria-controls={panelId}
            >
              <span className="faq-index">{String(i + 1).padStart(2, "0")}</span>
              <span className="faq-question">{item.q}</span>
              <span className="faq-chevron" aria-hidden>
                <Icon name="chevron-down" size={18} />
              </span>
            </button>

            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              className={`faq-panel ${isOpen ? "faq-panel-open" : ""}`}
            >
              <div className="faq-panel-inner">
                <div className="faq-panel-body">
                  <p>{item.a}</p>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
