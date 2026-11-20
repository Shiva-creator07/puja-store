import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";

export default async function Catalog() {
  const [categories, featured, products] = await Promise.all([
    prisma.category.findMany({
      orderBy: { id: "asc" },
      include: { _count: { select: { products: true } } },
    }),
    prisma.product.findMany({
      where: { isActive: true, isFeatured: true },
      orderBy: { id: "asc" },
      include: { category: true },
    }),
    prisma.product.findMany({
      where: { isActive: true },
      orderBy: { id: "asc" },
      include: { category: true },
    }),
  ]);

  return (
    <>
      <section id="categories" className="mx-auto max-w-6xl scroll-mt-6 px-6 py-8">
        <h2 className="mb-6 text-2xl font-bold text-stone-900">
          Shop by category
        </h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/category/${c.slug}`}
              className="rounded-xl border border-amber-200 bg-white p-4 text-center shadow-sm transition hover:shadow-md"
            >
              <p className="font-semibold text-stone-900">{c.name}</p>
              <p className="mt-1 text-xs text-stone-500">
                {c._count.products} products
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section id="featured" className="mx-auto max-w-6xl scroll-mt-6 px-6 py-8">
        <h2 className="mb-6 text-2xl font-bold text-stone-900">
          Featured products
        </h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {featured.map((p) => (
            <ProductCard
              key={p.id}
              slug={p.slug}
              name={p.name}
              pricePaise={p.pricePaise}
              mrpPaise={p.mrpPaise}
              stock={p.stock}
              categoryName={p.category.name}
            />
          ))}
        </div>
      </section>

      <section id="products" className="mx-auto max-w-6xl scroll-mt-6 px-6 py-8">
        <h2 className="mb-6 text-2xl font-bold text-stone-900">All products</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {products.map((p) => (
            <ProductCard
              key={p.id}
              slug={p.slug}
              name={p.name}
              pricePaise={p.pricePaise}
              mrpPaise={p.mrpPaise}
              stock={p.stock}
              categoryName={p.category.name}
            />
          ))}
        </div>
      </section>
    </>
  );
}
