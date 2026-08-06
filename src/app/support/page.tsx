import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Support" };

const TOPICS = [
  { title: "Order Tracking", href: "/account/orders", desc: "Check the status of a recent order." },
  { title: "Returns & Refunds", href: "/refund-policy", desc: "Learn how to return or exchange a bottle." },
  { title: "Shipping Info", href: "/shipping-policy", desc: "Rates, timelines, and international delivery." },
  { title: "FAQs", href: "/faqs", desc: "Answers to the questions we hear most." },
  { title: "Contact Concierge", href: "/contact", desc: "Talk to a real person about anything else." },
];

export default function SupportPage() {
  return (
    <div className="container pt-32 pb-24">
      <h1 className="mb-10 text-center font-display text-4xl">How Can We Help?</h1>
      <div className="mx-auto grid max-w-3xl gap-4 md:grid-cols-2">
        {TOPICS.map((t) => (
          <Link key={t.title} href={t.href} className="glass-light rounded-lg p-6 transition hover:border-gold">
            <p className="font-display text-lg">{t.title}</p>
            <p className="mt-1 text-sm text-noir/60 dark:text-cream/60">{t.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
