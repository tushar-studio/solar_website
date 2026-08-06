export const company = {
  name: "Sundeya Solar",
  logo: "/images/logo.jpg",
  tagline: "PM Surya Ghar Yojana",
  primaryGoal:
    "Generate customer leads, increase phone calls and WhatsApp inquiries, educate visitors about solar energy and government subsidy, and convert visitors using an interactive Solar Budget Calculator.",
  phone: "9568486108",
  whatsapp: "9568486108",
  email: "info@suryagharyojana.online",
  address: "Ring Road, Behind ICICI Bank, Jogiwala, Dehradun, Uttarakhand - 248014",
  workingHours: "Monday – Sunday, 9:00 AM – 6:30 PM",
  mapUrl: "https://maps.app.goo.gl/1VoNjzXnY6JYTaRz8?g_st=aw",
  website: "https://sundeyasolar.com",
  social: {
    instagram: "https://instagram.com/surya.ghar.yojna",
  } as Record<string, string>,
} as const;

export const brand = {
  primaryColor: "#2E7D32",
  secondaryColor: "#0288D1",
  accentColor: "#F59E0B",
} as const;

export const hero = {
  headline: "Power Your Future with Smart Solar Solutions",
  subheadline:
    "Discover how much you can save with solar. Learn about government subsidies, EMI options, premium solar products, and calculate your estimated savings—all in one place.",
  ctaPrimary: "Calculate My Savings",
  ctaSecondary: "Learn About Solar",
} as const;

export const stats = [
  { key: "experience", value: "5", suffix: "+", numeric: false },
  { key: "installedCapacity", value: "3", suffix: "+ MW", numeric: true },
  { key: "commercialProjects", value: "1500", suffix: "+ kW", numeric: true },
  { key: "pmSuryaGhar", value: "1500-2000", suffix: " kW", numeric: false },
  { key: "pmsyProjects", value: "600", suffix: " kW", numeric: true },
  { key: "streetLights", value: "1000", suffix: "+", numeric: true },
  { key: "happyCustomers", value: "150", suffix: "+", numeric: true },
  { key: "team", value: "20-25", suffix: "+ Years", numeric: false },
] as const;

export const learnCards = [
  {
    slug: "how-solar-works",
    title: "How Solar Works",
    description: "Learn how solar panels convert sunlight into electricity — from photovoltaic cells to your home appliances.",
    comingSoon: true,
  },
  {
    slug: "how-we-help-you",
    title: "How We Help You",
    description: "From site survey to installation and subsidy — discover how we make going solar simple and stress-free.",
    comingSoon: true,
  },
  {
    slug: "our-impact",
    title: "Our Impact",
    description: "See the environmental benefits and financial savings our customers have achieved with solar energy.",
    comingSoon: true,
  },
  {
    slug: "installation-process",
    title: "Solar Installation Process",
    description: "A step-by-step walkthrough of how we install your solar system — from mounting to grid connection.",
    comingSoon: true,
  },
  {
    slug: "maintenance-guide",
    title: "Maintenance Guide",
    description: "Simple maintenance tips to keep your solar panels performing at peak efficiency for decades.",
    comingSoon: true,
  },
] as const;

export const subsidyInfo = {
  program: "PM Surya Ghar Yojana",
  summary:
    "Residential systems from 3 kW to 10 kW are eligible for a subsidy of up to ₹85,800 (verify before publishing). Sundeya Solar provides complete documentation assistance for subsidy applications.",
  verifyNote: "Subsidy amounts subject to current government policy. Verify before publishing.",
} as const;

export const emiInfo = {
  program: "PM Surya Ghar Yojana",
  interestRate: "5.75% per annum",
  verifyNote: "Subject to eligibility. Verify interest rate before publishing.",
  description:
    "Flexible EMI options are available. Please contact our team to discuss the best financing plan according to your requirements.",
} as const;

export const subsidyTopics = [
  "Government Subsidy",
  "Eligibility",
  "Documents",
  "Step by Step Process",
  "Latest Updates",
  "FAQ",
] as const;

export const emiTopics = [
  "Loan Options",
  "EMI Calculator",
  "Interest Rate",
  "Banks",
  "NBFC",
  "Eligibility",
  "Required Documents",
  "Monthly EMI Examples",
] as const;

export const products = {
  systems: ["On-Grid", "Off-Grid", "Hybrid"],
  panelBrands: ["Adani Solar", "Waaree"],
  panelTechnology: "Latest Bifacial TOPCon Solar Panels",
  inverterBrands: ["Havells", "Polycab"],
  electricalComponents: [
    "ACDB Box",
    "DCDB Box",
    "Copper Wiring (Havells / Polycab)",
    "Chemical Earthing",
    "Lightning Arrestor",
  ],
  mountingStructure:
    "HDG (Hot Dip Galvanized) Structure with additional corrosion protection designed for 20–25 years of durability.",
} as const;

export const customerBenefits = [
  "Government Subsidy Support",
  "Complete Documentation Assistance",
  "Loan Assistance",
  "End-to-End Installation",
  "5 Years Free Service",
  "Professional Installation Team",
  "Premium Components",
  "Hassle-Free Process",
] as const;

export const targetAudience = [
  "Home Owners",
  "Residential Customers",
  "Commercial Businesses",
  "Industries",
  "Government Projects",
] as const;

export const reviewPlaceholders = [
  { id: "1", rating: 5, review: "Excellent installation experience. The team was professional, completed the work on time, and explained everything clearly. Highly recommended.", photo: "/images/reviews/01.jpg" },
  { id: "2", rating: 5, review: "Our electricity bill has reduced significantly after installing the solar system. The installation quality is excellent.", photo: "/images/reviews/02.jpg" },
  { id: "3", rating: 5, review: "Very supportive staff throughout the subsidy process. Everything was handled smoothly.", photo: "/images/reviews/03.jpg" },
  { id: "4", rating: 5, review: "Professional engineers, neat installation, and quality products. Completely satisfied.", photo: "/images/reviews/04.jpg" },
  { id: "5", rating: 5, review: "Quick installation and great customer support. The team answered every question patiently.", photo: "/images/reviews/05.jpg" },
  { id: "6", rating: 5, review: "Reliable service from consultation to installation. Everything was completed exactly as promised.", photo: "/images/reviews/06.jpg" },
  { id: "7", rating: 5, review: "Very experienced technicians. The system has been performing perfectly since installation.", photo: "/images/reviews/07.jpg" },
  { id: "8", rating: 5, review: "Affordable pricing with premium quality components. Worth every penny.", photo: "/images/reviews/08.jpg" },
  { id: "9", rating: 5, review: "The installation was completed on schedule and the after-sales support has been outstanding.", photo: "/images/reviews/09.jpg" },
  { id: "10", rating: 5, review: "Highly recommended for anyone looking to install rooftop solar. Honest guidance and quality workmanship.", photo: "/images/reviews/10.jpg" },
] as const;

export const aboutItems = [
  { slug: "story", title: "Company Story", icon: "BookOpen" },
  { slug: "mission", title: "Mission", icon: "Target" },
  { slug: "vision", title: "Vision", icon: "Eye" },
  { slug: "values", title: "Values", icon: "Heart" },
  { slug: "team", title: "Team", icon: "Users" },
  { slug: "projects", title: "Projects", icon: "FolderKanban" },
  { slug: "impact", title: "Impact", icon: "Leaf" },
] as const;

export const galleryCategories = [
  "Residential Projects",
  "Commercial Projects",
  "Industrial Projects",
  "Before & After",
  "Drone Shots",
  "Videos",
] as const;

export const faqs = [
  {
    question: "How much does a solar system cost for a typical home?",
    answer:
      "For a typical 3 kW residential system, the estimated cost is approximately Rs.2,10,000. After the PM Surya Ghar Yojana subsidy of up to Rs.85,800, your final cost could be as low as Rs.1,24,200. Actual costs vary based on panel brand, roof type, and installation complexity. Use our Solar Budget Calculator for a personalized estimate.",
  },
  {
    question: "What government subsidy is available under PM Surya Ghar Yojana?",
    answer:
      "Residential customers installing 3 kW to 10 kW solar systems are eligible for a government subsidy of up to Rs.85,800. The subsidy covers approximately 40% of the system cost. Sundeya Solar handles all documentation and application processing, making the subsidy process completely hassle-free for you.",
  },
  {
    question: "How long does solar panel installation take?",
    answer:
      "A typical residential installation takes 3 to 5 days after site assessment and design approval. The complete process from consultation, subsidy application, and installation to grid connection usually spans 2 to 4 weeks. We handle every step, keeping you informed throughout.",
  },
  {
    question: "What is the lifespan of solar panels and do they need maintenance?",
    answer:
      "Modern bifacial TOPCon solar panels have a design life of 25 to 30 years. They require minimal maintenance - occasional cleaning to remove dust and debris, typically twice a year. Sundeya Solar provides 5 years of free service with every installation and uses HDG mounting structures rated for 20-25 years of durability.",
  },
  {
    question: "Can I get a loan or EMI for my solar installation?",
    answer:
      "Yes! Solar loans are available under PM Surya Ghar Yojana at approximately 5.75% annual interest (subject to eligibility). EMI options make solar affordable with monthly payments comparable to your current electricity bill. Visit our EMI/Loan page or open the Solar Budget Calculator to estimate your monthly EMI.",
  },
  {
    question: "Will solar work during a power cut?",
    answer:
      "Standard On-Grid solar systems shut off during power cuts for safety reasons (anti-islanding). If you need backup power during outages, choose a Hybrid system with battery storage. Our Hybrid systems keep your essential appliances running even when the grid is down. Select Need Power Backup in the calculator for Hybrid pricing.",
  },
  {
    question: "How much can I save with solar panels?",
    answer:
      "A typical home can save approximately 85% on electricity bills - often Rs.3,000 to Rs.8,000 per month depending on system size. Payback period is usually 3 to 6 years, after which you enjoy nearly free electricity for the remaining 20+ years of the system's life. Lifetime savings can exceed Rs.10-15 lakhs for a 5 kW system.",
  },
] as const;

export const footerLinks = {
  quickLinks: [
    { label: "Home", href: "/" },
    { label: "About", href: "/about/story" },
    { label: "Gallery", href: "/gallery" },
    { label: "Contact", href: "/#contact" },
  ],
  products: [
    { label: "On-Grid Solar", href: "/#products" },
    { label: "Off-Grid Solar", href: "/#products" },
    { label: "Hybrid Solar", href: "/#products" },
  ],
  services: [
    { label: "Installation", href: "/#benefits" },
    { label: "Maintenance", href: "/#benefits" },
    { label: "Subsidy Assistance", href: "/subsidy" },
  ],
  resources: [
    { label: "Subsidy Guide", href: "/subsidy" },
    { label: "EMI / Loan", href: "/emi" },
    { label: "Calculator", href: "/calculator" },
    { label: "FAQs", href: "/#faqs" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
} as const;

export const indianStates = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Delhi",
] as const;
