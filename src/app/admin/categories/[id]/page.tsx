import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { deleteCategory } from "@/app/admin/categories/actions";
import AdminShell from "@/components/AdminShell";
import CategoryForm from "@/components/CategoryForm";

export const metadata = {
  title: "Edit category | TPS Admin",
  robots: { index: false, follow: false },
};

type Params = Promise<{ id: string }>;

async function EditCategory({ params }: { params: Params }) {
  await requireAdmin();

  const { id } = await params;
  const categoryId = Number(id);
  if (!Number.isInteger(categoryId) || categoryId <= 0) notFound();

  const category = await prisma.category.findUnique({
    where: { id: categoryId },
    include: { _count: { select: { products: true } } },
  });
  if (!category) notFound();

  return (
    <div>
      <div className="flex flex-wrap items-center gap-4">
        <Link
          href="/admin/categories"
          className="text-sm font-medium text-orange-700 hover:underline"
        >
          ← All categories
        </Link>
        <Link
          href={`/category/${category.slug}`}
          target="_blank"
          className="text-sm font-medium text-stone-600 hover:underline"
        >
          View on store
        </Link>
      </div>

      <div className="mt-6">
        <CategoryForm
          category={{
            id: category.id,
            name: category.name,
            slug: category.slug,
            description: category.description,
          }}
        />
      </div>

      <div className="mt-10 max-w-xl rounded-xl border border-amber-200 bg-white p-5 text-sm text-stone-700">
        {category._count.products === 0 ? (
          <form action={deleteCategory}>
            <input type="hidden" name="categoryId" value={category.id} />
            <p>This category has no products, so it can be deleted.</p>
            <button
              type="submit"
              className="mt-3 rounded-lg border border-red-300 px-4 py-2 font-semibold text-red-700 hover:bg-red-50"
            >
              Delete empty category
            </button>
          </form>
        ) : (
          <p>
            This category has {category._count.products}{" "}
            {category._count.products === 1 ? "product" : "products"}. Move or
            edit those products first if you want to delete it.
          </p>
        )}
      </div>
    </div>
  );
}

export default function EditCategoryPage({ params }: { params: Params }) {
  return (
    <AdminShell title="Edit category">
      <Suspense fallback={<p className="text-stone-500">Loading...</p>}>
        <EditCategory params={params} />
      </Suspense>
    </AdminShell>
  );
}