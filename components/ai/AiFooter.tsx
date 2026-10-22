'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Activity, ExternalLink, ArrowRight, ShieldCheck } from 'lucide-react';

export default function AiFooter() {
  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const targetId = href.replace('#', '');
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        window.history.pushState(null, '', href);
      }
    }
  };

  return (
    <footer className="bg-[#080B11] border-t border-slate-800/80 text-slate-400">
      
      {/* Pre-Footer Call to Action Banner */}
      <div className="border-b border-slate-800/80 relative overflow-hidden py-16 md:py-20 bg-gradient-to-b from-[#0B0F17] to-[#080B11]">
        <div 
          aria-hidden="true" 
          className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-r from-cyan-600/10 to-violet-600/10 blur-[130px] rounded-full" 
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-500/30 text-cyan-300 text-xs font-semibold uppercase tracking-wider">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            Start Your Maternal Health Journey
          </div>

          <h3 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight max-w-2xl mx-auto leading-tight">
            Ready to Experience the Future of Maternal Care?
          </h3>

          <p className="text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
            Connect with WombCare Buddy today or explore precision ultrasound intelligence designed to empower mothers and medical professionals.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <a
              href="https://chat.wombcare.in"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 text-sm font-semibold text-white bg-gradient-to-r from-cyan-600 via-cyan-500 to-violet-600 hover:from-cyan-500 hover:to-violet-500 rounded-xl shadow-[0_0_25px_rgba(6,182,212,0.35)] transition-all duration-300 hover:scale-[1.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
            >
              <Activity className="w-4 h-4 text-cyan-200" />
              <span>Launch WombCare Buddy</span>
              <ExternalLink className="w-4 h-4" />
            </a>

            <a
              href="#pricing"
              onClick={(e) => handleAnchorClick(e, '#pricing')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 text-sm font-semibold text-slate-300 bg-slate-900 hover:bg-slate-800 hover:text-white border border-slate-700/80 rounded-xl transition-all"
            >
              <span>Explore Annual Premium</span>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </a>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          
          {/* Brand Info */}
          <div className="col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative w-9 h-9 rounded-xl overflow-hidden border border-cyan-500/30 bg-slate-900 shadow-sm flex items-center justify-center">
                <Image
                  src="/logo.png"
                  alt="WombCare Logo"
                  width={32}
                  height={32}
                  className="object-contain"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold tracking-tight text-white">
                  WombCare
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 uppercase">
                  AI
                </span>
              </div>
            </Link>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Precision computer-vision ultrasound analytics and 24/7 empathetic conversational companion for mothers and clinical teams.
            </p>

            <div className="pt-2">
              <Link
                href="/"
                className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors inline-flex items-center gap-1.5"
              >
                <span>Visit WombCare Lifestyle & PCOD Coach</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* AI Navigation */}
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-200">
              WombCare AI
            </p>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="#overview"
                  onClick={(e) => handleAnchorClick(e, '#overview')}
                  className="hover:text-white transition-colors"
                >
                  Overview
                </a>
              </li>
              <li>
                <a
                  href="#ultrasound-intelligence"
                  onClick={(e) => handleAnchorClick(e, '#ultrasound-intelligence')}
                  className="hover:text-white transition-colors"
                >
                  Ultrasound Intelligence
                </a>
              </li>
              <li>
                <a
                  href="#wombcare-ai"
                  onClick={(e) => handleAnchorClick(e, '#wombcare-ai')}
                  className="hover:text-white transition-colors"
                >
                  WombCare Buddy
                </a>
              </li>
              <li>
                <a
                  href="#features"
                  onClick={(e) => handleAnchorClick(e, '#features')}
                  className="hover:text-white transition-colors"
                >
                  Ecosystem Capabilities
                </a>
              </li>
              <li>
                <a
                  href="#pricing"
                  onClick={(e) => handleAnchorClick(e, '#pricing')}
                  className="hover:text-white transition-colors"
                >
                  Plans & Pricing
                </a>
              </li>
            </ul>
          </div>

          {/* Core Platform */}
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-200">
              WombCare Platform
            </p>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/what-we-do" className="hover:text-white transition-colors">
                  What We Do
                </Link>
              </li>
              <li>
                <Link href="/blogs" className="hover:text-white transition-colors">
                  Health Blogs
                </Link>
              </li>
              <li>
                <Link href="/join-as-doctor" className="hover:text-white transition-colors">
                  Clinical Partnerships
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-white transition-colors">
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Compliance */}
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-200">
              Governance & Privacy
            </p>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/privacy-policy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-and-conditions" className="hover:text-white transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="hover:text-white transition-colors">
                  Refund Policy
                </Link>
              </li>
              <li>
                <span className="inline-flex items-center gap-1 text-[11px] text-cyan-400">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  HIPAA-Aligned Practice
                </span>
              </li>
            </ul>
          </div>

        </div>

        {/* Medical Safety Disclaimer Strip */}
        <div className="mt-12 pt-6 border-t border-slate-800/80 text-[11px] text-slate-500 leading-relaxed space-y-2">
          <p>
            <strong className="text-slate-400 font-semibold">Important Medical Disclaimer: </strong>
            WombCare AI and WombCare Buddy provide structured health information, biometric telemetry, and wellness guidance for educational and clinical decision-support purposes. They do not constitute formal medical diagnosis, prognosis, or acute medical treatment. Pregnant individuals experiencing symptoms such as vaginal bleeding, sharp persistent abdominal pain, severe headache, visual disturbances, or decreased fetal movements should seek immediate care from a qualified healthcare practitioner or hospital emergency department.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 text-xs text-slate-500">
            <p>© {new Date().getFullYear()} WombCare Health Technologies Inc. All rights reserved.</p>
            <p className="flex items-center gap-1.5">
              <span>Crafted for maternal wellness with clinical precision</span>
            </p>
          </div>
        </div>

      </div>

    </footer>
  );
}
