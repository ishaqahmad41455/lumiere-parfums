import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ items: [] });

  const items = await prisma.cartItem.findMany({
    where: { userId: (session.user as any).id },
    include: { product: { include: { images: true, brand: true } }, variant: true },
  });
  return NextResponse.json({ items });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { productId, variantId, quantity } = await req.json();

  const item = await prisma.cartItem.upsert({
    where: {
      id: `${(session.user as any).id}_${variantId}`,
    },
    update: { quantity: { increment: quantity } },
    create: {
      id: `${(session.user as any).id}_${variantId}`,
      userId: (session.user as any).id,
      productId,
      variantId,
      quantity,
    },
  });

  return NextResponse.json({ item });
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { variantId } = await req.json();
  await prisma.cartItem.deleteMany({
    where: { userId: (session.user as any).id, variantId },
  });

  return NextResponse.json({ ok: true });
}
