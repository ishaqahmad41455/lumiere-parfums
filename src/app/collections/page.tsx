import Link from "next/link";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Collections" };

export default async function CollectionsPage() {
  const collections = await prisma.collection.findMany();

  return (
    <div className="container pt-32 pb-24">
      <h1 className="mb-10 text-center font-display text-4xl">Collections</h1>
      <div className="grid gap-6 md:grid-cols-2">
        {collections.map((c) => (
          <Link key={c.id} href={`/shop?collection=${c.slug}`} className="group relative aspect-video overflow-hidden rounded-lg">
            {c.heroImage && (
              <Image
                src={c.heroImage}
                alt={c.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            )}
            <div className="absolute inset-0 flex items-end bg-gradient-to-t from-noir/80 to-transparent p-6">
              <div>
                <p className="font-display text-2xl text-cream">{c.name}</p>
                {c.description && <p className="text-sm text-cream/70">{c.description}</p>}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
