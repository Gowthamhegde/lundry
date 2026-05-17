"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mail, MapPin, Phone, Shirt } from "lucide-react";
import { useSiteConfig } from "@/hooks/useSiteConfig";

export default function Footer() {
  const { config } = useSiteConfig();
  const pathname   = usePathname();

  // Home page has its own genz-footer inside the page layout
  if (pathname === "/") return null;

  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-950 border-t border-gray-800/60 text-gray-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">

        {/* ── Top grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-5 group">
              <div className="bg-gradient-to-br from-teal-400 to-emerald-600 p-2 rounded-xl shadow-lg shadow-teal-500/20 group-hover:scale-105 transition-transform duration-200">
                <Shirt className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-emerald-400 tracking-tight">
                {config.companyName || "FreshWash"}
              </span>
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed">
              Premium garment care and laundry management. We handle the chores so you can handle life.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-white text-sm font-bold mb-4 uppercase tracking-wider">Quick links</h3>
            <ul className="space-y-2.5 text-sm">
              {[
                { label: "Home",     href: "/" },
                { label: "Services", href: "/services" },
                { label: "Order",    href: "/order" },
                { label: "Login",    href: "/login" },
                { label: "Sign up",  href: "/signup" },
              ].map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className={`hover:text-teal-400 transition-colors duration-150 ${
                      pathname === href ? "text-teal-400 font-semibold" : ""
                    }`}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white text-sm font-bold mb-4 uppercase tracking-wider">Services</h3>
            <ul className="space-y-2.5 text-sm">
              {["Standard wash", "Dry cleaning", "Wash + iron", "Stain removal", "Shoe cleaning"].map((s) => (
                <li key={s}>
                  <Link href="/services" className="hover:text-teal-400 transition-colors duration-150">
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white text-sm font-bold mb-4 uppercase tracking-wider">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <Mail className="h-4 w-4 text-teal-500 mt-0.5 shrink-0" />
                <span>{config.contactEmail || "freshwash@example.com"}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Phone className="h-4 w-4 text-teal-500 mt-0.5 shrink-0" />
                <span>{config.contactPhone || "+1 (555) 123-4567  "}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-teal-500 mt-0.5 shrink-0" />
                <span>123 Laundry St, Clean City</span>
              </li>
            </ul>

            {/* Admin — subtle, not prominent */}
            <div className="mt-6 pt-5 border-t border-gray-800/60">
              <Link
                href="/admin"
                className="text-xs text-gray-600 hover:text-gray-400 transition-colors duration-150 font-medium"
              >
                Admin login
              </Link>
            </div>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="mt-12 pt-6 border-t border-gray-800/60 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-600">
          <p>© {year} {config.companyName || "FreshWash"}. All rights reserved.</p>
          <div className="flex gap-5">
            <Link href="/services" className="hover:text-gray-400 transition-colors">Service menu</Link>
            <Link href="/order"    className="hover:text-gray-400 transition-colors">Book pickup</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
