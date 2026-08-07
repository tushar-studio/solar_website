"use client";

import Link from "next/link";
import { Phone, Mail, MapPin, Instagram, ShieldCheck } from "lucide-react";
import { company } from "@/lib/data";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { useTheme } from "@/lib/theme/ThemeProvider";

/* ═════════════════════════════════════════════════════════════════════════
   Sundeya Solar — 2-State Dynamic Animated Footer
   ─────────────────────────────────────────────────────────────────────────
   STRICT 3-TIER Z-INDEX ARCHITECTURE:

     z-0  → Upper sky atmosphere (Sun/Moon, Clouds, Stars) @ opacity 30–40%
     z-10 → Bottom horizon strip (Grass, Windmills, Squirrel, Panels)
     z-20 → ALL UI text, links, contact buttons — ALWAYS ON TOP

   Bottom horizon is ONE continuous strip: absolute bottom-0 inset-x-0 h-48
   with grass spanning full width, windmills grouped left, squirrel/fireflies
   center, solar panels grouped right.
   ═════════════════════════════════════════════════════════════════════════ */

export interface FooterProps {
  theme?: "light" | "dark";
}

const CALCULATOR_HREFS = ["/calculator", "/subsidy", "/emi-calculator", "/calculator"];
const SCHEME_HREFS = ["/subsidy", "/subsidy", "/subsidy", "/subsidy"];

/* ═════════════════════════════════════════════════════════════════════════
   LAYER 0 — UPPER SKY ATMOSPHERE (z-0, opacity 30–40%)
   ═════════════════════════════════════════════════════════════════════════ */

/* Sky gradient backdrop */
function SkyBackdrop({ isNight }: { isNight: boolean }) {
  return (
    <div
      className={[
        "absolute inset-0",
        isNight
          ? "bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950"
          : "bg-gradient-to-b from-orange-800 via-orange-700 to-amber-900",
      ].join(" ")}
      aria-hidden="true"
    />
  );
}

/* Dusk sun — top-right, soft radial glow, never over content boxes */
function DuskSun() {
  return (
    <div
      className="absolute top-4 right-10 z-0 opacity-40 pointer-events-none"
      aria-hidden="true"
    >
      {/* Soft radial halo */}
      <div
        className="absolute -inset-8 rounded-full blur-xl"
        style={{ background: "radial-gradient(circle, rgba(251,191,36,0.55), transparent 70%)" }}
      />
      <svg width="88" height="88" viewBox="0 0 88 88" className="relative">
        <defs>
          <radialGradient id="sun-core">
            <stop offset="0%" stopColor="#FDE68A" />
            <stop offset="65%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#D97706" />
          </radialGradient>
        </defs>
        {/* Ray flare rings */}
        <circle cx="44" cy="44" r="41" fill="none" stroke="rgba(251,191,36,0.35)" strokeWidth="1.5" />
        <circle cx="44" cy="44" r="34" fill="none" stroke="rgba(251,191,36,0.22)" strokeWidth="1" />
        {/* Disk */}
        <circle cx="44" cy="44" r="26" fill="url(#sun-core)" />
      </svg>
    </div>
  );
}

/* Night moon — top-right, crescent with soft aura */
function NightMoon() {
  return (
    <div
      className="absolute top-4 right-10 z-0 opacity-40 pointer-events-none"
      aria-hidden="true"
    >
      {/* Soft radial halo */}
      <div
        className="absolute -inset-8 rounded-full blur-xl"
        style={{ background: "radial-gradient(circle, rgba(226,232,240,0.4), transparent 70%)" }}
      />
      <svg width="80" height="80" viewBox="0 0 80 80" className="relative">
        <defs>
          <mask id="crescent-cut">
            <circle cx="40" cy="40" r="30" fill="white" />
            <circle cx="51" cy="35" r="28" fill="black" />
          </mask>
        </defs>
        <circle cx="40" cy="40" r="30" fill="#F1F5F9" mask="url(#crescent-cut)" />
        {/* Craters */}
        <circle cx="29" cy="30" r="2.6" fill="#CBD5E1" opacity="0.7" />
        <circle cx="35" cy="50" r="1.8" fill="#CBD5E1" opacity="0.6" />
        <circle cx="26" cy="44" r="1.4" fill="#CBD5E1" opacity="0.5" />
      </svg>
    </div>
  );
}

/* Clouds — very top of card only (top-2 band), opacity-25, never over text */
interface CloudSpec {
  left: string;
  top: string;
  w: number;
  h: number;
  duration: number;
  delay: number;
}

const CLOUDS: CloudSpec[] = [
  { left: "4%", top: "8px", w: 120, h: 30, duration: 26, delay: 0 },
  { left: "30%", top: "18px", w: 96, h: 26, duration: 30, delay: 4 },
  { left: "56%", top: "6px", w: 132, h: 32, duration: 34, delay: 2 },
];

function CloudLayer({ isNight }: { isNight: boolean }) {
  const cloudColor = isNight ? "rgba(148,163,184,0.8)" : "rgba(255,251,245,0.95)";
  return (
    <div
      className="absolute inset-x-0 top-2 h-20 overflow-hidden pointer-events-none z-0 opacity-25"
      aria-hidden="true"
    >
      {CLOUDS.map((c, i) => (
        <div
          key={i}
          className="footer-cloud-anim absolute rounded-full blur-lg"
          style={{
            left: c.left,
            top: c.top,
            width: c.w,
            height: c.h,
            background: cloudColor,
            animationDuration: `${c.duration}s`,
            animationDelay: `${c.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

/* Birds — top sky band only, subtle */
function BirdLayer({ isNight }: { isNight: boolean }) {
  const birds = [
    { top: "14px", left: "12%", delay: "0s" },
    { top: "34px", left: "26%", delay: "1.1s" },
    { top: "10px", left: "48%", delay: "0.5s" },
    { top: "30px", left: "62%", delay: "1.7s" },
  ];
  const birdColor = isNight ? "#94A3B8" : "#1F2937";

  return (
    <div
      className="absolute inset-x-0 top-2 h-24 overflow-hidden pointer-events-none z-0 opacity-40"
      aria-hidden="true"
    >
      {birds.map((b, i) => (
        <svg
          key={i}
          width="36"
          height="16"
          viewBox="0 0 36 16"
          className="absolute footer-bird-anim"
          style={{ top: b.top, left: b.left, animationDelay: b.delay }}
        >
          <path
            d="M5 9 L18 3 L31 9 M18 3 L15.5 6.5 M18 3 L20.5 6.5"
            stroke={birdColor}
            strokeWidth="1.2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ))}
    </div>
  );
}

/* Stars — night only, upper sky region */
function StarLayer() {
  const stars = Array.from({ length: 22 }, () => ({
    x: Math.random() * 100,
    y: Math.random() * 46,
    size: Math.random() * 1.8 + 0.8,
    duration: Math.random() * 2.5 + 2.5,
    delay: Math.random() * 2,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none z-0 opacity-40" aria-hidden="true">
      {stars.map((s, i) => (
        <div
          key={i}
          className="footer-star-anim absolute rounded-full bg-white"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            animationDuration: `${s.duration}s`,
            animationDelay: `${s.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

/* ═════════════════════════════════════════════════════════════════════════
   LAYER 10 — BOTTOM HORIZON STRIP (z-10, single continuous container)
   ═════════════════════════════════════════════════════════════════════════ */

/* Grass — full-width SVG path across the bottom edge (NOT a diagonal wedge) */
function GrassStrip() {
  return (
    <svg
      className="absolute inset-x-0 bottom-0 w-full h-28"
      viewBox="0 0 1200 120"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="grass-strip-grad" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#047857" />
          <stop offset="55%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#34D399" />
        </linearGradient>
        <linearGradient id="grass-back-grad" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#064E3B" />
          <stop offset="100%" stopColor="#065F46" />
        </linearGradient>
      </defs>

      {/* Back silhouette — soft rolling baseline across FULL width */}
      <path
        d="M0,120 L0,74 Q60,58 120,70 Q180,50 240,66 Q300,46 360,62 Q420,44 480,60
           Q540,42 600,58 Q660,44 720,62 Q780,46 840,64 Q900,48 960,66
           Q1020,50 1080,68 Q1140,54 1200,70 L1200,120 Z"
        fill="url(#grass-back-grad)"
        opacity="0.9"
      />

      {/* Foreground spiky blades — evenly distributed across FULL width */}
      <path
        d="M0,120
           L14,96 L22,60 L30,94 L44,72 L52,34 L60,70 L74,92 L84,52 L94,90
           L108,74 L116,38 L124,72 L138,94 L148,58 L158,92 L172,76 L180,40 L188,74
           L202,96 L212,56 L222,92 L236,72 L244,32 L252,70 L266,94 L276,54 L286,90
           L300,74 L308,36 L316,72 L330,94 L340,58 L350,92 L364,76 L372,42 L380,74
           L394,96 L404,60 L414,92 L428,72 L436,34 L444,70 L458,94 L468,54 L478,90
           L492,74 L500,38 L508,72 L522,94 L532,58 L542,92 L556,76 L564,40 L572,74
           L586,96 L596,56 L606,92 L620,72 L628,32 L636,70 L650,94 L660,54 L670,90
           L684,74 L692,36 L700,72 L714,94 L724,58 L734,92 L748,76 L756,42 L764,74
           L778,96 L788,60 L798,92 L812,72 L820,34 L828,70 L842,94 L852,54 L862,90
           L876,74 L884,38 L892,72 L906,94 L916,58 L926,92 L940,76 L948,40 L956,74
           L970,96 L980,56 L990,92 L1004,72 L1012,32 L1020,70 L1034,94 L1044,54 L1054,90
           L1068,74 L1076,36 L1084,72 L1098,94 L1108,58 L1118,92 L1132,76 L1140,42 L1148,74
           L1162,96 L1172,60 L1182,92 L1194,78 L1200,120 Z"
        fill="url(#grass-strip-grad)"
      />
    </svg>
  );
}

/* Windmill — single unit, white outline style */
interface WindmillProps {
  uid: string;
  spinSeconds: number;
  isNight: boolean;
  scale: number;
}

function Windmill({ uid, spinSeconds, isNight, scale }: WindmillProps) {
  const stroke = isNight ? "#E2E8F0" : "#F8FAFC";
  const blade = isNight ? "#F1F5F9" : "#FFFFFF";
  const w = 56 * scale;
  const h = 150 * scale;

  return (
    <svg width={w} height={h} viewBox="0 0 56 150" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id={`wm-${uid}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={stroke} stopOpacity="0.95" />
          <stop offset="1" stopColor={stroke} stopOpacity="0.65" />
        </linearGradient>
      </defs>

      {/* Tapered tower */}
      <polygon points="25,150 31,150 29.4,48 26.6,48" fill={`url(#wm-${uid})`} />
      {/* Lattice struts */}
      <line x1="26" y1="128" x2="30" y2="96" stroke={stroke} strokeWidth="0.7" opacity="0.55" />
      <line x1="30" y1="128" x2="26" y2="96" stroke={stroke} strokeWidth="0.7" opacity="0.55" />
      <line x1="26.5" y1="92" x2="29.5" y2="64" stroke={stroke} strokeWidth="0.7" opacity="0.45" />
      <line x1="29.5" y1="92" x2="26.5" y2="64" stroke={stroke} strokeWidth="0.7" opacity="0.45" />

      {/* Nacelle */}
      <rect x="23" y="42" width="10" height="7" rx="2.5" fill={stroke} opacity="0.9" />

      {/* Rotor */}
      <g style={{ transformOrigin: "28px 45px", animation: `spinBlades ${spinSeconds}s linear infinite` }}>
        {[0, 120, 240].map((a) => (
          <g key={a} transform={`rotate(${a} 28 45)`}>
            <path
              d="M28 45 C25.6 34, 26.8 20, 28 8 C29.6 20, 30.4 34, 28 45 Z"
              fill={blade}
              opacity="0.92"
            />
          </g>
        ))}
      </g>
      <circle cx="28" cy="45" r="3.2" fill={blade} />
    </svg>
  );
}

/* Solar panel — angled 3D cyan panel */
interface SolarPanelProps {
  uid: string;
  isNight: boolean;
  scale: number;
  sweepDelay: string;
}

function SolarPanel({ uid, isNight, scale, sweepDelay }: SolarPanelProps) {
  const frame = isNight ? "#38BDF8" : "#22D3EE";
  const face = isNight ? "#0B3A5C" : "#0E4C6B";
  const w = 62 * scale;
  const h = 116 * scale;

  return (
    <svg width={w} height={h} viewBox="0 0 62 116" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id={`sp-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={face} />
          <stop offset="100%" stopColor="#082F4F" />
        </linearGradient>
        <clipPath id={`sp-clip-${uid}`}>
          <path d="M10,14 L52,8 L56,86 L14,92 Z" />
        </clipPath>
      </defs>

      {/* Support legs */}
      <line x1="20" y1="90" x2="18" y2="112" stroke={frame} strokeWidth="2" opacity="0.85" />
      <line x1="48" y1="86" x2="50" y2="110" stroke={frame} strokeWidth="2" opacity="0.85" />
      <line x1="18" y1="112" x2="50" y2="110" stroke={frame} strokeWidth="1.6" opacity="0.6" />

      {/* Panel face (angled) */}
      <path d="M10,14 L52,8 L56,86 L14,92 Z" fill={`url(#sp-${uid})`} stroke={frame} strokeWidth="1.8" />

      {/* PV cell grid */}
      <g clipPath={`url(#sp-clip-${uid})`} stroke={frame} strokeWidth="0.7" opacity="0.55">
        <line x1="24" y1="6" x2="27" y2="94" />
        <line x1="38" y1="5" x2="41" y2="93" />
        <line x1="8" y1="34" x2="58" y2="28" />
        <line x1="9" y1="54" x2="59" y2="48" />
        <line x1="10" y1="74" x2="60" y2="68" />
      </g>

      {/* Night energy sweep */}
      {isNight && (
        <g clipPath={`url(#sp-clip-${uid})`}>
          <rect
            className="footer-sweep-anim"
            x="6"
            y="0"
            width="54"
            height="26"
            fill="rgba(34,211,238,0.45)"
            style={{ animationDelay: sweepDelay }}
          />
        </g>
      )}

      {/* Glow rim at night */}
      {isNight && (
        <path
          d="M10,14 L52,8 L56,86 L14,92 Z"
          fill="none"
          stroke="rgba(34,211,238,0.85)"
          strokeWidth="1.2"
        />
      )}
    </svg>
  );
}

/* Squirrel — dusk only, sits in center grass gap */
function Squirrel() {
  return (
    <svg width="78" height="84" viewBox="0 0 85 90" fill="none" aria-hidden="true">
      {/* Tail */}
      <ellipse cx="65" cy="30" rx="14" ry="22" fill="#8B6F47" opacity="0.92" transform="rotate(-35 65 30)" />
      <ellipse cx="68" cy="33" rx="10" ry="18" fill="#A0826D" opacity="0.85" transform="rotate(-30 68 33)" />

      {/* Back legs */}
      <ellipse cx="35" cy="72" rx="8" ry="12" fill="#6B5344" />
      <ellipse cx="50" cy="74" rx="8" ry="11" fill="#6B5344" />

      {/* Body + belly */}
      <ellipse cx="42" cy="50" rx="18" ry="22" fill="#9D8B7A" />
      <ellipse cx="42" cy="55" rx="12" ry="15" fill="#D4C4B0" opacity="0.85" />

      {/* Head */}
      <circle cx="42" cy="32" r="14" fill="#A89878" />

      {/* Ears */}
      <circle cx="32" cy="20" r="6" fill="#8B7355" />
      <circle cx="32" cy="20" r="3.4" fill="#D4C4B0" />
      <circle cx="52" cy="20" r="6" fill="#8B7355" />
      <circle cx="52" cy="20" r="3.4" fill="#D4C4B0" />

      {/* Face */}
      <circle cx="38" cy="30" r="2" fill="#1F2937" />
      <circle cx="46" cy="30" r="2" fill="#1F2937" />
      <circle cx="42" cy="36" r="1.5" fill="#1F2937" />

      {/* Paws + nut */}
      <g className="footer-squirrel-anim" style={{ transformOrigin: "42px 45px" }}>
        <ellipse cx="42" cy="45" rx="5" ry="6" fill="#8B6F47" />
        <ellipse cx="38" cy="43" rx="2.5" ry="3.5" fill="#6B5344" />
        <ellipse cx="46" cy="43" rx="2.5" ry="3.5" fill="#6B5344" />
      </g>
    </svg>
  );
}

/* Fireflies — night only, dance across the grass band */
const FIREFLIES = Array.from({ length: 16 }, (_, i) => ({
  x: 4 + ((i * 6.1) % 92),
  y: 30 + ((i * 13) % 55),
  color: ["#FCD34D", "#F59E0B", "#22D3EE", "#A7F3D0"][i % 4],
  size: 2 + ((i * 7) % 4) * 0.6,
  duration: 6 + ((i * 5) % 8),
  delay: (i % 6) * 0.5,
}));

function FireflyField() {
  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
      {FIREFLIES.map((ff, i) => (
        <div
          key={i}
          className="footer-firefly-anim absolute rounded-full"
          style={{
            left: `${ff.x}%`,
            top: `${ff.y}%`,
            width: ff.size,
            height: ff.size,
            backgroundColor: ff.color,
            boxShadow: `0 0 ${ff.size * 2.5}px ${ff.color}`,
            "--firefly-duration": `${ff.duration}s`,
            "--firefly-delay": `${ff.delay}s`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

/* ── The single continuous bottom horizon strip ───────────────────────── */
function BottomHorizon({ isNight }: { isNight: boolean }) {
  return (
    <div className="absolute bottom-0 inset-x-0 h-48 pointer-events-none z-10" aria-hidden="true">
      {/* (a) GRASS — full width across bottom edge */}
      <GrassStrip />

      {/* (b) LEFT SECTION — all 3 windmills grouped */}
      <div className="absolute left-6 bottom-4 flex items-end gap-1 sm:gap-2">
        <Windmill uid="w1" spinSeconds={6.5} isNight={isNight} scale={0.78} />
        <Windmill uid="w2" spinSeconds={5.2} isNight={isNight} scale={1} />
        <Windmill uid="w3" spinSeconds={7.4} isNight={isNight} scale={0.86} />
      </div>

      {/* (c) CENTER SECTION — squirrel (dusk) or fireflies (night) */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-4">
        {!isNight && <Squirrel />}
      </div>
      {isNight && <FireflyField />}

      {/* (d) RIGHT SECTION — all 3 solar panels grouped */}
      <div className="absolute right-6 bottom-4 flex items-end gap-1.5 sm:gap-2.5">
        <SolarPanel uid="p1" isNight={isNight} scale={0.82} sweepDelay="0s" />
        <SolarPanel uid="p2" isNight={isNight} scale={1} sweepDelay="1.1s" />
        <SolarPanel uid="p3" isNight={isNight} scale={0.88} sweepDelay="0.55s" />
      </div>
    </div>
  );
}

/* ═════════════════════════════════════════════════════════════════════════
   LAYER 20 — UI CONTENT (text, links, contact buttons) — ALWAYS ON TOP
   ═════════════════════════════════════════════════════════════════════════ */

function PhonePill() {
  return (
    <a
      href={`tel:${company.phone}`}
      className="group flex items-center gap-3 px-4 py-3 rounded-button bg-slate-900/70 hover:bg-slate-900/90 border border-slate-700/50 transition-all duration-200 cursor-pointer backdrop-blur-sm"
    >
      <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
      <span className="text-[11px] font-semibold text-slate-200">{company.phone}</span>
    </a>
  );
}

function GmailPill() {
  return (
    <a
      href={`mailto:${company.email}`}
      className="group flex items-center gap-3 px-4 py-3 rounded-button bg-slate-900/70 hover:bg-slate-900/90 border border-slate-700/50 transition-all duration-200 cursor-pointer backdrop-blur-sm"
    >
      <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
      <span className="text-[11px] font-semibold text-slate-200 break-all">{company.email}</span>
    </a>
  );
}

function LocationPill() {
  return (
    <a
      href={`https://maps.google.com/?q=${encodeURIComponent(company.address)}`}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-3 px-4 py-3 rounded-button bg-slate-900/70 hover:bg-slate-900/90 border border-slate-700/50 transition-all duration-200 cursor-pointer backdrop-blur-sm"
    >
      <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
      <span className="text-[11px] font-semibold text-slate-200">{company.address}</span>
    </a>
  );
}

function InstagramPill() {
  const { t } = useLanguage();
  return (
    <a
      href="https://instagram.com/sundeyasolar"
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-3 px-4 py-3 rounded-button bg-slate-900/70 hover:bg-slate-900/90 border border-slate-700/50 transition-all duration-200 cursor-pointer backdrop-blur-sm"
    >
      <Instagram className="w-4 h-4 text-emerald-400 shrink-0" />
      <span className="text-[11px] font-semibold text-slate-200">{t.footer.instagramHandle}</span>
    </a>
  );
}

function ColumnTitle({ children }: { children: React.ReactNode }) {
  return (
    <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
      <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
      {children}
    </h4>
  );
}

/* ═════════════════════════════════════════════════════════════════════════
   MAIN FOOTER
   ═════════════════════════════════════════════════════════════════════════ */

export function Footer({ theme: forcedTheme }: FooterProps) {
  const { theme: contextTheme } = useTheme();
  const { t } = useLanguage();
  const theme = forcedTheme || contextTheme;
  const isNight = theme === "dark";

  return (
    <footer className="relative w-full bg-slate-950 py-12 sm:py-16 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* MAIN CARD — everything clipped inside */}
        <div
          className={[
            "relative rounded-3xl border overflow-hidden shadow-2xl transition-colors duration-500",
            isNight
              ? "bg-slate-950/85 border-slate-800/60 text-slate-100 shadow-slate-950/50"
              : "bg-slate-950/80 border-amber-700/40 text-white shadow-orange-900/40",
          ].join(" ")}
        >
          {/* ── LAYER 0 — Upper sky atmosphere ───────────────────────── */}
          <SkyBackdrop isNight={isNight} />
          {isNight ? <NightMoon /> : <DuskSun />}
          {isNight && <StarLayer />}
          <CloudLayer isNight={isNight} />
          <BirdLayer isNight={isNight} />

          {/* ── LAYER 10 — Bottom horizon strip ──────────────────────── */}
          <BottomHorizon isNight={isNight} />

          {/* ── LAYER 20 — UI content, always on top ─────────────────── */}
          <div className="relative z-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6 p-8 sm:p-10 pb-52">
            {/* Column 1 — About & trust pills */}
            <div className="flex flex-col">
              <h3 className="text-lg sm:text-xl font-bold text-emerald-300 mb-3">{company.name}</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                {t.footer.taglineDesc}
              </p>
              <div className="flex flex-col gap-2">
                {t.footer.trustPills?.map((pill, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-emerald-300">
                    <ShieldCheck className="w-4 h-4 shrink-0" />
                    <span className="font-medium">{pill}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 2 — Tools & calculators */}
            <div>
              <ColumnTitle>{t.footer.calculatorsTitle}</ColumnTitle>
              <ul className="space-y-2">
                {t.footer.calculators.map((calc, i) => (
                  <li key={i}>
                    <Link
                      href={CALCULATOR_HREFS[i]}
                      className="text-xs sm:text-sm text-slate-300 hover:text-emerald-300 transition-colors"
                    >
                      {calc}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3 — PM Surya Ghar scheme */}
            <div>
              <ColumnTitle>{t.footer.schemeTitle}</ColumnTitle>
              <ul className="space-y-2">
                {t.footer.scheme.map((scheme, i) => (
                  <li key={i}>
                    <Link
                      href={SCHEME_HREFS[i]}
                      className="text-xs sm:text-sm text-slate-300 hover:text-emerald-300 transition-colors"
                    >
                      {scheme}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4 — Contact & support */}
            <div>
              <ColumnTitle>{t.footer.contactSupportTitle}</ColumnTitle>
              <div className="flex flex-col gap-2">
                <PhonePill />
                <GmailPill />
                <LocationPill />
                <InstagramPill />
              </div>
              <p className="text-xs text-emerald-400 mt-4 font-semibold">{t.footer.helplineStatus}</p>
            </div>
          </div>
        </div>

        {/* Copyright bar */}
        <div className="relative mt-6 py-2.5 text-center text-[11px] font-semibold bg-slate-950/80 backdrop-blur-md border-t border-emerald-800/40 rounded-b-2xl" style={{ color: "#6EE7B7" }}>
          <p className="mb-1">{t.footer.poweredBy}</p>
          <p>{t.footer.allRightsReserved}</p>
        </div>
      </div>

      {/* ANIMATIONS */}
      <style jsx global>{`
        @keyframes cloudDrift {
          0%, 100% { transform: translateX(-5%); }
          50%      { transform: translateX(5%); }
        }
        .footer-cloud-anim {
          animation-name: cloudDrift;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
        }

        @keyframes flightPath {
          0%   { transform: translateX(-30px); }
          50%  { transform: translateX(240px); }
          100% { transform: translateX(-30px); }
        }
        .footer-bird-anim {
          animation: flightPath 10s linear infinite;
        }

        @keyframes starTwinkle {
          0%, 100% { opacity: 0.25; }
          50%      { opacity: 1; }
        }
        .footer-star-anim {
          animation-name: starTwinkle;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
        }

        @keyframes spinBlades {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }

        @keyframes panelSweep {
          0%   { transform: translateY(96px); opacity: 0; }
          30%  { opacity: 0.9; }
          70%  { opacity: 0.9; }
          100% { transform: translateY(-30px); opacity: 0; }
        }
        .footer-sweep-anim {
          animation: panelSweep 3.6s ease-in-out infinite;
        }

        @keyframes fireflyFloat {
          0%, 100% { transform: translate3d(0, 0, 0) scale(1);        opacity: 0.35; }
          25%      { transform: translate3d(14px, -22px, 0) scale(1.3); opacity: 1; }
          50%      { transform: translate3d(-11px, -38px, 0) scale(0.8); opacity: 0.55; }
          75%      { transform: translate3d(8px, -18px, 0) scale(1.15); opacity: 0.9; }
        }
        .footer-firefly-anim {
          animation-name: fireflyFloat;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
          animation-duration: var(--firefly-duration, 8s);
          animation-delay: var(--firefly-delay, 0s);
        }

        @keyframes squirrelChew {
          0%, 100% { transform: scale(1) rotate(0deg); }
          25%      { transform: scale(1.12) rotate(-6deg); }
          50%      { transform: scale(1) rotate(0deg); }
          75%      { transform: scale(1.12) rotate(6deg); }
        }
        .footer-squirrel-anim {
          animation: squirrelChew 1.5s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          [class*="footer-"] {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </footer>
  );
}
