'use client';

import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section className="relative w-full min-h-[90vh] flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-pink-50 via-white to-purple-50 px-6 sm:px-12 text-center">
      {/* Subtle floating shapes */}
      <motion.div
        className="absolute top-10 left-10 w-64 h-64 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50"
        animate={{
          x: [0, 30, 0],
          y: [0, 40, 0],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50"
        animate={{
          x: [0, -30, 0],
          y: [0, -50, 0],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-rose-100 rounded-full mix-blend-multiply filter blur-3xl opacity-40"
        animate={{
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="relative z-10 max-w-3xl space-y-8">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-7xl font-extrabold text-slate-800 tracking-tight"
        >
          Take Control of PCOD & <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">Period Health</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed"
        >
          Meet your personal AI lifestyle coach designed to help you balance hormones, master your cycle, and thrive every day.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
        >
          <button className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full font-semibold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
            Start Hormone Check
          </button>
          <button className="w-full sm:w-auto px-8 py-4 bg-white text-purple-600 border border-purple-100 rounded-full font-semibold text-lg shadow-sm hover:shadow-md hover:bg-purple-50 transition-all duration-300">
            Join Early Access
          </button>
        </motion.div>
      </div>
    </section>
  );
}
