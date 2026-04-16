'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { getPublicApiBase } from '@/lib/api-config';
import { Mail, ShieldCheck, Lock, ArrowLeft } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<'email' | 'otp' | 'reset'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch(`${getPublicApiBase()}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to send OTP');

      setStep('otp');
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch(`${getPublicApiBase()}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Invalid OTP');

      setStep('reset');
    } catch (err: any) {
      setError(err.message || 'Verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch(`${getPublicApiBase()}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, newPassword }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Reset failed');

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Password reset failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white">
      <div className="grid lg:grid-cols-2 min-h-screen">
        {/* Left Form Section */}
        <div className="flex items-center justify-center px-8 md:px-16 lg:px-24 py-12 border-r border-slate-100">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-md"
          >
            {success ? (
              <div className="text-center">
                <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center text-3xl mx-auto mb-6 shadow-sm border border-green-100">
                  ✓
                </div>
                <h1 className="text-4xl font-bold text-slate-800 mb-4">Password Reset!</h1>
                <p className="text-slate-500 mb-8 text-lg">Your password has been successfully updated. You can now login with your new credentials.</p>
                <Link 
                  href="/login"
                  className="inline-block w-full py-4 rounded-2xl bg-slate-900 text-white font-bold text-lg hover:bg-black transition-all"
                >
                  Back to Login
                </Link>
              </div>
            ) : (
              <>
                <Link href="/login" className="inline-flex items-center gap-2 text-slate-400 hover:text-pink-500 transition-colors mb-8 font-medium">
                  <ArrowLeft className="w-4 h-4" /> Back to Login
                </Link>

                <h1 className="text-5xl font-bold text-slate-800 mb-3">
                  {step === 'email' ? 'Forgot Password' : step === 'otp' ? 'Verify OTP' : 'New Password'}
                </h1>
                <p className="text-slate-500 mb-10 text-lg leading-relaxed">
                  {step === 'email' 
                    ? 'Enter your email to receive a secure 6-digit verification code.' 
                    : step === 'otp' 
                    ? `We've sent a code to your email. Enter it below to verify.` 
                    : 'Create a strong new password for your account.'}
                </p>

                <form className="space-y-6" onSubmit={
                  step === 'email' ? handleRequestOtp : 
                  step === 'otp' ? handleVerifyOtp : 
                  handleResetPassword
                }>
                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-rose-50 text-rose-600 rounded-2xl text-sm border border-rose-100 flex items-center gap-3"
                    >
                      <X className="w-4 h-4" /> {error}
                    </motion.div>
                  )}

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">
                      {step === 'email' ? 'Email Address' : step === 'otp' ? '6-Digit Code' : 'New Password'}
                    </label>
                    <div className="relative group">
                      <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-pink-500 transition-colors">
                        {step === 'email' ? <Mail className="w-5 h-5" /> : step === 'otp' ? <ShieldCheck className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                      </div>
                      <input
                        type={step === 'reset' ? 'password' : 'text'}
                        required
                        value={step === 'email' ? email : step === 'otp' ? otp : newPassword}
                        onChange={(e) => {
                          if (step === 'email') setEmail(e.target.value);
                          else if (step === 'otp') setOtp(e.target.value.replace(/\D/g, '').slice(0, 6));
                          else setNewPassword(e.target.value);
                        }}
                        placeholder={step === 'email' ? 'dr.jane@example.com' : step === 'otp' ? '• • • • • •' : '••••••••'}
                        className="w-full pl-14 pr-5 py-4 rounded-2xl border border-slate-200 outline-none focus:ring-2 focus:ring-pink-500 transition-all font-medium text-slate-800"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-lg shadow-xl shadow-pink-200 hover:scale-[1.01] transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-3"
                  >
                    {isLoading ? (
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      step === 'email' ? 'Send OTP' : step === 'otp' ? 'Verify Code' : 'Update Password'
                    )}
                  </button>
                </form>

                {step === 'otp' && (
                  <p className="text-center mt-6 text-slate-500">
                    Didn't receive code?{' '}
                    <button 
                      onClick={handleRequestOtp}
                      type="button" 
                      className="text-purple-600 font-bold hover:text-pink-500"
                    >
                      Resend
                    </button>
                  </p>
                )}
              </>
            )}
          </motion.div>
        </div>

        {/* Right Brand Section */}
        <div className="hidden lg:flex items-center justify-center bg-gradient-to-br from-pink-50 via-white to-purple-50 px-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-xl"
          >
            <div className="text-9xl text-pink-100 mb-6 font-serif">“</div>
            <h2 className="text-5xl font-black leading-tight text-slate-900 mb-8 tracking-tight">Your care journey stays secure.</h2>
            <p className="text-2xl leading-relaxed text-slate-600 font-medium">Reset your password safely and regain access to your personalized health insights and professional dashboard.</p>
            
            <div className="mt-16 flex items-center gap-6">
              <div className="flex -space-x-3">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-12 h-12 rounded-full border-4 border-white bg-slate-200" />
                ))}
              </div>
              <p className="text-slate-500 font-bold">Joined by 10,000+ Providers</p>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}

const X = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);