"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, Repeat } from "lucide-react";
import { useWishlistStore } from "@/store/wishlist-store";
import { useCompareStore } from "@/store/compare-store";
import { formatPrice, cn } from "@/lib/utils";
import type { Product } from "@/types";

export function ProductCard({ product }: { product: Product }) {
  const { has, toggle } = useWishlistStore();
  const { productIds, toggle: toggleCompare } = useCompareStore();
  const wishlisted = has(product.id);
  const compared = productIds.includes(product.id);
  const primary = product.images[0]?.url;
  const secondary = product.images[1]?.url ?? primary;

  return (
    <div className="group relative">
      <Link href={`/product/${product.slug}`} className="block" data-cursor-hover>
        <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-noir/5">
          {product.isNewArrival && (
            <span className="absolute left-3 top-3 z-10 rounded-full bg-gold px-3 py-1 text-[10px] eyebrow text-noir">
              New
            </span>
          )}
          {product.compareAtPrice && (
            <span className="absolute right-3 top-3 z-10 rounded-full bg-bordeaux px-3 py-1 text-[10px] eyebrow text-cream">
              Sale
            </span>
          )}
          {primary && (
            <>
              <Image
                src={primary}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover transition-opacity duration-500 group-hover:opacity-0"
              />
              <Image
                src={secondary}
                alt=""
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              />
            </>
          )}
        </div>
        <div className="mt-4">
          <p className="eyebrow text-gold">{product.brand.name}</p>
          <h3 className="font-display text-base">{product.name}</h3>
          <div className="mt-1 flex items-center gap-2 text-sm">
            <span>{formatPrice(product.price)}</span>
            {product.compareAtPrice && (
              <span className="text-noir/40 line-through dark:text-cream/40">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>
        </div>
      </Link>

      <div className="absolute right-3 top-14 flex flex-col gap-2 opacity-0 transition-opacity group-hover:opacity-100">
        <button
          aria-label="Toggle wishlist"
          onClick={() => toggle(product.id)}
          className="glass flex h-8 w-8 items-center justify-center rounded-full"
        >
          <Heart size={14} className={cn(wishlisted && "fill-gold text-gold")} />
        </button>
        <button
          aria-label="Toggle compare"
          onClick={() => toggleCompare(product.id)}
          className="glass flex h-8 w-8 items-center justify-center rounded-full"
        >
          <Repeat size={14} className={cn(compared && "text-gold")} />
        </button>
      </div>
    </div>
  );
}
