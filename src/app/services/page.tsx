"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bed, CheckCircle2, ChevronRight, Droplets,
  Footprints, PackageCheck, Shirt, Sparkles, Wand2, Wind,
} from "lucide-react";
import { useServices } from "@/hooks/useServices";

const ICON_MAP: Record<string, React.ElementType> = {
  iron: Wind, washing: Droplets, fold: PackageCheck,
  hanger: Shirt, sparkles: Sparkles, "droplet-off": Wand2,
  shoe: Footprints, "layout-grid": Bed,
};

function getIcon(name: string): React.ElementType {
  return ICON_MAP[name] ?? Sparkles;
}

export default function ServicesPage() {
  const { services } = useServices();
  const [selected, setSelected] = useState<string[]>([]);
  const router = useRouter();

  const selectedServices = useMemo(
    () => services.filter((s) => selected.includes(s.id)),
    [services, selected],
  );

  const total = useMemo(
    () => selectedServices.reduce((sum, s) => sum + s.price, 0),
    [selectedServices],
  );

  const toggle = (id: string) =>
    setSelected((cur) =>
      cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id],
    );

  const handleContinue = () => {
    try {
      sessionStorage.setItem("selected_services", JSON.stringify(selectedServices));
    } catch {}
    router.push("/order");
  };

  return (
    <div className="gz-page">
      {/* blobs */}
      <div className="gz-blob gz-blob-a" />
      <div className="gz-blob gz-blob-b" />

      <div className="gz-shell">
        {/* header */}
        <header className="gz-page-header">
          <span className="gz-kicker"><Sparkles size={13} /> Services</span>
          <h1 className="gz-title">Your care stack,<br />your rules.</h1>
          <p className="gz-subtitle">
            Tap any service to add it. Mix and match — we handle the rest.
          </p>
        </header>

        {/* grid */}
        <div className="gz-services-grid">
          {services.map((service) => {
            const Icon = getIcon(service.icon || "");
            const on   = selected.includes(service.id);
            return (
              <button
                key={service.id}
                type="button"
                onClick={() => toggle(service.id)}
                aria-pressed={on}
                className={`gz-service-card ${on ? "gz-service-card--on" : ""}`}
              >
                <span className={`gz-svc-icon ${on ? "gz-svc-icon--on" : ""}`}>
                  <Icon size={26} />
                </span>
                {service.badge && (
                  <span className="gz-badge">{service.badge}</span>
                )}
                <h3 className="gz-svc-name">{service.name}</h3>
                <p className="gz-svc-desc">{service.description}</p>
                <div className="gz-svc-footer">
                  <span className={`gz-svc-price ${on ? "gz-svc-price--on" : ""}`}>
                    ₹{service.price}
                    {service.category ? ` / ${service.category.replace("Per ", "")}` : ""}
                  </span>
                  {on && <CheckCircle2 size={18} className="gz-svc-check" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* sticky bar */}
      <div className="gz-sticky-bar">
        <div className="gz-sticky-inner">
          <div className="gz-sticky-info">
            <span className="gz-sticky-count">
              {selected.length ? `${selected.length} selected` : "Nothing selected"}
            </span>
            <span className="gz-sticky-names">
              {selected.length
                ? selectedServices.map((s) => s.name).join(" · ")
                : "Tap a service above to start"}
            </span>
          </div>
          <div className="gz-sticky-right">
            {selected.length > 0 && (
              <span className="gz-sticky-total">₹{total}</span>
            )}
            <button
              onClick={handleContinue}
              disabled={!selected.length}
              className="gz-cta-btn"
            >
              Continue <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
