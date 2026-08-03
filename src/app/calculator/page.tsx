import type { Metadata } from "next";
import { CalculatorPageContent } from "@/components/pages/CalculatorPageContent";

export const metadata: Metadata = {
  title: "Solar Budget Calculator | Sundeya Solar",
  description:
    "Calculate your solar system size, estimated cost, government subsidy, ROI, and lifetime savings.",
};

export default function CalculatorPage() {
  return <CalculatorPageContent />;
}
