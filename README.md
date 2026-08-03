# Sundeya Solar — Bilingual Solar Company Website

A premium, conversion-focused website for a solar energy company and **PM Surya Ghar Yojana** partner, built with the Next.js App Router. The site ships with **complete English ⇄ Hindi (हिन्दी) localization** — every section, form, validation message, and page translates instantly with zero English text left in Hindi mode.

## Features

- **Full EN ⇄ HI language switch** — navigation, hero, cards, reviews, FAQ, subsidy guide, EMI section, calculators, contact form, footer, and all sub-pages render in the active language (persisted across visits).
- **Solar Budget Calculator** — estimates recommended system size, installation cost, government subsidy (up to ₹85,800), final cost, ROI, payback period, and monthly/annual savings.
- **Savings duration analysis** — choose 5 / 10 / 15 / 20 / 25 years (default 25, matching the typical solar panel lifespan); lifetime savings update live and an "Estimated Savings After" timeline chart visualizes cumulative savings at each milestone.
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

- **Solar:** system size from monthly bill, per-property-type cost per kW, flat subsidy estimate (₹85,800), 85% bill savings, duration-scaled lifetime savings, ROI and payback derived from the final cost.
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
