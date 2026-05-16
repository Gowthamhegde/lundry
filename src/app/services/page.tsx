"use client";

import { useState, useMemo } from "react";
import { motion } from 'framer-motion';
import { useRouter } from "next/navigation";
import { useServices } from "@/hooks/useServices";

function Icon({ name, className }: { name: string; className?: string }) {
  const common = { width: 44, height: 44, viewBox: "0 0 24 24", fill: "none", strokeWidth: 1.5 } as any;
  const stroke = "currentColor";
  switch (name) {
    case "iron":
      return (
        <svg {...common} className={className} stroke={stroke} strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 15h16" />
          <path d="M7 15V9a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v6" />
          <path d="M9 20h6" />
        </svg>
      );
    case "washing":
      return (
        <svg {...common} className={className} stroke={stroke} strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 12a9 9 0 0 0 18 0" />
          <path d="M6 12a6 6 0 0 1 12 0" />
        </svg>
      );
    case "fold":
      return (
        <svg {...common} className={className} stroke={stroke} strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 7l9 6 9-6-9-6-9 6z" />
          <path d="M12 13v8" />
        </svg>
      );
    case "hanger":
      return (
        <svg {...common} className={className} stroke={stroke} strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 9a6 6 0 1 1 12 0v1" />
          <path d="M3 20h18" />
        </svg>
      );
    case "sparkles":
      return (
        <svg {...common} className={className} stroke={stroke} strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12l2 2 4-4" />
          <path d="M19 7l-1 3 3 1-3 1 1 3-2-2-2 2 1-3-3-1 3-1-1-3 2 2 2-2z" />
        </svg>
      );
    case "droplet-off":
      return (
        <svg {...common} className={className} stroke={stroke} strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 3l18 18" />
          <path d="M10.94 10.94A4 4 0 0 0 13 18a4 4 0 0 0 4-4c0-1.1-.45-2.1-1.17-2.83" />
        </svg>
      );
    case "shoe":
      return (
        <svg {...common} className={className} stroke={stroke} strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 13s2-4 6-4h8l4 4v3H2v-3z" />
        </svg>
      );
    case "layout-grid":
      return (
        <svg {...common} className={className} stroke={stroke} strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="8" height="8" />
          <rect x="13" y="3" width="8" height="8" />
          <rect x="3" y="13" width="8" height="8" />
          <rect x="13" y="13" width="8" height="8" />
        </svg>
      );
    default:
      return null;
  }
}

export default function ServicesPage() {
  const { services } = useServices();
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (id: string) => {
    setSelected(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]));
  };

  const selectedServices = useMemo(() => services.filter(s => selected.includes(s.id)), [services, selected]);

  const router = useRouter();

  const handleContinue = () => {
    const names = selectedServices.map(s => s.name);
    // persist selection to sessionStorage then navigate to checkout/address form
    try {
      sessionStorage.setItem("selected_services", JSON.stringify(selectedServices));
    } catch (e) {
      console.warn("Could not persist selected services", e);
    }
    router.push("/checkout");
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <header className="mb-6 text-center">
        <h1 className="text-2xl font-semibold text-[22px]">Choose your service</h1>
        <p className="text-[12px] text-gray-500 mt-1">Select one or more services for your laundry order</p>
      </header>

      <section className="service-grid">
        {services.map((service, idx) => {
          const isSelected = selected.includes(service.id);
          return (
            <motion.article
              key={service.id}
              onClick={() => toggle(service.id)}
              role="button"
              aria-pressed={isSelected}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.06, duration: 0.45 }}
              whileHover={{ scale: 1.02 }}
              className={`service-card p-4 relative cursor-pointer transition-transform duration-150` + (isSelected ? " selected" : "")}
            >
              <div className="flex items-start justify-between">
                <div className={`${isSelected ? "text-[var(--accent)]" : "text-current"}`}>
                  <Icon name={service.icon || ""} className={`text-[22px] ${isSelected ? "text-[var(--accent)]" : "text-current"}`} />
                </div>
                <div className="absolute top-3 right-3">
                  <div className={`w-6 h-6 rounded-full border ${isSelected ? "bg-[var(--accent)] border-[var(--accent)]" : "bg-white border-gray-300"} flex items-center justify-center`}>
                    {isSelected ? (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    ) : (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2"><circle cx="12" cy="12" r="5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    )}
                  </div>
                </div>
              </div>

              {service.badge && (
                <div className="absolute left-4 top-3 bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-md">{service.badge}</div>
              )}

              <h3 className="mt-6 text-[15px] font-medium text-[var(--color-text-primary)]">{service.name}</h3>
              <p className="text-[12px] text-[var(--color-text-muted)] leading-[18px] mt-2">{service.description}</p>

              <div className="mt-4 flex items-center justify-between">
                <span className={`price-pill ${isSelected ? 'selected' : ''}`}>₹{service.price}{service.category ? ` / ${service.category.replace('Per ', '')}` : ''}</span>
              </div>
            </motion.article>
          );
        })}
      </section>

      <div className="fixed bottom-4 left-0 right-0 flex justify-center">
        <div className="w-full max-w-6xl bg-[var(--color-background-secondary)] rounded-xl px-6 py-3 flex items-center justify-between shadow-sm">
          <div className="text-sm text-[var(--color-text-muted)]">
            {selected.length === 0 ? 'No services selected' : selectedServices.map(s => s.name).join(', ')}
          </div>
          <button
            onClick={handleContinue}
            disabled={selected.length === 0}
            className={`ml-4 rounded-md px-4 py-2 font-medium text-white ${selected.length === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-[var(--accent)] hover:bg-[#144a80]'}`}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
