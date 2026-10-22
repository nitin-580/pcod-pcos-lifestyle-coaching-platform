'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Menu, X, ExternalLink, Activity } from 'lucide-react';

export default function AiNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Overview', href: '#overview' },
    { label: 'Ultrasound Intelligence', href: '#ultrasound-intelligence' },
    { label: 'WombCare Buddy', href: '#wombcare-ai' },
    { label: 'Capabilities', href: '#features' },
    { label: 'Plans & Pricing', href: '#pricing' },
  ];

  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      setMobileMenuOpen(false);
      const targetId = href.replace('#', '');
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        window.history.pushState(null, '', href);
      }
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#0B0F17]/90 backdrop-blur-xl border-b border-slate-800/80 shadow-2xl shadow-black/50'
            : 'bg-[#0B0F17]/60 backdrop-blur-md border-b border-slate-800/40'
        }`}
      >
        <div className="max-w-7xl mx-auto h-20 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-xl"
            aria-label="WombCare AI Home"
          >
            <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-cyan-500/30 bg-slate-900/90 shadow-[0_0_15px_rgba(6,182,212,0.15)] group-hover:border-cyan-400/60 transition-all duration-300 flex items-center justify-center">
              <Image
                src="/logo.png"
                alt="WombCare Logo"
                width={36}
                height={36}
                className="object-contain"
                priority
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-white group-hover:text-cyan-200 transition-colors">
                WombCare
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 tracking-wide uppercase shadow-[0_0_10px_rgba(6,182,212,0.2)]">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                AI
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2" aria-label="Main Navigation">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => handleAnchorClick(e, item.href)}
                className="px-3.5 py-2 text-sm font-medium text-slate-300 hover:text-white rounded-lg hover:bg-slate-800/60 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              href="/"
              className="text-xs font-medium text-slate-400 hover:text-slate-200 px-3 py-2 rounded-lg hover:bg-slate-800/40 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
            >
              Main Site
            </Link>
            <a
              href="https://chat.wombcare.in"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-cyan-200 bg-gradient-to-r from-cyan-950/80 to-violet-950/80 hover:from-cyan-900/80 hover:to-violet-900/80 border border-cyan-500/40 hover:border-cyan-400 rounded-full shadow-[0_0_20px_rgba(6,182,212,0.25)] transition-all duration-300 hover:scale-[1.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
            >
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              <span>Launch Buddy</span>
              <ExternalLink className="w-3 h-3 text-cyan-400/80" />
            </a>
          </div>

          {/* Mobile menu hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 transition-colors"
            aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-6 h-6 text-cyan-400" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-all duration-300 ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden={!mobileMenuOpen}
      >
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        />

        {/* Drawer Content */}
        <div className="fixed top-20 right-0 bottom-0 w-full max-w-sm bg-[#0B0F17] border-l border-slate-800/80 p-6 flex flex-col justify-between overflow-y-auto">
          <div className="space-y-3 pt-2">
            <p className="text-xs uppercase tracking-wider font-semibold text-slate-500 px-3">
              Navigation
            </p>
            <div className="space-y-1">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleAnchorClick(e, item.href)}
                  className="block px-4 py-3 text-base font-medium text-slate-200 hover:text-cyan-300 hover:bg-slate-800/60 rounded-xl transition-all"
                >
                  {item.label}
                </a>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-800/80">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 rounded-xl transition-all"
              >
                Return to WombCare Main Site
              </Link>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800/80 space-y-3">
            <a
              href="https://chat.wombcare.in"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 text-sm font-semibold text-cyan-200 bg-gradient-to-r from-cyan-950 to-violet-950 border border-cyan-500/50 rounded-xl shadow-lg shadow-cyan-950/50 hover:border-cyan-400 transition-all"
            >
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>Launch WombCare Buddy</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <p className="text-center text-xs text-slate-500">
              24/7 Intelligent Maternal Companion
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
