"use client";

import Link from "next/link";
import { ArrowLeft, Home, Sun } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

export default function NotFound() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex items-center justify-center bg-solar-white pt-20 pb-16">
      <div className="section-container text-center max-w-lg">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-100 to-sky-100 flex items-center justify-center mx-auto mb-6">
          <Sun className="w-10 h-10 text-emerald-600" />
        </div>

        <h1 className="font-display text-6xl sm:text-7xl font-bold text-solar-blue-dark mb-3">
          404
        </h1>
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-solar-blue-dark mb-4">
          {t.pages.notFound.title}
        </h2>
        <p className="text-slate-600 mb-10 leading-relaxed">
          {t.pages.notFound.description}
        </p>

        <div className="flex flex-wrap gap-4 justify-center">
          <Link href="/" className="btn-primary ripple inline-flex">
            <Home className="w-4 h-4" />
            {t.pages.notFound.backHome}
          </Link>
          <Link href="/calculator" className="btn-secondary ripple inline-flex">
            {t.pages.notFound.openCalculator}
          </Link>
        </div>

        <div className="mt-16 pt-8 border-t border-slate-200">
          <Link
            href="/#contact"
            className="inline-flex items-center gap-2 text-sm text-emerald-700 hover:text-emerald-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {t.pages.notFound.reachUs}
          </Link>
        </div>
      </div>
    </div>
  );
}
