"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  BarChart3,
  Edit2,
  Lock,
  LogOut,
  Plus,
  Save,
  Settings,
  ShieldCheck,
  Sparkles,
  Trash2,
} from "lucide-react";
import { type Service, useServices } from "@/hooks/useServices";
import { useSiteConfig } from "@/hooks/useSiteConfig";

type AdminTab = "services" | "site";
type ServiceForm = Omit<Service, "id">;

const emptyService: ServiceForm = {
  name: "",
  description: "",
  price: 0,
  category: "Wash",
  icon: "washing",
};

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginId, setLoginId] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [activeTab, setActiveTab] = useState<AdminTab>("services");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<ServiceForm>(emptyService);
  const [savedMessage, setSavedMessage] = useState("");

  const { services, addService, updateService, deleteService } = useServices();
  const { config, saveConfig } = useSiteConfig();
  const [siteForm, setSiteForm] = useState(config);

  useEffect(() => {
    queueMicrotask(() => {
      setIsAuthenticated(sessionStorage.getItem("admin_auth") === "true");
      setSiteForm(config);
    });
  }, [config]);

  const totalValue = useMemo(() => services.reduce((sum, service) => sum + service.price, 0), [services]);

  const handleLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loginId === "admin" && loginPassword === "admin123") {
      setIsAuthenticated(true);
      sessionStorage.setItem("admin_auth", "true");
      setLoginError("");
      return;
    }

    setLoginError("Invalid ID or password");
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("admin_auth");
  };

  const handleSave = () => {
    if (!formData.name.trim() || !formData.description.trim()) return;

    if (editingId) {
      updateService(editingId, formData);
      setEditingId(null);
      setSavedMessage("Service updated");
    } else {
      addService(formData);
      setSavedMessage("Service added");
    }

    setFormData(emptyService);
  };

  const handleEdit = (service: Service) => {
    setEditingId(service.id);
    setFormData({
      name: service.name,
      description: service.description,
      price: service.price,
      category: service.category,
      icon: service.icon || "washing",
      badge: service.badge,
    });
    setActiveTab("services");
  };

  const handleSaveSiteConfig = () => {
    saveConfig(siteForm);
    setSavedMessage("Site configuration saved");
  };

  if (!isAuthenticated) {
    return (
      <div className="studio-page">
        <div className="studio-shell grid min-h-[calc(100vh-9rem)] place-items-center">
          <section className="studio-panel w-full max-w-md p-6 sm:p-8">
            <span className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-lg bg-teal-500/12 text-teal-500">
              <Lock className="h-8 w-8" />
            </span>
            <p className="studio-kicker mx-auto w-fit">
              <ShieldCheck className="h-4 w-4" />
              Staff only
            </p>
            <h1 className="mt-5 text-center text-3xl font-black text-[var(--color-text-primary)]">Admin login</h1>
            <p className="mt-2 text-center text-sm text-[var(--color-text-muted)]">Use the demo admin credentials to manage services and site copy.</p>

            <form onSubmit={handleLogin} className="mt-7 space-y-4">
              {loginError ? <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-center text-sm font-bold text-red-700">{loginError}</p> : null}
              <label className="grid gap-2 text-sm font-bold text-[var(--color-text-primary)]">
                Admin ID
                <input value={loginId} onChange={(event) => setLoginId(event.target.value)} className="studio-input" placeholder="admin" required />
              </label>
              <label className="grid gap-2 text-sm font-bold text-[var(--color-text-primary)]">
                Password
                <input value={loginPassword} onChange={(event) => setLoginPassword(event.target.value)} type="password" className="studio-input" placeholder="admin123" required />
              </label>
              <button type="submit" className="studio-button w-full">
                Access dashboard
              </button>
            </form>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="studio-page">
      <div className="studio-shell">
        <header className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div>
            <p className="studio-kicker">
              <Sparkles className="h-4 w-4" />
              Operator dashboard
            </p>
            <h1 className="studio-title">Control room</h1>
            <p className="studio-copy">Tune the customer-facing menu, update brand copy, and keep the laundry catalog feeling current.</p>
          </div>
          <button onClick={handleLogout} className="studio-secondary-button">
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </header>

        <section className="mt-10 grid gap-4 md:grid-cols-3">
          <div className="studio-panel p-5">
            <p className="text-sm font-bold text-[var(--color-text-muted)]">Active services</p>
            <p className="mt-2 text-4xl font-black text-[var(--color-text-primary)]">{services.length}</p>
          </div>
          <div className="studio-panel p-5">
            <p className="text-sm font-bold text-[var(--color-text-muted)]">Catalog value</p>
            <p className="mt-2 text-4xl font-black text-teal-700 dark:text-teal-300">Rs. {totalValue}</p>
          </div>
          <div className="studio-panel p-5">
            <p className="text-sm font-bold text-[var(--color-text-muted)]">Brand</p>
            <p className="mt-2 text-4xl font-black text-[var(--color-text-primary)]">{siteForm.companyName || "FreshWash"}</p>
          </div>
        </section>

        <div className="mt-8 grid gap-8 lg:grid-cols-[260px_minmax(0,1fr)]">
          <aside className="studio-panel h-fit p-3">
            {[
              { id: "services" as const, label: "Manage services", icon: BarChart3 },
              { id: "site" as const, label: "Site configuration", icon: Settings },
            ].map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex min-h-12 w-full items-center gap-3 rounded-lg px-4 text-left text-sm font-black transition ${
                    active ? "bg-teal-500 text-white shadow-lg shadow-teal-500/20" : "text-[var(--color-text-muted)] hover:bg-teal-500/10 hover:text-[var(--color-text-primary)]"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {tab.label}
                </button>
              );
            })}
          </aside>

          <main className="space-y-6">
            {savedMessage ? <p className="studio-panel p-4 text-sm font-black text-teal-700 dark:text-teal-300">{savedMessage}</p> : null}

            {activeTab === "services" ? (
              <>
                <section className="studio-panel p-5 sm:p-6">
                  <h2 className="mb-5 text-xl font-black text-[var(--color-text-primary)]">{editingId ? "Edit service" : "Add service"}</h2>
                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="grid gap-2 text-sm font-bold text-[var(--color-text-primary)]">
                      Service name
                      <input value={formData.name} onChange={(event) => setFormData({ ...formData, name: event.target.value })} className="studio-input" />
                    </label>
                    <label className="grid gap-2 text-sm font-bold text-[var(--color-text-primary)]">
                      Category
                      <select value={formData.category} onChange={(event) => setFormData({ ...formData, category: event.target.value })} className="studio-input">
                        <option>Wash</option>
                        <option>Iron</option>
                        <option>Dry Clean</option>
                        <option>Repair</option>
                        <option>Per kg</option>
                        <option>Per piece</option>
                      </select>
                    </label>
                    <label className="grid gap-2 text-sm font-bold text-[var(--color-text-primary)] md:col-span-2">
                      Description
                      <input value={formData.description} onChange={(event) => setFormData({ ...formData, description: event.target.value })} className="studio-input" />
                    </label>
                    <label className="grid gap-2 text-sm font-bold text-[var(--color-text-primary)]">
                      Price
                      <input value={formData.price} onChange={(event) => setFormData({ ...formData, price: Number(event.target.value) || 0 })} type="number" className="studio-input" />
                    </label>
                    <label className="grid gap-2 text-sm font-bold text-[var(--color-text-primary)]">
                      Badge
                      <input value={formData.badge || ""} onChange={(event) => setFormData({ ...formData, badge: event.target.value || undefined })} className="studio-input" placeholder="Popular" />
                    </label>
                  </div>
                  <button onClick={handleSave} className="studio-button mt-5">
                    {editingId ? <Edit2 className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                    {editingId ? "Update service" : "Add service"}
                  </button>
                </section>

                <section className="studio-panel overflow-hidden">
                  <div className="overflow-x-auto">
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
                        {services.map((service) => (
                          <tr key={service.id} className="transition hover:bg-teal-500/5">
                            <td className="px-5 py-4">
                              <p className="font-black text-[var(--color-text-primary)]">{service.name}</p>
                              <p className="mt-1 text-[var(--color-text-muted)]">{service.description}</p>
                            </td>
                            <td className="px-5 py-4">
                              <span className="rounded-full bg-blue-500/10 px-3 py-1 font-black text-blue-700 dark:text-blue-300">{service.category}</span>
                            </td>
                            <td className="px-5 py-4 font-black text-[var(--color-text-primary)]">Rs. {service.price}</td>
                            <td className="px-5 py-4">
                              <div className="flex justify-end gap-2">
                                <button onClick={() => handleEdit(service)} className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-teal-600 hover:bg-teal-500/10 dark:border-slate-800" aria-label={`Edit ${service.name}`}>
                                  <Edit2 className="h-4 w-4" />
                                </button>
                                <button onClick={() => deleteService(service.id)} className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-red-600 hover:bg-red-500/10 dark:border-slate-800" aria-label={`Delete ${service.name}`}>
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              </>
            ) : (
              <section className="studio-panel p-5 sm:p-6">
                <h2 className="mb-5 flex items-center gap-2 text-xl font-black text-[var(--color-text-primary)]">
                  <Settings className="h-5 w-5 text-teal-500" />
                  Main configuration
                </h2>
                <div className="grid gap-4">
                  <label className="grid gap-2 text-sm font-bold text-[var(--color-text-primary)]">
                    Company name
                    <input value={siteForm.companyName} onChange={(event) => setSiteForm({ ...siteForm, companyName: event.target.value })} className="studio-input" />
                  </label>
                  <label className="grid gap-2 text-sm font-bold text-[var(--color-text-primary)]">
                    Hero title
                    <input value={siteForm.heroTitle} onChange={(event) => setSiteForm({ ...siteForm, heroTitle: event.target.value })} className="studio-input" />
                  </label>
                  <label className="grid gap-2 text-sm font-bold text-[var(--color-text-primary)]">
                    Hero subtitle
                    <textarea value={siteForm.heroSubtitle} onChange={(event) => setSiteForm({ ...siteForm, heroSubtitle: event.target.value })} className="studio-input min-h-28 py-3" />
                  </label>
                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="grid gap-2 text-sm font-bold text-[var(--color-text-primary)]">
                      Contact email
                      <input value={siteForm.contactEmail} onChange={(event) => setSiteForm({ ...siteForm, contactEmail: event.target.value })} type="email" className="studio-input" />
                    </label>
                    <label className="grid gap-2 text-sm font-bold text-[var(--color-text-primary)]">
                      Contact phone
                      <input value={siteForm.contactPhone} onChange={(event) => setSiteForm({ ...siteForm, contactPhone: event.target.value })} className="studio-input" />
                    </label>
                  </div>
                </div>
                <button onClick={handleSaveSiteConfig} className="studio-button mt-5">
                  <Save className="h-5 w-5" />
                  Save application config
                </button>
              </section>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
