'use client';

import Link from 'next/link';
import { MessageCircle, ArrowRight } from 'lucide-react';
import FloatingNavbar from '@/components/FloatingNavbar';
import Footer from '@/components/Footer';

export default function JoinWombCarePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-pink-50/30 to-purple-50/40">
      <FloatingNavbar />

      {/* Header Section */}
      <section className="border-b border-pink-100 bg-gradient-to-r from-pink-50/70 to-purple-50/70 pt-28">
        <div className="max-w-7xl mx-auto px-8 py-16">
          <p className="text-sm font-semibold tracking-wide text-pink-600 uppercase">
            Women’s Hormonal Wellness Platform
          </p>

          <h1 className="mt-4 text-5xl md:text-6xl font-bold leading-tight text-slate-900">
            Join{' '}
            <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              WombCare
            </span>
          </h1>

          <p className="mt-6 text-xl text-slate-600 max-w-3xl leading-8">
            Begin your structured hormonal wellness journey with clinically
            informed lifestyle programs designed for PCOD, cycle health,
            fertility support, and long-term wellness.
          </p>
        </div>
      </section>

      {/* Main Layout */}
      <section className="max-w-7xl mx-auto px-8 py-16 grid lg:grid-cols-12 gap-16">
        {/* Left information */}
        <div className="lg:col-span-7">
          <div className="space-y-12">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900 mb-6">
                What you get
              </h2>

              <div className="space-y-6">
                {[
                  'Personalized hormonal wellness roadmap',
                  'PCOD and menstrual cycle management',
                  'Fertility and lifestyle guidance',
                  'Structured nutrition and movement support',
                  'Continuous expert-led community access',
                ].map((item, index) => (
                  <div
                    key={item}
                    className="flex items-start gap-4 pb-5 border-b border-pink-100"
                  >
                    <div
                      className={`w-2.5 h-2.5 mt-3 rounded-full ${
                        index % 2 === 0
                          ? 'bg-pink-500'
                          : 'bg-purple-500'
                      }`}
                    />
                    <p className="text-lg text-slate-600 leading-8">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-100 p-8">
              <h3 className="text-xl font-semibold text-slate-900 mb-4">
                Why WombCare
              </h3>

              <p className="text-slate-600 leading-8 text-lg">
                Our care model combines medical awareness, cycle science,
                nutrition, and daily habit support into a structured framework
                that women can realistically follow.
              </p>
            </div>
          </div>
        </div>

        {/* Right CTA panel */}
        <div className="lg:col-span-5">
          <div className="rounded-3xl border border-pink-100 bg-white shadow-xl shadow-pink-100/40 p-8 space-y-8">
            <div>
              <p className="text-sm font-semibold tracking-wide text-purple-600 uppercase">
                Enrollment
              </p>

              <h2 className="mt-3 text-3xl font-bold text-slate-900">
                Choose your next step
              </h2>

              <p className="mt-4 text-slate-600 leading-8">
                Start your wellness plan or directly join our support
                community.
              </p>
            </div>

            {/* Primary CTA */}
            <Link
              href="/join-wombcare-form"
              className="w-full flex items-center justify-between px-6 py-5 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg hover:opacity-95 transition-all"
            >
              <div>
                <p className="font-semibold">Enroll in Program</p>
                <p className="text-sm text-white/80 mt-1">
                  Fill your wellness enrollment form
                </p>
              </div>

              <ArrowRight className="w-5 h-5" />
            </Link>

            {/* WhatsApp CTA */}
            <a
              href="https://chat.whatsapp.com/CAFOBPDpyPBA8vG1H9oDTP"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-between px-6 py-5 rounded-2xl border border-green-200 bg-green-50 hover:bg-green-100 transition-all"
            >
              <div>
                <p className="font-semibold text-slate-900">
                  Join WhatsApp Community
                </p>
                <p className="text-sm text-slate-500 mt-1">
                  Community support and guidance
                </p>
              </div>

              <MessageCircle className="w-5 h-5 text-green-600" />
            </a>

            {/* Trust note */}
            <div className="pt-8 border-t border-pink-100">
              <p className="text-sm text-slate-500 leading-7">
                Designed for women seeking structured and sustainable hormonal
                wellness support.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}