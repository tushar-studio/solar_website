import type { Metadata } from "next";
import { aboutItems } from "@/lib/data";
import { AboutPageContent } from "@/components/pages/AboutPageContent";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return aboutItems.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = aboutItems.find((a) => a.slug === slug);
  if (!item) return { title: "Not Found" };
  return { title: `${item.title} | Sundeya Solar` };
}

export default async function AboutPage({ params }: Props) {
  const { slug } = await params;
  if (!aboutItems.some((a) => a.slug === slug)) notFound();

  return <AboutPageContent slug={slug} />;
}
