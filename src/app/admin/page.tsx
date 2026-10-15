"use client";
export const dynamic = 'force-dynamic';

import { useCallback, useEffect, useState, type FormEvent } from "react";
import {
  AlertCircle, ArrowRight, BarChart3, Calendar, CheckCircle2,
  Edit2, KeyRound, Loader2, Lock, LogOut, Mail, MapPin, Package, Phone,
  Plus, RefreshCw, Save, Settings, ShieldAlert, ShieldCheck,
  Sparkles, Trash2, User, X,
} from "lucide-react";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";
import { useServices } from "@/hooks/useServices";
import { useSiteConfig } from "@/hooks/useSiteConfig";
import { useOrders, type OrderWithItems } from "@/hooks/useOrders";
import type { Service, OrderStatus } from "@/lib/database.types";

const GOOGLE_ICON = (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

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
  const [authed,        setAuthed]        = useState(false);
  const [checking,      setChecking]      = useState(true);
  const [currentUser,   setCurrentUser]   = useState<SupabaseUser | null>(null);
  const [userRole,      setUserRole]      = useState<string | null>(null);

  // Login forms state
  const [loginMode,     setLoginMode]     = useState<"google" | "otp" | "password">("google");
  const [googleLoading, setGoogleLoading] = useState(false);
  const [loginEmail,    setLoginEmail]    = useState("");
  const [loginPass,     setLoginPass]     = useState("");
  const [loginLoading,  setLoginLoading]  = useState(false);
  const [loginErr,      setLoginErr]      = useState("");

  // OTP state
  const [otpStep,       setOtpStep]       = useState<"email" | "code">("email");
  const [otpEmail,      setOtpEmail]      = useState("");
  const [otpCode,       setOtpCode]       = useState("");
  const [otpLoading,    setOtpLoading]    = useState(false);
  const [otpMsg,        setOtpMsg]        = useState("");

  const [tab,           setTab]           = useState<AdminTab>("overview");
  const [toast,         setToast]         = useState<{ msg: string; ok: boolean } | null>(null);
  const [editingId,     setEditingId]     = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<OrderWithItems | null>(null);
  const [svcForm,       setSvcForm]       = useState<ServiceForm>(emptyService);
  const [svcSaving,     setSvcSaving]     = useState(false);

  const { services, loading: svcLoading, addService, updateService, deleteService } = useServices();
  const { config, saveConfig, isLoaded: cfgLoaded } = useSiteConfig();
  const { orders, loading: ordLoading, refetch: refetchOrders, updateOrderStatus } = useOrders();
  const [siteForm, setSiteForm] = useState(config);

  useEffect(() => {
    if (cfgLoaded) queueMicrotask(() => setSiteForm(config));
  }, [cfgLoaded, config]);

  const checkAuth = useCallback(async () => {
    setChecking(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        setAuthed(false);
        setCurrentUser(null);
        setUserRole(null);
        setChecking(false);
        return;
      }
      setCurrentUser(session.user);
      const { data } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .maybeSingle();

      const role = (data as { role?: string } | null)?.role ?? null;
      setUserRole(role);
      setAuthed(role === "admin");
    } catch {
      setAuthed(false);
    } finally {
      setChecking(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      checkAuth();
    });
    return () => subscription.unsubscribe();
  }, [checkAuth]);

  function showToast(msg: string, ok = true) {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3500);
  }

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setLoginErr("");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/admin`,
      },
    });
    if (error) {
      setLoginErr(error.message);
      setGoogleLoading(false);
    }
  };

  const handleSendOtp = async (e: FormEvent) => {
    e.preventDefault();
    if (!otpEmail.trim()) return;
    setOtpLoading(true);
    setLoginErr("");
    setOtpMsg("");
    const { error } = await supabase.auth.signInWithOtp({
      email: otpEmail.trim(),
      options: {
        shouldCreateUser: false,
        emailRedirectTo: undefined,
      },
    });
    if (error) {
      setLoginErr(error.message);
      setOtpLoading(false);
      return;
    }
    setOtpMsg(`A 6-digit access code was sent to ${otpEmail.trim()}`);
    setOtpStep("code");
    setOtpLoading(false);
  };

  const handleVerifyOtp = async (e: FormEvent) => {
    e.preventDefault();
    if (!otpCode.trim()) return;
    setOtpLoading(true);
    setLoginErr("");
    const { data, error } = await supabase.auth.verifyOtp({
      email: otpEmail.trim(),
      token: otpCode.trim(),
      type: "email",
    });
    if (error) {
      setLoginErr(error.message);
      setOtpLoading(false);
      return;
    }
    const userId = data.user?.id;
    if (!userId) {
      setLoginErr("Verification failed.");
      setOtpLoading(false);
      return;
    }
    const { data: profileData } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .maybeSingle();
    const profile = profileData as { role?: string } | null;
    if (profile?.role !== "admin") {
      await supabase.auth.signOut();
      setLoginErr(`The account '${otpEmail.trim()}' is not an admin (role: '${profile?.role || "customer"}').`);
      setOtpLoading(false);
      return;
    }
    setAuthed(true);
    setCurrentUser(data.user);
    setUserRole("admin");
    setOtpLoading(false);
  };

  const handlePasswordLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginErr("");
    const { error, data: signInData } = await supabase.auth.signInWithPassword({
      email: loginEmail.trim(),
      password: loginPass,
    });
    if (error) {
      setLoginErr(error.message);
      setLoginLoading(false);
      return;
    }
    const userId = signInData.user?.id;
    if (!userId) {
      setLoginErr("Login failed");
      setLoginLoading(false);
      return;
    }
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .maybeSingle();
    const profile = profileData as { role?: string } | null;
    if (profile?.role !== "admin") {
      await supabase.auth.signOut();
      setLoginErr(profileError ? `Profile fetch failed: ${profileError.message}` : profile === null
        ? `No profile row found for this account.`
        : `Account '${loginEmail}' has role '${profile?.role}', not 'admin'.`);
      setLoginLoading(false);
      return;
    }
    setAuthed(true);
    setCurrentUser(signInData.user);
    setUserRole("admin");
    setLoginLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setAuthed(false);
    setCurrentUser(null);
    setUserRole(null);
  };

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
      <div className="studio-shell grid min-h-[calc(100vh-9rem)] place-items-center py-10">
        <section className="studio-panel w-full max-w-md p-6 sm:p-8">
          <span className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-2xl bg-teal-500/12 text-teal-500">
            <Lock className="h-8 w-8" />
          </span>
          <p className="studio-kicker mx-auto w-fit"><ShieldCheck className="h-4 w-4" /> Admin Portal</p>
          <h1 className="mt-4 text-center text-3xl font-black text-[var(--color-text-primary)]">Admin login</h1>
          <p className="mt-2 text-center text-sm text-[var(--color-text-muted)]">
            Sign in with your verified administrator account to access the control room.
          </p>

          {/* If signed in as non-admin */}
          {currentUser && userRole !== "admin" && (
            <div className="mt-6 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-left">
              <div className="flex items-start gap-3">
                <ShieldAlert className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <p className="font-bold text-[var(--color-text-primary)]">
                    Signed in as: <span className="text-amber-500">{currentUser.email}</span>
                  </p>
                  <p className="text-[var(--color-text-muted)]">
                    Current role: <strong>{userRole || "customer"}</strong>. This account does not have admin permissions.
                  </p>
                  <p className="text-[var(--color-text-muted)] pt-1">
                    Please sign in with your admin account (e.g. <strong>gowthamhegde606@gmail.com</strong>).
                  </p>
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="px-3 py-1.5 rounded-lg border border-amber-500/40 bg-amber-500/20 text-xs font-bold text-amber-400 hover:bg-amber-500/30 transition cursor-pointer"
                    >
                      Sign out &amp; switch account
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Error banner */}
          {loginErr && (
            <div className="mt-6 flex items-start gap-2.5 rounded-xl border border-red-500/30 bg-red-500/10 p-3.5 text-xs font-bold text-red-500">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{loginErr}</span>
            </div>
          )}

          {/* OTP success banner */}
          {otpMsg && (
            <div className="mt-6 flex items-start gap-2.5 rounded-xl border border-teal-500/30 bg-teal-500/10 p-3.5 text-xs font-bold text-teal-400">
              <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{otpMsg}</span>
            </div>
          )}

          {/* Primary Action: Google Login */}
          <div className="mt-6 space-y-3">
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={googleLoading || loginLoading || otpLoading}
              className="studio-secondary-button w-full flex items-center justify-center gap-3 text-sm font-black shadow-sm hover:shadow transition"
              style={{ minHeight: "50px" }}
            >
              {googleLoading ? <Loader2 className="h-4 w-4 animate-spin text-teal-500" /> : GOOGLE_ICON}
              <span>Continue with Google</span>
            </button>
          </div>

          {/* Divider */}
          <div className="relative my-6 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[rgba(148,163,184,0.2)]" />
            </div>
            <span className="relative bg-[var(--color-background-primary)] px-3 text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
              or use email
            </span>
          </div>

          {/* Alternate Login Toggle Tabs */}
          <div className="flex rounded-xl bg-slate-100 p-1 dark:bg-slate-800/60 mb-5">
            <button
              type="button"
              onClick={() => { setLoginMode("otp"); setLoginErr(""); }}
              className={`flex-1 py-1.5 text-xs font-black rounded-lg transition ${
                loginMode === "otp"
                  ? "bg-white text-teal-600 shadow-sm dark:bg-slate-900 dark:text-teal-400"
                  : "text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
              }`}
            >
              Email OTP
            </button>
            <button
              type="button"
              onClick={() => { setLoginMode("password"); setLoginErr(""); }}
              className={`flex-1 py-1.5 text-xs font-black rounded-lg transition ${
                loginMode === "password"
                  ? "bg-white text-teal-600 shadow-sm dark:bg-slate-900 dark:text-teal-400"
                  : "text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
              }`}
            >
              Password
            </button>
          </div>

          {/* Mode 1: Email OTP */}
          {loginMode === "otp" && (
            otpStep === "email" ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <label className="grid gap-2 text-sm font-bold text-[var(--color-text-primary)]">
                  Admin Email
                  <input
                    value={otpEmail}
                    onChange={e => setOtpEmail(e.target.value)}
                    type="email"
                    className="studio-input"
                    placeholder="gowthamhegde606@gmail.com"
                    required
                  />
                </label>
                <button type="submit" disabled={otpLoading} className="studio-button w-full">
                  {otpLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> Sending code…</> : <>Send one-time code <ArrowRight className="h-4 w-4" /></>}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <label className="grid gap-2 text-sm font-bold text-[var(--color-text-primary)]">
                  Enter 6-digit Code
                  <input
                    value={otpCode}
                    onChange={e => setOtpCode(e.target.value.trim())}
                    type="text"
                    maxLength={6}
                    className="studio-input text-center text-xl tracking-widest font-mono"
                    placeholder="123456"
                    required
                    autoFocus
                  />
                </label>
                <button type="submit" disabled={otpLoading || otpCode.length < 6} className="studio-button w-full">
                  {otpLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> Verifying…</> : "Verify & access"}
                </button>
                <div className="text-center pt-1">
                  <button
                    type="button"
                    onClick={() => { setOtpStep("email"); setOtpMsg(""); setLoginErr(""); }}
                    className="text-xs font-bold text-teal-500 hover:underline"
                  >
                    ← Change email or resend
                  </button>
                </div>
              </form>
            )
          )}

          {/* Mode 2: Password Login */}
          {loginMode === "password" && (
            <form onSubmit={handlePasswordLogin} className="space-y-4">
              <label className="grid gap-2 text-sm font-bold text-[var(--color-text-primary)]">
                Email
                <input
                  value={loginEmail}
                  onChange={e => setLoginEmail(e.target.value)}
                  type="email"
                  className="studio-input"
                  placeholder="admin@example.com"
                  required
                />
              </label>
              <label className="grid gap-2 text-sm font-bold text-[var(--color-text-primary)]">
                Password
                <input
                  value={loginPass}
                  onChange={e => setLoginPass(e.target.value)}
                  type="password"
                  className="studio-input"
                  placeholder="••••••••"
                  required
                />
              </label>
              <button type="submit" disabled={loginLoading} className="studio-button w-full">
                {loginLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> Signing in…</> : "Access dashboard"}
              </button>
            </form>
          )}
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
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
          <div>
            <p className="studio-kicker"><Sparkles className="h-4 w-4" /> Admin dashboard</p>
            <h1 className="studio-title">Control room</h1>
            {currentUser?.email && (
              <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", marginTop: 4 }}>
                Logged in as <strong style={{ color: "#14b8a6" }}>{currentUser.email}</strong>
              </p>
            )}
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
