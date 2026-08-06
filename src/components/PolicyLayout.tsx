export function PolicyLayout({ title, updated, children }: { title: string; updated: string; children: React.ReactNode }) {
  return (
    <div className="container max-w-2xl pt-32 pb-24">
      <h1 className="font-display text-4xl">{title}</h1>
      <p className="mt-2 text-sm text-noir/50 dark:text-cream/50">Last updated {updated}</p>
      <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">{children}</div>
    </div>
  );
}
