"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Star } from "lucide-react";
import { reviewPlaceholders } from "@/lib/data";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

export function ReviewPageContent({ id }: { id: string }) {
  const { t } = useLanguage();
  const review = reviewPlaceholders.find((r) => r.id === id);
  const text = t.content.reviews.find((r) => r.id === id)?.review;
  if (!review) return null;

  return (
    <div className="pt-28 pb-16 sm:pb-24">
      <div className="section-container max-w-3xl">
        <Link href="/#reviews" className="inline-flex items-center gap-2 text-sm text-emerald-700 hover:text-emerald-800 mb-8">
          <ArrowLeft className="w-4 h-4" />
          {t.pages.reviews.backHome}
        </Link>

        <div className="glass-card overflow-hidden">
          <div className="relative aspect-[16/9] sm:aspect-[2/1] w-full overflow-hidden">
            <Image src={review.photo} alt={t.pages.reviews.alt} fill className="object-cover" priority />
          </div>
          <div className="p-6 sm:p-10">
            <div className="flex gap-0.5 mb-4">
              {[...Array(review.rating)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
              ))}
            </div>
            <blockquote className="text-lg sm:text-xl text-slate-700 leading-relaxed border-l-4 border-emerald-200 pl-6">
              {text}
            </blockquote>
          </div>
        </div>
      </div>
    </div>
  );
}
