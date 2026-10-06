"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ImageIcon, Pencil } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/animations";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { useSiteConfig } from "@/lib/config/SiteConfigProvider";

const placeholderCount = 2;

export function GallerySection() {
  const { t } = useLanguage();
  const { config, isAdminUnlocked, openEditor } = useSiteConfig();
  const categories = t.content.galleryCategories;
  const galleryItems = config.gallery || [];

  return (
    <section className="py-section-sm sm:py-section relative">
      <div className="section-container">
        <div className="relative">
          <SectionHeader
            title={t.sections.galleryTitle}
            subtitle={t.sections.gallerySubtitle}
            align="center"
          />
          {isAdminUnlocked && (
            <div className="flex justify-center -mt-4 mb-6">
              <button
                type="button"
                onClick={() => openEditor("gallery")}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold text-xs rounded-full shadow-md transition-all hover:scale-105"
              >
                <Pencil className="w-3.5 h-3.5" />
                Edit Gallery Photos
              </button>
            </div>
          )}
        </div>

        <div className="space-y-8">
          {categories.map((category) => {
            const categoryPhotos = galleryItems.filter(
              (item) => item.category?.toLowerCase() === category.toLowerCase()
            );

            return (
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
                  {categoryPhotos.length > 0 ? (
                    categoryPhotos.map((photo) => (
                      <div
                        key={photo.id}
                        className="group relative aspect-square rounded-xl bg-slate-800 border border-slate-700/80 overflow-hidden shadow-md"
                      >
                        <img
                          src={photo.url}
                          alt={photo.caption || category}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {photo.caption && (
                          <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/80 via-black/40 to-transparent text-[11px] text-white font-medium line-clamp-1">
                            {photo.caption}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    [...Array(placeholderCount)].map((_, i) => (
                      <div
                        key={i}
                        className="aspect-square rounded-xl bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-dashed border-slate-700 flex flex-col items-center justify-center gap-2"
                      >
                        <ImageIcon className="w-8 h-8 text-slate-300" />
                        <span className="text-xs text-slate-400 font-medium">
                          {t.sections.galleryPlaceholder}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            );
          })}
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
