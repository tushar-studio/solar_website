import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageLoader } from "@/components/layout/PageLoader";
import { ScrollReset } from "@/components/layout/ScrollReset";
import { SolarBackground } from "@/components/layout/SolarBackground";
import { LanguageProvider } from "@/lib/i18n/LanguageProvider";
import { ThemeProvider } from "@/lib/theme/ThemeProvider";
import { company } from "@/lib/data";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${company.name} | Premium Solar Solutions`,
    template: `%s | ${company.name}`,
  },
  description:
    "Power your future with smart solar solutions. PM Surya Ghar Yojana subsidy support, EMI options, premium solar products, and savings calculator.",
  keywords: [
    "Sundeya Solar",
    "PM Surya Ghar Yojana",
    "solar panels",
    "solar installation",
    "government subsidy",
    "solar calculator",
    "renewable energy",
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: company.name,
    title: `${company.name} | Premium Solar Solutions`,
    description: company.tagline,
  },
  robots: { index: true, follow: true },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: company.name,
  description: company.primaryGoal,
  url: "https://sundeyasolar.com",
  telephone: company.phone,
  email: company.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: company.address,
    addressCountry: "IN",
  },
  image: company.logo,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${plusJakarta.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem("theme");if(t==="light"){document.documentElement.classList.remove("dark")}else{document.documentElement.classList.add("dark")}}catch(e){document.documentElement.classList.add("dark")}`,
          }}
        />
      </head>
      <body className="antialiased">
        <ScrollReset />
        <ThemeProvider>
          <SolarBackground />
          <LanguageProvider>
            <PageLoader />
            <Header />
            <main className="relative z-10">{children}</main>
            <Footer />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
