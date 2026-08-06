import { prisma } from "@/lib/prisma";

export default async function AdminCustomersPage() {
  const customers = await prisma.user.findMany({
    where: { role: "CUSTOMER" },
    include: { _count: { select: { orders: true } } },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <div>
      <h1 className="mb-8 font-display text-3xl">Customers</h1>
      <div className="glass-light overflow-x-auto rounded-lg">
        <table className="w-full min-w-[600px] text-sm">
          <thead>
            <tr className="eyebrow border-b border-gold/10 text-left text-gold">
              <th className="p-4">Name</th>
              <th>Email</th>
              <th>Orders</th>
              <th>Reward Points</th>
              <th>Joined</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.id} className="border-b border-gold/5">
                <td className="p-4">{c.name ?? "—"}</td>
                <td>{c.email}</td>
                <td>{c._count.orders}</td>
                <td>{c.rewardPoints}</td>
                <td>{c.createdAt.toDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
