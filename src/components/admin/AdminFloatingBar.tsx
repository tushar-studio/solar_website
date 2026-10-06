"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  Lock,
  Calculator,
  Percent,
  Sparkles,
  BookOpen,
  Phone,
  Image as ImageIcon,
  HelpCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useSiteConfig } from "@/lib/config/SiteConfigProvider";

export function AdminFloatingBar() {
  const { isAdminUnlocked, lockAdmin, openEditor } = useSiteConfig();
  const [minimized, setMinimized] = useState(false);

  if (!isAdminUnlocked) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 max-w-[96vw] sm:max-w-4xl w-full px-2 pointer-events-auto">
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-slate-900/95 border-2 border-emerald-500/50 backdrop-blur-xl rounded-2xl shadow-2xl p-2.5 sm:p-3 text-white flex flex-col gap-2"
      >
        {/* Top Mini Header */}
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
              Admin Edit Mode Active
            </span>
            <span className="text-[11px] text-slate-400 hidden sm:inline">
              (Click edit buttons on page or below to edit directly)
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setMinimized(!minimized)}
              className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              title={minimized ? "Expand Toolbar" : "Minimize Toolbar"}
            >
              {minimized ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            <button
              onClick={lockAdmin}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-600/80 hover:bg-rose-600 text-white text-xs font-semibold rounded-lg shadow-sm transition-all cursor-pointer"
              title="Lock Admin and return to normal user view"
            >
              <Lock className="w-3 h-3" />
              <span>Lock Admin</span>
            </button>
          </div>
        </div>

        {/* Buttons List (if not minimized) */}
        {!minimized && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 scrollbar-none">
            <button
              onClick={() => openEditor("calculator")}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/15 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 rounded-xl text-xs font-semibold whitespace-nowrap cursor-pointer transition-all"
            >
              <Calculator className="w-3.5 h-3.5 text-emerald-400" />
              <span>Edit Calculator Rates</span>
            </button>

            <button
              onClick={() => openEditor("emi")}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-sky-500/15 hover:bg-sky-500/30 text-sky-300 border border-sky-500/30 rounded-xl text-xs font-semibold whitespace-nowrap cursor-pointer transition-all"
            >
              <Percent className="w-3.5 h-3.5 text-sky-400" />
              <span>Edit EMI</span>
            </button>

            <button
              onClick={() => openEditor("hero")}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/15 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 rounded-xl text-xs font-semibold whitespace-nowrap cursor-pointer transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Edit Hero &amp; Buttons</span>
            </button>

            <button
              onClick={() => openEditor("about")}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-500/15 hover:bg-purple-500/30 text-purple-300 border border-purple-500/30 rounded-xl text-xs font-semibold whitespace-nowrap cursor-pointer transition-all"
            >
              <BookOpen className="w-3.5 h-3.5 text-purple-400" />
              <span>Edit About Us</span>
            </button>

            <button
              onClick={() => openEditor("contact")}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-500/15 hover:bg-teal-500/30 text-teal-300 border border-teal-500/30 rounded-xl text-xs font-semibold whitespace-nowrap cursor-pointer transition-all"
            >
              <Phone className="w-3.5 h-3.5 text-teal-400" />
              <span>Edit Contacts &amp; WhatsApp</span>
            </button>

            <button
              onClick={() => openEditor("gallery")}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/15 hover:bg-blue-500/30 text-blue-300 border border-blue-500/30 rounded-xl text-xs font-semibold whitespace-nowrap cursor-pointer transition-all"
            >
              <ImageIcon className="w-3.5 h-3.5 text-blue-400" />
              <span>Edit Gallery</span>
            </button>

            <button
              onClick={() => openEditor("faqs")}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/15 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 rounded-xl text-xs font-semibold whitespace-nowrap cursor-pointer transition-all"
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>Edit FAQs &amp; Reviews</span>
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
