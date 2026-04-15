'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';

type FormData = {
  name: string;
  email: string;
  age: string;
  concern: string;
};

export default function EarlySignup() {
  const [success, setSuccess] = useState(false);
  const [memberNumber, setMemberNumber] = useState(0);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setMemberNumber(Math.floor(2500 + Math.random() * 500));
    setSuccess(true);
  };

  return (
    <section className="py-24 bg-gradient-to-b from-white to-pink-50 relative overflow-hidden">
      
      {/* Decorative blobs */}
      <div className="absolute -left-40 top-20 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
      <div className="absolute -right-40 bottom-20 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000" />

      <div className="max-w-xl mx-auto px-6 relative z-10">
        <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-xl border border-white p-8 md:p-12">
          
          <AnimatePresence mode="wait">
            {!success ? (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-center mb-10">
                  <h2 className="text-3xl font-bold text-slate-800 mb-4">Claim Your Spot</h2>
                  <p className="text-slate-600">Join the waitlist for exclusive early access and pioneer pricing.</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">First Name</label>
                    <input 
                      {...register("name", { required: "Name is required" })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all bg-white/50"
                      placeholder="Nitya Singh"
                    />
                    {errors.name && <p className="text-rose-500 text-sm mt-1">{errors.name.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                    <input 
                      type="email"
                      {...register("email", { 
                        required: "Email is required",
                        pattern: { value: /^\S+@\S+$/i, message: "Invalid email" }
                      })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all bg-white/50"
                      placeholder="nitya@gmail.com"
                    />
                    {errors.email && <p className="text-rose-500 text-sm mt-1">{errors.email.message}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Age</label>
                      <input 
                        type="number"
                        {...register("age", { required: "Age is required", min: 16, max: 100 })}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all bg-white/50"
                        placeholder="28"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Main Concern</label>
                      <select 
                        {...register("concern")}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all bg-white/50"
                      >
                        <option value="pcod">PCOD/PCOS</option>
                        <option value="irregular">Irregular Cycles</option>
                        <option value="energy">Low Energy</option>
                        <option value="fertility">Fertility Prep</option>
                        <option value="general">General Wellness</option>
                      </select>
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full mt-4 py-4 px-6 rounded-xl bg-slate-800 text-white font-semibold shadow-lg hover:shadow-xl hover:bg-slate-700 transition-all focus:ring-4 focus:ring-slate-200 flex justify-center items-center"
                  >
                    {isSubmitting ? (
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      "Secure Early Access"
                    )}
                  </button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-10"
              >
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <h3 className="text-3xl font-bold text-slate-800 mb-4">You&apos;re in!</h3>
                <p className="text-xl text-slate-600 mb-8">
                  Welcome to the community. You are early member <span className="font-bold text-pink-600">#{memberNumber}</span>.
                </p>
                <p className="text-slate-500 text-sm">
                  Keep an eye on your inbox. We&apos;ll be in touch with your welcome packet soon.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
