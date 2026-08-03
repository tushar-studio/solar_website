"use client";

import { SolarCalculatorForm } from "@/components/calculator/SolarCalculatorForm";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

export function CalculatorPageContent() {
  const { t } = useLanguage();

  return (
    <div className="pt-28 pb-16 sm:pb-24">
      <div className="section-container">
        <div className="text-center mb-10 sm:mb-14">
          <h1 className="section-heading">{t.pages.calculator.title}</h1>
          <p className="section-subheading mx-auto mt-4">
            {t.pages.calculator.subtitle}
          </p>
        </div>
        <SolarCalculatorForm />
      </div>
    </div>
  );
}
