"use client";

import { useLanguage } from "@/lib/i18n/LanguageProvider";

export function PrivacyPageContent() {
  const { t } = useLanguage();
  const { title, paragraphs } = t.pages.privacy;

  return (
    <div className="pt-28 pb-16 sm:pb-24">
      <div className="section-container max-w-3xl">
        <h1 className="section-heading mb-8">{title}</h1>
        <div className="glass-card p-6 sm:p-10 text-slate-600 leading-relaxed space-y-4">
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </div>
    </div>
  );
}
