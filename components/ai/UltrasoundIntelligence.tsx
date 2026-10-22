'use client';

import React, { useState } from 'react';
import { 
  Scan, 
  Layers, 
  LineChart, 
  Ruler, 
  CheckCircle, 
  FileText, 
  Info,
  ChevronRight
} from 'lucide-react';

export default function UltrasoundIntelligence() {
  const [selectedTab, setSelectedTab] = useState<'bpd' | 'ac' | 'fl' | 'quality'>('bpd');

  const capabilities = [
    {
      id: 'analysis',
      title: 'Ultrasound Image Analysis',
      badge: 'Pattern Recognition',
      description: 'Computer vision algorithms identify anatomical boundaries and acoustic landmarks across supported standard ultrasound planes to assist structural assessment.',
      icon: Scan,
      accent: 'cyan',
    },
    {
      id: 'markers',
      title: 'Multi-Marker Screening Insights',
      badge: 'Biometric Correlation',
      description: 'Integrates key biometric markers (BPD, HC, AC, FL) into a unified clinical view to help evaluate harmonious fetal development.',
      icon: Layers,
      accent: 'violet',
    },
    {
      id: 'growth',
      title: 'Fetal Growth Mapping',
      badge: 'Percentile Curves',
      description: 'Maps biometric measurements against established normative reference curves (Hadlock & INTERGROWTH-21st) across gestational age.',
      icon: LineChart,
      accent: 'cyan',
    },
    {
      id: 'metrics',
      title: 'Automated Structural Metrics',
      badge: 'Landmark Calipers',
      description: 'Generates automated distance calipers and cross-sectional areas to accelerate caliper placement and support physician review workflows.',
      icon: Ruler,
      accent: 'violet',
    },
    {
      id: 'quality',
      title: 'Image Quality & Landmark Assessment',
      badge: 'Verification Engine',
      description: 'Evaluates standard acquisition planes, acoustic shadowing, and gain contrast to flag scans that may warrant secondary clinical re-acquisition.',
      icon: CheckCircle,
      accent: 'cyan',
    },
    {
      id: 'reporting',
      title: 'Structured Clinical Reporting',
      badge: 'Standardized Export',
      description: 'Synthesizes measurements into readable, standardized clinical summary sheets that clinicians can verify, edit, and sign off.',
      icon: FileText,
      accent: 'violet',
    },
  ];

  return (
    <section 
      id="ultrasound-intelligence" 
      className="py-24 md:py-32 bg-[#0B0F17] relative border-t border-slate-800/80 scroll-mt-20"
    >
      {/* Background ambient lighting */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute top-1/3 right-0 w-[500px] h-[500px] bg-cyan-600/5 blur-[130px] rounded-full" 
      />
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute bottom-10 left-10 w-[400px] h-[400px] bg-violet-600/5 blur-[120px] rounded-full" 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-500/30 text-cyan-300 text-xs font-semibold uppercase tracking-wider">
            <Scan className="w-3.5 h-3.5 text-cyan-400" />
            Precision Computer Vision
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Turning Ultrasound Images into{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-violet-400 bg-clip-text text-transparent">
              Structured Insights.
            </span>
          </h2>

          <p className="text-base sm:text-lg text-slate-300/90 leading-relaxed font-normal">
            WombCare AI brings computer vision and multi-marker analysis together to support structured ultrasound review, fetal growth mapping, and automated measurement workflows.
          </p>
        </div>

        {/* 6 Capabilities Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {capabilities.map((cap) => {
            const Icon = cap.icon;
            const isCyan = cap.accent === 'cyan';

            return (
              <div
                key={cap.id}
                className="group relative rounded-2xl p-6 bg-[#111827] border border-slate-800 hover:border-cyan-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-black/60 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div 
                      className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-colors ${
                        isCyan 
                          ? 'bg-cyan-950/70 border-cyan-500/30 text-cyan-400 group-hover:border-cyan-400/60' 
                          : 'bg-violet-950/70 border-violet-500/30 text-violet-400 group-hover:border-violet-400/60'
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>

                    <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-400">
                      {cap.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-cyan-200 transition-colors">
                      {cap.title}
                    </h3>
                    <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                      {cap.description}
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center gap-1 text-xs font-semibold text-cyan-400 group-hover:text-cyan-300">
                  <span>Structured workflow</span>
                  <ChevronRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Interactive Biometric Inspection Panel (Illustrative UI Preview) */}
        <div className="rounded-2xl border border-slate-800 bg-[#111827] overflow-hidden shadow-2xl shadow-black/80">
          
          {/* Top Bar with Tab Selectors */}
          <div className="p-4 sm:p-6 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#141d2e]">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
                  Interactive Preview
                </span>
                <span className="text-slate-600">|</span>
                <span className="text-xs text-slate-400">
                  Illustrative Multi-Marker Biometric Telemetry
                </span>
              </div>
              <h4 className="text-lg font-bold text-white mt-0.5">
                Standard Anomaly Scan Biometrics (22-Week Target Plane)
              </h4>
            </div>

            {/* Tab switchers */}
            <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-900/90 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => setSelectedTab('bpd')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                  selectedTab === 'bpd'
                    ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                BPD & HC (Head)
              </button>
              <button
                type="button"
                onClick={() => setSelectedTab('ac')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                  selectedTab === 'ac'
                    ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                AC (Abdomen)
              </button>
              <button
                type="button"
                onClick={() => setSelectedTab('fl')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                  selectedTab === 'fl'
                    ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                FL (Femur)
              </button>
              <button
                type="button"
                onClick={() => setSelectedTab('quality')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                  selectedTab === 'quality'
                    ? 'bg-violet-950 text-violet-300 border border-violet-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Plane Quality Check
              </button>
            </div>
          </div>

          {/* Interactive Inspection Workspace */}
          <div className="p-6 lg:p-8 grid lg:grid-cols-12 gap-8 items-center">
            
            {/* Visual Canvas Simulator */}
            <div className="lg:col-span-7 space-y-4">
              <div className="relative h-64 sm:h-72 rounded-xl bg-slate-950 border border-slate-800 p-4 flex flex-col justify-between overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:20px_20px]" />
                
                {/* HUD Top bar */}
                <div className="relative z-10 flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    AUTOCALIPER: ACTIVE [MODE: 2D B-MODE]
                  </span>
                  <span className="text-cyan-400 bg-slate-900/90 px-2 py-0.5 rounded border border-slate-800">
                    SCALE: 10mm/div
                  </span>
                </div>

                {/* Simulated Ultrasound Visual Crosshairs based on selected Tab */}
                <div className="relative z-10 flex items-center justify-center my-auto">
                  {selectedTab === 'bpd' && (
                    <div className="relative w-64 h-36 border-2 border-cyan-400/50 rounded-[50%] flex items-center justify-center bg-cyan-950/10">
                      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-0.5 bg-cyan-400/80 flex items-center justify-between px-1">
                        <span className="w-1.5 h-1.5 bg-cyan-300 rounded-full" />
                        <span className="text-[11px] font-mono font-bold text-cyan-200 bg-slate-900 px-1.5 rounded border border-cyan-500/40">
                          BPD: 54.2 mm
                        </span>
                        <span className="w-1.5 h-1.5 bg-cyan-300 rounded-full" />
                      </div>
                      <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-0.5 bg-violet-400/60" />
                      <span className="text-[10px] text-slate-400 font-mono absolute bottom-2">
                        HC: 198.4 mm (Transthalamic Plane)
                      </span>
                    </div>
                  )}

                  {selectedTab === 'ac' && (
                    <div className="relative w-48 h-48 border-2 border-cyan-400/50 rounded-full flex items-center justify-center bg-cyan-950/10">
                      <div className="w-3 h-3 rounded-full border border-cyan-400/60 absolute top-12 left-14" />
                      <span className="text-[10px] text-cyan-400 font-mono absolute top-8 left-10">
                        Portal Sinus
                      </span>
                      <div className="text-center font-mono">
                        <p className="text-xs font-bold text-cyan-300">AC: 178.6 mm</p>
                        <p className="text-[10px] text-slate-400">Circumference Model</p>
                      </div>
                    </div>
                  )}

                  {selectedTab === 'fl' && (
                    <div className="relative w-60 h-28 flex items-center justify-center">
                      <div className="w-48 h-2 bg-gradient-to-r from-cyan-400 to-sky-300 rounded-full shadow-[0_0_15px_rgba(6,182,212,0.4)] relative">
                        <span className="absolute -left-1 -top-1.5 w-3 h-5 bg-cyan-300 rounded-sm" />
                        <span className="absolute -right-1 -top-1.5 w-3 h-5 bg-cyan-300 rounded-sm" />
                        <span className="absolute -top-6 left-1/2 -translate-x-1/2 font-mono text-xs font-bold text-cyan-200 bg-slate-900 px-2 py-0.5 rounded border border-cyan-500/40">
                          FL: 38.7 mm (Diaphysis Length)
                        </span>
                      </div>
                    </div>
                  )}

                  {selectedTab === 'quality' && (
                    <div className="w-full max-w-md space-y-3 p-3 bg-slate-900/80 rounded-xl border border-slate-800 font-mono text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Acoustic Shadow Assessment:</span>
                        <span className="text-emerald-400 font-bold">ACCEPTABLE (Minimal)</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Gain Dynamic Range:</span>
                        <span className="text-cyan-400 font-bold">64 dB (Calibrated)</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Standard Plane Alignment:</span>
                        <span className="text-emerald-400 font-bold">VERIFIED (Mid-sagittal)</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Landmark Symmetry Index:</span>
                        <span className="text-violet-400 font-bold">0.96 / 1.00</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* HUD Bottom bar */}
                <div className="relative z-10 flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-900">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                    Automated Landmark Identification
                  </span>
                  <span className="text-slate-500 font-sans italic">
                    Sample visualization preview
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                <span>Standard Measurement Index: FIGO / ISUOG Guidelines</span>
                <span className="text-cyan-400 font-medium">Export Format: DICOM SR Compatible</span>
              </div>
            </div>

            {/* Structured Findings Panel */}
            <div className="lg:col-span-5 space-y-4">
              <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div>
                    <h5 className="text-sm font-bold text-white">
                      Structured Clinical Review Sheet
                    </h5>
                    <p className="text-xs text-slate-400">
                      Derived Fetal Weight & Biometrics
                    </p>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/30 text-emerald-300">
                    Normative
                  </span>
                </div>

                {/* Data Row Table */}
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between py-1.5 border-b border-slate-800/60">
                    <span className="text-slate-400">Biparietal Diameter (BPD)</span>
                    <span className="font-mono text-slate-200 font-semibold">54.2 mm (52nd %ile)</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5 border-b border-slate-800/60">
                    <span className="text-slate-400">Head Circumference (HC)</span>
                    <span className="font-mono text-slate-200 font-semibold">198.4 mm (55th %ile)</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5 border-b border-slate-800/60">
                    <span className="text-slate-400">Abdominal Circumference (AC)</span>
                    <span className="font-mono text-slate-200 font-semibold">178.6 mm (51st %ile)</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5 border-b border-slate-800/60">
                    <span className="text-slate-400">Femur Diaphysis (FL)</span>
                    <span className="font-mono text-slate-200 font-semibold">38.7 mm (53rd %ile)</span>
                  </div>
                  <div className="flex items-center justify-between py-2 pt-3 font-semibold">
                    <span className="text-cyan-300">Estimated Fetal Weight (Hadlock)</span>
                    <span className="font-mono text-cyan-300 text-sm">495 g ± 12%</span>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-cyan-950/40 border border-cyan-500/20 text-[11px] text-cyan-200/90 leading-relaxed">
                  <p className="font-medium text-cyan-300 mb-0.5">Summary Observation:</p>
                  Biometric markers are concordant with menstrual gestational age of 22 weeks, 3 days. Structural ratios (HC/AC, FL/AC) sit within expected 2 standard deviation boundaries.
                </div>
              </div>

              {/* Physician Review Action */}
              <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/80 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-200">
                    Physician Decision Support
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Designed for clinical validation and electronic medical record sign-off.
                  </p>
                </div>
                <div className="px-3 py-1.5 rounded-lg bg-slate-800 text-[11px] font-medium text-slate-300">
                  Ready for Review
                </div>
              </div>

            </div>

          </div>

          {/* Integrated Safety & Clinical Protocol Disclaimer Footer */}
          <div className="px-6 py-4 bg-slate-950/90 border-t border-slate-800 flex items-start sm:items-center gap-3 text-xs text-slate-400">
            <Info className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5 sm:mt-0" />
            <p>
              <span className="font-semibold text-slate-300">Clinical Decision Support Notice: </span>
              All biometric metrics and automated contours represent decision-support insights. WombCare AI does not provide independent diagnosis or replace evaluation by licensed sonographers and OB-GYN clinicians.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}
