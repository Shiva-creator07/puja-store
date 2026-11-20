"use client";

import { useSyncExternalStore } from "react";

export type CartItem = {
  productId: number;
  slug: string;
  name: string;
  pricePaise: number;
  stock: number;
  qty: number;
};

const KEY = "tps-cart-v1";
const MAX_PER_ITEM = 10;
const EMPTY: CartItem[] = [];

let lastRaw: string | null = null;
let lastItems: CartItem[] = EMPTY;
const listeners = new Set<() => void>();

function isItem(x: unknown): x is CartItem {
  if (typeof x !== "object" || x === null) return false;
  const o = x as Record<string, unknown>;
  return (
    typeof o.productId === "number" &&
    typeof o.slug === "string" &&
    typeof o.name === "string" &&
    typeof o.pricePaise === "number" &&
    typeof o.stock === "number" &&
    typeof o.qty === "number" &&
    o.qty > 0
  );
}

function readCart(): CartItem[] {
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(KEY);
  } catch {
    return lastItems;
  }
  if (raw === lastRaw) return lastItems;
  lastRaw = raw;
  try {
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    lastItems = Array.isArray(parsed) ? parsed.filter(isItem) : EMPTY;
  } catch {
    lastItems = EMPTY;
  }
  return lastItems;
}

function writeCart(items: CartItem[]) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(items));
  } catch {
    /* storage unavailable */
  }
  listeners.forEach((l) => l());
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY || e.key === null) onChange();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onStorage);
  };
}

// null means "not loaded yet" (server render / first paint)
export function useCart(): CartItem[] | null {
  return useSyncExternalStore<CartItem[] | null>(subscribe, readCart, () => null);
}

export function addToCart(item: Omit<CartItem, "qty">) {
  const max = Math.min(item.stock, MAX_PER_ITEM);
  if (max <= 0) return;
  const items = readCart();
  const existing = items.find((i) => i.productId === item.productId);
  if (existing) {
    writeCart(
      items.map((i) =>
        i.productId === item.productId
          ? { ...i, ...item, qty: Math.min(i.qty + 1, max) }
          : i,
      ),
    );
  } else {
    writeCart([...items, { ...item, qty: 1 }]);
  }
}

export function setQty(productId: number, qty: number) {
  writeCart(
    readCart().flatMap((i) => {
      if (i.productId !== productId) return [i];
      if (qty <= 0) return [];
      return [{ ...i, qty: Math.min(qty, Math.min(i.stock, MAX_PER_ITEM)) }];
    }),
  );
}

export function removeFromCart(productId: number) {
  writeCart(readCart().filter((i) => i.productId !== productId));
}

export function clearCart() {
  writeCart([]);
}

export function cartTotalPaise(items: CartItem[]): number {
  return items.reduce((sum, i) => sum + i.pricePaise * i.qty, 0);
}

export const MAX_QTY_PER_ITEM = MAX_PER_ITEM;
