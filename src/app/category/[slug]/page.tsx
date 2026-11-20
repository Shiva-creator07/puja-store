import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";

type Params = Promise<{ slug: string }>;

async function CategoryContent({ params }: { params: Params }) {
  const { slug } = await params;
  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      products: { where: { isActive: true }, orderBy: { id: "asc" } },
    },
  });
  if (!category) notFound();

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <nav className="mb-6 text-sm text-stone-500">
        <Link href="/" className="hover:text-orange-700">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-stone-800">{category.name}</span>
      </nav>
      <h1 className="text-3xl font-bold text-stone-900">{category.name}</h1>
      {category.description && (
        <p className="mt-2 text-stone-600">{category.description}</p>
      )}
      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        {category.products.map((p) => (
          <ProductCard
            key={p.id}
            slug={p.slug}
            name={p.name}
            pricePaise={p.pricePaise}
            mrpPaise={p.mrpPaise}
            stock={p.stock}
          />
        ))}
      </div>
      {category.products.length === 0 && (
        <p className="mt-8 text-stone-500">No products in this category yet.</p>
      )}
    </main>
  );
}

export default function CategoryPage({ params }: { params: Params }) {
  return (
    <Suspense
      fallback={<p className="px-6 py-10 text-center text-stone-500">Loading...</p>}
    >
      <CategoryContent params={params} />
    </Suspense>
  );
}
