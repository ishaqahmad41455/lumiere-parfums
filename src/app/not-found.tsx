import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-6 text-center">
      <p className="eyebrow text-gold">404</p>
      <h1 className="mt-4 font-display text-4xl md:text-5xl">This scent has evaporated.</h1>
      <p className="mt-4 max-w-sm text-noir/60 dark:text-cream/60">
        The page you're looking for doesn't exist, or has moved to a new address.
      </p>
      <Link href="/" className="mt-8 rounded-full bg-gold px-8 py-3 eyebrow text-noir">
        Return Home
      </Link>
    </div>
  );
}
