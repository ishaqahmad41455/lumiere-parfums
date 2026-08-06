import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { productId, rating, title, body } = await req.json();
  if (!productId || !rating) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const userId = (session.user as any).id;

  const verifiedPurchase = await prisma.orderItem.findFirst({
    where: { productId, order: { userId, status: { in: ["DELIVERED", "PAID", "SHIPPED"] } } },
  });

  const review = await prisma.review.create({
    data: { productId, userId, rating, title, body, isVerified: !!verifiedPurchase },
  });

  const agg = await prisma.review.aggregate({
    where: { productId },
    _avg: { rating: true },
    _count: true,
  });

  await prisma.product.update({
    where: { id: productId },
    data: { avgRating: agg._avg.rating ?? 0, reviewCount: agg._count },
  });

  return NextResponse.json({ review }, { status: 201 });
}
