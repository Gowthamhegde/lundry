"use client";

import { useState, useEffect } from "react";

export type Service = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  icon?: string;
  badge?: string;
};

const defaultServices: Service[] = [
  { id: "iron-only", name: "Iron only", description: "Professional pressing for individual garments.", price: 15, category: "Per piece", icon: "iron" },
  { id: "wash-iron", name: "Wash + iron", description: "Full wash and professional ironing.", price: 49, category: "Per kg", icon: "washing", badge: "Popular" },
  { id: "wash-fold", name: "Wash + fold", description: "Wash, dry and neatly folded.", price: 39, category: "Per kg", icon: "fold" },
  { id: "dry-cleaning", name: "Dry cleaning", description: "Careful dry cleaning for delicate fabrics.", price: 99, category: "Per piece", icon: "hanger" },
  { id: "premium-wash", name: "Premium wash", description: "Gentle, premium detergents for best results.", price: 69, category: "Per kg", icon: "sparkles" },
  { id: "stain-removal", name: "Stain removal", description: "Targeted treatment for tough stains.", price: 29, category: "Per stain", icon: "droplet-off" },
  { id: "shoe-cleaning", name: "Shoe cleaning", description: "Deep clean and deodorize shoes (per pair).", price: 79, category: "Per pair", icon: "shoe" },
  { id: "carpet-blanket", name: "Carpet / blanket", description: "Large-item cleaning for carpets and blankets.", price: 149, category: "Per piece", icon: "layout-grid" },
];

function isService(value: unknown): value is Service {
  if (typeof value !== "object" || value === null) return false;

  const service = value as Partial<Service>;
  return (
    typeof service.id === "string" &&
    typeof service.name === "string" &&
    typeof service.description === "string" &&
    typeof service.price === "number" &&
    typeof service.category === "string"
  );
}

function readStoredServices() {
  try {
    const stored = localStorage.getItem("laundry_services");
    const parsed: unknown = stored ? JSON.parse(stored) : null;

    if (Array.isArray(parsed) && parsed.every(isService)) {
      const storedIds = new Set(parsed.map((service) => service.id));
      const defaultIds = new Set(defaultServices.map((service) => service.id));
      const sameCount = parsed.length === defaultServices.length;
      const allDefaultsPresent = [...defaultIds].every((id) => storedIds.has(id));

      if (sameCount && allDefaultsPresent) {
        return parsed;
      }
    }
  } catch {
    return defaultServices;
  }

  localStorage.setItem("laundry_services", JSON.stringify(defaultServices));
  return defaultServices;
}

export function useServices() {
  const [services, setServices] = useState<Service[]>(defaultServices);

  useEffect(() => {
    queueMicrotask(() => setServices(readStoredServices()));
  }, []);

  const saveServices = (newServices: Service[]) => {
    setServices(newServices);
    localStorage.setItem("laundry_services", JSON.stringify(newServices));
  };

  const addService = (service: Omit<Service, "id">) => {
    const newService = { ...service, id: Math.random().toString(36).substr(2, 9) };
    saveServices([...services, newService]);
  };

  const updateService = (id: string, updatedData: Partial<Service>) => {
    saveServices(services.map(s => s.id === id ? { ...s, ...updatedData } : s));
  };

  const deleteService = (id: string) => {
    saveServices(services.filter(s => s.id !== id));
  };

  return { services, addService, updateService, deleteService };
}
