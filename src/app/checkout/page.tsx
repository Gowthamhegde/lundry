"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const router = useRouter();
  const [selectedServices, setSelectedServices] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("selected_services");
      if (raw) setSelectedServices(JSON.parse(raw));
    } catch (e) {
      console.warn("Could not read selected services", e);
    }
  }, []);

  const canSubmit = name.trim() && phone.trim() && address.trim() && city.trim();

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const payload = {
      customer: { name, phone },
      address: { address, city, pincode },
      notes,
      services: selectedServices,
    };
    // For now, just log and navigate to a simple confirmation or back to home
    console.log("Checkout payload:", payload);
    // Optionally store in localStorage
    try {
      localStorage.setItem("last_order", JSON.stringify(payload));
    } catch (err) {}
    router.push("/");
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-2 text-[var(--color-text-primary)]">Delivery & Contact Details</h1>
      <p className="text-sm text-[var(--color-text-muted)] mb-6">Enter your address and contact information to schedule pickup.</p>

      <div className="mb-6 bg-[var(--color-background-primary)] p-4 rounded-lg border border-[var(--color-border-tertiary)]">
        <h2 className="font-medium mb-2 text-[var(--color-text-primary)]">Selected services</h2>
        {selectedServices.length === 0 ? (
          <div className="text-sm text-[var(--color-text-muted)]">No services selected. <button className="text-[var(--accent)] underline" onClick={() => router.push('/services')}>Go back</button></div>
        ) : (
          <ul className="text-sm space-y-2">
            {selectedServices.map(s => (
              <li key={s.id} className="flex justify-between items-center">
                <span className="text-[var(--color-text-primary)]">{s.name}</span>
                <span className="price-pill">₹{s.price}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 bg-[var(--color-background-primary)] p-6 rounded-lg border border-[var(--color-border-tertiary)]">
        <div>
          <label className="block text-sm font-medium mb-1 text-[var(--color-text-primary)]">Full name</label>
          <input value={name} onChange={e => setName(e.target.value)} className="w-full px-3 py-2 rounded-md border border-[var(--color-border-tertiary)] bg-transparent text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]" placeholder="John Doe" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-[var(--color-text-primary)]">Phone</label>
          <input value={phone} onChange={e => setPhone(e.target.value)} className="w-full px-3 py-2 rounded-md border border-[var(--color-border-tertiary)] bg-transparent text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]" placeholder="+91 98765 43210" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-[var(--color-text-primary)]">Address</label>
          <textarea value={address} onChange={e => setAddress(e.target.value)} className="w-full px-3 py-2 rounded-md border border-[var(--color-border-tertiary)] bg-transparent text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]" rows={3} placeholder="House number, street, landmark" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1 text-[var(--color-text-primary)]">City</label>
            <input value={city} onChange={e => setCity(e.target.value)} className="w-full px-3 py-2 rounded-md border border-[var(--color-border-tertiary)] bg-transparent text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-[var(--color-text-primary)]">Pincode</label>
            <input value={pincode} onChange={e => setPincode(e.target.value)} className="w-full px-3 py-2 rounded-md border border-[var(--color-border-tertiary)] bg-transparent text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-[var(--color-text-primary)]">Additional notes</label>
          <input value={notes} onChange={e => setNotes(e.target.value)} className="w-full px-3 py-2 rounded-md border border-[var(--color-border-tertiary)] bg-transparent text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]" placeholder="E.g., ring the bell" />
        </div>

        <div className="flex justify-between items-center">
          <button type="button" onClick={() => router.push('/services')} className="px-4 py-2 rounded-md border border-[var(--color-border-tertiary)] text-[var(--color-text-primary)]">Back</button>
          <button type="submit" disabled={!canSubmit || selectedServices.length===0} className={`px-4 py-2 rounded-md text-white ${(!canSubmit || selectedServices.length===0) ? 'bg-gray-400 cursor-not-allowed' : 'bg-[var(--accent)]'}`}>
            Place Order
          </button>
        </div>
      </form>
    </div>
  );
}
