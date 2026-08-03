"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  BookOpen,
  Target,
  Eye,
  Heart,
  Award,
  Users,
  FolderKanban,
  Trophy,
  Leaf,
  ArrowUpRight,
  type LucideIcon,
} from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/animations";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

const iconMap: Record<string, LucideIcon> = {
  story: BookOpen,
  mission: Target,
  vision: Eye,
  values: Heart,
  team: Users,
  projects: FolderKanban,
  impact: Leaf,
  award: Award,
  trophy: Trophy,
};

export function AboutCompanySection() {
  const { t } = useLanguage();
  const items = t.content.aboutItems;

  return (
    <section className="py-section-sm sm:py-section bg-gradient-to-b from-emerald-50/30 to-transparent">
      <div className="section-container">
        <SectionHeader
          title={t.sections.aboutTitle}
          subtitle={t.sections.aboutSubtitle}
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5"
        >
          {items.map((item, i) => {
            const Icon = iconMap[item.slug] ?? BookOpen;
            return (
              <motion.div key={item.slug} variants={fadeUp}>
                <Link
                  href={`/about/${item.slug}`}
                  className="group flex items-center gap-4 p-5 card-interactive"
                >
                  <div className="relative">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-600 to-sky-600 flex items-center justify-center shadow-glow">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-white border-2 border-emerald-200 text-[10px] font-bold flex items-center justify-center text-emerald-700">
                      {i + 1}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-solar-blue-dark group-hover:text-emerald-700 transition-colors">
                      {item.title}
                    </h3>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-colors flex-shrink-0" />
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
