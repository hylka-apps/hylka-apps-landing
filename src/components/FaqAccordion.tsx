"use client";
import { useState } from "react";
import "./FaqAccordion.css";

type FaqItem = { q: string; a: string };

export default function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="faq-accordion">
      {items.map((item, i) => (
        <div key={i} className={`faq-item${open === i ? " open" : ""}`}>
          <button
            className="faq-q"
            onClick={() => setOpen(open === i ? null : i)}
            aria-expanded={open === i}
          >
            <span>{item.q}</span>
            <span className="faq-pm" aria-hidden="true" />
          </button>
          <div className="faq-a" aria-hidden={open !== i}>
            <p>{item.a}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
