import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/format";

export const metadata = {
  title: "Your order | The Puja Store (TPS)",
  robots: { index: false, follow: false },
};

type Params = Promise<{ publicId: string }>;

const STATUS_LABEL: Record<string, string> = {
  PENDING: "Awaiting payment",
  PAID: "Paid",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

async function OrderDetail({ params }: { params: Params }) {
  const { publicId } = await params;
  const order = await prisma.order.findUnique({
    where: { publicId },
    include: { items: { orderBy: { id: "asc" } } },
  });
  if (!order) notFound();

  const orderNo = `TPS-${String(order.id).padStart(5, "0")}`;

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-3xl font-bold text-stone-900">Order received</h1>
      <p className="mt-2 text-stone-600">
        Thank you, {order.customerName}. Your order number is{" "}
        <span className="font-semibold text-stone-900">{orderNo}</span>.
      </p>
      <p className="mt-1 text-sm">
        Status:{" "}
        <span className="rounded-full bg-amber-200 px-3 py-0.5 font-medium text-stone-800">
          {STATUS_LABEL[order.status] ?? order.status}
        </span>
      </p>

      <ul className="mt-8 divide-y divide-amber-200 rounded-xl border border-amber-200 bg-white">
        {order.items.map((i) => (
          <li key={i.id} className="flex justify-between gap-4 p-4">
            <span className="text-stone-800">
              {i.productName} × {i.quantity}
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

      <div className="mt-8 rounded-xl border border-amber-200 bg-white p-5 text-sm text-stone-700">
        <p className="font-semibold text-stone-900">Delivering to</p>
        <p className="mt-1">{order.customerName}</p>
        <p>{order.addressLine}</p>
        <p>
          {order.city}, {order.state} {order.pincode}
        </p>
        <p className="mt-2">Mobile: {order.phone}</p>
        <p>Email: {order.email}</p>
      </div>

      <Link
        href="/"
        className="mt-8 inline-block font-medium text-orange-700 underline"
      >
        Continue shopping
      </Link>
    </main>
  );
}

export default function OrderPage({ params }: { params: Params }) {
  return (
    <Suspense
      fallback={<p className="px-6 py-10 text-center text-stone-500">Loading...</p>}
    >
      <OrderDetail params={params} />
    </Suspense>
  );
}