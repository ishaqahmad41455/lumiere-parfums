export type Gender = "MEN" | "WOMEN" | "UNISEX";

export type Concentration =
  | "PARFUM"
  | "EAU_DE_PARFUM"
  | "EAU_DE_TOILETTE"
  | "EAU_DE_COLOGNE"
  | "EXTRAIT_DE_PARFUM";

export interface ProductVariant {
  id: string;
  size: string;
  price: number;
  stock: number;
  sku: string;
}

export interface ProductImage {
  id: string;
  url: string;
  alt?: string;
  position: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  brand: { id: string; name: string; slug: string };
  gender: Gender;
  concentration: Concentration;
  description: string;
  price: number;
  compareAtPrice?: number | null;
  longevity: number;
  projection: number;
  season: string[];
  occasion: string[];
  topNotes: string[];
  middleNotes: string[];
  baseNotes: string[];
  isBestSeller: boolean;
  isNewArrival: boolean;
  isLimited: boolean;
  avgRating: number;
  reviewCount: number;
  images: ProductImage[];
  variants: ProductVariant[];
  model3dUrl?: string | null;
  videoUrl?: string | null;
}

export interface CartLine {
  productId: string;
  variantId: string;
  name: string;
  slug: string;
  brand: string;
  size: string;
  price: number;
  image: string;
  quantity: number;
  giftWrap?: boolean;
}
