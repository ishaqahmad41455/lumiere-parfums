import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

const PAYPAL_API =
  process.env.PAYPAL_ENV === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";

async function getPayPalAccessToken() {
  const auth64 = Buffer.from(
    `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
  ).toString("base64");

  const res = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth64}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  const data = await res.json();
  return data.access_token as string;
}

export async function POST(req: NextRequest) {
  const session = await auth();
  const { items, shipping, total } = await req.json();

  const order = await prisma.order.create({
    data: {
      userId: session?.user ? (session.user as any).id : undefined,
      guestEmail: session?.user ? undefined : shipping?.email,
      subtotal: total,
      total,
      paymentProvider: "PAYPAL",
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

  const accessToken = await getPayPalAccessToken();

  const ppOrder = await fetch(`${PAYPAL_API}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          reference_id: order.id,
          amount: { currency_code: "USD", value: total.toFixed(2) },
        },
      ],
    }),
  }).then((r) => r.json());

  return NextResponse.json({ id: ppOrder.id, orderId: order.id });
}
