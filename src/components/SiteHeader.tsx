import Link from "next/link";
import CartLink from "@/components/CartLink";

export default function SiteHeader() {
  return (
    <header className="border-b border-amber-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="block">
          <span className="block text-2xl font-bold text-orange-700">
            The Puja Store
          </span>
          <span className="block text-xs tracking-widest text-stone-500">
            TPS
          </span>
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium text-stone-700">
          <Link href="/#categories">Categories</Link>
          <Link href="/#featured">Featured</Link>
          <Link href="/#products">All products</Link>
          <CartLink />
        </nav>
      </div>
    </header>
  );
}
