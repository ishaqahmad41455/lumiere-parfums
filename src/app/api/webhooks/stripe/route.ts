import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import type Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = session.metadata?.orderId;
      if (orderId) {
        const order = await prisma.order.update({
          where: { id: orderId },
          data: {
            status: "PAID",
            paymentIntentId: session.payment_intent as string,
          },
          include: { items: true },
        });

        // Decrement stock for each purchased variant
        await Promise.all(
          order.items.map((item) =>
            prisma.productVariant.update({
              where: { id: item.variantId },
              data: { stock: { decrement: item.quantity } },
            })
          )
        );

        await prisma.invoice.create({ data: { orderId: order.id } });

        // TODO: send order confirmation email via Resend using the
        // "Order Confirmation" template referenced in emails/README.
      }
      break;
    }
    case "payment_intent.payment_failed": {
      const intent = event.data.object as Stripe.PaymentIntent;
      await prisma.order.updateMany({
        where: { paymentIntentId: intent.id },
        data: { status: "CANCELLED" },
      });
      break;
    }
    default:
      break;
  }

  return NextResponse.json({ received: true });
}
