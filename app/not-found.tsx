'use client';

import Link from 'next/link';
import { Home, MessageCircle, Sparkles } from 'lucide-react';

export default function NotFoundPage() {
  const whatsappInviteLink =
    'https://chat.whatsapp.com/CAFOBPDpyPBA8vG1H9oDTP';

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center px-6 relative overflow-hidden">
      {/* Background blur accents */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-pink-200/30 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-200/30 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-2xl w-full text-center bg-white/90 backdrop-blur-md rounded-[2rem] shadow-2xl border border-pink-100 p-10 md:p-14">
        {/* Icon */}
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg mb-6">
          <Sparkles className="w-9 h-9" />
        </div>

        {/* Heading */}
        <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4 leading-tight">
          This space is still
          <span className="block bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
            coming to life
          </span>
        </h1>

        {/* Text */}
        <p className="text-lg text-slate-600 leading-8 max-w-xl mx-auto mb-10">
          We’re building something meaningful for your wellness journey.
          Until it’s ready, stay connected with the WombCare community
          for updates, support, and early access.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a
            href={whatsappInviteLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-green-500 text-white font-semibold shadow-lg hover:bg-green-600 transition-all"
          >
            <MessageCircle className="w-5 h-5" />
            Join WhatsApp Community
          </a>

          <Link
            href="/"
            className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition-all"
          >
            <Home className="w-5 h-5" />
            Go to Home
          </Link>
        </div>

        {/* Footer note */}
        <p className="text-sm text-slate-400 mt-8">
          WombCare • Women’s Hormonal Wellness Platform
        </p>
      </div>
    </main>
  );
}