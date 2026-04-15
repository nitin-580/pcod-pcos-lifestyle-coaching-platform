'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getPublicApiBase } from '@/lib/api-config';

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Step 1: Login
      const res = await fetch(
        `${getPublicApiBase()}/doctors/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await res.json();

      if (!data.success) {
        setError(data.message || 'Invalid email or password');
        return;
      }

      const userId = data.doctor.id;

      // Save session
      localStorage.setItem('userToken', data.token);
      localStorage.setItem(
        'userData',
        JSON.stringify(data.doctor)
      );

      // Step 2: Check profile completion
      const profileRes = await fetch(
        `${getPublicApiBase()}/wombcare/profile/${userId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${data.token}`,
          },
        }
      );

      // If profile row missing → onboarding
      if (profileRes.status === 404) {
        router.push(`/user/${userId}/onboarding`);
        return;
      }

      const profileData = await profileRes.json();
      const profile = profileData.data;

      // Step 3: Redirect based on profile completion
      if (!profile || !profile.profileCompleted) {
        router.push(`/user/${userId}/onboarding`);
      } else {
        router.push(`/user/${userId}/dashboard`);
      }
    } catch (err) {
      setError(
        'Connection failed. Please check if backend is running.'
      );
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white">
      <div className="grid lg:grid-cols-2 min-h-screen">
        
        {/* Left Login Panel */}
        <div className="flex items-center justify-center px-8 md:px-16 lg:px-24 bg-white border-r border-slate-100">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-md"
          >
            <h1 className="text-5xl font-bold text-slate-800 mb-3">
              Welcome back
            </h1>

            <p className="text-slate-500 mb-10 text-lg">
              Sign in to your WombCare account
            </p>

            <form
              className="space-y-5"
              onSubmit={handleSubmit}
            >
              {error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">
                  {error}
                </div>
              )}

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email
                </label>

                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  placeholder="you@example.com"
                  className="w-full px-5 py-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>

              {/* Password */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium text-slate-700">
                    Password
                  </label>

                  <button
                    type="button"
                    className="text-sm text-purple-600 hover:text-pink-500"
                  >
                    Forgot password?
                  </button>
                </div>

                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  placeholder="••••••••"
                  className="w-full px-5 py-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold text-lg shadow-xl shadow-pink-200 hover:opacity-95 transition-all disabled:opacity-50"
              >
                {isLoading
                  ? 'Signing In...'
                  : 'Sign In'}
              </button>
            </form>

            <p className="text-center mt-8 text-slate-500">
              Don’t have an account?{' '}
              <Link
                href="/signup"
                className="text-purple-600 font-medium hover:text-pink-500"
              >
                Sign up
              </Link>
            </p>

            <p className="text-xs text-slate-400 mt-12 leading-relaxed">
              By continuing, you agree to WombCare’s{' '}
              <Link
                href="/terms-and-conditions"
                className="underline hover:text-slate-600"
              >
                Terms & Conditions
              </Link>{' '}
              and{' '}
              <Link
                href="/privacy-policy"
                className="underline hover:text-slate-600"
              >
                Privacy Policy
              </Link>
              .
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
            <div className="text-7xl text-pink-200 mb-6">
              “
            </div>

            <h2 className="text-5xl font-bold leading-tight text-slate-800 mb-8">
              Your journey to hormonal balance starts here.
            </h2>

            <p className="text-2xl leading-relaxed text-slate-600">
              WombCare helps women take control of PCOD,
              periods, fertility, and overall wellness
              through expert guidance, tracking, and
              personalized care.
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