import { Hero } from "@/components/home/Hero";
import { FeaturedCollections } from "@/components/home/FeaturedCollections";
import { ProductRail } from "@/components/home/ProductRail";
import { getBestSellers, getNewArrivals } from "@/lib/products";
import Image from "next/image";

export default async function HomePage() {
  const [bestSellers, newArrivals] = await Promise.all([
    getBestSellers(8),
    getNewArrivals(8),
  ]);

  return (
    <>
      <Hero />

      <ProductRail title="Best Sellers" subtitle="The Icons" products={bestSellers} />

      <section className="relative overflow-hidden bg-noir py-24 text-cream">
        <div className="container grid items-center gap-12 md:grid-cols-2">
          <div className="relative aspect-square overflow-hidden rounded-lg">
            <Image src="/images/atelier.jpg" alt="The Lumière atelier" fill className="object-cover" sizes="50vw" />
          </div>
          <div>
            <p className="eyebrow text-gold">Since 1998</p>
            <h2 className="mt-3 font-display text-4xl md:text-5xl">
              Crafted in small batches, by hand.
            </h2>
            <p className="mt-6 max-w-md text-cream/70">
              Every Lumière bottle is blown by third-generation glassworkers
              in Grasse, then filled in numbered batches of 500. What you
              hold is not mass production — it is provenance.
            </p>
            <a href="/about" className="mt-8 inline-block eyebrow text-gold underline underline-offset-8">
              Our Story
            </a>
          </div>
        </div>
      </section>

      <FeaturedCollections />

      <ProductRail title="New Arrivals" subtitle="Just Landed" products={newArrivals} />

      <section className="container py-24 text-center">
        <p className="eyebrow text-gold">Join The House</p>
        <h2 className="mx-auto mt-3 max-w-xl font-display text-3xl md:text-4xl">
          Early access to limited releases, private sales, and scent journal essays.
        </h2>
        <form className="mx-auto mt-8 flex max-w-md gap-2">
          <label htmlFor="home-newsletter" className="sr-only">Email</label>
          <input
            id="home-newsletter"
            type="email"
            required
            placeholder="Your email address"
            className="glass-light flex-1 rounded-full px-5 py-3 text-sm outline-none"
          />
          <button className="rounded-full bg-gold px-6 text-sm text-noir">Subscribe</button>
        </form>
      </section>
    </>
  );
}
