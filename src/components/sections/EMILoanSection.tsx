"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Banknote, Calculator, Phone, Info } from "lucide-react";
import { company } from "@/lib/data";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { fadeUp, viewportOnce } from "@/lib/animations";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

export function EMILoanSection() {
  const { t } = useLanguage();
  const topics = t.content.emiTopics;
  const emiCalculatorTopic = topics[1];

  return (
    <section className="py-section-sm sm:py-section">
      <div className="section-container">
        <SectionHeader title={t.sections.emiTitle} subtitle={t.sections.emiSubtitle} />

        <div className="grid lg:grid-cols-3 gap-6">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="lg:col-span-2 glass-card p-6 sm:p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-sky-100 flex items-center justify-center">
                <Banknote className="w-6 h-6 text-sky-700" />
              </div>
              <div>
                <h3 className="font-display font-bold text-xl text-solar-blue-dark">{t.emi.financing}</h3>
                <p className="text-sm text-slate-500">{t.content.emiInfo.description}</p>
              </div>
            </div>

            <p className="text-sm text-slate-600 mb-2">
              {t.emi.interestRate}: <span className="font-semibold text-emerald-400">{t.content.emiInfo.interestRate}</span>
            </p>
            <p className="text-xs text-amber-300 bg-amber-500/10 border border-amber-500/30 rounded-lg px-3 py-2 mb-6 inline-block">{t.content.emiInfo.verifyNote}</p>

            {/* Filter tabs - only EMI Calculator is clickable; all tabs look fully normal */}
            <div className="grid sm:grid-cols-2 gap-3 mb-8">
              {topics.map((topic, i) => {
                const isClickable = i === 1;
                const tab = (
                  <div
                    key={topic}
                    className={`flex items-center gap-2 px-4 py-2.5 min-h-11 rounded-t-lg border text-sm font-medium transition-colors ${
                      isClickable
                        ? "bg-emerald-500/15 border-emerald-500 border-b-[3px] text-emerald-300 font-bold shadow-soft"
                        : "bg-slate-800/60 border-slate-700 text-slate-300 cursor-default"
                    }`}
                  >
                    {isClickable ? <Calculator className="w-4 h-4" /> : <Info className="w-4 h-4 text-slate-400" />}
                    {topic}
                  </div>
                );
                return isClickable ? (
                  <Link key={topic} href="/emi-calculator">{tab}</Link>
                ) : (
                  <div key={topic}>{tab}</div>
                );
              })}
            </div>

            <div className="glass-card p-5 bg-sky-500/10 border-sky-500/20 text-center">
              <p className="text-slate-600 mb-4 text-sm">{t.emi.needMoreInfo}</p>
              <p className="text-sm text-slate-500 mb-4">{t.emi.expertsGuide}</p>
              <a href={`tel:${company.phone}`} className="btn-primary ripple inline-flex">
                <Phone className="w-4 h-4" />
                {t.emi.contactSupportTeam}
              </a>
            </div>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="glass-card p-6 sm:p-8 flex flex-col items-center justify-center text-center bg-gradient-to-br from-sky-500/10 to-emerald-500/10"
          >
            <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center mb-4 shadow-soft">
              <Banknote className="w-8 h-8 text-emerald-400" />
            </div>
            <h4 className="font-display font-semibold text-lg text-solar-blue-dark mb-3">{t.emi.flexibleEmiPlans}</h4>
            <p className="text-sm text-slate-600 leading-relaxed">{t.emi.flexibleEmiDesc}</p>
            <div className="mt-6 pt-6 border-t border-slate-800 w-full">
              <p className="text-2xl font-bold text-emerald-400">{t.content.emiInfo.interestRate}</p>
              <p className="text-xs text-slate-500 mt-1">{t.emi.interestRate}</p>
            </div>
            <Link href="/emi-calculator" className="btn-secondary ripple inline-flex mt-6 w-full justify-center">
              <Calculator className="w-4 h-4" />
              {t.emi.openEmiCalculator}
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
