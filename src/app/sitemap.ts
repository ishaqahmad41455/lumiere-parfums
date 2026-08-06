import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://lumiere-parfums.com";

  const products = await prisma.product.findMany({ select: { slug: true, updatedAt: true } });
  const posts = await prisma.blogPost.findMany({ select: { slug: true, createdAt: true } });

  const staticRoutes = [
    "", "shop", "collections", "about", "contact", "faqs", "blog",
    "privacy-policy", "terms", "refund-policy", "shipping-policy",
  ].map((path) => ({
    url: `${base}/${path}`,
    lastModified: new Date(),
  }));

  const productRoutes = products.map((p) => ({
    url: `${base}/product/${p.slug}`,
    lastModified: p.updatedAt,
  }));

  const blogRoutes = posts.map((p) => ({
    url: `${base}/blog/${p.slug}`,
    lastModified: p.createdAt,
  }));

  return [...staticRoutes, ...productRoutes, ...blogRoutes];
}
