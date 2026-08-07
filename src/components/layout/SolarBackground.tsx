"use client";

import { useEffect, useRef, useMemo } from "react";
import { useTheme } from "@/lib/theme/ThemeProvider";

/* ─────────────────────────────────────────────────────────────
   Firefly particle seed — deterministic so SSR and client agree
   ───────────────────────────────────────────────────────────── */
interface FireflyConfig {
  top: string;
  left: string;
  size: number;          /* px diameter: 2–6 */
  color: "emerald" | "amber";
  duration: number;      /* animation seconds: 8–20 */
  delay: number;         /* animation-delay seconds: 0–4 */
}

const FIREFLY_COUNT = 22;

const FIREFLIES: FireflyConfig[] = Array.from({ length: FIREFLY_COUNT }, (_, i) => {
  // Deterministic pseudo-random from index — avoids hydration mismatch
  const seed = (i * 137.508 + 1.618) % 1;
  const seed2 = (i * 73.129 + 2.718) % 1;
  const seed3 = (i * 41.421 + 3.141) % 1;
  const seed4 = (i * 23.606 + 0.577) % 1;
  const seed5 = (i * 17.320 + 1.414) % 1;

  return {
    top:      `${(seed  * 85 + 5).toFixed(1)}%`,
    left:     `${(seed2 * 90 + 5).toFixed(1)}%`,
    size:     Math.round(seed3 * 4 + 2),          /* 2–6 px */
    color:    i % 3 === 0 ? "amber" : "emerald",  /* ~1/3 amber, ~2/3 emerald */
    duration: parseFloat((seed4 * 12 + 8).toFixed(1)),  /* 8–20 s */
    delay:    parseFloat((seed5 * 4).toFixed(2)),        /* 0–4 s  */
  };
});

/* Glow colors */
const GLOW = {
  emerald: { color: "#10B981", shadow: "0 0 10px #10B981, 0 0 22px rgba(16,185,129,0.55)" },
  amber:   { color: "#F59E0B", shadow: "0 0 10px #F59E0B, 0 0 22px rgba(245,158,11,0.55)" },
};

/* ─────────────────────────────────────────────────────────────
   SolarBackground
   ─────────────────────────────────────────────────────────────
   Layer stack (bottom → top):
   1. Base gradient (theme-reactive solid canvas)
   2. Dual ambient gradient spheres (opposite corners, pulse)
   3. 20×20 px solar panel wafer grid (SVG, opacity-10/20)
   4. 22 floating firefly particles (CSS-animated, no JS)
   5. Canvas (interactive pointer spotlight + particles)
   ───────────────────────────────────────────────────────────── */
export function SolarBackground() {
  const { theme } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDark = theme === "dark";

  /* Grid stroke colors — memoised so ref doesn't re-read on every render */
  const grid = useMemo(() => ({
    stroke:  isDark ? "rgba(148,163,184,0.50)" : "rgba(71,85,105,0.40)",
    busbar:  isDark ? "rgba(6,182,212,0.45)"   : "rgba(6,182,212,0.55)",
    finger:  isDark ? "rgba(148,163,184,0.22)" : "rgba(71,85,105,0.28)",
  }), [isDark]);

  /* ── Canvas particle animation ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = window.innerWidth;
    let h = window.innerHeight;
    let raf = 0;

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width  = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width  = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    /* Spring-smoothed pointer */
    const target = { x: w / 2, y: h * 0.3 };
    const pos    = { x: target.x, y: target.y };
    const vel    = { x: 0, y: 0 };
    const ripples: { x: number; y: number; r: number; a: number; max: number }[] = [];

    const onPointerMove = (e: PointerEvent) => { target.x = e.clientX; target.y = e.clientY; };
    const onPointerDown = (e: PointerEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      ripples.push({ x: e.clientX, y: e.clientY, r: 0, a: 0.5, max: Math.min(w, h) * 0.22 });
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    window.addEventListener("resize", resize);

    /* Particle systems */
    const GRID = 120;
    type Photon = { x: number; y: number; vy: number; sway: number; sw: number; life: number; color: string };
    type Pulse  = { x: number; y: number; dx: number; dy: number; life: number; color: string };

    const photons: Photon[] = [];
    const pulses:  Pulse[]  = [];
    const photonColors = ["rgba(6,182,212,", "rgba(16,185,129,", "rgba(245,158,11,"];
    const pulseColors  = ["rgba(6,182,212,", "rgba(16,185,129,"];
    let gleam = { y: -200, active: false, timer: 0 };
    let frame = 0;

    const drawStatic = () => {
      ctx.clearRect(0, 0, w, h);
      const aura = ctx.createRadialGradient(w * 0.5, h * 0.28, 0, w * 0.5, h * 0.28, 420);
      if (isDark) {
        aura.addColorStop(0, "rgba(6,182,212,0.10)");
        aura.addColorStop(1, "rgba(10,15,29,0)");
      } else {
        aura.addColorStop(0, "rgba(16,185,129,0.07)");
        aura.addColorStop(1, "rgba(255,255,255,0)");
      }
      ctx.fillStyle = aura;
      ctx.fillRect(0, 0, w, h);
    };

    const tick = () => {
      frame++;

      /* Spring follow */
      vel.x += (target.x - pos.x) * 0.09; vel.x *= 0.82; pos.x += vel.x;
      vel.y += (target.y - pos.y) * 0.09; vel.y *= 0.82; pos.y += vel.y;

      ctx.clearRect(0, 0, w, h);

      if (isDark) {
        /* Cursor spotlight — cyan/sapphire + emerald core */
        const aura = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, 340);
        aura.addColorStop(0, "rgba(6,182,212,0.16)");
        aura.addColorStop(0.35, "rgba(30,58,138,0.10)");
        aura.addColorStop(1, "rgba(10,15,29,0)");
        ctx.fillStyle = aura;
        ctx.beginPath(); ctx.arc(pos.x, pos.y, 340, 0, Math.PI * 2); ctx.fill();

        const core = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, 96);
        core.addColorStop(0, "rgba(16,185,129,0.10)");
        core.addColorStop(1, "rgba(16,185,129,0)");
        ctx.fillStyle = core;
        ctx.beginPath(); ctx.arc(pos.x, pos.y, 96, 0, Math.PI * 2); ctx.fill();

        /* Power pulses along grid lines */
        if (pulses.length < 28 && frame % 22 === 0) {
          const nodeX = (Math.floor(Math.random() * (w / GRID)) + 0.5) * GRID;
          const nodeY = (Math.floor(Math.random() * (h / GRID)) + 0.5) * GRID;
          const dir   = Math.floor(Math.random() * 4);
          const spd   = 0.6 + Math.random() * 0.9;
          pulses.push({
            x: nodeX, y: nodeY,
            dx: dir === 0 ? spd : dir === 1 ? -spd : 0,
            dy: dir === 2 ? spd : dir === 3 ? -spd : 0,
            life: 150,
            color: pulseColors[Math.floor(Math.random() * pulseColors.length)],
          });
        }
        for (let i = pulses.length - 1; i >= 0; i--) {
          const p = pulses[i];
          p.x += p.dx; p.y += p.dy; p.life--;
          if (p.life <= 0) { pulses.splice(i, 1); continue; }
          const alpha = Math.min(p.life / 150, 1) * 0.55;
          ctx.fillStyle = `${p.color}${alpha.toFixed(3)})`;
          ctx.beginPath(); ctx.arc(p.x, p.y, 2.2, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = `${p.color}${(alpha * 0.25).toFixed(3)})`;
          ctx.beginPath(); ctx.arc(p.x, p.y, 6, 0, Math.PI * 2); ctx.fill();
        }
      } else {
        /* Soft white/emerald cursor aura */
        const aura = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, 300);
        aura.addColorStop(0, "rgba(16,185,129,0.10)");
        aura.addColorStop(0.5, "rgba(56,189,248,0.05)");
        aura.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = aura;
        ctx.beginPath(); ctx.arc(pos.x, pos.y, 300, 0, Math.PI * 2); ctx.fill();

        /* Photon ray streams */
        if (photons.length < 70 && frame % 5 === 0) {
          photons.push({
            x: Math.random() * w, y: -12,
            vy: 0.9 + Math.random() * 1.5,
            sway: Math.random() * Math.PI * 2,
            sw: 0.008 + Math.random() * 0.02,
            life: 140 + Math.random() * 140,
            color: photonColors[Math.floor(Math.random() * photonColors.length)],
          });
        }
        for (let i = photons.length - 1; i >= 0; i--) {
          const ph = photons[i];
          ph.y += ph.vy; ph.sway += ph.sw; ph.life--;
          if (ph.life <= 0 || ph.y > h + 16) { photons.splice(i, 1); continue; }
          const alpha = Math.min(ph.life / 140, 1) * 0.5;
          const x = ph.x + Math.sin(ph.sway) * 14;
          const len = 10 + ph.vy * 5;
          const grad = ctx.createLinearGradient(x, ph.y - len, x, ph.y);
          grad.addColorStop(0, `${ph.color}0)`);
          grad.addColorStop(1, `${ph.color}${alpha.toFixed(3)})`);
          ctx.strokeStyle = grad;
          ctx.lineWidth = 1.4;
          ctx.beginPath(); ctx.moveTo(x, ph.y - len); ctx.lineTo(x, ph.y); ctx.stroke();
        }

        /* Occasional glass gleam sweep */
        if (!gleam.active) {
          if (++gleam.timer > 260) { gleam.active = true; gleam.y = -180; gleam.timer = 0; }
        } else {
          gleam.y += 1.6;
          if (gleam.y > h + 200) { gleam.active = false; }
          const band = ctx.createLinearGradient(0, gleam.y - 160, 0, gleam.y + 160);
          band.addColorStop(0, "rgba(255,255,255,0)");
          band.addColorStop(0.5, "rgba(255,255,255,0.07)");
          band.addColorStop(1, "rgba(255,255,255,0)");
          ctx.fillStyle = band;
          ctx.save();
          ctx.transform(1, 0.12, 0, 1, 0, gleam.y - gleam.y * 0.12);
          ctx.fillRect(0, gleam.y - 160, w, 320);
          ctx.restore();
        }
      }

      /* Press ripples (both themes) */
      for (let i = ripples.length - 1; i >= 0; i--) {
        const rp = ripples[i];
        rp.r += 2.4; rp.a *= 0.95;
        if (rp.a <= 0.012 || rp.r > rp.max) { ripples.splice(i, 1); continue; }
        const c1 = isDark ? "6,182,212" : "16,185,129";
        const c2 = isDark ? "16,185,129" : "56,189,248";
        const ring = ctx.createRadialGradient(rp.x, rp.y, 0, rp.x, rp.y, rp.r);
        ring.addColorStop(0, `rgba(${c1},${(rp.a * 0.55).toFixed(3)})`);
        ring.addColorStop(0.55, `rgba(${c2},${(rp.a * 0.3).toFixed(3)})`);
        ring.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = ring;
        ctx.beginPath(); ctx.arc(rp.x, rp.y, rp.r, 0, Math.PI * 2); ctx.fill();
      }

      raf = requestAnimationFrame(tick);
    };

    if (reduced) { drawStatic(); } else { tick(); }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("resize", resize);
    };
  }, [theme, isDark]);

  return (
    <div aria-hidden="true" className="fixed inset-0 z-0 pointer-events-none overflow-hidden">

      {/* ── Layer 1: Base gradient canvas ── */}
      <div
        className="absolute inset-0"
        style={{
          background: isDark
            ? "linear-gradient(180deg, #020617 0%, #0A0F1D 40%, #0F172A 70%, #020617 100%)"
            : "linear-gradient(160deg, #F8FAFC 0%, #F0FDF4 35%, #EFF6FF 65%, #F8FAFC 100%)",
        }}
      />

      {/* ── Layer 2: Dual pulsing ambient gradient spheres (opposite corners) ── */}
      {/* Top-left sphere — emerald/cyan */}
      <div
        className="ambient-sphere absolute -top-32 -left-32 rounded-full"
        style={{
          width: "44rem",
          height: "44rem",
          background: isDark
            ? "radial-gradient(circle, rgba(6,182,212,0.22) 0%, rgba(16,185,129,0.12) 40%, transparent 70%)"
            : "radial-gradient(circle, rgba(16,185,129,0.14) 0%, rgba(245,158,11,0.07) 45%, transparent 70%)",
          filter: "blur(48px)",
          "--pulse-duration": "7s",
          "--pulse-delay": "0s",
        } as React.CSSProperties}
      />
      {/* Bottom-right sphere — amber/gold */}
      <div
        className="ambient-sphere absolute -bottom-40 -right-40 rounded-full"
        style={{
          width: "40rem",
          height: "40rem",
          background: isDark
            ? "radial-gradient(circle, rgba(16,185,129,0.18) 0%, rgba(6,182,212,0.10) 45%, transparent 70%)"
            : "radial-gradient(circle, rgba(6,182,212,0.12) 0%, rgba(56,189,248,0.07) 45%, transparent 70%)",
          filter: "blur(56px)",
          "--pulse-duration": "9s",
          "--pulse-delay": "3s",
        } as React.CSSProperties}
      />
      {/* Mid-right supplemental halo */}
      <div
        className="ambient-sphere absolute top-1/3 -right-48 rounded-full"
        style={{
          width: "36rem",
          height: "36rem",
          background: isDark
            ? "radial-gradient(circle, rgba(245,158,11,0.10) 0%, transparent 65%)"
            : "radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 65%)",
          filter: "blur(52px)",
          "--pulse-duration": "11s",
          "--pulse-delay": "5s",
        } as React.CSSProperties}
      />

      {/* ── Layer 3: 20 × 20 px monocrystalline solar panel wafer grid ── */}
      <svg
        className={`absolute inset-0 w-full h-full ${isDark ? "opacity-20" : "opacity-10"}`}
        aria-hidden="true"
      >
        <defs>
          <pattern id="solar-wafer-grid" width="120" height="120" patternUnits="userSpaceOnUse">
            <rect width="120" height="120" fill="none" />
            {/* Outer cell boundary */}
            <rect
              x="10" y="10" width="100" height="100" rx="10"
              fill="none"
              stroke={grid.stroke}
              strokeWidth="1"
            />
            {/* Busbar lines (vertical) */}
            <path
              d="M 40 10 L 40 110 M 80 10 L 80 110"
              fill="none"
              stroke={grid.busbar}
              strokeWidth="0.8"
            />
            {/* Finger lines (horizontal) */}
            <path
              d="M 10 40 L 110 40 M 10 80 L 110 80"
              fill="none"
              stroke={grid.finger}
              strokeWidth="0.5"
            />
            {/* Inner 20×20 mesh lines */}
            <path
              d="M 30 10 L 30 110 M 50 10 L 50 110 M 60 10 L 60 110 M 70 10 L 70 110 M 90 10 L 90 110 M 100 10 L 100 110"
              fill="none"
              stroke={grid.finger}
              strokeWidth="0.25"
              opacity="0.5"
            />
            <path
              d="M 10 30 L 110 30 M 10 50 L 110 50 M 10 60 L 110 60 M 10 70 L 110 70 M 10 90 L 110 90 M 10 100 L 110 100"
              fill="none"
              stroke={grid.finger}
              strokeWidth="0.25"
              opacity="0.5"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#solar-wafer-grid)" />
      </svg>

      {/* ── Layer 4: High-density firefly particle field (22 particles) ── */}
      {FIREFLIES.map((ff, i) => (
        <span
          key={i}
          className="firefly absolute rounded-full pointer-events-none"
          style={{
            top:       ff.top,
            left:      ff.left,
            width:     `${ff.size}px`,
            height:    `${ff.size}px`,
            background: GLOW[ff.color].color,
            boxShadow:  GLOW[ff.color].shadow,
            "--firefly-duration": `${ff.duration}s`,
            "--firefly-delay":    `${ff.delay}s`,
          } as React.CSSProperties}
        />
      ))}

      {/* ── Layer 5: Interactive canvas (pointer/click particles) ── */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
        style={{ willChange: "transform" }}
      />
    </div>
  );
}
