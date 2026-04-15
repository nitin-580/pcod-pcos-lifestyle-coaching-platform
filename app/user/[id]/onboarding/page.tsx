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
    <main className="min-h-screen bg-gradient-to-br from-white via-pink-50/20 to-purple-50/30">
      <section className="max-w-6xl mx-auto min-h-screen grid lg:grid-cols-2">
        <FloatingNavbar />
        {/* Left Content */}
        <div className="hidden lg:flex flex-col justify-center px-14 border-r border-pink-100">
          <p className="text-sm font-semibold tracking-wide uppercase text-pink-600">
            Welcome to WombCare
          </p>

          <h1 className="mt-4 text-5xl font-bold leading-tight text-slate-900">
            Let’s build your
            <br />
            wellness profile
          </h1>

          <p className="mt-6 text-lg text-slate-600 leading-8 max-w-lg">
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
                <p className="text-slate-600">{item}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Form Section */}
        <div className="flex items-center justify-center px-6 md:px-10 py-12">
          <div className="w-full max-w-2xl">
            <p className="text-sm font-semibold text-pink-600 uppercase">
              Step 1 of 1
            </p>

            <h2 className="text-4xl font-bold text-slate-900 mt-3">
              Complete your profile
            </h2>

            <p className="mt-3 text-slate-500">
              This helps us personalize your dashboard.
            </p>

            <div className="mt-10 rounded-[32px] bg-white border border-pink-100 shadow-xl p-6 md:p-8">
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