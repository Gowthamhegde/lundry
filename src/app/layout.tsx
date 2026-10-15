import type { Metadata } from "next";
import { DM_Sans, IBM_Plex_Mono, Syne } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CookieConsent from "@/components/CookieConsent";

const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-body" });
const syne = Syne({ subsets: ["latin"], variable: "--font-display" });
const plexMono = IBM_Plex_Mono({ subsets: ["latin"], variable: "--font-mono", weight: ["400", "600", "700"] });

export const metadata: Metadata = {
  title: "RinseUp - HIFI Laundry Services",
  description: "Premium laundry management and services.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${dmSans.variable} ${syne.variable} ${plexMono.variable} antialiased bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-gray-100 pt-24 min-h-screen flex flex-col transition-colors duration-300`}
      >
        <Navbar />
        <main id="main-content" className="flex-1 flex flex-col relative w-full">
          {children}
        </main>
        <Footer />
        <CookieConsent />
        <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      </body>
    </html>
  );
}
