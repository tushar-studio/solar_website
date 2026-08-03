import type { Metadata } from "next";
import { SubsidyPageContent } from "@/components/pages/SubsidyPageContent";

export const metadata: Metadata = {
  title: "Government Subsidy | Sundeya Solar",
  description:
    "Residential systems from 3 kW to 10 kW are eligible for a subsidy of up to ₹85,800 under PM Surya Ghar Yojana.",
};

export default function SubsidyPage() {
  return <SubsidyPageContent />;
}
