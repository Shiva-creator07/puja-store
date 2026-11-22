import AdminShell from "@/components/AdminShell";
import { requireAdmin } from "@/lib/admin-auth";
import { formatPrice } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Suspense } from "react";

export const metadata = {
  title: "Products | TPS Admin",
  robots: { index: false, follow: false },
};

async function ProductTable() {
  await requireAdmin();

  const products = await prisma.product.findMany({
    orderBy: { id: "asc" },
    include: { category: true },
  });

  if (products.length === 0) {
    return (
      <p className="rounded-xl border border-amber-200 bg-white p-8 text-center text-stone-600">
        No products yet.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-amber-200 bg-white">
      <table className="w-full text-left text-sm">
        <thead className="bg-amber-100 text-stone-700">
          <tr>
            <th className="px-4 py-3">Product</th>
            <th className="px-4 py-3">Category</th>
            <th className="px-4 py-3 text-right">Price</th>
            <th className="px-4 py-3 text-right">MRP</th>
            <th className="px-4 py-3 text-right">Stock</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Featured</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-amber-100">
          {products.map((p) => (
            <tr key={p.id} className="hover:bg-amber-50">
              <td className="px-4 py-3 font-semibold">
                <Link
                  href={`/admin/products/${p.id}`}
                  className="text-orange-700 hover:underline"
                >
                  {p.name}
                </Link>
              </td>
              <td className="px-4 py-3 text-stone-600">{p.category.name}</td>
              <td className="px-4 py-3 text-right font-semibold">
                {formatPrice(p.pricePaise)}
              </td>
              <td className="px-4 py-3 text-right text-stone-500">
                {p.mrpPaise ? formatPrice(p.mrpPaise) : "-"}
              </td>
              <td
                className={`px-4 py-3 text-right ${
                  p.stock <= 5 ? "font-semibold text-red-600" : ""
                }`}
              >
                {p.stock}
              </td>
              <td className="px-4 py-3">
                <span
                  className={`rounded-full px-3 py-0.5 text-xs font-medium ${
                    p.isActive
                      ? "bg-green-100 text-green-800"
                      : "bg-stone-200 text-stone-700"
                  }`}
                >
                  {p.isActive ? "Active" : "Hidden"}
                </span>
              </td>
              <td className="px-4 py-3 text-stone-600">
                {p.isFeatured ? "Yes" : "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function AdminProductsPage() {
  return (
    <AdminShell title="Products">
      <div className="mb-4 flex justify-end">
        <Link
          href="/admin/products/new"
          className="rounded-lg bg-orange-700 px-5 py-2 text-sm font-semibold text-white hover:bg-orange-800"
        >
          Add product
        </Link>
      </div>
      <Suspense fallback={<p className="text-stone-500">Loading...</p>}>
        <ProductTable />
      </Suspense>
    </AdminShell>
  );
}