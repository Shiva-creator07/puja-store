import AdminShell from "@/components/AdminShell";
import ProductForm from "@/components/ProductForm";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export const metadata = {
  title: "Edit product | TPS Admin",
  robots: { index: false, follow: false },
};

type Params = Promise<{ id: string }>;

async function EditProduct({ params }: { params: Params }) {
  await requireAdmin();

  const { id } = await params;
  const productId = Number(id);
  if (!Number.isInteger(productId) || productId <= 0) notFound();

  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id: productId } }),
    prisma.category.findMany({
      orderBy: { id: "asc" },
      select: { id: true, name: true },
    }),
  ]);
  if (!product) notFound();

  return (
    <div>
      <div className="flex flex-wrap items-center gap-4">
        <Link
          href="/admin/products"
          className="text-sm font-medium text-orange-700 hover:underline"
        >
          ← All products
        </Link>
        {product.isActive && (
          <Link
            href={`/product/${product.slug}`}
            target="_blank"
            className="text-sm font-medium text-stone-600 hover:underline"
          >
            View on store
          </Link>
        )}
      </div>
      <div className="mt-6">
        <ProductForm
          categories={categories}
          product={{
            id: product.id,
            name: product.name,
            slug: product.slug,
            description: product.description,
            pricePaise: product.pricePaise,
            mrpPaise: product.mrpPaise,
            stock: product.stock,
            categoryId: product.categoryId,
            isActive: product.isActive,
            isFeatured: product.isFeatured,
          }}
        />
      </div>
    </div>
  );
}

export default function EditProductPage({ params }: { params: Params }) {
  return (
    <AdminShell title="Edit product">
      <Suspense fallback={<p className="text-stone-500">Loading...</p>}>
        <EditProduct params={params} />
      </Suspense>
    </AdminShell>
  );
}