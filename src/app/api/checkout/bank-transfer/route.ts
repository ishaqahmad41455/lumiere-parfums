import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

/**
 * Direct bank transfer (HBL/UBL/MCB/Meezan/etc.) has no live API — the
 * customer transfers manually and your team confirms the payment in
 * /admin/orders before it moves from PENDING to PAID. This route just
 * records the order and shows the customer your bank details.
 */
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
      paymentProvider: "BANK_TRANSFER",
      status: "PENDING",
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

  // TODO: send an email via Resend with your bank account details
  // (account title, account #, IBAN, bank name) and the order reference
  // so the customer knows what to reference in the transfer.

  return NextResponse.json({ orderId: order.id });
}
