import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const brand = await prisma.brand.upsert({
    where: { slug: "lumiere" },
    update: {},
    create: {
      name: "Lumière",
      slug: "lumiere",
      description: "The house's own atelier line, composed in Grasse.",
      isLuxury: true,
    },
  });

  const collection = await prisma.collection.upsert({
    where: { slug: "limited-edition" },
    update: {},
    create: {
      name: "Limited Edition",
      slug: "limited-edition",
      description: "Numbered releases, once they're gone, they're gone.",
      isLimited: true,
      heroImage: "/images/collection-limited.jpg",
    },
  });

  await prisma.collection.upsert({
    where: { slug: "gifts" },
    update: {},
    create: {
      name: "Gift Collection",
      slug: "gifts",
      description: "Boxed sets and discovery flights, ready to give.",
      heroImage: "/images/collection-gifts.jpg",
    },
  });

  const products = [
    {
      name: "Noir Absolu",
      slug: "noir-absolu",
      sku: "LUM-NA-001",
      gender: "UNISEX" as const,
      concentration: "EXTRAIT_DE_PARFUM" as const,
      description:
        "Oud, saffron, and black amber layered into a scent that lingers like memory. Hand-poured, individually numbered.",
      price: 285,
      compareAtPrice: null,
      longevity: 9,
      projection: 8,
      season: ["Fall", "Winter"],
      occasion: ["Evening", "Date Night"],
      topNotes: ["Saffron", "Pink Pepper"],
      middleNotes: ["Oud", "Rose de Mai"],
      baseNotes: ["Black Amber", "Vetiver"],
      isBestSeller: true,
      isFeatured: true,
      isLimited: true,
      collectionId: collection.id,
      images: ["/images/product-noir-absolu-1.jpg", "/images/product-noir-absolu-2.jpg"],
      variants: [
        { size: "30ml", price: 165, stock: 40 },
        { size: "50ml", price: 285, stock: 25 },
        { size: "100ml", price: 420, stock: 10 },
      ],
    },
    {
      name: "Cream Jasmine",
      slug: "cream-jasmine",
      sku: "LUM-CJ-002",
      gender: "WOMEN" as const,
      concentration: "EAU_DE_PARFUM" as const,
      description:
        "A sun-warmed bouquet of jasmine sambac and orange blossom over a soft musk base.",
      price: 210,
      compareAtPrice: 240,
      longevity: 7,
      projection: 6,
      season: ["Spring", "Summer"],
      occasion: ["Office", "Daytime"],
      topNotes: ["Bergamot", "Orange Blossom"],
      middleNotes: ["Jasmine Sambac", "Tuberose"],
      baseNotes: ["White Musk", "Sandalwood"],
      isNewArrival: true,
      isFeatured: true,
      images: ["/images/product-cream-jasmine-1.jpg"],
      variants: [
        { size: "30ml", price: 130, stock: 55 },
        { size: "50ml", price: 210, stock: 30 },
      ],
    },
    {
      name: "Vetiver Nomade",
      slug: "vetiver-nomade",
      sku: "LUM-VN-003",
      gender: "MEN" as const,
      concentration: "EAU_DE_TOILETTE" as const,
      description:
        "Smoky vetiver and cedar for the man who packs light and travels often.",
      price: 175,
      compareAtPrice: null,
      longevity: 6,
      projection: 7,
      season: ["Fall", "Spring"],
      occasion: ["Office", "Travel"],
      topNotes: ["Grapefruit", "Cardamom"],
      middleNotes: ["Vetiver", "Cedar"],
      baseNotes: ["Leather", "Tonka Bean"],
      isBestSeller: true,
      images: ["/images/product-vetiver-nomade-1.jpg"],
      variants: [
        { size: "50ml", price: 175, stock: 60 },
        { size: "100ml", price: 260, stock: 18 },
      ],
    },
  ];

  for (const p of products) {
    const { images, variants, ...data } = p;
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        ...data,
        brandId: brand.id,
        images: { create: images.map((url, i) => ({ url, position: i })) },
        variants: {
          create: variants.map((v) => ({
            ...v,
            sku: `${p.sku}-${v.size}`,
          })),
        },
      },
    });
  }

  await prisma.coupon.upsert({
    where: { code: "WELCOME15" },
    update: {},
    create: {
      code: "WELCOME15",
      description: "15% off your first order",
      percentOff: 15,
      maxUses: 1000,
      isActive: true,
    },
  });

  await prisma.blogPost.upsert({
    where: { slug: "art-of-layering-fragrance" },
    update: {},
    create: {
      title: "The Art of Layering Fragrance",
      slug: "art-of-layering-fragrance",
      excerpt: "How to combine two scents without losing either one.",
      content:
        "Layering isn't about mixing everything in your collection...\n\nStart with your heaviest, most textured scent as a base...",
      coverImage: "/images/blog-layering.jpg",
      publishedAt: new Date(),
    },
  });

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
