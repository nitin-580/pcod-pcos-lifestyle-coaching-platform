'use client';

import { useState } from 'react';
import FloatingNavbar from '@/components/FloatingNavbar';
import Footer from '@/components/Footer';

export default function JoinWombCareFormPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    phone: '',
    city: '',
    symptoms: '',
    duration: '',
    plan: '',
    consultationTime: '',
    notes: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);
    setError(null);

    try {
      const endpoint = 'https://womb-care-backend-76858014616.us-central1.run.app/api/enrollments';

      const payload = {
        fullName: formData.fullName,
        age: Number(formData.age),
        phone: formData.phone,
        city: formData.city,
        symptoms: formData.symptoms,
        duration: formData.duration,
        plan: formData.plan,
        consultationTime: formData.consultationTime,
        notes: formData.notes,
      };

      console.log('Submitting to:', endpoint);
      console.log('Payload:', payload);

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || 'Failed to submit enrollment'
        );
      }

      console.log('Enrollment success:', result);

      setSubmitted(true);
    } catch (err: any) {
      console.error('Enrollment error:', err);
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };



  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-pink-50/30 to-purple-50/40">
      <FloatingNavbar />

      {/* Header */}
      <section className="border-b border-pink-100 bg-gradient-to-r from-pink-50/70 to-purple-50/70 pt-28">
        <div className="max-w-7xl mx-auto px-8 py-16">
          <p className="text-sm font-semibold tracking-wide text-pink-600 uppercase">
            Enrollment Form
          </p>

          <h1 className="mt-4 text-5xl font-bold text-slate-900">
            Join WombCare Program
          </h1>

          <p className="mt-6 text-xl text-slate-600 max-w-3xl leading-8">
            Tell us a little about your wellness journey so we can
            personalize the best hormonal care plan for you.
          </p>
        </div>
      </section>

      {/* Main Layout */}
      <section className="max-w-7xl mx-auto px-8 py-16 grid lg:grid-cols-12 gap-16">
        {/* Left Info */}
        <div className="lg:col-span-5">
          <div className="space-y-8">
            <div className="rounded-3xl bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-100 p-8">
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">
                Why this form?
              </h2>

              <p className="text-slate-600 leading-8">
                Our care specialists use your responses to
                understand your hormonal health concerns and
                recommend the most suitable structured wellness
                plan.
              </p>
            </div>

            <div className="space-y-5">
              {[
                'Personalized care plan',
                'PCOD symptom support',
                'Cycle tracking guidance',
                'Nutrition + lifestyle support',
                'Expert follow-up',
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
              <div className="text-center py-10">
                <div className="w-16 h-16 rounded-full bg-green-500 text-white flex items-center justify-center mx-auto text-2xl mb-4">
                  ✓
                </div>

                <h2 className="text-3xl font-bold text-slate-900">
                  Thank You for Joining WombCare
                </h2>

                <p className="mt-4 text-slate-600 leading-8 max-w-xl mx-auto">
                  Our care team will connect with you shortly to
                  guide you through the next steps of your wellness
                  journey.
                </p>

                <a
                  href="https://chat.whatsapp.com/CAFOBPDpyPBA8vG1H9oDTP"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex mt-8 items-center gap-3 px-8 py-4 rounded-2xl bg-green-500 hover:bg-green-600 text-white font-semibold text-lg shadow-lg shadow-green-200 transition-all"
                >
                  Join Community
                </a>

                <p className="mt-4 text-sm text-slate-400">
                  Connect with our support community and get early
                  guidance.
                </p>
              </div>
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
                    name="age"
                    placeholder="Age"
                    value={formData.age}
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
                  name="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full border-b border-pink-200 py-3 focus:outline-none focus:border-pink-500"
                />

                <textarea
                  name="symptoms"
                  placeholder="Describe your symptoms"
                  value={formData.symptoms}
                  onChange={handleChange}
                  rows={3}
                  className="w-full border-b border-pink-200 py-3 focus:outline-none focus:border-pink-500"
                />

                <input
                  name="duration"
                  placeholder="How long have you been experiencing this?"
                  value={formData.duration}
                  onChange={handleChange}
                  className="w-full border-b border-pink-200 py-3 focus:outline-none focus:border-pink-500"
                />

                <select
                  name="plan"
                  value={formData.plan}
                  onChange={handleChange}
                  className="w-full border-b border-pink-200 py-3 bg-transparent focus:outline-none focus:border-pink-500"
                >
                  <option value="">
                    Select Preferred Plan
                  </option>
                  <option value="starter">
                    Starter Plan
                  </option>
                  <option value="premium">
                    Premium 90-Day Plan
                  </option>
                  <option value="consultation">
                    Doctor Consultation
                  </option>
                </select>

                <input
                  name="consultationTime"
                  placeholder="Preferred consultation time"
                  value={formData.consultationTime}
                  onChange={handleChange}
                  className="w-full border-b border-pink-200 py-3 focus:outline-none focus:border-pink-500"
                />

                <textarea
                  name="notes"
                  placeholder="Additional notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={3}
                  className="w-full border-b border-pink-200 py-3 focus:outline-none focus:border-pink-500"
                />

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold text-lg shadow-xl shadow-pink-200 hover:opacity-95 transition-all disabled:opacity-50"
                >
                  {isSubmitting
                    ? 'Submitting...'
                    : 'Submit Enrollment'}
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