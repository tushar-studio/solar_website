"use client";

import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence, animate } from "framer-motion";
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
  type LucideIcon,
} from "lucide-react";
import { fadeUp, viewportOnce } from "@/lib/animations";
import { Button } from "@/components/ui/Button";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

const CAPACITY_OPTIONS = ["3", "4", "5", "6", "7", "8", "9", "10"];
const TIMELINE_YEARS = [5, 10, 15, 20, 25];
const SUBSIDY_CAP = 78000;

const pillSpring = { type: "spring", stiffness: 400, damping: 30 } as const;
const cardSpring = { type: "spring", stiffness: 300, damping: 25 } as const;
const barSpring = { type: "spring", stiffness: 140, damping: 20 } as const;

interface CalculatorResult {
  recommendedSystem: string;
  installationCost: string;
  subsidy: string;
  hasSubsidy: boolean;
  finalCost: string;
  roi: string;
  monthlySavings: string;
  paybackPeriod: string;
  annualSavings: string;
  lifetimeSavings: string;
  annualSavingsNumber: number;
}

/**
 * Auto-recommend a system capacity (kW) based on the monthly electricity bill.
 * Returns null when the bill is empty/invalid so the user's selection is preserved.
 */
function recommendCapacity(bill: number): string | null {
  if (isNaN(bill) || bill <= 0) return null;
  if (bill <= 2500) return "3";
  if (bill <= 4000) return "4";
  if (bill <= 6000) return "5";
  if (bill <= 8000) return "6";
  if (bill <= 10000) return "7";
  if (bill <= 12000) return "8";
  if (bill <= 14000) return "9";
  return "10";
}

function calculateSolar(inputs: {
  monthlyBill: number;
  propertyType: string;
  capacity: number;
}): CalculatorResult {
  const bill = inputs.monthlyBill || 0;
  const kW = inputs.capacity;

  // Base installation cost: 3 kW = ₹2,10,000, 5 kW = ₹3,50,000, others = kW * ₹60,000
  const installationCost = kW === 3 ? 210000 : kW === 5 ? 350000 : kW * 60000;

  // PM Surya Ghar subsidy: capped at ₹78,000 for systems >= 3kW (Residential only)
  const subsidy = inputs.propertyType === "Residential" ? SUBSIDY_CAP : 0;
  const finalCost = installationCost - subsidy;

  // Monthly savings = bill minus ₹300 compulsory fixed charge
  const grossMonthlySavings = bill;
  const monthlySavings = Math.max(0, grossMonthlySavings - 300);
  const annualSavings = monthlySavings * 12;
  const paybackYears = annualSavings > 0 ? finalCost / annualSavings : null;
  const lifetimeSavings = annualSavings * 25;
  const roi = ((annualSavings * 25 - finalCost) / finalCost) * 100;

  return {
    recommendedSystem: `${kW} kW`,
    installationCost: `₹${installationCost.toLocaleString("en-IN")}`,
    subsidy: `₹${subsidy.toLocaleString("en-IN")}`,
    hasSubsidy: subsidy > 0,
    finalCost: `₹${Math.round(finalCost).toLocaleString("en-IN")}`,
    roi: `${roi.toFixed(0)}%`,
    monthlySavings: `₹${Math.round(monthlySavings).toLocaleString("en-IN")}`,
    paybackPeriod: paybackYears === null ? "—" : paybackYears.toFixed(1),
    annualSavings: `₹${Math.round(annualSavings).toLocaleString("en-IN")}`,
    lifetimeSavings: `₹${Math.round(lifetimeSavings).toLocaleString("en-IN")}`,
    annualSavingsNumber: annualSavings,
  };
}

interface ResultCard {
  icon: LucideIcon;
  label: string;
  value: string;
  note?: string;
}

/**
 * Springs the numeric portion of a stat value (e.g. "₹1,24,200", "2.3 Years")
 * so cards counter-increment fluidly instead of snapping.
 */
function AnimatedStat({ value, className = "" }: { value: string; className?: string }) {
  const [display, setDisplay] = useState(value);
  const prevRef = useRef<number | null>(null);

  useEffect(() => {
    const match = value.match(/^([^0-9]*)([\d,]+(?:\.\d+)?)(.*)$/);
    if (!match) {
      setDisplay(value);
      prevRef.current = null;
      return;
    }
    const target = parseFloat(match[2].replace(/,/g, ""));
    const start = prevRef.current ?? target;
    const controls = animate(start, target, {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => {
        const hasFrac = match[2].includes(".");
        const num = hasFrac ? v.toFixed(1) : Math.round(v).toLocaleString("en-IN");
        setDisplay(`${match[1]}${num}${match[3]}`);
      },
    });
    prevRef.current = target;
    return () => controls.stop();
  }, [value]);

  return <span className={className}>{display}</span>;
}

export function SolarCalculatorForm() {
  const { t } = useLanguage();
  const [monthlyBill, setMonthlyBill] = useState("");
  const [capacity, setCapacity] = useState("3");
  const [propertyType, setPropertyType] = useState("Residential");
  const [showResults, setShowResults] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [errors, setErrors] = useState<{ bill?: string }>({});

  const labels = t.calculator.resultLabels;

  // Auto-recommendation: recompute from the bill and auto-select whenever it changes.
  // The user can still manually override by clicking any other kW pill.
  const recommended = useMemo(
    () => recommendCapacity(parseFloat(monthlyBill)),
    [monthlyBill]
  );

  useEffect(() => {
    if (recommended) setCapacity(recommended);
  }, [recommended]);

  const results = useMemo(() => {
    if (!showResults || !monthlyBill) return null;
    return calculateSolar({
      monthlyBill: parseFloat(monthlyBill),
      propertyType,
      capacity: parseInt(capacity),
    });
  }, [showResults, monthlyBill, propertyType, capacity]);

  const resultCards: ResultCard[] = useMemo(() => {
    if (!results) return [];
    const cards: ResultCard[] = [
      { icon: Zap, label: labels.recommendedSystem, value: results.recommendedSystem },
      { icon: IndianRupee, label: labels.installationCost, value: results.installationCost },
    ];
    if (results.hasSubsidy) {
      cards.push({ icon: Leaf, label: labels.governmentSubsidy, value: results.subsidy });
    }
    cards.push(
      { icon: IndianRupee, label: labels.finalCost, value: results.finalCost },
      { icon: TrendingUp, label: labels.roi, value: results.roi },
      {
        icon: IndianRupee,
        label: labels.monthlySavings,
        value: results.monthlySavings,
        note: t.calculator.monthlySavingsNote,
      },
      {
        icon: Clock,
        label: labels.paybackPeriod,
        value:
          results.paybackPeriod === "—"
            ? "—"
            : `${results.paybackPeriod} ${t.calculator.years}`,
      },
      { icon: IndianRupee, label: labels.annualSavings, value: results.annualSavings },
      {
        icon: IndianRupee,
        label: `${labels.lifetimeSavings} (25 ${t.calculator.years})`,
        value: results.lifetimeSavings,
      }
    );
    return cards;
  }, [results, labels, t]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors: { bill?: string } = {};
    const billNum = parseFloat(monthlyBill);
    if (!monthlyBill || isNaN(billNum) || billNum < 500) nextErrors.bill = t.calculator.errorBill;
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
      `${t.calculator.systemCapacity}: ${capacity} kW`,
      `${t.calculator.propertyType}: ${propertyType}`,
    ];
    const rows = resultCards.map((c) => `${c.label}: ${c.value}`);
    const highlightLabels = [
      labels.finalCost,
      labels.monthlySavings,
      labels.annualSavings,
      labels.lifetimeSavings,
    ];
    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${t.calculator.reportTitle}</title><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:system-ui,sans-serif;color:#0F172A;padding:40px;max-width:680px;margin:0 auto}.hdr{border-bottom:3px solid #2E7D32;padding-bottom:16px;margin-bottom:24px}.hdr h1{font-size:22px;color:#1E3A5F}.hdr p{font-size:13px;color:#059669;margin-top:4px}.sec{margin-bottom:20px}.sec h2{font-size:15px;color:#1E3A5F;margin-bottom:8px;border-bottom:1px solid #E2E8F0;padding-bottom:4px}.row{display:flex;justify-content:space-between;padding:6px 0;font-size:14px;border-bottom:1px solid #F1F5F9}.row b{font-weight:600}.hl{color:#059669;font-weight:700;font-size:16px}.ftr{margin-top:32px;padding-top:16px;border-top:1px solid #E2E8F0;font-size:11px;color:#94A3B8;text-align:center}@media print{body{padding:20px}}</style></head><body><div class="hdr"><h1>${t.calculator.reportTitle}</h1><p>${t.common.pmSuryaPartner}</p></div><div class="sec"><h2>${t.calculator.reportInputs}</h2>${inputs.map(i => `<div class="row"><span>${i.split(": ")[0]}</span><span>${i.split(": ")[1]}</span></div>`).join("")}</div><div class="sec"><h2>${t.calculator.reportResults}</h2>${rows.map((r) => { const [label, ...rest] = r.split(": "); const value = rest.join(": "); const isHl = highlightLabels.some((l) => label.startsWith(l)); return `<div class="row b"><span>${label}</span><span class="${isHl ? "hl" : ""}">${value}</span></div>`; }).join("")}</div><div class="ftr"><p>${t.calculator.reportGenerated}</p><p style="margin-top:12px">${t.calculator.reportFooter}</p></div><script>window.onload=function(){window.print()}</script></body></html>`;
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
  }, [results, monthlyBill, capacity, propertyType, resultCards, labels, t]);

  const maxTimeline = results ? Math.max(results.annualSavingsNumber * 25, 1) : 1;

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
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {t.calculator.systemCapacity}
            </label>
            <div className="flex flex-wrap gap-2">
              {CAPACITY_OPTIONS.map((cap) => {
                const active = capacity === cap;
                const isRecommended = recommended === cap;
                return (
                  <button
                    key={cap}
                    type="button"
                    onClick={() => setCapacity(cap)}
                    aria-pressed={active}
                    className={`relative h-11 px-4 rounded-2xl text-sm font-semibold transition-colors duration-200 ${
                      active
                        ? "text-white border border-transparent"
                        : "bg-slate-800/60 border border-slate-700 text-slate-300 hover:border-emerald-400/60 hover:text-emerald-300"
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="capacity-active-pill"
                        className="absolute inset-0 rounded-2xl bg-gradient-solar shadow-glow"
                        transition={pillSpring}
                      />
                    )}
                    <span className="relative z-10 inline-flex items-center gap-1.5">
                      {cap} kW
                      {isRecommended && (
                        <span
                          className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full badge-pulse ${
                            active ? "bg-white/25 text-white" : "bg-emerald-500/20 text-emerald-300"
                          }`}
                        >
                          {t.calculator.recommended}
                        </span>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
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
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-4">
              <TrendingUp className="w-8 h-8 text-emerald-400" />
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
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <AnimatePresence initial={false}>
                {resultCards.map((card) => (
                  <motion.div
                    key={card.label}
                    layout
                    initial={{ opacity: 0, scale: 0.92, y: 8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.92 }}
                    transition={cardSpring}
                    className="glass-card p-4"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <card.icon className="w-4 h-4 text-emerald-500" />
                      <p className="text-xs text-slate-500">{card.label}</p>
                    </div>
                    <p className="font-display font-bold text-lg text-solar-blue-dark tabular-nums tracking-tight">
                      <AnimatedStat value={card.value} />
                    </p>
                    {card.note && (
                      <p className="text-[10px] text-slate-400 mt-1 leading-snug">{card.note}</p>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Estimated Savings After — 5/10/15/20/25 year breakdown */}
            <div className="glass-card p-5">
              <h4 className="font-display font-semibold text-base text-solar-blue-dark mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-500" />
                {t.calculator.savingsAfterTitle}
              </h4>
              <div className="space-y-3">
                {TIMELINE_YEARS.map((years) => {
                  const value = results.annualSavingsNumber * years;
                  const pct = Math.max(4, Math.round((value / maxTimeline) * 100));
                  const isMax = years === 25;
                  return (
                    <div key={years} className="flex items-center gap-3">
                      <span className="w-20 sm:w-24 text-xs text-slate-500 flex-shrink-0">
                        {years} {t.calculator.years}
                      </span>
                      <div className="flex-1 h-7 rounded-lg bg-slate-800/80 overflow-hidden">
                        <motion.div
                          className={`h-full rounded-lg ${
                            isMax ? "bg-gradient-solar" : "bg-emerald-400/60"
                          }`}
                          initial={false}
                          animate={{ width: `${pct}%` }}
                          transition={barSpring}
                          style={{ transformOrigin: "left" }}
                        />
                      </div>
                      <span className="w-24 sm:w-28 text-right text-xs font-semibold text-solar-blue-dark flex-shrink-0 tabular-nums">
                        <AnimatedStat value={`₹${Math.round(value).toLocaleString("en-IN")}`} />
                      </span>
                    </div>
                  );
                })}
              </div>
              <p className="text-xs text-slate-400 mt-3">
                {labels.lifetimeSavings}: <AnimatedStat value={results.lifetimeSavings} /> (
                {25} {t.calculator.years})
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
