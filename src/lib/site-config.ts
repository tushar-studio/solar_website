export interface PricingConfig {
  tariffRate: number;
  govSubsidy: number;
  premiumCostPerKw: number; // For 3kW and 5kW
  standardCostPerKw: number; // For 4kW, 6-10kW, >10kW
  lifetimeYears: number;
  emiInterestRate: number;
  tenureYears: number[];
  capacityRates?: Record<string, number>;
}

export interface GalleryItem {
  id: string;
  url: string;
  category: string;
  caption?: string;
  createdAt: string;
}

export interface CompanyConfig {
  name: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  workingHours: string;
  mapUrl: string;
  website: string;
  socialInstagram: string;
}

export interface HeroConfig {
  badge: string;
  headline: string;
  subheadline: string;
  ctaPrimary: string;
  ctaSecondary: string;
}

export interface StatItem {
  key: string;
  label: string;
  value: string;
  suffix: string;
  numeric: boolean;
}

export interface SubsidyConfig {
  program: string;
  summary: string;
  verifyNote: string;
  maxSubsidyAmount: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface ReviewItem {
  id: string;
  name: string;
  rating: number;
  review: string;
  photo?: string;
  location?: string;
}

export interface ProductsConfig {
  systems: string[];
  panelBrands: string[];
  panelTechnology: string;
  inverterBrands: string[];
  electricalComponents: string[];
  mountingStructure: string;
}

export interface AboutConfig {
  storyTitle: string;
  storyText: string;
  missionTitle: string;
  missionText: string;
  visionTitle: string;
  visionText: string;
  valuesTitle: string;
  valuesText: string;
  teamTitle: string;
  teamText: string;
}

export interface SiteConfig {
  adminPin: string;
  pricing: PricingConfig;
  company: CompanyConfig;
  hero: HeroConfig;
  about: AboutConfig;
  stats: StatItem[];
  subsidy: SubsidyConfig;
  products: ProductsConfig;
  customerBenefits: string[];
  faqs: FAQItem[];
  reviews: ReviewItem[];
  gallery: GalleryItem[];
}

export const DEFAULT_SITE_CONFIG: SiteConfig = {
  adminPin: "1234567",
  pricing: {
    tariffRate: 7,
    govSubsidy: 85800,
    premiumCostPerKw: 70000,
    standardCostPerKw: 60000,
    lifetimeYears: 25,
    emiInterestRate: 5.75,
    tenureYears: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20],
    capacityRates: {
      "2": 70000,
      "3": 70000,
      "4": 60000,
      "5": 70000,
      "6": 60000,
      "7": 60000,
      "8": 60000,
      "9": 60000,
      "10": 60000,
    },
  },
  company: {
    name: "Sundeya Solar",
    tagline: "PM Surya Ghar Yojana",
    phone: "9568486108",
    whatsapp: "9568486108",
    email: "info@suryagharyojana.online",
    address: "Ring Road, Behind ICICI Bank, Jogiwala, Dehradun, Uttarakhand - 248014",
    workingHours: "Monday – Sunday, 9:00 AM – 6:30 PM",
    mapUrl: "https://share.google/4Z04gWUQTqLxXCmwb",
    website: "https://sundeyasolar.com",
    socialInstagram: "https://instagram.com/sundeyasolar",
  },
  hero: {
    badge: "Official Solar Channel Partner — Dehradun",
    headline: "Power Your Home with Free Solar Energy",
    subheadline: "Get up to ₹85,800 PM Surya Ghar Subsidy + easy low-interest solar financing. Cut your electricity bills by up to 100% with Sundeya Solar.",
    ctaPrimary: "Calculate My Savings",
    ctaSecondary: "Learn About Solar",
  },
  about: {
    storyTitle: "Company Story",
    storyText: "Sundeya Solar began its journey over five years ago with a vision to provide reliable and high-quality solar energy solutions across Uttarakhand. Today, our mission is to make affordable solar power accessible to every household while maintaining the highest standards of quality, safety, and customer satisfaction.",
    missionTitle: "Our Mission",
    missionText: "Our mission is to deliver dependable, affordable, and high-performance solar energy systems that help families and businesses reduce electricity expenses while contributing to a cleaner environment.",
    visionTitle: "Our Vision",
    visionText: "Our vision is to become one of India's most trusted solar energy companies by bringing clean, renewable energy to every home and business.",
    valuesTitle: "Our Values",
    valuesText: "Customer satisfaction always comes first. We believe in honest guidance, transparent pricing, premium-quality products, professional workmanship, and long-term customer relationships.",
    teamTitle: "Our Team",
    teamText: "Our team consists of experienced engineers and dedicated field professionals with over 20-25 years of combined industry experience.",
  },
  stats: [
    { key: "experience", label: "Years Experience", value: "5", suffix: "+", numeric: false },
    { key: "installedCapacity", label: "Total Installed", value: "3", suffix: "+ MW", numeric: true },
    { key: "commercialProjects", label: "Commercial Projects", value: "1500", suffix: "+ kW", numeric: true },
    { key: "pmSuryaGhar", label: "PM Surya Ghar", value: "1500-2000", suffix: " kW", numeric: false },
    { key: "pmsyProjects", label: "Govt / PMSY Projects", value: "600", suffix: " kW", numeric: true },
    { key: "streetLights", label: "Solar Street Lights", value: "1000", suffix: "+", numeric: true },
    { key: "happyCustomers", label: "Happy Customers", value: "150", suffix: "+", numeric: true },
    { key: "team", label: "Industry Expertise", value: "20-25", suffix: "+ Years", numeric: false },
  ],
  subsidy: {
    program: "PM Surya Ghar Yojana",
    summary: "Residential systems from 3 kW to 10 kW are eligible for a subsidy of up to ₹85,800. Sundeya Solar provides complete end-to-end documentation and approval assistance.",
    verifyNote: "Subsidy amounts subject to current government policy.",
    maxSubsidyAmount: "85800",
  },
  products: {
    systems: ["On-Grid Solar System", "Off-Grid Solar System", "Hybrid Solar System with Battery"],
    panelBrands: ["Adani Solar", "Waaree Solar"],
    panelTechnology: "Latest Bifacial TOPCon High-Efficiency Solar Panels",
    inverterBrands: ["Havells", "Polycab"],
    electricalComponents: [
      "ACDB Box (IP65 Rated)",
      "DCDB Box with Surge Protection",
      "Pure Copper Wiring (Havells / Polycab)",
      "Dual Chemical Earthing",
      "Class-A Lightning Arrestor",
    ],
    mountingStructure: "Hot Dip Galvanized (HDG) Structure with 20–25 years anti-rust warranty.",
  },
  customerBenefits: [
    "Government Subsidy Direct in Bank (up to ₹85,800)",
    "Zero-Hassle Complete Documentation Processing",
    "Special Low-Interest Solar Loan & EMI Support",
    "Turnkey End-to-End Rooftop Installation",
    "5 Years Free On-Site Maintenance & Support",
    "Certified & Experienced Solar Engineers",
    "Tier-1 Mono PERC & Bifacial TOPCon Panels",
    "25 Years Panel Performance Warranty",
  ],
  faqs: [
    {
      id: "1",
      question: "How much does a solar system cost for a typical home?",
      answer: "For a typical 3 kW residential system, the estimated cost is approximately Rs.2,10,000. After the PM Surya Ghar Yojana subsidy of up to Rs.85,800, your final cost is around Rs.1,24,200. Use our Solar Budget Calculator for an exact calculation.",
    },
    {
      id: "2",
      question: "What government subsidy is available under PM Surya Ghar Yojana?",
      answer: "Residential customers installing 3 kW to 10 kW solar systems are eligible for a government subsidy of up to Rs.85,800. Sundeya Solar handles all paperwork and portal registration for you.",
    },
    {
      id: "3",
      question: "How long does solar panel installation take?",
      answer: "Residential installation takes only 3 to 5 days after site survey and approval. Net metering and grid synchronization is completed within 2 to 4 weeks.",
    },
    {
      id: "4",
      question: "Can I get a loan or EMI for my solar installation?",
      answer: "Yes! Solar loans are available under PM Surya Ghar Yojana at an attractive interest rate around 5.75% per annum with tenures up to 5-10 years.",
    },
    {
      id: "5",
      question: "Will solar work during a power cut?",
      answer: "Standard On-Grid systems shut off during grid failure for safety. If you need power backup during outages, our Hybrid Solar System with lithium or tubular battery keeps your appliances running seamlessly.",
    },
  ],
  reviews: [
    {
      id: "1",
      name: "Rajesh Sharma",
      rating: 5,
      review: "Excellent installation experience with Sundeya Solar in Dehradun. Electricity bill dropped from ₹4,500 to almost zero!",
      location: "Dehradun",
      photo: "/images/reviews/01.jpg",
    },
    {
      id: "2",
      name: "Anita Rawat",
      rating: 5,
      review: "Very professional team. They handled our PM Surya Ghar subsidy application smoothly and we received the full ₹85,800 amount in our bank account.",
      location: "Rishikesh",
      photo: "/images/reviews/02.jpg",
    },
    {
      id: "3",
      name: "Virender Negi",
      rating: 5,
      review: "Top notch bifacial panels and Havells inverter used. The installation structure is very solid and withstands heavy mountain winds.",
      location: "Haridwar",
      photo: "/images/reviews/03.jpg",
    },
  ],
  gallery: [],
};
