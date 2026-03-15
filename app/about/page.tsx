import FloatingNavbar from '@/components/FloatingNavbar';
import SocialProof from '@/components/SocialProof';
import RegistrationForm from '@/components/RegistrationForm';

export const metadata = {
  title: 'About Us | PCOD Coach',
  description: 'Learn more about our mission and the team behind PCOD Coach.',
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
            Our <span className="text-pink-500">Mission</span>
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed mb-12">
            We are dedicated to empowering women to take control of their hormonal health through science-backed coaching, compassionate support, and actionable lifestyle changes.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 bg-white border-y border-slate-100 relative">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <div className="aspect-square rounded-3xl overflow-hidden bg-slate-100 relative shadow-2xl">
               {/* eslint-disable-next-line @next/next/no-img-element */}
               <img src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=800&auto=format&fit=crop" alt="Our founder" className="w-full h-full object-cover" />
               <div className="absolute inset-0 bg-pink-500/10 mix-blend-overlay" />
            </div>
          </div>
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-slate-800">The Story Behind PCOD Coach</h2>
            <p className="text-slate-600 leading-relaxed text-lg">
              PCOD Coach was born out of a personal frustration with the lack of holistic, personalized care for women struggling with Polycystic Ovarian Disease and other hormonal imbalances. Our founder spent years navigating conflicting advice and dismissing symptoms before finally discovering the power of lifestyle-driven hormonal healing.
            </p>
            <p className="text-slate-600 leading-relaxed text-lg">
              Today, we bring together expert nutritionists, fitness coaches, and wellness guides to provide the comprehensive support we wish we had from the start.
            </p>
          </div>
        </div>
      </section>

      <SocialProof />
      <RegistrationForm />

      <footer className="bg-slate-900 text-slate-400 py-12 text-center text-sm border-t border-slate-800">
        <p>&copy; {new Date().getFullYear()} PCOD & Period Wellness Coach. All rights reserved.</p>
        <p className="mt-2 text-xs opacity-60">This tool is for educational purposes only and does not replace professional medical advice.</p>
      </footer>
    </main>
  );
}
