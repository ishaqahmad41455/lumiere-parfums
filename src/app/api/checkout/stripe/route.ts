import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await auth();
  const { items, shipping, total } = await req.json();

  if (!items?.length) {
    return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
  }

  // Create the order record first (status PENDING) so we have something
  // to reconcile against once Stripe confirms payment via webhook.
  const order = await prisma.order.create({
    data: {
      userId: session?.user ? (session.user as any).id : undefined,
      guestEmail: session?.user ? undefined : shipping?.email,
      subtotal: total,
      total,
      paymentProvider: "STRIPE",
      items: {
        create: items.map((i: any) => ({
          productId: i.productId,
          variantId: i.variantId,
          name: i.name,
          size: i.size,
          price: i.price,
          quantity: i.quantity,
        })),
      },
    },
  });

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    customer_email: shipping?.email,
    line_items: items.map((i: any) => ({
      price_data: {
        currency: "usd",
        product_data: { name: `${i.name} — ${i.size}` },
        unit_amount: Math.round(i.price * 100),
      },
      quantity: i.quantity,
    })),
    metadata: { orderId: order.id },
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/account/orders?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout`,
  });

  return NextResponse.json({ url: checkoutSession.url, orderId: order.id });
}
