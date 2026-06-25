'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, MessageSquare } from 'lucide-react';
import Image from 'next/image';

const testimonials = [
  {
    quote:
      'I am very happy with the WombCare team and my yoga trainer. Everyone is very supportive and friendly. Since starting yoga for PCOD, I feel more active, and this month my periods came on time. The diet suggestions have also been very helpful. My trainer is patient, motivating, and always supports me during the sessions. Thank you for your excellent guidance and care.',
    author: 'Neha Giri',
    label: 'Patient',
    photo: '/images/neha-giri.png',
  },
  {
    quote:
      'Struggling with PMOS was overwhelming, but Dipshikha, our lifestyle coach, made the journey so much easier. The sessions are tailored, gentle yet effective, and focus on long-term healing. I’ve seen real changes in my energy levels, mood, and cycle regularity.',
    author: 'Ishika',
    label: 'Lifestyle Coaching Client',
  },
  {
    quote:
      'I’m incredibly grateful to have found such a wonderful yoga instructor, Ankita. Not only is she kind, patient, and supportive, but her guidance has truly made a positive impact on my health through her yoga sessions.',
    author: 'Riji',
    label: 'Yoga & Hormonal Wellness',
  },
  {
    quote:
      'The holistic approach here is life-changing. I’ve learned how nutrition and stress management play a huge role in my hormonal balance. The community support is the cherry on top!',
    author: 'Priya Sharma',
    label: 'Holistic Wellness Member',
  },
];

export default function SocialProof() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
    }, 5000); // Auto-slide every 5 seconds
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-16 md:py-24 bg-[#fbfbfb]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
          <div className="inline-flex items-center gap-1.5 bg-pink-50 border border-pink-100 text-pink-600 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
            <MessageSquare className="w-3.5 h-3.5 fill-pink-100" />
            Testimonials
          </div>

          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
            What Our Patients Say
          </h2>

          <p className="text-base md:text-lg text-slate-500 leading-relaxed max-w-xl mx-auto">
            Real stories from real people who are on their healing journey with WombCare.
          </p>
        </div>

        {/* Carousel / Slider Container (Without side arrows, centered layout) */}
        <div className="relative max-w-3xl mx-auto px-4 mb-12">
          {/* Testimonial Card wrapper with fixed min-height for smooth transition */}
          <div className="min-h-[360px] sm:min-h-[300px] md:min-h-[260px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.4 }}
                className="bg-white border border-slate-100 rounded-[2rem] p-8 md:p-10 shadow-lg shadow-slate-100/40 relative overflow-hidden w-full"
              >
                {/* Large Background Quote Symbol */}
                <span className="absolute top-4 right-8 text-pink-100/60 text-[9rem] font-serif leading-none select-none pointer-events-none">
                  “
                </span>

                {/* Profile Header */}
                <div className="flex items-center gap-4 mb-6 relative z-10">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-2 border-pink-200 overflow-hidden flex-shrink-0 bg-pink-50 flex items-center justify-center">
                    {testimonials[activeIndex].photo ? (
                      <Image
                        src={testimonials[activeIndex].photo}
                        alt={testimonials[activeIndex].author}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-pink-400 to-purple-400 text-white font-bold text-2xl uppercase select-none">
                        {testimonials[activeIndex].author.charAt(0)}
                      </div>
                    )}
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-800 text-lg md:text-xl">
                      {testimonials[activeIndex].author}- {testimonials[activeIndex].label}
                    </h3>
                    <div className="flex gap-1 mt-1">
                      {[...Array(5)].map((_, idx) => (
                        <Star key={idx} className="w-5 h-5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Testimonial Text */}
                <p className="text-slate-600 leading-relaxed text-base md:text-lg text-left relative z-10">
                  {testimonials[activeIndex].quote}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center gap-2 mt-8 mb-20">
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                activeIndex === idx ? 'bg-pink-500 w-6' : 'bg-slate-200 hover:bg-slate-300'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* Video Testimonial */}
        <div className="pt-12 border-t border-slate-100 max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-pink-600 bg-pink-50 border border-pink-100 px-3 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-ping" />
              Real Transformation Story
            </span>
            <h3 className="text-xl font-bold text-slate-800 mt-3">Watch Our Success Video</h3>
          </div>
          <div className="relative w-full aspect-video rounded-[2rem] overflow-hidden bg-black border-4 border-white shadow-2xl">
            <iframe
              src="https://www.youtube.com/embed/SLBlfumkDXc"
              title="WombCare Success Testimonial"
              className="w-full h-full object-cover"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>

        {/* Bottom trust */}
        <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col items-center justify-center">
          <p className="text-slate-600 font-medium text-center">
            Evidence-based lifestyle programs for sustainable hormonal wellness
          </p>
        </div>
      </div>
    </section>
  );
}