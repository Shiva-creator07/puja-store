import Link from "next/link";
import { formatPrice, discountPercent } from "@/lib/format";
import { cldUrl } from "@/lib/images";

type Props = {
  slug: string;
  name: string;
  pricePaise: number;
  mrpPaise: number | null;
  stock: number;
  categoryName?: string;
  imageUrl?: string | null;
};

export default function ProductCard({
  slug,
  name,
  pricePaise,
  mrpPaise,
  stock,
  categoryName,
  imageUrl,
}: Props) {
  const off = discountPercent(pricePaise, mrpPaise);
  const photo = cldUrl(imageUrl, 500, 500);

  return (
    <Link
      href={`/product/${slug}`}
      className="flex flex-col overflow-hidden rounded-xl border border-amber-200 bg-white shadow-sm transition hover:shadow-md"
    >
      <div className="relative flex aspect-square items-center justify-center bg-amber-100 text-5xl">
        {photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photo}
            alt={name}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        ) : (
          <span aria-hidden="true">🪔</span>
        )}
        {off !== null && (
          <span className="absolute left-3 top-3 rounded-full bg-orange-700 px-2 py-0.5 text-xs font-semibold text-white">
            {off}% off
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        {categoryName && (
          <p className="text-xs uppercase tracking-wide text-stone-500">
            {categoryName}
          </p>
        )}
        <h3 className="font-semibold text-stone-900">{name}</h3>
        <div className="mt-auto flex items-baseline gap-2 pt-2">
          <span className="text-lg font-bold text-orange-700">
            {formatPrice(pricePaise)}
          </span>
          {mrpPaise && mrpPaise > pricePaise && (
            <span className="text-sm text-stone-400 line-through">
              {formatPrice(mrpPaise)}
            </span>
          )}
        </div>
        {stock === 0 && (
          <p className="text-xs font-medium text-red-600">Out of stock</p>
        )}
      </div>
    </Link>
  );
}