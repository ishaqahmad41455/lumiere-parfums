import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { buildEasyPaisaPayload, EASYPAISA_ENDPOINT } from "@/lib/easypaisa";

export async function POST(req: NextRequest) {
  const session = await auth();
  const { items, shipping, total } = await req.json();

  if (!items?.length) {
    return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
  }

  const order = await prisma.order.create({
    data: {
      userId: session?.user ? (session.user as any).id : undefined,
      guestEmail: session?.user ? undefined : shipping?.email,
      subtotal: total,
      total,
      paymentProvider: "EASYPAISA",
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

  const returnUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/api/webhooks/easypaisa`;

  const payload = buildEasyPaisaPayload({
    amount: total,
    orderRefNum: order.id,
    description: `Lumière Parfums order ${order.orderNumber}`,
    returnUrl,
    mobileNumber: shipping?.phone,
    email: shipping?.email,
  });

  return NextResponse.json({ endpoint: EASYPAISA_ENDPOINT, fields: payload, orderId: order.id });
}
