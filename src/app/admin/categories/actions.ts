"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { slugify } from "@/lib/slug";

export type CategoryFormState = { error: string | null };

function fail(error: string): CategoryFormState {
  return { error };
}

export async function saveCategory(
  formData: FormData,
): Promise<CategoryFormState> {
  await requireAdmin();

  const idRaw = String(formData.get("categoryId") ?? "").trim();
  const editingId = idRaw === "" ? null : Number(idRaw);
  if (editingId !== null && (!Number.isInteger(editingId) || editingId <= 0)) {
    return fail("Invalid category.");
  }

  const name = String(formData.get("name") ?? "")
    .trim()
    .replace(/\s+/g, " ");
  if (name.length < 2 || name.length > 60) {
    return fail("Name must be 2 to 60 characters.");
  }

  let slug = String(formData.get("slug") ?? "").trim().toLowerCase();
  if (slug === "") slug = slugify(name);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || slug.length > 60) {
    return fail(
      "URL name can only use lowercase letters, numbers and hyphens (max 60 characters).",
    );
  }

  const description = String(formData.get("description") ?? "").trim();
  if (description.length > 300) {
    return fail("Description is too long (max 300 characters).");
  }

  try {
    const data = {
      name,
      slug,
      description: description === "" ? null : description,
    };
    if (editingId === null) {
      await prisma.category.create({ data });
    } else {
      await prisma.category.update({ where: { id: editingId }, data });
    }
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        return fail(
          "Another category already uses that URL name. Please change it.",
        );
      }
      if (e.code === "P2025") return fail("That category no longer exists.");
    }
    console.error("saveCategory failed", e);
    return fail("Something went wrong while saving. Please try again.");
  }

  revalidatePath("/", "layout");
  redirect("/admin/categories");
}

export async function deleteCategory(formData: FormData): Promise<void> {
  await requireAdmin();

  const id = Number(formData.get("categoryId"));
  if (!Number.isInteger(id) || id <= 0) return;

  // Never delete a category that still has products
  const count = await prisma.product.count({ where: { categoryId: id } });
  if (count > 0) return;

  try {
    await prisma.category.delete({ where: { id } });
  } catch (e) {
    console.error("deleteCategory failed", e);
  }

  revalidatePath("/", "layout");
  redirect("/admin/categories");
}