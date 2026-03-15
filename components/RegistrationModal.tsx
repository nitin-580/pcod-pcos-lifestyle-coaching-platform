'use client';

import React, { useState, useEffect } from 'react';
import { ArrowRight, CheckCircle2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function RegistrationModal() {

  const [isOpen, setIsOpen] = useState(false);
  const [hasSeen, setHasSeen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasSeen) setIsOpen(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, [hasSeen]);

  const handleClose = () => {
    setIsOpen(false);
    setHasSeen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
        >

          {/* MODAL */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row"
          >

            {/* MOBILE CLOSE */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 z-50 p-2 text-slate-400 hover:text-slate-700 rounded-full md:hidden"
            >
              <X className="w-5 h-5" />
            </button>

            {isSuccess ? (

              <div className="w-full p-12 flex flex-col items-center justify-center text-center">

                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-5">
                  <CheckCircle2 className="w-8 h-8 text-green-500" />
                </div>

                <h3 className="text-2xl font-bold text-slate-800 mb-3">
                  Registration Complete!
                </h3>

                <p className="text-slate-600 max-w-md mb-6">
                  We've sent a confirmation email with your next steps toward hormonal health.
                </p>

                <button
                  onClick={handleClose}
                  className="px-7 py-3 rounded-full text-white font-semibold bg-gradient-to-r from-pink-500 to-purple-600 hover:shadow-lg"
                >
                  Close
                </button>

              </div>

            ) : (

              <>
                {/* LEFT PANEL */}
                <div className="w-full md:w-5/12 bg-gradient-to-br from-purple-600 to-pink-500 text-white p-10 flex flex-col relative overflow-hidden">

                  {/* Glow Blob */}
                  <div className="absolute -left-20 bottom-0 w-56 h-56 bg-white/20 blur-[70px] rounded-full" />

                  {/* TEXT */}
                  <div className="relative z-10 mb-6">
                    <h2 className="text-3xl font-bold mb-4">
                      Loving WombCare?
                    </h2>

                    <p className="text-white/80 text-base leading-relaxed">
                      Sign up now and continue building your personalized path to hormonal balance and wellness.
                    </p>
                  </div>

                  {/* IMAGE */}
                  <div className="relative z-10 w-full aspect-[4/3] rounded-2xl border border-gray-100 overflow-hidden mt-auto hidden md:block">
                    <img
                      src="/woman-img.png"
                      className="block w-full h-full object-cover object-top opacity-80"
                    />
                  </div>

                </div>

                {/* RIGHT PANEL */}
                <div className="w-full md:w-7/12 p-10 flex flex-col justify-center bg-white">

                  <button
                    onClick={handleClose}
                    className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-700 rounded-full hidden md:block"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-slate-800 mb-1">
                      Join Early Access
                    </h3>
                    <p className="text-sm text-slate-500">
                      Early access spots are filling up fast.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                      <input
                        type="text"
                        placeholder="Full Name"
                        required
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-pink-400 focus:border-pink-400 outline-none"
                      />

                      <input
                        type="tel"
                        placeholder="Phone Number"
                        required
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-pink-400 focus:border-pink-400 outline-none"
                      />

                    </div>

                    <input
                      type="email"
                      placeholder="Email Address"
                      required
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-pink-400 focus:border-pink-400 outline-none"
                    />

                    <div className="grid grid-cols-2 gap-4">

                      <input
                        type="number"
                        placeholder="Age"
                        required
                        className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-pink-400 focus:border-pink-400 outline-none"
                      />

                      <input
                        type="number"
                        placeholder="Weight"
                        required
                        className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-pink-400 focus:border-pink-400 outline-none"
                      />

                    </div>

                    {/* BUTTON */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white font-semibold transition-all ${
                        isSubmitting
                          ? 'bg-slate-400'
                          : 'bg-gradient-to-r from-pink-500 to-purple-600 hover:shadow-lg hover:-translate-y-0.5'
                      }`}
                    >
                      {isSubmitting ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          Get Started
                          <ArrowRight className="w-4 h-4 ml-1" />
                        </>
                      )}
                    </button>

                    <p className="text-xs text-slate-500 text-center">
                      By continuing, you agree to our Terms & Conditions.
                    </p>

                  </form>

                </div>

              </>
            )}

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}