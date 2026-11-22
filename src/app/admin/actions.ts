"use server";

import {
    checkPassword,
    createAdminSession,
    destroyAdminSession,
    requireAdmin,
} from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { OrderStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

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

  await prisma.order.update({
    where: { id },
    data: { status: status as OrderStatus },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${id}`);
}