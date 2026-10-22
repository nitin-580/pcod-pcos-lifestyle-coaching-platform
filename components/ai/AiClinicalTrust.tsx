'use client';

import React from 'react';
import { 
  ShieldCheck, 
  Stethoscope, 
  Lock, 
  FileCheck2, 
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

export default function AiClinicalTrust() {
  const pillars = [
    {
      title: 'Physician-in-the-Loop Oversight',
      description: 'AI algorithms operate strictly in a clinical decision-support capacity. Every contour, caliper, and metric summary is designed for manual physician inspection, validation, and sign-off.',
      icon: Stethoscope,
      tag: 'Clinical Governance',
    },
    {
      title: 'Evidence-Based Reference Standards',
      description: 'Biometric calculations and fetal weight estimations utilize established peer-reviewed international guidelines (Hadlock regression, INTERGROWTH-21st, and ISUOG plane definitions).',
      icon: FileCheck2,
      tag: 'Validated Science',
    },
    {
      title: 'Red-Flag Triage Escalation',
      description: 'WombCare Buddy conversational engine applies clinical screening thresholds. Any reported red-flag indicator (unusual bleeding, severe epigastric pain, diminished movement) triggers instant emergency guidance.',
      icon: AlertCircle,
      tag: 'Patient Safety',
    },
    {
      title: 'Enterprise Health Privacy & Encryption',
      description: 'Zero advertising trackers, zero unconsented health data sales, and 256-bit AES encryption at rest and in transit. Your personal health journey remains completely private.',
      icon: Lock,
      tag: 'Data Sovereignty',
    },
  ];

  return (
    <section className="py-20 md:py-28 bg-[#0B0F17] relative border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-950/70 border border-violet-500/30 text-violet-300 text-xs font-semibold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5 text-violet-400" />
            Clinical Trust & Governance
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Built on Rigorous Medical & Ethical Principles.
          </h2>

          <p className="text-base text-slate-400 leading-relaxed max-w-2xl mx-auto">
            Healthcare AI must be accountable, transparent, and built to empower medical professionals and families alike.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;

            return (
              <div
                key={idx}
                className="p-6 sm:p-7 rounded-2xl bg-[#111827] border border-slate-800 hover:border-slate-700 transition-colors space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700/80 flex items-center justify-center text-cyan-400">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-800">
                      {pillar.tag}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white">
                    {pillar.title}
                  </h3>

                  <p className="text-sm text-slate-400 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center gap-2 text-xs text-slate-400">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Clinical Decision Support Standard</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
