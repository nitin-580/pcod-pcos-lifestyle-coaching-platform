import FloatingNavbar from '@/components/FloatingNavbar';
import PeriodHealthSection from '@/components/PeriodHealthSection';
import PeriodCards from '@/components/PeriodCards';
import RegistrationForm from '@/components/RegistrationForm';

export const metadata = {
  title: 'What We Do | PCOD Coach',
  description: 'Discover how our personalized PCOD coaching programs can transform your hormonal health.',
};

export default function WhatWeDoPage() {
  return (
    <main className="min-h-screen bg-slate-50 font-sans selection:bg-pink-100 selection:text-pink-900 pt-24">
      <FloatingNavbar />
      
      {/* Hero Section */}
      <section className="py-20 relative overflow-hidden bg-white">
        <div className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-pink-50 to-transparent opacity-60 pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-slate-800 tracking-tight mb-6">
            What We <span className="text-purple-600">Do</span>
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
            We provide holistic, step-by-step coaching programs tailored to your unique hormonal profile. Say goodbye to guesswork and hello to a personalized roadmap to healing.
          </p>
        </div>
      </section>

      {/* Reused sections to demonstrate the value */}
      <PeriodHealthSection />
      <PeriodCards />
      
      {/* Coaching Pillars */}
      <section className="py-24 bg-white relative border-t border-slate-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800">Our Core Pillars</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
               <div className="w-12 h-12 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center font-bold text-lg mb-6">1</div>
               <h3 className="text-xl font-bold text-slate-800 mb-4">Nutritional Therapy</h3>
               <p className="text-slate-600 leading-relaxed">Custom meal plans designed to balance blood sugar, reduce inflammation, and support healthy hormone production without restrictive dieting.</p>
            </div>
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
               <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-bold text-lg mb-6">2</div>
               <h3 className="text-xl font-bold text-slate-800 mb-4">Cycle-Synced Fitness</h3>
               <p className="text-slate-600 leading-relaxed">Workout routines that align with your menstrual phases, ensuring you build strength and burn fat without over-stressing your adrenals.</p>
            </div>
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
               <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-bold text-lg mb-6">3</div>
               <h3 className="text-xl font-bold text-slate-800 mb-4">Stress & Sleep</h3>
               <p className="text-slate-600 leading-relaxed">Actionable protocols to optimize your circadian rhythm, lower cortisol levels, and fundamentally improve your body's ability to heal itself.</p>
            </div>
          </div>
        </div>
      </section>

      <RegistrationForm />

      <footer className="bg-slate-900 text-slate-400 py-12 text-center text-sm border-t border-slate-800">
        <p>&copy; {new Date().getFullYear()} PCOD & Period Wellness Coach. All rights reserved.</p>
      </footer>
    </main>
  );
}
