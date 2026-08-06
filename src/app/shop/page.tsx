import { getShopProducts } from "@/lib/products";
import { ProductCard } from "@/components/product/ProductCard";
import { ShopFilters } from "@/components/shop/ShopFilters";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop All Fragrances",
  description: "Browse the full Lumière Parfums collection — men's, women's, and unisex luxury fragrance.",
};

interface PageProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

export default async function ShopPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const { products, total } = await getShopProducts({
    gender: sp.gender,
    season: sp.season,
    sort: sp.sort,
    minPrice: sp.minPrice ? Number(sp.minPrice) : undefined,
    maxPrice: sp.maxPrice ? Number(sp.maxPrice) : undefined,
    page: sp.page ? Number(sp.page) : 1,
  });

  return (
    <div className="container grid gap-10 pt-32 pb-24 md:grid-cols-[240px_1fr]">
      <ShopFilters />
      <div>
        <div className="mb-8 flex items-baseline justify-between">
          <h1 className="font-display text-3xl">All Fragrances</h1>
          <p className="text-sm text-noir/50 dark:text-cream/50">{total} results</p>
        </div>
        {products.length === 0 ? (
          <p className="text-noir/60 dark:text-cream/60">
            No fragrances match those filters yet. Try widening your search.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-6 md:grid-cols-3">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
