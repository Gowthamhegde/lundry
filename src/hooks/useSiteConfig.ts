"use client";

import { useState, useEffect } from "react";
import { SiteConfig, defaultSiteConfig } from "@/lib/config";

function readStoredConfig() {
  try {
    const stored = localStorage.getItem("site_config");
    return stored ? ({ ...defaultSiteConfig, ...JSON.parse(stored) } as SiteConfig) : defaultSiteConfig;
  } catch {
    return defaultSiteConfig;
  }
}

export function useSiteConfig() {
  const [config, setConfig] = useState<SiteConfig>(defaultSiteConfig);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      setConfig(readStoredConfig());
      setIsLoaded(true);
    });
  }, []);

  const saveConfig = (newConfig: SiteConfig) => {
    setConfig(newConfig);
    localStorage.setItem("site_config", JSON.stringify(newConfig));
  };

  return { config, saveConfig, isLoaded };
}
