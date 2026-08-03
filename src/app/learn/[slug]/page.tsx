import type { Metadata } from "next";
import { learnCards } from "@/lib/data";
import { LearnPageContent } from "@/components/pages/LearnPageContent";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return learnCards.map((card) => ({ slug: card.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const card = learnCards.find((c) => c.slug === slug);
  if (!card) return { title: "Not Found" };
  return {
    title: `${card.title} | Sundeya Solar`,
    description: card.description,
  };
}

export default async function LearnPage({ params }: Props) {
  const { slug } = await params;
  if (!learnCards.some((c) => c.slug === slug)) notFound();

  return <LearnPageContent slug={slug} />;
}
