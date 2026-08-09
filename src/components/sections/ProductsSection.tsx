"use client";

import { motion } from "framer-motion";
import {
  Sun,
  Battery,
  Zap,
  PanelTop,
  Cpu,
  Cable,
  Shield,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/animations";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

export function ProductsSection() {
  const { t } = useLanguage();
  const { groups, hybridReadyTitle, hybridReadyDesc, pmSuryaCompatible } = t.content.products;

  const groupIcons: LucideIcon[] = [Sun, PanelTop, Cpu, Cable, Wrench];

  return (
    <section id="products" className="py-section-sm sm:py-section scroll-mt-24">
      <div className="section-container">
        <SectionHeader title={t.sections.productsTitle} subtitle={t.sections.productsSubtitle} />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {groups.map((group, gi) => {
            const Icon = groupIcons[gi] ?? Sun;
            return (
              <motion.div key={group.title} variants={fadeUp} className="glass-card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-emerald-700" />
                  </div>
                  <h3 className="font-display font-semibold text-solar-blue-dark">{group.title}</h3>
                </div>
                <ul className="space-y-2">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-sm text-slate-600 leading-relaxed"
                    >
                      <Shield className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}

          <motion.div variants={fadeUp} className="glass-card p-6 bg-gradient-to-br from-emerald-500/10 to-sky-500/10 md:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                <Battery className="w-5 h-5 text-amber-700" />
              </div>
              <h3 className="font-display font-semibold text-solar-blue-dark">{hybridReadyTitle}</h3>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              {hybridReadyDesc}
            </p>
            <div className="mt-4 flex items-center gap-2 text-emerald-700 text-sm font-medium">
              <Zap className="w-4 h-4" />
              {pmSuryaCompatible}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
