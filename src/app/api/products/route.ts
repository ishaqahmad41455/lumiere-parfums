import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const ids = searchParams.get("ids");

  const products = await prisma.product.findMany({
    where: ids ? { id: { in: ids.split(",") } } : undefined,
    include: {
      brand: { select: { id: true, name: true, slug: true } },
      images: { orderBy: { position: "asc" } },
      variants: true,
    },
    take: 50,
  });

  const serialized = products.map((p) => ({
    ...p,
    price: Number(p.price),
    compareAtPrice: p.compareAtPrice ? Number(p.compareAtPrice) : null,
    variants: p.variants.map((v) => ({ ...v, price: Number(v.price) })),
  }));

  return NextResponse.json({ products: serialized });
}
