'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import FloatingNavbar from '@/components/FloatingNavbar';
import Footer from '@/components/Footer';
import { getPublicApiBase } from '@/lib/api-config';

export default function JoinDoctorPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    specialization: '',
    qualification: '',
    experienceYears: '',
    hospitalClinic: '',
    city: '',
    consultationMode: 'Online + Offline',
    medicalRegistrationNumber: '',
    agreedToTerms: false,
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox'
          ? (e.target as HTMLInputElement).checked
          : value,
    }));
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!formData.agreedToTerms) {
      setError(
        'Please agree to the terms before continuing.'
      );
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload = {
        ...formData,
        experienceYears: Number(
          formData.experienceYears
        ),
      };

      const res = await fetch(
        `${getPublicApiBase()}/doctors/join-request`,
        {
          method: 'POST',
          headers: {
            'Content-Type':
              'application/json',
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.message ||
            'Failed to submit application'
        );
      }

      setSubmitted(true);
    } catch (err: any) {
      console.error(err);
      setError(
        err.message ||
          'Submission failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-pink-50/30 to-purple-50/40">
      <FloatingNavbar />

      {/* Header */}
      <section className="border-b border-pink-100 bg-gradient-to-r from-pink-50/70 to-purple-50/70 pt-28">
        <div className="max-w-7xl mx-auto px-8 py-16">
          <p className="text-sm font-semibold tracking-wide text-pink-600 uppercase">
            For Providers
          </p>

          <h1 className="mt-4 text-5xl font-bold text-slate-900">
            Join WombCare as a Doctor
          </h1>

          <p className="mt-6 text-xl text-slate-600 max-w-3xl leading-8">
            Partner with WombCare to provide expert
            hormonal wellness and women’s healthcare
            support.
          </p>
        </div>
      </section>

      {/* Main Layout */}
      <section className="max-w-7xl mx-auto px-8 py-16 grid lg:grid-cols-12 gap-16">
        {/* Left Side */}
        <div className="lg:col-span-5">
          <div className="space-y-8">
            <div className="rounded-3xl bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-100 p-8">
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">
                Why join WombCare?
              </h2>

              <p className="text-slate-600 leading-8">
                Expand your practice and help women
                access better hormonal and reproductive
                care through our trusted digital health
                platform.
              </p>
            </div>

            <div className="space-y-5">
              {[
                'Verified doctor onboarding',
                'Online + offline consultations',
                'Premium patient flow',
                'Dedicated provider dashboard',
                'Secure payouts & support',
              ].map((item, index) => (
                <div
                  key={item}
                  className="flex items-start gap-4 pb-4 border-b border-pink-100"
                >
                  <div
                    className={`w-2.5 h-2.5 mt-3 rounded-full ${
                      index % 2 === 0
                        ? 'bg-pink-500'
                        : 'bg-purple-500'
                    }`}
                  />
                  <p className="text-slate-600 text-lg">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Form */}
        <div className="lg:col-span-7">
          <div className="rounded-3xl border border-pink-100 bg-white shadow-xl shadow-pink-100/40 p-8">
            {submitted ? (
              <motion.div
                initial={{
                  opacity: 0,
                  scale: 0.95,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                className="text-center py-10"
              >
                <div className="w-16 h-16 rounded-full bg-green-500 text-white flex items-center justify-center mx-auto text-2xl mb-4">
                  ✓
                </div>

                <h2 className="text-3xl font-bold text-slate-900">
                  Application Submitted
                </h2>

                <p className="mt-4 text-slate-600 leading-8 max-w-xl mx-auto">
                  Thank you, Dr.{' '}
                  {formData.fullName}. Your
                  application has been received
                  successfully.
                </p>

                <p className="mt-2 text-slate-500">
                  A confirmation email has been
                  sent to{' '}
                  <span className="font-medium text-slate-700">
                    {formData.email}
                  </span>
                </p>

                <p className="mt-4 text-sm text-slate-400">
                  Our onboarding team will review
                  your credentials and connect
                  within 24 hours.
                </p>
              </motion.div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                {error && (
                  <div className="p-4 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-sm">
                    {error}
                  </div>
                )}

                <input
                  name="fullName"
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="w-full border-b border-pink-200 py-3 focus:outline-none focus:border-pink-500"
                />

                <div className="grid grid-cols-2 gap-6">
                  <input
                    name="email"
                    type="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full border-b border-pink-200 py-3 focus:outline-none focus:border-pink-500"
                  />

                  <input
                    name="phone"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full border-b border-pink-200 py-3 focus:outline-none focus:border-pink-500"
                  />
                </div>

                <input
                  name="specialization"
                  placeholder="Specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                  required
                  className="w-full border-b border-pink-200 py-3 focus:outline-none focus:border-pink-500"
                />

                <div className="grid grid-cols-2 gap-6">
                  <input
                    name="qualification"
                    placeholder="Qualification"
                    value={formData.qualification}
                    onChange={handleChange}
                    required
                    className="w-full border-b border-pink-200 py-3 focus:outline-none focus:border-pink-500"
                  />

                  <input
                    name="experienceYears"
                    type="number"
                    placeholder="Years of Experience"
                    value={formData.experienceYears}
                    onChange={handleChange}
                    required
                    className="w-full border-b border-pink-200 py-3 focus:outline-none focus:border-pink-500"
                  />
                </div>

                <input
                  name="medicalRegistrationNumber"
                  placeholder="Medical Registration No."
                  value={
                    formData.medicalRegistrationNumber
                  }
                  onChange={handleChange}
                  required
                  className="w-full border-b border-pink-200 py-3 focus:outline-none focus:border-pink-500"
                />

                <input
                  name="hospitalClinic"
                  placeholder="Hospital / Clinic"
                  value={formData.hospitalClinic}
                  onChange={handleChange}
                  className="w-full border-b border-pink-200 py-3 focus:outline-none focus:border-pink-500"
                />

                <div className="grid grid-cols-2 gap-6">
                  <input
                    name="city"
                    placeholder="City"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    className="w-full border-b border-pink-200 py-3 focus:outline-none focus:border-pink-500"
                  />

                  <select
                    name="consultationMode"
                    value={
                      formData.consultationMode
                    }
                    onChange={handleChange}
                    className="w-full border-b border-pink-200 py-3 bg-transparent focus:outline-none focus:border-pink-500"
                  >
                    <option>
                      Online + Offline
                    </option>
                    <option>
                      Online Only
                    </option>
                    <option>
                      Offline Only
                    </option>
                  </select>
                </div>

                <label className="flex items-center gap-3 rounded-2xl bg-pink-50 border border-pink-100 p-4">
                  <input
                    type="checkbox"
                    name="agreedToTerms"
                    checked={
                      formData.agreedToTerms
                    }
                    onChange={handleChange}
                    className="accent-pink-500"
                  />
                  <span className="text-sm text-slate-600">
                    I agree to the onboarding
                    terms and medical guidelines
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold text-lg shadow-xl shadow-pink-200 hover:opacity-95 transition-all disabled:opacity-50"
                >
                  {loading
                    ? 'Submitting...'
                    : 'Submit Application'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}