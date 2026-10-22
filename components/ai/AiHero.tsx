'use client';

import React from 'react';
import { 
  Activity, 
  ArrowRight, 
  ExternalLink, 
  Scan, 
  ShieldCheck, 
  CheckCircle2,
  Cpu
} from 'lucide-react';

export default function AiHero() {
  const handleScrollToAi = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const element = document.getElementById('ultrasound-intelligence');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.history.pushState(null, '', '#ultrasound-intelligence');
    }
  };

  return (
    <section 
      id="overview" 
      className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-[#0B0F17]"
    >
      {/* Subtle Ambient Radial Glows */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-cyan-600/10 via-violet-600/10 to-transparent blur-[120px] rounded-full"
      />
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute top-10 right-10 w-[350px] h-[350px] bg-cyan-500/5 blur-[100px] rounded-full"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headline and Positioning */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.15)] text-slate-300 text-xs font-medium">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
              </span>
              <span className="text-cyan-300 font-semibold tracking-wide uppercase text-[10px]">
                Clinical Decision Support
              </span>
              <span className="text-slate-600">|</span>
              <span className="text-slate-300">Precision Maternal AI Suite</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
              Intelligent Care for Every Stage of{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-violet-400 bg-clip-text text-transparent">
                Motherhood.
              </span>
            </h1>

            {/* Supporting Text */}
            <p className="text-lg sm:text-xl text-slate-300/90 font-normal leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Discover a more connected approach to maternal healthcare with intelligent ultrasound insights, personalized wellness guidance, and an AI-powered companion designed to support mothers and healthcare professionals.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <a
                href="#ultrasound-intelligence"
                onClick={handleScrollToAi}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 text-sm font-semibold text-white bg-gradient-to-r from-cyan-600 via-cyan-500 to-violet-600 hover:from-cyan-500 hover:to-violet-500 rounded-xl shadow-[0_0_25px_rgba(6,182,212,0.35)] transition-all duration-300 hover:scale-[1.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              >
                <span>Meet WombCare AI</span>
                <ArrowRight className="w-4 h-4 text-cyan-100" />
              </a>

              <a
                href="https://chat.wombcare.in"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-4 text-sm font-semibold text-slate-200 bg-slate-900/90 hover:bg-slate-850 hover:text-white border border-slate-700/80 hover:border-cyan-500/50 rounded-xl transition-all duration-300 shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              >
                <Activity className="w-4 h-4 text-cyan-400" />
                <span>Launch WombCare Buddy</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </a>
            </div>

            {/* Trust Markers */}
            <div className="pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span>Clinician-in-the-Loop Architecture</span>
              </div>
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-violet-400" />
                <span>Multi-Marker Pattern Analysis</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Privacy-First & Secure</span>
              </div>
            </div>
          </div>

          {/* Right Column: High-Fidelity Product UI Mockup */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl p-[1px] bg-gradient-to-b from-cyan-500/30 via-slate-800 to-violet-500/20 shadow-2xl shadow-black/80">
              
              {/* Inner Dark Panel */}
              <div className="rounded-2xl bg-[#111827] p-5 sm:p-6 space-y-5 border border-slate-800/80">
                
                {/* Panel Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center">
                      <Scan className="w-4 h-4 text-cyan-400" />
                    </div>
                    <div>
                      <h2 className="text-sm font-semibold text-white">
                        Ultrasound Telemetry & Biometry
                      </h2>
                      <p className="text-[11px] text-slate-400">
                        Second Trimester Screening • Gestational Age 22w 3d
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
                    Confidence 98.4%
                  </span>
                </div>

                {/* Scan Visual Simulator Panel */}
                <div className="relative h-44 rounded-xl bg-slate-950/90 border border-slate-800 p-3 overflow-hidden flex flex-col justify-between">
                  <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:16px_16px]" />
                  
                  {/* Landmark overlay markers */}
                  <div className="relative z-10 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                      Transthalamic Plane (BPD/HC)
                    </span>
                    <span className="font-mono text-cyan-300 text-[10px]">
                      GAIN: Optimal • CONTRAST: 0.92
                    </span>
                  </div>

                  {/* Graphic Biometric Grid Simulation */}
                  <div className="relative z-10 flex items-center justify-center py-2">
                    <div className="relative w-48 h-24 border border-dashed border-cyan-500/40 rounded-full flex items-center justify-center">
                      <div className="absolute inset-x-2 top-1/2 -translate-y-1/2 h-px bg-cyan-400/60" />
                      <div className="absolute inset-y-2 left-1/2 -translate-x-1/2 w-px bg-violet-400/60" />
                      <span className="font-mono text-[10px] text-cyan-200 bg-slate-900/90 px-1.5 py-0.5 rounded border border-cyan-500/30">
                        BPD: 54.2 mm
                      </span>
                    </div>
                  </div>

                  <div className="relative z-10 flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-900">
                    <span>Hadlock Reference: 52nd Percentile</span>
                    <span className="text-cyan-400 font-medium">Standard Acoustic Alignment</span>
                  </div>
                </div>

                {/* Biometric Measurement Metrics Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800/90 hover:border-cyan-500/30 transition-colors">
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>Biparietal (BPD)</span>
                      <span className="text-cyan-400 font-mono">54.2 mm</span>
                    </div>
                    <div className="mt-1.5 flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-200">22w 4d ± 4d</span>
                      <span className="text-[10px] text-emerald-400 font-medium">Normative</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800/90 hover:border-cyan-500/30 transition-colors">
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>Femur Length (FL)</span>
                      <span className="text-cyan-400 font-mono">38.7 mm</span>
                    </div>
                    <div className="mt-1.5 flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-200">22w 2d ± 5d</span>
                      <span className="text-[10px] text-emerald-400 font-medium">Normative</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800/90 hover:border-cyan-500/30 transition-colors">
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>Abdominal (AC)</span>
                      <span className="text-cyan-400 font-mono">178.6 mm</span>
                    </div>
                    <div className="mt-1.5 flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-200">22w 5d ± 6d</span>
                      <span className="text-[10px] text-emerald-400 font-medium">Normative</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800/90 hover:border-cyan-500/30 transition-colors">
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>Est. Weight (EFW)</span>
                      <span className="text-violet-400 font-mono">495 g</span>
                    </div>
                    <div className="mt-1.5 flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-200">54th Percentile</span>
                      <span className="text-[10px] text-emerald-400 font-medium">On Track</span>
                    </div>
                  </div>
                </div>

                {/* Companion Integration Snippet */}
                <div className="p-3.5 rounded-xl bg-gradient-to-r from-cyan-950/40 to-violet-950/40 border border-cyan-500/20 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center">
                      <Activity className="w-3.5 h-3.5 text-cyan-300" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-200">
                        WombCare Buddy Status
                      </p>
                      <p className="text-[10px] text-slate-400">
                        Scan context ready for consultation & triage
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold text-cyan-300 bg-cyan-900/40 px-2 py-0.5 rounded-full border border-cyan-500/30">
                    Live
                  </span>
                </div>

              </div>
            </div>

            {/* Ambient Background Accent */}
            <div 
              aria-hidden="true" 
              className="absolute -bottom-6 -right-6 w-36 h-36 bg-violet-600/10 rounded-full blur-2xl pointer-events-none" 
            />
          </div>

        </div>
      </div>
    </section>
  );
}
