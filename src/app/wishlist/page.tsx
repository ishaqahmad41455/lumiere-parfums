"use client";

import { useEffect, useState } from "react";
import { useWishlistStore } from "@/store/wishlist-store";
import { ProductCard } from "@/components/product/ProductCard";
import type { Product } from "@/types";

export default function WishlistPage() {
  const { productIds } = useWishlistStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (productIds.length === 0) {
      setProducts([]);
      setLoading(false);
      return;
    }
    fetch(`/api/products?ids=${productIds.join(",")}`)
      .then((r) => r.json())
      .then((data) => setProducts(data.products ?? []))
      .finally(() => setLoading(false));
  }, [productIds]);

  return (
    <div className="container pt-32 pb-24">
      <h1 className="mb-10 font-display text-3xl">Your Wishlist</h1>
      {loading ? (
        <p className="text-noir/50 dark:text-cream/50">Loading...</p>
      ) : products.length === 0 ? (
        <p className="text-noir/60 dark:text-cream/60">
          Nothing saved yet. Tap the heart on any fragrance to keep it here.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
