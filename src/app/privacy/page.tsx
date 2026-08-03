import type { Metadata } from "next";
import { PrivacyPageContent } from "@/components/pages/PrivacyPageContent";

export const metadata: Metadata = {
  title: "Privacy Policy | Sundeya Solar",
};

export default function PrivacyPage() {
  return <PrivacyPageContent />;
}
