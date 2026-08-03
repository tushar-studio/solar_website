import type { Metadata } from "next";
import { TermsPageContent } from "@/components/pages/TermsPageContent";

export const metadata: Metadata = {
  title: "Terms of Service | Sundeya Solar",
};

export default function TermsPage() {
  return <TermsPageContent />;
}
