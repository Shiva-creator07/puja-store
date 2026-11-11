export default function Home() {
  return (
    <div>
      <header className="border-b border-amber-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-2xl font-bold text-orange-700">The Puja Store</h1>
            <p className="text-xs tracking-widest text-stone-500">TPS</p>
          </div>
          <nav className="flex gap-6 text-sm font-medium text-stone-700">
            <a href="#">Shop</a>
            <a href="#">Kits</a>
            <a href="#">About</a>
            <a href="#">Contact</a>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-20 text-center">
        <h2 className="text-4xl font-bold text-stone-900">
          Everything for your puja, in one place
        </h2>
        <p className="mt-4 text-lg text-stone-600">
          Puja samagri, festival kits and daily puja items. Coming soon.
        </p>
      </main>
    </div>
  );
}
