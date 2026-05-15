"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shirt, Moon, Sun } from 'lucide-react';
import { useSiteConfig } from '@/hooks/useSiteConfig';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const { config } = useSiteConfig();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const navs = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'About', path: '/about' },
    { name: 'Pricelist', path: '/pricelist' },
    { name: 'Contact', path: '/contact' },
    { name: 'Login', path: '/login' }
  ];

  return (
    <nav className="fixed w-full z-50 top-0 border-b border-gray-200/50 dark:border-slate-800/50 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo Section */}
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="bg-gradient-to-br from-teal-500 to-emerald-600 p-2.5 rounded-2xl shadow-lg shadow-teal-500/30 group-hover:shadow-teal-500/50 transition-all duration-300 group-hover:scale-105">
              <Shirt className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-emerald-600 dark:from-teal-400 dark:to-emerald-400 tracking-tight">
              {config.companyName || "FreshWash"}
            </span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            {navs.map((nav) => {
              const isActive = pathname === nav.path;
              return (
                <Link 
                  key={nav.path} 
                  href={nav.path}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                    isActive 
                    ? 'bg-teal-50 dark:bg-teal-500/10 text-teal-700 dark:text-teal-300' 
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-teal-600 dark:hover:text-teal-400'
                  }`}
                >
                  {nav.name}
                </Link>
              );
            })}
          </div>

          {/* Actions: Theme Toggle & CTA */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2.5 rounded-full bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
              aria-label="Toggle Dark Mode"
            >
              {mounted && (
                theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />
              )}
            </button>
            <button className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white px-6 py-2.5 rounded-full font-bold text-sm transition-all duration-300 shadow-[0_0_20px_rgba(20,184,166,0.3)] hover:shadow-[0_0_25px_rgba(20,184,166,0.5)] hover:-translate-y-0.5">
              Book Now
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
