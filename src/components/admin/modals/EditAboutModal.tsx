"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, BookOpen, Check, Loader2 } from "lucide-react";
import { useSiteConfig } from "@/lib/config/SiteConfigProvider";
import { AboutConfig } from "@/lib/site-config";

export function EditAboutModal() {
  const { activeEditor, closeEditor, config, saveConfigAndSync } = useSiteConfig();
  const isOpen = activeEditor === "about";

  const [aboutData, setAboutData] = useState<AboutConfig>({
    storyTitle: "Company Story",
    storyText: "",
    missionTitle: "Our Mission",
    missionText: "",
    visionTitle: "Our Vision",
    visionText: "",
    valuesTitle: "Our Values",
    valuesText: "",
    teamTitle: "Our Team",
    teamText: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (config?.about) {
      setAboutData(config.about);
    }
  }, [config, isOpen]);

  if (!isOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const res = await saveConfigAndSync({ about: aboutData });
    setIsSaving(false);

    if (res.success) {
      setSavedSuccess(true);
      setTimeout(() => {
        setSavedSuccess(false);
        closeEditor();
        window.location.reload();
      }, 600);
    } else {
      alert("Error saving About section: " + res.message);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-3xl max-h-[90vh] bg-slate-900 border border-purple-500/40 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white font-display">Edit About Us Section</h2>
                <p className="text-xs text-slate-400">Directly edit Company Story, Mission, Vision, and Values</p>
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
          <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-5">
            {/* Story */}
            <div className="space-y-2 p-4 bg-slate-800/60 border border-slate-700/80 rounded-2xl">
              <label className="block text-xs font-bold uppercase text-purple-400">Company Story</label>
              <input
                type="text"
                value={aboutData.storyTitle}
                onChange={(e) => setAboutData({ ...aboutData, storyTitle: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm font-semibold"
                placeholder="Title"
              />
              <textarea
                rows={3}
                value={aboutData.storyText}
                onChange={(e) => setAboutData({ ...aboutData, storyText: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm leading-relaxed"
                placeholder="Detailed story text"
              />
            </div>

            {/* Mission & Vision */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2 p-4 bg-slate-800/60 border border-slate-700/80 rounded-2xl">
                <label className="block text-xs font-bold uppercase text-sky-400">Our Mission</label>
                <input
                  type="text"
                  value={aboutData.missionTitle}
                  onChange={(e) => setAboutData({ ...aboutData, missionTitle: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm font-semibold"
                  placeholder="Title"
                />
                <textarea
                  rows={3}
                  value={aboutData.missionText}
                  onChange={(e) => setAboutData({ ...aboutData, missionText: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm leading-relaxed"
                  placeholder="Mission statement"
                />
              </div>

              <div className="space-y-2 p-4 bg-slate-800/60 border border-slate-700/80 rounded-2xl">
                <label className="block text-xs font-bold uppercase text-emerald-400">Our Vision</label>
                <input
                  type="text"
                  value={aboutData.visionTitle}
                  onChange={(e) => setAboutData({ ...aboutData, visionTitle: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm font-semibold"
                  placeholder="Title"
                />
                <textarea
                  rows={3}
                  value={aboutData.visionText}
                  onChange={(e) => setAboutData({ ...aboutData, visionText: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm leading-relaxed"
                  placeholder="Vision statement"
                />
              </div>
            </div>

            {/* Values & Team */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2 p-4 bg-slate-800/60 border border-slate-700/80 rounded-2xl">
                <label className="block text-xs font-bold uppercase text-amber-400">Our Values</label>
                <input
                  type="text"
                  value={aboutData.valuesTitle}
                  onChange={(e) => setAboutData({ ...aboutData, valuesTitle: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm font-semibold"
                  placeholder="Title"
                />
                <textarea
                  rows={3}
                  value={aboutData.valuesText}
                  onChange={(e) => setAboutData({ ...aboutData, valuesText: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm leading-relaxed"
                  placeholder="Values description"
                />
              </div>

              <div className="space-y-2 p-4 bg-slate-800/60 border border-slate-700/80 rounded-2xl">
                <label className="block text-xs font-bold uppercase text-teal-400">Our Team</label>
                <input
                  type="text"
                  value={aboutData.teamTitle}
                  onChange={(e) => setAboutData({ ...aboutData, teamTitle: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm font-semibold"
                  placeholder="Title"
                />
                <textarea
                  rows={3}
                  value={aboutData.teamText}
                  onChange={(e) => setAboutData({ ...aboutData, teamText: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm leading-relaxed"
                  placeholder="Team experience & credentials"
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
                  className="px-6 py-2.5 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-lg shadow-purple-500/25 flex items-center gap-2 cursor-pointer transition-all"
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
