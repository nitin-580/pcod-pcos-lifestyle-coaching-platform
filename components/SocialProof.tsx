'use client';

import { motion } from 'framer-motion';

const testimonials = [
  {
    tagline: 'Real progress with PCOD healing',
    quote:
      'Struggling with PCOD was overwhelming, but Dipshikha, our lifestyle coach, made the journey so much easier. The sessions are tailored, gentle yet effective, and focus on long-term healing. I’ve seen real changes in my energy levels, mood, and cycle regularity.',
    author: 'Ishika',
    label: 'Lifestyle Coaching Client',
  },
  {
    tagline: 'Positive impact on menstrual health',
    quote:
      'I’m incredibly grateful to have found such a wonderful yoga instructor, Ankita. Not only is she kind, patient, and supportive, but her guidance has truly made a positive impact on my health through her yoga sessions.',
    author: 'Riji',
    label: 'Yoga & Hormonal Wellness',
  },
  {
    tagline: 'Compassionate and holistic support',
    quote:
      'The holistic approach here is life-changing. I’ve learned how nutrition and stress management play a huge role in my hormonal balance. The community support is the cherry on top!',
    author: 'Priya Sharma',
    label: 'Holistic Wellness Member',
  },
];

export default function SocialProof() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 md:mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-800 mb-4 md:mb-6 tracking-tight">
            Trusted by Women
          </h2>

          <p className="text-base md:text-lg text-slate-600">
            Real stories from women building healthier hormonal
            wellness journeys with WombCare.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
                margin: '-100px',
              }}
              transition={{
                duration: 0.6,
                delay: i * 0.15,
              }}
              whileHover={{ y: -4 }}
              className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-3xl p-6 md:p-8 border border-pink-100 shadow-sm transition-all"
            >
              <h4 className="text-xl font-semibold text-pink-600 mb-4">
                {t.tagline}
              </h4>

              <p className="text-slate-700 leading-relaxed mb-8 italic">
                &quot;{t.quote}&quot;
              </p>

              <div className="flex items-center gap-4 mt-auto">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-pink-300 to-purple-300 flex-shrink-0" />

                <div>
                  <div className="font-semibold text-slate-800">
                    {t.author}
                  </div>

                  <div className="text-sm text-slate-500">
                    {t.label}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom trust */}
        <div className="mt-12 md:mt-20 pt-8 md:pt-10 border-t border-slate-100 flex flex-col items-center justify-center">
          <div className="flex -space-x-4 mb-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="w-12 h-12 rounded-full border-2 border-white bg-slate-200 overflow-hidden"
              >
                <div className="w-full h-full bg-gradient-to-br from-pink-200 to-purple-300" />
              </div>
            ))}

            <div className="w-12 h-12 rounded-full border-2 border-white bg-slate-50 flex items-center justify-center text-xs font-bold text-slate-600">
              +2k
            </div>
          </div>

          <p className="text-slate-600 font-medium">
            Over 2,000+ women joined early access
          </p>
        </div>
      </div>
    </section>
  );
}