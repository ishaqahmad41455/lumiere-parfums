import Link from "next/link";

const COLUMNS = [
  {
    title: "Shop",
    links: [
      { label: "New Arrivals", href: "/shop?sort=newest" },
      { label: "Best Sellers", href: "/shop?sort=best-selling" },
      { label: "Limited Edition", href: "/shop?collection=limited-edition" },
      { label: "Gift Collection", href: "/shop?collection=gifts" },
      { label: "Offers", href: "/shop?discount=true" },
    ],
  },
  {
    title: "Help",
    links: [
      { label: "Contact Us", href: "/contact" },
      { label: "FAQs", href: "/faqs" },
      { label: "Order Tracking", href: "/account/orders" },
      { label: "Shipping Policy", href: "/shipping-policy" },
      { label: "Refund Policy", href: "/refund-policy" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Journal", href: "/blog" },
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms of Service", href: "/terms" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-gold/15 bg-noir text-cream">
      <div className="container grid grid-cols-2 gap-10 py-16 md:grid-cols-5">
        <div className="col-span-2">
          <p className="font-display text-2xl tracking-widest2">LUMIÈRE</p>
          <p className="mt-4 max-w-xs text-sm text-cream/60">
            Rare compositions, hand-finished bottles, and fragrance crafted
            for those who collect moments.
          </p>
          <form className="mt-6 flex max-w-sm gap-2">
            <label htmlFor="newsletter" className="sr-only">Email address</label>
            <input
              id="newsletter"
              type="email"
              required
              placeholder="Your email"
              className="glass flex-1 rounded-full px-4 py-2 text-sm outline-none placeholder:text-cream/40"
            />
            <button type="submit" className="rounded-full bg-gold px-5 text-sm text-noir">
              Join
            </button>
          </form>
        </div>

        {COLUMNS.map((col) => (
          <div key={col.title}>
            <p className="eyebrow text-gold">{col.title}</p>
            <ul className="mt-4 flex flex-col gap-2 text-sm text-cream/70">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="hover:text-gold">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="divider-gold" />

      <div className="container flex flex-col items-center justify-between gap-4 py-6 text-xs text-cream/50 md:flex-row">
        <p>© {new Date().getFullYear()} Lumière Parfums. All rights reserved.</p>
        <div className="flex gap-3">
          {["Visa", "Mastercard", "Amex", "PayPal", "Apple Pay", "Google Pay"].map((p) => (
            <span key={p} className="rounded border border-cream/20 px-2 py-1">{p}</span>
          ))}
        </div>
      </div>
    </footer>
  );
}
