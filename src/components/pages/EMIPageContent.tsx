"use client";

import Link from "next/link";
import { ArrowLeft, Phone, Calculator } from "lucide-react";
import { company } from "@/lib/data";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

export function EMIPageContent() {
  const { t } = useLanguage();
  const topics = t.content.emiTopics;

  return (
    <div className="pt-28 pb-16 sm:pb-24">
      <div className="section-container max-w-4xl">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-emerald-700 hover:text-emerald-800 mb-8">
          <ArrowLeft className="w-4 h-4" />
          {t.pages.emi.backHome}
        </Link>

        <h1 className="section-heading mb-4">{t.pages.emi.title}</h1>
        <p className="section-subheading mb-4">{t.content.emiInfo.description}</p>
        <p className="text-sm text-slate-600 mb-2">
          {t.pages.emi.interestRateLabel}: <span className="font-semibold text-emerald-700">{t.content.emiInfo.interestRate}</span>
        </p>
        <p className="text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 mb-10 inline-block">{t.content.emiInfo.verifyNote}</p>

        <div className="space-y-6">
          {/* EMI Calculator - active */}
          <section id="emi-calculator" className="glass-card p-6 sm:p-8 scroll-mt-28 border-l-4 border-emerald-500">
            <h2 className="font-display text-2xl font-bold text-solar-blue-dark mb-4">{t.pages.emi.emiCalcSectionTitle}</h2>
            <div className="text-slate-600 leading-relaxed space-y-3">
              <p>{t.pages.emi.emiCalcSectionDesc}</p>
              <Link href="/emi-calculator" className="btn-primary ripple inline-flex">
                <Calculator className="w-4 h-4" />
                {t.pages.emi.openEmiCalculator}
              </Link>
            </div>
          </section>

          {/* Other topics - info only */}
          {topics.map((topic, i) => {
            if (i === 1) return null;
            return (
              <section key={topic} id={topic.toLowerCase().replace(/\s+/g, "-")} className="glass-card p-6 sm:p-8 scroll-mt-28">
                <h2 className="font-display text-2xl font-bold text-solar-blue-dark mb-4">{topic}</h2>
                <div className="text-slate-500 leading-relaxed space-y-3">
                  {i === 2 ? (
                    <p>
                      {t.content.emiInfo.interestRate} — {t.content.emiInfo.verifyNote}
                    </p>
                  ) : (
                    <p>
                      {t.pages.emi.needMoreInfo} {topic.toLowerCase()}? {t.pages.emi.expertsGuide}
                    </p>
                  )}
                </div>
              </section>
            );
          })}
        </div>

        <div className="mt-10 glass-card p-6 sm:p-8 bg-emerald-50/50 border-emerald-100 text-center">
          <p className="text-slate-600 mb-4">{t.emi.needMoreInfo}</p>
          <p className="text-slate-500 text-sm mb-4">{t.emi.expertsGuide}</p>
          <a href={`tel:${company.phone}`} className="btn-primary ripple inline-flex">
            <Phone className="w-4 h-4" />
            {t.emi.contactSupportTeam}
          </a>
        </div>
      </div>
    </div>
  );
}
