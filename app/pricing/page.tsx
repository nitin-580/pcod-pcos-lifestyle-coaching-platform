import Link from 'next/link';
import FloatingNavbar from '@/components/FloatingNavbar';
import PricingTable from '@/components/PricingTable';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Pricing | WombCare',
  description:
    'Explore affordable hormonal wellness and PMOS care plans designed for every woman.',
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
            Personalized plans built for PMOS, cycle balance, nutrition,
            fertility wellness, and long-term lifestyle transformation.
          </p>

          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <Link
              href="#pricing"
              className="px-6 py-3 rounded-2xl bg-purple-600 text-white font-semibold shadow-lg hover:bg-purple-700 transition-all animate-bounce-subtle"
            >
              View Plans
            </Link>
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
              'PMOS-focused care',
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

      {/* WhatsApp Support Community */}
      <section className="py-16 bg-gradient-to-r from-pink-50 to-purple-50 px-6">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 tracking-tight">
            Join Our Support Community
          </h2>
          <p className="text-lg text-slate-600 max-w-xl mx-auto leading-relaxed">
            Connect with women on their hormonal wellness journey. Get daily support, expert guidance, and healthy lifestyle tips.
          </p>
          <div>
            <a
              href="https://chat.whatsapp.com/CAFOBPDpyPBA8vG1H9oDTP"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-4 rounded-2xl bg-green-500 text-white font-bold shadow-lg hover:bg-green-600 hover:-translate-y-0.5 transition-all duration-300 gap-2"
            >
              Join WhatsApp Community
            </a>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
