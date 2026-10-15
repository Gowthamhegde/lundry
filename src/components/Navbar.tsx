"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ArrowRight, LogIn, LogOut, Menu, Moon, Shirt, Sun, X } from "lucide-react";
import { useSiteConfig } from "@/hooks/useSiteConfig";
import { useThemeToggle } from "@/hooks/useThemeToggle";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

const publicLinks = [
  { name: "Home", path: "/" },
  { name: "Services", path: "/services" },
];

const authLinks = [
  { name: "Order", path: "/order" },
  { name: "Track", path: "/track" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { config } = useSiteConfig();
  const toggleTheme = useThemeToggle();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [authed, setAuthed] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setAuthed(!!session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthed(!!session);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    queueMicrotask(() => setMenuOpen(false));
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
        return;
      }
      if (event.key !== "Tab" || !menuRef.current) return;
      const focusable = menuRef.current.querySelectorAll<HTMLElement>("a, button");
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    menuRef.current?.querySelector<HTMLElement>("a, button")?.focus();
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [menuOpen]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const visibleLinks = authed ? [...publicLinks, ...authLinks] : publicLinks;
  const isActive = (path: string) => path === "/" ? pathname === "/" : pathname.startsWith(path);

  return (
    <>
      <a href="#main-content" className="skip-link">Skip to content</a>
      <header className={`site-nav ${scrolled ? "site-nav--scrolled" : ""}`}>
        <div className="site-nav__utility">
          <div className="site-nav__inner">
            <span>Bengaluru · garment care, without the fuss</span>
            <span className="site-nav__utility-right">
              <span>Payments by Razorpay</span>
              <Link href={authed ? "/track" : "/login"}>{authed ? "Your orders" : "Sign in"}</Link>
            </span>
          </div>
        </div>

        <div className="site-nav__main site-nav__inner">
          <Link href="/" className="site-nav__brand" aria-label="RinseUp home">
            <span className="site-nav__mark"><Shirt size={20} strokeWidth={2.4} /></span>
            <span>{config.companyName || "RinseUp"}</span>
          </Link>

          <nav className="site-nav__links" aria-label="Main navigation">
            {visibleLinks.map((nav) => (
              <Link key={nav.path} href={nav.path} className={`site-nav__link ${isActive(nav.path) ? "is-active" : ""}`} aria-current={isActive(nav.path) ? "page" : undefined}>
                {nav.name}
              </Link>
            ))}
          </nav>

          <div className="site-nav__actions">
            <button type="button" onClick={toggleTheme} className="site-nav__icon-button" aria-label="Toggle dark mode">
              <Sun className="theme-icon theme-icon-sun" size={17} />
              <Moon className="theme-icon theme-icon-moon" size={17} />
            </button>
            {authed ? (
              <>
                <Link href="/order" className="nav-action nav-action--primary">Schedule pickup <ArrowRight size={15} /></Link>
                <button type="button" onClick={handleLogout} className="nav-action nav-action--quiet"><LogOut size={15} /> Log out</button>
              </>
            ) : (
              <>
                <Link href="/login" className="nav-action nav-action--quiet"><LogIn size={15} /> Sign in</Link>
                <Link href="/signup" className="nav-action nav-action--primary">Get started <ArrowRight size={15} /></Link>
              </>
            )}
            <button ref={menuButtonRef} type="button" onClick={() => setMenuOpen((open) => !open)} className="site-nav__menu-button" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} aria-controls="mobile-navigation">
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        <div id="mobile-navigation" ref={menuRef} className={`site-nav__mobile ${menuOpen ? "is-open" : ""}`} aria-hidden={!menuOpen}>
          <div className="site-nav__mobile-heading">Menu <span>RinseUp / 01</span></div>
          <nav aria-label="Mobile navigation">
            {visibleLinks.map((nav, index) => (
              <Link key={nav.path} href={nav.path} className={`site-nav__mobile-link ${isActive(nav.path) ? "is-active" : ""}`} aria-current={isActive(nav.path) ? "page" : undefined}>
                <span>0{index + 1}</span>{nav.name}
              </Link>
            ))}
            <Link href={authed ? "/order" : "/signup"} className="site-nav__mobile-cta">{authed ? "Schedule pickup" : "Create your account"} <ArrowRight size={18} /></Link>
            {authed && <button type="button" onClick={handleLogout} className="site-nav__mobile-link site-nav__mobile-button"><span>0{visibleLinks.length + 1}</span>Log out</button>}
          </nav>
        </div>
      </header>
    </>
  );
}
