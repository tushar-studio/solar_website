"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, Phone, FileText, CheckCircle2 } from "lucide-react";
import { company } from "@/lib/data";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

interface SubsidySection {
  title: string;
  intro?: string;
  bullets?: string[];
  outro?: string;
  steps?: { title: string; desc: string }[];
  qa?: { q: string; a: string }[];
  helpTitle?: string;
  helpText?: string;
}

export function SubsidyPageContent() {
  const { t } = useLanguage();
  const topics = t.content.subsidyTopics;
  const sections = t.pages.subsidy.sections as unknown as SubsidySection[];

  return (
    <div className="pt-28 pb-16 sm:pb-24">
      <div className="section-container max-w-4xl">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-emerald-700 hover:text-emerald-800 mb-8">
          <ArrowLeft className="w-4 h-4" />
          {t.pages.subsidy.backHome}
        </Link>

        <h1 className="section-heading mb-4">{t.pages.subsidy.heading}</h1>
        <p className="section-subheading mb-4">{t.content.subsidyInfo.summary}</p>
        <p className="text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 mb-10 inline-block">
          {t.content.subsidyInfo.verifyNote}
        </p>

        <div className="space-y-8">
          {sections.map((section, i) => {
            const anchor = topics[i].toLowerCase().replace(/\s+/g, "-");
            return (
              <section key={section.title} id={anchor} className="glass-card p-6 sm:p-8 scroll-mt-28">
                <h2 className="font-display text-2xl font-bold text-solar-blue-dark mb-4">{section.title}</h2>
                <div className="text-slate-600 leading-relaxed space-y-4">
                  {section.intro && <p>{section.intro}</p>}

                  {section.bullets && (
                    <ul className="space-y-2">
                      {section.bullets.map((b) => (
                        <li key={b} className="flex items-start gap-2">
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {section.outro && <p>{section.outro}</p>}

                  {section.steps && (
                    <div className="space-y-3">
                      {section.steps.map((step, si) => (
                        <div
                          key={step.title}
                          className={`flex items-center gap-4 p-3 rounded-xl ${
                            si % 2 === 0 ? "bg-emerald-50/50" : "bg-sky-50/50"
                          }`}
                        >
                          <span
                            className={`w-8 h-8 rounded-full text-white flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                              si % 2 === 0 ? "bg-emerald-600" : "bg-sky-600"
                            }`}
                          >
                            {si + 1}
                          </span>
                          <div>
                            <strong className="text-slate-800">{step.title}</strong>
                            <p className="text-sm text-slate-500">{step.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {section.qa && (
                    <div className="space-y-3">
                      {section.qa.map((item) => (
                        <div key={item.q} className="glass-card p-5">
                          <p className="font-semibold text-solar-blue-dark">{item.q}</p>
                          <p className="text-sm text-slate-600 mt-1">{item.a}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {section.helpTitle && section.helpText && (
                    <div className="glass-card p-6 bg-emerald-50/50 border-emerald-100 text-center">
                      <FileText className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
                      <h3 className="font-display font-semibold text-lg text-solar-blue-dark mb-2">
                        {section.helpTitle}
                      </h3>
                      <p className="text-slate-600 mb-6">{section.helpText}</p>
                      <a href={`tel:${company.phone}`} className="btn-primary ripple inline-flex">
                        <Phone className="w-4 h-4" />
                        {t.common.contactSupportTeam}
                      </a>
                    </div>
                  )}
                </div>
              </section>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <Link href="/#contact" className="btn-primary ripple inline-flex">
            {t.pages.subsidy.applyNow}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
