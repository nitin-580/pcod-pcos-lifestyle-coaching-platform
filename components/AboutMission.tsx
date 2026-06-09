'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { HeartPulse, ShieldCheck, Sparkles } from 'lucide-react';

export default function AboutMission() {
  return (
    <section className="py-20 bg-white relative overflow-hidden">
      {/* Decorative details */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-pink-100/30 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-100/30 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Block - Heading */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-50 border border-pink-100 text-pink-600 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              Our Purpose
            </div>
            
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-950 leading-tight tracking-tight">
              Complete Care for PCOD & Pregnancy —{' '}
              <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                Powered by India’s Top Gynecologists
              </span>
            </h2>
            
            <div className="w-20 h-1 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full" />
          </div>

          {/* Right Block - Description / Content */}
          <div className="lg:col-span-7 bg-gradient-to-br from-slate-50 to-pink-50/30 border border-pink-100/50 rounded-3xl p-8 md:p-10 shadow-sm">
            <p className="text-lg text-slate-700 leading-relaxed font-medium mb-6">
              India has millions of women struggling with PCOD and fragmented pregnancy care. Traditional consultations are episodic, leaving patients without continuous guidance.
            </p>
            
            <div className="flex gap-4 items-start bg-white/70 backdrop-blur border border-white rounded-2xl p-5 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0 border border-purple-100">
                <HeartPulse className="w-5 h-5" />
              </div>
              <div>
                <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                  <strong>WombCare</strong> bridges the gap between clinic visits through structured, doctor-led care, ensuring you are never left alone on your journey.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
