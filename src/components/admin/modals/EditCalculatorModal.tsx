"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calculator, IndianRupee, Check, Loader2 } from "lucide-react";
import { useSiteConfig } from "@/lib/config/SiteConfigProvider";

export function EditCalculatorModal() {
  const { activeEditor, closeEditor, config, saveConfigAndSync } = useSiteConfig();
  const isOpen = activeEditor === "calculator";

  const [capacityRates, setCapacityRates] = useState<Record<string, number>>({});
  const [standardRate, setStandardRate] = useState<number>(60000);
  const [subsidy, setSubsidy] = useState<number>(85800);
  const [tariff, setTariff] = useState<number>(7);
  const [lifetime, setLifetime] = useState<number>(25);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (config?.pricing) {
      const defaultRates: Record<string, number> = {
        "2": 70000,
        "3": 70000,
        "4": 60000,
        "5": 70000,
        "6": 60000,
        "7": 60000,
        "8": 60000,
        "9": 60000,
        "10": 60000,
        ...(config.pricing.capacityRates || {}),
      };
      setCapacityRates(defaultRates);
      setStandardRate(config.pricing.standardCostPerKw || 60000);
      setSubsidy(config.pricing.govSubsidy || 85800);
      setTariff(config.pricing.tariffRate || 7);
      setLifetime(config.pricing.lifetimeYears || 25);
    }
  }, [config, isOpen]);

  if (!isOpen) return null;

  const handleRateChange = (kw: string, value: string) => {
    const num = Number(value);
    setCapacityRates((prev) => ({ ...prev, [kw]: isNaN(num) ? 0 : num }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const updatedPricing = {
      ...config.pricing,
      capacityRates,
      standardCostPerKw: standardRate,
      govSubsidy: subsidy,
      tariffRate: tariff,
      lifetimeYears: lifetime,
      // Keep legacy fallbacks synced
      premiumCostPerKw: capacityRates["3"] || 70000,
    };

    const res = await saveConfigAndSync({ pricing: updatedPricing });
    setIsSaving(false);

    if (res.success) {
      setSavedSuccess(true);
      setTimeout(() => {
        setSavedSuccess(false);
        closeEditor();
        // Refresh page to guarantee all dependent components re-render smoothly
        window.location.reload();
      }, 600);
    } else {
      alert("Error saving calculator settings: " + res.message);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-3xl max-h-[90vh] bg-slate-900 border border-emerald-500/40 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Calculator className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white font-display">Edit Solar Calculator Features &amp; Rates</h2>
                <p className="text-xs text-slate-400">Custom ₹/kW rates for 2kW, 3kW, etc. Math logic remains 100% bug-free.</p>
              </div>
            </div>
            <button
              onClick={closeEditor}
              className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Per-Capacity Rates Grid */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <IndianRupee className="w-4 h-4" /> Capacity Rates (Cost per kW in ₹)
                </label>
                <span className="text-[11px] text-slate-400">Total cost = System kW × Rate</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {["2", "3", "4", "5", "6", "7", "8", "9", "10"].map((kw) => (
                  <div key={kw} className="bg-slate-800/80 border border-slate-700 rounded-xl p-3 space-y-1">
                    <span className="text-xs font-bold text-amber-300">{kw} kW System</span>
                    <div className="relative">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400">₹</span>
                      <input
                        type="number"
                        step="500"
                        value={capacityRates[kw] ?? 60000}
                        onChange={(e) => handleRateChange(kw, e.target.value)}
                        className="w-full pl-6 pr-2 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono text-sm font-semibold focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <span className="text-[10px] text-slate-400 block truncate">
                      = ₹{((Number(kw) * (capacityRates[kw] || 0)) / 100000).toFixed(2)} Lakh
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* General Parameters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-800">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Commercial Standard (&gt;10 kW)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">₹</span>
                  <input
                    type="number"
                    value={standardRate}
                    onChange={(e) => setStandardRate(Number(e.target.value))}
                    className="w-full pl-7 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white font-mono text-sm"
                  />
                </div>
                <span className="text-[11px] text-slate-400">Rate for &gt;10kW</span>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">PM Surya Subsidy (₹)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">₹</span>
                  <input
                    type="number"
                    value={subsidy}
                    onChange={(e) => setSubsidy(Number(e.target.value))}
                    className="w-full pl-7 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white font-mono text-sm"
                  />
                </div>
                <span className="text-[11px] text-slate-400">Fixed residential subsidy</span>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Tariff Rate (₹/kWh Unit)</label>
                <input
                  type="number"
                  step="0.1"
                  value={tariff}
                  onChange={(e) => setTariff(Number(e.target.value))}
                  className="w-full px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white font-mono text-sm"
                />
                <span className="text-[11px] text-slate-400">Bill ÷ Rate = Units</span>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Lifetime (Years)</label>
                <input
                  type="number"
                  value={lifetime}
                  onChange={(e) => setLifetime(Number(e.target.value))}
                  className="w-full px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white font-mono text-sm"
                />
                <span className="text-[11px] text-slate-400">Used for ROI &amp; 25y savings</span>
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
                  className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-500/25 flex items-center gap-2 cursor-pointer transition-all"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving to Code...</span>
                    </>
                  ) : savedSuccess ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-300" />
                      <span>Updated!</span>
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
