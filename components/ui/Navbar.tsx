"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface NavbarProps {
    className?: string;
}

/**
 * Navbar component matching the Arduino Day Philippines style
 * Features a rounded pill container with navigation links
 * Mobile responsive with hamburger menu
 */
const Navbar: React.FC<NavbarProps> = ({ className = '' }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navLinks = [
        { href: '/', label: 'Home' },
        { href: '/grid-layout-selection', label: 'Layouts' },
        { href: '/capture-photos', label: 'Capture' },
        { href: '/grid-gallery-selection', label: 'Gallery' },
    ];

    return (
        <>
            {/* Desktop/Tablet Navbar */}
            <nav className={`fixed top-4 sm:top-6 left-0 sm:left-1/2 sm:-translate-x-1/2 z-50 w-full sm:max-w-4xl px-4 sm:px-0 ${className}`}>
                <div className="flex items-center justify-between gap-4 sm:gap-6 px-0 sm:px-6 py-2.5 sm:py-3 sm:rounded-full sm:bg-[rgba(13,27,42,0.9)] sm:backdrop-blur-md sm:border sm:border-[rgba(0,206,209,0.2)]">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 shrink-0">
                        <Image
                            src="/logo.png"
                            alt="SnapGrid Logo"
                            width={100}
                            height={40}
                            className="h-7 sm:h-8 w-auto"
                        />
                    </Link>

                    {/* Navigation Links - Desktop */}
                    <div className="hidden md:flex items-center gap-6">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-sm text-gray-300 hover:text-white transition-colors duration-200"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* CTA Button - Desktop */}
                    <Link
                        href="/grid-layout-selection"
                        className="hidden sm:block px-4 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-white bg-[#00CED1] rounded-full hover:bg-[#00b8ba] transition-colors duration-200"
                    >
                        START
                    </Link>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden flex flex-col items-center justify-center w-8 h-8 gap-1"
                        aria-label="Toggle menu"
                    >
                        <span className={`block w-5 h-0.5 bg-[#00CED1] transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
                        <span className={`block w-5 h-0.5 bg-[#00CED1] transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`} />
                        <span className={`block w-5 h-0.5 bg-[#00CED1] transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
                    </button>
                </div>
            </nav>

            {/* Mobile Menu Dropdown */}
            {isMenuOpen && (
                <div className="md:hidden fixed top-20 left-4 right-4 z-50 bg-[rgba(13,27,42,0.95)] backdrop-blur-md border border-[rgba(0,206,209,0.2)] rounded-2xl p-4 shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
                    <div className="flex flex-col gap-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setIsMenuOpen(false)}
                                className="text-sm text-gray-300 hover:text-white hover:bg-[rgba(0,206,209,0.1)] px-4 py-3 rounded-lg transition-colors duration-200"
                            >
                                {link.label}
                            </Link>
                        ))}
                        <Link
                            href="/grid-layout-selection"
                            onClick={() => setIsMenuOpen(false)}
                            className="mt-2 px-4 py-3 text-sm font-medium text-center text-white bg-[#00CED1] rounded-full hover:bg-[#00b8ba] transition-colors duration-200"
                        >
                            START NOW
                        </Link>
                    </div>
                </div>
            )}

            {/* Mobile Menu Overlay */}
            {isMenuOpen && (
                <div
                    className="md:hidden fixed inset-0 z-40 bg-black/50"
                    onClick={() => setIsMenuOpen(false)}
                />
            )}
        </>
    );
};

export default Navbar;
