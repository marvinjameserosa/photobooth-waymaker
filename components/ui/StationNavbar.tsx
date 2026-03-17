"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface StationNavbarProps {
    className?: string;
}

/**
 * Station Navbar - Used inside the photobooth flow
 * Features a minimal hamburger button that opens a sidebar with navigation
 */
const StationNavbar: React.FC<StationNavbarProps> = ({ className = '' }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const navLinks = [
        {
            href: '/', label: 'Home', icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
            )
        },
        {
            href: '/grid-layout-selection', label: 'Select Layout', icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
            )
        },
        {
            href: '/capture-photos', label: 'Capture Photos', icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            )
        },
        {
            href: '/grid-gallery-selection', label: 'Photo Gallery', icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            )
        },
        {
            href: '/grid-results', label: 'Share Results', icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
            )
        },
    ];

    return (
        <>
            {/* Logo - Fixed Position */}
            <Link href="/" className="fixed top-[26px] left-4 z-50 flex items-center gap-2 md:hidden">
                <Image
                    src="/logo.png"
                    alt="SnapGrid Logo"
                    width={100}
                    height={40}
                    className="h-7 w-auto"
                />
            </Link>

            {/* Hamburger Button - Fixed Position */}
            <button
                onClick={() => setIsSidebarOpen(true)}
                className={`fixed top-4 right-4 z-50 p-3 rounded-full bg-[rgba(13,27,42,0.9)] backdrop-blur-md border border-[rgba(0,206,209,0.2)] hover:border-[#00CED1] transition-all ${className}`}
                aria-label="Open navigation menu"
            >
                <div className="w-6 h-6 flex flex-col items-center justify-center gap-1.5">
                    <span className="block w-5 h-0.5 bg-[#00CED1]" />
                    <span className="block w-5 h-0.5 bg-[#00CED1]" />
                    <span className="block w-5 h-0.5 bg-[#00CED1]" />
                </div>
            </button>

            {/* Navigation Sidebar */}
            <div
                className={`fixed inset-y-0 right-0 z-50 w-80 max-w-[85vw] bg-[rgba(13,27,42,0.98)] backdrop-blur-xl border-l border-[rgba(0,206,209,0.2)] transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                <div className="flex items-center justify-between p-6 border-b border-[rgba(0,206,209,0.2)]">
                    <Link href="/" onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-2">
                        <Image
                            src="/logo.png"
                            alt="SnapGrid Logo"
                            width={120}
                            height={40}
                            className="h-8 w-auto"
                        />
                    </Link>
                    <button
                        onClick={() => setIsSidebarOpen(false)}
                        className="p-2 rounded-full hover:bg-[rgba(0,206,209,0.1)] transition-colors"
                        aria-label="Close navigation menu"
                    >
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Navigation Links */}
                <nav className="p-4">
                    <div className="space-y-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setIsSidebarOpen(false)}
                                className="flex items-center gap-4 px-4 py-3 text-gray-300 hover:text-white hover:bg-[rgba(0,206,209,0.1)] rounded-xl transition-all duration-200 group"
                            >
                                <span className="text-[#00CED1] group-hover:scale-110 transition-transform">
                                    {link.icon}
                                </span>
                                <span className="text-sm font-medium">{link.label}</span>
                            </Link>
                        ))}
                    </div>
                </nav>

                {/* Footer */}
                <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-[rgba(0,206,209,0.2)]">
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                        <span className="h-2 w-2 rounded-full bg-[#00CED1] shadow-[0_0_8px_rgba(0,206,209,0.6)]" />
                        <span>SYSTEM READY</span>
                    </div>
                </div>
            </div>

            {/* Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
        </>
    );
};

export default StationNavbar;
