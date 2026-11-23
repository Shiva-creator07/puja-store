import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { SITE } from "@/lib/site";
import CartLink from "@/components/CartLink";
import CategoryMenu from "@/components/CategoryMenu";

type Category = { id: number; name: string; slug: string };

function HeaderBar({ categories }: { categories: Category[] }) {
  return (
    <header>
      <div className="border-b border-amber-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-3 px-6 py-4">
          <Link href="/" className="block shrink-0">
            <span className="block text-2xl font-bold text-orange-700">
              {SITE.name}
            </span>
            <span className="block text-xs tracking-widest text-stone-500">
              {SITE.short}
            </span>
          </Link>

          <form
            action="/shop"
            method="get"
            role="search"
            className="order-last flex w-full md:order-none md:w-auto md:flex-1"
          >
            <input
              name="q"
              type="search"
              maxLength={80}
              placeholder="Search for products"
              aria-label="Search products"
              className="w-full rounded-l-full border border-amber-300 bg-white px-5 py-3 text-stone-900 outline-none focus:border-orange-600"
            />
            <button
              type="submit"
              aria-label="Search"
              className="rounded-r-full bg-orange-700 px-5 text-white hover:bg-orange-800"
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
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
            </button>
          </form>

          <div className="ml-auto hidden text-sm leading-tight lg:block">
            <p className="text-stone-500">Need help?</p>
            <p className="font-semibold text-orange-700">{SITE.phone}</p>
          </div>
          <div className="hidden text-sm leading-tight lg:block">
            <p className="text-stone-500">Delivery</p>
            <p className="font-semibold text-orange-700">{SITE.dispatchNote}</p>
          </div>
        </div>
      </div>

      <nav className="bg-orange-700 text-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-8 gap-y-2 px-6 py-3">
          <CategoryMenu categories={categories} />
          <Link href="/" className="font-medium hover:underline">
            Home
          </Link>
          <Link href="/shop" className="font-medium hover:underline">
            Shop
          </Link>
          <Link href="/about" className="font-medium hover:underline">
            About Us
          </Link>
          <Link href="/contact" className="font-medium hover:underline">
            Contact Us
          </Link>
          <div className="ml-auto">
            <CartLink />
          </div>
        </div>
      </nav>
    </header>
  );
}

export default async function SiteHeader() {
  let categories: Category[] = [];
  try {
    categories = await prisma.category.findMany({
      orderBy: { id: "asc" },
      select: { id: true, name: true, slug: true },
    });
  } catch {
    // If the database is briefly unreachable, still show the header
    categories = [];
  }
  return <HeaderBar categories={categories} />;
}

export function SiteHeaderFallback() {
  return <HeaderBar categories={[]} />;
}