"use client";

import { ImageIcon } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

export default function GalleryPage() {
  const { t } = useLanguage();
  const categories = t.content.galleryCategories;

  return (
    <div className="pt-28 pb-16 sm:pb-24">
      <div className="section-container">
        <div className="text-center mb-10">
          <h1 className="section-heading">{t.sections.galleryTitle}</h1>
          <p className="section-subheading mx-auto mt-4">{t.sections.gallerySubtitle}</p>
        </div>

        <div className="space-y-10">
          {categories.map((category) => (
            <section key={category}>
              <h2 className="font-display font-semibold text-xl text-solar-blue-dark mb-4">
                {category}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {[1, 2, 3, 4].map((n) => (
                  <div
                    key={n}
                    className="aspect-square rounded-xl bg-gradient-to-br from-slate-100 to-slate-50 border border-dashed border-slate-200 flex flex-col items-center justify-center gap-2"
                  >
                    <ImageIcon className="w-10 h-10 text-slate-300" />
                    <span className="text-xs text-slate-400 font-medium px-2 text-center">
                      {t.sections.galleryPlaceholder}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
