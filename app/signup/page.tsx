'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getPublicApiBase } from '@/lib/api-config';

export default function SignupPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    specialization: '',
    credentials: 'MBBS, MD',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validate passwords
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    const { confirmPassword, ...payload } = formData;

    try {
      const res = await fetch(
        `${getPublicApiBase()}/doctors/signup`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();

      if (data.success) {
        setSuccess(true);

        setTimeout(() => {
          router.push('/join-wombcare');
        }, 2000);
      } else {
        setError(data.message || 'Signup failed');
      }
    } catch (err) {
      setError(
        'Connection failed. Please check if backend is running.'
      );
      console.error('Signup error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white">
      <div className="grid lg:grid-cols-2 min-h-screen">
        {/* Left Signup Panel */}
        <div className="flex items-center justify-center px-8 md:px-16 lg:px-24 bg-white border-r border-slate-100 py-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-md"
          >
            <h1 className="text-5xl font-bold text-slate-800 mb-3">
              Join Us
            </h1>

            <p className="text-slate-500 mb-10 text-lg">
              Join WombCare and empower women&apos;s health
            </p>

            {success ? (
              <div className="p-8 bg-green-50 rounded-3xl border border-green-100 text-center">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4">
                  ✓
                </div>

                <h3 className="text-xl font-bold text-slate-800">
                  Account Created!
                </h3>

                <p className="text-slate-600 mt-2">
                  Redirecting you to Plans...
                </p>
              </div>
            ) : (
              <form
                className="space-y-4"
                onSubmit={handleSubmit}
              >
                {error && (
                  <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">
                    {error}
                  </div>
                )}

                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Dr. Jane Doe"
                    className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>

                {/* Phone + Specialization */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91..."
                      className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Specialization
                    </label>
                    <input
                      type="text"
                      name="specialization"
                      required
                      value={formData.specialization}
                      onChange={handleChange}
                      placeholder="Gynecologist"
                      className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="doctor@wombcare.com"
                    className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold text-lg shadow-xl shadow-pink-200 hover:opacity-95 transition-all disabled:opacity-50 mt-4"
                >
                  {isLoading
                    ? 'Creating Account...'
                    : 'Create Account'}
                </button>
              </form>
            )}

            <p className="text-center mt-8 text-slate-500">
              Already have an account?{' '}
              <Link
                href="/login"
                className="text-purple-600 font-medium hover:text-pink-500"
              >
                Sign in
              </Link>
            </p>
          </motion.div>
        </div>

        {/* Right Brand Section */}
        <div className="hidden lg:flex items-center justify-center bg-gradient-to-br from-pink-50 via-white to-purple-50 px-20">
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-xl"
          >
            <div className="text-7xl text-pink-200 mb-6 font-serif">
              “
            </div>

            <h2 className="text-5xl font-bold leading-tight text-slate-800 mb-8">
              Empower your hormonal wellness journey.
            </h2>

            <p className="text-2xl leading-relaxed text-slate-600">
              Join thousands of experts using WombCare to bridge
              the gap in women&apos;s health through personalized
              care, cycle tracking, and nutrition.
            </p>

            <div className="mt-10 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center text-white font-bold">
                W
              </div>

              <div>
                <p className="font-semibold text-slate-800">
                  WombCare
                </p>
                <p className="text-slate-500 text-sm">
                  Women’s Wellness Platform
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}