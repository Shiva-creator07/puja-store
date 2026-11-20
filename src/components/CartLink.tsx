"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart";

export default function CartLink() {
  const items = useCart();
  const count = items ? items.reduce((n, i) => n + i.qty, 0) : 0;

  return (
    <Link href="/cart" className="font-medium text-stone-700">
      Cart
      {count > 0 && (
        <span className="ml-1 rounded-full bg-orange-700 px-2 py-0.5 text-xs font-semibold text-white">
          {count}
        </span>
      )}
    </Link>
  );
}
