"use client";

import Link from "next/link";
import {
  useCart,
  setQty,
  removeFromCart,
  cartTotalPaise,
  MAX_QTY_PER_ITEM,
} from "@/lib/cart";
import { formatPrice } from "@/lib/format";

export default function CartView() {
  const items = useCart();

  if (items === null) {
    return <p className="mt-8 text-stone-500">Loading your cart...</p>;
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

  return (
    <div className="mt-8">
      <ul className="divide-y divide-amber-200 rounded-xl border border-amber-200 bg-white">
        {items.map((i) => {
          const max = Math.min(i.stock, MAX_QTY_PER_ITEM);
          return (
            <li
              key={i.productId}
              className="flex flex-wrap items-center gap-4 p-4"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-amber-100 text-3xl">
                🪔
              </div>
              <div className="min-w-0 flex-1">
                <Link
                  href={`/product/${i.slug}`}
                  className="font-semibold text-stone-900 hover:text-orange-700"
                >
                  {i.name}
                </Link>
                <p className="text-sm text-stone-500">
                  {formatPrice(i.pricePaise)} each
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setQty(i.productId, i.qty - 1)}
                  className="h-8 w-8 rounded border border-amber-300 text-lg"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="w-6 text-center">{i.qty}</span>
                <button
                  onClick={() => setQty(i.productId, i.qty + 1)}
                  disabled={i.qty >= max}
                  className="h-8 w-8 rounded border border-amber-300 text-lg disabled:opacity-40"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
              <p className="w-24 text-right font-semibold text-stone-900">
                {formatPrice(i.pricePaise * i.qty)}
              </p>
              <button
                onClick={() => removeFromCart(i.productId)}
                className="text-sm text-red-600 hover:underline"
              >
                Remove
              </button>
            </li>
          );
        })}
      </ul>

      <div className="mt-6 flex flex-col items-end gap-2">
        <p className="text-lg">
          Subtotal:{" "}
          <span className="text-2xl font-bold text-orange-700">
            {formatPrice(total)}
          </span>
        </p>
        <p className="text-xs text-stone-500">
          Shipping and final total are confirmed at checkout.
        </p>
        <button
          disabled
          className="rounded-lg bg-orange-700 px-6 py-3 font-semibold text-white opacity-60"
        >
          Checkout (coming next)
        </button>
      </div>
    </div>
  );
}
