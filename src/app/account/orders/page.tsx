import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { redirect } from "next/navigation";

export default async function OrdersPage() {
  const session = await auth();
  if (!session?.user) redirect("/account/login");

  const orders = await prisma.order.findMany({
    where: { userId: (session.user as any).id },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="container pt-32 pb-24">
      <h1 className="mb-8 font-display text-3xl">Order History</h1>
      {orders.length === 0 ? (
        <p className="text-noir/60 dark:text-cream/60">You haven't placed any orders yet.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((o) => (
            <div key={o.id} className="glass-light rounded-lg p-6">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-display">Order #{o.orderNumber}</p>
                  <p className="text-xs text-noir/50 dark:text-cream/50">
                    {o.createdAt.toDateString()} · {o.items.length} item(s)
                  </p>
                </div>
                <span className="eyebrow rounded-full border border-gold px-3 py-1 text-gold">
                  {o.status}
                </span>
                <span className="font-display">{formatPrice(Number(o.total))}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
