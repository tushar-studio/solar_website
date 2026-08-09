"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import Image from "next/image";
import "swiper/css";
import "swiper/css/pagination";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

/* ═════════════════════════════════════════════════════════════════════════
   Sundeya Solar — Hero Banner Carousel (10 banners)
   ─────────────────────────────────────────────────────────────────────────
   - Auto-plays every 3.5s, pauses on hover, loops infinitely.
   - Touch drag / swipe + smooth slide transition (Swiper).
   - Each banner is a full-slide click target that smooth-scrolls to its
     mapped home-page section (hash anchor; CSS `scroll-behavior: smooth`
     + `scroll-mt` on target sections handles the fixed header offset).
   - Slide order, images and targets are contractual — see BANNERS below.
   ═════════════════════════════════════════════════════════════════════════ */

const BANNERS = [
  { src: "/images/hero/banner-01.webp", href: "#products", objectPosition: "left" },
  { src: "/images/hero/banner-02.webp", href: "#about", objectPosition: "left" },
  { src: "/images/hero/banner-03.webp", href: "#solar-calculator", objectPosition: "left" },
  { src: "/images/hero/banner-04.webp", href: "#products", objectPosition: "left" },
  { src: "/images/hero/banner-05.webp", href: "#contact", objectPosition: "left" },
  { src: "/images/hero/banner-06.webp", href: "#products", objectPosition: "center" },
  { src: "/images/hero/banner-07.webp", href: "#contact", objectPosition: "left" },
  { src: "/images/hero/banner-08.webp", href: "#contact", objectPosition: "left" },
  { src: "/images/hero/banner-09.webp", href: "#about", objectPosition: "left" },
  { src: "/images/hero/banner-10.webp", href: "#subsidy", objectPosition: "left" },
] ;

export function HeroBannerCarousel() {
  const { t } = useLanguage();
  const titles = t.hero.banners;

  return (
    <div className="hero-banner-swiper relative">
      <Swiper
        modules={[Autoplay, Pagination]}
        loop
        speed={700}
        grabCursor
        autoplay={{
          delay: 3500,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        pagination={{ clickable: true }}
        className="!pb-10"
      >
        {BANNERS.map((banner, i) => (
          <SwiperSlide key={banner.src}>
            <a
              href={banner.href}
              aria-label={titles[i]}
              title={titles[i]}
              className="group relative block aspect-[16/9] md:aspect-[2/1] overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-card"
            >
              <Image
                src={banner.src}
                alt={titles[i]}
                fill
                priority={i === 0}
                sizes="(max-width: 1024px) 100vw, 1200px"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                style={{ objectPosition: banner.objectPosition }}
              />
              {/* Inner ring for depth on the image */}
              <span
                className="pointer-events-none absolute inset-0 rounded-2xl sm:rounded-3xl ring-1 ring-inset ring-white/10"
                aria-hidden="true"
              />
            </a>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Pagination dots — theme-aware, emerald gradient active pill */}
      <style jsx global>{`
        .hero-banner-swiper .swiper-pagination {
          bottom: 0 !important;
        }
        .hero-banner-swiper .swiper-pagination-bullet {
          width: 8px;
          height: 8px;
          border-radius: 9999px;
          background: rgba(15, 23, 42, 0.25);
          opacity: 1;
          transition: all 0.3s ease;
        }
        .dark .hero-banner-swiper .swiper-pagination-bullet {
          background: rgba(248, 250, 252, 0.35);
        }
        .hero-banner-swiper .swiper-pagination-bullet-active {
          width: 26px;
          background: linear-gradient(135deg, #2e7d32 0%, #388e3c 45%, #0288d1 100%);
        }
      `}</style>
    </div>
  );
}
