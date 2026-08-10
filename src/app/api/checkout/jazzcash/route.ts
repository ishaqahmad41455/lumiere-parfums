import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { buildJazzCashPayload, JAZZCASH_ENDPOINT } from "@/lib/jazzcash";

export async function POST(req: NextRequest) {
  const session = await auth();
  const { items, shipping, total } = await req.json();

  if (!items?.length) {
    return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
  }

  // Same pattern as the Stripe route: create a PENDING order first, then
  // hand the customer off to JazzCash's hosted page for payment.
  const order = await prisma.order.create({
    data: {
      userId: session?.user ? (session.user as any).id : undefined,
      guestEmail: session?.user ? undefined : shipping?.email,
      subtotal: total,
      total,
      paymentProvider: "JAZZCASH",
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

  const returnUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/api/webhooks/jazzcash`;

  const payload = buildJazzCashPayload({
    amount: total,
    orderRefNum: order.id,
    description: `Lumière Parfums order ${order.orderNumber}`,
    returnUrl,
  });

  // The client posts these fields as a hidden auto-submitting form to
  // JazzCash's hosted checkout page (JazzCash doesn't support a plain
  // redirect URL — it requires an HTML form POST).
  return NextResponse.json({ endpoint: JAZZCASH_ENDPOINT, fields: payload, orderId: order.id });
}
