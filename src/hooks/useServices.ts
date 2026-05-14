"use client";

import { useState, useEffect } from "react";

export type Service = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
};

const defaultServices: Service[] = [
  { id: "1", name: "Standard Wash & Fold", description: "Everyday laundry washed, dried, and folded.", price: 15.00, category: "Wash" },
  { id: "2", name: "Premium Ironing", description: "Professional ironing for a crisp, clean look.", price: 12.50, category: "Iron" },
  { id: "3", name: "Dry Cleaning", description: "Specialized cleaning for delicate fabrics.", price: 25.00, category: "Dry Clean" },
];

export function useServices() {
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("laundry_services");
    if (stored) {
      setServices(JSON.parse(stored));
    } else {
      setServices(defaultServices);
      localStorage.setItem("laundry_services", JSON.stringify(defaultServices));
    }
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
