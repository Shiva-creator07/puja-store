"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { saveCategory } from "@/app/admin/categories/actions";

type CategoryValues = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
};

const field =
  "mt-1 w-full rounded-lg border border-amber-300 bg-white px-3 py-2 text-stone-900 outline-none focus:border-orange-600";

export default function CategoryForm({
  category,
}: {
  category?: CategoryValues;
}) {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setError(null);
    startTransition(async () => {
      const res = await saveCategory(fd);
      if (res.error) setError(res.error);
    });
  };

  return (
    <form onSubmit={onSubmit} className="max-w-xl space-y-5">
      <input
        type="hidden"
        name="categoryId"
        value={category ? category.id : ""}
      />

      <label className="block text-sm font-medium text-stone-700">
        Category name
        <input
          name="name"
          required
          maxLength={60}
          defaultValue={category?.name ?? ""}
          className={field}
        />
      </label>

      <label className="block text-sm font-medium text-stone-700">
        URL name
        <input
          name="slug"
          maxLength={60}
          defaultValue={category?.slug ?? ""}
          placeholder="leave blank to create it from the name"
          className={field}
        />
        <span className="mt-1 block text-xs font-normal text-stone-500">
          Used in the web address, for example /category/puja-kits.
          {category ? " Changing it breaks old links to this category." : ""}
        </span>
      </label>

      <label className="block text-sm font-medium text-stone-700">
        Description, optional
        <textarea
          name="description"
          rows={3}
          maxLength={300}
          defaultValue={category?.description ?? ""}
          className={field}
        />
      </label>

      {error && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-orange-700 px-6 py-3 font-semibold text-white hover:bg-orange-800 disabled:opacity-60"
        >
          {pending ? "Saving..." : "Save category"}
        </button>
        <Link
          href="/admin/categories"
          className="text-sm font-medium text-stone-600 hover:underline"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}