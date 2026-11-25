"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { saveProduct } from "@/app/admin/products/actions";
import ImageUploader from "@/components/ImageUploader";

type Category = { id: number; name: string };

type ProductValues = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  pricePaise: number;
  mrpPaise: number | null;
  stock: number;
  categoryId: number;
  isActive: boolean;
  isFeatured: boolean;
  imageUrl: string | null;
};

const field =
  "mt-1 w-full rounded-lg border border-amber-300 bg-white px-3 py-2 text-stone-900 outline-none focus:border-orange-600";

function rupees(paise: number | null): string {
  return paise === null ? "" : String(paise / 100);
}

export default function ProductForm({
  categories,
  product,
}: {
  categories: Category[];
  product?: ProductValues;
}) {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setError(null);
    startTransition(async () => {
      const res = await saveProduct(fd);
      if (res.error) setError(res.error);
    });
  };

  return (
    <form onSubmit={onSubmit} className="max-w-2xl space-y-5">
      <input type="hidden" name="productId" value={product ? product.id : ""} />

      <label className="block text-sm font-medium text-stone-700">
        Product name
        <input
          name="name"
          required
          maxLength={120}
          defaultValue={product?.name ?? ""}
          className={field}
        />
      </label>

      <label className="block text-sm font-medium text-stone-700">
        URL name
        <input
          name="slug"
          maxLength={80}
          defaultValue={product?.slug ?? ""}
          placeholder="leave blank to create it from the name"
          className={field}
        />
        <span className="mt-1 block text-xs font-normal text-stone-500">
          Used in the web address, for example /product/daily-puja-kit.
          {product ? " Changing it breaks old links to this product." : ""}
        </span>
      </label>

      <label className="block text-sm font-medium text-stone-700">
        Category
        <select
          name="categoryId"
          required
          defaultValue={product ? String(product.categoryId) : ""}
          className={field}
        >
          <option value="" disabled>
            Choose a category
          </option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </label>

      <div className="grid gap-5 md:grid-cols-3">
        <label className="block text-sm font-medium text-stone-700">
          Selling price (₹)
          <input
            name="price"
            required
            inputMode="decimal"
            defaultValue={rupees(product?.pricePaise ?? null)}
            placeholder="349"
            className={field}
          />
        </label>
        <label className="block text-sm font-medium text-stone-700">
          MRP (₹), optional
          <input
            name="mrp"
            inputMode="decimal"
            defaultValue={rupees(product?.mrpPaise ?? null)}
            placeholder="599"
            className={field}
          />
        </label>
        <label className="block text-sm font-medium text-stone-700">
          Stock
          <input
            name="stock"
            required
            inputMode="numeric"
            defaultValue={product ? String(product.stock) : "0"}
            className={field}
          />
        </label>
      </div>

      <ImageUploader initialUrl={product?.imageUrl ?? null} />

      <label className="block text-sm font-medium text-stone-700">
        Description
        <textarea
          name="description"
          rows={4}
          maxLength={2000}
          defaultValue={product?.description ?? ""}
          className={field}
        />
      </label>

      <div className="flex flex-wrap gap-6 text-sm text-stone-800">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="isActive"
            defaultChecked={product ? product.isActive : true}
          />
          Visible on the store
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="isFeatured"
            defaultChecked={product ? product.isFeatured : false}
          />
          Show under Featured
        </label>
      </div>

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
          {pending ? "Saving..." : "Save product"}
        </button>
        <Link
          href="/admin/products"
          className="text-sm font-medium text-stone-600 hover:underline"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}