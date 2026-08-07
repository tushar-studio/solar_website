"use client";

import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin, Instagram } from "lucide-react";
import { company } from "@/lib/data";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

const CALCULATOR_HREFS = ["/calculator", "/subsidy", "/calculator", "/emi-calculator", "/calculator"];
const SCHEME_HREFS = ["/subsidy", "/subsidy", "/subsidy", "/subsidy"];
const TRUST_HREFS = ["/about/story", "/#benefits", "/privacy", "/#contact"];

const pillClass =
  "inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all duration-200 text-sm font-medium min-h-11";

const linkClass =
  "inline-flex items-center gap-2 text-sm text-slate-600 hover:text-emerald-600 hover:translate-x-1 transition-all duration-200 cursor-pointer";

function ColumnTitle({ children }: { children: React.ReactNode }) {
  return (
    <h4 className="font-display font-semibold text-slate-900 mb-4 flex items-center gap-2">
      <span className="w-1.5 h-5 rounded-full bg-gradient-solar" />
      {children}
    </h4>
  );
}

export function Footer() {
  const { t } = useLanguage();
  const year = new Date().getFullYear();

  const calculators = t.footer.calculators.map((label, i) => ({
    label,
    href: CALCULATOR_HREFS[i] ?? "/calculator",
  }));
  const scheme = t.footer.scheme.map((label, i) => ({
    label,
    href: SCHEME_HREFS[i] ?? "/subsidy",
  }));
  const trust = t.footer.trust.map((label, i) => ({
    label,
    href: TRUST_HREFS[i] ?? "/#contact",
  }));

  return (
    <footer className="relative z-10 pt-16 pb-8">
      <div className="section-container">
        <div className="footer-light-card bg-white/95 backdrop-blur-2xl border border-slate-200 shadow-2xl shadow-slate-950/40 rounded-[2.5rem] p-8 sm:p-12 text-slate-800">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
            {/* Column 1 — Brand & Direct Contact */}
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="relative w-12 h-12 rounded-xl overflow-hidden ring-2 ring-emerald-500/30 flex-shrink-0">
                  <Image src={company.logo} alt={company.name} fill className="object-cover" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-display font-bold text-2xl text-slate-900 leading-tight truncate">
                    {company.name}
                  </h3>
                  <p className="text-emerald-600 font-semibold text-xs sm:text-sm mt-0.5 truncate">
                    {company.tagline}
                  </p>
                </div>
              </div>

              <p className="text-slate-600 text-sm leading-relaxed mb-6 max-w-sm">
                {t.footer.taglineDesc}
              </p>

              <div className="space-y-2.5">
                <a href={`tel:${company.phone}`} className={pillClass}>
                  <Phone className="w-4 h-4" />
                  {company.phone}
                </a>
                <a
                  href={`mailto:${company.email}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${pillClass} !whitespace-normal text-left`}
                >
                  <Mail className="w-4 h-4 flex-shrink-0" />
                  {company.email}
                </a>
                <a
                  href={company.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${pillClass} !whitespace-normal text-left`}
                >
                  <MapPin className="w-4 h-4 flex-shrink-0" />
                  {t.contact.addressValue}
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={pillClass}
                >
                  <Instagram className="w-4 h-4" />
                  {t.footer.instagramHandle}
                </a>
              </div>
            </div>

            {/* Column 2 — Solar Calculators & Tools */}
            <div>
              <ColumnTitle>{t.footer.calculatorsTitle}</ColumnTitle>
              <ul className="space-y-2.5">
                {calculators.map((item) => (
                  <li key={item.label}>
                    <Link href={item.href} className={linkClass}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3 — PM Surya Ghar Scheme */}
            <div>
              <ColumnTitle>{t.footer.schemeTitle}</ColumnTitle>
              <ul className="space-y-2.5">
                {scheme.map((item) => (
                  <li key={item.label}>
                    <Link href={item.href} className={linkClass}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4 — Quick Links & Trust */}
            <div>
              <ColumnTitle>{t.footer.quickLinksTrustTitle}</ColumnTitle>
              <ul className="space-y-2.5">
                {trust.map((item) => (
                  <li key={item.label}>
                    <Link href={item.href} className={linkClass}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-slate-200/80 my-6" />
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-sm text-slate-500">
              © {year} {company.name}. {t.footer.allRightsReserved}
            </p>
            <p className="text-sm text-slate-600 text-center sm:text-right">{t.footer.poweredBy}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
