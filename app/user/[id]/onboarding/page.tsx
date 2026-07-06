'use client';

import { useParams, useRouter } from 'next/navigation';
import Form from '@/components/user/Form';
import FloatingNavbar from '@/components/FloatingNavbar'
import Footer from '@/components/Footer'

export default function UserOnboardingPage() {
  const params = useParams();
  const router = useRouter();

  const userId = params.id as string;

  const handleComplete = () => {
    router.push(`/user/${userId}/dashboard`);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-pink-50/20 to-purple-50/30 flex flex-col">
      <FloatingNavbar />
      
      {/* Container started below navbar */}
      <section className="w-full flex-1 pt-24 grid lg:grid-cols-12 gap-0">
        
        {/* Left Side Content - Takes 5 of 12 columns */}
        <div className="hidden lg:flex lg:col-span-5 flex-col justify-center px-16 py-16 border-r border-pink-100/60 bg-white/30 backdrop-blur-sm">
          <p className="text-sm font-semibold tracking-wide uppercase text-pink-600">
            Welcome to WombCare
          </p>

          <h1 className="mt-4 text-5xl font-black leading-tight text-slate-900">
            Let’s build your
            <br />
            wellness profile
          </h1>

          <p className="mt-6 text-lg text-slate-600 leading-8">
            Tell us about your cycle, wellness goals,
            hydration and symptoms so we can personalize
            your dashboard experience.
          </p>

          <div className="mt-12 space-y-5">
            {[
              'Cycle tracking',
              'Hydration goals',
              'Nutrition targets',
              'Personal wellness notes',
              'Doctor insights',
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-4"
              >
                <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-pink-500 to-purple-600" />
                <p className="text-slate-650 font-medium">{item}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side Form Section - Takes 7 of 12 columns */}
        <div className="lg:col-span-7 flex items-center justify-center px-6 md:px-16 py-16 bg-slate-50/40">
          <div className="w-full max-w-4xl">
            <p className="text-sm font-semibold text-pink-600 uppercase tracking-widest">
              Step 1 of 1
            </p>

            <h2 className="text-4xl font-extrabold text-slate-900 mt-3">
              Complete your profile
            </h2>

            <p className="mt-3 text-slate-500 text-sm">
              This helps us personalize your dashboard parameters and target goals.
            </p>

            <div className="mt-8 rounded-[36px] bg-white border border-pink-100 shadow-xl p-8 md:p-12">
              <Form
                userId={userId}
                onComplete={handleComplete}
              />
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}