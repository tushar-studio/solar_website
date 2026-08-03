"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

interface AboutPageData {
  title: string;
  paragraphs: string[];
  highlights?: string[];
}

export function AboutPageContent({ slug }: { slug: string }) {
  const { t } = useLanguage();
  const pages = t.pages.about as unknown as Record<string, AboutPageData>;
  const content = pages[slug];
  if (!content) return null;

  const items = t.content.aboutItems;

  return (
    <div className="pt-28 pb-16 sm:pb-24">
      <div className="section-container max-w-4xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-emerald-700 hover:text-emerald-800 mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          {t.pages.about.backHome}
        </Link>

        <h1 className="section-heading mb-4">{content.title}</h1>

        <div className="glass-card p-6 sm:p-10 space-y-4 text-slate-600 leading-relaxed">
          {content.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
          {content.highlights && (
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4 pt-4 border-t border-slate-100">
              {content.highlights.map((h) => (
                <li key={h} className="flex items-center gap-2 text-sm font-medium text-emerald-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                  {h}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          {items
            .filter((a) => a.slug !== slug)
            .map((a) => (
              <Link
                key={a.slug}
                href={`/about/${a.slug}`}
                className="px-4 py-2 rounded-pill bg-emerald-50 text-emerald-700 text-sm font-medium hover:bg-emerald-100 transition-colors"
              >
                {a.title}
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
}
