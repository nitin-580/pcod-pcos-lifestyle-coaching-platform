'use client';

import React, { useState } from 'react';
import { Mail, User, Phone, Calendar, Scale, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function RegistrationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');
    
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      age: Number(formData.get('age')),
      weight: Number(formData.get('weight')),
      cycleRegularity: 'Unknown',
      symptoms: 'None',
      country: 'IN', // Default
      source: 'Website Direct'
    };

    try {
      const response = await fetch('https://womb-care-backend-76858014616.us-central1.run.app/api/early-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        let errorMessage = result.message || 'Failed to register. Please try again.';
        // If there are detailed validation errors, show the first one
        if (result.errors && result.errors.length > 0) {
          errorMessage = result.errors[0].message;
        }
        throw new Error(errorMessage);
      }

      setIsSuccess(true);
    } catch (error: any) {
      console.error('Registration error:', error);
      setErrorMsg(error.message || 'Something went wrong.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <section className="py-24 bg-white relative overflow-hidden flex justify-center items-center font-sans">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-pink-50 to-transparent opacity-60 pointer-events-none" />
        <div className="relative z-10 w-full max-w-md mx-auto p-12 bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 className="w-10 h-10 text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-3">Registration Complete!</h3>
            <p className="text-slate-600">
                Thank you for taking the first step towards better hormonal health. We've sent a confirmation email to your inbox with your next steps.
            </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 md:py-24 bg-white relative overflow-hidden font-sans" id="register">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-pink-50 to-transparent opacity-80 pointer-events-none" />
      <div className="absolute -left-40 top-40 w-96 h-96 bg-purple-50 rounded-full blur-[100px] opacity-60 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 md:px-6 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        
        {/* Left Copy */}
        <div className="max-w-xl mx-auto lg:mx-0 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-pink-50 border border-pink-100 text-pink-600 text-sm font-medium mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-500"></span>
            </span>
            Limited Spots Available
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-slate-800 tracking-tight leading-[1.1] mb-6">
            Begin your journey to <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">balanced living</span>.
          </h2>
          
          <p className="text-lg text-slate-600 leading-relaxed mb-8">
            Join our comprehensive PCOD coaching program. Get personalized care, expert guidance, and a community that understands exactly what you're going through.
          </p>

          <div className="flex flex-col gap-4 text-left inline-block mt-2">
            {['Personalized nutrition & fitness plans', '1-on-1 expert hormonal coaching', 'Private community access'].map((feature, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                </div>
                <span className="text-slate-700 font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Form */}
        <div className="relative">
          {/* Form backdrop blur shadow */}
          <div className="absolute inset-0 bg-gradient-to-tr from-pink-200 to-purple-200 rounded-[2.5rem] blur-2xl opacity-20 transform translate-y-4" />
          
          <div className="relative bg-white/80 backdrop-blur-xl p-6 sm:p-8 md:p-10 rounded-3xl md:rounded-[2.5rem] shadow-[0_8px_40px_rgb(0,0,0,0.06)] border border-white">
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-slate-800 mb-2">Claim Your Spot</h3>
              <p className="text-slate-500 text-sm">Fill in your details to secure early access.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Name & Phone Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label htmlFor="name" className="text-sm font-medium text-slate-700 ml-1">Full Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 focus:bg-white transition-all outline-none"
                      placeholder="Nitya Singh"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="phone" className="text-sm font-medium text-slate-700 ml-1">Phone Number</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 focus:bg-white transition-all outline-none"
                      placeholder="+91 9984654378"
                    />
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label htmlFor="email" className="text-sm font-medium text-slate-700 ml-1">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 focus:bg-white transition-all outline-none"
                    placeholder="nitya@gmail.com"
                  />
                </div>
              </div>

              {/* Age & Weight Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label htmlFor="age" className="text-sm font-medium text-slate-700 ml-1">Age</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Calendar className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="number"
                      id="age"
                      name="age"
                      required
                      min="13"
                      max="100"
                      className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 focus:bg-white transition-all outline-none"
                      placeholder="e.g. 28"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="weight" className="text-sm font-medium text-slate-700 ml-1">Weight (kg)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Scale className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="number"
                      id="weight"
                      name="weight"
                      required
                      min="30"
                      max="300"
                      step="0.1"
                      className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 focus:bg-white transition-all outline-none"
                      placeholder="e.g. 65"
                    />
                  </div>
                </div>
              </div>

              {/* Separator / Disclaimer */}
              <div className="pt-2">
                <p className="text-xs text-slate-500 text-center leading-relaxed">
                  By registering, you agree to our Terms of Service and Privacy Policy. Your health data is encrypted and secure.
                </p>
              </div>

              {errorMsg && (
                <div className="p-3 bg-red-50 text-red-600 border border-red-100 rounded-xl text-sm text-center">
                  {errorMsg}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-white font-semibold text-lg transition-all duration-300 shadow-xl ${
                  isSubmitting 
                    ? 'bg-slate-400 cursor-not-allowed shadow-none' 
                    : 'bg-gradient-to-r from-pink-500 to-purple-600 hover:shadow-pink-200 hover:-translate-y-0.5'
                }`}
              >
                {isSubmitting ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Complete Registration
                    <ArrowRight className="w-5 h-5 ml-1" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
