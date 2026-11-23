import Link from "next/link";

function Tile({
  href,
  title,
  text,
  icon,
  className,
}: {
  href: string;
  title: string;
  text: string;
  icon: string;
  className: string;
}) {
  return (
    <Link
      href={href}
      className={`relative flex min-h-36 flex-col justify-center overflow-hidden rounded-2xl p-6 transition hover:shadow-md ${className}`}
    >
      <span
        aria-hidden="true"
        className="absolute bottom-2 right-4 text-6xl opacity-90"
      >
        {icon}
      </span>
      <h2 className="relative text-xl font-bold text-stone-900">{title}</h2>
      <p className="relative mt-1 max-w-48 text-sm text-stone-700">{text}</p>
      <span className="relative mt-3 inline-block w-fit rounded-lg bg-white px-4 py-2 text-sm font-semibold text-orange-700">
        Shop now
      </span>
    </Link>
  );
}

export default function HeroBanners() {
  return (
    <section className="mx-auto max-w-6xl px-6 pt-6">
      <div className="grid gap-4 lg:grid-cols-5">
        <Link
          href="/shop"
          className="relative flex min-h-80 flex-col justify-center overflow-hidden rounded-2xl bg-linear-to-br from-orange-600 via-orange-500 to-amber-400 p-8 text-white lg:col-span-3 lg:min-h-96"
        >
          <span
            aria-hidden="true"
            className="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-white/15"
          />
          <span
            aria-hidden="true"
            className="absolute -bottom-16 right-20 h-48 w-48 rounded-full bg-white/10"
          />
          <span
            aria-hidden="true"
            className="absolute bottom-6 right-8 text-8xl md:text-9xl"
          >
            🪔
          </span>
          <p className="relative text-sm font-semibold uppercase tracking-widest text-amber-100">
            The Puja Store
          </p>
          <h1 className="relative mt-3 max-w-md text-3xl font-bold leading-tight md:text-5xl">
            Everything for your puja, in one place
          </h1>
          <p className="relative mt-3 max-w-md text-orange-50">
            Puja samagri, festival kits and daily puja items, delivered to your
            door.
          </p>
          <span className="relative mt-6 inline-block w-fit rounded-lg bg-white px-6 py-3 font-semibold text-orange-700">
            Shop now
          </span>
        </Link>

        <div className="grid gap-4 lg:col-span-2">
          <Tile
            href="/category/puja-kits"
            title="Festival Puja Kits"
            text="Complete samagri for every ritual"
            icon="🎁"
            className="bg-linear-to-br from-rose-100 to-orange-200"
          />
          <div className="grid grid-cols-2 gap-4">
            <Tile
              href="/category/daily-puja-items"
              title="Daily Puja"
              text="Everyday essentials"
              icon="🕉️"
              className="bg-linear-to-br from-amber-100 to-yellow-200"
            />
            <Tile
              href="/category/puja-accessories"
              title="Diyas & Thalis"
              text="For your mandir"
              icon="🔔"
              className="bg-linear-to-br from-orange-100 to-rose-200"
            />
          </div>
        </div>
      </div>
    </section>
  );
}