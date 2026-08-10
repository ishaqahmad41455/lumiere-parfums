import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyJazzCashResponse } from "@/lib/jazzcash";

/**
 * JazzCash POSTs the result of the payment to this URL (pp_ReturnURL).
 * pp_ResponseCode "000" = success. We verify the SecureHash before trusting
 * anything, update the order, decrement stock, then redirect the browser
 * to a human-readable confirmation page.
 */
export async function POST(req: NextRequest) {
  const form = await req.formData();
  const fields: Record<string, string> = {};
  form.forEach((value, key) => (fields[key] = String(value)));

  const valid = verifyJazzCashResponse(fields);
  const orderId = fields.pp_TxnRefNo;
  const success = valid && fields.pp_ResponseCode === "000";

  if (orderId) {
    const order = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: success ? "PAID" : "CANCELLED",
        paymentIntentId: fields.pp_RetreivalReferenceNo ?? undefined,
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
    : `${process.env.NEXT_PUBLIC_SITE_URL}/checkout?error=jazzcash_failed`;

  return NextResponse.redirect(destination, { status: 303 });
}
