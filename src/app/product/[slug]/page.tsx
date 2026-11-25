import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatPrice, discountPercent } from "@/lib/format";
import { cldUrl } from "@/lib/images";
import ProductCard from "@/components/ProductCard";
import AddToCartButton from "@/components/AddToCartButton";

type Params = Promise<{ slug: string }>;

async function ProductDetail({ params }: { params: Params }) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  });
  if (!product || !product.isActive) notFound();

  const related = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      isActive: true,
      id: { not: product.id },
    },
    orderBy: { id: "asc" },
    take: 4,
  });

  const off = discountPercent(product.pricePaise, product.mrpPaise);
  const photo = cldUrl(product.imageUrl, 900, 900);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <nav className="mb-6 text-sm text-stone-500">
        <Link href="/" className="hover:text-orange-700">Home</Link>
        <span className="mx-2">/</span>
        <Link
          href={`/category/${product.category.slug}`}
          className="hover:text-orange-700"
        >
          {product.category.name}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-stone-800">{product.name}</span>
      </nav>

      <div className="grid gap-10 md:grid-cols-2">
        <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-2xl border border-amber-200 bg-amber-100 text-8xl">
          {photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={photo}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <span aria-hidden="true">🪔</span>
          )}
          {off !== null && (
            <span className="absolute left-4 top-4 rounded-full bg-orange-700 px-3 py-1 text-sm font-semibold text-white">
              {off}% off
            </span>
          )}
        </div>

        <div>
          <p className="text-sm uppercase tracking-wide text-stone-500">
            {product.category.name}
          </p>
          <h1 className="mt-1 text-3xl font-bold text-stone-900">
            {product.name}
          </h1>
          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-3xl font-bold text-orange-700">
              {formatPrice(product.pricePaise)}
            </span>
            {product.mrpPaise && product.mrpPaise > product.pricePaise && (
              <span className="text-lg text-stone-400 line-through">
                {formatPrice(product.mrpPaise)}
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-stone-500">Inclusive of all taxes</p>

          <p className="mt-4">
            {product.stock === 0 ? (
              <span className="font-medium text-red-600">Out of stock</span>
            ) : product.stock <= 10 ? (
              <span className="font-medium text-orange-700">
                Only {product.stock} left
              </span>
            ) : (
              <span className="font-medium text-green-700">In stock</span>
            )}
          </p>

          {product.description && (
            <p className="mt-6 leading-relaxed text-stone-700">
              {product.description}
            </p>
          )}

          <AddToCartButton
            productId={product.id}
            slug={product.slug}
            name={product.name}
            pricePaise={product.pricePaise}
            stock={product.stock}
          />
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 text-2xl font-bold text-stone-900">
            More from {product.category.name}
          </h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {related.map((p) => (
              <ProductCard
                key={p.id}
                slug={p.slug}
                name={p.name}
                pricePaise={p.pricePaise}
                mrpPaise={p.mrpPaise}
                stock={p.stock}
                imageUrl={p.imageUrl}
              />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

export default function ProductPage({ params }: { params: Params }) {
  return (
    <Suspense
      fallback={<p className="px-6 py-10 text-center text-stone-500">Loading...</p>}
    >
      <ProductDetail params={params} />
    </Suspense>
  );
}