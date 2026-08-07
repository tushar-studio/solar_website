"use client";

import { useEffect, useRef } from "react";

/**
 * SolarBackground — fixed full-viewport background layer for the dark solar theme.
 *
 * Layers (bottom → top):
 *   1. Deep photovoltaic navy gradient (#0A0F1D → #0F172A)
 *   2. Fixed ambient radial light spots (sapphire / cyan / emerald)
 *   3. Ultra-faint procedural monocrystalline solar cell grid (SVG pattern)
 *   4. Interactive HTML5 canvas: spring-smoothed "solar energy spotlight"
 *      tracking the cursor / touch, with an outward ripple pulse on press.
 *
 * The entire layer is `pointer-events: none` and sits at z-0, so it never
 * blocks clicks on buttons, forms, or links. Animation runs on
 * requestAnimationFrame and respects `prefers-reduced-motion`.
 */
export function SolarBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let raf = 0;
    let w = window.innerWidth;
    let h = window.innerHeight;

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    // Pointer state with critically-damped spring smoothing
    const target = { x: w / 2, y: h * 0.3 };
    const pos = { x: target.x, y: target.y };
    const vel = { x: 0, y: 0 };
    const ripples: { x: number; y: number; r: number; a: number; max: number }[] = [];

    const onPointerMove = (e: PointerEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
    };
    const onPointerDown = (e: PointerEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      ripples.push({
        x: e.clientX,
        y: e.clientY,
        r: 0,
        a: 0.5,
        max: Math.min(w, h) * 0.22,
      });
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    window.addEventListener("resize", resize);

    const drawStatic = () => {
      ctx.clearRect(0, 0, w, h);
      const aura = ctx.createRadialGradient(w * 0.5, h * 0.28, 0, w * 0.5, h * 0.28, 420);
      aura.addColorStop(0, "rgba(6,182,212,0.10)");
      aura.addColorStop(1, "rgba(10,15,29,0)");
      ctx.fillStyle = aura;
      ctx.fillRect(0, 0, w, h);
    };

    const tick = () => {
      // Spring physics (stiffness/damping tuned for 60/120fps)
      const dx = target.x - pos.x;
      const dy = target.y - pos.y;
      vel.x += dx * 0.09;
      vel.y += dy * 0.09;
      vel.x *= 0.82;
      vel.y *= 0.82;
      pos.x += vel.x;
      pos.y += vel.y;

      ctx.clearRect(0, 0, w, h);

      // Outer cyan/sapphire spotlight
      const aura = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, 340);
      aura.addColorStop(0, "rgba(6,182,212,0.16)");
      aura.addColorStop(0.35, "rgba(30,58,138,0.10)");
      aura.addColorStop(1, "rgba(10,15,29,0)");
      ctx.fillStyle = aura;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 340, 0, Math.PI * 2);
      ctx.fill();

      // Inner emerald energy core
      const core = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, 96);
      core.addColorStop(0, "rgba(16,185,129,0.10)");
      core.addColorStop(1, "rgba(16,185,129,0)");
      ctx.fillStyle = core;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 96, 0, Math.PI * 2);
      ctx.fill();

      // Ripple pulses radiating outward from press coordinates
      for (let i = ripples.length - 1; i >= 0; i--) {
        const rp = ripples[i];
        rp.r += 2.4;
        rp.a *= 0.95;
        if (rp.a <= 0.012 || rp.r > rp.max) {
          ripples.splice(i, 1);
          continue;
        }
        const ring = ctx.createRadialGradient(rp.x, rp.y, 0, rp.x, rp.y, rp.r);
        ring.addColorStop(0, `rgba(6,182,212,${(rp.a * 0.55).toFixed(3)})`);
        ring.addColorStop(0.55, `rgba(16,185,129,${(rp.a * 0.3).toFixed(3)})`);
        ring.addColorStop(1, "rgba(10,15,29,0)");
        ctx.fillStyle = ring;
        ctx.beginPath();
        ctx.arc(rp.x, rp.y, rp.r, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(tick);
    };

    if (reduced) {
      drawStatic();
    } else {
      tick();
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden"
    >
      {/* 1. Deep photovoltaic navy canvas */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, #0A0F1D 0%, #0F172A 55%, #0A0F1D 100%)",
        }}
      />

      {/* 2. Fixed ambient light spots */}
      <div
        className="absolute -top-40 -left-40 w-[42rem] h-[42rem] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(30,58,138,0.32), transparent 60%)",
          filter: "blur(40px)",
        }}
      />
      <div
        className="absolute top-1/3 -right-52 w-[36rem] h-[36rem] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(6,182,212,0.2), transparent 60%)",
          filter: "blur(48px)",
        }}
      />
      <div
        className="absolute -bottom-48 left-1/4 w-[40rem] h-[40rem] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(16,185,129,0.14), transparent 60%)",
          filter: "blur(56px)",
        }}
      />

      {/* 3. Ultra-faint monocrystalline solar cell grid */}
      <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.08 }}>
        <defs>
          <pattern id="solar-wafer-grid" width="120" height="120" patternUnits="userSpaceOnUse">
            <rect width="120" height="120" fill="none" />
            <rect
              x="10"
              y="10"
              width="100"
              height="100"
              rx="12"
              fill="none"
              stroke="rgba(148,163,184,0.5)"
              strokeWidth="1"
            />
            <path
              d="M 40 10 L 40 110 M 80 10 L 80 110"
              fill="none"
              stroke="rgba(6,182,212,0.4)"
              strokeWidth="0.75"
            />
            <path
              d="M 10 40 L 110 40 M 10 80 L 110 80"
              fill="none"
              stroke="rgba(148,163,184,0.25)"
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#solar-wafer-grid)" />
      </svg>

      {/* 4. Interactive spotlight canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
        style={{ willChange: "transform" }}
      />
    </div>
  );
}
