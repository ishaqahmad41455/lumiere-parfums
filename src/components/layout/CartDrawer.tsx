"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { X, Minus, Plus, Gift, Trash2 } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { formatPrice } from "@/lib/utils";

export function CartDrawer() {
  const { items, isOpen, close, removeItem, updateQuantity, toggleGiftWrap, subtotal } =
    useCartStore();
  const [coupon, setCoupon] = useState("");

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-[60] bg-noir/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          />
          <motion.aside
            className="glass fixed right-0 top-0 z-[61] flex h-full w-full max-w-md flex-col bg-cream/95 dark:bg-noir/95"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            role="dialog"
            aria-label="Shopping cart"
          >
            <div className="flex items-center justify-between border-b border-gold/20 p-6">
              <h2 className="font-display text-xl">Your Bag ({items.length})</h2>
              <button onClick={close} aria-label="Close cart">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <p className="mt-10 text-center text-sm text-noir/60 dark:text-cream/60">
                  Your bag is empty. Discover a signature scent.
                </p>
              ) : (
                <ul className="flex flex-col gap-6">
                  {items.map((item) => (
                    <li key={item.variantId} className="flex gap-4">
                      <div className="relative h-24 w-20 flex-shrink-0 overflow-hidden rounded-md bg-noir/5">
                        <Image src={item.image} alt={item.name} fill className="object-cover" sizes="80px" />
                      </div>
                      <div className="flex flex-1 flex-col gap-1">
                        <div className="flex justify-between">
                          <div>
                            <p className="eyebrow text-gold">{item.brand}</p>
                            <Link href={`/product/${item.slug}`} className="font-display text-sm">
                              {item.name}
                            </Link>
                            <p className="text-xs text-noir/50 dark:text-cream/50">{item.size}</p>
                          </div>
                          <button onClick={() => removeItem(item.variantId)} aria-label="Remove item">
                            <Trash2 size={15} />
                          </button>
                        </div>
                        <div className="mt-auto flex items-center justify-between">
                          <div className="flex items-center gap-2 rounded-full border border-gold/30 px-2 py-1">
                            <button
                              aria-label="Decrease quantity"
                              onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                            >
                              <Minus size={12} />
                            </button>
                            <span className="w-4 text-center text-xs">{item.quantity}</span>
                            <button
                              aria-label="Increase quantity"
                              onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                          <span className="text-sm">{formatPrice(item.price * item.quantity)}</span>
                        </div>
                        <button
                          onClick={() => toggleGiftWrap(item.variantId)}
                          className="mt-1 flex items-center gap-1 text-xs text-noir/60 dark:text-cream/60"
                        >
                          <Gift size={12} className={item.giftWrap ? "text-gold" : ""} />
                          {item.giftWrap ? "Gift wrapped" : "Add gift wrap"}
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-gold/20 p-6">
                <div className="mb-3 flex gap-2">
                  <input
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    placeholder="Coupon code"
                    className="glass-light flex-1 rounded-md px-3 py-2 text-sm outline-none"
                  />
                  <button className="rounded-md border border-gold px-4 text-sm text-gold">
                    Apply
                  </button>
                </div>
                <div className="mb-4 flex justify-between font-display text-lg">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal())}</span>
                </div>
                <Link
                  href="/checkout"
                  onClick={close}
                  className="block w-full rounded-full bg-gold py-3 text-center eyebrow text-noir transition hover:bg-gold-200"
                >
                  Checkout
                </Link>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
