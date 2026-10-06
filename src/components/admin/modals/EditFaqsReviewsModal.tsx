"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, HelpCircle, Star, Plus, Trash2, Check, Loader2 } from "lucide-react";
import { useSiteConfig } from "@/lib/config/SiteConfigProvider";
import { FAQItem, ReviewItem } from "@/lib/site-config";

export function EditFaqsReviewsModal() {
  const { activeEditor, closeEditor, config, saveConfigAndSync } = useSiteConfig();
  const isOpen = activeEditor === "faqs" || activeEditor === "reviews";

  const [tab, setTab] = useState<"faqs" | "reviews">("faqs");
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (config) {
      setFaqs(config.faqs || []);
      setReviews(config.reviews || []);
    }
    if (activeEditor === "reviews") setTab("reviews");
    else setTab("faqs");
  }, [config, activeEditor]);

  if (!isOpen) return null;

  const handleAddFaq = () => {
    const newFaq: FAQItem = {
      id: `faq_${Date.now()}`,
      question: "New FAQ Question?",
      answer: "Detailed answer goes here.",
    };
    setFaqs([...faqs, newFaq]);
  };

  const handleAddReview = () => {
    const newRev: ReviewItem = {
      id: `rev_${Date.now()}`,
      name: "Customer Name",
      rating: 5,
      review: "Solar installation feedback here.",
      location: "Dehradun",
    };
    setReviews([...reviews, newRev]);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const res = await saveConfigAndSync({ faqs, reviews });
    setIsSaving(false);

    if (res.success) {
      setSavedSuccess(true);
      setTimeout(() => {
        setSavedSuccess(false);
        closeEditor();
        window.location.reload();
      }, 600);
    } else {
      alert("Error saving: " + res.message);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-3xl max-h-[90vh] bg-slate-900 border border-amber-500/40 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                {tab === "faqs" ? <HelpCircle className="w-5 h-5" /> : <Star className="w-5 h-5" />}
              </div>
              <div>
                <h2 className="text-lg font-bold text-white font-display">Edit FAQs &amp; Customer Reviews</h2>
                <div className="flex gap-2 mt-1">
                  <button
                    type="button"
                    onClick={() => setTab("faqs")}
                    className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                      tab === "faqs" ? "bg-amber-500 text-white" : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    FAQs ({faqs.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setTab("reviews")}
                    className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                      tab === "reviews" ? "bg-amber-500 text-white" : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    Customer Reviews ({reviews.length})
                  </button>
                </div>
              </div>
            </div>
            <button
              onClick={closeEditor}
              className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-4">
            {tab === "faqs" && (
              <div className="space-y-3">
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleAddFaq}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Question
                  </button>
                </div>

                {faqs.map((f, i) => (
                  <div key={f.id} className="p-3.5 bg-slate-800/80 border border-slate-700 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-400">Question #{i + 1}</span>
                      <button
                        type="button"
                        onClick={() => setFaqs(faqs.filter((item) => item.id !== f.id))}
                        className="text-slate-400 hover:text-rose-400 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <input
                      type="text"
                      value={f.question}
                      onChange={(e) =>
                        setFaqs(faqs.map((item) => (item.id === f.id ? { ...item, question: e.target.value } : item)))
                      }
                      className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm font-medium"
                    />
                    <textarea
                      rows={2}
                      value={f.answer}
                      onChange={(e) =>
                        setFaqs(faqs.map((item) => (item.id === f.id ? { ...item, answer: e.target.value } : item)))
                      }
                      className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-300 text-xs"
                    />
                  </div>
                ))}
              </div>
            )}

            {tab === "reviews" && (
              <div className="space-y-3">
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleAddReview}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Review
                  </button>
                </div>

                {reviews.map((r) => (
                  <div key={r.id} className="p-3.5 bg-slate-800/80 border border-slate-700 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <input
                        type="text"
                        value={r.name}
                        onChange={(e) =>
                          setReviews(reviews.map((item) => (item.id === r.id ? { ...item, name: e.target.value } : item)))
                        }
                        className="px-2 py-1 bg-slate-900 border border-slate-700 rounded text-white text-xs font-semibold"
                        placeholder="Customer Name"
                      />
                      <button
                        type="button"
                        onClick={() => setReviews(reviews.filter((item) => item.id !== r.id))}
                        className="text-slate-400 hover:text-rose-400 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={r.location || ""}
                        onChange={(e) =>
                          setReviews(
                            reviews.map((item) => (item.id === r.id ? { ...item, location: e.target.value } : item))
                          )
                        }
                        className="px-2 py-1 bg-slate-900 border border-slate-700 rounded text-slate-300 text-xs"
                        placeholder="City"
                      />
                      <div className="flex items-center gap-1 text-xs text-amber-400">
                        <span>★</span>
                        <input
                          type="number"
                          min="1"
                          max="5"
                          value={r.rating}
                          onChange={(e) =>
                            setReviews(
                              reviews.map((item) =>
                                item.id === r.id ? { ...item, rating: Number(e.target.value) } : item
                              )
                            )
                          }
                          className="w-12 px-1.5 py-0.5 bg-slate-900 border border-slate-700 rounded text-white text-xs text-center"
                        />
                      </div>
                    </div>
                    <textarea
                      rows={2}
                      value={r.review}
                      onChange={(e) =>
                        setReviews(reviews.map((item) => (item.id === r.id ? { ...item, review: e.target.value } : item)))
                      }
                      className="w-full px-2 py-1 bg-slate-900 border border-slate-700 rounded text-slate-300 text-xs"
                    />
                  </div>
                ))}
              </div>
            )}

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
                  className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-lg shadow-amber-500/25 flex items-center gap-2 cursor-pointer transition-all"
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
