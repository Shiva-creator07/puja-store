import Link from "next/link";
import { SITE } from "@/lib/site";
import { INFO_PAGES } from "@/lib/info-pages";

const SHOP_LINKS = [
  { href: "/shop", label: "All products" },
  { href: "/category/puja-kits", label: "Puja Kits" },
  { href: "/category/daily-puja-items", label: "Daily Puja Items" },
  { href: "/category/oil-and-wicks", label: "Oil & Wicks" },
  { href: "/category/puja-accessories", label: "Puja Accessories" },
  { href: "/category/temple-decor", label: "Temple Decor" },
  { href: "/cart", label: "Your cart" },
];

const linkClass = "hover:text-orange-700 hover:underline";

export default function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-amber-200 bg-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-12 sm:grid-cols-2 md:grid-cols-4">
        <div>
          <p className="text-2xl font-bold text-orange-700">{SITE.name}</p>
          <p className="text-xs tracking-widest text-stone-500">{SITE.short}</p>
          <p className="mt-4 text-sm leading-relaxed text-stone-600">
            Puja samagri, festival kits and daily puja items, delivered to your
            door.
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-stone-900">Shop</h3>
          <ul className="mt-4 space-y-2 text-sm text-stone-600">
            {SHOP_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className={linkClass}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-stone-900">Information</h3>
          <ul className="mt-4 space-y-2 text-sm text-stone-600">
            {Object.entries(INFO_PAGES).map(([slug, page]) => (
              <li key={slug}>
                <Link href={`/${slug}`} className={linkClass}>
                  {page.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-stone-900">Contact</h3>
          <ul className="mt-4 space-y-2 text-sm text-stone-600">
            <li>{SITE.phone}</li>
            <li>{SITE.email}</li>
            <li>{SITE.hours}</li>
            <li>{SITE.address}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-amber-200">
        <p className="mx-auto max-w-6xl px-6 py-4 text-center text-sm text-stone-500">
          © {SITE.name} ({SITE.short}). All rights reserved.
        </p>
      </div>
    </footer>
  );
}