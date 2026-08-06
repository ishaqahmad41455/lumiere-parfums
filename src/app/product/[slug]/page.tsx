import { notFound } from "next/navigation";
import dynamic from "next/dynamic";
import type { Metadata } from "next";
import { getProductBySlug, getBestSellers } from "@/lib/products";
import { AddToCartPanel } from "@/components/product/AddToCartPanel";
import { NotesPyramid } from "@/components/product/NotesPyramid";
import { ProductRail } from "@/components/home/ProductRail";

const BottleScene = dynamic(
  () => import("@/components/three/BottleScene").then((m) => m.BottleScene),
  { ssr: false }
);

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.description.slice(0, 155),
    openGraph: {
      title: product.name,
      description: product.description.slice(0, 155),
      images: product.images[0] ? [product.images[0].url] : [],
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = await getBestSellers(4);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.images.map((i) => i.url),
    description: product.description,
    brand: { "@type": "Brand", name: product.brand.name },
    sku: product.sku,
    aggregateRating: product.reviewCount
      ? {
          "@type": "AggregateRating",
          ratingValue: product.avgRating,
          reviewCount: product.reviewCount,
        }
      : undefined,
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: product.price,
      availability: product.variants.some((v) => v.stock > 0)
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
  };

  return (
    <div className="pt-28">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="container grid gap-12 pb-20 md:grid-cols-2">
        <div className="sticky top-28 h-[70vh] rounded-lg bg-gradient-to-b from-noir/5 to-transparent">
          <BottleScene interactive className="h-full w-full" />
          <p className="mt-2 text-center text-xs text-noir/40 dark:text-cream/40">
            Drag to rotate · Scroll to zoom
          </p>
        </div>
        <AddToCartPanel product={product} />
      </div>

      <section className="container pb-20">
        <h2 className="mb-8 text-center font-display text-2xl">Fragrance Pyramid</h2>
        <NotesPyramid top={product.topNotes} middle={product.middleNotes} base={product.baseNotes} />
      </section>

      <section className="container grid grid-cols-2 gap-4 pb-20 text-sm md:grid-cols-4">
        {[
          ["Concentration", product.concentration.replaceAll("_", " ")],
          ["Longevity", `${product.longevity}/10`],
          ["Projection", `${product.projection}/10`],
          ["Gender", product.gender],
        ].map(([label, value]) => (
          <div key={label} className="glass-light rounded-lg p-4 text-center">
            <p className="eyebrow text-gold">{label}</p>
            <p className="mt-1 font-display capitalize">{value}</p>
          </div>
        ))}
      </section>

      <section className="container pb-20">
        <h2 className="mb-8 font-display text-2xl">Customer Reviews</h2>
        {product.reviewCount === 0 ? (
          <p className="text-noir/60 dark:text-cream/60">Be the first to review this fragrance.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {(product as any).reviews?.map((r: any) => (
              <div key={r.id} className="glass-light rounded-lg p-5">
                <div className="flex items-center justify-between">
                  <p className="font-display">{r.user?.name ?? "Verified Buyer"}</p>
                  <span className="text-gold">{"★".repeat(r.rating)}</span>
                </div>
                {r.title && <p className="mt-2 text-sm font-medium">{r.title}</p>}
                <p className="mt-1 text-sm text-noir/70 dark:text-cream/70">{r.body}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      <ProductRail title="You May Also Like" subtitle="Related" products={related} />
    </div>
  );
}
