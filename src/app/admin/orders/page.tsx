import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: { user: { select: { name: true, email: true } }, items: true },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <div>
      <h1 className="mb-8 font-display text-3xl">Orders</h1>
      <div className="glass-light overflow-x-auto rounded-lg">
        <table className="w-full min-w-[700px] text-sm">
          <thead>
            <tr className="eyebrow border-b border-gold/10 text-left text-gold">
              <th className="p-4">Order #</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-b border-gold/5">
                <td className="p-4">{o.orderNumber.slice(0, 10)}</td>
                <td>{o.user?.name ?? o.guestEmail ?? "Guest"}</td>
                <td>{o.items.length}</td>
                <td>{formatPrice(Number(o.total))}</td>
                <td>
                  <select defaultValue={o.status} className="glass-light rounded-md px-2 py-1 text-xs">
                    {["PENDING", "PAID", "PROCESSING", "SHIPPED", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED", "REFUNDED"].map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </td>
                <td>{o.createdAt.toDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
