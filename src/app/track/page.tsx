"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  BadgeCheck, CheckCircle2, ChevronRight, Clock,
  LogIn, Package, PackageCheck, Search, Shirt, Truck,
} from "lucide-react";

type OrderService = { id: string; name: string; price: number; quantity?: number };
type Order = {
  id: string;
  customer?: { name?: string; phone?: string };
  pickup?: { address?: string; date?: string; time?: string };
  services?: OrderService[];
  estimatedTotal?: number;
  status?: string;
  createdAt?: string;
};

const PIPELINE = [
  { key: "Order received",   icon: Package,      label: "Received" },
  { key: "Picked up",        icon: Truck,        label: "Picked up" },
  { key: "Being cleaned",    icon: Shirt,        label: "Cleaning" },
  { key: "Out for delivery", icon: PackageCheck, label: "Delivery" },
  { key: "Delivered",        icon: BadgeCheck,   label: "Delivered" },
];

function stepIdx(status?: string) {
  const i = PIPELINE.findIndex((s) => s.key === status);
  return i === -1 ? 0 : i;
}

function readOrders(): Order[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem("last_order");
    if (!raw) return [];
    const p = JSON.parse(raw) as unknown;
    return Array.isArray(p) ? (p as Order[]) : [p as Order];
  } catch { return []; }
}

function fmtDate(iso?: string) {
  if (!iso) return "—";
  try {
    return new Intl.DateTimeFormat("en-IN", {
      day: "numeric", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    }).format(new Date(iso));
  } catch { return iso; }
}

function OrderCard({ order }: { order: Order }) {
  const idx = stepIdx(order.status);
  const pct = idx === 0 ? 0 : (idx / (PIPELINE.length - 1)) * 100;

  return (
    <div className="gz-track-card">
      {/* header */}
      <div className="gz-track-card-head">
        <div>
          <p className="gz-track-label">Order ID</p>
          <p className="gz-track-id">{order.id}</p>
          <p className="gz-track-date">Placed {fmtDate(order.createdAt)}</p>
        </div>
        <span className="gz-status-pill">
          <span className="gz-status-dot" />
          {order.status || "Order received"}
        </span>
      </div>

      {/* progress */}
      <div className="gz-progress-wrap">
        <div className="gz-progress-track">
          <div className="gz-progress-fill" style={{ width: `${pct}%` }} />
        </div>
        <div className="gz-progress-steps">
          {PIPELINE.map((step, i) => {
            const Icon = step.icon;
            const done = i <= idx;
            const active = i === idx;
            return (
              <div key={step.key} className="gz-progress-step">
                <div className={`gz-step-dot ${done ? "gz-step-dot--done" : ""} ${active ? "gz-step-dot--active" : ""}`}>
                  {done ? <CheckCircle2 size={14} /> : <Icon size={12} />}
                </div>
                <span className={`gz-step-label ${done ? "gz-step-label--done" : ""}`}>{step.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* details */}
      <div className="gz-track-details">
        {order.customer?.name && (
          <div className="gz-track-detail-box">
            <p className="gz-track-detail-title">Customer</p>
            <p className="gz-track-detail-val">{order.customer.name}</p>
            {order.customer.phone && <p className="gz-track-detail-sub">{order.customer.phone}</p>}
          </div>
        )}
        {order.pickup?.address && (
          <div className="gz-track-detail-box">
            <p className="gz-track-detail-title">Pickup address</p>
            <p className="gz-track-detail-val">{order.pickup.address}</p>
            {order.pickup.date && (
              <p className="gz-track-detail-sub">
                <Clock size={11} /> {order.pickup.date}{order.pickup.time ? ` at ${order.pickup.time}` : ""}
              </p>
            )}
          </div>
        )}
      </div>

      {/* services */}
      {order.services && order.services.length > 0 && (
        <div className="gz-track-services">
          <p className="gz-track-label">Services</p>
          {order.services.map((svc) => (
            <div key={svc.id} className="gz-track-svc-row">
              <span>{svc.name}{svc.quantity && svc.quantity > 1 ? ` ×${svc.quantity}` : ""}</span>
              <span className="gz-track-svc-price">₹{svc.price * (svc.quantity ?? 1)}</span>
            </div>
          ))}
          <div className="gz-track-total-row">
            <span>Total</span>
            <span className="gz-track-total-val">
              ₹{order.estimatedTotal ?? order.services.reduce((n, v) => n + v.price * (v.quantity ?? 1), 0)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TrackPage() {
  const searchParams = useSearchParams();
  const [orders,   setOrders]   = useState<Order[]>([]);
  const [query,    setQuery]    = useState(searchParams.get("id") ?? "");
  const [searched, setSearched] = useState(false);
  const [result,   setResult]   = useState<Order | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [mounted,  setMounted]  = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = readOrders();
    setOrders(stored);
    const pid = searchParams.get("id");
    if (pid && stored.length) {
      const found = stored.find((o) => o.id?.toLowerCase() === pid.toLowerCase());
      setResult(found ?? null);
      setNotFound(!found);
      setSearched(true);
    }
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    const found = orders.find((o) => o.id?.toLowerCase() === query.trim().toLowerCase());
    setResult(found ?? null);
    setNotFound(!found);
    setSearched(true);
  };

  return (
    <div className="gz-page">
      <div className="gz-blob gz-blob-a" />
      <div className="gz-blob gz-blob-b" />

      <div className="gz-shell gz-shell-narrow">
        <header className="gz-page-header">
          <span className="gz-kicker"><Search size={13} /> Order tracking</span>
          <h1 className="gz-title">Where&apos;s my laundry?</h1>
          <p className="gz-subtitle">Your orders are saved to this device after you place them.</p>
        </header>

        {/* search */}
        <form onSubmit={handleSearch} className="gz-track-search">
          <div className="gz-track-search-wrap">
            <Search size={16} className="gz-track-search-icon" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter order ID  e.g. FW-123456"
              className="gz-track-input"
              aria-label="Order ID"
            />
          </div>
          <button type="submit" className="gz-cta-btn">Track <ChevronRight size={15} /></button>
        </form>

        <div className="gz-track-results">
          {mounted && searched && result && <OrderCard order={result} />}

          {mounted && searched && notFound && (
            <div className="gz-empty-state">
              <div className="gz-empty-icon"><Search size={28} /></div>
              <h2 className="gz-empty-title">Order not found</h2>
              <p className="gz-empty-desc">No order matching <strong>{query}</strong> on this device.</p>
              <Link href="/order" className="gz-cta-btn">Place a new order <ChevronRight size={15} /></Link>
            </div>
          )}

          {mounted && !searched && orders.length > 0 && (
            <div className="gz-track-recent">
              <p className="gz-track-label" style={{marginBottom:"16px"}}>Your recent orders</p>
              {orders.map((o) => <OrderCard key={o.id} order={o} />)}
            </div>
          )}

          {mounted && !searched && orders.length === 0 && (
            <div className="gz-empty-state">
              <div className="gz-empty-icon"><Shirt size={28} /></div>
              <h2 className="gz-empty-title">No orders yet</h2>
              <p className="gz-empty-desc">Place an order and it will appear here automatically.</p>
              <div className="gz-empty-actions">
                <Link href="/order" className="gz-cta-btn">Place an order <ChevronRight size={15} /></Link>
                <Link href="/login" className="gz-ghost-btn"><LogIn size={15} /> Sign in</Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
