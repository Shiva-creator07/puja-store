import Link from "next/link";
import { logoutAction } from "@/app/admin/actions";

export default function AdminShell({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-amber-200 pb-4">
        <nav className="flex flex-wrap items-center gap-5 text-sm font-medium text-stone-700">
          <Link href="/admin" className="font-semibold text-orange-700">
            TPS Admin
          </Link>
          <Link href="/admin/orders">Orders</Link>
          <Link href="/admin/products">Products</Link>
          <Link href="/admin/categories">Categories</Link>
          <Link href="/" target="_blank">
            View store
          </Link>
        </nav>
        <form action={logoutAction}>
          <button type="submit" className="text-sm text-red-600 hover:underline">
            Log out
          </button>
        </form>
      </div>
      <h1 className="mb-6 text-3xl font-bold text-stone-900">{title}</h1>
      {children}
    </div>
  );
}