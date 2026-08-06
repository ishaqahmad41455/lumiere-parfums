import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "The Journal" };

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({
    where: { publishedAt: { not: null } },
    orderBy: { publishedAt: "desc" },
  });

  return (
    <div className="container pt-32 pb-24">
      <h1 className="mb-2 text-center font-display text-4xl">The Journal</h1>
      <p className="mb-12 text-center text-noir/60 dark:text-cream/60">
        Notes on perfumery, provenance, and the art of scent.
      </p>
      {posts.length === 0 ? (
        <p className="text-center text-noir/50 dark:text-cream/50">New essays coming soon.</p>
      ) : (
        <div className="grid gap-8 md:grid-cols-3">
          {posts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="group">
              <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-noir/5">
                {post.coverImage && (
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                )}
              </div>
              <p className="mt-4 font-display text-lg">{post.title}</p>
              {post.excerpt && <p className="mt-1 text-sm text-noir/60 dark:text-cream/60">{post.excerpt}</p>}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
