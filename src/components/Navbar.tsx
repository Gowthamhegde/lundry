"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Moon, Shirt, Sun, X } from "lucide-react";
import { useSiteConfig } from "@/hooks/useSiteConfig";
import { useThemeToggle } from "@/hooks/useThemeToggle";
import { useEffect, useRef, useState } from "react";

const navLinks = [
  { name: "Home",     path: "/" },
  { name: "Services", path: "/services" },
  { name: "Order",    path: "/order" },
  { name: "Track",    path: "/track" },
  { name: "Login",    path: "/login" },
];

export default function Navbar() {
  const pathname    = usePathname();
  const { config }  = useSiteConfig();
  const toggleTheme = useThemeToggle();
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  /* Scroll shadow */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Close mobile menu on outside click */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  /* Close on route change */
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  return (
    <nav
      className={`fixed w-full z-50 top-0 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl shadow-lg shadow-black/5 dark:shadow-black/30 border-b border-gray-200/60 dark:border-slate-800/60"
          : "bg-white/60 dark:bg-slate-950/60 backdrop-blur-md border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">

          {/* ── Logo ── */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <div className="relative">
              <div className="absolute inset-0 bg-teal-500/30 rounded-2xl blur-md group-hover:blur-lg transition-all duration-300" />
              <div className="relative bg-gradient-to-br from-teal-400 via-teal-500 to-emerald-600 p-2.5 rounded-2xl shadow-md group-hover:scale-105 transition-transform duration-300">
                <Shirt className="h-5 w-5 text-white" />
              </div>
            </div>
            <span className="text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-emerald-500 dark:from-teal-400 dark:to-emerald-400 tracking-tight">
              {config.companyName || "FreshWash"}
            </span>
          </Link>

          {/* ── Desktop nav links ── */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((nav) => {
              const isActive = pathname === nav.path;
              return (
                <Link
                  key={nav.path}
                  href={nav.path}
                  className={`relative px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 group ${
                    isActive
                      ? "text-teal-700 dark:text-teal-300"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                  }`}
                >
                  {/* Pill background on active */}
                  {isActive && (
                    <span className="absolute inset-0 rounded-full bg-teal-50 dark:bg-teal-500/10 ring-1 ring-teal-200/60 dark:ring-teal-500/20" />
                  )}
                  {/* Hover background */}
                  <span className="absolute inset-0 rounded-full bg-gray-100 dark:bg-slate-800 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  <span className="relative">{nav.name}</span>
                  {/* Active dot */}
                  {isActive && (
                    <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-teal-500" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* ── Right actions ── */}
          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-gray-100 transition-all duration-200"
              aria-label="Toggle dark mode"
            >
              <Sun className="theme-icon theme-icon-sun h-4.5 w-4.5" />
              <Moon className="theme-icon theme-icon-moon h-4.5 w-4.5" />
            </button>

            {/* Book Now CTA */}
            <Link
              href="/order"
              className="hidden sm:inline-flex items-center gap-2 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white px-5 py-2 rounded-full font-bold text-sm transition-all duration-200 shadow-md shadow-teal-500/20 hover:shadow-teal-500/40 hover:-translate-y-px active:translate-y-0"
            >
              Book Now
            </Link>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="md:hidden p-2.5 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile dropdown ── */}
      <div
        ref={menuRef}
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl border-t border-gray-100 dark:border-slate-800 px-4 pb-4 pt-2 space-y-1">
          {navLinks.map((nav) => {
            const isActive = pathname === nav.path;
            return (
              <Link
                key={nav.path}
                href={nav.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-teal-50 dark:bg-teal-500/10 text-teal-700 dark:text-teal-300"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800/60"
                }`}
              >
                {isActive && <span className="w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0" />}
                {nav.name}
              </Link>
            );
          })}
          <div className="pt-2 border-t border-gray-100 dark:border-slate-800">
            <Link
              href="/order"
              className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-teal-500 to-emerald-500 text-white px-5 py-3 rounded-xl font-bold text-sm shadow-md shadow-teal-500/20"
            >
              Book Now
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
