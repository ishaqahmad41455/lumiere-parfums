import Link from "next/link";
import Image from "next/image";

const COLLECTIONS = [
  { name: "Women", href: "/shop?gender=WOMEN", image: "/images/collection-women.jpg" },
  { name: "Men", href: "/shop?gender=MEN", image: "/images/collection-men.jpg" },
  { name: "Unisex", href: "/shop?gender=UNISEX", image: "/images/collection-unisex.jpg" },
  { name: "Limited Edition", href: "/shop?collection=limited-edition", image: "/images/collection-limited.jpg" },
];

export function FeaturedCollections() {
  return (
    <section className="container py-20">
      <p className="eyebrow text-center text-gold">Curated For You</p>
      <h2 className="mt-2 text-center font-display text-3xl md:text-4xl">Shop by Collection</h2>
      <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4">
        {COLLECTIONS.map((c) => (
          <Link
            key={c.name}
            href={c.href}
            className="group relative aspect-[3/4] overflow-hidden rounded-lg"
            data-cursor-hover
          >
            <Image
              src={c.image}
              alt={c.name}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-noir/70 via-noir/10 to-transparent" />
            <span className="absolute bottom-5 left-5 font-display text-xl text-cream">
              {c.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
