'use client';

import React from 'react';
import { 
  Heart, 
  Stethoscope, 
  Building2, 
  CheckCircle2, 
  Zap
} from 'lucide-react';

export default function AiCapabilities() {
  const tracks = [
    {
      title: 'For Mothers',
      badge: 'B2C Maternal Wellness',
      tagline: 'Empowering expectant mothers with calm, accessible guidance and daily reassurance.',
      icon: Heart,
      accent: 'cyan',
      features: [
        'Accessible, plain-language maternal wellness and pregnancy education',
        'Personalized trimester-specific nutrition, hydration, and rest routines',
        '24/7 conversational companion for quick reassurance and symptom logging',
        'Demystified ultrasound report context without clinical jargon',
        'Integrated kick-counting, mood, and vital pattern summaries',
      ],
      availability: 'Available via WombCare Buddy Platform'
    },
    {
      title: 'For Healthcare Professionals',
      badge: 'Clinical Decision Support',
      tagline: 'Supporting OB-GYNs and sonographers with structured biometric summaries and time-saving workflows.',
      icon: Stethoscope,
      accent: 'violet',
      features: [
        'Structured computer vision imaging insights for supported ultrasound scans',
        'Automated multi-marker measurement summaries (BPD, HC, AC, FL, EFW)',
        'Reference-curve mapping (Hadlock / INTERGROWTH-21st percentile graphs)',
        'Plane acquisition and image quality validation indicators',
        'Export-ready structured reporting designed for rapid physician review',
      ],
      availability: 'Decision-Support Architecture & Review Workflow'
    },
    {
      title: 'For Healthcare Organizations',
      badge: 'Enterprise & Hospital Systems',
      tagline: 'Standardizing digital maternal care delivery and patient communication at scale.',
      icon: Building2,
      accent: 'cyan',
      features: [
        'Seamless potential integration into existing prenatal clinical workflows',
        'Consistent, structured presentation of ultrasound and maternal telemetry',
        'Scalable digital maternal engagement reducing routine non-urgent call volume',
        'Secure data handling protocols aligned with healthcare privacy standards',
        'Longitudinal maternal trend monitoring across patient cohorts',
      ],
      availability: 'Enterprise Integration Framework'
    },
  ];

  return (
    <section 
      id="features" 
      className="py-24 md:py-32 bg-[#0B0F17] relative border-t border-slate-800/80 scroll-mt-20"
    >
      {/* Background ambient lighting */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-cyan-600/5 blur-[150px] rounded-full" 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-950/70 border border-cyan-500/30 text-cyan-300 text-xs font-semibold uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            Healthcare Ecosystem Architecture
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Designed for Mothers, Clinicians, and{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-violet-400 bg-clip-text text-transparent">
              Healthcare Systems.
            </span>
          </h2>

          <p className="text-base sm:text-lg text-slate-300/90 leading-relaxed font-normal">
            WombCare AI unites precision computer vision and empathetic maternal companion technology to elevate care across every touchpoint of prenatal health.
          </p>
        </div>

        {/* 3 Audience Columns */}
        <div className="grid lg:grid-cols-3 gap-8">
          {tracks.map((track, idx) => {
            const Icon = track.icon;
            const isCyan = track.accent === 'cyan';

            return (
              <div
                key={idx}
                className="relative rounded-2xl p-7 bg-[#111827] border border-slate-800 hover:border-slate-700 transition-all duration-300 hover:shadow-2xl hover:shadow-black/70 flex flex-col justify-between"
              >
                <div className="space-y-6">
                  {/* Top Bar with Icon and Badge */}
                  <div className="flex items-center justify-between">
                    <div 
                      className={`w-12 h-12 rounded-xl flex items-center justify-center border ${
                        isCyan 
                          ? 'bg-cyan-950/70 border-cyan-500/30 text-cyan-400' 
                          : 'bg-violet-950/70 border-violet-500/30 text-violet-400'
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>

                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300">
                      {track.badge}
                    </span>
                  </div>

                  {/* Title & Tagline */}
                  <div>
                    <h3 className="text-2xl font-bold text-white">
                      {track.title}
                    </h3>
                    <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                      {track.tagline}
                    </p>
                  </div>

                  {/* Feature Checklist */}
                  <ul className="space-y-3 pt-2">
                    {track.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2.5 text-xs text-slate-300/90 leading-relaxed">
                        <CheckCircle2 className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
                          isCyan ? 'text-cyan-400' : 'text-violet-400'
                        }`} />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Status Indicator at card bottom */}
                <div className="pt-6 mt-6 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">
                    {track.availability}
                  </span>
                  <span className={`w-2 h-2 rounded-full ${
                    isCyan ? 'bg-cyan-400 animate-pulse' : 'bg-violet-400'
                  }`} />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
