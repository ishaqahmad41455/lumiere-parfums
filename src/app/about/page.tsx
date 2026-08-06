import type { Metadata } from "next";

export const metadata: Metadata = { title: "About Us" };

export default function AboutPage() {
  return (
    <div className="pt-28">
      <section className="container py-20 text-center">
        <p className="eyebrow text-gold">Est. 1998, Grasse, France</p>
        <h1 className="mx-auto mt-4 max-w-2xl font-display text-4xl md:text-5xl">
          Fragrance is the only art form you wear.
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-noir/70 dark:text-cream/70">
          Lumière Parfums was founded by a single perfumer with one belief:
          scent should be as considered as anything else you choose to put
          on your body. Every formula is composed in-house, tested for over
          a year, and released in numbered batches that will never be
          reformulated.
        </p>
      </section>

      <section className="container grid gap-10 py-20 md:grid-cols-3">
        {[
          ["Sourced Rarely", "Oud from Assam, orris root aged five years, saffron hand-picked in Herat."],
          ["Blended Slowly", "Each formula macerates for a minimum of six weeks before bottling."],
          ["Bottled Honestly", "No parabens, no phthalates, full ingredient disclosure on every listing."],
        ].map(([title, body]) => (
          <div key={title} className="glass-light rounded-lg p-8 text-center">
            <h2 className="font-display text-xl">{title}</h2>
            <p className="mt-3 text-sm text-noir/70 dark:text-cream/70">{body}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
