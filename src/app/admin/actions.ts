"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { OrderStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  checkPassword,
  createAdminSession,
  destroyAdminSession,
  requireAdmin,
} from "@/lib/admin-auth";

export type LoginState = { error: string | null };

export async function loginAction(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const password = String(formData.get("password") ?? "");
  if (!checkPassword(password)) {
    // small delay makes password guessing slower
    await new Promise((resolve) => setTimeout(resolve, 800));
    return { error: "Incorrect password." };
  }
  await createAdminSession();
  redirect("/admin");
}

export async function logoutAction(): Promise<void> {
  await destroyAdminSession();
  redirect("/admin/login");
}

export async function updateOrderStatus(formData: FormData): Promise<void> {
  await requireAdmin();

  const id = Number(formData.get("orderId"));
  const status = String(formData.get("status") ?? "");
  const valid: string[] = Object.values(OrderStatus);

  if (!Number.isInteger(id) || id <= 0) return;
  if (!valid.includes(status)) return;
  const next = status as OrderStatus;

  try {
    await prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { id },
        include: { items: { orderBy: { productId: "asc" } } },
      });
      if (!order || order.status === next) return;

      let stockReserved = order.stockReserved;

      if (next === OrderStatus.CANCELLED) {
        // Cancelling puts the stock back
        if (order.stockReserved) {
          for (const i of order.items) {
            await tx.product.update({
              where: { id: i.productId },
              data: { stock: { increment: i.quantity } },
            });
          }
          stockReserved = false;
        }
      } else if (order.status === OrderStatus.CANCELLED) {
        // Re-opening a cancelled order takes the stock again, if there is enough
        for (const i of order.items) {
          const res = await tx.product.updateMany({
            where: { id: i.productId, stock: { gte: i.quantity } },
            data: { stock: { decrement: i.quantity } },
          });
          if (res.count !== 1) {
            throw new Error(`Not enough stock of ${i.productName}`);
          }
        }
        stockReserved = true;
      }

      await tx.order.update({
        where: { id },
        data: { status: next, stockReserved },
      });
    });
  } catch (e) {
    console.error("updateOrderStatus failed", e);
    return;
  }

  revalidatePath("/admin");
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${id}`);
  revalidatePath("/admin/products");
  revalidatePath("/", "layout");
}