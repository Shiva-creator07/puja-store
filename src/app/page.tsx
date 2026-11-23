import { Suspense } from "react";
import HeroBanners from "@/components/HeroBanners";
import Catalog from "@/components/Catalog";

export default function Home() {
  return (
    <main>
      <HeroBanners />
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