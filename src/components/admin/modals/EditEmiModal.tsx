"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calculator, Percent, Check, Loader2 } from "lucide-react";
import { useSiteConfig } from "@/lib/config/SiteConfigProvider";

export function EditEmiModal() {
  const { activeEditor, closeEditor, config, saveConfigAndSync } = useSiteConfig();
  const isOpen = activeEditor === "emi";

  const [interestRate, setInterestRate] = useState<number>(5.75);
  const [tenures, setTenures] = useState<string>("1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20");
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (config?.pricing) {
      setInterestRate(config.pricing.emiInterestRate || 5.75);
      if (config.pricing.tenureYears) {
        setTenures(config.pricing.tenureYears.join(", "));
      }
    }
  }, [config, isOpen]);

  if (!isOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const tenureArray = tenures
      .split(",")
      .map((t) => Number(t.trim()))
      .filter((n) => !isNaN(n) && n > 0);

    const updatedPricing = {
      ...config.pricing,
      emiInterestRate: interestRate,
      tenureYears: tenureArray.length > 0 ? tenureArray : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20],
    };

    const res = await saveConfigAndSync({ pricing: updatedPricing });
    setIsSaving(false);

    if (res.success) {
      setSavedSuccess(true);
      setTimeout(() => {
        setSavedSuccess(false);
        closeEditor();
        window.location.reload();
      }, 600);
    } else {
      alert("Error saving EMI settings: " + res.message);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-xl max-h-[90vh] bg-slate-900 border border-sky-500/40 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400">
                <Percent className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white font-display">Edit EMI Calculator Settings</h2>
                <p className="text-xs text-slate-400">Configure default interest rate and loan tenure options</p>
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
              <label className="block text-xs font-bold uppercase text-sky-400 mb-1.5">
                Default Loan Annual Interest Rate (%)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-mono text-base font-semibold focus:outline-none focus:border-sky-500"
                  placeholder="5.75"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">%</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Standard PM Surya Ghar solar loan rate is around 5.75% per annum.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">
                Available Loan Tenures (in Years, comma-separated)
              </label>
              <input
                type="text"
                value={tenures}
                onChange={(e) => setTenures(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-mono text-sm"
                placeholder="1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Options displayed in the EMI tenure dropdown.
              </p>
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
                  className="px-6 py-2.5 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-lg shadow-sky-500/25 flex items-center gap-2 cursor-pointer transition-all"
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
