import { createContext, useCallback, useContext, useEffect, useState } from "react";
import api from "../services/api";

const StoreSettingsContext = createContext(null);

const defaultSettings = {
  storeName: "FreshCart",
  tagline: "Good food, made easy.",
  announcementText: "Fresh picks, delivered across Nepal",
  logoUrl: "",
  faviconUrl: "",
  heroImageUrl:
    "https://images.unsplash.com/photo-1542838132-92c53300491e?w=1000&auto=format&fit=crop&q=85",
  supportEmail: "",
  supportPhone: "",
  address: "Nepal",
  currencySymbol: "Rs.",
  shippingFee: 100,
  freeShippingThreshold: 1000,
  primaryColor: "#2f6b4f",
};

export const StoreSettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(defaultSettings);
  const [loading, setLoading] = useState(true);

  const refreshSettings = useCallback(async () => {
    const { data } = await api.get("/settings");
    setSettings({ ...defaultSettings, ...data });
    return data;
  }, []);

  const saveSettings = useCallback(async (updates) => {
    const { data } = await api.put("/settings", updates);
    setSettings({ ...defaultSettings, ...data });
    return data;
  }, []);

  useEffect(() => {
    let active = true;
    api.get("/settings")
      .then(({ data }) => {
        if (active) setSettings({ ...defaultSettings, ...data });
      })
      .catch((error) => console.error("Failed to load store settings:", error))
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    document.title = `${settings.storeName} — ${settings.tagline}`;
    document.documentElement.style.setProperty("--color-primary", settings.primaryColor);
    const favicon = document.querySelector('link[rel="icon"]');
    if (favicon) favicon.href = settings.faviconUrl || "/grocery.svg";
  }, [settings]);

  return (
    <StoreSettingsContext.Provider value={{ settings, loading, refreshSettings, saveSettings }}>
      {children}
    </StoreSettingsContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useStoreSettings = () => {
  const context = useContext(StoreSettingsContext);
  if (!context) {
    throw new Error("useStoreSettings must be used within StoreSettingsProvider");
  }
  return context;
};
