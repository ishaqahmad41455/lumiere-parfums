import { prisma } from "@/lib/prisma";

export default async function AdminCouponsPage() {
  const coupons = await prisma.coupon.findMany({ orderBy: { id: "desc" } });

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-display text-3xl">Coupons</h1>
        <button className="rounded-full bg-gold px-5 py-2 eyebrow text-noir">+ New Coupon</button>
      </div>
      <div className="glass-light overflow-x-auto rounded-lg">
        <table className="w-full min-w-[600px] text-sm">
          <thead>
            <tr className="eyebrow border-b border-gold/10 text-left text-gold">
              <th className="p-4">Code</th>
              <th>Discount</th>
              <th>Used</th>
              <th>Max Uses</th>
              <th>Expires</th>
              <th>Active</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((c) => (
              <tr key={c.id} className="border-b border-gold/5">
                <td className="p-4">{c.code}</td>
                <td>{c.percentOff ? `${c.percentOff}%` : c.amountOff ? `$${c.amountOff}` : "—"}</td>
                <td>{c.usedCount}</td>
                <td>{c.maxUses ?? "∞"}</td>
                <td>{c.expiresAt?.toDateString() ?? "—"}</td>
                <td>{c.isActive ? "Yes" : "No"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
