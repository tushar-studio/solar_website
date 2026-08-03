import type { Metadata } from "next";
import { EMIPageContent } from "@/components/pages/EMIPageContent";

export const metadata: Metadata = {
  title: "EMI / Loan Options | Sundeya Solar",
  description:
    "Flexible EMI options are available. Please contact our team to discuss the best financing plan according to your requirements.",
};

export default function EMIPage() {
  return <EMIPageContent />;
}
