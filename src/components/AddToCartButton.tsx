"use client";

import { useState } from "react";
import Link from "next/link";
import { addToCart } from "@/lib/cart";

type Props = {
  productId: number;
  slug: string;
  name: string;
  pricePaise: number;
  stock: number;
};

export default function AddToCartButton(props: Props) {
  const [added, setAdded] = useState(false);

  if (props.stock <= 0) {
    return (
      <button
        disabled
        className="mt-8 w-full rounded-lg bg-stone-300 px-6 py-3 font-semibold text-stone-600 md:w-auto"
      >
        Out of stock
      </button>
    );
  }

  return (
    <div className="mt-8 flex flex-wrap items-center gap-4">
      <button
        onClick={() => {
          addToCart(props);
          setAdded(true);
          setTimeout(() => setAdded(false), 1500);
        }}
        className="w-full rounded-lg bg-orange-700 px-6 py-3 font-semibold text-white hover:bg-orange-800 md:w-auto"
      >
        {added ? "Added ✓" : "Add to cart"}
      </button>
      <Link href="/cart" className="text-sm font-medium text-orange-700 underline">
        View cart
      </Link>
    </div>
  );
}
