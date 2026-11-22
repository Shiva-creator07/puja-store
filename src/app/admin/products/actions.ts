"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { slugify } from "@/lib/slug";

export type ProductFormState = { error: string | null };

function fail(error: string): ProductFormState {
  return { error };
}

function toPaise(raw: string): number | null {
  const s = raw.trim();
  if (!/^\d+(\.\d{1,2})?$/.test(s)) return null;
  return Math.round(parseFloat(s) * 100);
}

export async function saveProduct(
  formData: FormData,
): Promise<ProductFormState> {
  await requireAdmin();

  const idRaw = String(formData.get("productId") ?? "").trim();
  const editingId = idRaw === "" ? null : Number(idRaw);
  if (editingId !== null && (!Number.isInteger(editingId) || editingId <= 0)) {
    return fail("Invalid product.");
  }

  const name = String(formData.get("name") ?? "")
    .trim()
    .replace(/\s+/g, " ");
  if (name.length < 2 || name.length > 120) {
    return fail("Name must be 2 to 120 characters.");
  }

  let slug = String(formData.get("slug") ?? "").trim().toLowerCase();
  if (slug === "") slug = slugify(name);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || slug.length > 80) {
    return fail(
      "URL name can only use lowercase letters, numbers and hyphens (max 80 characters).",
    );
  }

  const pricePaise = toPaise(String(formData.get("price") ?? ""));
  if (pricePaise === null || pricePaise <= 0 || pricePaise > 10000000) {
    return fail(
      "Enter a valid selling price in rupees, for example 349 or 349.50.",
    );
  }

  const mrpRaw = String(formData.get("mrp") ?? "").trim();
  let mrpPaise: number | null = null;
  if (mrpRaw !== "") {
    mrpPaise = toPaise(mrpRaw);
    if (mrpPaise === null || mrpPaise < pricePaise) {
      return fail(
        "MRP must be a valid amount and not lower than the selling price.",
      );
    }
  }

  const stockRaw = String(formData.get("stock") ?? "").trim();
  if (!/^\d+$/.test(stockRaw)) {
    return fail("Stock must be a whole number (0 or more).");
  }
  const stock = Number(stockRaw);
  if (stock > 100000) return fail("Stock is too large.");

  const categoryId = Number(formData.get("categoryId"));
  if (!Number.isInteger(categoryId) || categoryId <= 0) {
    return fail("Please choose a category.");
  }

  const description = String(formData.get("description") ?? "").trim();
  if (description.length > 2000) {
    return fail("Description is too long (max 2000 characters).");
  }

  const isActive = formData.get("isActive") === "on";
  const isFeatured = formData.get("isFeatured") === "on";

  try {
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
      select: { id: true },
    });
    if (!category) return fail("That category no longer exists.");

    const data = {
      name,
      slug,
      pricePaise,
      mrpPaise,
      stock,
      categoryId,
      description: description === "" ? null : description,
      isActive,
      isFeatured,
    };

    if (editingId === null) {
      await prisma.product.create({ data });
    } else {
      await prisma.product.update({ where: { id: editingId }, data });
    }
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        return fail(
          "Another product already uses that URL name. Please change it.",
        );
      }
      if (e.code === "P2025") return fail("That product no longer exists.");
    }
    console.error("saveProduct failed", e);
    return fail("Something went wrong while saving. Please try again.");
  }

  revalidatePath("/", "layout");
  redirect("/admin/products");
}