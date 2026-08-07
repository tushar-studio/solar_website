"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ImageIcon } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/animations";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

const placeholderCount = 2;

export function GallerySection() {
  const { t } = useLanguage();
  const categories = t.content.galleryCategories;

  return (
    <section className="py-section-sm sm:py-section">
      <div className="section-container">
        <SectionHeader
          title={t.sections.galleryTitle}
          subtitle={t.sections.gallerySubtitle}
          align="center"
        />

        <div className="space-y-8">
          {categories.map((category) => (
            <motion.div
              key={category}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
            >
              <h3 className="font-display font-semibold text-lg text-solar-blue-dark mb-4">
                {category}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                {[...Array(placeholderCount)].map((_, i) => (
                  <div
                    key={i}
                    className="aspect-square rounded-xl bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-dashed border-slate-700 flex flex-col items-center justify-center gap-2"
                  >
                    <ImageIcon className="w-8 h-8 text-slate-300" />
                    <span className="text-xs text-slate-400 font-medium">
                      {t.sections.galleryPlaceholder}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link href="/gallery" className="btn-secondary ripple inline-flex">
            {t.common.viewGallery}
          </Link>
        </div>
      </div>
    </section>
  );
}
