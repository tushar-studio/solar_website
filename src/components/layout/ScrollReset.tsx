"use client";

import { useEffect } from "react";

/**
 * Resets the scroll position to (0, 0) on every full page load so the site
 * always opens at the top (Hero section), overriding the browser's
 * scroll-position restoration — which would otherwise land the visitor
 * mid-page (e.g., at the Solar Calculator) after a reload.
 */
export function ScrollReset() {
  useEffect(() => {
    // Temporarily disable smooth scrolling so the reset is instant.
    const html = document.documentElement;
    const prevBehavior = html.style.scrollBehavior;
    html.style.scrollBehavior = "auto";

    window.scrollTo(0, 0);
    html.scrollTop = 0;
    if (document.body) document.body.scrollTop = 0;

    requestAnimationFrame(() => {
      html.style.scrollBehavior = prevBehavior;
    });
  }, []);

  return null;
}
