"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSiteConfig } from "@/lib/config/SiteConfigProvider";

export default function AdminPage() {
  const { openPinModal, isAdminUnlocked } = useSiteConfig();
  const router = useRouter();

  useEffect(() => {
    if (!isAdminUnlocked) {
      openPinModal();
    }
    router.replace("/");
  }, [openPinModal, isAdminUnlocked, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
      <div className="text-center p-6">
        <div className="w-10 h-10 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-400 font-medium text-sm">Opening Admin Mode...</p>
      </div>
    </div>
  );
}
