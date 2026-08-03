"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Star, Quote } from "lucide-react";
import { reviewPlaceholders } from "@/lib/data";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/animations";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

export function CustomerReviewsSection() {
  const { t } = useLanguage();
  const reviews = t.content.reviews;

  return (
    <section id="reviews" className="py-section-sm sm:py-section bg-gradient-to-b from-transparent to-slate-50/50">
      <div className="section-container">
        <SectionHeader
          title={t.sections.reviewsTitle}
          subtitle={t.sections.reviewsSubtitle}
          align="center"
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6"
        >
          {reviewPlaceholders.map((review) => {
            const text = reviews.find((r) => r.id === review.id)?.review ?? review.review;
            return (
              <motion.div key={review.id} variants={fadeUp}>
                <div className="glass-card p-5 sm:p-6 hover:shadow-card transition-shadow h-full flex flex-col">
                  <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-4 border border-white/40">
                    <Image
                      src={review.photo}
                      alt={`${t.sections.reviewsTitle} ${review.id}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                  <div className="flex gap-0.5 mb-3">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <div className="relative flex-1">
                    <Quote className="w-5 h-5 text-emerald-100 absolute -top-1 -left-1" />
                    <p className="text-sm text-slate-600 leading-relaxed pl-4 line-clamp-4">
                      {text}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="text-center mt-12"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-pill bg-emerald-50 border border-emerald-100">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
              ))}
            </div>
            <span className="font-bold text-emerald-700">{t.sections.reviewsPlaceholder}</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
