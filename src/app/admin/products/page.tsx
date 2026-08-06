import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: { brand: true, variants: true },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-display text-3xl">Products</h1>
        <button className="rounded-full bg-gold px-5 py-2 eyebrow text-noir">+ New Product</button>
      </div>
      <div className="glass-light overflow-x-auto rounded-lg">
        <table className="w-full min-w-[700px] text-sm">
          <thead>
            <tr className="eyebrow border-b border-gold/10 text-left text-gold">
              <th className="p-4">Product</th>
              <th>Brand</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {products.map((p) => {
              const stock = p.variants.reduce((sum, v) => sum + v.stock, 0);
              return (
                <tr key={p.id} className="border-b border-gold/5">
                  <td className="p-4">{p.name}</td>
                  <td>{p.brand.name}</td>
                  <td>{formatPrice(Number(p.price))}</td>
                  <td className={stock <= 10 ? "text-bordeaux" : ""}>{stock}</td>
                  <td>{stock > 0 ? "Active" : "Out of Stock"}</td>
                  <td>
                    <Link href={`/admin/products/${p.id}`} className="text-gold underline">Edit</Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
