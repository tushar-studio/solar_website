"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Calculator } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Logo } from "@/components/layout/Logo";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

export function Header() {
  const { t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { label: t.nav.learn, href: "/#learn" },
    { label: t.nav.products, href: "/#products" },
    { label: t.nav.subsidy, href: "/subsidy" },
    { label: t.nav.emi, href: "/emi" },
    { label: t.nav.reviews, href: "/#reviews" },
    { label: t.nav.about, href: "/about/story" },
    { label: t.nav.gallery, href: "/gallery" },
    { label: t.nav.contact, href: "/#contact" },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "glass-nav py-3" : "bg-transparent py-4 sm:py-5"
        }`}
      >
        <div className="section-container flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="lg:hidden w-11 h-11 rounded-button flex items-center justify-center hover:bg-white/10 transition-colors"
              aria-label={t.common.openMenu}
            >
              <Menu className="w-5 h-5 text-slate-100" />
            </button>
            <Logo />
          </div>

          <nav className="hidden xl:flex items-center gap-0.5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-2.5 py-2 text-sm font-medium text-slate-300 hover:text-emerald-400 rounded-lg hover:bg-emerald-500/10 transition-all"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <Link
              href="/calculator"
              className="btn-primary !py-2.5 !px-3 sm:!px-4 !text-sm ripple"
            >
              <Calculator className="w-4 h-4" />
              <span className="hidden sm:inline">{t.nav.calculator}</span>
            </Link>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 z-[60] bg-solar-blue-dark/40 backdrop-blur-sm lg:hidden"
            />
            <motion.nav
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="fixed top-0 left-0 bottom-0 z-[70] w-[min(320px,85vw)] glass-card !rounded-none border-r border-white/30 p-6 lg:hidden overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <Logo size="sm" />
                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  className="w-11 h-11 rounded-button flex items-center justify-center hover:bg-slate-800"
                  aria-label={t.common.closeMenu}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <LanguageSwitcher />
              <div className="flex flex-col gap-1 mt-6">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className="block px-4 py-3 rounded-button font-medium text-slate-200 hover:bg-emerald-500/10 hover:text-emerald-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </div>
              <div className="mt-8 pt-8 border-t border-slate-800">
                <Link
                  href="/calculator"
                  onClick={() => setMenuOpen(false)}
                  className="btn-primary w-full ripple"
                >
                  <Calculator className="w-4 h-4" />
                  {t.nav.calculatorFull}
                </Link>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
