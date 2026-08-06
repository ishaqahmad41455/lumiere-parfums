"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useCompareStore } from "@/store/compare-store";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types";

const ROWS: [string, (p: Product) => string | number][] = [
  ["Brand", (p) => p.brand.name],
  ["Price", (p) => formatPrice(p.price)],
  ["Concentration", (p) => p.concentration.replaceAll("_", " ")],
  ["Longevity", (p) => `${p.longevity}/10`],
  ["Projection", (p) => `${p.projection}/10`],
  ["Gender", (p) => p.gender],
  ["Top Notes", (p) => p.topNotes.join(", ")],
  ["Rating", (p) => `${p.avgRating.toFixed(1)} (${p.reviewCount})`],
];

export default function ComparePage() {
  const { productIds } = useCompareStore();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (productIds.length === 0) return setProducts([]);
    fetch(`/api/products?ids=${productIds.join(",")}`)
      .then((r) => r.json())
      .then((data) => setProducts(data.products ?? []));
  }, [productIds]);

  if (products.length === 0) {
    return (
      <div className="container pt-32 pb-24 text-center">
        <h1 className="font-display text-3xl">Compare Fragrances</h1>
        <p className="mt-4 text-noir/60 dark:text-cream/60">
          Add up to 4 fragrances from the shop to compare notes, price, and performance.
        </p>
      </div>
    );
  }

  return (
    <div className="container overflow-x-auto pt-32 pb-24">
      <h1 className="mb-10 font-display text-3xl">Compare Fragrances</h1>
      <table className="w-full min-w-[600px] border-collapse text-sm">
        <thead>
          <tr>
            <th className="w-40" />
            {products.map((p) => (
              <th key={p.id} className="p-4 text-left">
                <div className="relative mb-2 h-32 w-24 overflow-hidden rounded-md bg-noir/5">
                  {p.images[0] && <Image src={p.images[0].url} alt={p.name} fill className="object-cover" />}
                </div>
                <p className="font-display">{p.name}</p>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ROWS.map(([label, getter]) => (
            <tr key={label} className="border-t border-gold/10">
              <td className="p-4 eyebrow text-gold">{label}</td>
              {products.map((p) => (
                <td key={p.id} className="p-4">{getter(p)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
