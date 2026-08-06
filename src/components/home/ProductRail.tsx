import type { Product } from "@/types";
import { ProductCard } from "@/components/product/ProductCard";

export function ProductRail({
  title,
  subtitle,
  products,
}: {
  title: string;
  subtitle?: string;
  products: Product[];
}) {
  if (!products.length) return null;

  return (
    <section className="container py-20">
      <div className="mb-10 flex items-end justify-between">
        <div>
          <p className="eyebrow text-gold">{subtitle}</p>
          <h2 className="font-display text-3xl md:text-4xl">{title}</h2>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
