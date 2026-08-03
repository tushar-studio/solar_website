"use client";

import { SectionHeader } from "@/components/ui/SectionHeader";
import { Accordion } from "@/components/ui/Accordion";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

export function FAQsSection() {
  const { t } = useLanguage();

  return (
    <section id="faqs" className="py-section-sm sm:py-section bg-slate-50/50">
      <div className="section-container max-w-3xl">
        <SectionHeader
          title={t.sections.faqsTitle}
          subtitle={t.sections.faqsSubtitle}
          align="center"
        />
        <Accordion items={t.content.faqs} />
      </div>
    </section>
  );
}
