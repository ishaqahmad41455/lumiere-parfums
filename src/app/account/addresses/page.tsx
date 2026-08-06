import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function AddressesPage() {
  const session = await auth();
  if (!session?.user) redirect("/account/login");

  const addresses = await prisma.address.findMany({
    where: { userId: (session.user as any).id },
  });

  return (
    <div className="container pt-32 pb-24">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-display text-3xl">Saved Addresses</h1>
        <button className="rounded-full bg-gold px-5 py-2 eyebrow text-noir">Add Address</button>
      </div>
      {addresses.length === 0 ? (
        <p className="text-noir/60 dark:text-cream/60">No saved addresses yet.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {addresses.map((a) => (
            <div key={a.id} className="glass-light rounded-lg p-6">
              <p className="eyebrow text-gold">{a.label}</p>
              <p className="font-display">{a.fullName}</p>
              <p className="text-sm">{a.line1}, {a.city} {a.postalCode}</p>
              <p className="text-sm">{a.country} · {a.phone}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
