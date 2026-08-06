import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartLine } from "@/types";

interface CartState {
  items: CartLine[];
  isOpen: boolean;
  couponCode: string | null;
  discountPercent: number;
  open: () => void;
  close: () => void;
  addItem: (item: CartLine) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  toggleGiftWrap: (variantId: string) => void;
  applyCoupon: (code: string, discountPercent: number) => void;
  clearCoupon: () => void;
  clear: () => void;
  subtotal: () => number;
  itemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      couponCode: null,
      discountPercent: 0,

      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),

      addItem: (item) =>
        set((state) => {
          const existing = state.items.find((i) => i.variantId === item.variantId);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.variantId === item.variantId
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
              isOpen: true,
            };
          }
          return { items: [...state.items, item], isOpen: true };
        }),

      removeItem: (variantId) =>
        set((state) => ({ items: state.items.filter((i) => i.variantId !== variantId) })),

      updateQuantity: (variantId, quantity) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.variantId === variantId ? { ...i, quantity: Math.max(1, quantity) } : i
          ),
        })),

      toggleGiftWrap: (variantId) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.variantId === variantId ? { ...i, giftWrap: !i.giftWrap } : i
          ),
        })),

      applyCoupon: (code, discountPercent) => set({ couponCode: code, discountPercent }),
      clearCoupon: () => set({ couponCode: null, discountPercent: 0 }),
      clear: () => set({ items: [], couponCode: null, discountPercent: 0 }),

      subtotal: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
      itemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    { name: "lumiere-cart" }
  )
);
