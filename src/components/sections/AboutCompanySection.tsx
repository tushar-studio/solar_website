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
import { useSiteConfig } from "@/lib/config/SiteConfigProvider";
import { Pencil } from "lucide-react";

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
  const { isAdminUnlocked, openEditor } = useSiteConfig();
  const items = t.content.aboutItems;

  return (
    <section id="about" className="py-section-sm sm:py-section scroll-mt-24">
      <div className="section-container">
        <SectionHeader
          title={t.sections.aboutTitle}
          subtitle={t.sections.aboutSubtitle}
        />

        {isAdminUnlocked && (
          <div className="flex justify-start -mt-6 mb-8">
            <button
              type="button"
              onClick={() => openEditor("about")}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-700 dark:text-purple-300 border border-purple-500/40 rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer backdrop-blur-sm"
            >
              <Pencil className="w-3.5 h-3.5" />
              <span>Edit About Us Section</span>
            </button>
          </div>
        )}

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
                    <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald-50 dark:bg-slate-800 border-2 border-emerald-200 dark:border-emerald-500/40 text-[10px] font-bold flex items-center justify-center text-emerald-900 dark:text-emerald-300">
                      {i + 1}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-solar-blue-dark group-hover:text-emerald-400 transition-colors">
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
