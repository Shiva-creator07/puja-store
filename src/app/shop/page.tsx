import { Suspense } from "react";
import Link from "next/link";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";

export const metadata = {
  title: "Shop | The Puja Store (TPS)",
  description: "Browse all puja samagri, kits and daily puja items.",
};

type SearchParams = Promise<{ q?: string | string[] }>;

async function Results({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const raw = Array.isArray(sp.q) ? sp.q[0] : sp.q;
  const q = (raw ?? "").trim().replace(/\s+/g, " ").slice(0, 80);

  const where: Prisma.ProductWhereInput = { isActive: true };
  if (q) {
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
      { category: { name: { contains: q, mode: "insensitive" } } },
    ];
  }

  const products = await prisma.product.findMany({
    where,
    orderBy: { id: "asc" },
    include: { category: true },
    take: 60,
  });

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <nav className="mb-6 text-sm text-stone-500">
        <Link href="/" className="hover:text-orange-700">
          Home
        </Link>
        <span className="mx-2">/</span>
        <span className="text-stone-800">Shop</span>
      </nav>

      <h1 className="text-3xl font-bold text-stone-900">
        {q ? `Results for “${q}”` : "All products"}
      </h1>
      <p className="mt-1 text-sm text-stone-500">
        {products.length} {products.length === 1 ? "product" : "products"}
      </p>

      {products.length === 0 ? (
        <div className="mt-8 rounded-xl border border-amber-200 bg-white p-8 text-center">
          <p className="text-lg text-stone-700">
            No products matched your search.
          </p>
          <Link
            href="/shop"
            className="mt-4 inline-block rounded-lg bg-orange-700 px-6 py-3 font-semibold text-white hover:bg-orange-800"
          >
            See all products
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
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
      )}
    </main>
  );
}

export default function ShopPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  return (
    <Suspense
      fallback={
        <p className="px-6 py-10 text-center text-stone-500">Loading...</p>
      }
    >
      <Results searchParams={searchParams} />
    </Suspense>
  );
}