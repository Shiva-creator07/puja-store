import { Suspense } from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import AdminShell from "@/components/AdminShell";

export const metadata = {
  title: "Categories | TPS Admin",
  robots: { index: false, follow: false },
};

async function CategoryTable() {
  await requireAdmin();

  const categories = await prisma.category.findMany({
    orderBy: { id: "asc" },
    include: { _count: { select: { products: true } } },
  });

  if (categories.length === 0) {
    return (
      <p className="rounded-xl border border-amber-200 bg-white p-8 text-center text-stone-600">
        No categories yet.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-amber-200 bg-white">
      <table className="w-full text-left text-sm">
        <thead className="bg-amber-100 text-stone-700">
          <tr>
            <th className="px-4 py-3">Category</th>
            <th className="px-4 py-3">Web address</th>
            <th className="px-4 py-3 text-right">Products</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-amber-100">
          {categories.map((c) => (
            <tr key={c.id} className="hover:bg-amber-50">
              <td className="px-4 py-3 font-semibold">
                <Link
                  href={`/admin/categories/${c.id}`}
                  className="text-orange-700 hover:underline"
                >
                  {c.name}
                </Link>
              </td>
              <td className="px-4 py-3 text-stone-500">/category/{c.slug}</td>
              <td className="px-4 py-3 text-right">{c._count.products}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function AdminCategoriesPage() {
  return (
    <AdminShell title="Categories">
      <div className="mb-4 flex justify-end">
        <Link
          href="/admin/categories/new"
          className="rounded-lg bg-orange-700 px-5 py-2 text-sm font-semibold text-white hover:bg-orange-800"
        >
          Add category
        </Link>
      </div>
      <Suspense fallback={<p className="text-stone-500">Loading...</p>}>
        <CategoryTable />
      </Suspense>
    </AdminShell>
  );
}