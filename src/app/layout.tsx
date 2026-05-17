import type { Metadata } from "next";
import { DM_Sans, Syne } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-body" });
const syne = Syne({ subsets: ["latin"], variable: "--font-display" });

export const metadata: Metadata = {
  title: "FreshWash - HIFI Laundry Services",
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
        className={`${dmSans.variable} ${syne.variable} antialiased bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-gray-100 pt-16 min-h-screen flex flex-col transition-colors duration-300`}
      >
        <Navbar />
        <main className="flex-1 flex flex-col relative w-full">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
