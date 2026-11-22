import { Suspense } from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import AdminShell from "@/components/AdminShell";

export const metadata = {
  title: "Admin | The Puja Store (TPS)",
  robots: { index: false, follow: false },
};

async function Stats() {
  await requireAdmin();

  const [orders, pending, products, lowStock] = await Promise.all([
    prisma.order.count(),
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.product.count(),
    prisma.product.count({ where: { isActive: true, stock: { lte: 5 } } }),
  ]);

  const cards = [
    { label: "Total orders", value: orders, href: "/admin/orders" },
    { label: "Awaiting payment", value: pending, href: "/admin/orders" },
    { label: "Products", value: products, href: "/admin/products" },
    { label: "Low stock (5 or fewer)", value: lowStock, href: "/admin/products" },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {cards.map((c) => (
        <Link
          key={c.label}
          href={c.href}
          className="rounded-xl border border-amber-200 bg-white p-5 shadow-sm transition hover:shadow-md"
        >
          <p className="text-3xl font-bold text-orange-700">{c.value}</p>
          <p className="mt-1 text-sm text-stone-600">{c.label}</p>
        </Link>
      ))}
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <AdminShell title="Dashboard">
      <Suspense fallback={<p className="text-stone-500">Loading...</p>}>
        <Stats />
      </Suspense>
    </AdminShell>
  );
}