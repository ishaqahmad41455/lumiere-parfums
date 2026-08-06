import { prisma } from "@/lib/prisma";
import type { Product } from "@/types";

const productInclude = {
  brand: { select: { id: true, name: true, slug: true } },
  images: { orderBy: { position: "asc" as const } },
  variants: true,
};

function serialize(p: any): Product {
  return {
    ...p,
    price: Number(p.price),
    compareAtPrice: p.compareAtPrice ? Number(p.compareAtPrice) : null,
    variants: p.variants.map((v: any) => ({ ...v, price: Number(v.price) })),
  };
}

export async function getFeaturedProducts(limit = 8) {
  const products = await prisma.product.findMany({
    where: { isFeatured: true },
    include: productInclude,
    take: limit,
  });
  return products.map(serialize);
}

export async function getBestSellers(limit = 8) {
  const products = await prisma.product.findMany({
    where: { isBestSeller: true },
    include: productInclude,
    take: limit,
  });
  return products.map(serialize);
}

export async function getNewArrivals(limit = 8) {
  const products = await prisma.product.findMany({
    where: { isNewArrival: true },
    include: productInclude,
    orderBy: { createdAt: "desc" },
    take: limit,
  });
  return products.map(serialize);
}

export async function getProductBySlug(slug: string) {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      ...productInclude,
      reviews: { include: { user: { select: { name: true, image: true } } }, orderBy: { createdAt: "desc" } },
      questions: true,
    },
  });
  return product ? serialize(product) : null;
}

export interface ShopFilters {
  gender?: string;
  brand?: string[];
  minPrice?: number;
  maxPrice?: number;
  season?: string;
  sort?: string;
  page?: number;
  pageSize?: number;
}

export async function getShopProducts(filters: ShopFilters) {
  const { gender, brand, minPrice, maxPrice, season, sort, page = 1, pageSize = 12 } = filters;

  const where: any = {};
  if (gender) where.gender = gender;
  if (brand?.length) where.brand = { slug: { in: brand } };
  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) where.price.gte = minPrice;
    if (maxPrice) where.price.lte = maxPrice;
  }
  if (season) where.season = { has: season };

  const orderBy: any =
    sort === "price-asc"
      ? { price: "asc" }
      : sort === "price-desc"
      ? { price: "desc" }
      : sort === "newest"
      ? { createdAt: "desc" }
      : sort === "best-selling"
      ? { isBestSeller: "desc" }
      : sort === "alphabetical"
      ? { name: "asc" }
      : { createdAt: "desc" };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: productInclude,
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.product.count({ where }),
  ]);

  return { products: products.map(serialize), total, page, pageSize };
}
