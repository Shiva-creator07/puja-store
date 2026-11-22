import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { formatPrice } from "@/lib/format";
import {
  STATUS_OPTIONS,
  STATUS_LABEL,
  STATUS_BADGE,
} from "@/lib/order-status";
import { updateOrderStatus } from "@/app/admin/actions";
import AdminShell from "@/components/AdminShell";

export const metadata = {
  title: "Order details | TPS Admin",
  robots: { index: false, follow: false },
};

type Params = Promise<{ id: string }>;

async function OrderDetail({ params }: { params: Params }) {
  await requireAdmin();

  const { id } = await params;
  const orderId = Number(id);
  if (!Number.isInteger(orderId) || orderId <= 0) notFound();

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: { orderBy: { id: "asc" } } },
  });
  if (!order) notFound();

  const orderNo = `TPS-${String(order.id).padStart(5, "0")}`;

  return (
    <div>
      <Link
        href="/admin/orders"
        className="text-sm font-medium text-orange-700 hover:underline"
      >
        ← All orders
      </Link>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <h2 className="text-2xl font-bold text-stone-900">{orderNo}</h2>
        <span
          className={`rounded-full px-3 py-0.5 text-sm font-medium ${
            STATUS_BADGE[order.status] ?? "bg-stone-200 text-stone-800"
          }`}
        >
          {STATUS_LABEL[order.status] ?? order.status}
        </span>
      </div>
      <p className="mt-1 text-sm text-stone-500">
        Placed{" "}
        {order.createdAt.toLocaleString("en-IN", {
          timeZone: "Asia/Kolkata",
          dateStyle: "medium",
          timeStyle: "short",
        })}
      </p>

      <div className="mt-8 grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <ul className="divide-y divide-amber-200 rounded-xl border border-amber-200 bg-white">
            {order.items.map((i) => (
              <li key={i.id} className="flex justify-between gap-4 p-4">
                <span className="text-stone-800">
                  {i.productName} × {i.quantity}
                  <span className="ml-2 text-xs text-stone-500">
                    ({formatPrice(i.unitPaise)} each)
                  </span>
                </span>
                <span className="font-semibold text-stone-900">
                  {formatPrice(i.unitPaise * i.quantity)}
                </span>
              </li>
            ))}
            <li className="flex justify-between p-4">
              <span className="font-semibold text-stone-900">Total</span>
              <span className="text-xl font-bold text-orange-700">
                {formatPrice(order.totalPaise)}
              </span>
            </li>
          </ul>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-amber-200 bg-white p-5 text-sm text-stone-700">
            <p className="font-semibold text-stone-900">Update status</p>
            <form
              action={updateOrderStatus}
              className="mt-3 flex items-center gap-3"
            >
              <input type="hidden" name="orderId" value={order.id} />
              <select
                name="status"
                defaultValue={order.status}
                className="rounded-lg border border-amber-300 bg-white px-3 py-2 text-stone-900"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {STATUS_LABEL[s]}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="rounded-lg bg-orange-700 px-4 py-2 font-semibold text-white hover:bg-orange-800"
              >
                Update
              </button>
            </form>
          </div>

          <div className="rounded-xl border border-amber-200 bg-white p-5 text-sm text-stone-700">
            <p className="font-semibold text-stone-900">Customer</p>
            <p className="mt-2">{order.customerName}</p>
            <p>
              <a href={`tel:+91${order.phone}`} className="text-orange-700 hover:underline">
                {order.phone}
              </a>{" "}
              ·{" "}
              <a
                href={`https://wa.me/91${order.phone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-700 hover:underline"
              >
                WhatsApp
              </a>
            </p>
            <p>
              <a href={`mailto:${order.email}`} className="text-orange-700 hover:underline">
                {order.email}
              </a>
            </p>
          </div>

          <div className="rounded-xl border border-amber-200 bg-white p-5 text-sm text-stone-700">
            <p className="font-semibold text-stone-900">Delivery address</p>
            <p className="mt-2">{order.addressLine}</p>
            <p>
              {order.city}, {order.state} {order.pincode}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminOrderPage({ params }: { params: Params }) {
  return (
    <AdminShell title="Order details">
      <Suspense fallback={<p className="text-stone-500">Loading...</p>}>
        <OrderDetail params={params} />
      </Suspense>
    </AdminShell>
  );
}