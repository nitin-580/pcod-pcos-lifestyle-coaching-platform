import Link from 'next/link';
import FloatingNavbar from '@/components/FloatingNavbar';
import PricingTable from '@/components/PricingTable';

export const metadata = {
  title: 'Pricing | WombCare',
  description:
    'Explore affordable hormonal wellness and PCOD care plans designed for every woman.',
};

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <FloatingNavbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-white px-6">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-pink-600 font-semibold mb-3">
            Flexible Wellness Plans
          </p>

          <h1 className="text-5xl md:text-6xl font-bold text-slate-800 leading-tight">
            Choose a plan for your
            <span className="text-purple-600"> hormonal health</span>
          </h1>

          <p className="text-lg text-slate-600 mt-6 max-w-3xl mx-auto leading-8">
            Personalized plans built for PCOD, cycle balance, nutrition,
            fertility wellness, and long-term lifestyle transformation.
          </p>

          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <Link
              href="/hormonal-check"
              className="px-6 py-3 rounded-2xl border border-slate-200 bg-white font-semibold text-slate-700 hover:shadow-sm transition-all"
            >
              Take Free Health Check
            </Link>

            <a
              href="https://chat.whatsapp.com/YOUR_INVITE_CODE"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-2xl bg-green-500 text-white font-semibold shadow-lg hover:opacity-95 transition-all"
            >
              Join WhatsApp Community
            </a>
          </div>
        </div>
      </section>

      {/* Reusable Pricing Table */}
      <PricingTable />

      {/* Why Choose Us */}
      <section className="py-20 bg-white px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-slate-800 mb-6">
            Why WombCare Plans Work
          </h2>

          <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-8">
            Every plan is built using a science-backed framework combining
            nutrition, yoga, habit tracking, and hormonal wellness support.
          </p>

          <div className="grid md:grid-cols-4 gap-6 mt-12">
            {[
              'PCOD-focused care',
              'Affordable pricing',
              'Doctor-backed guidance',
              'Long-term habit support',
            ].map((item) => (
              <div
                key={item}
                className="rounded-2xl bg-slate-50 border border-slate-100 p-6 shadow-sm"
              >
                <p className="font-semibold text-slate-700">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-24 bg-gradient-to-r from-pink-50 to-purple-50 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-slate-800 mb-4">
            Start your healing journey today
          </h2>

          <p className="text-lg text-slate-600 mb-8">
            Take control of your hormonal health with a plan that fits your
            lifestyle.
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/join-wombcare"
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold shadow-xl"
            >
              Get Started
            </Link>

            <Link
              href="/hormonal-check"
              className="px-8 py-4 rounded-2xl border border-slate-300 bg-white font-semibold text-slate-700"
            >
              Check My Health First
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
