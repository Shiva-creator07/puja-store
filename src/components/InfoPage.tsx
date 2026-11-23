import Link from "next/link";
import type { InfoPageData } from "@/lib/info-pages";

export default function InfoPage({ page }: { page: InfoPageData }) {
  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <nav className="mb-6 text-sm text-stone-500">
        <Link href="/" className="hover:text-orange-700">
          Home
        </Link>
        <span className="mx-2">/</span>
        <span className="text-stone-800">{page.title}</span>
      </nav>

      <h1 className="text-3xl font-bold text-stone-900">{page.title}</h1>
      <p className="mt-3 text-lg text-stone-600">{page.intro}</p>

      <div className="mt-8 space-y-8">
        {page.sections.map((s) => (
          <section key={s.heading}>
            <h2 className="text-xl font-semibold text-stone-900">
              {s.heading}
            </h2>
            <div className="mt-2 space-y-3 leading-relaxed text-stone-700">
              {s.body.map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}