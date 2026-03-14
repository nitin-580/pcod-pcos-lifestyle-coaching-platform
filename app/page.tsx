import FloatingNavbar from '@/components/FloatingNavbar';
import Hero from '@/components/Hero';
import PeriodCards from '@/components/PeriodCards';
import Counter from '@/components/Counter';
import SymptomChecker from '@/components/SymptomChecker';
import HormoneQuiz from '@/components/HormoneQuiz';
import SocialProof from '@/components/SocialProof';
import EarlySignup from '@/components/EarlySignup';
import PeriodHealthSection from '@/components/PeriodHealthSection';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 font-sans selection:bg-pink-100 selection:text-pink-900">
      <FloatingNavbar />
      <Hero />
      <Counter />

      {/* Symptom Checker Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-purple-50 to-transparent opacity-60 pointer-events-none" />
        <div className="max-w-6xl mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-6">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-800 tracking-tight">
              Is it PCOD? <br/><span className="text-purple-600">Check Your Symptoms</span>
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed max-w-lg">
              Many women struggle with unexplained weight gain, irregular cycles, and fatigue. Take our quick, science-backed assessment to see if your symptoms align with PCOD risk factors.
            </p>
          </div>
          <div className="flex-1 w-full">
            <SymptomChecker />
          </div>
        </div>
      </section>
      <PeriodCards />
      {/* Hormone Quiz Section */}
      <section className="py-24 bg-slate-50 relative">
        <div className="max-w-6xl mx-auto px-6">
          <HormoneQuiz />
        </div>
      </section>
      <PeriodHealthSection/>
      <SocialProof />
      <EarlySignup />
      
      <footer className="bg-slate-900 text-slate-400 py-12 text-center text-sm border-t border-slate-800">
        <p>&copy; {new Date().getFullYear()} PCOD & Period Wellness Coach. All rights reserved.</p>
        <p className="mt-2 text-xs opacity-60">This tool is for educational purposes only and does not replace professional medical advice.</p>
      </footer>
    </main>
  );
}
