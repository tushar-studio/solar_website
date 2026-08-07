"use client";

import { useState, useMemo } from "react";
import { Calculator, Banknote, TrendingUp, IndianRupee, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

const TENURE_VALUES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20];

export default function EMICalculatorPage() {
  const { t } = useLanguage();
  const [loanAmount, setLoanAmount] = useState("");
  const [interestRate, setInterestRate] = useState("5.75");
  const [tenure, setTenure] = useState("5");
  const [calculated, setCalculated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const results = useMemo(() => {
    if (!calculated || !loanAmount || !interestRate || !tenure) return null;
    const P = parseFloat(loanAmount);
    const r = parseFloat(interestRate) / 12 / 100;
    const n = parseFloat(tenure) * 12;
    const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayable = emi * n;
    const totalInterest = totalPayable - P;
    return {
      emi: Math.round(emi),
      totalInterest: Math.round(totalInterest),
      totalPayable: Math.round(totalPayable),
    };
  }, [calculated, loanAmount, interestRate, tenure]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(loanAmount);
    if (!loanAmount || isNaN(amount) || amount < 10000) {
      setError(t.emiCalc.errorLoan);
      setCalculated(false);
      return;
    }
    setError(null);
    setCalculated(true);
  };

  return (
    <div className="pt-28 pb-16 sm:pb-24">
      <div className="section-container max-w-4xl">
        <Link href="/emi" className="inline-flex items-center gap-2 text-sm text-emerald-700 hover:text-emerald-800 mb-6">
          <ArrowLeft className="w-4 h-4" /> {t.common.backToEmi}
        </Link>

        <div className="text-center mb-10">
          <h1 className="section-heading">{t.emiCalc.title}</h1>
          <p className="section-subheading mx-auto mt-4">{t.emiCalc.subtitle}</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="glass-card p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-solar flex items-center justify-center">
                <Calculator className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-display font-bold text-xl text-solar-blue-dark">{t.emiCalc.loanDetails}</h2>
                <p className="text-sm text-slate-500">{t.emiCalc.loanDetailsHint}</p>
              </div>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit} noValidate>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">{t.emiCalc.loanAmount}</label>
                <input
                  type="number"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(e.target.value)}
                  placeholder={t.emiCalc.loanAmountPlaceholder}
                  className={`input-field ${error ? "!border-red-400" : ""}`}
                  min="10000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">{t.emiCalc.interestRate}</label>
                <input
                  type="number"
                  value={interestRate}
                  onChange={(e) => setInterestRate(e.target.value)}
                  placeholder="5.75"
                  className="input-field"
                  step="0.01"
                />
                <p className="text-xs text-slate-400 mt-1">{t.emiCalc.interestRateHint}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">{t.emiCalc.loanTenure}</label>
                <select value={tenure} onChange={(e) => setTenure(e.target.value)} className="select-field">
                  {TENURE_VALUES.map((value, i) => (
                    <option key={value} value={value}>
                      {t.emiCalc.tenureOptions[i]}
                    </option>
                  ))}
                </select>
              </div>
              {error && <p className="text-xs text-red-600">{error}</p>}
              <Button type="submit" className="w-full">
                <Calculator className="w-4 h-4" />
                {t.emiCalc.calculateEmi}
              </Button>
            </form>
          </div>

          <div className="space-y-4">
            {!results ? (
              <div className="glass-card p-8 h-full flex flex-col items-center justify-center text-center min-h-[350px]">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-4">
                  <TrendingUp className="w-8 h-8 text-emerald-400" />
                </div>
                <h3 className="font-display font-semibold text-lg text-solar-blue-dark">{t.emiCalc.yourEmiResults}</h3>
                <p className="text-sm text-slate-500 mt-2">{t.emiCalc.emiResultsHint}</p>
              </div>
            ) : (
              <>
                <div className="glass-card p-5 bg-gradient-to-br from-emerald-500/10 to-sky-500/10">
                  <div className="flex items-center gap-2 mb-1">
                    <IndianRupee className="w-5 h-5 text-emerald-400" />
                    <p className="text-sm text-slate-400">{t.emiCalc.monthlyEmi}</p>
                  </div>
                  <p className="font-display font-bold text-3xl text-emerald-400">₹{results.emi.toLocaleString("en-IN")}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="glass-card p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingUp className="w-4 h-4 text-amber-500" />
                      <p className="text-xs text-slate-500">{t.emiCalc.totalInterest}</p>
                    </div>
                    <p className="font-display font-bold text-lg text-solar-blue-dark">₹{results.totalInterest.toLocaleString("en-IN")}</p>
                  </div>
                  <div className="glass-card p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <Banknote className="w-4 h-4 text-sky-500" />
                      <p className="text-xs text-slate-500">{t.emiCalc.totalPayable}</p>
                    </div>
                    <p className="font-display font-bold text-lg text-solar-blue-dark">₹{results.totalPayable.toLocaleString("en-IN")}</p>
                  </div>
                </div>

                <div className="glass-card p-4">
                  <h4 className="text-sm font-medium text-slate-600 mb-3">{t.emiCalc.loanSummary}</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-slate-500">{t.emiCalc.loanAmountLabel}</span><span className="font-medium">₹{parseInt(loanAmount).toLocaleString("en-IN")}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">{t.emiCalc.interestRateLabel}</span><span className="font-medium">{interestRate}%</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">{t.emiCalc.tenureLabel}</span><span className="font-medium">{tenure} {t.emiCalc.years} ({parseInt(tenure) * 12} {t.emiCalc.months})</span></div>
                  </div>
                </div>

                <p className="text-xs text-slate-400 text-center">{t.emiCalc.disclaimer}</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
