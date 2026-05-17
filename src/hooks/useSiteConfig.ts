"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import { defaultSiteConfig, type SiteConfig } from "@/lib/config";

async function getAuthToken(): Promise<string | null> {
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token ?? null;
}

export function useSiteConfig() {
  const [config,   setConfig]   = useState<SiteConfig>(defaultSiteConfig);
  const [isLoaded, setIsLoaded] = useState(false);

  const fetchConfig = useCallback(async () => {
    try {
      const res = await fetch("/api/site-config");
      if (!res.ok) throw new Error(await res.text());
      const data: Partial<SiteConfig> = await res.json();
      setConfig({ ...defaultSiteConfig, ...data });
    } catch {
      // Fall back to defaults silently
      setConfig(defaultSiteConfig);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => { fetchConfig(); }, [fetchConfig]);

  const saveConfig = async (newConfig: SiteConfig) => {
    const token = await getAuthToken();
    const res = await fetch("/api/site-config", {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(newConfig),
    });
    if (!res.ok) throw new Error(await res.text());
    setConfig(newConfig);
  };

  return { config, saveConfig, isLoaded, refetch: fetchConfig };
}
