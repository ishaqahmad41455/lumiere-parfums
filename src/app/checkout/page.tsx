"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCartStore } from "@/store/cart-store";
import { formatPrice } from "@/lib/utils";

const shippingSchema = z.object({
  email: z.string().email("Enter a valid email"),
  fullName: z.string().min(2, "Enter your full name"),
  line1: z.string().min(3, "Enter your address"),
  city: z.string().min(1, "Enter your city"),
  postalCode: z.string().min(3, "Enter a postal code"),
  country: z.string().min(2, "Select a country"),
  phone: z.string().min(6, "Enter a phone number"),
});

type ShippingForm = z.infer<typeof shippingSchema>;

const STEPS = ["Shipping", "Payment", "Review"] as const;

export default function CheckoutPage() {
  const [step, setStep] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "paypal">("stripe");
  const { items, subtotal, clear } = useCartStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<ShippingForm>({ resolver: zodResolver(shippingSchema) });

  const shipping = subtotal() > 150 ? 0 : 12;
  const tax = subtotal() * 0.08;
  const total = subtotal() + shipping + tax;

  async function placeOrder() {
    // In production this calls /api/checkout/stripe or /api/checkout/paypal
    // to create a PaymentIntent / Order, then confirms payment client-side.
    const res = await fetch("/api/checkout/" + paymentMethod, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items, shipping: getValues(), total }),
    });
    if (res.ok) {
      clear();
      window.location.href = "/account/orders";
    }
  }

  return (
    <div className="container grid gap-12 pt-32 pb-24 md:grid-cols-[1fr_360px]">
      <div>
        <ol className="mb-10 flex gap-6">
          {STEPS.map((s, i) => (
            <li key={s} className={`eyebrow ${i === step ? "text-gold" : "text-noir/40 dark:text-cream/40"}`}>
              {i + 1}. {s}
            </li>
          ))}
        </ol>

        {step === 0 && (
          <form
            onSubmit={handleSubmit(() => setStep(1))}
            className="grid max-w-lg gap-4"
          >
            <div>
              <label className="mb-1 block text-sm">Email</label>
              <input {...register("email")} className="glass-light w-full rounded-md px-3 py-2" />
              {errors.email && <p className="mt-1 text-xs text-bordeaux">{errors.email.message}</p>}
            </div>
            <div>
              <label className="mb-1 block text-sm">Full Name</label>
              <input {...register("fullName")} className="glass-light w-full rounded-md px-3 py-2" />
              {errors.fullName && <p className="mt-1 text-xs text-bordeaux">{errors.fullName.message}</p>}
            </div>
            <div>
              <label className="mb-1 block text-sm">Address</label>
              <input {...register("line1")} className="glass-light w-full rounded-md px-3 py-2" />
              {errors.line1 && <p className="mt-1 text-xs text-bordeaux">{errors.line1.message}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm">City</label>
                <input {...register("city")} className="glass-light w-full rounded-md px-3 py-2" />
              </div>
              <div>
                <label className="mb-1 block text-sm">Postal Code</label>
                <input {...register("postalCode")} className="glass-light w-full rounded-md px-3 py-2" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm">Country</label>
                <input {...register("country")} className="glass-light w-full rounded-md px-3 py-2" />
              </div>
              <div>
                <label className="mb-1 block text-sm">Phone</label>
                <input {...register("phone")} className="glass-light w-full rounded-md px-3 py-2" />
              </div>
            </div>
            <button type="submit" className="mt-4 rounded-full bg-gold py-3 eyebrow text-noir">
              Continue to Payment
            </button>
          </form>
        )}

        {step === 1 && (
          <div className="max-w-lg">
            <div className="flex flex-col gap-3">
              {(["stripe", "paypal"] as const).map((m) => (
                <label
                  key={m}
                  className={`glass-light flex cursor-pointer items-center justify-between rounded-md px-4 py-3 ${
                    paymentMethod === m ? "border border-gold" : ""
                  }`}
                >
                  <span className="capitalize">{m === "stripe" ? "Credit / Debit Card (Stripe)" : "PayPal"}</span>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === m}
                    onChange={() => setPaymentMethod(m)}
                  />
                </label>
              ))}
            </div>
            <p className="mt-3 text-xs text-noir/50 dark:text-cream/50">
              Apple Pay and Google Pay are available automatically at checkout when
              supported by your browser and card network via Stripe.
            </p>
            <button onClick={() => setStep(2)} className="mt-6 rounded-full bg-gold px-8 py-3 eyebrow text-noir">
              Review Order
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="max-w-lg">
            <p className="mb-4 text-sm text-noir/60 dark:text-cream/60">
              Confirm your details and place your order. You'll receive an email
              confirmation immediately after payment succeeds.
            </p>
            <button onClick={placeOrder} className="rounded-full bg-gold px-8 py-3 eyebrow text-noir">
              Place Order — {formatPrice(total)}
            </button>
          </div>
        )}
      </div>

      <aside className="glass-light h-fit rounded-lg p-6">
        <h2 className="mb-4 font-display text-xl">Order Summary</h2>
        <ul className="mb-4 flex flex-col gap-3 text-sm">
          {items.map((item) => (
            <li key={item.variantId} className="flex justify-between">
              <span>{item.name} × {item.quantity}</span>
              <span>{formatPrice(item.price * item.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="divider-gold my-4" />
        <div className="flex flex-col gap-2 text-sm">
          <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(subtotal())}</span></div>
          <div className="flex justify-between"><span>Shipping</span><span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span></div>
          <div className="flex justify-between"><span>Tax</span><span>{formatPrice(tax)}</span></div>
        </div>
        <div className="divider-gold my-4" />
        <div className="flex justify-between font-display text-lg">
          <span>Total</span><span>{formatPrice(total)}</span>
        </div>
      </aside>
    </div>
  );
}
