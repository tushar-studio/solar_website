"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Image as ImageIcon, Plus, Trash2, Upload, Loader2, Check } from "lucide-react";
import { useSiteConfig } from "@/lib/config/SiteConfigProvider";

export function EditGalleryModal() {
  const { activeEditor, closeEditor, config, saveConfigAndSync } = useSiteConfig();
  const isOpen = activeEditor === "gallery";

  const [category, setCategory] = useState("Residential Projects");
  const [caption, setCaption] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const body = new FormData();
    body.append("file", file);
    body.append("category", category);
    body.append("caption", caption);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body,
      });
      const data = await res.json();
      if (data.success && data.item) {
        const newGallery = [data.item, ...(config.gallery || [])];
        await saveConfigAndSync({ gallery: newGallery });
        setCaption("");
        if (fileInputRef.current) fileInputRef.current.value = "";
      } else {
        alert(data.message || "Failed to upload image");
      }
    } catch {
      alert("Network error uploading image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (window.confirm("Delete this photo from the website gallery?")) {
      const newGallery = config.gallery.filter((g) => g.id !== id);
      await saveConfigAndSync({ gallery: newGallery });
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-4xl max-h-[90vh] bg-slate-900 border border-sky-500/40 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400">
                <ImageIcon className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white font-display">Manage Gallery Photos</h2>
                <p className="text-xs text-slate-400">Upload new project photos from phone/laptop or remove old ones</p>
              </div>
            </div>
            <button
              onClick={closeEditor}
              className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Upload Box */}
            <div className="p-4 bg-slate-800/80 border border-slate-700 rounded-2xl space-y-3">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Upload className="w-4 h-4 text-sky-400" />
                Upload New Photo
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm"
                  >
                    <option value="Residential Projects">Residential Projects</option>
                    <option value="Commercial Projects">Commercial Projects</option>
                    <option value="Industrial Projects">Industrial Projects</option>
                    <option value="Before & After">Before &amp; After</option>
                    <option value="Drone Shots">Drone Shots</option>
                    <option value="Videos">Videos</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">Caption (Optional)</label>
                  <input
                    type="text"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="e.g. 5kW Bifacial System, Dehradun"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm"
                  />
                </div>
              </div>

              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="modal-gallery-upload"
                />
                <label
                  htmlFor="modal-gallery-upload"
                  className={`inline-flex items-center gap-2 px-5 py-2.5 bg-sky-500 hover:bg-sky-600 text-white font-medium text-xs rounded-xl cursor-pointer shadow-md transition-all ${
                    isUploading ? "opacity-50 pointer-events-none" : ""
                  }`}
                >
                  {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  <span>{isUploading ? "Uploading..." : "Select Image from Device"}</span>
                </label>
              </div>
            </div>

            {/* List */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Current Photos ({config.gallery?.length || 0})
              </h3>

              {!config.gallery || config.gallery.length === 0 ? (
                <div className="p-8 border border-dashed border-slate-700 rounded-2xl text-center text-slate-500 text-sm">
                  No photos uploaded yet. Use the upload box above.
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {config.gallery.map((item) => (
                    <div
                      key={item.id}
                      className="group relative aspect-square rounded-xl bg-slate-800 border border-slate-700 overflow-hidden"
                    >
                      <img src={item.url} alt={item.caption || "Photo"} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/60 p-2 flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={() => handleDeleteItem(item.id)}
                            className="p-1.5 bg-rose-600 text-white rounded-lg hover:bg-rose-700 cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <span className="text-[10px] text-white bg-sky-600 px-1.5 py-0.5 rounded truncate">
                          {item.category}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end p-4 border-t border-slate-800">
            <button
              onClick={() => {
                closeEditor();
                window.location.reload();
              }}
              className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm rounded-xl cursor-pointer"
            >
              OK — Done
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
