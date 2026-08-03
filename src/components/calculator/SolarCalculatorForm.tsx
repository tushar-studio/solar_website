"use client";

import { useState, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Calculator,
  Download,
  Phone,
  IndianRupee,
  Zap,
  TrendingUp,
  Clock,
  Leaf,
  Loader2,
} from "lucide-react";
import { indianStates } from "@/lib/data";
import { fadeUp, viewportOnce } from "@/lib/animations";
import { Button } from "@/components/ui/Button";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

const DURATION_OPTIONS = ["5", "10", "15", "20", "25"];
const TIMELINE_YEARS = [5, 10, 15, 20, 25];

interface CalculatorResult {
  recommendedSystem: string;
  estimatedCost: string;
  subsidy: string;
  finalCost: string;
  roi: string;
  monthlySavings: string;
  paybackPeriod: string;
  annualSavings: string;
  lifetimeSavings: string;
  annualSavingsNumber: number;
  finalCostNumber: number;
}

function calculateSolar(inputs: {
  monthlyBill: number;
  state: string;
  roofType: string;
  propertyType: string;
  powerBackup: boolean;
  durationYears: number;
}): CalculatorResult {
  const bill = inputs.monthlyBill || 0;
  const kw = Math.max(1, Math.ceil((bill / 1000) * 1.2));
  const costPerKw =
    inputs.propertyType === "Commercial" ? 55000 : inputs.propertyType === "Industrial" ? 50000 : 60000;
  const estimatedCost = kw * costPerKw;
  const subsidy = 85800;
  const finalCost = estimatedCost - subsidy;
  const monthlySavings = bill * 0.85;
  const annualSavings = monthlySavings * 12;
  const paybackYears = finalCost / annualSavings;
  const lifetimeSavings = annualSavings * inputs.durationYears;
  const roi = ((lifetimeSavings - finalCost) / finalCost) * 100;

  return {
    recommendedSystem: `${kw} kW`,
    estimatedCost: `₹${estimatedCost.toLocaleString("en-IN")}`,
    subsidy: `₹${Math.round(subsidy).toLocaleString("en-IN")}`,
    finalCost: `₹${Math.round(finalCost).toLocaleString("en-IN")}`,
    roi: `${roi.toFixed(0)}%`,
    monthlySavings: `₹${Math.round(monthlySavings).toLocaleString("en-IN")}`,
    paybackPeriod: `${paybackYears.toFixed(1)}`,
    annualSavings: `₹${Math.round(annualSavings).toLocaleString("en-IN")}`,
    lifetimeSavings: `₹${Math.round(lifetimeSavings).toLocaleString("en-IN")}`,
    annualSavingsNumber: annualSavings,
    finalCostNumber: finalCost,
  };
}

export function SolarCalculatorForm() {
  const { t } = useLanguage();
  const [monthlyBill, setMonthlyBill] = useState("");
  const [state, setState] = useState("");
  const [roofType, setRoofType] = useState("RCC Flat");
  const [propertyType, setPropertyType] = useState("Residential");
  const [powerBackup, setPowerBackup] = useState(false);
  const [duration, setDuration] = useState("25");
  const [showResults, setShowResults] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [errors, setErrors] = useState<{ bill?: string; state?: string }>({});

  const labels = t.calculator.resultLabels;

  const results = useMemo(() => {
    if (!showResults || !monthlyBill) return null;
    return calculateSolar({
      monthlyBill: parseFloat(monthlyBill),
      state,
      roofType,
      propertyType,
      powerBackup,
      durationYears: parseInt(duration),
    });
  }, [showResults, monthlyBill, state, roofType, propertyType, powerBackup, duration]);

  const resultCards = results
    ? [
        { icon: Zap, label: labels.recommendedSystem, value: results.recommendedSystem },
        { icon: IndianRupee, label: labels.installationCost, value: results.estimatedCost },
        { icon: Leaf, label: labels.governmentSubsidy, value: results.subsidy },
        { icon: IndianRupee, label: labels.finalCost, value: results.finalCost },
        { icon: TrendingUp, label: labels.roi, value: results.roi },
        { icon: IndianRupee, label: labels.monthlySavings, value: results.monthlySavings },
        { icon: Clock, label: labels.paybackPeriod, value: `${results.paybackPeriod} ${t.calculator.years}` },
        { icon: IndianRupee, label: labels.annualSavings, value: results.annualSavings },
        {
          icon: IndianRupee,
          label: `${labels.lifetimeSavings} (${duration} ${t.calculator.years})`,
          value: results.lifetimeSavings,
        },
      ]
    : [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors: { bill?: string; state?: string } = {};
    const billNum = parseFloat(monthlyBill);
    if (!monthlyBill || isNaN(billNum) || billNum < 500) nextErrors.bill = t.calculator.errorBill;
    if (!state) nextErrors.state = t.calculator.errorState;
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setShowResults(false);
      return;
    }
    setShowResults(true);
  };

  const handleDownload = useCallback(() => {
    if (!results) return;
    setDownloading(true);
    const inputs = [
      `${t.calculator.monthlyBill}: ₹${parseInt(monthlyBill).toLocaleString("en-IN")}`,
      `${t.calculator.state}: ${state || "-"}`,
      `${t.calculator.roofType}: ${roofType}`,
      `${t.calculator.propertyType}: ${propertyType}`,
      `${t.calculator.powerBackup}: ${powerBackup ? t.common.yes : t.common.no}`,
      `${t.calculator.durationLabel}: ${duration} ${t.calculator.years}`,
    ];
    const rows = resultCards.map((c) => `${c.label}: ${c.value}`);
    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${t.calculator.reportTitle}</title><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:system-ui,sans-serif;color:#0F172A;padding:40px;max-width:680px;margin:0 auto}.hdr{border-bottom:3px solid #2E7D32;padding-bottom:16px;margin-bottom:24px}.hdr h1{font-size:22px;color:#1E3A5F}.hdr p{font-size:13px;color:#059669;margin-top:4px}.sec{margin-bottom:20px}.sec h2{font-size:15px;color:#1E3A5F;margin-bottom:8px;border-bottom:1px solid #E2E8F0;padding-bottom:4px}.row{display:flex;justify-content:space-between;padding:6px 0;font-size:14px;border-bottom:1px solid #F1F5F9}.row b{font-weight:600}.hl{color:#059669;font-weight:700;font-size:16px}.ftr{margin-top:32px;padding-top:16px;border-top:1px solid #E2E8F0;font-size:11px;color:#94A3B8;text-align:center}@media print{body{padding:20px}}</style></head><body><div class="hdr"><h1>${t.calculator.reportTitle}</h1><p>${t.common.pmSuryaPartner}</p></div><div class="sec"><h2>${t.calculator.reportInputs}</h2>${inputs.map(i => `<div class="row"><span>${i.split(": ")[0]}</span><span>${i.split(": ")[1]}</span></div>`).join("")}</div><div class="sec"><h2>${t.calculator.reportResults}</h2>${rows.map((r,i) => `<div class="row b"><span>${r.split(": ")[0]}</span><span class="${[3,5,7,8].includes(i)?"hl":""}">${r.split(": ")[1]}</span></div>`).join("")}</div><div class="ftr"><p>${t.calculator.reportGenerated}</p><p style="margin-top:12px">${t.calculator.reportFooter}</p></div><script>window.onload=function(){window.print()}</script></body></html>`;
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const w = window.open(url, "_blank");
    if (w) {
      w.onload = () => {
        URL.revokeObjectURL(url);
        setDownloading(false);
      };
      setTimeout(() => {
        URL.revokeObjectURL(url);
        setDownloading(false);
      }, 3000);
    } else setDownloading(false);
  }, [results, monthlyBill, state, roofType, propertyType, powerBackup, duration, resultCards, t]);

  const maxTimeline = results ? results.annualSavingsNumber * 25 : 1;

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="glass-card p-6 sm:p-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-solar flex items-center justify-center">
            <Calculator className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="font-display font-bold text-xl text-solar-blue-dark">
              {t.calculator.cardTitle}
            </h2>
            <p className="text-sm text-slate-500">{t.calculator.cardSubtitle}</p>
          </div>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit} noValidate>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              {t.calculator.monthlyBill}
            </label>
            <input
              type="number"
              value={monthlyBill}
              onChange={(e) => setMonthlyBill(e.target.value)}
              placeholder={t.calculator.monthlyBillPlaceholder}
              className={`input-field ${errors.bill ? "!border-red-400" : ""}`}
              min="500"
            />
            {errors.bill && <p className="text-xs text-red-600 mt-1">{errors.bill}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">{t.calculator.state}</label>
            <select
              value={state}
              onChange={(e) => setState(e.target.value)}
              className={`select-field ${errors.state ? "!border-red-400" : ""}`}
            >
              <option value="">{t.calculator.selectState}</option>
              {indianStates.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            {errors.state && <p className="text-xs text-red-600 mt-1">{errors.state}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">{t.calculator.roofType}</label>
            <select
              value={roofType}
              onChange={(e) => setRoofType(e.target.value)}
              className="select-field"
            >
              {t.calculator.roofOptions.map((opt, i) => (
                <option key={opt} value={["RCC Flat", "Tiled Roof", "Metal Sheet", "Ground Mount"][i]}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              {t.calculator.propertyType}
            </label>
            <select
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              className="select-field"
            >
              {t.calculator.propertyOptions.map((opt, i) => (
                <option key={opt} value={["Residential", "Commercial", "Industrial"][i]}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {t.calculator.durationLabel}
            </label>
            <div className="flex flex-wrap gap-2">
              {DURATION_OPTIONS.map((years) => {
                const active = duration === years;
                return (
                  <button
                    key={years}
                    type="button"
                    onClick={() => setDuration(years)}
                    aria-pressed={active}
                    className={`px-4 py-2 rounded-pill text-sm font-semibold transition-all duration-200 border ${
                      active
                        ? "bg-gradient-solar text-white border-transparent shadow-soft"
                        : "bg-white border-slate-200 text-slate-600 hover:border-emerald-300 hover:text-emerald-700"
                    }`}
                  >
                    {years} {t.calculator.years}
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-slate-400 mt-2">{t.calculator.durationHint}</p>
          </div>

          <label className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 cursor-pointer">
            <input
              type="checkbox"
              checked={powerBackup}
              onChange={(e) => setPowerBackup(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
            />
            <span className="text-sm font-medium text-slate-700">
              {t.calculator.powerBackup}
            </span>
          </label>

          <Button type="submit" className="w-full">
            {t.calculator.calculate}
          </Button>
        </form>
      </motion.div>

      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="space-y-4"
      >
        {!results ? (
          <div className="glass-card p-8 h-full flex flex-col items-center justify-center text-center min-h-[400px]">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mb-4">
              <TrendingUp className="w-8 h-8 text-emerald-500" />
            </div>
            <h3 className="font-display font-semibold text-lg text-solar-blue-dark">
              {t.calculator.resultsTitle}
            </h3>
            <p className="text-sm text-slate-500 mt-2 max-w-xs">
              {t.calculator.resultsHint}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {resultCards.map((card) => (
                <div key={card.label} className="glass-card p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <card.icon className="w-4 h-4 text-emerald-500" />
                    <p className="text-xs text-slate-500">{card.label}</p>
                  </div>
                  <p className="font-display font-bold text-lg text-solar-blue-dark">
                    {card.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Savings timeline chart */}
            <div className="glass-card p-5">
              <h4 className="font-display font-semibold text-base text-solar-blue-dark mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-500" />
                {t.calculator.savingsAfterTitle}
              </h4>
              <div className="space-y-3">
                {TIMELINE_YEARS.map((years) => {
                  const value = results.annualSavingsNumber * years;
                  const pct = Math.max(4, Math.round((value / maxTimeline) * 100));
                  const isSelected = parseInt(duration) === years;
                  return (
                    <div key={years} className="flex items-center gap-3">
                      <span className="w-20 sm:w-24 text-xs text-slate-500 flex-shrink-0">
                        {years} {t.calculator.years}
                      </span>
                      <div className="flex-1 h-7 rounded-lg bg-slate-100 overflow-hidden">
                        <div
                          className={`h-full rounded-lg transition-all duration-500 ${
                            isSelected ? "bg-gradient-solar" : "bg-emerald-400/60"
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="w-24 sm:w-28 text-right text-xs font-semibold text-solar-blue-dark flex-shrink-0 tabular-nums">
                        ₹{Math.round(value).toLocaleString("en-IN")}
                      </span>
                    </div>
                  );
                })}
              </div>
              <p className="text-xs text-slate-400 mt-3">
                {labels.lifetimeSavings}: {results.lifetimeSavings} ({duration}{" "}
                {t.calculator.years})
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button variant="secondary" onClick={handleDownload} disabled={downloading}>
                {downloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                {downloading ? t.common.generating : t.calculator.downloadReport}
              </Button>
              <a href="tel:9568486108" className="btn-primary ripple inline-flex">
                <Phone className="w-4 h-4" />
                {t.calculator.callNow}
              </a>
            </div>

            <p className="text-xs text-slate-400">
              {t.calculator.disclaimer}
            </p>
          </>
        )}
      </motion.div>
    </div>
  );
}
