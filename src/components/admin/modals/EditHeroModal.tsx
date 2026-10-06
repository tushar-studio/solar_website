"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Check, Loader2 } from "lucide-react";
import { useSiteConfig } from "@/lib/config/SiteConfigProvider";
import { HeroConfig } from "@/lib/site-config";

export function EditHeroModal() {
  const { activeEditor, closeEditor, config, saveConfigAndSync } = useSiteConfig();
  const isOpen = activeEditor === "hero";

  const [heroData, setHeroData] = useState<HeroConfig>({
    badge: "",
    headline: "",
    subheadline: "",
    ctaPrimary: "",
    ctaSecondary: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (config?.hero) {
      setHeroData(config.hero);
    }
  }, [config, isOpen]);

  if (!isOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const res = await saveConfigAndSync({ hero: heroData });
    setIsSaving(false);

    if (res.success) {
      setSavedSuccess(true);
      setTimeout(() => {
        setSavedSuccess(false);
        closeEditor();
        window.location.reload();
      }, 600);
    } else {
      alert("Error saving Hero section: " + res.message);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-2xl max-h-[90vh] bg-slate-900 border border-amber-500/40 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white font-display">Edit Hero Section &amp; Buttons</h2>
                <p className="text-xs text-slate-400">Edit top badge, main headline, description, and CTA button labels</p>
              </div>
            </div>
            <button
              onClick={closeEditor}
              className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-amber-400 mb-1.5">Top Badge Pill</label>
              <input
                type="text"
                value={heroData.badge}
                onChange={(e) => setHeroData({ ...heroData, badge: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm"
                placeholder="e.g. Official Solar Channel Partner — Dehradun"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-amber-400 mb-1.5">Main Headline (H1)</label>
              <input
                type="text"
                value={heroData.headline}
                onChange={(e) => setHeroData({ ...heroData, headline: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-base font-bold"
                placeholder="e.g. Power Your Home with Free Solar Energy"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-amber-400 mb-1.5">Subheadline Description</label>
              <textarea
                rows={3}
                value={heroData.subheadline}
                onChange={(e) => setHeroData({ ...heroData, subheadline: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm leading-relaxed"
                placeholder="Description text"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5">Primary Button Label</label>
                <input
                  type="text"
                  value={heroData.ctaPrimary}
                  onChange={(e) => setHeroData({ ...heroData, ctaPrimary: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm"
                  placeholder="e.g. Calculate My Savings"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5">Secondary Button Label</label>
                <input
                  type="text"
                  value={heroData.ctaSecondary}
                  onChange={(e) => setHeroData({ ...heroData, ctaSecondary: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm"
                  placeholder="e.g. Learn About Solar"
                />
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <span className="text-xs text-slate-400">Click OK to save changes to code and refresh the website.</span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={closeEditor}
                  className="px-4 py-2 text-sm text-slate-400 hover:text-white rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-lg shadow-amber-500/25 flex items-center gap-2 cursor-pointer transition-all"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : savedSuccess ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-300" />
                      <span>Saved!</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>OK — Save &amp; Refresh</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
