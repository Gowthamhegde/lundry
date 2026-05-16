"use client";

import { useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import Link from "next/link";
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  ClipboardList,
  MapPin,
  Minus,
  PackageCheck,
  Phone,
  Plus,
  User,
} from "lucide-react";
import { useServices } from "@/hooks/useServices";

type OrderForm = {
  name: string;
  phone: string;
  address: string;
  pickupDate: string;
  pickupTime: string;
  notes: string;
};

const initialForm: OrderForm = {
  name: "",
  phone: "",
  address: "",
  pickupDate: "",
  pickupTime: "",
  notes: "",
};

function readStoredServiceIds() {
  if (typeof window === "undefined") return [];

  try {
    const rawSelectedServices = sessionStorage.getItem("selected_services");
    const selectedServices = rawSelectedServices ? (JSON.parse(rawSelectedServices) as unknown) : [];

    if (!Array.isArray(selectedServices)) return [];

    return selectedServices
      .map((service) => {
        if (typeof service === "object" && service !== null && "id" in service && typeof service.id === "string") {
          return service.id;
        }

        return "";
      })
      .filter(Boolean);
  } catch (error) {
    console.warn("Could not read selected services", error);
    return [];
  }
}

export default function OrderPage() {
  const { services } = useServices();
  const [selectedIds, setSelectedIds] = useState<string[]>(() => readStoredServiceIds());
  const [quantities, setQuantities] = useState<Record<string, number>>(() =>
    Object.fromEntries(readStoredServiceIds().map((id) => [id, 1])),
  );
  const [form, setForm] = useState<OrderForm>(initialForm);
  const [submittedOrder, setSubmittedOrder] = useState<string | null>(null);

  const selectedServices = useMemo(
    () => services.filter((service) => selectedIds.includes(service.id)),
    [selectedIds, services],
  );

  const estimatedTotal = useMemo(
    () =>
      selectedServices.reduce((sum, service) => {
        return sum + service.price * (quantities[service.id] || 1);
      }, 0),
    [quantities, selectedServices],
  );

  const canSubmit =
    selectedServices.length > 0 &&
    form.name.trim().length > 1 &&
    form.phone.trim().length > 6 &&
    form.address.trim().length > 6 &&
    Boolean(form.pickupDate) &&
    Boolean(form.pickupTime);

  const updateForm = (field: keyof OrderForm) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const toggleService = (serviceId: string) => {
    setSubmittedOrder(null);
    setSelectedIds((current) => {
      if (current.includes(serviceId)) {
        return current.filter((id) => id !== serviceId);
      }

      setQuantities((currentQuantities) => ({ ...currentQuantities, [serviceId]: currentQuantities[serviceId] || 1 }));
      return [...current, serviceId];
    });
  };

  const updateQuantity = (serviceId: string, direction: "up" | "down") => {
    setSubmittedOrder(null);
    setQuantities((current) => {
      const nextValue = direction === "up" ? (current[serviceId] || 1) + 1 : Math.max(1, (current[serviceId] || 1) - 1);
      return { ...current, [serviceId]: nextValue };
    });
  };

  const submitOrder = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit) return;

    const orderId = `FW-${Date.now().toString().slice(-6)}`;
    const order = {
      id: orderId,
      customer: {
        name: form.name.trim(),
        phone: form.phone.trim(),
      },
      pickup: {
        address: form.address.trim(),
        date: form.pickupDate,
        time: form.pickupTime,
      },
      notes: form.notes.trim(),
      services: selectedServices.map((service) => ({
        id: service.id,
        name: service.name,
        price: service.price,
        quantity: quantities[service.id] || 1,
      })),
      estimatedTotal,
      status: "Order received",
      createdAt: new Date().toISOString(),
    };

    try {
      localStorage.setItem("last_order", JSON.stringify(order));
    } catch (error) {
      console.warn("Could not save order", error);
    }

    setSubmittedOrder(orderId);
  };

  return (
    <div className="studio-page">
      <div className="studio-shell grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
        <section>
          <div className="mb-8">
            <p className="studio-kicker">
              <ClipboardList className="h-4 w-4" />
              Take a new order
            </p>
            <h1 className="studio-title">Create laundry order</h1>
            <p className="studio-copy">
              Add customer details, choose services, and confirm a pickup slot from one dedicated page.
            </p>
          </div>

          <form onSubmit={submitOrder} className="space-y-6">
            <div className="studio-panel p-5">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-bold">
                <User className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                Customer details
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="grid gap-2 text-sm font-semibold">
                  Full name
                  <input
                    value={form.name}
                    onChange={updateForm("name")}
                    className="studio-input"
                    placeholder="Customer name"
                  />
                </label>
                <label className="grid gap-2 text-sm font-semibold">
                  Phone number
                  <span className="relative">
                    <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                      value={form.phone}
                      onChange={updateForm("phone")}
                      className="studio-input pl-10"
                      placeholder="+91 98765 43210"
                    />
                  </span>
                </label>
                <label className="grid gap-2 text-sm font-semibold md:col-span-2">
                  Pickup address
                  <span className="relative">
                    <MapPin className="pointer-events-none absolute left-3 top-4 h-4 w-4 text-gray-400" />
                    <textarea
                      value={form.address}
                      onChange={updateForm("address")}
                      className="studio-input min-h-28 py-3 pl-10"
                      placeholder="House number, street, area, landmark"
                    />
                  </span>
                </label>
              </div>
            </div>

            <div className="studio-panel p-5">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-bold">
                <PackageCheck className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                Services
              </h2>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {services.map((service) => {
                  const isSelected = selectedIds.includes(service.id);

                  return (
                    <button
                      type="button"
                      key={service.id}
                      onClick={() => toggleService(service.id)}
                      aria-pressed={isSelected}
                      className={`rounded-lg border p-4 text-left transition ${
                        isSelected
                          ? "border-teal-500 bg-teal-50 text-teal-950 ring-4 ring-teal-500/10 dark:bg-teal-500/10 dark:text-white"
                          : "border-gray-200 bg-gray-50 hover:border-teal-300 dark:border-slate-800 dark:bg-slate-950"
                      }`}
                    >
                      <span className="flex items-start justify-between gap-3">
                        <span>
                          <span className="block font-bold">{service.name}</span>
                          <span className="mt-1 block text-xs leading-5 text-gray-500 dark:text-slate-400">{service.description}</span>
                        </span>
                        {isSelected && <CheckCircle2 className="h-5 w-5 shrink-0 text-teal-600 dark:text-teal-300" />}
                      </span>
                      <span className="mt-4 block text-sm font-black text-teal-700 dark:text-teal-300">
                        Rs. {service.price} {service.category ? `/ ${service.category.replace("Per ", "")}` : ""}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="studio-panel p-5">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-bold">
                <CalendarDays className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                Pickup schedule
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="grid gap-2 text-sm font-semibold">
                  Date
                  <input
                    type="date"
                    value={form.pickupDate}
                    onChange={updateForm("pickupDate")}
                    className="studio-input"
                  />
                </label>
                <label className="grid gap-2 text-sm font-semibold">
                  Time
                  <span className="relative">
                    <Clock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                      type="time"
                      value={form.pickupTime}
                      onChange={updateForm("pickupTime")}
                      className="studio-input pl-10"
                    />
                  </span>
                </label>
                <label className="grid gap-2 text-sm font-semibold md:col-span-2">
                  Notes
                  <input
                    value={form.notes}
                    onChange={updateForm("notes")}
                    className="studio-input"
                    placeholder="Stain details, gate code, delivery preference"
                  />
                </label>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Link
                href="/services"
                className="studio-secondary-button"
              >
                Choose from services
              </Link>
              <button
                type="submit"
                disabled={!canSubmit}
                className="studio-button disabled:bg-gray-400"
              >
                Place order
              </button>
            </div>
          </form>
        </section>

        <aside className="studio-panel h-fit p-5 lg:sticky lg:top-28">
          <h2 className="text-lg font-black">Order summary</h2>
          <div className="mt-5 space-y-3">
            {selectedServices.length ? (
              selectedServices.map((service) => (
                <div key={service.id} className="rounded-md border border-gray-200 p-3 dark:border-slate-800">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-bold">{service.name}</p>
                      <p className="mt-1 text-xs text-gray-500 dark:text-slate-400">Rs. {service.price} x {quantities[service.id] || 1}</p>
                    </div>
                    <p className="font-black">Rs. {service.price * (quantities[service.id] || 1)}</p>
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => updateQuantity(service.id, "down")}
                      className="grid h-8 w-8 place-items-center rounded-md border border-gray-200 hover:bg-gray-100 dark:border-slate-700 dark:hover:bg-slate-800"
                      aria-label={`Decrease ${service.name} quantity`}
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="min-w-8 text-center text-sm font-black">{quantities[service.id] || 1}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(service.id, "up")}
                      className="grid h-8 w-8 place-items-center rounded-md border border-gray-200 hover:bg-gray-100 dark:border-slate-700 dark:hover:bg-slate-800"
                      aria-label={`Increase ${service.name} quantity`}
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="rounded-md border border-dashed border-gray-300 p-4 text-sm text-gray-500 dark:border-slate-700 dark:text-slate-400">
                Select at least one service to build the order.
              </p>
            )}
          </div>

          <div className="mt-5 border-t border-gray-200 pt-5 dark:border-slate-800">
            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-slate-400">
              <span>Estimated total</span>
              <span>{selectedServices.length} service{selectedServices.length === 1 ? "" : "s"}</span>
            </div>
            <div className="mt-2 text-3xl font-black text-teal-700 dark:text-teal-300">Rs. {estimatedTotal}</div>
          </div>

          {submittedOrder && (
            <div className="mt-5 rounded-md border border-teal-200 bg-teal-50 p-4 text-sm text-teal-900 dark:border-teal-500/30 dark:bg-teal-500/10 dark:text-teal-100">
              <p className="font-black">Order received</p>
              <p className="mt-1">Reference: {submittedOrder}</p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
