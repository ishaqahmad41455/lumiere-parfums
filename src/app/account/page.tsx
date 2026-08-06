import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

const LINKS = [
  { label: "Overview", href: "/account" },
  { label: "Orders", href: "/account/orders" },
  { label: "Addresses", href: "/account/addresses" },
  { label: "Invoices", href: "/account/invoices" },
  { label: "Rewards", href: "/account/rewards" },
  { label: "Profile", href: "/account/profile" },
];

export default async function AccountPage() {
  const session = await auth();
  if (!session) redirect("/account/login");

  return (
    <div className="container grid gap-10 pt-32 pb-24 md:grid-cols-[220px_1fr]">
      <aside className="flex flex-col gap-2">
        {LINKS.map((l) => (
          <Link key={l.href} href={l.href} className="eyebrow py-2 text-noir/70 hover:text-gold dark:text-cream/70">
            {l.label}
          </Link>
        ))}
      </aside>
      <div>
        <h1 className="mb-2 font-display text-3xl">Welcome back, {session.user?.name ?? "friend"}</h1>
        <p className="text-noir/60 dark:text-cream/60">
          {session.user?.email} · {(session.user as any)?.role === "ADMIN" ? "Administrator" : "Member"}
        </p>
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            ["Reward Points", "1,240"],
            ["Open Orders", "2"],
            ["Wishlist Items", "—"],
          ].map(([label, value]) => (
            <div key={label} className="glass-light rounded-lg p-6 text-center">
              <p className="font-display text-2xl">{value}</p>
              <p className="eyebrow mt-1 text-gold">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
