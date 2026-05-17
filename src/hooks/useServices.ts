"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { Service } from "@/lib/database.types";

// Re-export Service type so existing imports keep working
export type { Service };

const FALLBACK: Service[] = [
  { id: "iron-only",      name: "Iron only",        description: "Professional pressing for individual garments.", price: 15,  category: "Per piece", icon: "iron",        badge: null, sort_order: 1, active: true, created_at: "", updated_at: "" },
  { id: "wash-iron",      name: "Wash + iron",       description: "Full wash and professional ironing.",           price: 49,  category: "Per kg",    icon: "washing",     badge: "Popular", sort_order: 2, active: true, created_at: "", updated_at: "" },
  { id: "wash-fold",      name: "Wash + fold",       description: "Wash, dry and neatly folded.",                  price: 39,  category: "Per kg",    icon: "fold",        badge: null, sort_order: 3, active: true, created_at: "", updated_at: "" },
  { id: "dry-cleaning",   name: "Dry cleaning",      description: "Careful dry cleaning for delicate fabrics.",   price: 99,  category: "Per piece", icon: "hanger",      badge: null, sort_order: 4, active: true, created_at: "", updated_at: "" },
  { id: "premium-wash",   name: "Premium wash",      description: "Gentle, premium detergents for best results.", price: 69,  category: "Per kg",    icon: "sparkles",    badge: null, sort_order: 5, active: true, created_at: "", updated_at: "" },
  { id: "stain-removal",  name: "Stain removal",     description: "Targeted treatment for tough stains.",         price: 29,  category: "Per stain", icon: "droplet-off", badge: null, sort_order: 6, active: true, created_at: "", updated_at: "" },
  { id: "shoe-cleaning",  name: "Shoe cleaning",     description: "Deep clean and deodorize shoes (per pair).",   price: 79,  category: "Per pair",  icon: "shoe",        badge: null, sort_order: 7, active: true, created_at: "", updated_at: "" },
  { id: "carpet-blanket", name: "Carpet / blanket",  description: "Large-item cleaning for carpets and blankets.",price: 149, category: "Per piece", icon: "layout-grid", badge: null, sort_order: 8, active: true, created_at: "", updated_at: "" },
];

async function getAuthToken(): Promise<string | null> {
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token ?? null;
}

export function useServices() {
  const [services, setServices] = useState<Service[]>(FALLBACK);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState<string | null>(null);

  const fetchServices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/services");
      if (!res.ok) throw new Error(await res.text());
      const data: Service[] = await res.json();
      setServices(data.length ? data : FALLBACK);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load services");
      setServices(FALLBACK);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchServices(); }, [fetchServices]);

  const addService = async (service: Omit<Service, "id" | "created_at" | "updated_at" | "active">) => {
    const token = await getAuthToken();
    const res = await fetch("/api/services", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(service),
    });
    if (!res.ok) throw new Error(await res.text());
    await fetchServices();
  };

  const updateService = async (id: string, updates: Partial<Service>) => {
    const token = await getAuthToken();
    const res = await fetch(`/api/services/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error(await res.text());
    await fetchServices();
  };

  const deleteService = async (id: string) => {
    const token = await getAuthToken();
    const res = await fetch(`/api/services/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error(await res.text());
    await fetchServices();
  };

  return { services, loading, error, refetch: fetchServices, addService, updateService, deleteService };
}
