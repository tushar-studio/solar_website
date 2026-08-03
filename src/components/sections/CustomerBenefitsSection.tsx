"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/animations";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

export function CustomerBenefitsSection() {
  const { t } = useLanguage();
  const benefits = t.content.benefits;

  return (
    <section id="benefits" className="py-section-sm sm:py-section">
      <div className="section-container">
        <SectionHeader
          title={t.sections.benefitsTitle}
          subtitle={t.sections.benefitsSubtitle}
          align="center"
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {benefits.map((benefit) => (
            <motion.div
              key={benefit}
              variants={fadeUp}
              className="glass-card p-5 flex items-start gap-3 hover:shadow-card transition-shadow"
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span className="text-sm font-medium text-solar-blue-dark leading-snug">{benefit}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
