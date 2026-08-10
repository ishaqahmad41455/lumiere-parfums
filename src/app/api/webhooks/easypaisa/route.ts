import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyEasyPaisaResponse } from "@/lib/easypaisa";

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const fields: Record<string, string> = {};
  form.forEach((value, key) => (fields[key] = String(value)));

  const success = verifyEasyPaisaResponse(fields);
  const orderId = fields.orderRefNum;

  if (orderId) {
    const order = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: success ? "PAID" : "CANCELLED",
        paymentIntentId: fields.transactionId ?? undefined,
      },
      include: { items: true },
    }).catch(() => null);

    if (success && order) {
      await Promise.all(
        order.items.map((item) =>
          prisma.productVariant.update({
            where: { id: item.variantId },
            data: { stock: { decrement: item.quantity } },
          })
        )
      );
      await prisma.invoice.create({ data: { orderId: order.id } }).catch(() => null);
    }
  }

  const destination = success
    ? `${process.env.NEXT_PUBLIC_SITE_URL}/account/orders?success=true`
    : `${process.env.NEXT_PUBLIC_SITE_URL}/checkout?error=easypaisa_failed`;

  return NextResponse.redirect(destination, { status: 303 });
}
