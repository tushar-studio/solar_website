# Sundeya Solar — Bilingual Solar Company Website

A premium, conversion-focused website for a solar energy company and **PM Surya Ghar Yojana** partner, built with the Next.js App Router. The site ships with **complete English ⇄ Hindi (हिन्दी) localization** — every section, form, validation message, and page translates instantly with zero English text left in Hindi mode.

## Features

- **Full EN ⇄ HI language switch** — navigation, hero, cards, reviews, FAQ, subsidy guide, EMI section, calculators, contact form, footer, and all sub-pages render in the active language (persisted across visits).
- **Solar Budget Calculator** — auto-recommends system capacity (3–10 kW) from your monthly bill with a "(Recommended)" badge (manual override always allowed), plus estimates for installation cost, government subsidy (₹78,000 cap for residential), ROI, payback period, and monthly/annual savings (net of a ₹300 fixed charge).
- **Savings breakdown** — 25-year lifetime savings with an "Estimated Savings After" chart visualizing cumulative savings at the 5 / 10 / 15 / 20 / 25-year milestones, all updating live with the inputs.
- **Standalone EMI Calculator** — loan amount, interest rate (default 5.75% p.a. under PM Surya Ghar Yojana), and tenure produce monthly EMI, total interest, and total payable using the standard EMI formula. Fully independent of the solar calculator.
- **Government Subsidy guide** — overview, eligibility, documents, step-by-step process, and FAQ.
- **EMI / Loan section** — financing information with a clearly highlighted EMI Calculator tab.
- **Customer reviews, gallery, and FAQ** — bilingual review cards, project gallery categories, and an animated FAQ accordion.
- **Contact section** — bilingual form with validation and success feedback, WhatsApp deep-link integration, phone/email/address cards.
- **Polish** — scroll-reveal animations (Framer Motion), animated statistics counters, ripple effects, custom 404 page, page loader, and fully responsive layouts (mobile / tablet / desktop).

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — use the **EN / हि** button in the header to switch languages.

## Scripts

| Command           | Description                     |
| ----------------- | ------------------------------- |
| `npm run dev`     | Start the development server    |
| `npm run build`   | Production build (type-checked) |
| `npm start`       | Serve the production build      |

## Tech Stack

| Layer       | Technology                            |
| ----------- | ------------------------------------- |
| Framework   | Next.js 16 (App Router)               |
| Language    | TypeScript                            |
| Styling     | Tailwind CSS                          |
| Animation   | Framer Motion                         |
| Icons       | Lucide React                          |
| Fonts       | Inter + Plus Jakarta Sans             |

## Project Structure

```
src/
├── app/                        # App Router pages
│   ├── page.tsx                # Home page (all 13 sections)
│   ├── calculator/             # Solar Budget Calculator
│   ├── emi-calculator/         # Standalone EMI Calculator
│   ├── emi/                    # EMI / Loan information
│   ├── subsidy/                # Government Subsidy guide
│   ├── learn/[slug]/           # Learn About Solar detail pages
│   ├── reviews/[id]/           # Customer review detail pages
│   ├── about/[slug]/           # About company detail pages
│   ├── gallery/                # Gallery (category grids)
│   ├── privacy/                # Privacy Policy
│   ├── terms/                  # Terms of Service
│   └── not-found.tsx           # Custom 404 (bilingual)
├── components/
│   ├── layout/                 # Header, Footer, LanguageSwitcher, Loader
│   ├── sections/               # Home page sections
│   ├── pages/                  # Bilingual page content components
│   ├── ui/                     # Reusable UI primitives
│   └── calculator/             # Solar calculator form & logic
└── lib/
    ├── i18n/                   # LanguageProvider + translations (EN/HI)
    ├── design-system.ts        # Design tokens
    ├── animations.ts           # Framer Motion variants
    └── data.ts                 # Static data (slugs, images, numbers)
```

## Localization

All user-facing text lives in `src/lib/i18n/translations.ts` as parallel `en` and `hi` dictionaries. Components consume it through the `useLanguage()` hook:

```tsx
const { t, locale, setLocale } = useLanguage();
```

- `t` exposes the active locale's dictionary (type-safe).
- `setLocale("hi" | "en")` switches instantly and persists the choice in `localStorage`.
- To add a string, add it to **both** the `en` and `hi` objects with the same key.

## Calculator Logic

- **Solar:** monthly units = `round(bill / ₹7)`, capacity auto-recommended from units (≤450 → 3 kW, 451–600 → 4 kW, …, 1351–1500 → 10 kW, >1500 → +1 kW per 150 units, via `3 + ceil((units − 450) / 150)`), installation cost at ₹70,000/kW for 3 kW and 5 kW, ₹60,000/kW for all other sizes (3 kW = ₹2,10,000, 5 kW = ₹3,50,000), subsidy fixed at ₹85,800 for residential (₹0 for commercial & industrial), monthly savings = 100% of the bill (no deductions), annual = monthly × 12, 25-year lifetime savings, ROI and payback derived from the final cost. Systems >10 kW render a read-only "Commercial / High-Capacity System" card with fully recalculated values.
- **EMI:** standard formula `EMI = P × r × (1 + r)ⁿ / ((1 + r)ⁿ − 1)` with `r = annual rate / 12 / 100` and `n = tenure × 12` months.

## Documentation

- [DESIGN_SPEC.md](./DESIGN_SPEC.md) — design system, page hierarchy, user journey, and developer notes.
- [FINAL_REPORT.md](./FINAL_REPORT.md) — polishing-phase audit: translation coverage, calculator improvements, UI changes, and verification results.

## Build

```bash
npm run build
npm start
```

The production build type-checks the entire project and statically pre-renders all routes.
