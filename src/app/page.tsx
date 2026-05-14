"use client";
import Link from 'next/link';
import { ArrowRight, Sparkles, Clock, ShieldCheck } from 'lucide-react';
import { useSiteConfig } from '@/hooks/useSiteConfig';

export default function Home() {
  const { config, isLoaded } = useSiteConfig();

  if (!isLoaded) return null;

  return (
    <div className="flex flex-col items-center overflow-x-hidden">
      {/* Hero Section with HIFI effects */}
      <section className="w-full relative bg-white dark:bg-slate-950 py-32 lg:py-48 overflow-hidden transition-colors duration-300">
        
        {/* Abstract Glowing Blobs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-400/20 dark:bg-teal-600/20 rounded-full blur-[128px] pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-400/20 dark:bg-emerald-600/20 rounded-full blur-[128px] pointer-events-none"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-teal-100/50 via-transparent to-transparent dark:from-teal-900/20 opacity-50"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-50 dark:bg-teal-500/10 text-teal-700 dark:text-teal-300 text-sm font-semibold mb-8 border border-teal-200/50 dark:border-teal-500/20 animate-fade-in-up">
            <Sparkles className="h-4 w-4" /> Leading Laundry Service
          </div>
          
          <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-8 max-w-5xl mx-auto leading-tight drop-shadow-sm">
            {config.heroTitle}
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 mb-10 max-w-2xl mx-auto font-medium">
            {config.heroSubtitle}
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 w-full sm:w-auto">
            <Link href="/services" className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white px-10 py-5 rounded-full font-bold text-lg transition-all duration-300 shadow-[0_0_40px_rgba(20,184,166,0.3)] hover:shadow-[0_0_60px_rgba(20,184,166,0.5)] hover:-translate-y-1 flex items-center justify-center gap-3">
              Explore Services <ArrowRight className="h-6 w-6" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features feature */}
      <section className="w-full bg-slate-50 dark:bg-slate-900 py-32 border-t border-slate-200/50 dark:border-slate-800/50 transition-colors duration-300 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">Why Choose Us</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">Industry leading standards to give your clothes the perfection they deserve.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <FeatureCard 
              icon={<Sparkles className="h-8 w-8 text-teal-500 dark:text-teal-400" />}
              title="Premium Quality"
              description="We use eco-friendly, high-end detergents to ensure your clothes stay vibrant and last longer."
              delay="0"
            />
            <FeatureCard 
              icon={<Clock className="h-8 w-8 text-emerald-500 dark:text-emerald-400" />}
              title="Fast Turnaround"
              description="Get your laundry back in 24 hours with our express service. We respect your time."
              delay="100"
            />
            <FeatureCard 
              icon={<ShieldCheck className="h-8 w-8 text-indigo-500 dark:text-indigo-400" />}
              title="Care Guarantee"
              description="Your garments are insured and handled by trained professionals with the utmost care."
              delay="200"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description, delay }: { icon: React.ReactNode, title: string, description: string, delay: string }) {
  return (
    <div 
      className="bg-white dark:bg-slate-950 p-10 rounded-[2rem] shadow-xl shadow-slate-200/20 dark:shadow-none border border-slate-100 dark:border-slate-800 hover:border-teal-500/30 dark:hover:border-teal-500/30 transition-all duration-300 group hover:-translate-y-2 relative overflow-hidden"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-teal-500/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div className="w-20 h-20 bg-teal-50 dark:bg-teal-500/10 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">{title}</h3>
      <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">{description}</p>
    </div>
  );
}
