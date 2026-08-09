"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Calculator, ArrowRight, Sparkles } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { fadeUp, viewportOnce } from "@/lib/animations";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

export function SolarCalculatorSection() {
  const { t } = useLanguage();
  const { inputsList, outputsList } = t.calculator;

  return (
    <section id="solar-calculator" className="dark-cta-section py-section-sm sm:py-section bg-solar-blue-dark text-white relative overflow-hidden scroll-mt-24">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500 rounded-full blur-3xl" />
      </div>

      <div className="section-container relative">
        <SectionHeader
          title={t.sections.calculatorTitle}
          subtitle={t.sections.calculatorSubtitle}
          align="center"
        />

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="max-w-4xl mx-auto"
        >
          <div className="glass-card !bg-white/10 !border-white/20 p-6 sm:p-8 lg:p-10">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-emerald-400" />
                  {t.calculator.yourInputs}
                </h3>
                <ul className="space-y-2 text-slate-300 text-sm">
                  {inputsList.map((input) => (
                    <li key={input} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      {input}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  {t.calculator.yourResults}
                </h3>
                <ul className="space-y-2 text-slate-300 text-sm">
                  {outputsList.map((output) => (
                    <li key={output} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      {output}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-4 justify-center">
              <Link href="/calculator" className="btn-primary ripple">
                {t.common.openCalculator}
                <ArrowRight className="w-4 h-4" />
              </Link>
              <button type="button" className="btn-secondary !text-solar-blue-dark ripple">
                {t.common.downloadReport}
              </button>
              <a href="tel:9568486108" className="btn-ghost !text-white hover:!bg-white/10">
                {t.common.callNow}
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
