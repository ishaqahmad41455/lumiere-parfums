import type { Metadata } from "next";

export const metadata: Metadata = { title: "Contact Us" };

export default function ContactPage() {
  return (
    <div className="container grid gap-12 pt-32 pb-24 md:grid-cols-2">
      <div>
        <h1 className="font-display text-4xl">Get in Touch</h1>
        <p className="mt-4 max-w-md text-noir/70 dark:text-cream/70">
          Our fragrance concierge is available Monday–Saturday, 9am–7pm CET,
          for scent recommendations, order support, and gifting advice.
        </p>
        <div className="mt-8 flex flex-col gap-2 text-sm">
          <p>Email: concierge@lumiere-parfums.com</p>
          <p>Phone: +33 1 23 45 67 89</p>
          <p>WhatsApp: +33 6 12 34 56 78</p>
        </div>
      </div>
      <form className="glass-light flex flex-col gap-4 rounded-lg p-8">
        <input placeholder="Name" required className="glass-light rounded-md px-3 py-2" />
        <input type="email" placeholder="Email" required className="glass-light rounded-md px-3 py-2" />
        <textarea placeholder="Message" required rows={5} className="glass-light rounded-md px-3 py-2" />
        <button type="submit" className="rounded-full bg-gold py-3 eyebrow text-noir">
          Send Message
        </button>
      </form>
    </div>
  );
}
