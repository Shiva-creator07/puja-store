import { Suspense } from "react";
import Link from "next/link";
import { requireAdmin } from "@/lib/admin-auth";
import AdminShell from "@/components/AdminShell";
import CategoryForm from "@/components/CategoryForm";

export const metadata = {
  title: "Add category | TPS Admin",
  robots: { index: false, follow: false },
};

async function NewCategory() {
  await requireAdmin();

  return (
    <div>
      <Link
        href="/admin/categories"
        className="text-sm font-medium text-orange-700 hover:underline"
      >
        ← All categories
      </Link>
      <div className="mt-6">
        <CategoryForm />
      </div>
    </div>
  );
}

export default function NewCategoryPage() {
  return (
    <AdminShell title="Add category">
      <Suspense fallback={<p className="text-stone-500">Loading...</p>}>
        <NewCategory />
      </Suspense>
    </AdminShell>
  );
}