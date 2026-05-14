"use client";

import { useState, useEffect } from "react";
import { useServices, Service } from "@/hooks/useServices";
import { useSiteConfig } from "@/hooks/useSiteConfig";
import { Plus, Edit2, Trash2, Lock, Settings } from "lucide-react";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginId, setLoginId] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [activeTab, setActiveTab] = useState('services');

  const { services, addService, updateService, deleteService } = useServices();
  const { config, saveConfig } = useSiteConfig();
  
  const [siteForm, setSiteForm] = useState(config);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '', price: 0, category: 'Wash' });

  useEffect(() => {
    const auth = sessionStorage.getItem("admin_auth");
    if (auth === "true") setIsAuthenticated(true);
    setSiteForm(config);
  }, [config]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginId === "admin" && loginPassword === "admin123") {
      setIsAuthenticated(true);
      sessionStorage.setItem("admin_auth", "true");
      setLoginError("");
    } else {
      setLoginError("Invalid ID or Password");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("admin_auth");
  };

  const handleSave = () => {
    if (editingId) {
      updateService(editingId, formData);
      setEditingId(null);
    } else {
      addService(formData);
    }
    setFormData({ name: '', description: '', price: 0, category: 'Wash' });
  };

  const handleEdit = (srv: Service) => {
    setEditingId(srv.id);
    setFormData({ name: srv.name, description: srv.description, price: srv.price, category: srv.category });
  };

  const handleSaveSiteConfig = () => {
    saveConfig(siteForm);
    alert("Site configuration saved!");
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 max-w-md w-full">
          <div className="flex justify-center mb-6">
            <div className="bg-teal-100 p-4 rounded-full">
              <Lock className="h-8 w-8 text-teal-600" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-center text-gray-900 mb-6">Admin Login</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            {loginError && <p className="text-red-500 text-sm text-center font-medium bg-red-50 p-2 rounded-lg">{loginError}</p>}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Admin ID</label>
              <input 
                type="text" 
                value={loginId} 
                onChange={(e) => setLoginId(e.target.value)} 
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500" 
                placeholder="Enter admin ID"
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input 
                type="password" 
                value={loginPassword} 
                onChange={(e) => setLoginPassword(e.target.value)} 
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500" 
                placeholder="Enter password"
                required 
              />
            </div>
            <button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-xl transition-all mt-4">
              Access Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full flex flex-col md:flex-row gap-8">
      
      {/* Sidebar sidebar options */}
      <div className="md:w-64 flex-shrink-0">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>
        <div className="space-y-2">
          <button 
            onClick={() => setActiveTab('services')}
            className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'services' ? 'bg-teal-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            Manage Services
          </button>
          <button 
            onClick={() => setActiveTab('site')}
            className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'site' ? 'bg-teal-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            Site Configuration
          </button>
        </div>
        <button onClick={handleLogout} className="mt-8 w-full text-sm font-semibold text-red-600 bg-red-50 px-4 py-3 rounded-xl hover:bg-red-100 transition-colors">
          Logout
        </button>
      </div>

      <div className="flex-1">
        {activeTab === 'services' && (
          <div>
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">{editingId ? 'Edit Service' : 'Add New Service'}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Service Name</label>
                  <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                    <option>Wash</option><option>Iron</option><option>Dry Clean</option><option>Repair</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price ($)</label>
                  <input type="number" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500" value={formData.price} onChange={e => setFormData({...formData, price: parseFloat(e.target.value) || 0})} />
                </div>
              </div>
              <button onClick={handleSave} className="bg-gray-900 hover:bg-black text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2">
                {editingId ? <Edit2 className="h-4 w-4" /> : <Plus className="h-4 w-4" />} {editingId ? 'Update Service' : 'Add Service'}
              </button>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Service</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {services.map(srv => (
                    <tr key={srv.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="text-sm font-bold text-gray-900">{srv.name}</div>
                        <div className="text-sm text-gray-500">{srv.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap"><span className="px-3 py-1 inline-flex text-xs font-semibold rounded-full bg-gray-100 text-gray-600">{srv.category}</span></td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${srv.price.toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                        <button onClick={() => handleEdit(srv)} className="text-teal-600 hover:text-teal-900">Edit</button>
                        <button onClick={() => deleteService(srv.id)} className="text-red-600 hover:text-red-900">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'site' && (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2"><Settings className="h-5 w-5" /> Main Configuration</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company Name (Navbar & Footer)</label>
                <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500" value={siteForm.companyName} onChange={e => setSiteForm({...siteForm, companyName: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hero Title (Homepage)</label>
                <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500" value={siteForm.heroTitle} onChange={e => setSiteForm({...siteForm, heroTitle: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hero Subtitle</label>
                <textarea className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500" rows={3} value={siteForm.heroSubtitle} onChange={e => setSiteForm({...siteForm, heroSubtitle: e.target.value})} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Contact Email</label>
                  <input type="email" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500" value={siteForm.contactEmail} onChange={e => setSiteForm({...siteForm, contactEmail: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Contact Phone</label>
                  <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500" value={siteForm.contactPhone} onChange={e => setSiteForm({...siteForm, contactPhone: e.target.value})} />
                </div>
              </div>
              <button onClick={handleSaveSiteConfig} className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md mt-4">
                Save Application Config
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
