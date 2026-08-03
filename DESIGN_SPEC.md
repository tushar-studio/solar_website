# Solar Web — Design Specification & Developer Guide

## 1. Page Hierarchy

```
/                           Home (all sections)
├── /calculator             Solar Budget Calculator (full page)
├── /learn/[slug]           Learn About Solar detail (×5)
│   ├── how-solar-works
│   ├── how-we-help-you
│   ├── our-impact
│   ├── installation-process
│   └── maintenance-guide
├── /subsidy                Government Subsidy guide
├── /emi                      EMI / Loan information
├── /reviews/[id]           Customer review detail
├── /about/[slug]           About company detail (×11)
├── /gallery                Full gallery with filters & lightbox
├── /privacy                Privacy Policy
└── /terms                  Terms of Service
```

## 2. Component Structure

### Layout
| Component | Path | Purpose |
|-----------|------|---------|
| Header | `layout/Header.tsx` | Sticky navbar, hamburger menu, calculator CTA |
| Footer | `layout/Footer.tsx` | Links, contact, copyright |
| PageLoader | `layout/PageLoader.tsx` | Modern loading animation |
| FloatingCalculatorButton | `layout/FloatingCalculatorButton.tsx` | Sticky floating CTA |

### Home Sections
| # | Section | Component |
|---|---------|-----------|
| Hero | Large hero with CTA | `sections/HeroSection.tsx` |
| Stats | Experience, projects, customers | `sections/StatsSection.tsx` |
| 1 | Learn About Solar | `sections/LearnAboutSolarSection.tsx` |
| 2 | Government Subsidy | `sections/GovernmentSubsidySection.tsx` |
| 3 | EMI / Loan | `sections/EMILoanSection.tsx` |
| 4 | Solar Calculator | `sections/SolarCalculatorSection.tsx` |
| 5 | Customer Reviews | `sections/CustomerReviewsSection.tsx` |
| 6 | About Company | `sections/AboutCompanySection.tsx` |
| 7 | Gallery | `sections/GallerySection.tsx` |
| 8 | FAQs | `sections/FAQsSection.tsx` |
| 9 | Contact | `sections/ContactSection.tsx` |

### UI Primitives
| Component | Variants / Features |
|-----------|---------------------|
| Button | primary, secondary, ghost, accent + ripple |
| Card | glass morphism, interactive hover lift |
| Accordion | animated expand/collapse |
| AnimatedCounter | smooth counter on scroll |
| SectionHeader | fade-up reveal |

## 3. Design System

### Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| Primary | `[DATA REQUIRED]` → `#059669` | CTAs, accents, gradients |
| Secondary | `[DATA REQUIRED]` → `#1E3A5F` | Headings, footer |
| Accent | `[DATA REQUIRED]` → `#F59E0B` | Highlights, sun elements |
| White | `#FAFBFC` | Page background |
| Green Light | `#10B981` | Hover states |
| Blue Dark | `#0F172A` | Body text, dark sections |

### Typography Scale

| Token | Size | Usage |
|-------|------|-------|
| xs | 12px | Labels, badges |
| sm | 14px | Secondary text |
| base | 16px | Body |
| lg | 18px | Subheadings |
| xl–2xl | 20–24px | Card titles |
| 3xl–5xl | 30–48px | Section headings |
| 6xl–7xl | 60–72px | Hero headline |

**Fonts:** Inter (body), Plus Jakarta Sans (display) — replace with `[DATA REQUIRED]` brand fonts.

### Spacing System

| Token | Value | Usage |
|-------|-------|-------|
| xs–xl | 4–32px | Component internal spacing |
| section | 96px (6rem) | Section vertical padding (desktop) |
| section-sm | 64px (4rem) | Section padding (mobile) |
| container | max-w-7xl + px-4/6/8 | Content width |

### Border Radius

| Token | Value |
|-------|-------|
| card | 1.25rem |
| button | 0.875rem |
| pill | 9999px |

### Shadows

| Token | Usage |
|-------|-------|
| soft | Subtle elevation |
| card | Interactive cards |
| glow | Primary CTAs |
| glass | Glassmorphism panels |

## 4. Button Styles

```css
.btn-primary    → Gradient green, white text, glow shadow, ripple
.btn-secondary  → White/glass, border, dark text
.btn-ghost      → Transparent, hover green tint
.btn-accent     → Amber/gold accent variant
```

All buttons: `hover:scale-[1.02]`, `active:scale-[0.98]`, Framer Motion tap feedback.

## 5. Card Styles

```css
.glass-card         → bg-white/70, backdrop-blur-xl, border, rounded-card
.card-interactive   → glass-card + hover lift + shadow increase
```

## 6. Animation Guide

| Animation | Trigger | Component |
|-----------|---------|-----------|
| Fade Up | Scroll into view | Section headers, cards |
| Fade Left/Right | Scroll into view | Contact columns |
| Scale In | Scroll into view | Modals |
| Stagger Children | Container enter | Card grids |
| Hover Lift | Mouse hover | Interactive cards |
| Ripple | Button click | All CTAs |
| Counter | Intersection 50% | Stats section |
| Accordion | Click | FAQ items |
| Page Loader | Initial 1.8s | Full-screen loader |
| Parallax | Background blobs | Hero section |

Framer Motion variants defined in `src/lib/animations.ts`.

## 7. Responsive Layout

| Breakpoint | Layout Changes |
|------------|----------------|
| Mobile (<640px) | Single column, hamburger menu, 2-col stats |
| Tablet (768px) | 2-column grids, expanded nav spacing |
| Desktop (1024px+) | Full nav bar, 3-4 column grids |
| XL (1280px+) | Hero illustration visible, max content width |

**Mobile First:** All styles default to mobile, enhanced with `sm:`, `md:`, `lg:`, `xl:` prefixes.

## 8. Navigation Flow

```
Header Nav:
  Learn → /#learn
  Subsidy → /subsidy
  EMI/Loan → /emi
  Reviews → /#reviews
  About → /about/story
  Gallery → /gallery
  Contact → /#contact
  Calculator CTA → /calculator

Floating Button → /calculator (persistent on all pages)

Footer → Quick links, products, services, resources, legal
```

## 9. User Journey

```
1. Land on Home → Hero CTA or scroll explore
2. Learn About Solar → Watch video cards → Detail pages
3. Government Subsidy → Read guide → Apply Now → Contact
4. EMI/Loan → Compare options → Calculator
5. Calculator → Input bill/state/roof → See ROI → Call/Download
6. Reviews → Read testimonials → Build trust
7. About → Company story → Credentials
8. Gallery → Visual proof → Lightbox
9. FAQs → Resolve objections
10. Contact → Inquiry form / WhatsApp / Call
```

**Primary conversion paths:**
- Hero CTA → Calculator → Call Now
- Floating Calculator Button → Calculator → Contact
- Subsidy Apply Now → Contact form
- Any section → Sticky header Calculator button

## 10. SEO & Accessibility

- Semantic HTML (`header`, `main`, `footer`, `section`, `nav`)
- Meta tags + Open Graph in `layout.tsx`
- JSON-LD LocalBusiness schema
- `aria-label` on icon buttons
- `aria-expanded` on accordion
- Focus rings on form inputs
- Lazy loading ready (Next.js Image when photos provided)
- `[DATA REQUIRED]` alt text for images

## 11. Developer Notes

### Content Updates
1. Edit `src/lib/data.ts` — single source for all content
2. Update CSS variables in `globals.css` for brand colors
3. Replace `[DATA REQUIRED]` in `layout.tsx` metadata and JSON-LD
4. Add real images to `/public/images/` and update data references

### Calculator Logic
Located in `src/components/calculator/SolarCalculatorForm.tsx`. Current formulas are **indicative estimates** — replace with company-specific pricing and subsidy rules.

### Video Integration
Learn pages have `videoUrl` placeholders. Integrate YouTube/Vimeo embed when URLs are provided.

### Form Handling
Contact and inquiry forms currently prevent default submit. Wire to API route or third-party service (e.g., Formspree, custom backend).

### Google Maps
Replace placeholder in Contact section with embed iframe using company coordinates.

### Performance
- Fonts loaded via `next/font` with `display: swap`
- Static generation for learn, about, review pages
- Tailwind purges unused CSS
- Consider `next/image` when real photos are added

### Missing Client Data Checklist

- [ ] Company name, logo, tagline
- [ ] Primary goal & target audience
- [ ] Brand colors (primary, secondary, accent)
- [ ] Typography preferences
- [ ] Hero headline & subheadline
- [ ] Statistics (experience, projects, customers, units)
- [ ] Video URLs & thumbnails (5 learn cards)
- [ ] Subsidy program details
- [ ] Loan/EMI rates and bank partners
- [ ] Customer reviews with photos
- [ ] About content (11 sections)
- [ ] Gallery images/videos
- [ ] FAQ questions & answers
- [ ] Contact details & map embed
- [ ] Social media links
- [ ] Privacy policy & terms text
- [ ] Product/service page URLs

---

*Design inspired by Apple, Tesla, Stripe, Linear, and Vercel — premium startup aesthetic with solar industry theming.*
