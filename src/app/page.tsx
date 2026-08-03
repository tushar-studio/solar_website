import { HeroSection } from "@/components/sections/HeroSection";
import { StatsSection } from "@/components/sections/StatsSection";
import { LearnAboutSolarSection } from "@/components/sections/LearnAboutSolarSection";
import { ProductsSection } from "@/components/sections/ProductsSection";
import { CustomerBenefitsSection } from "@/components/sections/CustomerBenefitsSection";
import { GovernmentSubsidySection } from "@/components/sections/GovernmentSubsidySection";
import { EMILoanSection } from "@/components/sections/EMILoanSection";
import { SolarCalculatorSection } from "@/components/sections/SolarCalculatorSection";
import { CustomerReviewsSection } from "@/components/sections/CustomerReviewsSection";
import { AboutCompanySection } from "@/components/sections/AboutCompanySection";
import { GallerySection } from "@/components/sections/GallerySection";
import { FAQsSection } from "@/components/sections/FAQsSection";
import { ContactSection } from "@/components/sections/ContactSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <LearnAboutSolarSection />
      <ProductsSection />
      <CustomerBenefitsSection />
      <GovernmentSubsidySection />
      <EMILoanSection />
      <SolarCalculatorSection />
      <CustomerReviewsSection />
      <AboutCompanySection />
      <GallerySection />
      <FAQsSection />
      <ContactSection />
    </>
  );
}
