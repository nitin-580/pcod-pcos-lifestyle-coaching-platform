'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { MessageCircle, ArrowRight } from 'lucide-react';

export default function JoinWombCarePage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="min-h-screen flex items-center justify-center px-6 py-20">
        <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="inline-flex px-4 py-2 rounded-full bg-pink-100 text-pink-600 text-sm font-medium">
              Start Your Wellness Journey 🌸
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-slate-800 leading-tight">
              Join <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">WombCare</span>
            </h1>

            <p className="text-xl text-slate-600 leading-relaxed">
              Take the first step toward balancing hormones, managing PCOD,
              improving your cycle health, and becoming part of a supportive
              women’s wellness community.
            </p>

            <div className="space-y-4 text-slate-600">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-pink-500" />
                Personalized wellness guidance
              </div>

              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-purple-500" />
                PCOD and fertility support
              </div>

              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-green-500" />
                Expert-led WhatsApp community
              </div>
            </div>
          </motion.div>

          {/* Right CTA Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-[2rem] shadow-2xl border border-slate-100 p-8 md:p-10"
          >
            <h2 className="text-3xl font-bold text-slate-800">
              Get Started Today
            </h2>

            <p className="text-slate-500 mt-3 leading-relaxed">
              Choose your plan and instantly join our exclusive support
              community.
            </p>

            {/* Program Button */}
            <Link
              href="/pricing"
              className="mt-8 w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold text-lg shadow-lg shadow-pink-200"
            >
              Purchase Program
              <ArrowRight size={18} />
            </Link>

            {/* WhatsApp Button */}
            <a
              href="https://wa.me/919999999999"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-green-500 text-white font-semibold text-lg shadow-lg shadow-green-200"
            >
              <MessageCircle size={20} />
              Join WhatsApp Community
            </a>

            <p className="text-sm text-slate-400 text-center mt-6">
              Instant access • Community support • Early guidance
            </p>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
