'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Check, 
  Sparkles, 
  ShieldCheck, 
  ExternalLink,
  ArrowRight,
  Lock
} from 'lucide-react';

export default function AiPricing() {
  const plans = [
    {
      name: 'Maternal Essentials',
      badge: 'Quarterly',
      originalPrice: '₹14,999',
      price: '₹7,999',
      duration: '/ 3 months',
      billingNote: 'Billed every 3 months',
      description: 'Foundational AI wellness companion for pregnancy symptom and lifestyle tracking.',
      features: [
        '24/7 WombCare Buddy companion access',
        'Trimester nutrition & hydration timeline',
        'Everyday symptom logging & reassurance',
        'Standard scan terminology explainer',
        'Mobile companion web app access',
      ],
      highlighted: false,
      ctaLabel: 'Get Started with Essentials',
      ctaHref: 'https://chat.wombcare.in',
      isExternal: true,
    },
    {
      name: 'Annual Premium',
      badge: '50% OFF',
      originalPrice: '₹59,999',
      price: '₹29,999',
      duration: '/ year',
      billingNote: 'Billed annually',
      description: 'Comprehensive access to premium maternal wellness capabilities and supported AI-powered features.',
      features: [
        'Premium maternal wellness tools',
        'AI-powered conversational support (WombCare Buddy)',
        'Personalized nutrition and hydration guidance',
        'Symptom and wellness tracking',
        'Supported ultrasound intelligence features',
        'Structured wellness insights and summaries',
        'Priority support & OB-GYN report summaries',
        'Secure account access and data handling',
      ],
      highlighted: true,
      ctaLabel: 'Join Annual Premium',
      ctaHref: 'https://chat.wombcare.in',
      isExternal: true,
    },
    {
      name: 'Clinical & Hospital Tier',
      badge: 'Healthcare Partner',
      originalPrice: null,
      price: 'Custom',
      duration: 'Enterprise',
      billingNote: 'Custom institutional billing',
      description: 'Structured computer-vision ultrasound intelligence workflows for clinics and healthcare systems.',
      features: [
        'All Annual Premium capabilities included',
        'Structured DICOM SR ultrasound biometrics',
        'Automated anatomical plane verification',
        'Custom EMR/EHR clinical integration support',
        'Dedicated clinical account manager & SLA',
        'Enterprise HIPAA BAA & data compliance',
      ],
      highlighted: false,
      ctaLabel: 'Contact Clinical Partnerships',
      ctaHref: '/join-as-doctor',
      isExternal: false,
    },
  ];

  return (
    <section 
      id="pricing" 
      className="py-24 md:py-32 bg-[#0B0F17] relative border-t border-slate-800/80 scroll-mt-20 overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-cyan-600/10 via-violet-600/10 to-transparent blur-[160px] rounded-full" 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-950/70 border border-cyan-500/30 text-cyan-300 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            Transparent Membership Plans
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Invest in Precision Care for Your{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-violet-400 bg-clip-text text-transparent">
              Maternal Journey.
            </span>
          </h2>

          <p className="text-base sm:text-lg text-slate-300/90 leading-relaxed font-normal">
            Choose the membership tier that fits your stage. From everyday maternal companion support to deep clinical ultrasound intelligence.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid lg:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, index) => {
            const isFeatured = plan.highlighted;

            return (
              <div
                key={index}
                className={`relative rounded-3xl p-7 sm:p-8 flex flex-col justify-between transition-all duration-300 ${
                  isFeatured
                    ? 'bg-gradient-to-b from-[#131d2e] via-[#111827] to-[#141b2b] border-2 border-cyan-400/60 shadow-[0_0_40px_rgba(6,182,212,0.2)] lg:-translate-y-2'
                    : 'bg-[#111827] border border-slate-800 hover:border-slate-700 shadow-xl'
                }`}
              >
                {/* Featured Badge */}
                {isFeatured && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-cyan-500 to-violet-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg shadow-cyan-950/80 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Most Popular • {plan.badge}</span>
                  </div>
                )}

                <div>
                  {/* Top Header */}
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-white">
                      {plan.name}
                    </h3>
                    {!isFeatured && plan.badge && (
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300">
                        {plan.badge}
                      </span>
                    )}
                  </div>

                  {/* Pricing Display */}
                  <div className="mb-4">
                    {plan.originalPrice && (
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm line-through text-slate-500 font-mono">
                          {plan.originalPrice} / year
                        </span>
                        {isFeatured && (
                          <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-500/30">
                            Save 50%
                          </span>
                        )}
                      </div>
                    )}
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
                        {plan.price}
                      </span>
                      <span className="text-sm font-medium text-slate-400">
                        {plan.duration}
                      </span>
                    </div>
                    <p className="text-xs text-cyan-400/90 font-medium mt-1">
                      {plan.billingNote}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-slate-300 mb-6 leading-relaxed">
                    {plan.description}
                  </p>

                  <div className="h-px bg-slate-800 mb-6" />

                  {/* Checklist */}
                  <div className="space-y-3 mb-8">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Included Capabilities:
                    </p>
                    <ul className="space-y-2.5">
                      {plan.features.map((feature, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                          <Check className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
                            isFeatured ? 'text-cyan-400' : 'text-slate-400'
                          }`} />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* CTA Action */}
                <div>
                  {plan.isExternal ? (
                    <a
                      href={plan.ctaHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-full flex items-center justify-center gap-2 py-4 px-6 rounded-xl font-semibold text-sm transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                        isFeatured
                          ? 'bg-gradient-to-r from-cyan-500 via-sky-400 to-violet-500 hover:from-cyan-400 hover:to-violet-400 text-slate-950 shadow-lg shadow-cyan-950/80 hover:scale-[1.02]'
                          : 'bg-slate-800 hover:bg-slate-750 text-white border border-slate-700/80'
                      }`}
                    >
                      <span>{plan.ctaLabel}</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  ) : (
                    <Link
                      href={plan.ctaHref}
                      className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-xl font-semibold text-sm bg-slate-800 hover:bg-slate-750 text-white border border-slate-700/80 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                    >
                      <span>{plan.ctaLabel}</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  )}

                  <p className="text-center text-[11px] text-slate-500 mt-3 flex items-center justify-center gap-1.5">
                    <Lock className="w-3 h-3 text-slate-500" />
                    <span>256-bit SSL Encrypted • Cancel Anytime</span>
                  </p>
                </div>

              </div>
            );
          })}
        </div>

        {/* Enterprise Security & Data Integrity Assurance */}
        <div className="mt-12 p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center flex-shrink-0 text-cyan-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-slate-200">
                Enterprise-Grade Privacy & Healthcare Governance
              </p>
              <p className="text-slate-400">
                Your health data and ultrasound images are encrypted end-to-end and handled in strict alignment with clinical confidentiality protocols.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 flex-shrink-0 text-slate-400">
            <span>HIPAA Aligned</span>
            <span>•</span>
            <span>No Unconsented Third-Party Sharing</span>
          </div>
        </div>

      </div>
    </section>
  );
}
