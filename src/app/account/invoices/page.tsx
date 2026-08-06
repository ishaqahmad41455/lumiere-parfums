import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function InvoicesPage() {
  const session = await auth();
  if (!session?.user) redirect("/account/login");

  const invoices = await prisma.invoice.findMany({
    where: { order: { userId: (session.user as any).id } },
    include: { order: true },
    orderBy: { issuedAt: "desc" },
  });

  return (
    <div className="container pt-32 pb-24">
      <h1 className="mb-8 font-display text-3xl">Invoices</h1>
      {invoices.length === 0 ? (
        <p className="text-noir/60 dark:text-cream/60">No invoices yet.</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="eyebrow text-left text-gold">
              <th className="py-2">Invoice #</th>
              <th>Order</th>
              <th>Date</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv) => (
              <tr key={inv.id} className="border-t border-gold/10">
                <td className="py-3">{inv.invoiceNumber}</td>
                <td>{inv.order.orderNumber}</td>
                <td>{inv.issuedAt.toDateString()}</td>
                <td>
                  <a href={inv.pdfUrl ?? "#"} className="text-gold underline">Download</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
