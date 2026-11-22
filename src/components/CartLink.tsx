"use client";

import Link from "next/link";
import { useCart, cartTotalPaise } from "@/lib/cart";
import { formatPrice } from "@/lib/format";

export default function CartLink() {
  const items = useCart();
  const count = items ? items.reduce((n, i) => n + i.qty, 0) : 0;
  const total = items ? cartTotalPaise(items) : 0;

  return (
    <Link
      href="/cart"
      aria-label="Cart"
      className="flex items-center gap-3 text-white"
    >
      <span className="relative flex h-11 w-11 items-center justify-center rounded-full bg-white text-orange-700">
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="9" cy="20" r="1.5" />
          <circle cx="18" cy="20" r="1.5" />
          <path d="M2 3h3l2.6 12.4a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.5L21 8H6" />
        </svg>
        <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-900 px-1 text-xs font-semibold text-white">
          {count}
        </span>
      </span>
      <span className="hidden font-semibold sm:inline">
        {formatPrice(total)}
      </span>
    </Link>
  );
}