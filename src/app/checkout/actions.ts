"use server";

import { prisma } from "@/lib/prisma";
import { INDIAN_STATES } from "@/lib/states";
import { shippingFor } from "@/lib/shipping";

export type PlaceOrderResult =
  | { ok: true; publicId: string }
  | { ok: false; error: string };

function err(error: string): PlaceOrderResult {
  return { ok: false, error };
}

function text(v: unknown, min: number, max: number): string | null {
  if (typeof v !== "string") return null;
  const s = v.trim().replace(/\s+/g, " ");
  return s.length >= min && s.length <= max ? s : null;
}

class OutOfStockError extends Error {
  productName: string;
  constructor(productName: string) {
    super("Out of stock");
    this.productName = productName;
  }
}

export async function placeOrder(input: unknown): Promise<PlaceOrderResult> {
  if (typeof input !== "object" || input === null) {
    return err("Invalid request.");
  }
  const o = input as Record<string, unknown>;

  const customerName = text(o.customerName, 2, 100);
  const email = text(o.email, 5, 120);
  const addressLine = text(o.addressLine, 5, 300);
  const city = text(o.city, 2, 80);
  const state = text(o.state, 2, 80);

  let phone = typeof o.phone === "string" ? o.phone.replace(/\D/g, "") : "";
  if (phone.length === 12 && phone.startsWith("91")) phone = phone.slice(2);
  else if (phone.length === 11 && phone.startsWith("0")) phone = phone.slice(1);

  const pincode = typeof o.pincode === "string" ? o.pincode.trim() : "";

  if (!customerName) return err("Please enter your full name.");
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return err("Please enter a valid email address.");
  }
  if (!/^[6-9]\d{9}$/.test(phone)) {
    return err("Please enter a valid 10-digit mobile number.");
  }
  if (!addressLine) return err("Please enter your full delivery address.");
  if (!city) return err("Please enter your city.");
  if (!state || !INDIAN_STATES.includes(state)) {
    return err("Please choose your state.");
  }
  if (!/^[1-9]\d{5}$/.test(pincode)) {
    return err("Please enter a valid 6-digit pincode.");
  }

  const rawItems = Array.isArray(o.items) ? o.items : [];
  if (rawItems.length === 0 || rawItems.length > 50) {
    return err("Your cart is empty.");
  }

  const qtyById = new Map<number, number>();
  for (const it of rawItems) {
    if (typeof it !== "object" || it === null) return err("Invalid cart.");
    const { productId, qty } = it as Record<string, unknown>;
    if (
      typeof productId !== "number" ||
      !Number.isInteger(productId) ||
      productId <= 0 ||
      typeof qty !== "number" ||
      !Number.isInteger(qty) ||
      qty < 1 ||
      qty > 10
    ) {
      return err("Invalid cart.");
    }
    qtyById.set(productId, Math.min((qtyById.get(productId) ?? 0) + qty, 10));
  }

  try {
    const products = await prisma.product.findMany({
      where: { id: { in: Array.from(qtyById.keys()) }, isActive: true },
    });
    if (products.length !== qtyById.size) {
      return err(
        "Some items in your cart are no longer available. Please review your cart.",
      );
    }

    let subtotalPaise = 0;
    const lines: {
      productId: number;
      productName: string;
      quantity: number;
      unitPaise: number;
    }[] = [];

    for (const p of products) {
      const qty = qtyById.get(p.id) ?? 0;
      if (p.stock < qty) {
        return err(
          `Only ${p.stock} of "${p.name}" in stock. Please update your cart.`,
        );
      }
      subtotalPaise += p.pricePaise * qty;
      lines.push({
        productId: p.id,
        productName: p.name,
        quantity: qty,
        unitPaise: p.pricePaise,
      });
    }
    // Always lock products in the same order, to avoid deadlocks
    lines.sort((a, b) => a.productId - b.productId);

    const shippingPaise = shippingFor(subtotalPaise);
    const totalPaise = subtotalPaise + shippingPaise;

    const order = await prisma.$transaction(async (tx) => {
      // Take the stock first. If another customer got there first, stop.
      for (const l of lines) {
        const res = await tx.product.updateMany({
          where: {
            id: l.productId,
            isActive: true,
            stock: { gte: l.quantity },
          },
          data: { stock: { decrement: l.quantity } },
        });
        if (res.count !== 1) throw new OutOfStockError(l.productName);
      }

      return tx.order.create({
        data: {
          customerName,
          email,
          phone,
          addressLine,
          city,
          state,
          pincode,
          shippingPaise,
          totalPaise,
          stockReserved: true,
          items: { create: lines },
        },
        select: { publicId: true },
      });
    });

    return { ok: true, publicId: order.publicId };
  } catch (e) {
    if (e instanceof OutOfStockError) {
      return err(
        `Sorry, "${e.productName}" just went out of stock. Please update your cart.`,
      );
    }
    console.error("placeOrder failed", e);
    return err("Something went wrong while placing your order. Please try again.");
  }
}