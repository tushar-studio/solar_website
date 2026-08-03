"use client";

import Link from "next/link";
import { Phone, Mail, MapPin, Instagram } from "lucide-react";
import { company } from "@/lib/data";
import { Logo } from "@/components/layout/Logo";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

export function Footer() {
  const { t } = useLanguage();
  const year = new Date().getFullYear();
  const { links } = t.footer;

  return (
    <footer className="bg-solar-blue-dark text-white pt-16 pb-8">
      <div className="section-container">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 mb-12">
          <div className="lg:col-span-2">
            <div className="mb-4">
              <Logo showName variant="light" />
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-6 max-w-sm">
              {company.tagline} — {t.footer.taglineDesc}
            </p>
            <div className="space-y-2 text-sm text-slate-400">
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400" />
                {company.phone}
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400" />
                {company.email}
              </p>
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                {t.contact.addressValue}
              </p>
            </div>
            <div className="flex items-center gap-3 mt-5">
              <a href={company.social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-9 h-9 rounded-lg bg-slate-700/50 flex items-center justify-center hover:bg-emerald-600 transition-colors">
                <Instagram className="w-4 h-4 text-slate-300" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-slate-300">
              {t.footer.quickLinks}
            </h4>
            <ul className="space-y-2">
              {links.quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-slate-400 hover:text-emerald-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-slate-300">
              {t.footer.productsServices}
            </h4>
            <ul className="space-y-2">
              {[...links.products, ...links.services].map((link) => (
                <li key={link.href + link.label}>
                  <Link href={link.href} className="text-sm text-slate-400 hover:text-emerald-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-slate-300">
              {t.footer.resources}
            </h4>
            <ul className="space-y-2">
              {links.resources.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-slate-400 hover:text-emerald-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
              {links.legal.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-slate-400 hover:text-emerald-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-700/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500">
            © {year} {company.name}. {t.footer.allRightsReserved}
          </p>
          <p className="text-xs text-slate-600">{t.footer.pmSuryaPartner}</p>
        </div>
      </div>
    </footer>
  );
}
