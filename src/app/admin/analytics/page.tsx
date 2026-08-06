import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { RevenueChart } from "@/components/admin/RevenueChart";

export default async function AdminAnalyticsPage() {
  const topProducts = await prisma.product.findMany({
    orderBy: { reviewCount: "desc" },
    take: 5,
    select: { name: true, avgRating: true, reviewCount: true, price: true },
  });

  return (
    <div>
      <h1 className="mb-8 font-display text-3xl">Analytics</h1>
      <div className="glass-light mb-10 rounded-lg p-6">
        <h2 className="mb-4 font-display text-xl">Revenue Trend</h2>
        <RevenueChart />
      </div>
      <div className="glass-light rounded-lg p-6">
        <h2 className="mb-4 font-display text-xl">Top Rated Products</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="eyebrow text-left text-gold">
              <th className="pb-2">Product</th>
              <th>Rating</th>
              <th>Reviews</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {topProducts.map((p) => (
              <tr key={p.name} className="border-t border-gold/10">
                <td className="py-3">{p.name}</td>
                <td>{p.avgRating.toFixed(1)} ★</td>
                <td>{p.reviewCount}</td>
                <td>{formatPrice(Number(p.price))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
