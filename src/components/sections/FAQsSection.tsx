"use client";

import { SectionHeader } from "@/components/ui/SectionHeader";
import { Accordion } from "@/components/ui/Accordion";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { useSiteConfig } from "@/lib/config/SiteConfigProvider";
import { Pencil } from "lucide-react";

export function FAQsSection() {
  const { t } = useLanguage();
  const { config, isAdminUnlocked, openEditor } = useSiteConfig();

  const faqsList = config.faqs && config.faqs.length > 0
    ? config.faqs.map(f => ({ question: f.question, answer: f.answer }))
    : t.content.faqs;

  return (
    <section id="faqs" className="py-section-sm sm:py-section relative">
      <div className="section-container max-w-3xl">
        <div className="relative">
          <SectionHeader
            title={t.sections.faqsTitle}
            subtitle={t.sections.faqsSubtitle}
            align="center"
          />
          {isAdminUnlocked && (
            <div className="flex justify-center -mt-4 mb-6">
              <button
                type="button"
                onClick={() => openEditor("faqs")}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold text-xs rounded-full shadow-md transition-all hover:scale-105"
              >
                <Pencil className="w-3.5 h-3.5" />
                Edit FAQs & Reviews
              </button>
            </div>
          )}
        </div>
        <Accordion items={faqsList} />
      </div>
    </section>
  );
}

