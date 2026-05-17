"use client";

export const dynamic = 'force-dynamic';

import { useEffect, useState, type FormEvent } from "react";
import {
  AlertCircle, BarChart3, CheckCircle2, ChevronDown, ChevronRight,
  Edit2, Loader2, Lock, LogOut, MapPin, Package, Plus,
  RefreshCw, Save, Settings, ShieldCheck, Sparkles, Trash2,
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { useServices } from "@/hooks/useServices";
import { useSiteConfig } from "@/hooks/useSiteConfig";
import { useOrders } from "@/hooks/useOrders";
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

const STATUS_COLORS: Record<OrderStatus, string> = {
  "Order received":   "bg-blue-500/15 text-blue-400 border-blue-500/30",
  "Picked up":        "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
  "Being cleaned":    "bg-purple-500/15 text-purple-400 border-purple-500/30",
  "Out for delivery": "bg-orange-500/15 text-orange-400 border-orange-500/30",
  "Delivered":        "bg-teal-500/15 text-teal-400 border-teal-500/30",
  "Cancelled":        "bg-red-500/15 text-red-400 border-red-500/30",
};

export default function AdminPage() {
  // ── auth state ──
  const [authed,    setAuthed]    = useState(false);
  const [checking,  setChecking]  = useState(true);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPass,  setLoginPass]  = useState("");
  const [loginErr,   setLoginErr]   = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // ── ui state ──
  const [tab,             setTab]             = useState<AdminTab>("overview");
  const [toast,           setToast]           = useState<{ msg: string; ok: boolean } | null>(null);
  const [editingId,       setEditingId]       = useState<string | null>(null);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [svcForm,         setSvcForm]         = useState<ServiceForm>(emptyService);
  const [svcSaving,       setSvcSaving]       = useState(false);

  // ── data hooks ──
  const { services, loading: svcLoading, addService, updateService, deleteService } = useServices();
  const { config, saveConfig, isLoaded: cfgLoaded } = useSiteConfig();
  const { orders, loading: ordLoading, refetch: refetchOrders, updateOrderStatus } = useOrders();
  const [siteForm, setSiteForm] = useState(config);

  // Sync siteForm when config loads
  useEffect(() => { if (cfgLoaded) setSiteForm(config); }, [cfgLoaded, config]);

  // Check if current user is admin
  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { setChecking(false); return; }
      const { data: profileData } = await supabase
        .from('profiles').select('role').eq('id', session.user.id).maybeSingle();
      const profile = profileData as { role?: string } | null;
      setAuthed(profile?.role === 'admin');
      setChecking(false);
    })();
  }, []);

  function showToast(msg: string, ok = true) {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3500);
  }

  // ── login ──
  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoginLoading(true); setLoginErr("");
    const { error, data: signInData } = await supabase.auth.signInWithPassword({
      email: loginEmail, password: loginPass,
    });
    if (error) { setLoginErr(error.message); setLoginLoading(false); return; }

    const userId = signInData.user?.id;
    console.log("[admin] signed in user id:", userId);

    if (!userId) { setLoginErr("Login failed — no user returned."); setLoginLoading(false); return; }

    const { data: profileData, error: profileError } = await supabase
      .from("profiles").select("role").eq("id", userId).maybeSingle();

    console.log("[admin] profile query result:", profileData, "error:", profileError);

    const profile = profileData as { role?: string } | null;
    if (profile?.role !== "admin") {
      await supabase.auth.signOut();
      setLoginErr(
        profileError
          ? `Profile fetch failed: ${profileError.message}`
          : profile === null
          ? "No profile row found for this user. Insert one in Supabase SQL Editor: insert into public.profiles (id, full_name, role) values ('" + userId + "', 'Admin', 'admin');"
          : `Role is '${profile?.role}', not 'admin'.`
      );
      setLoginLoading(false); return;
    }
    setAuthed(true); setLoginLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setAuthed(false);
  };

  // ── service CRUD ──
  const handleSvcSave = async () => {
    if (!svcForm.name.trim()) return;
    setSvcSaving(true);
    try {
      if (editingId) {
        await updateService(editingId, svcForm);
        showToast("Service updated");
      } else {
        await addService(svcForm);
        showToast("Service added");
      }
      setEditingId(null); setSvcForm(emptyService);
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Error saving service", false);
    } finally { setSvcSaving(false); }
  };

  const handleSvcEdit = (s: Service) => {
    setEditingId(s.id);
    setSvcForm({ name: s.name, description: s.description, price: s.price,
      category: s.category, icon: s.icon ?? "washing", badge: s.badge ?? null,
      sort_order: s.sort_order });
    setTab("services");
  };

  const handleSvcDelete = async (id: string) => {
    if (!confirm("Delete this service?")) return;
    try { await deleteService(id); showToast("Service deleted"); }
    catch (err) { showToast(err instanceof Error ? err.message : "Error", false); }
  };

  // ── site config save ──
  const handleSiteSave = async () => {
    try { await saveConfig(siteForm); showToast("Configuration saved"); }
    catch (err) { showToast(err instanceof Error ? err.message : "Error saving config", false); }
  };

  // ── order status update ──
  const handleStatusChange = async (orderId: string, status: OrderStatus) => {
    try { await updateOrderStatus(orderId, status); showToast("Status updated"); }
    catch (err) { showToast(err instanceof Error ? err.message : "Error", false); }
  };

  // ── stats ──
  const totalRevenue = orders.reduce((n, o) => n + Number(o.estimated_total), 0);
  const activeOrders = orders.filter((o) => o.status !== "Delivered" && o.status !== "Cancelled").length;

  // ── loading / login screens ──
  if (checking) {
    return (
      <div className="studio-page min-h-screen grid place-items-center">
        <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
      </div>
    );
  }

  if (!authed) {
    return (
      <div className="studio-page">
        <div className="studio-shell grid min-h-[calc(100vh-9rem)] place-items-center">
          <section className="studio-panel w-full max-w-md p-6 sm:p-8">
            <span className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-lg bg-teal-500/12 text-teal-500">
              <Lock className="h-8 w-8" />
            </span>
            <p className="studio-kicker mx-auto w-fit"><ShieldCheck className="h-4 w-4" /> Admin only</p>
            <h1 className="mt-5 text-center text-3xl font-black text-[var(--color-text-primary)]">Admin login</h1>
            <p className="mt-2 text-center text-sm text-[var(--color-text-muted)]">
              Sign in with your admin Supabase account.
            </p>
            <form onSubmit={handleLogin} className="mt-7 space-y-4">
              {loginErr && (
                <p className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-bold text-red-700">
                  <AlertCircle className="h-4 w-4 shrink-0" />{loginErr}
                </p>
              )}
              <label className="grid gap-2 text-sm font-bold text-[var(--color-text-primary)]">
                Email
                <input value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)}
                  type="email" className="studio-input" placeholder="admin@example.com" required />
              </label>
              <label className="grid gap-2 text-sm font-bold text-[var(--color-text-primary)]">
                Password
                <input value={loginPass} onChange={(e) => setLoginPass(e.target.value)}
                  type="password" className="studio-input" placeholder="••••••••" required />
              </label>
              <button type="submit" disabled={loginLoading} className="studio-button w-full">
                {loginLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> Signing in…</> : "Access dashboard"}
              </button>
            </form>
          </section>
        </div>
      </div>
    );
  }

  // ── main dashboard ──
  return (
    <div className="studio-page">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-24 right-6 z-50 flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-bold shadow-xl transition-all ${
          toast.ok
            ? "border-teal-500/30 bg-teal-500/10 text-teal-400"
            : "border-red-500/30 bg-red-500/10 text-red-400"
        }`}>
          {toast.ok ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          {toast.msg}
        </div>
      )}

      <div className="studio-shell">
        {/* Header */}
        <header className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div>
            <p className="studio-kicker"><Sparkles className="h-4 w-4" /> Operator dashboard</p>
            <h1 className="studio-title">Control room</h1>
            <p className="studio-copy">Manage orders, services, and site configuration from one place.</p>
          </div>
          <button onClick={handleLogout} className="studio-secondary-button">
            <LogOut className="h-5 w-5" /> Logout
          </button>
        </header>

        {/* Stats */}
        <section className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Total orders",    value: orders.length,                  color: "" },
            { label: "Active orders",   value: activeOrders,                   color: "text-yellow-400" },
            { label: "Services",        value: services.length,                color: "" },
            { label: "Total revenue",   value: `₹${totalRevenue.toLocaleString()}`, color: "text-teal-400" },
          ].map(({ label, value, color }) => (
            <div key={label} className="studio-panel p-5">
              <p className="text-sm font-bold text-[var(--color-text-muted)]">{label}</p>
              <p className={`mt-2 text-4xl font-black text-[var(--color-text-primary)] ${color}`}>{value}</p>
            </div>
          ))}
        </section>

        <div className="mt-8 grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)]">
          {/* Sidebar */}
          <aside className="studio-panel h-fit p-3">
            {([
              { id: "overview",  label: "Overview",         icon: BarChart3 },
              { id: "orders",    label: "Orders",           icon: Package },
              { id: "services",  label: "Services",         icon: Sparkles },
              { id: "site",      label: "Site config",      icon: Settings },
            ] as { id: AdminTab; label: string; icon: React.ElementType }[]).map(({ id, label, icon: Icon }) => (
              <button key={id} type="button" onClick={() => setTab(id)}
                className={`flex min-h-12 w-full items-center gap-3 rounded-lg px-4 text-left text-sm font-black transition ${
                  tab === id
                    ? "bg-teal-500 text-white shadow-lg shadow-teal-500/20"
                    : "text-[var(--color-text-muted)] hover:bg-teal-500/10 hover:text-[var(--color-text-primary)]"
                }`}>
                <Icon className="h-5 w-5" />{label}
              </button>
            ))}
          </aside>

          <main className="min-w-0 space-y-6">

            {/* ── OVERVIEW TAB ── */}
            {tab === "overview" && (
              <section className="studio-panel p-5 sm:p-6">
                <h2 className="mb-4 text-xl font-black text-[var(--color-text-primary)]">Recent orders</h2>
                {ordLoading ? (
                  <div className="flex items-center gap-2 text-[var(--color-text-muted)]">
                    <Loader2 className="h-4 w-4 animate-spin" /> Loading…
                  </div>
                ) : orders.length === 0 ? (
                  <p className="text-sm text-[var(--color-text-muted)]">No orders yet.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200 text-sm dark:divide-slate-800">
                      <thead>
                        <tr className="text-left text-xs font-black uppercase text-[var(--color-text-muted)]">
                          <th className="px-4 py-3">Order ID</th>
                          <th className="px-4 py-3">Customer</th>
                          <th className="px-4 py-3">Services</th>
                          <th className="px-4 py-3">Total</th>
                          <th className="px-4 py-3">Status</th>
                          <th className="px-4 py-3">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                        {orders.slice(0, 8).map((o) => (
                          <tr key={o.id} className="hover:bg-teal-500/5 transition">
                            <td className="px-4 py-3 font-mono font-bold text-[var(--color-text-primary)]">{o.id}</td>
                            <td className="px-4 py-3">
                              <p className="font-bold text-[var(--color-text-primary)]">{o.customer_name}</p>
                              <p className="text-xs text-[var(--color-text-muted)]">{o.customer_phone}</p>
                            </td>
                            <td className="px-4 py-3 max-w-[200px]">
                              {o.order_items && o.order_items.length > 0 ? (
                                <div className="flex flex-wrap gap-1">
                                  {o.order_items.map((item) => (
                                    <span key={item.id} className="inline-block rounded-full bg-teal-500/10 px-2 py-0.5 text-xs font-bold text-teal-600 dark:text-teal-400">
                                      {item.name}{item.quantity > 1 ? ` ×${item.quantity}` : ""}
                                    </span>
                                  ))}
                                </div>
                              ) : (
                                <span className="text-xs text-[var(--color-text-muted)]">—</span>
                              )}
                            </td>
                            <td className="px-4 py-3 font-bold text-teal-600 dark:text-teal-400">₹{o.estimated_total}</td>
                            <td className="px-4 py-3">
                              <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold ${STATUS_COLORS[o.status]}`}>
                                {o.status}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-[var(--color-text-muted)]">
                              {new Date(o.created_at).toLocaleDateString("en-IN")}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                {orders.length > 8 && (
                  <button onClick={() => setTab("orders")} className="mt-4 text-sm font-bold text-teal-500 hover:underline">
                    View all {orders.length} orders →
                  </button>
                )}
              </section>
            )}

            {/* ── ORDERS TAB ── */}
            {tab === "orders" && (
              <section className="studio-panel overflow-hidden">
                <div className="flex items-center justify-between p-5 pb-0">
                  <h2 className="text-xl font-black text-[var(--color-text-primary)]">All orders</h2>
                  <button onClick={refetchOrders} className="studio-secondary-button !min-h-9 !px-3 text-xs">
                    <RefreshCw className="h-3.5 w-3.5" /> Refresh
                  </button>
                </div>
                {ordLoading ? (
                  <div className="flex items-center gap-2 p-5 text-[var(--color-text-muted)]">
                    <Loader2 className="h-4 w-4 animate-spin" /> Loading orders…
                  </div>
                ) : orders.length === 0 ? (
                  <p className="p-5 text-sm text-[var(--color-text-muted)]">No orders in the database yet.</p>
                ) : (
                  <div className="mt-4 overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200 text-sm dark:divide-slate-800">
                      <thead>
                        <tr className="text-left text-xs font-black uppercase text-[var(--color-text-muted)]">
                          <th className="px-5 py-4 w-8" />
                          <th className="px-5 py-4">Order</th>
                          <th className="px-5 py-4">Customer</th>
                          <th className="px-5 py-4">Location</th>
                          <th className="px-5 py-4">Services</th>
                          <th className="px-5 py-4">Total</th>
                          <th className="px-5 py-4">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                        {orders.map((o) => {
                          const isExpanded = expandedOrderId === o.id;
                          return (
                            <>
                              <tr
                                key={o.id}
                                className="hover:bg-teal-500/5 transition cursor-pointer"
                                onClick={() => setExpandedOrderId(isExpanded ? null : o.id)}
                              >
                                {/* expand toggle */}
                                <td className="px-5 py-4 text-[var(--color-text-muted)]">
                                  {isExpanded
                                    ? <ChevronDown className="h-4 w-4" />
                                    : <ChevronRight className="h-4 w-4" />}
                                </td>

                                {/* order id + date */}
                                <td className="px-5 py-4">
                                  <p className="font-mono font-bold text-[var(--color-text-primary)]">{o.id}</p>
                                  <p className="text-xs text-[var(--color-text-muted)]">
                                    {new Date(o.created_at).toLocaleString("en-IN")}
                                  </p>
                                </td>

                                {/* customer name + phone */}
                                <td className="px-5 py-4">
                                  <p className="font-bold text-[var(--color-text-primary)]">{o.customer_name}</p>
                                  <p className="text-xs text-[var(--color-text-muted)]">{o.customer_phone}</p>
                                </td>

                                {/* pickup address + schedule */}
                                <td className="px-5 py-4 max-w-[200px]">
                                  <p className="flex items-start gap-1 text-xs text-[var(--color-text-primary)]">
                                    <MapPin className="h-3 w-3 mt-0.5 shrink-0 text-teal-500" />
                                    <span className="line-clamp-2">{o.pickup_address}</span>
                                  </p>
                                  {o.pickup_date && (
                                    <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                                      📅 {o.pickup_date}{o.pickup_time ? ` @ ${o.pickup_time}` : ""}
                                    </p>
                                  )}
                                </td>

                                {/* services summary */}
                                <td className="px-5 py-4 max-w-[220px]">
                                  {o.order_items && o.order_items.length > 0 ? (
                                    <div className="flex flex-wrap gap-1">
                                      {o.order_items.map((item) => (
                                        <span
                                          key={item.id}
                                          className="inline-block rounded-full bg-teal-500/10 px-2 py-0.5 text-xs font-bold text-teal-600 dark:text-teal-400"
                                        >
                                          {item.name}{item.quantity > 1 ? ` ×${item.quantity}` : ""}
                                        </span>
                                      ))}
                                    </div>
                                  ) : (
                                    <span className="text-xs text-[var(--color-text-muted)]">—</span>
                                  )}
                                </td>

                                {/* total */}
                                <td className="px-5 py-4 font-bold text-teal-600 dark:text-teal-400">
                                  ₹{o.estimated_total}
                                </td>

                                {/* status dropdown — stop propagation so clicking it doesn't toggle expand */}
                                <td className="px-5 py-4" onClick={(e) => e.stopPropagation()}>
                                  <div className="relative">
                                    <select
                                      value={o.status}
                                      onChange={(e) => handleStatusChange(o.id, e.target.value as OrderStatus)}
                                      className={`appearance-none rounded-full border px-3 py-1.5 pr-7 text-xs font-bold cursor-pointer ${STATUS_COLORS[o.status]}`}
                                      style={{ background: "transparent" }}
                                    >
                                      {STATUS_OPTIONS.map((s) => (
                                        <option key={s} value={s} className="bg-slate-900 text-white">{s}</option>
                                      ))}
                                    </select>
                                    <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 opacity-60" />
                                  </div>
                                </td>
                              </tr>

                              {/* ── expanded detail row ── */}
                              {isExpanded && (
                                <tr key={`${o.id}-detail`} className="bg-teal-500/5">
                                  <td colSpan={7} className="px-8 py-5">
                                    <div className="grid gap-6 md:grid-cols-3">

                                      {/* Customer details */}
                                      <div>
                                        <h4 className="mb-2 text-xs font-black uppercase tracking-wider text-[var(--color-text-muted)]">
                                          Customer details
                                        </h4>
                                        <p className="text-sm font-bold text-[var(--color-text-primary)]">{o.customer_name}</p>
                                        <p className="text-sm text-[var(--color-text-muted)]">{o.customer_phone}</p>
                                      </div>

                                      {/* Location */}
                                      <div>
                                        <h4 className="mb-2 text-xs font-black uppercase tracking-wider text-[var(--color-text-muted)]">
                                          Pickup location
                                        </h4>
                                        <p className="text-sm text-[var(--color-text-primary)] whitespace-pre-wrap">{o.pickup_address}</p>
                                        {o.pickup_date && (
                                          <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                                            Date: {o.pickup_date}
                                            {o.pickup_time ? ` at ${o.pickup_time}` : ""}
                                          </p>
                                        )}
                                        {o.notes && (
                                          <p className="mt-1 text-xs italic text-[var(--color-text-muted)]">
                                            Note: {o.notes}
                                          </p>
                                        )}
                                      </div>

                                      {/* Services ordered */}
                                      <div>
                                        <h4 className="mb-2 text-xs font-black uppercase tracking-wider text-[var(--color-text-muted)]">
                                          Services ordered
                                        </h4>
                                        {o.order_items && o.order_items.length > 0 ? (
                                          <div className="space-y-1.5">
                                            {o.order_items.map((item) => (
                                              <div key={item.id} className="flex items-center justify-between gap-4 text-sm">
                                                <span className="text-[var(--color-text-primary)]">
                                                  {item.name}
                                                  {item.quantity > 1 && (
                                                    <span className="ml-1 text-xs text-[var(--color-text-muted)]">×{item.quantity}</span>
                                                  )}
                                                </span>
                                                <span className="font-bold text-teal-600 dark:text-teal-400">
                                                  ₹{item.price * item.quantity}
                                                </span>
                                              </div>
                                            ))}
                                            <div className="mt-2 flex items-center justify-between border-t border-slate-200 pt-2 text-sm dark:border-slate-700">
                                              <span className="font-black text-[var(--color-text-primary)]">Estimated total</span>
                                              <span className="font-black text-teal-600 dark:text-teal-400">₹{o.estimated_total}</span>
                                            </div>
                                          </div>
                                        ) : (
                                          <p className="text-xs text-[var(--color-text-muted)]">No items recorded.</p>
                                        )}
                                      </div>

                                    </div>
                                  </td>
                                </tr>
                              )}
                            </>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            )}

            {/* ── SERVICES TAB ── */}
            {tab === "services" && (
              <>
                <section className="studio-panel p-5 sm:p-6">
                  <h2 className="mb-5 text-xl font-black text-[var(--color-text-primary)]">
                    {editingId ? "Edit service" : "Add service"}
                  </h2>
                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="grid gap-2 text-sm font-bold text-[var(--color-text-primary)]">
                      Service name *
                      <input value={svcForm.name}
                        onChange={(e) => setSvcForm({ ...svcForm, name: e.target.value })}
                        className="studio-input" placeholder="e.g. Wash + fold" />
                    </label>
                    <label className="grid gap-2 text-sm font-bold text-[var(--color-text-primary)]">
                      Category
                      <select value={svcForm.category}
                        onChange={(e) => setSvcForm({ ...svcForm, category: e.target.value })}
                        className="studio-input">
                        {["Per piece","Per kg","Per pair","Per stain","Wash","Iron","Dry Clean"].map((c) => (
                          <option key={c}>{c}</option>
                        ))}
                      </select>
                    </label>
                    <label className="grid gap-2 text-sm font-bold text-[var(--color-text-primary)] md:col-span-2">
                      Description
                      <input value={svcForm.description}
                        onChange={(e) => setSvcForm({ ...svcForm, description: e.target.value })}
                        className="studio-input" placeholder="Short description shown to customers" />
                    </label>
                    <label className="grid gap-2 text-sm font-bold text-[var(--color-text-primary)]">
                      Price (₹)
                      <input value={svcForm.price} type="number" min={0}
                        onChange={(e) => setSvcForm({ ...svcForm, price: Number(e.target.value) || 0 })}
                        className="studio-input" />
                    </label>
                    <label className="grid gap-2 text-sm font-bold text-[var(--color-text-primary)]">
                      Badge (optional)
                      <input value={svcForm.badge ?? ""}
                        onChange={(e) => setSvcForm({ ...svcForm, badge: e.target.value || null })}
                        className="studio-input" placeholder="Popular / New / Sale" />
                    </label>
                    <label className="grid gap-2 text-sm font-bold text-[var(--color-text-primary)]">
                      Icon key
                      <select value={svcForm.icon ?? "washing"}
                        onChange={(e) => setSvcForm({ ...svcForm, icon: e.target.value })}
                        className="studio-input">
                        {["washing","iron","fold","hanger","sparkles","droplet-off","shoe","layout-grid"].map((i) => (
                          <option key={i}>{i}</option>
                        ))}
                      </select>
                    </label>
                    <label className="grid gap-2 text-sm font-bold text-[var(--color-text-primary)]">
                      Sort order
                      <input value={svcForm.sort_order} type="number" min={0}
                        onChange={(e) => setSvcForm({ ...svcForm, sort_order: Number(e.target.value) || 0 })}
                        className="studio-input" />
                    </label>
                  </div>
                  <div className="mt-5 flex gap-3">
                    <button onClick={handleSvcSave} disabled={svcSaving || !svcForm.name.trim()} className="studio-button">
                      {svcSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : editingId ? <Edit2 className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                      {editingId ? "Update service" : "Add service"}
                    </button>
                    {editingId && (
                      <button onClick={() => { setEditingId(null); setSvcForm(emptyService); }}
                        className="studio-secondary-button">Cancel</button>
                    )}
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
                        {services.map((s) => (
                          <tr key={s.id} className="hover:bg-teal-500/5 transition">
                            <td className="px-5 py-4">
                              <p className="font-black text-[var(--color-text-primary)]">{s.name}</p>
                              <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">{s.description}</p>
                              {s.badge && <span className="mt-1 inline-block rounded-full bg-teal-500/15 px-2 py-0.5 text-xs font-bold text-teal-400">{s.badge}</span>}
                            </td>
                            <td className="px-5 py-4">
                              <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-black text-blue-400">{s.category}</span>
                            </td>
                            <td className="px-5 py-4 font-black text-[var(--color-text-primary)]">₹{s.price}</td>
                            <td className="px-5 py-4">
                              <div className="flex justify-end gap-2">
                                <button onClick={() => handleSvcEdit(s)}
                                  className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-teal-600 hover:bg-teal-500/10 dark:border-slate-800"
                                  aria-label={`Edit ${s.name}`}><Edit2 className="h-4 w-4" /></button>
                                <button onClick={() => handleSvcDelete(s.id)}
                                  className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-red-500 hover:bg-red-500/10 dark:border-slate-800"
                                  aria-label={`Delete ${s.name}`}><Trash2 className="h-4 w-4" /></button>
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
                <div>
                  <h2 className="flex items-center gap-2 text-xl font-black text-[var(--color-text-primary)]">
                    <Settings className="h-5 w-5 text-teal-500" /> Site configuration
                  </h2>
                  <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                    Changes are saved to Supabase and reflected across the whole site instantly.
                  </p>
                </div>

                {/* Brand */}
                <div>
                  <h3 className="mb-3 text-sm font-black uppercase tracking-wider text-[var(--color-text-muted)]">Brand</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="grid gap-2 text-sm font-bold text-[var(--color-text-primary)]">
                      Company name
                      <input value={siteForm.companyName}
                        onChange={(e) => setSiteForm({ ...siteForm, companyName: e.target.value })}
                        className="studio-input" placeholder="FreshWash" />
                    </label>
                  </div>
                </div>

                {/* Hero */}
                <div>
                  <h3 className="mb-3 text-sm font-black uppercase tracking-wider text-[var(--color-text-muted)]">Hero section</h3>
                  <div className="grid gap-4">
                    <label className="grid gap-2 text-sm font-bold text-[var(--color-text-primary)]">
                      Hero title
                      <input value={siteForm.heroTitle}
                        onChange={(e) => setSiteForm({ ...siteForm, heroTitle: e.target.value })}
                        className="studio-input" placeholder="Your fit. Always Fresh." />
                    </label>
                    <label className="grid gap-2 text-sm font-bold text-[var(--color-text-primary)]">
                      Hero subtitle
                      <textarea value={siteForm.heroSubtitle}
                        onChange={(e) => setSiteForm({ ...siteForm, heroSubtitle: e.target.value })}
                        className="studio-input min-h-24 py-3" placeholder="Short tagline shown below the hero title." />
                    </label>
                  </div>
                </div>

                {/* Contact */}
                <div>
                  <h3 className="mb-3 text-sm font-black uppercase tracking-wider text-[var(--color-text-muted)]">Contact info</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="grid gap-2 text-sm font-bold text-[var(--color-text-primary)]">
                      Contact email
                      <input value={siteForm.contactEmail} type="email"
                        onChange={(e) => setSiteForm({ ...siteForm, contactEmail: e.target.value })}
                        className="studio-input" placeholder="support@freshwash.demo" />
                    </label>
                    <label className="grid gap-2 text-sm font-bold text-[var(--color-text-primary)]">
                      Contact phone
                      <input value={siteForm.contactPhone}
                        onChange={(e) => setSiteForm({ ...siteForm, contactPhone: e.target.value })}
                        className="studio-input" placeholder="+91 98765 43210" />
                    </label>
                  </div>
                </div>

                <button onClick={handleSiteSave} className="studio-button">
                  <Save className="h-5 w-5" /> Save configuration
                </button>
              </section>
            )}

          </main>
        </div>
      </div>
    </div>
  );
}
