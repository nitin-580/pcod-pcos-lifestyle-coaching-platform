import FloatingNavbar from '@/components/FloatingNavbar';
import SocialProof from '@/components/SocialProof';
import RegistrationForm from '@/components/RegistrationForm';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'About Us | WombCare',
  description:
    'Learn about WombCare’s mission to support women’s hormonal wellness through structured lifestyle care.',
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-slate-50 font-sans selection:bg-pink-100 selection:text-pink-900 pt-24">
      <FloatingNavbar />

      {/* Hero Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-purple-50 to-transparent opacity-60 pointer-events-none" />

        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-slate-800 tracking-tight mb-6">
            About{' '}
            <span className="text-pink-500">
              WombCare
            </span>
          </h1>

          <p className="text-xl text-slate-600 leading-relaxed mb-12">
            Supporting women through structured hormonal wellness,
            PCOD care, cycle health, and long-term lifestyle
            transformation.
          </p>
        </div>
      </section>

      {/* Meaning Section */}
      <section className="py-20 bg-white border-y border-slate-100">
        <div className="max-w-5xl mx-auto px-6">
          <div className="space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800">
              What WombCare Means
            </h2>

            <p className="text-lg text-slate-600 leading-9">
              WombCare is built with a simple purpose — to help
              women understand, manage, and improve their hormonal
              health through sustainable lifestyle support.
            </p>

            <p className="text-lg text-slate-600 leading-9">
              Millions of women experience symptoms such as
              irregular periods, PCOD / PCOS, acne, weight
              fluctuations, stress-related cycle disruption, and
              fertility concerns.
            </p>

            <p className="text-lg text-slate-600 leading-9">
              While medication can be an important part of care,
              long-term hormonal wellness often depends on daily
              habits such as nutrition, sleep, movement, stress
              management, and cycle awareness.
            </p>

            <p className="text-lg text-slate-600 leading-9">
              WombCare bridges this gap by providing structured,
              science-informed wellness guidance that women can
              realistically follow in their daily lives.
            </p>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="rounded-3xl bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-100 p-10">
            <h2 className="text-3xl font-bold text-slate-800 mb-6">
              Our Mission
            </h2>

            <p className="text-lg text-slate-600 leading-9">
              Our mission is to make hormonal wellness support
              accessible, structured, and personalized for every
              woman.
            </p>

            <p className="text-lg text-slate-600 leading-9 mt-5">
              We focus on practical solutions across nutrition,
              cycle health, wellness habits, and guided support
              systems that help women build confidence in managing
              their health.
            </p>
          </div>
        </div>
      </section>

      <SocialProof />
      <RegistrationForm />
      <Footer />
    </main>
  );
}