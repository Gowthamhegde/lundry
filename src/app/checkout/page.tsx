"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, CalendarClock, CheckCircle2, MapPin, PackageCheck, Phone, User } from "lucide-react";

type SelectedService = {
  id: string;
  name: string;
  price: number;
  category?: string;
};

function isSelectedService(value: unknown): value is SelectedService {
  if (typeof value !== "object" || value === null) return false;
  const service = value as Partial<SelectedService>;
  return typeof service.id === "string" && typeof service.name === "string" && typeof service.price === "number";
}

function readSelectedServices() {
  try {
    const raw = sessionStorage.getItem("selected_services");
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter(isSelectedService) : [];
  } catch (error) {
    console.warn("Could not read selected services", error);
    return [];
  }
}

export default function CheckoutPage() {
  const router = useRouter();
  const [selectedServices, setSelectedServices] = useState<SelectedService[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [notes, setNotes] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    queueMicrotask(() => setSelectedServices(readSelectedServices()));
  }, []);

  const total = useMemo(() => selectedServices.reduce((sum, service) => sum + service.price, 0), [selectedServices]);
  const canSubmit = name.trim() && phone.trim() && address.trim() && city.trim() && selectedServices.length > 0;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit) return;

    const payload = {
      customer: { name: name.trim(), phone: phone.trim() },
      address: { address: address.trim(), city: city.trim(), pincode: pincode.trim() },
      notes: notes.trim(),
      services: selectedServices,
      estimatedTotal: total,
      createdAt: new Date().toISOString(),
    };

    try {
      localStorage.setItem("last_order", JSON.stringify(payload));
    } catch (error) {
      console.warn("Could not save checkout payload", error);
    }

    setSaved(true);
  };

  return (
    <div className="studio-page">
      <div className="studio-shell grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        <section>
          <p className="studio-kicker">
            <CalendarClock className="h-4 w-4" />
            Checkout
          </p>
          <h1 className="studio-title">Confirm pickup details</h1>
          <p className="studio-copy">
            This legacy checkout path still works beautifully: review the chosen services, add contact details, and save the order.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div className="studio-panel p-5">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-black text-[var(--color-text-primary)]">
                <User className="h-5 w-5 text-teal-500" />
                Contact
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="grid gap-2 text-sm font-bold text-[var(--color-text-primary)]">
                  Full name
                  <input value={name} onChange={(event) => setName(event.target.value)} className="studio-input" placeholder="Customer name" />
                </label>
                <label className="grid gap-2 text-sm font-bold text-[var(--color-text-primary)]">
                  Phone
                  <span className="relative">
                    <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input value={phone} onChange={(event) => setPhone(event.target.value)} className="studio-input pl-10" placeholder="+91 98765 43210" />
                  </span>
                </label>
              </div>
            </div>

            <div className="studio-panel p-5">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-black text-[var(--color-text-primary)]">
                <MapPin className="h-5 w-5 text-teal-500" />
                Address
              </h2>
              <div className="grid gap-4">
                <textarea value={address} onChange={(event) => setAddress(event.target.value)} className="studio-input min-h-28 py-3" placeholder="House number, street, landmark" />
                <div className="grid gap-4 md:grid-cols-2">
                  <input value={city} onChange={(event) => setCity(event.target.value)} className="studio-input" placeholder="City" />
                  <input value={pincode} onChange={(event) => setPincode(event.target.value)} className="studio-input" placeholder="Pincode" />
                </div>
                <input value={notes} onChange={(event) => setNotes(event.target.value)} className="studio-input" placeholder="Additional notes" />
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button type="button" onClick={() => router.push("/services")} className="studio-secondary-button">
                Back to services
              </button>
              <button type="submit" disabled={!canSubmit} className="studio-button disabled:bg-gray-400">
                Place order <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </form>
        </section>

        <aside className="studio-panel h-fit p-5 lg:sticky lg:top-28">
          <h2 className="flex items-center gap-2 text-lg font-black text-[var(--color-text-primary)]">
            <PackageCheck className="h-5 w-5 text-teal-500" />
            Selected services
          </h2>
          <div className="mt-5 space-y-3">
            {selectedServices.length === 0 ? (
              <div className="rounded-lg border border-dashed border-slate-300 p-4 text-sm text-[var(--color-text-muted)] dark:border-slate-700">
                No services selected.{" "}
                <Link href="/services" className="font-black text-teal-600 dark:text-teal-300">
                  Choose services
                </Link>
              </div>
            ) : (
              selectedServices.map((service) => (
                <div key={service.id} className="flex items-center justify-between gap-4 border-b border-slate-200 pb-3 text-sm dark:border-slate-800">
                  <span className="font-bold text-[var(--color-text-primary)]">{service.name}</span>
                  <span className="rounded-full bg-teal-500/12 px-3 py-1 font-black text-teal-700 dark:text-teal-300">Rs. {service.price}</span>
                </div>
              ))
            )}
          </div>
          <div className="mt-5 flex items-end justify-between border-t border-slate-200 pt-5 dark:border-slate-800">
            <span className="text-sm font-bold text-[var(--color-text-muted)]">Estimated total</span>
            <strong className="text-3xl font-black text-teal-700 dark:text-teal-300">Rs. {total}</strong>
          </div>
          {saved ? (
            <div className="mt-5 rounded-lg border border-teal-300 bg-teal-500/10 p-4 text-sm text-[var(--color-text-primary)]">
              <p className="flex items-center gap-2 font-black">
                <CheckCircle2 className="h-5 w-5 text-teal-500" />
                Order saved
              </p>
              <p className="mt-1 text-[var(--color-text-muted)]">Your latest checkout has been stored locally.</p>
            </div>
          ) : null}
        </aside>
      </div>
    </div>
  );
}
