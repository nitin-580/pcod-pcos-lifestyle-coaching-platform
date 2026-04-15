'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function FloatingNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'About Us', href: '/about' },
    { name: 'What We Do', href: '/what-we-do' },
    { name: 'Blogs', href: '/blogs' },
    { name: 'Careers', href: '/careers' },
    { name: 'Join as Doctor', href: '/join-as-doctor' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 ${
          isScrolled
            ? 'bg-white/80 backdrop-blur-xl shadow-sm border-b border-slate-100'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto h-20 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-11 h-11 rounded-2xl overflow-hidden shadow-md border border-slate-100 bg-white group-hover:scale-105 transition-all duration-300">
              <Image
                src="/logo.png"
                alt="WombCare Logo"
                fill
                className="object-cover"
                priority
              />
            </div>

            <span className="text-xl font-bold bg-gradient-to-r from-purple-700 to-pink-500 bg-clip-text text-transparent">
              WombCare
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-sm font-medium transition-all relative ${
                    isActive
                      ? 'text-purple-600'
                      : 'text-slate-600 hover:text-purple-600'
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute left-0 -bottom-1 h-0.5 w-full rounded-full bg-purple-600" />
                  )}
                </Link>
              );
            })}

            {/* Login */}
            <Link
              href="/login"
              className="text-sm font-semibold text-slate-700 hover:text-purple-600 transition-all px-4 py-2 rounded-full border border-slate-200 bg-white hover:shadow-sm"
            >
              Login
            </Link>

            {/* CTA */}
            <Link
              href="/#register"
              className="bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-95 text-white px-5 py-2.5 rounded-full text-sm font-semibold shadow-lg transition-all hover:-translate-y-0.5"
            >
              Join Early Access
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-slate-700"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-[60] bg-white transition-all duration-300 ${
          mobileMenuOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
      >
        <button
          className="absolute top-6 right-6 text-slate-700"
          onClick={() => setMobileMenuOpen(false)}
        >
          <X className="w-8 h-8" />
        </button>

        <div className="flex flex-col justify-center items-center h-full gap-8 px-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-2xl font-semibold text-slate-800 hover:text-purple-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}

          <Link
            href="/login"
            className="w-full max-w-xs text-center border border-slate-200 py-4 rounded-full font-semibold"
            onClick={() => setMobileMenuOpen(false)}
          >
            Login
          </Link>

          <Link
            href="/#register"
            className="w-full max-w-xs text-center bg-gradient-to-r from-purple-600 to-pink-500 text-white py-4 rounded-full font-semibold shadow-lg"
            onClick={() => setMobileMenuOpen(false)}
          >
            Join Early Access
          </Link>
        </div>
      </div>
    </>
  );
}