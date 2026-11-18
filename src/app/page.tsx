import { Suspense } from "react";
import Catalog from "@/components/Catalog";

export default function Home() {
  return (
    <main>
      <section className="mx-auto max-w-6xl px-6 py-16 text-center">
        <h1 className="text-4xl font-bold text-stone-900">
          Everything for your puja, in one place
        </h1>
        <p className="mt-4 text-lg text-stone-600">
          Puja samagri, festival kits and daily puja items, delivered to your
          door.
        </p>
      </section>
      <Suspense
        fallback={
          <p className="px-6 py-10 text-center text-stone-500">
            Loading products...
          </p>
        }
      >
        <Catalog />
      </Suspense>
    </main>
  );
}
