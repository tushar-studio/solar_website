"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Phone, MessageSquare, Mail, MapPin, Clock, Check, Loader2 } from "lucide-react";
import { useSiteConfig } from "@/lib/config/SiteConfigProvider";
import { CompanyConfig } from "@/lib/site-config";

export function EditContactModal() {
  const { activeEditor, closeEditor, config, saveConfigAndSync } = useSiteConfig();
  const isOpen = activeEditor === "contact";

  const [companyData, setCompanyData] = useState<CompanyConfig>({
    name: "",
    tagline: "",
    phone: "",
    whatsapp: "",
    email: "",
    address: "",
    workingHours: "",
    mapUrl: "",
    website: "",
    socialInstagram: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (config?.company) {
      setCompanyData(config.company);
    }
  }, [config, isOpen]);

  if (!isOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const res = await saveConfigAndSync({ company: companyData });
    setIsSaving(false);

    if (res.success) {
      setSavedSuccess(true);
      setTimeout(() => {
        setSavedSuccess(false);
        closeEditor();
        window.location.reload();
      }, 600);
    } else {
      alert("Error saving contact details: " + res.message);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-2xl max-h-[90vh] bg-slate-900 border border-teal-500/40 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-400">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white font-display">Edit Personal Contacts &amp; WhatsApp</h2>
                <p className="text-xs text-slate-400">Updates live across Header call buttons, Footer, and WhatsApp actions</p>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-teal-400 mb-1.5 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5" /> Calling Phone Number
                </label>
                <input
                  type="text"
                  value={companyData.phone}
                  onChange={(e) => setCompanyData({ ...companyData, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm font-mono"
                  placeholder="e.g. 9568486108"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-emerald-400 mb-1.5 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5" /> WhatsApp Contact Number
                </label>
                <input
                  type="text"
                  value={companyData.whatsapp}
                  onChange={(e) => setCompanyData({ ...companyData, whatsapp: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm font-mono"
                  placeholder="e.g. 9568486108"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-sky-400 mb-1.5 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" /> Support Email Address
                </label>
                <input
                  type="email"
                  value={companyData.email}
                  onChange={(e) => setCompanyData({ ...companyData, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm"
                  placeholder="info@suryagharyojana.online"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-amber-400 mb-1.5 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" /> Working Hours
                </label>
                <input
                  type="text"
                  value={companyData.workingHours}
                  onChange={(e) => setCompanyData({ ...companyData, workingHours: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm"
                  placeholder="Monday – Sunday, 9:00 AM – 6:30 PM"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-rose-400" /> Physical Office Address
              </label>
              <textarea
                rows={2}
                value={companyData.address}
                onChange={(e) => setCompanyData({ ...companyData, address: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm"
                placeholder="Full address"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">Google Maps Link</label>
                <input
                  type="text"
                  value={companyData.mapUrl}
                  onChange={(e) => setCompanyData({ ...companyData, mapUrl: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs truncate"
                  placeholder="https://share.google/..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">Instagram Profile Link</label>
                <input
                  type="text"
                  value={companyData.socialInstagram}
                  onChange={(e) => setCompanyData({ ...companyData, socialInstagram: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs truncate"
                  placeholder="https://instagram.com/sundeyasolar"
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
                  className="px-6 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-lg shadow-teal-500/25 flex items-center gap-2 cursor-pointer transition-all"
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
