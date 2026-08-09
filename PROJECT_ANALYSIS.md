# Sundeya Solar Website — Full Project Analysis

**Audited:** 9 August 2026 | **Folder:** `E:\Solar_Website`

---

## 1. What This Is

A premium bilingual (English ⇄ Hindi) Next.js website for **Sundeya Solar**, a rooftop solar installer and **PM Surya Ghar Yojana** partner in Dehradun, Uttarakhand. Primary business goal: generate leads (calls / WhatsApp), educate visitors about solar + subsidy, and convert via an interactive Solar Budget Calculator.

**Live business data (all in `src/lib/data.ts`):**
| Item | Value |
|---|---|
| Company | Sundeya Solar |
| Phone / WhatsApp | 9568486108 |
| Email | info@suryagharyojana.online |
| Address | Ring Road, Behind ICICI Bank, Jogiwala, Dehradun, Uttarakhand - 248014 |
| Hours | Mon–Sun, 9:00 AM – 6:30 PM |
| Website | https://sundeyasolar.com |
| Map | https://maps.app.goo.gl/1VoNjzXnY6JYTaRz8 |
| Instagram (in data.ts) | instagram.com/surya.ghar.yojna |
| Instagram (in Footer) | instagram.com/sundeyasolar ⚠️ mismatch |

---

## 2. Tech Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 16.2.12 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS 3.4 + custom CSS-variable design token engine |
| Animation | Framer Motion 11 + CSS keyframes |
| Icons | Lucide React |
| Fonts | Inter (body) + Plus Jakarta Sans (display), via `next/font` |
| Deployment | Static pre-render (`npm run build` → `npm start`) |

---

## 3. Routes (13 pages, all statically generated)

```
/                       Home — 13 sections (Hero+10-banner carousel, Stats, Learn,
│                       Products, Benefits, Subsidy, EMI, Calculator, Reviews,
│                       About, Gallery, FAQs, Contact)
├── /calculator         Solar Budget Calculator (full page) — ACTIVE calculator
├── /emi-calculator     Standalone EMI Calculator (independent, default 5.75% p.a.)
├── /emi                EMI / Loan information page
├── /subsidy            Government Subsidy guide (6 sections + 9-step timeline + FAQ)
├── /gallery            Gallery — currently placeholder boxes only
├── /learn/[slug]       Learn About Solar detail (5 slugs, all "coming soon" video guides)
├── /reviews/[id]       Customer review detail (10 reviews with photos)
├── /about/[slug]       About company detail (7 slugs: story, mission, vision, values,
│                       team, projects, impact)
├── /privacy            Privacy Policy (bilingual)
├── /terms              Terms of Service (bilingual)
└── 404                 Custom not-found (bilingual)
```

---

## 4. Source Tree Map (where to edit things)

```
src/
├── app/                        # Route shells + SEO metadata
│   ├── layout.tsx              # Root layout, fonts, JSON-LD, theme script, metadata
│   ├── page.tsx                # Home page — section ordering lives here
│   ├── globals.css             # Design tokens (colors/fonts), component classes, keyframes
│   └── .../page.tsx            # Each route: metadata + renders a content component
├── components/
│   ├── layout/                 # Header, Footer (750 lines, animated), LanguageSwitcher,
│   │                           # ThemeToggle, Logo, PageLoader, ScrollReset, SolarBackground
│   ├── sections/               # 14 home-page sections (incl. HeroBannerCarousel.jsx,
│   │                           #   the 10-banner Swiper carousel with section mapping)
│   ├── pages/                  # 8 bilingual page-content components (sub-pages)
│   ├── ui/                     # Button, Card, Accordion, AnimatedCounter, SectionHeader
│   └── calculator/
│       └── SolarCalculatorForm.tsx     ⭐ THE LIVE solar calculator (used everywhere)
├── lib/
│   ├── data.ts                 # Company info, stats, products, reviews (photos/slugs only),
│   │                           # FAQ fallback text, footer link labels, gallery categories
│   ├── i18n/
│   │   ├── translations.ts     # ⭐ ALL user-facing text — parallel `en` + `hi` dicts (~1263 lines)
│   │   └── LanguageProvider.tsx# Language context + localStorage persistence ("sundeya-solar-locale")
│   ├── theme/ThemeProvider.tsx # Light/dark theme (localStorage "theme", defaults dark)
│   ├── design-system.ts        # Design tokens (mostly superseded by globals.css vars)
│   └── animations.ts           # Framer Motion variants
public/images/                  # logo.jpg + 10 review photos + hero/ (10 banner .webp)
```

**Single-source-of-truth rule:** Nearly all content now renders from `translations.ts` (`t.*` via `useLanguage()`); `data.ts` holds only non-translatable values (phone, photos, slugs, IDs). To change copy → edit `translations.ts` (both `en` AND `hi` with same key). To change numbers/links/photos → edit `data.ts`.

---

## 5. Calculator Logic (single implementation, spec-enforced 9 Aug 2026)

### ⭐ Live: `SolarCalculatorForm.tsx` — THE one calculator (all pages)
- Monthly units = `round(bill / ₹7)`; capacity auto-recommended from units tier table (≤450 → 3 kW, 451–600 → 4 kW, …, 1351–1500 → 10 kW, >1500 → +1 kW per 150 units via `3 + ceil((units − 450) / 150)`); manual override allowed, "(Recommended)" badge
- Pricing: ₹70,000/kW for 3 kW and 5 kW (₹2,10,000 / ₹3,50,000), ₹60,000/kW for every other size
- Subsidy: fixed **₹85,800** (`GOV_SUBSIDY = 85800`), Residential only
- Monthly savings = **100% of the bill — no ₹300 deduction**; annual = ×12; lifetime = ×25
- ROI = `(lifetime − finalCost) / finalCost × 100`; animated stat cards; 5/10/15/20/25-yr savings bar chart (25 highlighted); downloadable HTML report; validation (bill ≥ ₹500); "Call Now" → tel:9568486108
- **>10 kW systems**: floating read-only amber tab next to the 10 kW option + dedicated "Commercial / High-Capacity System" card (Total Cost, Net Cost, ROI, Payback, Lifetime Savings all recalculated; lock icon; audit CTA → tel:). Fully bilingual (EN/HI).
- Property types: Residential / Commercial / Industrial (subsidy ₹0 / hidden for non-residential)

### 🗑️ Deleted: `SolarBudgetCalculator.jsx` (dead code)
- Never imported by any file; removed 9 Aug 2026 (Recycle Bin) to eliminate the duplicate-formula confusion. Its contract (₹7/unit, ₹85,800, 3/5 kW premium pricing, >10 kW card) is now enforced inside the live `SolarCalculatorForm.tsx`.

---

## 6. ⚠️ Confirmed Inconsistencies & Issues (change candidates)

| # | Issue | Files | Suggested fix |
|---|-------|-------|---------------|
| 1 | **Subsidy figure in content pages: ₹85,800 vs calculator (now ₹85,800)** — ✅ fixed in the calculator 9 Aug 2026; content (`data.ts` faqs, `translations.ts` subsidy page, FAQ) already said ₹85,800, so the site is now consistent. **Verify the ₹85,800 number is factually current** (PM Surya Ghar 2024 scheme actually pays ₹30k/₹45k/₹58k for 2/3/4+ kW; ₹85,800 appears to be a higher legacy figure — needs web verification before launch) | `SolarCalculatorForm.tsx` (GOV_SUBSIDY=85800), `data.ts`, `translations.ts` | Web-verify the subsidy amount; if wrong, change `GOV_SUBSIDY` + `data.ts` subsidyInfo + FAQ + subsidy-page text together |
| 2 | **Instagram link mismatch** — `data.ts` social.instagram = `/surya.ghar.yojna` but Footer hardcodes `https://instagram.com/sundeyasolar` and translations show "@sundeyasolar" | `data.ts`, `Footer.tsx:45`, `translations.ts` | Decide the real handle; make Footer read from `company.social.instagram` |
| 3 | ~~Unused component~~ — ✅ resolved 9 Aug 2026: `SolarBudgetCalculator.jsx` deleted (Recycle Bin); the live `SolarCalculatorForm.tsx` now enforces the full contract (₹85,800, 100% savings, ₹7/unit tiers, 3/5 kW pricing, >10 kW card). One calculator remains | — | — |
| 4 | **Doc drift vs code** — FINAL_REPORT claims a "Select Savings Duration (5/10/15/20/25)" selector and a "state required" validation were added; the current form has **neither** (duration hardcoded to 25, no state field). Docs also reference a deleted FloatingCalculatorButton and 11 about slugs (code has 7). | `FINAL_REPORT.md`, `DESIGN_SPEC.md` vs `SolarCalculatorForm.tsx`, `data.ts` | Either add the duration selector / state field, or correct the docs |
| 5 | **Placeholder / unfinished content** — Gallery shows only dashed placeholder boxes ("Project Photo") on both home & /gallery; all 5 Learn cards are "Video Guide — coming soon" placeholders with no videos; FAQ/labels contain no `[DATA REQUIRED]` markers but "verify before publishing" notes are still visible on the live page (subsidy ₹85,800, EMI 5.75%) | `gallery/page.tsx`, `GallerySection.tsx`, `LearnPageContent.tsx`, `data.ts` | Add real gallery images/videos; wire video embeds; remove verify-notes after fact-checking |
| 6 | **SEO metadata is English-only** in Hindi mode (documented in FINAL_REPORT §8) and `<html lang="en">` is static | `app/layout.tsx`, route `page.tsx` metadata | Optional: localized metadata / hreflang |
| 7 | **Stats quirks** — "team" value `20-25` + suffix `+ Years` renders "20-25+ Years"; "experience: 5+" and "pmSuryaGhar: 1500-2000 kW" are non-animated strings; `stats.unitsGenerated` translation key exists but no stat uses it | `data.ts`, `translations.ts` | Clean up values/labels |
| 8 | **`npm run lint` is broken** — `next lint` was removed in Next.js 16, no ESLint config in project; `package.json` still declares the script | `package.json` | Remove script or add ESLint config |
| 9 | **Dev-server log shows an error** — `ns16e.log` ends with `Error: spawn EPERM` from `next dev` (a previous failed run on this machine) | `ns16.log`, `ns16e.log` (root) | Investigate if `npm run dev` fails again; likely a Windows spawn/permission issue |
| 10 | **`node-jiti/` + `tsconfig.tsbuildinfo` + logs at repo root** — leftover artifacts not covered by any .gitignore (no .gitignore exists) | root | Add `.gitignore` (node_modules, .next, *.log, *.tsbuildinfo, node-jiti) |
| 11 | **Learn/about/review pages** — Learn pages have a big placeholder video block; reviews `[id]` metadata is a generic string; About metadata falls back to English title | `LearnPageContent.tsx`, `reviews/[id]/page.tsx`, `about/[slug]/page.tsx` | Content + metadata polish |
| 12 | **`ContactSection` WhatsApp/phone hardcoded** — `wa.me/919568486108` and `tel:9568486108` literals in components (values match `data.ts`, but duplication is fragile) | `ContactSection.tsx`, `SolarCalculatorForm.tsx`, `SolarCalculatorSection.tsx` | Reference `company.phone`/`company.whatsapp` |

---

## 7. What's Solid (verified)

- ✅ Production build green, 32/32 static routes (per FINAL_REPORT) — route smoke test passed
- ✅ EN⇄HI structural parity verified programmatically (identical keys, no empty Hindi values)
- ✅ EMI formula verified (₹2,00,000 @ 5.75% × 5y → ₹3,843/mo)
- ✅ Full bilingual coverage of all sections/pages/forms/validation messages
- ✅ WCAG-AAA token system, focus rings, reduced-motion support, aria labels
- ✅ Theme-aware animated Footer (dusk sun / night moon, windmills, fireflies, squirrel)
- ✅ No console.log/error/warn in src; no dangling imports; single calculator entry point (header)

---

## 8. Typical Change Commands You Can Give Me

- **Copy/text:** "Change the hero headline to X" / "Update FAQ #3" → edit `translations.ts` (en+hi)
- **Numbers:** "Subsidy should be ₹X" / "3 kW cost = ₹Y" / "stats 5 years → 8 years" → edit `data.ts` + calculator constants
- **Layout/order:** "Move Reviews section before Calculator" → edit `src/app/page.tsx`
- **Design:** "Change primary green to #0E9F6E", "make hero taller" → `globals.css` tokens / section components
- **Contact info:** "New phone 9876543210" → `data.ts` (single place)
- **Content pages:** "Add a new FAQ to subsidy page" → `translations.ts` `pages.subsidy.sections`
- **New feature:** "Add a state selector to the calculator", "Add savings-duration pills", "Add Google Analytics", "Wire contact form to a backend" — new code in `SolarCalculatorForm.tsx` / `ContactSection.tsx`
- **Housekeeping:** "Delete SolarBudgetCalculator.jsx", "Add .gitignore", "Remove lint script"
