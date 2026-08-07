"use client";

import { Globe } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import type { Locale } from "@/lib/i18n/translations";

const labels: Record<Locale, string> = {
  en: "EN",
  hi: "हि",
};

const languageNames: Record<Locale, string> = {
  en: "English",
  hi: "हिन्दी",
};

export function LanguageSwitcher() {
  const { t, locale, setLocale } = useLanguage();

  const toggle = () => setLocale(locale === "en" ? "hi" : "en");

  return (
    <button
      type="button"
      onClick={toggle}
      className="flex items-center gap-1.5 px-3 py-2.5 min-h-11 rounded-button text-sm font-medium text-slate-300 hover:text-emerald-400 hover:bg-emerald-500/10 border border-transparent hover:border-emerald-500/30 transition-all"
      aria-label={`${t.common.switchLanguage} — ${languageNames[locale]}`}
    >
      <Globe className="w-4 h-4" />
      <span>{labels[locale]}</span>
    </button>
  );
}
