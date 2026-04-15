import FloatingNavbar from '@/components/FloatingNavbar';
import RegistrationForm from '@/components/RegistrationForm';

export const metadata = {
  title: 'What We Do | WombCare',
  description:
    'Discover how WombCare helps women manage PCOD/PCOS through science-backed nutrition, movement, and lifestyle transformation.',
};

export default function WhatWeDoPage() {
  return (
    <main className="min-h-screen bg-slate-50 font-sans pt-24">
      <FloatingNavbar />

      {/* Hero Section */}
      <section className="py-24 bg-white text-center">
        <div className="max-w-5xl mx-auto px-6">
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">
            What We <span className="text-purple-600">Do</span>
          </h1>
          <p className="text-xl text-slate-600 leading-8 max-w-3xl mx-auto">
            At <span className="font-semibold text-pink-600">WombCare</span>, we help women take control of their hormonal health through science-backed lifestyle programs designed specifically for PCOD/PCOS management.
          </p>
        </div>
      </section>

      {/* About Problem */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-slate-800 mb-6">
              Why WombCare Exists
            </h2>
            <p className="text-slate-600 leading-8 text-lg">
              Millions of women struggle with irregular periods, weight gain,
              acne, hair loss, mood swings, and infertility due to hormonal
              imbalance. While medication is often prescribed, daily lifestyle
              guidance is usually missing.
            </p>
            <p className="text-slate-600 leading-8 text-lg mt-4">
              WombCare bridges this gap with structured support, sustainable
              habits, and personalized wellness plans.
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-lg p-8 border border-slate-100">
            <h3 className="text-2xl font-bold text-purple-600 mb-4">
              Our Mission
            </h3>
            <p className="text-slate-600 leading-8">
              To make holistic PCOD management accessible, affordable, and
              personalized for every woman.
            </p>
          </div>
        </div>
      </section>

      {/* Core Pillars */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-slate-800 mb-16">
            Our 3 Core Pillars
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-50 p-8 rounded-3xl shadow-sm border">
              <h3 className="text-2xl font-bold text-pink-600 mb-4">
                Personalized Nutrition
              </h3>
              <p className="text-slate-600 leading-8">
                Low glycemic meals, anti-inflammatory foods, hormone-supportive
                nutrients, and sustainable diet habits designed specifically for
                insulin resistance and metabolic health.
              </p>
            </div>

            <div className="bg-slate-50 p-8 rounded-3xl shadow-sm border">
              <h3 className="text-2xl font-bold text-purple-600 mb-4">
                Yoga & Movement Therapy
              </h3>
              <p className="text-slate-600 leading-8">
                Guided PCOD-specific yoga, movement therapy, metabolism-boosting
                workouts, and stress-reducing practices that fit daily life.
              </p>
            </div>

            <div className="bg-slate-50 p-8 rounded-3xl shadow-sm border">
              <h3 className="text-2xl font-bold text-green-600 mb-4">
                Lifestyle & Habit Tracking
              </h3>
              <p className="text-slate-600 leading-8">
                Sleep, stress, movement, menstrual health, and food habits are
                continuously tracked to build long-term hormonal wellness.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Who We Serve */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-slate-800 mb-8">
            Who We Serve
          </h2>
          <p className="text-lg text-slate-600 leading-8">
            Women aged 18–40 who are dealing with PCOD/PCOS, irregular cycles,
            hormonal acne, fertility concerns, weight gain, and other
            hormone-related challenges.
          </p>
        </div>
      </section>

      {/* Why Choose */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-slate-800 mb-16">
            Why WombCare
          </h2>

          <div className="grid md:grid-cols-5 gap-6 text-center">
            {[
              'Affordable',
              'Structured',
              'Practical',
              'Science-informed',
              'Easy to follow',
            ].map((item) => (
              <div
                key={item}
                className="bg-slate-50 rounded-2xl p-6 border shadow-sm"
              >
                <p className="font-semibold text-slate-700">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-slate-800 mb-8">
            Our Vision
          </h2>
          <p className="text-lg text-slate-600 leading-8">
            We aim to build India’s most trusted women’s hormonal health
            platform — expanding from PCOD management into fertility support,
            supplements, and digital health tracking tools.
          </p>
        </div>
      </section>

      {/* CTA Extra Section */}
      <section className="py-24 bg-gradient-to-r from-pink-50 to-purple-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-slate-800 mb-6">
            Start Your 90-Day Healing Journey
          </h2>
          <p className="text-lg text-slate-600 mb-8">
            Join women across India who are transforming their hormonal health
            with WombCare.
          </p>
        </div>
      </section>

      <RegistrationForm />

      <footer className="bg-slate-900 text-slate-400 py-12 text-center text-sm">
        <p>
          &copy; {new Date().getFullYear()} WombCare. All rights reserved.
        </p>
      </footer>
    </main>
  );
}