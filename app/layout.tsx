"use client";
import React, { useState } from "react";
import "./globals.css";
import { geistMono, geistSans, urbanist, inter } from "@/lib/fonts";

import Sidebar from "@/components/ui/sidebar";
import Logo from "@/components/ui/Logo";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  /* 
    The usePathname hook requires the component to be a client component.
    This file is already "use client".
  */

  return (
    <html lang="en">
      <body
        className={`${urbanist.variable} ${inter.variable} ${geistSans.variable} ${geistMono.variable} antialiased flex min-h-screen bg-[#0b0b0b]`}
      >
        <>
          <Sidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
          />

          {/* Mobile Hamburger Button - Right Aligned */}
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden fixed top-4 right-4 z-40 p-2 bg-[#0b0b0b]/80 backdrop-blur-md rounded-lg border border-[#00CED1]/30 text-[#00CED1] shadow-[0_0_15px_rgba(0,206,209,0.2)]"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Arduino Logo Placement 
                    Desktop: Top Right
                    Mobile: Top Left - Adjusted for alignment
                 */}
          <div className="fixed z-40 top-0 left-6 lg:left-auto lg:right-8 lg:top-0 pointer-events-none">
            <Logo className="w-16 h-16 lg:w-24 lg:h-24" />
          </div>
        </>

        <div className="flex-1 w-full relative lg:ml-72">
          {children}
        </div>
      </body>
    </html>
  );
}
