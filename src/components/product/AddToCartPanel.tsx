"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Heart, Truck } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";
import { formatPrice, cn } from "@/lib/utils";
import type { Product } from "@/types";

export function AddToCartPanel({ product }: { product: Product }) {
  const [variantId, setVariantId] = useState(product.variants[0]?.id);
  const [qty, setQty] = useState(1);
  const addItem = useCartStore((s) => s.addItem);
  const { has, toggle } = useWishlistStore();
  const router = useRouter();
  const variant = product.variants.find((v) => v.id === variantId) ?? product.variants[0];

  function handleAdd() {
    if (!variant) return;
    addItem({
      productId: product.id,
      variantId: variant.id,
      name: product.name,
      slug: product.slug,
      brand: product.brand.name,
      size: variant.size,
      price: variant.price,
      image: product.images[0]?.url ?? "",
      quantity: qty,
    });
  }

  function handleBuyNow() {
    handleAdd();
    router.push("/checkout");
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="eyebrow text-gold">{product.brand.name}</p>
        <h1 className="font-display text-4xl">{product.name}</h1>
        <div className="mt-2 flex items-center gap-2 text-sm">
          <span>{"★".repeat(Math.round(product.avgRating))}</span>
          <span className="text-noir/50 dark:text-cream/50">
            ({product.reviewCount} reviews)
          </span>
        </div>
      </div>

      <div className="flex items-baseline gap-3">
        <span className="text-2xl">{formatPrice(variant?.price ?? product.price)}</span>
        {product.compareAtPrice && (
          <span className="text-noir/40 line-through dark:text-cream/40">
            {formatPrice(product.compareAtPrice)}
          </span>
        )}
      </div>

      <p className="max-w-prose text-sm leading-relaxed text-noir/70 dark:text-cream/70">
        {product.description}
      </p>

      <div>
        <p className="eyebrow mb-2 text-gold">Size</p>
        <div className="flex gap-2">
          {product.variants.map((v) => (
            <button
              key={v.id}
              onClick={() => setVariantId(v.id)}
              disabled={v.stock === 0}
              className={cn(
                "rounded-full border px-4 py-2 text-sm transition disabled:opacity-30",
                variantId === v.id ? "border-gold bg-gold text-noir" : "border-noir/20 dark:border-cream/20"
              )}
            >
              {v.size}
            </button>
          ))}
        </div>
        {variant && variant.stock <= 5 && variant.stock > 0 && (
          <p className="mt-2 text-xs text-bordeaux">Only {variant.stock} left in stock</p>
        )}
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 rounded-full border border-gold/30 px-3 py-2">
          <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity">−</button>
          <span className="w-4 text-center">{qty}</span>
          <button onClick={() => setQty((q) => q + 1)} aria-label="Increase quantity">+</button>
        </div>
        <button
          onClick={handleAdd}
          disabled={!variant || variant.stock === 0}
          className="flex-1 rounded-full bg-noir py-3 eyebrow text-cream transition hover:opacity-90 disabled:opacity-40 dark:bg-cream dark:text-noir"
        >
          {variant?.stock === 0 ? "Out of Stock" : "Add to Bag"}
        </button>
        <button
          aria-label="Toggle wishlist"
          onClick={() => toggle(product.id)}
          className="glass flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full"
        >
          <Heart size={18} className={cn(has(product.id) && "fill-gold text-gold")} />
        </button>
      </div>

      <button
        onClick={handleBuyNow}
        className="rounded-full border border-gold py-3 eyebrow text-gold transition hover:bg-gold hover:text-noir"
      >
        Buy Now
      </button>

      <div className="flex items-center gap-2 text-xs text-noir/60 dark:text-cream/60">
        <Truck size={14} />
        Estimated delivery in 3–5 business days
      </div>
    </div>
  );
}
