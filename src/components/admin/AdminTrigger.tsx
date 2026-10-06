"use client";

import React, { useEffect } from "react";
import { useSiteConfig } from "@/lib/config/SiteConfigProvider";
import { AdminLoginModal } from "@/components/admin/AdminLoginModal";
import { AdminFloatingBar } from "@/components/admin/AdminFloatingBar";
import { EditCalculatorModal } from "@/components/admin/modals/EditCalculatorModal";
import { EditEmiModal } from "@/components/admin/modals/EditEmiModal";
import { EditHeroModal } from "@/components/admin/modals/EditHeroModal";
import { EditAboutModal } from "@/components/admin/modals/EditAboutModal";
import { EditContactModal } from "@/components/admin/modals/EditContactModal";
import { EditGalleryModal } from "@/components/admin/modals/EditGalleryModal";
import { EditFaqsReviewsModal } from "@/components/admin/modals/EditFaqsReviewsModal";

export function AdminTrigger() {
  const { openPinModal, isAdminUnlocked } = useSiteConfig();

  // Keyboard shortcut Ctrl + Shift + A / Cmd + Shift + A
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === "A" || e.key === "a")) {
        e.preventDefault();
        openPinModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [openPinModal]);

  return (
    <>
      <AdminLoginModal />
      {isAdminUnlocked && (
        <>
          <AdminFloatingBar />
          <EditCalculatorModal />
          <EditEmiModal />
          <EditHeroModal />
          <EditAboutModal />
          <EditContactModal />
          <EditGalleryModal />
          <EditFaqsReviewsModal />
        </>
      )}
    </>
  );
}
