"use client";

import { useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import Link from "next/link";
import {
  CalendarDays, CheckCircle2, ChevronRight, Clock,
  ClipboardList, MapPin, Minus, PackageCheck, Phone, Plus, User,
} from "lucide-react";
import { useServices } from "@/hooks/useServices";

type OrderForm = {
  name: string; phone: string; address: string;
  pickupDate: string; pickupTime: string; notes: string;
};
const INIT: OrderForm = { name:"", phone:"", address:"", pickupDate:"", pickupTime:"", notes:"" };

function readStoredIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = sessionStorage.getItem("selected_services");
    const arr = raw ? (JSON.parse(raw) as unknown) : [];
    if (!Array.isArray(arr)) return [];
    return arr
      .map((s) => (typeof s === "object" && s && "id" in s ? (s as {id:string}).id : ""))
      .filter(Boolean);
  } catch { return []; }
}

export default function OrderPage() {
  const { services } = useServices();
  const [ids, setIds]   = useState<string[]>(() => readStoredIds());
  const [qty, setQty]   = useState<Record<string,number>>(() =>
    Object.fromEntries(readStoredIds().map((id) => [id, 1])));
  const [form, setForm] = useState<OrderForm>(INIT);
  const [orderId, setOrderId] = useState<string | null>(null);

  const picked = useMemo(() => services.filter((s) => ids.includes(s.id)), [ids, services]);
  const total  = useMemo(() => picked.reduce((n, s) => n + s.price * (qty[s.id] || 1), 0), [picked, qty]);

  const ok = picked.length > 0 && form.name.trim().length > 1 &&
    form.phone.trim().length > 6 && form.address.trim().length > 6 &&
    !!form.pickupDate && !!form.pickupTime;

  const upd = (f: keyof OrderForm) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((c) => ({ ...c, [f]: e.target.value }));

  const toggleSvc = (id: string) => {
    setOrderId(null);
    setIds((c) => c.includes(id) ? c.filter((x) => x !== id) : [...c, id]);
    setQty((c) => ({ ...c, [id]: c[id] || 1 }));
  };

  const changeQty = (id: string, dir: "up"|"down") =>
    setQty((c) => ({ ...c, [id]: dir === "up" ? (c[id]||1)+1 : Math.max(1,(c[id]||1)-1) }));

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!ok) return;
    const id = `FW-${Date.now().toString().slice(-6)}`;
    const order = {
      id, customer: { name: form.name.trim(), phone: form.phone.trim() },
      pickup: { address: form.address.trim(), date: form.pickupDate, time: form.pickupTime },
      notes: form.notes.trim(),
      services: picked.map((s) => ({ id: s.id, name: s.name, price: s.price, quantity: qty[s.id]||1 })),
      estimatedTotal: total, status: "Order received", createdAt: new Date().toISOString(),
    };
    try { localStorage.setItem("last_order", JSON.stringify(order)); } catch {}
    setOrderId(id);
  };

  return (
    <div className="gz-page">
      <div className="gz-blob gz-blob-a" />
      <div className="gz-blob gz-blob-b" />

      <div className="gz-shell">
        <header className="gz-page-header">
          <span className="gz-kicker"><ClipboardList size={13} /> New order</span>
          <h1 className="gz-title">Create your<br />laundry order.</h1>
          <p className="gz-subtitle">Fill in your details, pick services, and lock in a pickup slot.</p>
        </header>

        <div className="gz-order-layout">
          {/* ── left: form ── */}
          <form onSubmit={submit} className="gz-order-form">

            {/* customer */}
            <div className="gz-panel">
              <h2 className="gz-panel-title"><User size={16} /> Customer details</h2>
              <div className="gz-grid-2">
                <label className="gz-label">Full name
                  <input value={form.name} onChange={upd("name")} className="gz-input" placeholder="Your name" />
                </label>
                <label className="gz-label">Phone
                  <span className="gz-input-wrap">
                    <Phone size={15} className="gz-input-icon" />
                    <input value={form.phone} onChange={upd("phone")} className="gz-input gz-input-pl" placeholder="+91 98765 43210" />
                  </span>
                </label>
                <label className="gz-label gz-col-2">Pickup address
                  <span className="gz-input-wrap">
                    <MapPin size={15} className="gz-input-icon gz-input-icon-top" />
                    <textarea value={form.address} onChange={upd("address")} className="gz-input gz-textarea gz-input-pl" placeholder="House, street, landmark" />
                  </span>
                </label>
              </div>
            </div>

            {/* services */}
            <div className="gz-panel">
              <h2 className="gz-panel-title"><PackageCheck size={16} /> Services</h2>
              <div className="gz-svc-pick-grid">
                {services.map((s) => {
                  const on = ids.includes(s.id);
                  return (
                    <button key={s.id} type="button" onClick={() => toggleSvc(s.id)}
                      aria-pressed={on}
                      className={`gz-svc-pick ${on ? "gz-svc-pick--on" : ""}`}>
                      <span className="gz-svc-pick-name">{s.name}</span>
                      <span className="gz-svc-pick-price">₹{s.price}</span>
                      {on && <CheckCircle2 size={14} className="gz-svc-pick-check" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* schedule */}
            <div className="gz-panel">
              <h2 className="gz-panel-title"><CalendarDays size={16} /> Pickup schedule</h2>
              <div className="gz-grid-2">
                <label className="gz-label">Date
                  <input type="date" value={form.pickupDate} onChange={upd("pickupDate")} className="gz-input" />
                </label>
                <label className="gz-label">Time
                  <span className="gz-input-wrap">
                    <Clock size={15} className="gz-input-icon" />
                    <input type="time" value={form.pickupTime} onChange={upd("pickupTime")} className="gz-input gz-input-pl" />
                  </span>
                </label>
                <label className="gz-label gz-col-2">Notes
                  <input value={form.notes} onChange={upd("notes")} className="gz-input" placeholder="Gate code, stain details…" />
                </label>
              </div>
            </div>

            <div className="gz-form-actions">
              <Link href="/services" className="gz-ghost-btn">← Browse services</Link>
              <button type="submit" disabled={!ok} className="gz-cta-btn">Place order <ChevronRight size={16} /></button>
            </div>
          </form>

          {/* ── right: summary ── */}
          <aside className="gz-summary-panel">
            <h2 className="gz-summary-title">Order summary</h2>
            {picked.length === 0 ? (
              <p className="gz-summary-empty">Select services to build your order.</p>
            ) : (
              <div className="gz-summary-list">
                {picked.map((s) => (
                  <div key={s.id} className="gz-summary-row">
                    <div>
                      <p className="gz-summary-svc-name">{s.name}</p>
                      <p className="gz-summary-svc-unit">₹{s.price} × {qty[s.id]||1}</p>
                    </div>
                    <div className="gz-qty-ctrl">
                      <button type="button" onClick={() => changeQty(s.id,"down")} className="gz-qty-btn" aria-label="decrease"><Minus size={12}/></button>
                      <span className="gz-qty-val">{qty[s.id]||1}</span>
                      <button type="button" onClick={() => changeQty(s.id,"up")} className="gz-qty-btn" aria-label="increase"><Plus size={12}/></button>
                    </div>
                    <span className="gz-summary-svc-total">₹{s.price*(qty[s.id]||1)}</span>
                  </div>
                ))}
              </div>
            )}
            <div className="gz-summary-total-row">
              <span>Estimated total</span>
              <span className="gz-summary-total-val">₹{total}</span>
            </div>
            {orderId && (
              <div className="gz-order-success">
                <CheckCircle2 size={18} />
                <div>
                  <p className="gz-order-success-title">Order placed!</p>
                  <p className="gz-order-success-id">Ref: {orderId}</p>
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
