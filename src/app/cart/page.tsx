"use client";

import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/store/cart-store";
import { formatPrice } from "@/lib/utils";

export default function CartPage() {
  const { items, updateQuantity, removeItem, subtotal } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="container flex flex-col items-center justify-center gap-4 pt-40 pb-24 text-center">
        <h1 className="font-display text-3xl">Your bag is empty</h1>
        <p className="text-noir/60 dark:text-cream/60">Discover a fragrance worth keeping.</p>
        <Link href="/shop" className="mt-4 rounded-full bg-gold px-8 py-3 eyebrow text-noir">
          Shop Now
        </Link>
      </div>
    );
  }

  const shipping = subtotal() > 150 ? 0 : 12;
  const tax = subtotal() * 0.08;
  const total = subtotal() + shipping + tax;

  return (
    <div className="container grid gap-12 pt-32 pb-24 md:grid-cols-[1fr_360px]">
      <div>
        <h1 className="mb-8 font-display text-3xl">Your Bag</h1>
        <ul className="flex flex-col gap-6">
          {items.map((item) => (
            <li key={item.variantId} className="flex gap-4 border-b border-gold/10 pb-6">
              <div className="relative h-28 w-24 flex-shrink-0 overflow-hidden rounded-md bg-noir/5">
                <Image src={item.image} alt={item.name} fill className="object-cover" sizes="96px" />
              </div>
              <div className="flex flex-1 flex-col justify-between">
                <div className="flex justify-between">
                  <div>
                    <p className="eyebrow text-gold">{item.brand}</p>
                    <p className="font-display">{item.name}</p>
                    <p className="text-xs text-noir/50 dark:text-cream/50">{item.size}</p>
                  </div>
                  <button onClick={() => removeItem(item.variantId)} className="text-xs underline">
                    Remove
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 rounded-full border border-gold/30 px-3 py-1">
                    <button onClick={() => updateQuantity(item.variantId, item.quantity - 1)}>−</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.variantId, item.quantity + 1)}>+</button>
                  </div>
                  <span>{formatPrice(item.price * item.quantity)}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <aside className="glass-light h-fit rounded-lg p-6">
        <h2 className="mb-4 font-display text-xl">Order Summary</h2>
        <div className="flex flex-col gap-2 text-sm">
          <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(subtotal())}</span></div>
          <div className="flex justify-between"><span>Shipping</span><span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span></div>
          <div className="flex justify-between"><span>Estimated Tax</span><span>{formatPrice(tax)}</span></div>
        </div>
        <div className="divider-gold my-4" />
        <div className="mb-6 flex justify-between font-display text-lg">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
        <Link href="/checkout" className="block w-full rounded-full bg-gold py-3 text-center eyebrow text-noir">
          Proceed to Checkout
        </Link>
      </aside>
    </div>
  );
}
