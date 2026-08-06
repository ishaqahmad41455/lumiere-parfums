import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const { code, subtotal } = await req.json();

  const coupon = await prisma.coupon.findUnique({ where: { code } });

  if (!coupon || !coupon.isActive) {
    return NextResponse.json({ valid: false, message: "Invalid or expired coupon" }, { status: 400 });
  }
  if (coupon.expiresAt && coupon.expiresAt < new Date()) {
    return NextResponse.json({ valid: false, message: "Coupon has expired" }, { status: 400 });
  }
  if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
    return NextResponse.json({ valid: false, message: "Coupon usage limit reached" }, { status: 400 });
  }
  if (coupon.minSpend && subtotal < Number(coupon.minSpend)) {
    return NextResponse.json({
      valid: false,
      message: `Minimum spend of $${coupon.minSpend} required`,
    }, { status: 400 });
  }

  return NextResponse.json({
    valid: true,
    percentOff: coupon.percentOff,
    amountOff: coupon.amountOff ? Number(coupon.amountOff) : null,
  });
}
