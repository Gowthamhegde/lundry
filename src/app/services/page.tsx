"use client";

import { useMemo, useState, type SVGProps } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { CheckCircle2, ChevronRight, PackageCheck, Sparkles } from "lucide-react";
import { useServices } from "@/hooks/useServices";

function Icon({ name, className }: { name: string; className?: string }) {
  const common: SVGProps<SVGSVGElement> = { width: 44, height: 44, viewBox: "0 0 24 24", fill: "none", strokeWidth: 1.5 };
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
  const router = useRouter();

  const selectedServices = useMemo(() => services.filter((service) => selected.includes(service.id)), [services, selected]);

  const toggle = (id: string) => {
    setSelected((current) => (current.includes(id) ? current.filter((serviceId) => serviceId !== id) : [...current, id]));
  };

  const handleContinue = () => {
    try {
      sessionStorage.setItem("selected_services", JSON.stringify(selectedServices));
    } catch (error) {
      console.warn("Could not persist selected services", error);
    }

    router.push("/order");
  };

  return (
    <div className="studio-page pb-28">
      <div className="studio-shell">
        <header className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-end">
          <div>
            <p className="studio-kicker">
              <Sparkles className="h-4 w-4" />
              Laundry menu
            </p>
            <h1 className="studio-title">Pick your care stack</h1>
            <p className="studio-copy">
              Build the exact order you need. Select multiple services, review the running summary, and continue straight into pickup details.
            </p>
          </div>
          <div className="studio-panel p-5">
            <div className="flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-lg bg-teal-500/12 text-teal-600 dark:text-teal-300">
                <PackageCheck className="h-6 w-6" />
              </span>
              <div>
                <p className="text-sm font-black text-[var(--color-text-primary)]">{selected.length || "No"} selected</p>
                <p className="text-sm text-[var(--color-text-muted)]">
                  {selected.length ? selectedServices.map((service) => service.name).join(" + ") : "Start with wash, press, or specialty care."}
                </p>
              </div>
            </div>
          </div>
        </header>

        <section className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service, index) => {
            const isSelected = selected.includes(service.id);

            return (
              <motion.button
                key={service.id}
                type="button"
                onClick={() => toggle(service.id)}
                aria-pressed={isSelected}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.42 }}
                whileHover={{ y: -6 }}
                className={`group min-h-60 rounded-lg border p-5 text-left transition ${
                  isSelected
                    ? "border-teal-400 bg-teal-50/90 text-slate-950 shadow-[0_22px_70px_rgba(20,184,166,0.18)] dark:bg-teal-500/12 dark:text-white"
                    : "border-slate-200/70 bg-white/72 hover:border-teal-300 dark:border-slate-800 dark:bg-slate-900/72"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <span
                    className={`grid h-14 w-14 place-items-center rounded-lg transition ${
                      isSelected
                        ? "bg-teal-500 text-white"
                        : "bg-slate-100 text-teal-700 group-hover:bg-teal-500 group-hover:text-white dark:bg-slate-800 dark:text-teal-300"
                    }`}
                  >
                    <Icon name={service.icon || ""} className="h-8 w-8" />
                  </span>
                  {isSelected ? <CheckCircle2 className="h-6 w-6 shrink-0 text-teal-600 dark:text-teal-300" /> : null}
                </div>

                {service.badge ? <span className="mt-5 inline-flex rounded-full bg-lime-300 px-2.5 py-1 text-xs font-black text-slate-950">{service.badge}</span> : null}

                <h3 className="mt-6 text-2xl font-black leading-none tracking-tight text-[var(--color-text-primary)]">{service.name}</h3>
                <p className="mt-3 text-sm leading-6 text-[var(--color-text-muted)]">{service.description}</p>

                <div className="mt-6 flex items-center justify-between gap-3">
                  <span
                    className={`rounded-full px-3 py-1.5 text-sm font-black ${
                      isSelected ? "bg-teal-500 text-white" : "bg-blue-500/10 text-blue-700 dark:text-blue-300"
                    }`}
                  >
                    Rs. {service.price}
                    {service.category ? ` / ${service.category.replace("Per ", "")}` : ""}
                  </span>
                  <span className="text-xs font-black uppercase text-[var(--color-text-muted)]">{isSelected ? "Added" : "Tap"}</span>
                </div>
              </motion.button>
            );
          })}
        </section>
      </div>

      <div className="fixed bottom-4 left-0 right-0 z-40 flex justify-center px-4">
        <div className="studio-panel flex w-full max-w-5xl flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-black text-[var(--color-text-primary)]">
              {selected.length === 0 ? "No services selected" : `${selected.length} service stack ready`}
            </p>
            <p className="mt-1 max-w-2xl truncate text-sm text-[var(--color-text-muted)]">
              {selected.length === 0 ? "Choose a service to continue." : selectedServices.map((service) => service.name).join(", ")}
            </p>
          </div>
          <button onClick={handleContinue} disabled={selected.length === 0} className="studio-button shrink-0 disabled:bg-gray-400">
            Continue <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
