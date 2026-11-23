import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import InfoPage from "@/components/InfoPage";
import { INFO_PAGES } from "@/lib/info-pages";
import { SITE } from "@/lib/site";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return Object.keys(INFO_PAGES).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = INFO_PAGES[slug];
  if (!page) return {};
  return {
    title: `${page.title} | ${SITE.name} (${SITE.short})`,
    description: page.intro,
  };
}

async function Content({ params }: { params: Params }) {
  const { slug } = await params;
  const page = INFO_PAGES[slug];
  if (!page) notFound();
  return <InfoPage page={page} />;
}

export default function InfoRoute({ params }: { params: Params }) {
  return (
    <Suspense
      fallback={
        <p className="px-6 py-10 text-center text-stone-500">Loading...</p>
      }
    >
      <Content params={params} />
    </Suspense>
  );
}