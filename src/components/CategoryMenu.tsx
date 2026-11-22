"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

type Category = { id: number; name: string; slug: string };

export default function CategoryMenu({
  categories,
}: {
  categories: Category[];
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex items-center gap-2 font-semibold"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
        Browse Categories
        <svg
          viewBox="0 0 24 24"
          className={`h-4 w-4 transition ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open && (
        <ul className="absolute left-0 top-full z-30 mt-3 w-64 rounded-xl border border-amber-200 bg-white py-2 text-stone-800 shadow-lg">
          {categories.map((c) => (
            <li key={c.id}>
              <Link
                href={`/category/${c.slug}`}
                onClick={() => setOpen(false)}
                className="block px-4 py-2 hover:bg-amber-50"
              >
                {c.name}
              </Link>
            </li>
          ))}
          {categories.length === 0 && (
            <li className="px-4 py-2 text-sm text-stone-500">
              No categories yet
            </li>
          )}
        </ul>
      )}
    </div>
  );
}