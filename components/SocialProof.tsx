'use client';

import { motion } from 'framer-motion';

const testimonials = [
  {
    tagline: "I finally understand my body",
    quote: "After years of dealing with unexplained symptoms, this AI coach helped me map my cycle and adjust my lifestyle. The daily guidance is game-changing.",
    author: "Nikita Singh",
    label: "Cycle Syncing for 6 months"
  },
  {
    tagline: "No more afternoon crashes",
    quote: "The personalized hormone plan fixed my energy levels. I didn't realize how much my stress and cortisol were impacting my overall health.",
    author: "Sarvesha Chaudhary",
    label: "Cortisol Balance protocol"
  },
  {
    tagline: "A supportive companion",
    quote: "It's like having a wellness expert in your pocket. The advice is gentle, practical, and actually backed by science.",
    author: "Anvesha Gupta",
    label: "PCOD management"
  }
];

export default function SocialProof() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        <div className="text-center max-w-2xl mx-auto mb-10 md:mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-800 mb-4 md:mb-6 tracking-tight">
            Trusted by Women Everywhere
          </h2>
          <p className="text-base md:text-lg text-slate-600">
            Join a growing community taking a proactive, personalized approach to their hormonal health.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
              whileHover={{ y: -5 }}
              className="bg-purple-50 rounded-2xl md:rounded-3xl p-6 md:p-8 border border-purple-100 shadow-sm transition-all"
            >
              <h4 className="text-xl font-semibold text-purple-700 mb-4">{t.tagline}</h4>
              <p className="text-slate-700 leading-relaxed mb-8 italic">&quot;{t.quote}&quot;</p>
              
              <div className="flex items-center gap-4 mt-auto">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-rose-200 to-fuchsia-200 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-slate-800">{t.author}</div>
                  <div className="text-sm text-slate-500">{t.label}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 md:mt-20 pt-8 md:pt-10 border-t border-slate-100 flex flex-col items-center justify-center">
          <div className="flex -space-x-4 mb-4">
             {[1,2,3,4,5].map(i => (
               <div key={i} className={`w-12 h-12 rounded-full border-2 border-white bg-slate-200 z-${10-i} overflow-hidden`}>
                 <div className={`w-full h-full bg-gradient-to-br from-purple-${200 + i*100} to-pink-${200 + i*100}`} />
               </div>
             ))}
             <div className="w-12 h-12 rounded-full border-2 border-white bg-slate-50 flex items-center justify-center text-xs font-bold text-slate-600 z-0">
               +2k
             </div>
          </div>
          <p className="text-slate-600 font-medium">Over 2,000+ women joined early access.</p>
        </div>
      </div>
    </section>
  );
}
