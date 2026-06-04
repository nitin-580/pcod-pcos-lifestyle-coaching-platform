'use client';

import { motion } from 'framer-motion';
import { Download, ShieldCheck, CheckCircle2, Smartphone } from 'lucide-react';

export default function ApkDownload() {
  return (
    <section className="py-20 bg-gradient-to-br from-[#F8F4FF] via-white to-[#FFF0F5] relative overflow-hidden">
      {/* Glow decorative blobs */}
      <div className="absolute -left-48 top-12 w-96 h-96 bg-purple-200/40 rounded-full filter blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute -right-48 bottom-12 w-96 h-96 bg-pink-200/40 rounded-full filter blur-3xl pointer-events-none animate-pulse" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 bg-white/70 backdrop-blur-xl rounded-[2.5rem] border border-white/80 p-8 md:p-14 shadow-xl">
          
          {/* Left Column: Direct APK Download info */}
          <div className="flex-1 space-y-6 text-left">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-pink-100 text-pink-600 text-xs font-bold rounded-full uppercase tracking-wider">
              <Smartphone className="w-3.5 h-3.5" /> Direct Installation
            </span>
            
            <h2 className="text-3xl md:text-5xl font-black text-slate-800 tracking-tight leading-none">
              Download WombCare <br />
              <span className="text-[#FF4D8D]">Directly to Android</span>
            </h2>
            
            <p className="text-slate-600 text-base md:text-lg max-w-lg leading-relaxed">
              Start tracking your menstrual cycles, logging symptoms, and balancing hormones with our personalized companion app.
            </p>

            {/* Feature Checkmarks */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                <span className="text-sm font-semibold text-slate-700">WombCare APK v1.0.1</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                <span className="text-sm font-semibold text-slate-700">Official Android release</span>
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-purple-500 flex-shrink-0" />
                <span className="text-sm font-semibold text-slate-700">Secure download from wombcare.in</span>
              </div>
            </div>

            {/* Download Button */}
            <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <a
                href="https://pub-a67185b5775c4b26ab3cebd36d579b22.r2.dev/wombcare.apk"
                download
                className="inline-flex items-center justify-center gap-3.5 px-8 py-4.5 bg-slate-900 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl hover:bg-slate-800 transition-all text-sm group"
              >
                <Download className="w-5 h-5 animate-bounce group-hover:scale-110" />
                <span>Download WombCare APK v1.0.1</span>
              </a>
              <span className="text-xs text-slate-500 font-medium">
                Size: ~24 MB • Format: .apk
              </span>
            </div>
          </div>

          {/* Right Column: Coming soon on App Stores */}
          <div className="flex-1 w-full max-w-md bg-[#F1EAFE]/40 border border-[#E9DFFF] rounded-3xl p-8 text-center space-y-6">
            <h3 className="text-lg font-bold text-slate-800">
              Official Store Listings
            </h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              We are currently finalizing reviews to launch natively on both major app stores.
            </p>

            <div className="space-y-4">
              {/* App Store Coming Soon Button */}
              <div className="relative group overflow-hidden rounded-2xl border border-slate-200 bg-white/50 p-4 flex items-center justify-between opacity-70 filter grayscale cursor-not-allowed">
                <div className="flex items-center gap-3">
                  <svg className="w-7 h-7 text-slate-600" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71,19.5C17.88,20.74 17,21.95 15.66,22C14.32,22.05 13.89,21.24 12.37,21.24C10.84,21.24 10.37,21.97 9.1,22C7.79,22.05 6.8,20.68 5.96,19.47C4.25,17 2.94,12.45 4.7,9.39C5.57,7.87 7.13,6.91 8.82,6.88C10.1,6.86 11.32,7.75 12.11,7.75C12.89,7.75 14.37,6.68 15.92,6.84C16.57,6.87 18.39,7.1 19.56,8.82C19.47,8.88 17.39,10.1 17.41,12.63C17.44,15.65 20.06,16.66 20.1,16.67C20.08,16.74 19.67,18.11 18.71,19.5M15.97,4.17C16.63,3.37 17.07,2.28 16.95,1C16,1.04 14.9,1.6 14.24,2.38C13.68,3.04 13.19,4.14 13.34,5.39C14.39,5.47 15.4,4.88 15.97,4.17Z"/>
                  </svg>
                  <div className="text-left">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Download on the</p>
                    <p className="text-sm font-black text-slate-700 leading-tight">App Store</p>
                  </div>
                </div>
                <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 bg-purple-100 text-purple-700 rounded-lg">
                  Coming Soon
                </span>
              </div>

              {/* Google Play Store Coming Soon Button */}
              <div className="relative group overflow-hidden rounded-2xl border border-slate-200 bg-white/50 p-4 flex items-center justify-between opacity-70 filter grayscale cursor-not-allowed">
                <div className="flex items-center gap-3">
                  <svg className="w-7 h-7 text-slate-600" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M5,3.04C4.68,3.04 4.38,3.2 4.21,3.47L12.54,11.8L16.27,8.07L5.73,3.17C5.5,3.08 5.25,3.04 5,3.04M3.07,4.28C3.03,4.5 3,4.75 3,5V19C3,19.25 3.03,19.5 3.07,19.72L11.5,12.76L3.07,4.28M17.47,8.62L13.56,12.53L17.47,16.44L20.57,14.68C21.45,14.18 21.84,13.43 21.68,12.76C21.84,12.09 21.45,11.34 20.57,10.84L17.47,8.62M12.54,13.26L4.21,20.59C4.38,20.86 4.68,21.02 5,21.02C5.25,21.02 5.5,20.97 5.73,20.89L16.27,16.96L12.54,13.26Z"/>
                  </svg>
                  <div className="text-left">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Get it on</p>
                    <p className="text-sm font-black text-slate-700 leading-tight">Google Play</p>
                  </div>
                </div>
                <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 bg-purple-100 text-purple-700 rounded-lg">
                  Coming Soon
                </span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 font-semibold tracking-wide">
              Official application package is malware-scanned & safe.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
