"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { DEFAULT_SITE_CONFIG, SiteConfig } from "@/lib/site-config";

export type EditorModalType =
  | "calculator"
  | "emi"
  | "hero"
  | "about"
  | "contact"
  | "gallery"
  | "faqs"
  | "reviews"
  | "settings"
  | null;

interface SiteConfigContextType {
  config: SiteConfig;
  isLoading: boolean;
  isAdminUnlocked: boolean;
  isPinModalOpen: boolean;
  activeEditor: EditorModalType;
  openPinModal: () => void;
  closePinModal: () => void;
  unlockWithPin: (pin: string) => Promise<boolean>;
  lockAdmin: () => void;
  openEditor: (editor: NonNullable<EditorModalType>) => void;
  closeEditor: () => void;
  saveConfigAndSync: (updated: Partial<SiteConfig>) => Promise<{ success: boolean; message: string }>;
  resetDefaults: () => Promise<{ success: boolean; message: string }>;
  refreshConfig: () => Promise<void>;
  cachedPin: string;
}

const SiteConfigContext = createContext<SiteConfigContextType | undefined>(undefined);

export function SiteConfigProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<SiteConfig>(DEFAULT_SITE_CONFIG);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [activeEditor, setActiveEditor] = useState<EditorModalType>(null);
  const [cachedPin, setCachedPin] = useState("");

  const refreshConfig = useCallback(async () => {
    // 1. Immediately apply any browser-cached admin configuration
    if (typeof window !== "undefined") {
      try {
        const local = localStorage.getItem("sundeya_site_config_v1");
        if (local) {
          const parsed = JSON.parse(local);
          setConfig((prev) => ({ ...prev, ...parsed }));
        }
      } catch (e) {
        console.warn("Could not read local config cache:", e);
      }
    }

    // 2. Fetch server configuration in background
    try {
      const res = await fetch("/api/admin/config", { cache: "no-store" });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setConfig((prev) => {
            let localData = {};
            if (typeof window !== "undefined") {
              try {
                const local = localStorage.getItem("sundeya_site_config_v1");
                if (local) localData = JSON.parse(local);
              } catch {}
            }
            return { ...prev, ...json.data, ...localData };
          });
        }
      }
    } catch (err) {
      console.warn("Could not fetch remote config, using defaults:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshConfig();

    // Check saved session auth
    const storedPin = sessionStorage.getItem("sundeya_admin_pin");
    if (storedPin) {
      setCachedPin(storedPin);
      setIsAdminUnlocked(true);
    }
  }, [refreshConfig]);

  const openPinModal = () => {
    if (isAdminUnlocked) {
      // Already unlocked, open floating settings or dock
      return;
    }
    setIsPinModalOpen(true);
  };

  const closePinModal = () => setIsPinModalOpen(false);

  const unlockWithPin = async (pin: string): Promise<boolean> => {
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin }),
      });
      const data = await res.json();
      if (data.success) {
        setIsAdminUnlocked(true);
        setCachedPin(pin);
        sessionStorage.setItem("sundeya_admin_pin", pin);
        setIsPinModalOpen(false);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const lockAdmin = () => {
    setIsAdminUnlocked(false);
    setCachedPin("");
    setActiveEditor(null);
    sessionStorage.removeItem("sundeya_admin_pin");
  };

  const openEditor = (editor: NonNullable<EditorModalType>) => {
    if (!isAdminUnlocked) {
      setIsPinModalOpen(true);
      return;
    }
    setActiveEditor(editor);
  };

  const closeEditor = () => setActiveEditor(null);

  const saveConfigAndSync = async (
    updated: Partial<SiteConfig>
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const pinToUse = cachedPin || sessionStorage.getItem("sundeya_admin_pin") || "123456";

      // 1. Immediately persist to React state & localStorage
      const merged = { ...config, ...updated };
      setConfig(merged);
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("sundeya_site_config_v1", JSON.stringify(merged));
        } catch (e) {
          console.warn("localStorage write failed:", e);
        }
      }

      // 2. Sync to server API
      const res = await fetch("/api/admin/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin: pinToUse, config: updated }),
      });
      const data = await res.json();

      if (data.success) {
        return { success: true, message: data.message || "Changes saved!" };
      }

      // If server had a non-fatal warning, local change is still preserved
      return { success: true, message: "Changes saved in browser storage!" };
    } catch {
      return { success: true, message: "Changes saved locally in browser!" };
    }
  };

  const resetDefaults = async (): Promise<{ success: boolean; message: string }> => {
    try {
      const pinToUse = cachedPin || sessionStorage.getItem("sundeya_admin_pin") || "123456";
      if (typeof window !== "undefined") {
        try {
          localStorage.removeItem("sundeya_site_config_v1");
        } catch {}
      }
      setConfig(DEFAULT_SITE_CONFIG);

      const res = await fetch("/api/admin/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin: pinToUse, resetToDefault: true }),
      });
      const data = await res.json();
      if (data.success) {
        return { success: true, message: "Reset to default successfully!" };
      }
      return { success: true, message: "Reset to defaults locally!" };
    } catch {
      return { success: true, message: "Reset to defaults locally!" };
    }
  };

  return (
    <SiteConfigContext.Provider
      value={{
        config,
        isLoading,
        isAdminUnlocked,
        isPinModalOpen,
        activeEditor,
        openPinModal,
        closePinModal,
        unlockWithPin,
        lockAdmin,
        openEditor,
        closeEditor,
        saveConfigAndSync,
        resetDefaults,
        refreshConfig,
        cachedPin,
      }}
    >
      {children}
    </SiteConfigContext.Provider>
  );
}

export function useSiteConfig() {
  const context = useContext(SiteConfigContext);
  if (!context) {
    throw new Error("useSiteConfig must be used within a SiteConfigProvider");
  }
  return context;
}
