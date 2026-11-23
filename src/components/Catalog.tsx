import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";

const LOOK: Record<string, { icon: string; bg: string }> = {
  "puja-kits": { icon: "🎁", bg: "from-orange-200 to-amber-100" },
  "daily-puja-items": { icon: "🕉️", bg: "from-amber-200 to-yellow-100" },
  "oil-and-wicks": { icon: "🪔", bg: "from-yellow-200 to-orange-100" },
  "puja-accessories": { icon: "🔔", bg: "from-rose-200 to-orange-100" },
  "temple-decor": { icon: "🌼", bg: "from-orange-200 to-rose-100" },
};
const DEFAULT_LOOK = { icon: "🪔", bg: "from-amber-200 to-orange-100" };

export default async function Catalog() {
  const [categories, featured, latest] = await Promise.all([
    prisma.category.findMany({
      orderBy: { id: "asc" },
      include: {
        _count: {
          select: { products: { where: { isActive: true } } },
        },
      },
    }),
    prisma.product.findMany({
      where: { isActive: true, isFeatured: true },
      orderBy: { id: "asc" },
      include: { category: true },
      take: 8,
    }),
    prisma.product.findMany({
      where: { isActive: true },
      orderBy: { id: "desc" },
      include: { category: true },
      take: 8,
    }),
  ]);

  const shownCategories = categories.filter((c) => c._count.products > 0);

  return (
    <>
      {shownCategories.length > 0 && (
        <section
          id="categories"
          className="mx-auto max-w-6xl scroll-mt-6 px-6 py-10"
        >
          <h2 className="mb-8 text-2xl font-bold text-stone-900">
            Popular Categories
          </h2>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
            {shownCategories.map((c) => {
              const look = LOOK[c.slug] ?? DEFAULT_LOOK;
              return (
                <Link
                  key={c.id}
                  href={`/category/${c.slug}`}
                  className="group text-center"
                >
                  <div
                    className={`mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-linear-to-br text-5xl shadow-sm transition group-hover:shadow-md ${look.bg}`}
                  >
                    <span aria-hidden="true">{look.icon}</span>
                  </div>
                  <p className="mt-3 font-semibold text-stone-900 group-hover:text-orange-700">
                    {c.name}
                  </p>
                  <p className="text-xs text-stone-500">
                    {c._count.products}{" "}
                    {c._count.products === 1 ? "product" : "products"}
                  </p>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {featured.length > 0 && (
        <section
          id="featured"
          className="mx-auto max-w-6xl scroll-mt-6 px-6 py-10"
        >
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
      )}

      {latest.length > 0 && (
        <section
          id="products"
          className="mx-auto max-w-6xl scroll-mt-6 px-6 py-10"
        >
          <div className="mb-6 flex items-end justify-between gap-4">
            <h2 className="text-2xl font-bold text-stone-900">New arrivals</h2>
            <Link
              href="/shop"
              className="text-sm font-semibold text-orange-700 hover:underline"
            >
              View all products →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {latest.map((p) => (
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
      )}
    </>
  );
}