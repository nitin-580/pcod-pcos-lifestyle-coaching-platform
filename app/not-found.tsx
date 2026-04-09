'use client';

import Link from 'next/link';
import { Home, MessageCircle } from 'lucide-react';

export default function NotFoundPage() {
  const whatsappInviteLink = 'https://chat.whatsapp.com/YOUR_INVITE_CODE';

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center px-6">
      <div className="max-w-2xl w-full text-center bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-slate-100 p-10 md:p-14">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white text-3xl font-bold shadow-lg mb-6">
          🌸
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4 leading-tight">
          Oops… this page is still blooming
        </h1>

        <p className="text-lg text-slate-600 leading-8 max-w-xl mx-auto mb-10">
          We’re carefully crafting something beautiful for your wellness journey.
          Until then, stay connected with the WombCare community for updates,
          support, and early access.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a
            href={whatsappInviteLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-green-500 text-white font-semibold shadow-lg hover:opacity-95 transition-all"
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

        <p className="text-sm text-slate-400 mt-8">
          Replace <span className="font-medium">YOUR_INVITE_CODE</span> with your WhatsApp invite link.
        </p>
      </div>
    </main>
  );
}
