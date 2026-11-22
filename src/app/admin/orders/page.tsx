import AdminShell from "@/components/AdminShell";
import { requireAdmin } from "@/lib/admin-auth";
import { formatPrice } from "@/lib/format";
import { STATUS_BADGE, STATUS_LABEL } from "@/lib/order-status";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Suspense } from "react";

export const metadata = {
  title: "Orders | TPS Admin",
  robots: { index: false, follow: false },
};

async function OrderList() {
  await requireAdmin();

  const orders = await prisma.order.findMany({
    orderBy: { id: "desc" },
    take: 100,
    include: { _count: { select: { items: true } } },
  });

  if (orders.length === 0) {
    return (
      <p className="rounded-xl border border-amber-200 bg-white p-8 text-center text-stone-600">
        No orders yet.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-amber-200 bg-white">
      <table className="w-full text-left text-sm">
        <thead className="bg-amber-100 text-stone-700">
          <tr>
            <th className="px-4 py-3">Order</th>
            <th className="px-4 py-3">Placed</th>
            <th className="px-4 py-3">Customer</th>
            <th className="px-4 py-3">City</th>
            <th className="px-4 py-3 text-right">Items</th>
            <th className="px-4 py-3 text-right">Total</th>
            <th className="px-4 py-3">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-amber-100">
          {orders.map((o) => (
            <tr key={o.id} className="hover:bg-amber-50">
              <td className="px-4 py-3 font-semibold">
                <Link
                  href={`/admin/orders/${o.id}`}
                  className="text-orange-700 hover:underline"
                >
                  TPS-{String(o.id).padStart(5, "0")}
                </Link>
              </td>
              <td className="px-4 py-3 text-stone-600">
                {o.createdAt.toLocaleString("en-IN", {
                  timeZone: "Asia/Kolkata",
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </td>
              <td className="px-4 py-3 text-stone-900">{o.customerName}</td>
              <td className="px-4 py-3 text-stone-600">{o.city}</td>
              <td className="px-4 py-3 text-right">{o._count.items}</td>
              <td className="px-4 py-3 text-right font-semibold">
                {formatPrice(o.totalPaise)}
              </td>
              <td className="px-4 py-3">
                <span
                  className={`rounded-full px-3 py-0.5 text-xs font-medium ${
                    STATUS_BADGE[o.status] ?? "bg-stone-200 text-stone-800"
                  }`}
                >
                  {STATUS_LABEL[o.status] ?? o.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function AdminOrdersPage() {
  return (
    <AdminShell title="Orders">
      <Suspense fallback={<p className="text-stone-500">Loading...</p>}>
        <OrderList />
      </Suspense>
    </AdminShell>
  );
}