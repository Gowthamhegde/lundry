"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shirt, Mail, Phone, MapPin } from 'lucide-react';
import { useSiteConfig } from '@/hooks/useSiteConfig';

export default function Footer() {
  const { config } = useSiteConfig();
  const pathname = usePathname();

  if (pathname === '/') {
    return null;
  }

  return (
    <footer className="bg-gray-900 border-t border-gray-800 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-teal-500 p-2 rounded-xl shadow-lg shadow-teal-500/20">
                <Shirt className="h-6 w-6 text-gray-900" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-emerald-400 tracking-tight">
                {config.companyName}
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              Providing premium garment care and laundry management services. We handle the chores so you can handle life.
            </p>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-teal-400 transition-colors">Home</Link></li>
              <li><Link href="/services" className="hover:text-teal-400 transition-colors">Services</Link></li>
              <li><Link href="/admin" className="hover:text-teal-400 transition-colors">Admin Login</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-sm">
              <li className="hover:text-teal-400 transition-colors cursor-pointer">Standard Wash</li>
              <li className="hover:text-teal-400 transition-colors cursor-pointer">Dry Cleaning</li>
              <li className="hover:text-teal-400 transition-colors cursor-pointer">Premium Ironing</li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-teal-500" /> {config.contactEmail}</li>
              <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-teal-500" /> {config.contactPhone}</li>
              <li className="flex items-center gap-2"><MapPin className="h-4 w-4 text-teal-500" /> 123 Laundry St, Clean City</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} {config.companyName}. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <span className="hover:text-white cursor-pointer">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
