"use client";

import { useMemo, useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence, animate } from "framer-motion";
import {
  Zap,
  PiggyBank,
  IndianRupee,
  ShieldCheck,
  ArrowRight,
  Calculator,
  Building2,
  Lock,
  Clock,
  TrendingUp,
} from "lucide-react";

/* ═════════════════════════════════════════════════════════════════════════
   Sundeya Solar — Solar Budget & System Capacity Calculator
   ─────────────────────────────────────────────────────────────────────────
   CORE FINANCIAL LOGIC (fixed constants — do not alter without sign-off):
     TARIFF_RATE       = ₹7 / kWh unit
     GOV_SUBSIDY       = ₹85,800 fixed residential subsidy (all capacities)
     monthlyUnits      = round(monthlyBill / 7)
     monthlySavings    = monthlyBill (100%, no deductions of any kind)

   CAPACITY TIERING:
     recommendedKw = units <= 450 ? 3 : 3 + ceil((units - 450) / 150)
     <=450->3 | 451-600->4 | 601-750->5 | 751-900->6 | 901-1050->7
     1051-1200->8 | 1201-1350->9 | 1351-1500->10 | >1500-> +1kW / 150 units

   PRICING STRUCTURE:
     costPerKw          = (recommendedKw === 3 || recommendedKw === 5) ? 70000 : 60000
     totalSystemCost     = recommendedKw * costPerKw
     netCostAfterSubsidy = totalSystemCost - 85800

   >10 kW SYSTEMS (recommendedKw > 10):
     Rendered as a dedicated, read-only "Commercial / High-Capacity System"
     card next to the standard 3–10 kW tier grid. All dependent values
     (Total Cost, Net Cost, Payback, 25-Year Savings) recompute automatically
     from the same formulas above — nothing is hidden or approximated.
   ═════════════════════════════════════════════════════════════════════════ */

const TARIFF_RATE = 7;
const GOV_SUBSIDY = 85800;
const BILL_MIN = 500;
const BILL_MAX_SOFT = 30000; // slider's default visible ceiling; typing higher extends it
const BILL_STEP = 100;
const BILL_DEFAULT = 2000;
const STANDARD_KW_CAP = 10;
const CAPACITY_TIERS = [3, 4, 5, 6, 7, 8, 9, 10];

const BILL_PRESETS = [1500, 2000, 3500, 5000, 10000];

/* ── Business logic ─────────────────────────────────────────────────── */

function computeRecommendedKw(units) {
  return units <= 450 ? 3 : 3 + Math.ceil((units - 450) / 150);
}

function computeCostPerKw(kw) {
  return kw === 3 || kw === 5 ? 70000 : 60000;
}

function calculateSolarBudget(monthlyBill) {
  const bill = Number(monthlyBill) || 0;
  const monthlyUnits = Math.round(bill / TARIFF_RATE);
  const recommendedKw = computeRecommendedKw(monthlyUnits);
  const isCustom = recommendedKw > STANDARD_KW_CAP;

  const monthlySavings = bill;
  const annualSavings = monthlySavings * 12;

  const costPerKw = computeCostPerKw(recommendedKw);
  const totalSystemCost = recommendedKw * costPerKw;
  const netCostAfterSubsidy = totalSystemCost - GOV_SUBSIDY;
  const paybackYears = annualSavings > 0 ? netCostAfterSubsidy / annualSavings : 0;
  const lifetimeSavings25yr = annualSavings * 25;

  return {
    monthlyUnits,
    recommendedKw,
    isCustom,
    costPerKw,
    totalSystemCost,
    netCostAfterSubsidy,
    monthlySavings,
    annualSavings,
    paybackYears,
    lifetimeSavings25yr,
  };
}

/* ── Animated number (smooth count-up on every recalculation) ──────── */

function AnimatedNumber({ value, prefix = "", suffix = "", decimals = 0, className = "" }) {
  const [display, setDisplay] = useState(value);
  const prevRef = useRef(value);

  useEffect(() => {
    const controls = animate(prevRef.current, value, {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(v),
    });
    prevRef.current = value;
    return () => controls.stop();
  }, [value]);

  const formatted =
    decimals > 0
      ? display.toFixed(decimals)
      : Math.round(display).toLocaleString("en-IN");

  return (
    <span className={className}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}

/* ── Stat card ───────────────────────────────────────────────────────── */

function StatCard({ icon: Icon, label, children, badge }) {
  return (
    <motion.div
      layout
      className="relative flex flex-col gap-2 rounded-2xl border border-emerald-500/20 bg-slate-800/50 p-4 sm:p-5"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15">
            <Icon className="h-4 w-4 text-emerald-400" />
          </span>
          <span className="text-xs font-medium text-slate-400">{label}</span>
        </div>
        {badge && (
          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/40 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.35)]">
            {badge}
          </span>
        )}
      </div>
      <div className="text-xl sm:text-2xl font-bold text-white">{children}</div>
    </motion.div>
  );
}

/* ── Breakdown item (used inside the wide financial summary card) ────── */

function BreakdownItem({ icon: Icon, label, children, accent = "text-white" }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
      <span className={`text-lg sm:text-xl font-bold ${accent}`}>{children}</span>
    </div>
  );
}

/* ── Capacity tier pill (standard 3–10 kW grid, read-only highlight) ──── */

function CapacityPill({ kw, active }) {
  return (
    <div
      className={[
        "flex min-w-[52px] items-center justify-center rounded-xl border px-3 py-2 text-sm font-bold transition-all duration-200",
        active
          ? "border-emerald-400 bg-emerald-500 text-white shadow-[0_0_14px_rgba(16,185,129,0.5)]"
          : "border-slate-700 bg-slate-800/50 text-slate-400",
      ].join(" ")}
      aria-current={active ? "true" : undefined}
    >
      {kw} kW
    </div>
  );
}

/* ── Custom high-capacity alert card (>10 kW, read-only, non-editable) ── */

function CustomCapacityCard({ result }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-2xl border-2 border-amber-400/50 bg-gradient-to-br from-amber-950/40 via-slate-900/80 to-slate-900/80 p-4 sm:p-5"
    >
      {/* Glow accent */}
      <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-amber-500/20 blur-3xl" />

      <div className="relative flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-500/20">
            <Building2 className="h-4.5 w-4.5 text-amber-400" />
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-amber-400/50 bg-amber-500/15 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-amber-300">
            Commercial / High-Capacity System
          </span>
        </div>
        <span
          title="Calculated automatically — not editable"
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-800/80 text-slate-400"
        >
          <Lock className="h-3.5 w-3.5" />
        </span>
      </div>

      <div className="relative mt-4 flex flex-wrap items-baseline gap-2">
        <span className="text-lg sm:text-xl font-semibold text-slate-200">
          Recommended Commercial/High-Capacity System:
        </span>
        <span className="text-2xl sm:text-3xl font-extrabold text-amber-400">
          <AnimatedNumber value={result.recommendedKw} suffix=" kW" />
        </span>
      </div>

      {/* Recalculated financials — same formulas as the standard tiers */}
      <div className="relative mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 rounded-xl border border-amber-400/20 bg-slate-950/40 p-4">
        <BreakdownItem icon={IndianRupee} label="Total System Cost" accent="text-white">
          <AnimatedNumber value={result.totalSystemCost} prefix="₹" />
        </BreakdownItem>
        <BreakdownItem icon={ShieldCheck} label="Net Cost After Subsidy" accent="text-amber-300">
          <AnimatedNumber value={result.netCostAfterSubsidy} prefix="₹" />
        </BreakdownItem>
        <BreakdownItem icon={Clock} label="Payback Period" accent="text-white">
          <AnimatedNumber value={result.paybackYears} decimals={1} suffix=" yrs" />
        </BreakdownItem>
        <BreakdownItem icon={TrendingUp} label="25-Year Savings" accent="text-emerald-400">
          <AnimatedNumber value={result.lifetimeSavings25yr} prefix="₹" />
        </BreakdownItem>
      </div>

      <p className="relative mt-3 text-xs sm:text-sm text-slate-400">
        Your usage exceeds our standard 10&nbsp;kW residential range. This size is
        calculated automatically from your monthly bill and{" "}
        <span className="font-semibold text-slate-300">cannot be edited manually</span>
        &nbsp;— an on-site audit is required to finalize an exact commercial design.
      </p>

      <button
        type="button"
        className="relative mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 py-3 text-sm font-semibold text-white shadow-lg shadow-amber-500/30 transition-transform duration-200 hover:scale-[1.01] active:scale-[0.98]"
      >
        Request Custom On-Site Technical Audit
        <ArrowRight className="h-4 w-4" />
      </button>
    </motion.div>
  );
}

/* ── Main component ─────────────────────────────────────────────────── */

export default function SolarBudgetCalculator() {
  const [monthlyBill, setMonthlyBill] = useState(BILL_DEFAULT);

  const sliderMax = Math.max(BILL_MAX_SOFT, monthlyBill);

  const result = useMemo(() => calculateSolarBudget(monthlyBill), [monthlyBill]);

  const clampBill = useCallback((val) => {
    if (Number.isNaN(val)) return BILL_MIN;
    return Math.max(BILL_MIN, Math.round(val / BILL_STEP) * BILL_STEP);
  }, []);

  const handleSliderChange = (e) => setMonthlyBill(Number(e.target.value));
  const handleNumberChange = (e) => {
    const raw = e.target.value;
    if (raw === "") {
      setMonthlyBill(0);
      return;
    }
    setMonthlyBill(Number(raw));
  };
  const handleNumberBlur = () => setMonthlyBill((prev) => clampBill(prev));

  return (
    <div className="w-full bg-slate-900/90 border border-emerald-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-lg shadow-emerald-500/30">
          <Calculator className="h-5 w-5 text-white" />
        </span>
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-white">
            Solar Budget &amp; System Capacity Calculator
          </h3>
          <p className="text-xs sm:text-sm text-slate-400">
            Enter your monthly bill to see your recommended system &amp; savings
          </p>
        </div>
      </div>

      {/* Input section */}
      <div className="mb-6 rounded-2xl border border-emerald-500/20 bg-slate-800/40 p-4 sm:p-5">
        <div className="mb-3 flex items-center justify-between">
          <label htmlFor="monthlyBillInput" className="text-sm font-semibold text-slate-200">
            Monthly Electricity Bill (₹)
          </label>
          <div className="flex items-center gap-1 rounded-xl border border-emerald-500/30 bg-slate-900/70 px-3 py-1.5">
            <span className="text-sm text-emerald-400 font-semibold">₹</span>
            <input
              id="monthlyBillInput"
              type="number"
              min={BILL_MIN}
              step={BILL_STEP}
              value={monthlyBill === 0 ? "" : monthlyBill}
              onChange={handleNumberChange}
              onBlur={handleNumberBlur}
              className="w-24 bg-transparent text-right text-sm font-bold text-white outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
          </div>
        </div>

        {/* Range slider */}
        <input
          type="range"
          min={BILL_MIN}
          max={sliderMax}
          step={BILL_STEP}
          value={Math.min(monthlyBill, sliderMax)}
          onChange={handleSliderChange}
          className="solar-slider w-full"
          style={{
            "--slider-progress": `${((Math.min(monthlyBill, sliderMax) - BILL_MIN) / (sliderMax - BILL_MIN)) * 100}%`,
          }}
          aria-label="Monthly electricity bill slider"
        />
        <div className="mt-1 flex justify-between text-[11px] text-slate-500">
          <span>₹{BILL_MIN.toLocaleString("en-IN")}</span>
          <span>₹{sliderMax.toLocaleString("en-IN")}+</span>
        </div>

        {/* Quick presets */}
        <div className="mt-4 flex flex-wrap gap-2">
          {BILL_PRESETS.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => setMonthlyBill(preset)}
              className={[
                "rounded-full border px-3 py-1.5 text-xs font-semibold transition-all duration-200",
                monthlyBill === preset
                  ? "border-emerald-400 bg-emerald-500 text-white shadow-[0_0_14px_rgba(16,185,129,0.5)]"
                  : "border-slate-600 bg-slate-800/60 text-slate-300 hover:border-emerald-500/50 hover:text-emerald-300",
              ].join(" ")}
            >
              ₹{preset.toLocaleString("en-IN")}
            </button>
          ))}
        </div>
      </div>

      {/* Recommended capacity — standard 3–10 kW option grid + floating custom tile */}
      <div className="mb-4">
        <span className="text-sm font-semibold text-slate-200">Recommended System Capacity</span>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {CAPACITY_TIERS.map((kw) => (
            <CapacityPill key={kw} kw={kw} active={!result.isCustom && kw === result.recommendedKw} />
          ))}

          <AnimatePresence>
            {result.isCustom && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.25 }}
                className="flex items-center gap-1.5 rounded-xl border-2 border-amber-400/60 bg-amber-500/10 px-3 py-2 text-sm font-bold text-amber-300 shadow-[0_0_16px_rgba(245,158,11,0.35)]"
                title="Calculated automatically — not editable"
              >
                <Building2 className="h-4 w-4" />
                <AnimatedNumber value={result.recommendedKw} suffix=" kW" />
                <Lock className="h-3.5 w-3.5 opacity-70" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Dedicated custom system card — only rendered when recommendedKw > 10 */}
      <AnimatePresence mode="wait">
        {result.isCustom && (
          <div className="mb-4">
            <CustomCapacityCard result={result} />
          </div>
        )}
      </AnimatePresence>

      {/* Live stat breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <StatCard icon={Zap} label="Units Used (Monthly)">
          <AnimatedNumber value={result.monthlyUnits} suffix=" units" />
        </StatCard>

        <StatCard icon={PiggyBank} label="Monthly Savings">
          <AnimatedNumber value={result.monthlySavings} prefix="₹" className="text-emerald-400" />
        </StatCard>

        <StatCard icon={IndianRupee} label="Total System Cost">
          <AnimatedNumber value={result.totalSystemCost} prefix="₹" />
        </StatCard>

        <StatCard icon={ShieldCheck} label="Fixed Subsidy" badge="Fixed">
          <AnimatedNumber value={GOV_SUBSIDY} prefix="₹" className="text-emerald-400" />
        </StatCard>
      </div>

      {/* Net cost, payback & lifetime savings — always recalculated live, incl. >10kW */}
      <motion.div
        layout
        className="mt-4 rounded-2xl border border-emerald-500/25 bg-gradient-to-r from-emerald-950/60 via-slate-800/50 to-slate-800/50 p-4 sm:p-5"
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <BreakdownItem icon={ShieldCheck} label="Net Cost After Subsidy">
            <AnimatedNumber value={result.netCostAfterSubsidy} prefix="₹" />
          </BreakdownItem>
          <BreakdownItem icon={Clock} label="Estimated Payback Period">
            <AnimatedNumber value={result.paybackYears} decimals={1} suffix=" years" />
          </BreakdownItem>
          <BreakdownItem icon={TrendingUp} label="Estimated 25-Year Savings" accent="text-emerald-400">
            <AnimatedNumber value={result.lifetimeSavings25yr} prefix="₹" />
          </BreakdownItem>
        </div>
      </motion.div>

      {/* Primary CTA — the custom card above already carries its own dedicated CTA */}
      {!result.isCustom && (
        <button
          type="button"
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 py-3.5 text-sm sm:text-base font-semibold text-white shadow-lg shadow-emerald-500/30 transition-transform duration-200 hover:scale-[1.01] active:scale-[0.98]"
        >
          Get My Free Solar Quote
          <ArrowRight className="h-4 w-4" />
        </button>
      )}

      {/* Slider styling */}
      <style jsx global>{`
        .solar-slider {
          -webkit-appearance: none;
          appearance: none;
          height: 6px;
          border-radius: 9999px;
          background: linear-gradient(
            to right,
            #10b981 0%,
            #10b981 var(--slider-progress, 0%),
            #334155 var(--slider-progress, 0%),
            #334155 100%
          );
          outline: none;
          cursor: pointer;
        }
        .solar-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #ffffff;
          border: 3px solid #10b981;
          box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.25);
          cursor: pointer;
          transition: transform 0.15s ease;
        }
        .solar-slider::-webkit-slider-thumb:hover {
          transform: scale(1.15);
        }
        .solar-slider::-moz-range-thumb {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #ffffff;
          border: 3px solid #10b981;
          box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.25);
          cursor: pointer;
        }
        .solar-slider::-moz-range-track {
          height: 6px;
          border-radius: 9999px;
          background: transparent;
        }

        @media (prefers-reduced-motion: reduce) {
          .solar-slider::-webkit-slider-thumb,
          .solar-slider::-moz-range-thumb {
            transition: none;
          }
        }
      `}</style>
    </div>
  );
}
