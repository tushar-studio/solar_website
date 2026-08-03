import type { Metadata } from "next";
import { reviewPlaceholders } from "@/lib/data";
import { ReviewPageContent } from "@/components/pages/ReviewPageContent";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return reviewPlaceholders.map((r) => ({ id: r.id }));
}

export async function generateMetadata(): Promise<Metadata> {
  return { title: "Customer Review | Sundeya Solar", description: "See what our customers say about Sundeya Solar." };
}

export default async function ReviewPage({ params }: Props) {
  const { id } = await params;
  if (!reviewPlaceholders.some((r) => r.id === id)) notFound();

  return <ReviewPageContent id={id} />;
}
