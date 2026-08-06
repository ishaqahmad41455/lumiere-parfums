import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function RewardsPage() {
  const session = await auth();
  if (!session?.user) redirect("/account/login");

  const user = await prisma.user.findUnique({
    where: { id: (session.user as any).id },
    select: { rewardPoints: true, referralCode: true },
  });

  return (
    <div className="container pt-32 pb-24">
      <h1 className="mb-8 font-display text-3xl">Rewards & Referrals</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="glass-light rounded-lg p-8 text-center">
          <p className="eyebrow text-gold">Your Balance</p>
          <p className="mt-2 font-display text-4xl">{user?.rewardPoints ?? 0} pts</p>
          <p className="mt-2 text-sm text-noir/60 dark:text-cream/60">
            Earn 1 point for every $1 spent. Redeem 500 points for $25 off.
          </p>
        </div>
        <div className="glass-light rounded-lg p-8 text-center">
          <p className="eyebrow text-gold">Your Referral Code</p>
          <p className="mt-2 font-display text-2xl tracking-widest">{user?.referralCode}</p>
          <p className="mt-2 text-sm text-noir/60 dark:text-cream/60">
            Share this code — you and your friend each get $15 off.
          </p>
        </div>
      </div>
    </div>
  );
}
