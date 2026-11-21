"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart, clearCart, cartTotalPaise } from "@/lib/cart";
import { formatPrice } from "@/lib/format";
import { INDIAN_STATES } from "@/lib/states";
import { placeOrder } from "@/app/checkout/actions";

const field =
  "mt-1 w-full rounded-lg border border-amber-300 bg-white px-3 py-2 text-stone-900 outline-none focus:border-orange-600";

export default function CheckoutForm() {
  const items = useCart();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  if (items === null) {
    return <p className="mt-8 text-stone-500">Loading...</p>;
  }

  if (items.length === 0) {
    return (
      <div className="mt-8 rounded-xl border border-amber-200 bg-white p-8 text-center">
        <p className="text-lg text-stone-700">Your cart is empty.</p>
        <Link
          href="/#products"
          className="mt-4 inline-block rounded-lg bg-orange-700 px-6 py-3 font-semibold text-white hover:bg-orange-800"
        >
          Browse products
        </Link>
      </div>
    );
  }

  const total = cartTotalPaise(items);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const get = (k: string) => String(fd.get(k) ?? "");
    const payload = {
      customerName: get("customerName"),
      email: get("email"),
      phone: get("phone"),
      addressLine: get("addressLine"),
      city: get("city"),
      state: get("state"),
      pincode: get("pincode"),
      items: items.map((i) => ({ productId: i.productId, qty: i.qty })),
    };
    setError(null);
    startTransition(async () => {
      const res = await placeOrder(payload);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      router.push(`/order/${res.publicId}`);
      clearCart();
    });
  };

  return (
    <div className="mt-8 grid gap-8 md:grid-cols-3">
      <form onSubmit={onSubmit} className="space-y-4 md:col-span-2">
        <label className="block text-sm font-medium text-stone-700">
          Full name
          <input name="customerName" required maxLength={100} autoComplete="name" className={field} />
        </label>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block text-sm font-medium text-stone-700">
            Email
            <input name="email" type="email" required maxLength={120} autoComplete="email" className={field} />
          </label>
          <label className="block text-sm font-medium text-stone-700">
            Mobile number
            <input name="phone" type="tel" inputMode="numeric" required maxLength={16} autoComplete="tel" placeholder="10-digit mobile" className={field} />
          </label>
        </div>
        <label className="block text-sm font-medium text-stone-700">
          Delivery address
          <textarea name="addressLine" required rows={3} maxLength={300} autoComplete="street-address" placeholder="House no., street, area, landmark" className={field} />
        </label>
        <div className="grid gap-4 md:grid-cols-3">
          <label className="block text-sm font-medium text-stone-700">
            City
            <input name="city" required maxLength={80} autoComplete="address-level2" className={field} />
          </label>
          <label className="block text-sm font-medium text-stone-700">
            State
            <select name="state" required defaultValue="" autoComplete="address-level1" className={field}>
              <option value="" disabled>
                Select state
              </option>
              {INDIAN_STATES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm font-medium text-stone-700">
            Pincode
            <input name="pincode" inputMode="numeric" required maxLength={6} autoComplete="postal-code" className={field} />
          </label>
        </div>

        {error && (
          <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-orange-700 px-6 py-3 font-semibold text-white hover:bg-orange-800 disabled:opacity-60"
        >
          {pending ? "Placing order..." : "Place order"}
        </button>
        <p className="text-xs text-stone-500">
          Online payment is added in the next step. For now your order is saved
          as awaiting payment.
        </p>
      </form>

      <aside className="h-fit rounded-xl border border-amber-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-stone-900">Order summary</h2>
        <ul className="mt-4 space-y-3 text-sm">
          {items.map((i) => (
            <li key={i.productId} className="flex justify-between gap-3">
              <span className="text-stone-700">
                {i.name} × {i.qty}
              </span>
              <span className="font-medium text-stone-900">
                {formatPrice(i.pricePaise * i.qty)}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex justify-between border-t border-amber-200 pt-4">
          <span className="font-semibold text-stone-900">Total</span>
          <span className="text-xl font-bold text-orange-700">
            {formatPrice(total)}
          </span>
        </div>
        <p className="mt-2 text-xs text-stone-500">
          Delivery charges, if any, are confirmed before dispatch.
        </p>
      </aside>
    </div>
  );
}