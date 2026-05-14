"use client";

import { useState } from "react";
import { useServices, Service } from "@/hooks/useServices";
import { CheckCircle2, ChevronRight } from "lucide-react";

export default function ServicesPage() {
  const { services } = useServices();
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  const toggleService = (id: string) => {
    setSelectedServices(prev => 
      prev.includes(id) ? prev.filter(sId => sId !== id) : [...prev, id]
    );
  };

  const total = services
    .filter(s => selectedServices.includes(s.id))
    .reduce((sum, s) => sum + s.price, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-24 w-full">
      <div className="text-center mb-16 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-teal-500/10 dark:bg-teal-500/20 blur-[100px] pointer-events-none rounded-full"></div>
        <h1 className="text-5xl font-extrabold text-slate-900 dark:text-white mb-6 drop-shadow-sm relative z-10">Our Premium Services</h1>
        <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto relative z-10 font-medium">Select the services you need and we will handle the rest with the highest care possible.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6 relative z-10">
          {services.map(service => {
            const isSelected = selectedServices.includes(service.id);
            return (
              <div 
                key={service.id} 
                onClick={() => toggleService(service.id)}
                className={`cursor-pointer rounded-3xl p-8 border-2 transition-all duration-300 transform hover:-translate-y-1 ${
                  isSelected 
                    ? 'border-teal-500 shadow-xl shadow-teal-500/20 dark:shadow-teal-900/40 bg-teal-50/50 dark:bg-teal-900/20' 
                    : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 hover:border-teal-300 dark:hover:border-teal-700 hover:shadow-lg'
                }`}
              >
                <div className="flex justify-between items-start mb-6">
                  <span className="inline-block px-4 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold rounded-full uppercase tracking-wider">
                    {service.category}
                  </span>
                  {isSelected && <CheckCircle2 className="text-teal-500 dark:text-teal-400 h-7 w-7 animate-in zoom-in" />}
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">{service.name}</h3>
                <p className="text-slate-500 dark:text-slate-400 mb-8 min-h-[3rem] font-medium">{service.description}</p>
                <div className="text-3xl font-extrabold text-slate-900 dark:text-white">${service.price.toFixed(2)}</div>
              </div>
            );
          })}
        </div>

        {/* Sidebar Summary */}
        <div className="relative z-10">
          <div className="bg-white dark:bg-slate-950 p-8 rounded-[2rem] shadow-2xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 h-fit sticky top-32">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8 border-b border-slate-100 dark:border-slate-800 pb-4">Your Selection</h2>
            {selectedServices.length === 0 ? (
              <p className="text-slate-500 dark:text-slate-400 font-medium py-8 text-center bg-slate-50 dark:bg-slate-900/50 rounded-2xl">No services selected yet.</p>
            ) : (
              <div className="space-y-4 mb-8">
                {services.filter(s => selectedServices.includes(s.id)).map(s => (
                  <div key={s.id} className="flex justify-between items-center text-base font-semibold bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl">
                    <span className="text-slate-700 dark:text-slate-300">{s.name}</span>
                    <span className="text-slate-900 dark:text-white">${s.price.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            )}
            
            <div className="mt-8 border-t border-slate-100 dark:border-slate-800 pt-8">
              <div className="flex justify-between items-center mb-8">
                <span className="text-lg text-slate-500 dark:text-slate-400 font-bold">Total Estimated</span>
                <span className="text-4xl font-extrabold text-slate-900 dark:text-white">${total.toFixed(2)}</span>
              </div>
              <button 
                disabled={selectedServices.length === 0}
                className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-white py-5 rounded-2xl font-bold text-lg transition-all flex justify-center items-center gap-2 shadow-[0_0_20px_rgba(20,184,166,0.3)] hover:shadow-[0_0_30px_rgba(20,184,166,0.5)]"
              >
                Continue to Booking <ChevronRight className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
