'use client';

import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type LoginModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function LoginModal({
  isOpen,
  onClose,
}: LoginModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[101] flex items-center justify-center px-4"
          >
            <div className="w-full max-w-md bg-white rounded-[2rem] shadow-2xl border border-slate-100 p-8 relative">
              
              {/* Close */}
              <button
                onClick={onClose}
                className="absolute top-5 right-5 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Heading */}
              <div className="mb-8 text-center">
                <h2 className="text-3xl font-bold text-slate-800">
                  Welcome Back
                </h2>
                <p className="text-slate-500 mt-2">
                  Login to continue your wellness journey
                </p>
              </div>

              {/* Form */}
              <form className="space-y-5">
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />

                <input
                  type="password"
                  placeholder="Password"
                  className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />

                <button
                  type="submit"
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold shadow-lg hover:opacity-95"
                >
                  Login
                </button>
              </form>

              {/* Footer */}
              <p className="text-sm text-slate-500 text-center mt-6">
                Don’t have an account?{' '}
                <span className="text-purple-600 font-medium cursor-pointer">
                  Sign Up
                </span>
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
