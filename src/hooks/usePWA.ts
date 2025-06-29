import { useEffect, useState } from "react";
import { isPWAInstalled } from "../utils/push-notifications";

export interface UsePWAReturn {
  isPWA: boolean;
  canInstall: boolean;
  install: () => Promise<void>;
}

export const usePWA = (): UsePWAReturn => {
  const [isPWA, setIsPWA] = useState(false);
  const [canInstall, setCanInstall] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // Проверяем, установлено ли приложение как PWA
    setIsPWA(isPWAInstalled());

    // Слушаем событие beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setCanInstall(true);
    };

    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setCanInstall(false);
      setIsPWA(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const install = async (): Promise<void> => {
    if (!deferredPrompt) {
      throw new Error("No install prompt available");
    }

    try {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;

      if (choiceResult.outcome === "accepted") {
        console.log("User accepted the install prompt");
        setDeferredPrompt(null);
        setCanInstall(false);
      } else {
        console.log("User dismissed the install prompt");
      }
    } catch (error) {
      console.error("Error during installation:", error);
      throw error;
    }
  };

  return {
    isPWA,
    canInstall,
    install,
  };
};
