"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQS = [
  { q: "How long does shipping take?", a: "Standard shipping takes 3–5 business days domestically and 7–14 days internationally." },
  { q: "Are your fragrances cruelty-free?", a: "Yes. Lumière Parfums never tests on animals and is certified by Leaping Bunny." },
  { q: "Can I return an opened bottle?", a: "We accept returns on bottles used up to 14% of volume within 30 days of delivery." },
  { q: "Do you ship internationally?", a: "Yes, we ship to over 60 countries. Duties and taxes are calculated at checkout." },
  { q: "How should I store my perfume?", a: "Keep bottles away from direct sunlight and heat, ideally in the box they arrived in." },
];

export default function FaqsPage() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="container max-w-2xl pt-32 pb-24">
      <h1 className="mb-10 text-center font-display text-4xl">Frequently Asked Questions</h1>
      <div className="flex flex-col divide-y divide-gold/10">
        {FAQS.map((item, i) => (
          <div key={item.q}>
            <button
              className="flex w-full items-center justify-between py-5 text-left"
              onClick={() => setOpen(open === i ? null : i)}
              aria-expanded={open === i}
            >
              <span className="font-display">{item.q}</span>
              <ChevronDown className={`transition-transform ${open === i ? "rotate-180" : ""}`} size={18} />
            </button>
            {open === i && (
              <p className="pb-5 text-sm text-noir/70 dark:text-cream/70">{item.a}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
