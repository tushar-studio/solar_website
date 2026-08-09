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
  Building2,
  Lock,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import { fadeUp, viewportOnce } from "@/lib/animations";
import { Button } from "@/components/ui/Button";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { company } from "@/lib/data";

/* ═════════════════════════════════════════════════════════════════════════
   Sundeya Solar — Solar Budget Calculator (bilingual)
   ─────────────────────────────────────────────────────────────────────────
   CONTRACTUAL BUSINESS RULES (single source of truth — do not alter
   without explicit sign-off):

   SAVINGS:
     monthlySavings = monthlyBill          ← 100% of the bill. NO deductions
     of any kind. There is NO "₹300 mandatory fixed charge".

   TARIFF:
     TARIFF_RATE          = ₹7 / kWh unit
     monthlyUnits         = Math.round(monthlyBill / TARIFF_RATE)

   CAPACITY TIERING (from monthlyUnits):
     recommendedKw = units <= 450 ? 3 : 3 + Math.ceil((units - 450) / 150)

     <=450 → 3 | 451–600 → 4 | 601–750 → 5 | 751–900 → 6 | 901–1050 → 7
     1051–1200 → 8 | 1201–1350 → 9 | 1351–1500 → 10 | >1500 → +1 kW / 150 units

   PRICING STRUCTURE:
     costPerKw           = (kw === 3 || kw === 5) ? 70000 : 60000
     installationCost    = recommendedKw * costPerKw
     subsidy             = ₹85,800 fixed (Residential only)
     finalCost           = installationCost - subsidy

   ROI (25-year horizon):
     roi = ((annualSavings * 25 - finalCost) / finalCost) * 100

   >10 kW SYSTEMS (recommendedKw > 10):
     Floating read-only "Commercial / High-Capacity System" tab directly next
     to the 10 kW option + a dedicated card. All dependent values (Total Cost,
     Net Cost, ROI, Payback, 25-Year Savings) recompute from the same formulas.
   ═════════════════════════════════════════════════════════════════════════ */

const TARIFF_RATE = 7;
const GOV_SUBSIDY = 85800;
const PREMIUM_COST_PER_KW = 70000; // 3 kW and 5 kW systems
const STANDARD_COST_PER_KW = 60000; // all other sizes (4, 6–10, and >10 kW)
const LIFETIME_YEARS = 25;
const STANDARD_KW_CAP = 10;

const CAPACITY_OPTIONS = ["3", "4", "5", "6", "7", "8", "9", "10"];
const TIMELINE_YEARS = [5, 10, 15, 20, 25];

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
  finalCostNumber: number;
  paybackYears: number | null;
  roiNumber: number;
}

/**
 * Auto-recommend a system capacity (kW) from the monthly electricity bill.
 * Capacity derives from tariff-converted units (₹7/unit), per the tier table.
 * Returns null when the bill is empty/invalid so the user's selection is preserved.
 * May return >10 kW (e.g. "11", "12") — handled by the commercial card UI.
 */
function recommendCapacity(bill: number): string | null {
  if (isNaN(bill) || bill <= 0) return null;
  const units = Math.round(bill / TARIFF_RATE);
  const kw = units <= 450 ? 3 : 3 + Math.ceil((units - 450) / 150);
  return String(kw);
}

function calculateSolar(inputs: {
  monthlyBill: number;
  propertyType: string;
  capacity: number;
}): CalculatorResult {
  const bill = inputs.monthlyBill || 0;
  const kW = inputs.capacity;

  // Contract pricing: 3 kW and 5 kW bill at ₹70,000/kW; every other size at ₹60,000/kW
  const costPerKw =
    kW === 3 || kW === 5 ? PREMIUM_COST_PER_KW : STANDARD_COST_PER_KW;
  const installationCost = kW * costPerKw;

  // PM Surya Ghar subsidy: fixed ₹85,800 (Residential only)
  const subsidy = inputs.propertyType === "Residential" ? GOV_SUBSIDY : 0;
  const finalCost = installationCost - subsidy;

  // Monthly savings = 100% of the bill — no fixed charge, no deductions
  const monthlySavings = Math.max(0, bill);
  const annualSavings = monthlySavings * 12;
  const paybackYears = annualSavings > 0 ? finalCost / annualSavings : null;
  const lifetimeSavings = annualSavings * LIFETIME_YEARS;
  const roi =
    finalCost > 0
      ? ((lifetimeSavings - finalCost) / finalCost) * 100
      : 0;

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
    finalCostNumber: finalCost,
    paybackYears,
    roiNumber: roi,
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

/* ── >10 kW: floating read-only commercial system card ────────────────── */

function CustomCapacityCard({ result, labels }: { result: CalculatorResult; labels: any }) {
  const { t } = useLanguage();
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-2xl border-2 border-amber-400/50 bg-gradient-to-br from-amber-950/40 via-slate-900/80 to-slate-900/80 p-4 sm:p-5"
    >
      <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-amber-500/20 blur-3xl" />

      <div className="relative flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-500/20">
            <Building2 className="h-4.5 w-4.5 text-amber-400" />
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-amber-400/50 bg-amber-500/15 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-amber-300">
            {t.calculator.customSystemTitle}
          </span>
        </div>
        <span
          title={t.calculator.customLockTitle}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-800/80 text-slate-400"
        >
          <Lock className="h-3.5 w-3.5" />
        </span>
      </div>

      <div className="relative mt-4 flex flex-wrap items-baseline gap-2">
        <span className="text-lg sm:text-xl font-semibold text-slate-200">
          {t.calculator.customRecommendedLabel}:
        </span>
        <span className="text-2xl sm:text-3xl font-extrabold text-amber-400">
          <AnimatedStat value={result.recommendedSystem} />
        </span>
      </div>

      {/* Recalculated financials — same formulas as the standard tiers */}
      <div className="relative mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 rounded-xl border border-amber-400/20 bg-slate-950/40 p-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
            <IndianRupee className="h-3.5 w-3.5" />
            {labels.installationCost}
          </div>
          <span className="text-lg sm:text-xl font-bold text-white">
            <AnimatedStat value={result.installationCost} />
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
            <ShieldCheck className="h-3.5 w-3.5" />
            {labels.finalCost}
          </div>
          <span className="text-lg sm:text-xl font-bold text-amber-300">
            <AnimatedStat value={result.finalCost} />
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
            <Clock className="h-3.5 w-3.5" />
            {labels.paybackPeriod}
          </div>
          <span className="text-lg sm:text-xl font-bold text-white">
            <AnimatedStat value={result.paybackPeriod} />
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
            <TrendingUp className="h-3.5 w-3.5" />
            {labels.lifetimeSavings}
          </div>
          <span className="text-lg sm:text-xl font-bold text-emerald-400">
            <AnimatedStat value={result.lifetimeSavings} />
          </span>
        </div>
      </div>

      {/* ROI — same 25-year horizon */}
      <div className="relative mt-3 flex items-center justify-between rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-2.5">
        <span className="text-xs font-medium text-emerald-300">
          {labels.roi} ({LIFETIME_YEARS} {t.calculator.years})
        </span>
        <span className="text-xl font-extrabold text-emerald-300">
          <AnimatedStat value={result.roi} />
        </span>
      </div>

      <p className="relative mt-3 text-xs sm:text-sm text-slate-400">{t.calculator.customNote}</p>

      <a
        href={`tel:${company.phone}`}
        className="relative mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 py-3 text-sm font-semibold text-white shadow-lg shadow-amber-500/30 transition-transform duration-200 hover:scale-[1.01] active:scale-[0.98]"
      >
        <Phone className="h-4 w-4" />
        {t.calculator.customAuditCta}
      </a>
    </motion.div>
  );
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
  const recommendedKw = recommended ? parseInt(recommended) : null;
  const isCustom = recommendedKw !== null && recommendedKw > STANDARD_KW_CAP && capacity === recommended;

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
        label: `${labels.lifetimeSavings} (${LIFETIME_YEARS} ${t.calculator.years})`,
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

  const maxTimeline = results ? Math.max(results.annualSavingsNumber * LIFETIME_YEARS, 1) : 1;

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
                        : "bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 shadow-md shadow-slate-200/40 dark:shadow-black/30 hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400"
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
                            active
                              ? "bg-white/25 text-white"
                              : "bg-emerald-50 dark:bg-emerald-500/20 border border-emerald-200 dark:border-emerald-500/30 text-emerald-900 dark:text-emerald-200"
                          }`}
                        >
                          {t.calculator.recommended}
                        </span>
                      )}
                    </span>
                  </button>
                );
              })}

              {/* Floating custom tab — appears directly next to the 10 kW option when >10 kW */}
              <AnimatePresence>
                {isCustom && recommended && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.25 }}
                    className="flex items-center gap-1.5 rounded-2xl border-2 border-amber-400/60 bg-amber-500/10 px-3 py-2 h-11 text-sm font-bold text-amber-300 shadow-[0_0_16px_rgba(245,158,11,0.35)]"
                    title={t.calculator.customLockTitle}
                  >
                    <Building2 className="h-4 w-4" />
                    <AnimatedStat value={`${recommended} kW`} />
                    <Lock className="h-3.5 w-3.5 opacity-70" />
                  </motion.div>
                )}
              </AnimatePresence>
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
            {isCustom && results ? (
              <CustomCapacityCard result={results} labels={labels} />
            ) : (
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
            )}

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
                  const isMax = years === LIFETIME_YEARS;
                  return (
                    <div key={years} className="flex items-center gap-3">
                      <span className="w-20 sm:w-24 text-xs text-slate-500 flex-shrink-0">
                        {years} {t.calculator.years}
                      </span>
                      <div className="flex-1 h-7 rounded-lg bg-slate-100 dark:bg-slate-800/80 overflow-hidden">
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
                {LIFETIME_YEARS} {t.calculator.years})
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button variant="secondary" onClick={handleDownload} disabled={downloading}>
                {downloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                {downloading ? t.common.generating : t.calculator.downloadReport}
              </Button>
              <a href={`tel:${company.phone}`} className="btn-primary ripple inline-flex">
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
