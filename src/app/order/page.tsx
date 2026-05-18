"use client";

import { useMemo, useState, useEffect, useRef, useCallback, type ChangeEvent, type FormEvent } from "react";
import Link from "next/link";
import {
  CalendarDays, CheckCircle2, ChevronRight, ChevronLeft, Clock,
  ClipboardList, CreditCard, Loader2, MapPin, Minus, PackageCheck, Phone, Plus, User, Hourglass,
} from "lucide-react";
import { useServices } from "@/hooks/useServices";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { supabase } from "@/lib/supabaseClient";

type OrderForm = {
  name: string; phone: string; address: string;
  pickupDate: string; pickupTime: string; notes: string;
};
const INIT: OrderForm = { name: "", phone: "", address: "", pickupDate: "", pickupTime: "", notes: "" };

type PlacedOrder = {
  id: string;
  status: string;
  customer_name: string;
  pickup_address: string;
  estimated_total: number;
  order_items: { id: string; name: string; price: number; quantity: number }[];
};

// ── Custom Date Picker ────────────────────────────────────────
const DAYS = ["Su","Mo","Tu","We","Th","Fr","Sa"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

function DatePicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const today = new Date(); today.setHours(0,0,0,0);
  const parsed = value ? new Date(value + "T00:00:00") : null;
  const [open, setOpen] = useState(false);
  const [view, setView] = useState(() => {
    const d = parsed ?? today;
    return { year: d.getFullYear(), month: d.getMonth() };
  });
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const firstDay = new Date(view.year, view.month, 1).getDay();
  const daysInMonth = new Date(view.year, view.month + 1, 0).getDate();

  const select = (day: number) => {
    const d = new Date(view.year, view.month, day);
    const iso = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
    onChange(iso);
    setOpen(false);
  };

  const prevMonth = () => setView(v => v.month === 0 ? { year: v.year-1, month: 11 } : { ...v, month: v.month-1 });
  const nextMonth = () => setView(v => v.month === 11 ? { year: v.year+1, month: 0 } : { ...v, month: v.month+1 });

  const displayVal = parsed
    ? parsed.toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" })
    : "Select date";

  return (
    <div ref={ref} style={{ position:"relative" }}>
      <button type="button" onClick={() => setOpen(v => !v)}
        style={{
          display:"flex", alignItems:"center", gap:10, width:"100%", minHeight:48,
          padding:"0 14px", border:`1.5px solid ${open ? "#14b8a6" : "rgba(148,163,184,0.35)"}`,
          borderRadius:10, background: open ? "rgba(20,184,166,0.06)" : "rgba(255,255,255,0.62)",
          color: parsed ? "var(--color-text-primary)" : "var(--color-text-muted)",
          fontWeight: parsed ? 700 : 400, fontSize:"0.95rem", cursor:"pointer",
          boxShadow: open ? "0 0 0 4px rgba(20,184,166,0.14)" : "none",
          transition:"all 160ms ease",
        }}>
        <CalendarDays size={16} style={{ color:"#14b8a6", flexShrink:0 }} />
        {displayVal}
      </button>

      {open && (
        <div style={{
          position:"absolute", top:"calc(100% + 8px)", left:0, zIndex:50,
          width:"min(300px, calc(100vw - 32px))",
          background:"var(--color-background-primary)", border:"1px solid rgba(148,163,184,0.25)",
          borderRadius:14, boxShadow:"0 20px 60px rgba(0,0,0,0.15)", padding:16,
        }}>
          {/* header */}
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
            <button type="button" onClick={prevMonth} style={{ padding:6, borderRadius:8, border:"none",
              background:"rgba(148,163,184,0.1)", cursor:"pointer", color:"var(--color-text-primary)" }}>
              <ChevronLeft size={16} />
            </button>
            <span style={{ fontWeight:800, fontSize:"0.95rem", color:"var(--color-text-primary)" }}>
              {MONTHS[view.month]} {view.year}
            </span>
            <button type="button" onClick={nextMonth} style={{ padding:6, borderRadius:8, border:"none",
              background:"rgba(148,163,184,0.1)", cursor:"pointer", color:"var(--color-text-primary)" }}>
              <ChevronRight size={16} />
            </button>
          </div>
          {/* day headers */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:2, marginBottom:4 }}>
            {DAYS.map(d => (
              <div key={d} style={{ textAlign:"center", fontSize:"0.72rem", fontWeight:900,
                color:"var(--color-text-muted)", padding:"4px 0" }}>{d}</div>
            ))}
          </div>
          {/* days grid */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:2 }}>
            {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const thisDate = new Date(view.year, view.month, day);
              const isPast = thisDate < today;
              const isSelected = parsed &&
                parsed.getFullYear() === view.year &&
                parsed.getMonth() === view.month &&
                parsed.getDate() === day;
              const isToday = thisDate.getTime() === today.getTime();
              return (
                <button key={day} type="button" disabled={isPast} onClick={() => select(day)}
                  style={{
                    padding:"7px 0", borderRadius:8, border:"none", fontSize:"0.85rem", fontWeight:600,
                    cursor: isPast ? "not-allowed" : "pointer",
                    background: isSelected ? "#14b8a6" : isToday ? "rgba(20,184,166,0.12)" : "transparent",
                    color: isSelected ? "white" : isPast ? "rgba(148,163,184,0.4)" : "var(--color-text-primary)",
                    outline: isToday && !isSelected ? "1.5px solid #14b8a6" : "none",
                    transition:"background 120ms ease",
                  }}>
                  {day}
                </button>
              );
            })}
          </div>
          {value && (
            <button type="button" onClick={() => { onChange(""); setOpen(false); }}
              style={{ marginTop:10, width:"100%", padding:"7px 0", borderRadius:8, border:"none",
                background:"rgba(239,68,68,0.08)", color:"#ef4444", fontSize:"0.8rem",
                fontWeight:700, cursor:"pointer" }}>
              Clear date
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ── Custom Time Picker ────────────────────────────────────────

// Convert "3:30 PM" → "15:30" for storage
function to24h(slot: string): string {
  const isPM = slot.includes("PM");
  const isAM = slot.includes("AM");
  const clean = slot.replace(/\s?(AM|PM)/i, "").trim();
  const [hStr, mStr] = clean.split(":");
  let h = parseInt(hStr, 10);
  const m = mStr ?? "00";
  if (isPM && h !== 12) h += 12;
  if (isAM && h === 12) h = 0;
  // For slots without AM/PM, treat < 6 as PM (afternoon)
  if (!isPM && !isAM && h < 6) h += 12;
  return `${String(h).padStart(2,"0")}:${m}`;
}

// Convert "15:30" → "3:30 PM"
function to12h(val: string): string {
  if (!val) return "";
  const [hStr, mStr] = val.split(":");
  let h = parseInt(hStr, 10);
  const m = mStr ?? "00";
  const period = h >= 12 ? "PM" : "AM";
  if (h > 12) h -= 12;
  if (h === 0) h = 12;
  return `${h}:${m} ${period}`;
}

function TimePicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const display = value ? to12h(value) : "Select time";

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const amSlots = ["9:00","9:30","10:00","10:30","11:00","11:30"];
  const pmSlots = ["12:00","12:30","1:00","1:30","2:00","2:30","3:00","3:30","4:00","4:30","5:00","5:30","6:00","6:30","7:00","7:30","8:00","8:30","9:00","9:30","10:00"];

  return (
    <div ref={ref} style={{ position:"relative" }}>
      <button type="button" onClick={() => setOpen(v => !v)}
        style={{
          display:"flex", alignItems:"center", gap:10, width:"100%", minHeight:48,
          padding:"0 14px", border:`1.5px solid ${open ? "#14b8a6" : "rgba(148,163,184,0.35)"}`,
          borderRadius:10, background: open ? "rgba(20,184,166,0.06)" : "rgba(255,255,255,0.62)",
          color: value ? "var(--color-text-primary)" : "var(--color-text-muted)",
          fontWeight: value ? 700 : 400, fontSize:"0.95rem", cursor:"pointer",
          boxShadow: open ? "0 0 0 4px rgba(20,184,166,0.14)" : "none",
          transition:"all 160ms ease",
        }}>
        <Clock size={16} style={{ color:"#14b8a6", flexShrink:0 }} />
        {display}
      </button>

      {open && (
        <div style={{
          position:"absolute", top:"calc(100% + 8px)", left:0, zIndex:50,
          width:"min(260px, calc(100vw - 32px))",
          background:"var(--color-background-primary)", border:"1px solid rgba(148,163,184,0.25)",
          borderRadius:14, boxShadow:"0 20px 60px rgba(0,0,0,0.15)", padding:12, maxHeight:320, overflowY:"auto",
        }}>
          {/* AM section */}
          <p style={{ fontSize:"0.7rem", fontWeight:900, textTransform:"uppercase",
            color:"var(--color-text-muted)", letterSpacing:"0.08em", padding:"4px 8px 8px" }}>Morning (AM)</p>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:4, marginBottom:12 }}>
            {amSlots.map(slot => {
              const [hStr, mStr] = slot.split(":");
              const val24 = `${String(parseInt(hStr)).padStart(2,"0")}:${mStr}`;
              const isSelected = value === val24;
              return (
                <button key={slot} type="button" onClick={() => { onChange(val24); setOpen(false); }}
                  style={{
                    padding:"8px 4px", borderRadius:8, border:"none", fontSize:"0.82rem", fontWeight:700,
                    cursor:"pointer", textAlign:"center",
                    background: isSelected ? "#14b8a6" : "rgba(148,163,184,0.08)",
                    color: isSelected ? "white" : "var(--color-text-primary)",
                    transition:"background 120ms ease",
                  }}>
                  {slot} AM
                </button>
              );
            })}
          </div>
          {/* PM section */}
          <p style={{ fontSize:"0.7rem", fontWeight:900, textTransform:"uppercase",
            color:"var(--color-text-muted)", letterSpacing:"0.08em", padding:"4px 8px 8px",
            borderTop:"1px solid rgba(148,163,184,0.15)", paddingTop:12 }}>Afternoon / Evening (PM)</p>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:4 }}>
            {pmSlots.map(slot => {
              const [hStr, mStr] = slot.split(":");
              let h = parseInt(hStr);
              if (h !== 12) h += 12;
              const val24 = `${String(h).padStart(2,"0")}:${mStr}`;
              const isSelected = value === val24;
              const displaySlot = `${hStr}:${mStr} PM`;
              return (
                <button key={val24} type="button" onClick={() => { onChange(val24); setOpen(false); }}
                  style={{
                    padding:"8px 4px", borderRadius:8, border:"none", fontSize:"0.82rem", fontWeight:700,
                    cursor:"pointer", textAlign:"center",
                    background: isSelected ? "#14b8a6" : "rgba(148,163,184,0.08)",
                    color: isSelected ? "white" : "var(--color-text-primary)",
                    transition:"background 120ms ease",
                  }}>
                  {displaySlot}
                </button>
              );
            })}
          </div>
          {value && (
            <button type="button" onClick={() => { onChange(""); setOpen(false); }}
              style={{ marginTop:10, width:"100%", padding:"7px 0", borderRadius:8, border:"none",
                background:"rgba(239,68,68,0.08)", color:"#ef4444", fontSize:"0.8rem",
                fontWeight:700, cursor:"pointer" }}>
              Clear time
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function readStoredIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = sessionStorage.getItem("selected_services");
    const arr = raw ? (JSON.parse(raw) as unknown) : [];
    if (!Array.isArray(arr)) return [];
    return arr
      .map((s) => (typeof s === "object" && s && "id" in s ? (s as { id: string }).id : ""))
      .filter(Boolean);
  } catch { return []; }
}

// ── Waiting screen ────────────────────────────────────────────
function WaitingScreen({ orderId, onApproved }: { orderId: string; onApproved: (order: PlacedOrder) => void }) {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const poll = async () => {
      try {
        const res = await fetch(`/api/orders/${orderId}`);
        if (!res.ok) return;
        const data = await res.json() as PlacedOrder;
        if (data.status && data.status !== "Order received") {
          if (intervalRef.current) clearInterval(intervalRef.current);
          onApproved(data);
        }
      } catch { /* ignore network blips */ }
    };
    poll();
    intervalRef.current = setInterval(poll, 5000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [orderId, onApproved]);

  return (
    <div className="gz-page">
      <div className="gz-blob gz-blob-a" />
      <div className="gz-blob gz-blob-b" />
      <div className="gz-shell" style={{ display:"flex", alignItems:"center", justifyContent:"center", minHeight:"70vh" }}>
        <div className="gz-panel" style={{ maxWidth:480, width:"100%", padding:"48px 36px", textAlign:"center" }}>
          <div style={{ width:72, height:72, borderRadius:"999px", background:"rgba(20,184,166,0.12)",
            display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 24px" }}>
            <Hourglass size={32} style={{ color:"#14b8a6" }} />
          </div>
          <h2 style={{ fontSize:"1.8rem", fontWeight:900, color:"var(--color-text-primary)", marginBottom:8 }}>
            Order placed!
          </h2>
          <p style={{ color:"var(--color-text-muted)", marginBottom:24, lineHeight:1.7 }}>
            Your order <strong style={{ color:"var(--color-text-primary)" }}>{orderId}</strong> has been received.
            <br />Waiting for admin approval…
          </p>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center",
            gap:8, color:"var(--color-text-muted)", fontSize:"0.85rem" }}>
            <Loader2 size={14} className="gz-spin" />
            Checking every 5 seconds
          </div>
          <p style={{ marginTop:28, fontSize:"0.8rem", color:"var(--color-text-muted)" }}>
            You can also track your order at{" "}
            <Link href={`/track?id=${orderId}`} style={{ color:"#14b8a6", fontWeight:700 }}>/track</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Confirmation screen ───────────────────────────────────────
function ConfirmationScreen({ order }: { order: PlacedOrder }) {
  return (
    <div className="gz-page">
      <div className="gz-blob gz-blob-a" />
      <div className="gz-blob gz-blob-b" />
      <div className="gz-shell" style={{ display:"flex", alignItems:"center", justifyContent:"center", minHeight:"70vh" }}>
        <div className="gz-panel" style={{ maxWidth:520, width:"100%", padding:"48px 36px" }}>
          <div style={{ width:72, height:72, borderRadius:"999px", background:"rgba(20,184,166,0.15)",
            display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 24px" }}>
            <CheckCircle2 size={36} style={{ color:"#14b8a6" }} />
          </div>
          <h2 style={{ textAlign:"center", fontSize:"1.8rem", fontWeight:900,
            color:"var(--color-text-primary)", marginBottom:6 }}>Order Approved!</h2>
          <p style={{ textAlign:"center", color:"var(--color-text-muted)", marginBottom:32, fontSize:"0.95rem" }}>
            Your laundry pickup has been confirmed by our team.
          </p>

          <div style={{ border:"1px solid rgba(148,163,184,0.2)", borderRadius:10, overflow:"hidden", marginBottom:24 }}>
            {/* order id + status */}
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
              padding:"14px 18px", borderBottom:"1px solid rgba(148,163,184,0.15)", background:"rgba(20,184,166,0.06)" }}>
              <span style={{ fontFamily:"monospace", fontWeight:700, color:"var(--color-text-primary)" }}>{order.id}</span>
              <span style={{ padding:"4px 12px", borderRadius:999, fontSize:"0.75rem", fontWeight:700,
                background:"rgba(20,184,166,0.15)", color:"#0f766e" }}>{order.status}</span>
            </div>
            {/* customer + address */}
            <div style={{ padding:"14px 18px", borderBottom:"1px solid rgba(148,163,184,0.15)" }}>
              <p style={{ margin:0, fontWeight:700, color:"var(--color-text-primary)" }}>{order.customer_name}</p>
              <p style={{ margin:"4px 0 0", fontSize:"0.85rem", color:"var(--color-text-muted)",
                display:"flex", gap:6, alignItems:"flex-start" }}>
                <MapPin size={13} style={{ marginTop:2, flexShrink:0, color:"#14b8a6" }} />
                {order.pickup_address}
              </p>
            </div>
            {/* services */}
            <div style={{ padding:"14px 18px" }}>
              <p style={{ margin:"0 0 10px", fontSize:"0.75rem", fontWeight:900,
                textTransform:"uppercase", color:"var(--color-text-muted)", letterSpacing:"0.05em" }}>Services</p>
              {order.order_items?.map((item) => (
                <div key={item.id} style={{ display:"flex", justifyContent:"space-between",
                  padding:"6px 0", fontSize:"0.9rem", borderBottom:"1px solid rgba(148,163,184,0.1)" }}>
                  <span style={{ color:"var(--color-text-primary)" }}>
                    {item.name}{item.quantity > 1 ? ` ×${item.quantity}` : ""}
                  </span>
                  <span style={{ fontWeight:700, color:"#0f766e" }}>₹{item.price * item.quantity}</span>
                </div>
              ))}
              <div style={{ display:"flex", justifyContent:"space-between", paddingTop:12,
                fontWeight:900, color:"var(--color-text-primary)", fontSize:"1rem" }}>
                <span>Total</span>
                <span style={{ color:"#0f766e" }}>₹{order.estimated_total}</span>
              </div>
            </div>
          </div>

          <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
            <Link href={`/track?id=${order.id}`} className="gz-cta-btn" style={{ flex:1, justifyContent:"center" }}>
              Track order <ChevronRight size={15} />
            </Link>
            <Link href="/order" className="gz-ghost-btn" style={{ flex:1, justifyContent:"center" }}>
              New order
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main order page ───────────────────────────────────────────
export default function OrderPage() {
  const { checked } = useRequireAuth();
  const { services } = useServices();
  const [ids,        setIds]        = useState<string[]>(() => readStoredIds());
  const [qty,        setQty]        = useState<Record<string, number>>(() =>
    Object.fromEntries(readStoredIds().map((id) => [id, 1])));
  const [form,       setForm]       = useState<OrderForm>(INIT);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // screens: "form" | "waiting" | "confirmed"
  const [screen,        setScreen]        = useState<"form" | "waiting" | "confirmed">("form");
  const [placedId,      setPlacedId]      = useState<string | null>(null);
  const [approvedOrder, setApprovedOrder] = useState<PlacedOrder | null>(null);

  const picked = useMemo(() => services.filter((s) => ids.includes(s.id)), [ids, services]);
  const total  = useMemo(() => picked.reduce((n, s) => n + s.price * (qty[s.id] || 1), 0), [picked, qty]);

  const ok = picked.length > 0 && form.name.trim().length > 1 &&
    form.phone.trim().length > 6 && form.address.trim().length > 6;

  const upd = (f: keyof OrderForm) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((c) => ({ ...c, [f]: e.target.value }));

  const toggleSvc = (id: string) => {
    setIds((c) => c.includes(id) ? c.filter((x) => x !== id) : [...c, id]);
    setQty((c) => ({ ...c, [id]: c[id] || 1 }));
  };

  const changeQty = (id: string, dir: "up" | "down") =>
    setQty((c) => ({ ...c, [id]: dir === "up" ? (c[id] || 1) + 1 : Math.max(1, (c[id] || 1) - 1) }));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!ok || submitting) return;
    setSubmitting(true);
    setSubmitError(null);

    const id = `FW-${Date.now().toString().slice(-6)}`;
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;

    const payload = {
      id,
      customer_name: form.name.trim(),
      customer_phone: form.phone.trim(),
      pickup_address: form.address.trim(),
      pickup_date: form.pickupDate || undefined,
      pickup_time: form.pickupTime || undefined,
      notes: form.notes.trim() || undefined,
      estimated_total: total,
      items: picked.map((s) => ({ service_id: s.id, name: s.name, price: s.price, quantity: qty[s.id] || 1 })),
    };

    try {
      // Step 1: Save order to DB
      const orderRes = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify(payload),
      });
      if (!orderRes.ok) {
        const err = await orderRes.json() as { error?: string };
        throw new Error(err.error ?? "Failed to place order");
      }

      // Step 2: Create Razorpay order
      const rzpRes = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: total, orderId: id }),
      });
      if (!rzpRes.ok) {
        const err = await rzpRes.json() as { error?: string };
        throw new Error(err.error ?? "Failed to initiate payment");
      }
      const { razorpayOrderId, amount: rzpAmount, currency } = await rzpRes.json() as {
        razorpayOrderId: string; amount: number; currency: string;
      };

      // Step 3: Open Razorpay checkout
      await new Promise<void>((resolve, reject) => {
        const rzpKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? "rzp_test_Sqnq736i26gVbV";
        const options = {
          key:         rzpKey,
          amount:      rzpAmount,
          currency,
          name:        "FreshWash",
          description: `Order ${id}`,
          order_id:    razorpayOrderId,
          prefill: {
            name:    form.name.trim(),
            contact: form.phone.trim(),
          },
          theme: { color: "#14b8a6" },
          handler: async (response: {
            razorpay_order_id: string;
            razorpay_payment_id: string;
            razorpay_signature: string;
          }) => {
            try {
              // Step 4: Verify payment server-side
              const verifyRes = await fetch("/api/payment/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...response, orderId: id }),
              });
              if (!verifyRes.ok) {
                const err = await verifyRes.json() as { error?: string };
                reject(new Error(err.error ?? "Payment verification failed"));
                return;
              }
              resolve();
            } catch (err) {
              reject(err);
            }
          },
          modal: {
            ondismiss: () => reject(new Error("Payment cancelled. Your order has been saved — you can retry payment from the track page.")),
          },
        };

        if (typeof window !== "undefined") {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const rzp = new (window as any).Razorpay(options);

          // Handle payment failure event
          rzp.on("payment.failed", (response: { error: { description: string; reason: string } }) => {
            reject(new Error(`Payment failed: ${response.error.description ?? response.error.reason ?? "Unknown error"}`));
          });

          rzp.open();
        } else {
          reject(new Error("Razorpay is not available"));
        }
      });

      // Step 5: Save to localStorage and show waiting screen
      try {
        localStorage.setItem("last_order", JSON.stringify({
          id, customer: { name: form.name.trim(), phone: form.phone.trim() },
          pickup: { address: form.address.trim(), date: form.pickupDate, time: form.pickupTime },
          notes: form.notes.trim(), estimatedTotal: total, status: "Order received",
          createdAt: new Date().toISOString(),
        }));
      } catch { /* ignore */ }

      setPlacedId(id);
      setScreen("waiting");
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const handleApproved = (order: PlacedOrder) => { setApprovedOrder(order); setScreen("confirmed"); };

  if (screen === "waiting" && placedId)
    return <WaitingScreen orderId={placedId} onApproved={handleApproved} />;
  if (screen === "confirmed" && approvedOrder)
    return <ConfirmationScreen order={approvedOrder} />;

  // Still checking auth — render nothing to avoid flash
  if (!checked) return null;

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
          <form onSubmit={submit} className="gz-order-form">
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

            <div className="gz-panel">
              <h2 className="gz-panel-title"><PackageCheck size={16} /> Services</h2>
              <div className="gz-svc-pick-grid">
                {services.map((s) => {
                  const on = ids.includes(s.id);
                  return (
                    <button key={s.id} type="button" onClick={() => toggleSvc(s.id)} aria-pressed={on}
                      className={`gz-svc-pick ${on ? "gz-svc-pick--on" : ""}`}>
                      <span className="gz-svc-pick-name">{s.name}</span>
                      <span className="gz-svc-pick-price">₹{s.price}</span>
                      {on && <CheckCircle2 size={14} className="gz-svc-pick-check" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="gz-panel">
              <h2 className="gz-panel-title">
                <CalendarDays size={16} /> Pickup schedule
                <span style={{ fontWeight:400, fontSize:"0.8rem", opacity:0.6, marginLeft:6 }}>(optional)</span>
              </h2>
              <div className="gz-grid-2">
                <label className="gz-label">Date
                  <DatePicker value={form.pickupDate} onChange={(v) => setForm(c => ({ ...c, pickupDate: v }))} />
                </label>
                <label className="gz-label">Time
                  <TimePicker value={form.pickupTime} onChange={(v) => setForm(c => ({ ...c, pickupTime: v }))} />
                </label>
                <label className="gz-label gz-col-2">Notes
                  <input value={form.notes} onChange={upd("notes")} className="gz-input" placeholder="Gate code, stain details…" />
                </label>
              </div>
            </div>

            {submitError && (
              <p className="gz-panel" style={{ color:"#ff6b6b", fontSize:"0.85rem", padding:"12px 16px" }}>
                {submitError}
              </p>
            )}

            <div className="gz-form-actions">
              <Link href="/services" className="gz-ghost-btn">← Browse services</Link>
              <button type="submit" disabled={!ok || submitting} className="gz-cta-btn">
                {submitting ? <><Loader2 size={15} className="gz-spin" /> Processing…</> : <><CreditCard size={15} /> Pay & Place order</>}
              </button>
            </div>
          </form>

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
                      <p className="gz-summary-svc-unit">₹{s.price} × {qty[s.id] || 1}</p>
                    </div>
                    <div className="gz-qty-ctrl">
                      <button type="button" onClick={() => changeQty(s.id, "down")} className="gz-qty-btn" aria-label="decrease"><Minus size={12} /></button>
                      <span className="gz-qty-val">{qty[s.id] || 1}</span>
                      <button type="button" onClick={() => changeQty(s.id, "up")} className="gz-qty-btn" aria-label="increase"><Plus size={12} /></button>
                    </div>
                    <span className="gz-summary-svc-total">₹{s.price * (qty[s.id] || 1)}</span>
                  </div>
                ))}
              </div>
            )}
            <div className="gz-summary-total-row">
              <span>Estimated total</span>
              <span className="gz-summary-total-val">₹{total}</span>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
