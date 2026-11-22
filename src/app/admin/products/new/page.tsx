import { Suspense } from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import AdminShell from "@/components/AdminShell";
import ProductForm from "@/components/ProductForm";

export const metadata = {
  title: "Add product | TPS Admin",
  robots: { index: false, follow: false },
};

async function NewProduct() {
  await requireAdmin();

  const categories = await prisma.category.findMany({
    orderBy: { id: "asc" },
    select: { id: true, name: true },
  });

  return (
    <div>
      <Link
        href="/admin/products"
        className="text-sm font-medium text-orange-700 hover:underline"
      >
        ← All products
      </Link>
      <div className="mt-6">
        <ProductForm categories={categories} />
      </div>
    </div>
  );
}

export default function NewProductPage() {
  return (
    <AdminShell title="Add product">
      <Suspense fallback={<p className="text-stone-500">Loading...</p>}>
        <NewProduct />
      </Suspense>
    </AdminShell>
  );
}