import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { RevenueChart } from "@/components/admin/RevenueChart";

export default async function AdminDashboardPage() {
  const [revenueAgg, orderCount, customerCount, lowStock] = await Promise.all([
    prisma.order.aggregate({ where: { status: { in: ["PAID", "DELIVERED", "SHIPPED"] } }, _sum: { total: true } }),
    prisma.order.count(),
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.productVariant.count({ where: { stock: { lte: 5 } } }),
  ]);

  const recentOrders = await prisma.order.findMany({
    take: 6,
    orderBy: { createdAt: "desc" },
    include: { user: { select: { name: true, email: true } } },
  });

  const kpis = [
    ["Total Revenue", formatPrice(Number(revenueAgg._sum.total ?? 0))],
    ["Orders", orderCount],
    ["Customers", customerCount],
    ["Low Stock Alerts", lowStock],
  ];

  return (
    <div>
      <h1 className="mb-8 font-display text-3xl">Dashboard</h1>
      <div className="mb-10 grid grid-cols-2 gap-4 md:grid-cols-4">
        {kpis.map(([label, value]) => (
          <div key={label} className="glass-light rounded-lg p-6">
            <p className="eyebrow text-gold">{label}</p>
            <p className="mt-2 font-display text-2xl">{value}</p>
          </div>
        ))}
      </div>

      <div className="mb-10 glass-light rounded-lg p-6">
        <h2 className="mb-4 font-display text-xl">Revenue (Last 30 Days)</h2>
        <RevenueChart />
      </div>

      <div className="glass-light rounded-lg p-6">
        <h2 className="mb-4 font-display text-xl">Recent Orders</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="eyebrow text-left text-gold">
              <th className="pb-2">Order</th>
              <th>Customer</th>
              <th>Status</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((o) => (
              <tr key={o.id} className="border-t border-gold/10">
                <td className="py-3">{o.orderNumber.slice(0, 10)}</td>
                <td>{o.user?.name ?? o.guestEmail ?? "Guest"}</td>
                <td>{o.status}</td>
                <td>{formatPrice(Number(o.total))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
