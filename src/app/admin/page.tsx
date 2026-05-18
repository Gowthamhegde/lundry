"use client";
export const dynamic = 'force-dynamic';

import { useEffect, useState, type FormEvent } from "react";
import {
  AlertCircle, BarChart3, Calendar, CheckCircle2, ChevronDown,
  Edit2, Loader2, Lock, LogOut, MapPin, Package, Phone,
  Plus, RefreshCw, Save, Settings, ShieldCheck,
  Sparkles, Trash2, User, X,
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { useServices } from "@/hooks/useServices";
import { useSiteConfig } from "@/hooks/useSiteConfig";
import { useOrders, type OrderWithItems } from "@/hooks/useOrders";
import type { Service, OrderStatus } from "@/lib/database.types";

type AdminTab = "overview" | "orders" | "services" | "site";
type ServiceForm = Omit<Service, "id" | "created_at" | "updated_at" | "active">;

const emptyService: ServiceForm = {
  name: "", description: "", price: 0,
  category: "Per piece", icon: "washing", badge: null, sort_order: 0,
};

const STATUS_OPTIONS: OrderStatus[] = [
  "Order received", "Picked up", "Being cleaned",
  "Out for delivery", "Delivered", "Cancelled",
];

const STATUS_COLORS: Record<OrderStatus, { bg: string; text: string; dot: string }> = {
  "Order received":   { bg: "rgba(59,130,246,0.12)",  text: "#60a5fa", dot: "#3b82f6" },
  "Picked up":        { bg: "rgba(234,179,8,0.12)",   text: "#facc15", dot: "#eab308" },
  "Being cleaned":    { bg: "rgba(168,85,247,0.12)",  text: "#c084fc", dot: "#a855f7" },
  "Out for delivery": { bg: "rgba(249,115,22,0.12)",  text: "#fb923c", dot: "#f97316" },
  "Delivered":        { bg: "rgba(20,184,166,0.12)",  text: "#2dd4bf", dot: "#14b8a6" },
  "Cancelled":        { bg: "rgba(239,68,68,0.12)",   text: "#f87171", dot: "#ef4444" },
};

// ── Order Detail Modal ────────────────────────────────────────
function OrderModal({
  order,
  onClose,
  onStatusChange,
}: {
  order: OrderWithItems;
  onClose: () => void;
  onStatusChange: (id: string, status: OrderStatus) => Promise<void>;
}) {
  const sc = STATUS_COLORS[order.status];
  const [saving, setSaving] = useState(false);

  const handleStatus = async (status: OrderStatus) => {
    setSaving(true);
    await onStatusChange(order.id, status);
    setSaving(false);
  };

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 100,
        background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "16px",
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%", maxWidth: 720, maxHeight: "90vh", overflowY: "auto",
          background: "var(--color-background-primary)",
          border: "1px solid rgba(148,163,184,0.2)",
          borderRadius: 20, padding: "36px 32px",
          boxShadow: "0 40px 120px rgba(0,0,0,0.5)",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28 }}>
          <div>
            <p style={{ fontSize: "0.75rem", fontWeight: 900, textTransform: "uppercase",
              letterSpacing: "0.1em", color: "var(--color-text-muted)", marginBottom: 6 }}>Order details</p>
            <h2 style={{ fontSize: "2.2rem", fontWeight: 900, color: "var(--color-text-primary)",
              fontFamily: "monospace", margin: 0 }}>{order.id}</h2>
            <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", marginTop: 4 }}>
              Placed on {new Date(order.created_at).toLocaleString("en-IN", {
                day: "numeric", month: "long", year: "numeric",
                hour: "2-digit", minute: "2-digit",
              })}
            </p>
          </div>
          <button onClick={onClose}
            style={{ padding: 8, borderRadius: 10, border: "1px solid rgba(148,163,184,0.2)",
              background: "transparent", cursor: "pointer", color: "var(--color-text-muted)" }}>
            <X size={20} />
          </button>
        </div>

        {/* Status badge + changer */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28,
          padding: "16px 20px", borderRadius: 12, background: sc.bg, flexWrap: "wrap" }}>
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: sc.dot, flexShrink: 0 }} />
          <span style={{ fontSize: "1.1rem", fontWeight: 900, color: sc.text, flex: 1 }}>{order.status}</span>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {STATUS_OPTIONS.filter(s => s !== order.status).map(s => (
              <button key={s} onClick={() => handleStatus(s)} disabled={saving}
                style={{
                  padding: "6px 14px", borderRadius: 999, border: "1px solid rgba(148,163,184,0.25)",
                  background: "rgba(255,255,255,0.06)", color: "var(--color-text-primary)",
                  fontSize: "0.78rem", fontWeight: 700, cursor: "pointer",
                  opacity: saving ? 0.5 : 1,
                }}>
                → {s}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
          {/* Customer */}
          <div style={{ padding: "20px 22px", borderRadius: 14,
            border: "1px solid rgba(148,163,184,0.15)", background: "rgba(148,163,184,0.04)" }}>
            <p style={{ fontSize: "0.7rem", fontWeight: 900, textTransform: "uppercase",
              letterSpacing: "0.1em", color: "var(--color-text-muted)", marginBottom: 12 }}>
              <User size={11} style={{ display: "inline", marginRight: 5 }} />Customer
            </p>
            <p style={{ fontSize: "1.4rem", fontWeight: 900, color: "var(--color-text-primary)", margin: "0 0 4px" }}>
              {order.customer_name}
            </p>
            <p style={{ fontSize: "1rem", fontWeight: 700, color: "#14b8a6", display: "flex", alignItems: "center", gap: 6 }}>
              <Phone size={14} /> {order.customer_phone}
            </p>
          </div>

          {/* Pickup */}
          <div style={{ padding: "20px 22px", borderRadius: 14,
            border: "1px solid rgba(148,163,184,0.15)", background: "rgba(148,163,184,0.04)" }}>
            <p style={{ fontSize: "0.7rem", fontWeight: 900, textTransform: "uppercase",
              letterSpacing: "0.1em", color: "var(--color-text-muted)", marginBottom: 12 }}>
              <MapPin size={11} style={{ display: "inline", marginRight: 5 }} />Pickup location
            </p>
            <p style={{ fontSize: "1rem", fontWeight: 700, color: "var(--color-text-primary)", margin: "0 0 8px", lineHeight: 1.5 }}>
              {order.pickup_address}
            </p>
            {order.pickup_date && (
              <p style={{ fontSize: "0.9rem", color: "#14b8a6", fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}>
                <Calendar size={14} />
                {order.pickup_date}{order.pickup_time ? ` at ${order.pickup_time}` : ""}
              </p>
            )}
            {order.notes && (
              <p style={{ marginTop: 8, fontSize: "0.82rem", color: "var(--color-text-muted)", fontStyle: "italic" }}>
                Note: {order.notes}
              </p>
            )}
          </div>
        </div>

        {/* Services */}
        <div style={{ padding: "20px 22px", borderRadius: 14,
          border: "1px solid rgba(148,163,184,0.15)", background: "rgba(148,163,184,0.04)" }}>
          <p style={{ fontSize: "0.7rem", fontWeight: 900, textTransform: "uppercase",
            letterSpacing: "0.1em", color: "var(--color-text-muted)", marginBottom: 16 }}>
            Services ordered
          </p>
          {order.order_items?.length > 0 ? (
            <>
              {order.order_items.map((item) => (
                <div key={item.id} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "12px 0", borderBottom: "1px solid rgba(148,163,184,0.1)",
                }}>
                  <div>
                    <p style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--color-text-primary)", margin: 0 }}>
                      {item.name}
                    </p>
                    {item.quantity > 1 && (
                      <p style={{ fontSize: "0.8rem", color: "var(--color-text-muted)", margin: "2px 0 0" }}>
                        ₹{item.price} × {item.quantity}
                      </p>
                    )}
                  </div>
                  <span style={{ fontSize: "1.2rem", fontWeight: 900, color: "#14b8a6" }}>
                    ₹{item.price * item.quantity}
                  </span>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
                paddingTop: 16, marginTop: 4 }}>
                <span style={{ fontSize: "1rem", fontWeight: 900, color: "var(--color-text-primary)" }}>
                  Estimated total
                </span>
                <span style={{ fontSize: "2rem", fontWeight: 900, color: "#14b8a6" }}>
                  ₹{order.estimated_total}
                </span>
              </div>
            </>
          ) : (
            <p style={{ color: "var(--color-text-muted)", fontSize: "0.9rem" }}>No items recorded.</p>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Order Card ────────────────────────────────────────────────
function OrderCard({
  order,
  onClick,
  onStatusChange,
}: {
  order: OrderWithItems;
  onClick: () => void;
  onStatusChange: (id: string, status: OrderStatus) => Promise<void>;
}) {
  const sc = STATUS_COLORS[order.status];
  return (
    <div
      onClick={onClick}
      style={{
        border: "1px solid rgba(148,163,184,0.18)",
        borderRadius: 16, padding: "20px 24px",
        background: "var(--color-background-primary)",
        cursor: "pointer", transition: "all 180ms ease",
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
      }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = "#14b8a6")}
      onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(148,163,184,0.18)")}
    >
      {/* top row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
        <div>
          <p style={{ fontFamily: "monospace", fontSize: "1rem", fontWeight: 900,
            color: "var(--color-text-primary)", margin: 0 }}>{order.id}</p>
          <p style={{ fontSize: "0.78rem", color: "var(--color-text-muted)", marginTop: 2 }}>
            {new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
          </p>
        </div>
        <span style={{
          padding: "5px 12px", borderRadius: 999, fontSize: "0.75rem", fontWeight: 800,
          background: sc.bg, color: sc.text, display: "flex", alignItems: "center", gap: 5,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: sc.dot }} />
          {order.status}
        </span>
      </div>

      {/* customer */}
      <div style={{ marginBottom: 12 }}>
        <p style={{ fontSize: "1.2rem", fontWeight: 900, color: "var(--color-text-primary)", margin: "0 0 2px" }}>
          {order.customer_name}
        </p>
        <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", display: "flex", alignItems: "center", gap: 5 }}>
          <Phone size={12} /> {order.customer_phone}
        </p>
      </div>

      {/* address */}
      <p style={{ fontSize: "0.82rem", color: "var(--color-text-muted)", display: "flex", gap: 5,
        alignItems: "flex-start", marginBottom: 12 }}>
        <MapPin size={12} style={{ marginTop: 2, flexShrink: 0, color: "#14b8a6" }} />
        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 260 }}>
          {order.pickup_address}
        </span>
      </p>

      {/* services */}
      {order.order_items?.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 14 }}>
          {order.order_items.map(item => (
            <span key={item.id} style={{
              padding: "3px 10px", borderRadius: 999, fontSize: "0.75rem", fontWeight: 700,
              background: "rgba(20,184,166,0.1)", color: "#14b8a6",
            }}>
              {item.name}{item.quantity > 1 ? ` ×${item.quantity}` : ""}
            </span>
          ))}
        </div>
      )}

      {/* footer */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
        paddingTop: 12, borderTop: "1px solid rgba(148,163,184,0.12)" }}
        onClick={e => e.stopPropagation()}>
        <span style={{ fontSize: "1.4rem", fontWeight: 900, color: "#14b8a6" }}>
          ₹{order.estimated_total}
        </span>
        <select
          value={order.status}
          onChange={e => onStatusChange(order.id, e.target.value as OrderStatus)}
          style={{
            padding: "6px 12px", borderRadius: 8, border: "1px solid rgba(148,163,184,0.25)",
            background: "transparent", color: "var(--color-text-primary)",
            fontSize: "0.8rem", fontWeight: 700, cursor: "pointer",
          }}
        >
          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
    </div>
  );
}

// ── Main Admin Page ───────────────────────────────────────────
export default function AdminPage() {
  const [authed,       setAuthed]       = useState(false);
  const [checking,     setChecking]     = useState(true);
  const [loginEmail,   setLoginEmail]   = useState("");
  const [loginPass,    setLoginPass]    = useState("");
  const [loginErr,     setLoginErr]     = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const [tab,          setTab]          = useState<AdminTab>("overview");
  const [toast,        setToast]        = useState<{ msg: string; ok: boolean } | null>(null);
  const [editingId,    setEditingId]    = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<OrderWithItems | null>(null);
  const [svcForm,      setSvcForm]      = useState<ServiceForm>(emptyService);
  const [svcSaving,    setSvcSaving]    = useState(false);

  const { services, loading: svcLoading, addService, updateService, deleteService } = useServices();
  const { config, saveConfig, isLoaded: cfgLoaded } = useSiteConfig();
  const { orders, loading: ordLoading, refetch: refetchOrders, updateOrderStatus } = useOrders();
  const [siteForm, setSiteForm] = useState(config);

  useEffect(() => { if (cfgLoaded) setSiteForm(config); }, [cfgLoaded, config]);

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { setChecking(false); return; }
      const { data } = await supabase.from('profiles').select('role').eq('id', session.user.id).maybeSingle();
      const p = data as { role?: string } | null;
      setAuthed(p?.role === 'admin');
      setChecking(false);
    })();
  }, []);

  function showToast(msg: string, ok = true) {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3500);
  }

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoginLoading(true); setLoginErr("");
    const { error, data: signInData } = await supabase.auth.signInWithPassword({ email: loginEmail, password: loginPass });
    if (error) { setLoginErr(error.message); setLoginLoading(false); return; }
    const userId = signInData.user?.id;
    if (!userId) { setLoginErr("Login failed"); setLoginLoading(false); return; }
    const { data: profileData, error: profileError } = await supabase.from("profiles").select("role").eq("id", userId).maybeSingle();
    const profile = profileData as { role?: string } | null;
    if (profile?.role !== "admin") {
      await supabase.auth.signOut();
      setLoginErr(profileError ? `Profile fetch failed: ${profileError.message}` : profile === null
        ? `No profile row found. Run: insert into public.profiles (id, full_name, role) values ('${userId}', 'Admin', 'admin');`
        : `Role is '${profile?.role}', not 'admin'.`);
      setLoginLoading(false); return;
    }
    setAuthed(true); setLoginLoading(false);
  };

  const handleLogout = async () => { await supabase.auth.signOut(); setAuthed(false); };

  const handleSvcSave = async () => {
    if (!svcForm.name.trim()) return;
    setSvcSaving(true);
    try {
      if (editingId) { await updateService(editingId, svcForm); showToast("Service updated"); }
      else { await addService(svcForm); showToast("Service added"); }
      setEditingId(null); setSvcForm(emptyService);
    } catch (err) { showToast(err instanceof Error ? err.message : "Error", false); }
    finally { setSvcSaving(false); }
  };

  const handleSvcEdit = (s: Service) => {
    setEditingId(s.id);
    setSvcForm({ name: s.name, description: s.description, price: s.price,
      category: s.category, icon: s.icon ?? "washing", badge: s.badge ?? null, sort_order: s.sort_order });
    setTab("services");
  };

  const handleSvcDelete = async (id: string) => {
    if (!confirm("Delete this service?")) return;
    try { await deleteService(id); showToast("Service deleted"); }
    catch (err) { showToast(err instanceof Error ? err.message : "Error", false); }
  };

  const handleSiteSave = async () => {
    try { await saveConfig(siteForm); showToast("Configuration saved"); }
    catch (err) { showToast(err instanceof Error ? err.message : "Error saving config", false); }
  };

  const handleStatusChange = async (orderId: string, status: OrderStatus) => {
    try {
      await updateOrderStatus(orderId, status);
      showToast("Status updated");
      // Update selected order if open
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(prev => prev ? { ...prev, status } : prev);
      }
    } catch (err) { showToast(err instanceof Error ? err.message : "Error", false); }
  };

  const totalRevenue = orders.reduce((n, o) => n + Number(o.estimated_total), 0);
  const activeOrders = orders.filter(o => o.status !== "Delivered" && o.status !== "Cancelled").length;

  if (checking) return (
    <div className="studio-page min-h-screen grid place-items-center">
      <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
    </div>
  );

  if (!authed) return (
    <div className="studio-page">
      <div className="studio-shell grid min-h-[calc(100vh-9rem)] place-items-center">
        <section className="studio-panel w-full max-w-md p-6 sm:p-8">
          <span className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-lg bg-teal-500/12 text-teal-500">
            <Lock className="h-8 w-8" />
          </span>
          <p className="studio-kicker mx-auto w-fit"><ShieldCheck className="h-4 w-4" /> Admin only</p>
          <h1 className="mt-5 text-center text-3xl font-black text-[var(--color-text-primary)]">Admin login</h1>
          <form onSubmit={handleLogin} className="mt-7 space-y-4">
            {loginErr && (
              <p className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-bold text-red-700 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-400">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />{loginErr}
              </p>
            )}
            <label className="grid gap-2 text-sm font-bold text-[var(--color-text-primary)]">
              Email
              <input value={loginEmail} onChange={e => setLoginEmail(e.target.value)} type="email" className="studio-input" placeholder="admin@example.com" required />
            </label>
            <label className="grid gap-2 text-sm font-bold text-[var(--color-text-primary)]">
              Password
              <input value={loginPass} onChange={e => setLoginPass(e.target.value)} type="password" className="studio-input" placeholder="••••••••" required />
            </label>
            <button type="submit" disabled={loginLoading} className="studio-button w-full">
              {loginLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> Signing in…</> : "Access dashboard"}
            </button>
          </form>
        </section>
      </div>
    </div>
  );

  return (
    <div className="studio-page">
      {/* Modal */}
      {selectedOrder && (
        <OrderModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onStatusChange={handleStatusChange}
        />
      )}

      {/* Toast */}
      {toast && (
        <div className={`fixed top-24 right-6 z-50 flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-bold shadow-xl ${
          toast.ok ? "border-teal-500/30 bg-teal-500/10 text-teal-400" : "border-red-500/30 bg-red-500/10 text-red-400"
        }`}>
          {toast.ok ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          {toast.msg}
        </div>
      )}

      <div className="studio-shell">
        {/* Header */}
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 32 }}>
          <div>
            <p className="studio-kicker"><Sparkles className="h-4 w-4" /> Admin dashboard</p>
            <h1 className="studio-title">Control room</h1>
          </div>
          <button onClick={handleLogout} className="studio-secondary-button">
            <LogOut className="h-5 w-5" /> Logout
          </button>
        </header>

        {/* Stats */}
        <section style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 32 }}>
          {[
            { label: "Total orders",  value: orders.length,                       color: "var(--color-text-primary)" },
            { label: "Active orders", value: activeOrders,                        color: "#facc15" },
            { label: "Services",      value: services.length,                     color: "var(--color-text-primary)" },
            { label: "Revenue",       value: `₹${totalRevenue.toLocaleString()}`, color: "#14b8a6" },
          ].map(({ label, value, color }) => (
            <div key={label} className="studio-panel" style={{ padding: "20px 24px" }}>
              <p style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--color-text-muted)", marginBottom: 8 }}>{label}</p>
              <p style={{ fontSize: "2.2rem", fontWeight: 900, color, margin: 0 }}>{value}</p>
            </div>
          ))}
        </section>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 4, marginBottom: 24, borderBottom: "1px solid rgba(148,163,184,0.15)", paddingBottom: 0 }}>
          {([
            { id: "overview", label: "Overview",    icon: BarChart3 },
            { id: "orders",   label: "All Orders",  icon: Package },
            { id: "services", label: "Services",    icon: Sparkles },
            { id: "site",     label: "Site Config", icon: Settings },
          ] as { id: AdminTab; label: string; icon: React.ElementType }[]).map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setTab(id)}
              style={{
                display: "flex", alignItems: "center", gap: 7, padding: "10px 18px",
                borderRadius: "10px 10px 0 0", border: "none", cursor: "pointer",
                fontWeight: 800, fontSize: "0.88rem",
                background: tab === id ? "rgba(20,184,166,0.12)" : "transparent",
                color: tab === id ? "#14b8a6" : "var(--color-text-muted)",
                borderBottom: tab === id ? "2px solid #14b8a6" : "2px solid transparent",
                transition: "all 160ms ease",
              }}>
              <Icon size={15} />{label}
            </button>
          ))}
        </div>

        {/* ── OVERVIEW TAB ── */}
        {tab === "overview" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ fontSize: "1.4rem", fontWeight: 900, color: "var(--color-text-primary)", margin: 0 }}>Recent orders</h2>
              <button onClick={() => setTab("orders")} style={{ fontSize: "0.85rem", fontWeight: 700, color: "#14b8a6",
                background: "none", border: "none", cursor: "pointer" }}>View all →</button>
            </div>
            {ordLoading ? (
              <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--color-text-muted)" }}>
                <Loader2 className="h-4 w-4 animate-spin" /> Loading…
              </div>
            ) : orders.length === 0 ? (
              <p style={{ color: "var(--color-text-muted)" }}>No orders yet.</p>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
                {orders.slice(0, 6).map(o => (
                  <OrderCard key={o.id} order={o} onClick={() => setSelectedOrder(o)} onStatusChange={handleStatusChange} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── ORDERS TAB ── */}
        {tab === "orders" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ fontSize: "1.4rem", fontWeight: 900, color: "var(--color-text-primary)", margin: 0 }}>
                All orders <span style={{ fontSize: "1rem", color: "var(--color-text-muted)", fontWeight: 600 }}>({orders.length})</span>
              </h2>
              <button onClick={refetchOrders} className="studio-secondary-button" style={{ minHeight: 36, padding: "0 14px", fontSize: "0.82rem" }}>
                <RefreshCw className="h-3.5 w-3.5" /> Refresh
              </button>
            </div>
            {ordLoading ? (
              <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--color-text-muted)" }}>
                <Loader2 className="h-4 w-4 animate-spin" /> Loading orders…
              </div>
            ) : orders.length === 0 ? (
              <p style={{ color: "var(--color-text-muted)" }}>No orders yet.</p>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
                {orders.map(o => (
                  <OrderCard key={o.id} order={o} onClick={() => setSelectedOrder(o)} onStatusChange={handleStatusChange} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── SERVICES TAB ── */}
        {tab === "services" && (
          <>
            <section className="studio-panel p-5 sm:p-6" style={{ marginBottom: 24 }}>
              <h2 className="mb-5 text-xl font-black text-[var(--color-text-primary)]">
                {editingId ? "Edit service" : "Add service"}
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="grid gap-2 text-sm font-bold text-[var(--color-text-primary)]">
                  Service name *
                  <input value={svcForm.name} onChange={e => setSvcForm({ ...svcForm, name: e.target.value })} className="studio-input" placeholder="e.g. Wash + fold" />
                </label>
                <label className="grid gap-2 text-sm font-bold text-[var(--color-text-primary)]">
                  Category
                  <select value={svcForm.category} onChange={e => setSvcForm({ ...svcForm, category: e.target.value })} className="studio-input">
                    {["Per piece","Per kg","Per pair","Per stain","Wash","Iron","Dry Clean"].map(c => <option key={c}>{c}</option>)}
                  </select>
                </label>
                <label className="grid gap-2 text-sm font-bold text-[var(--color-text-primary)] md:col-span-2">
                  Description
                  <input value={svcForm.description} onChange={e => setSvcForm({ ...svcForm, description: e.target.value })} className="studio-input" placeholder="Short description" />
                </label>
                <label className="grid gap-2 text-sm font-bold text-[var(--color-text-primary)]">
                  Price (₹)
                  <input value={svcForm.price} type="number" min={0} onChange={e => setSvcForm({ ...svcForm, price: Number(e.target.value) || 0 })} className="studio-input" />
                </label>
                <label className="grid gap-2 text-sm font-bold text-[var(--color-text-primary)]">
                  Badge (optional)
                  <input value={svcForm.badge ?? ""} onChange={e => setSvcForm({ ...svcForm, badge: e.target.value || null })} className="studio-input" placeholder="Popular / New" />
                </label>
                <label className="grid gap-2 text-sm font-bold text-[var(--color-text-primary)]">
                  Icon key
                  <select value={svcForm.icon ?? "washing"} onChange={e => setSvcForm({ ...svcForm, icon: e.target.value })} className="studio-input">
                    {["washing","iron","fold","hanger","sparkles","droplet-off","shoe","layout-grid"].map(i => <option key={i}>{i}</option>)}
                  </select>
                </label>
                <label className="grid gap-2 text-sm font-bold text-[var(--color-text-primary)]">
                  Sort order
                  <input value={svcForm.sort_order} type="number" min={0} onChange={e => setSvcForm({ ...svcForm, sort_order: Number(e.target.value) || 0 })} className="studio-input" />
                </label>
              </div>
              <div className="mt-5 flex gap-3">
                <button onClick={handleSvcSave} disabled={svcSaving || !svcForm.name.trim()} className="studio-button">
                  {svcSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : editingId ? <Edit2 className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  {editingId ? "Update service" : "Add service"}
                </button>
                {editingId && <button onClick={() => { setEditingId(null); setSvcForm(emptyService); }} className="studio-secondary-button">Cancel</button>}
              </div>
            </section>

            <section className="studio-panel overflow-hidden">
              <div className="flex items-center justify-between p-5 pb-0">
                <h2 className="text-xl font-black text-[var(--color-text-primary)]">Service catalog</h2>
                {svcLoading && <Loader2 className="h-4 w-4 animate-spin text-teal-500" />}
              </div>
              <div className="mt-4 overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 text-sm dark:divide-slate-800">
                  <thead>
                    <tr className="text-left text-xs font-black uppercase text-[var(--color-text-muted)]">
                      <th className="px-5 py-4">Service</th>
                      <th className="px-5 py-4">Category</th>
                      <th className="px-5 py-4">Price</th>
                      <th className="px-5 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {services.map(s => (
                      <tr key={s.id} className="hover:bg-teal-500/5 transition">
                        <td className="px-5 py-4">
                          <p className="font-black text-[var(--color-text-primary)]">{s.name}</p>
                          <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">{s.description}</p>
                          {s.badge && <span className="mt-1 inline-block rounded-full bg-teal-500/15 px-2 py-0.5 text-xs font-bold text-teal-400">{s.badge}</span>}
                        </td>
                        <td className="px-5 py-4"><span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-black text-blue-400">{s.category}</span></td>
                        <td className="px-5 py-4 font-black text-[var(--color-text-primary)]">₹{s.price}</td>
                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-2">
                            <button onClick={() => handleSvcEdit(s)} className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-teal-600 hover:bg-teal-500/10 dark:border-slate-800" aria-label={`Edit ${s.name}`}><Edit2 className="h-4 w-4" /></button>
                            <button onClick={() => handleSvcDelete(s.id)} className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-red-500 hover:bg-red-500/10 dark:border-slate-800" aria-label={`Delete ${s.name}`}><Trash2 className="h-4 w-4" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}

        {/* ── SITE CONFIG TAB ── */}
        {tab === "site" && (
          <section className="studio-panel p-5 sm:p-6 space-y-6">
            <h2 className="flex items-center gap-2 text-xl font-black text-[var(--color-text-primary)]">
              <Settings className="h-5 w-5 text-teal-500" /> Site configuration
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-2 text-sm font-bold text-[var(--color-text-primary)]">
                Company name
                <input value={siteForm.companyName} onChange={e => setSiteForm({ ...siteForm, companyName: e.target.value })} className="studio-input" />
              </label>
              <label className="grid gap-2 text-sm font-bold text-[var(--color-text-primary)]">
                Contact email
                <input value={siteForm.contactEmail} type="email" onChange={e => setSiteForm({ ...siteForm, contactEmail: e.target.value })} className="studio-input" />
              </label>
              <label className="grid gap-2 text-sm font-bold text-[var(--color-text-primary)] md:col-span-2">
                Hero title
                <input value={siteForm.heroTitle} onChange={e => setSiteForm({ ...siteForm, heroTitle: e.target.value })} className="studio-input" />
              </label>
              <label className="grid gap-2 text-sm font-bold text-[var(--color-text-primary)] md:col-span-2">
                Hero subtitle
                <textarea value={siteForm.heroSubtitle} onChange={e => setSiteForm({ ...siteForm, heroSubtitle: e.target.value })} className="studio-input min-h-24 py-3" />
              </label>
              <label className="grid gap-2 text-sm font-bold text-[var(--color-text-primary)]">
                Contact phone
                <input value={siteForm.contactPhone} onChange={e => setSiteForm({ ...siteForm, contactPhone: e.target.value })} className="studio-input" />
              </label>
            </div>
            <button onClick={handleSiteSave} className="studio-button">
              <Save className="h-5 w-5" /> Save configuration
            </button>
          </section>
        )}
      </div>
    </div>
  );
}
