"use client";

import { useState, useEffect } from "react";
import { SiteConfig, defaultSiteConfig } from "@/lib/config";

export function useSiteConfig() {
  const [config, setConfig] = useState<SiteConfig>(defaultSiteConfig);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("site_config");
    if (stored) {
      setConfig(JSON.parse(stored));
    }
    setIsLoaded(true);
  }, []);

  const saveConfig = (newConfig: SiteConfig) => {
    setConfig(newConfig);
    localStorage.setItem("site_config", JSON.stringify(newConfig));
  };

  return { config, saveConfig, isLoaded };
}
