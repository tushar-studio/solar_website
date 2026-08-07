"use client";

import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Clock, MessageCircle, Send, CheckCircle2 } from "lucide-react";
import { company } from "@/lib/data";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { fadeLeft, fadeRight, viewportOnce } from "@/lib/animations";
import { Button } from "@/components/ui/Button";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { useState } from "react";

export function ContactSection() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({ name: "", phone: "", email: "", inquiryType: "", message: "" });
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});
  const [success, setSuccess] = useState(false);

  const contactItems = [
    { icon: Phone, label: t.contact.phoneLabel, value: company.phone },
    { icon: MessageCircle, label: t.contact.whatsappLabel, value: company.whatsapp },
    { icon: Mail, label: t.contact.emailLabel, value: company.email },
    { icon: MapPin, label: t.contact.addressLabel, value: t.contact.addressValue },
    { icon: Clock, label: t.contact.workingHoursLabel, value: t.contact.workingHoursValue },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors: { name?: string; phone?: string } = {};
    if (!formData.name.trim()) nextErrors.name = t.contact.validationName;
    if (!/^\d{10}$/.test(formData.phone.trim())) nextErrors.phone = t.contact.validationPhone;
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const msg = encodeURIComponent(
      `*New Solar Inquiry*\n\nName: ${formData.name}\nPhone: ${formData.phone}\nEmail: ${formData.email}\nInquiry: ${formData.inquiryType}\nMessage: ${formData.message}`
    );
    window.open(`https://wa.me/919568486108?text=${msg}`, "_blank");
    setSuccess(true);
    window.setTimeout(() => setSuccess(false), 6000);
    setFormData({ name: "", phone: "", email: "", inquiryType: "", message: "" });
  };

  const set =
    (field: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setFormData((p) => ({ ...p, [field]: e.target.value }));

  return (
    <section id="contact" className="py-section-sm sm:py-section">
      <div className="section-container">
        <SectionHeader title={t.sections.contactTitle} subtitle={t.sections.contactSubtitle} align="center" />
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          <motion.div variants={fadeLeft} initial="hidden" whileInView="visible" viewport={viewportOnce} className="space-y-4">
            {contactItems.map((item) => (
              <div key={item.label} className="glass-card p-5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide">{item.label}</p>
                  <p className="font-medium text-solar-blue-dark">{item.value}</p>
                </div>
              </div>
            ))}
            <a
              href={company.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t.contact.mapTitle}
              className="block relative h-[180px] rounded-2xl overflow-hidden border border-slate-700/80 group cursor-pointer transition-transform duration-300 hover:scale-105 transform-gpu shadow-lg"
            >
              {/* Interactive Google Maps preview */}
              <iframe
                title={t.contact.mapTitle}
                src="https://www.google.com/maps?q=Ring%20Road%2C%20Behind%20ICICI%20Bank%2C%20Jogiwala%2C%20Dehradun%2C%20Uttarakhand%20248014&output=embed"
                className="absolute inset-0 w-full h-full pointer-events-none"
                loading="lazy"
                style={{ border: 0, filter: "saturate(0.85) contrast(1.05)" }}
              />
              {/* Blend overlay for theme */}
              <div className="absolute inset-0 bg-slate-900/25 pointer-events-none" />

              {/* Glowing emerald pin with pulse ring */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                <span className="relative flex w-10 h-10 items-center justify-center">
                  <span className="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-emerald-400 opacity-50" />
                  <MapPin className="relative w-9 h-9 text-emerald-400 drop-shadow-[0_0_10px_rgba(16,185,129,0.9)]" />
                </span>
              </div>

              {/* Hover glass overlay badge */}
              <div className="absolute inset-x-3 bottom-3 rounded-xl bg-slate-900/70 backdrop-blur-md border border-white/10 px-3 py-2 text-xs font-medium text-white text-center transition-all duration-300">
                {t.contact.mapCta}
              </div>
            </a>
          </motion.div>

          <motion.form variants={fadeRight} initial="hidden" whileInView="visible" viewport={viewportOnce} className="glass-card p-6 sm:p-8 space-y-4" onSubmit={handleSubmit} noValidate>
            <h3 className="font-display font-semibold text-xl text-solar-blue-dark mb-2">{t.contact.inquiry}</h3>

            {success && (
              <div className="flex items-start gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-sm">{t.contact.successTitle}</p>
                  <p className="text-sm mt-0.5">{t.contact.successMessage}</p>
                </div>
              </div>
            )}

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <input type="text" value={formData.name} onChange={set("name")} placeholder={t.contact.fullName} className={`input-field ${errors.name ? "!border-red-400" : ""}`} />
                {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
              </div>
              <div>
                <input type="tel" value={formData.phone} onChange={set("phone")} placeholder={t.contact.phone} className={`input-field ${errors.phone ? "!border-red-400" : ""}`} />
                {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone}</p>}
              </div>
            </div>
            <input type="email" value={formData.email} onChange={set("email")} placeholder={t.contact.email} className="input-field" />
            <select value={formData.inquiryType} onChange={set("inquiryType")} className="select-field">
              <option value="" disabled>{t.contact.inquiryType}</option>
              {t.contact.inquiryOptions.map((opt) => (
                <option key={opt}>{opt}</option>
              ))}
            </select>
            <textarea value={formData.message} onChange={set("message")} placeholder={t.contact.message} rows={4} className="input-field resize-none" />
            <div className="flex flex-wrap gap-3">
              <Button type="submit"><Send className="w-4 h-4" /> {t.contact.sendViaWhatsapp}</Button>
              <a href={`tel:${company.phone}`} className="btn-secondary ripple inline-flex"><Phone className="w-4 h-4" /> {t.common.callNow}</a>
            </div>
          </motion.form>
        </div>
      </div>
    </section>
  );
}
