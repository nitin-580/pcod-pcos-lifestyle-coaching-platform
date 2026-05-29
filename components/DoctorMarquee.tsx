'use client';

import { useState, useEffect, useMemo } from 'react';
import { getPublicApiBase } from '@/lib/api-config';
import { Sparkles, CheckCircle } from 'lucide-react';

interface DoctorItem {
  id?: string;
  name: string;
  specialization: string;
  credentials: string;
  photo: string;
}

const MOCK_DOCTORS: DoctorItem[] = [
  { name: "Dr. Akansha Gupta", specialization: "Gynaecology & PCOS Expert", credentials: "MD, DGO • 12+ Years Exp", photo: "/doctor/akansha-gupta.png" },
  { name: "Dr. Deepa Gupta", specialization: "Clinical Nutritionist & Dietitian", credentials: "M.Sc. Nutrition • 8+ Years Exp", photo: "/doctor/deepa-gupta.png" },
  { name: "Dr. Manisha Ranjan", specialization: "Senior Consultant Gynecologist", credentials: "MBBS, MS • 15+ Years Exp", photo: "/doctor/manisha-ranjan.png" },
  { name: "Dr. Megha Mehra", specialization: "Hormonal Balance & Lifestyle Coach", credentials: "BAMS, MD (Ayurveda) • 9+ Years Exp", photo: "/doctor/megha-mehra.png" },
  { name: "Dr. Neha Raj", specialization: "PCOS & Fertility Consultant", credentials: "DNB, Gynec • 10+ Years Exp", photo: "/doctor/neha-raj.png" },
  { name: "Dr. Nyyaya Saini", specialization: "Women's Mental Health Specialist", credentials: "MD Psychiatry • 7+ Years Exp", photo: "/doctor/nyyaya-saini.png" },
  { name: "Dr. Prerna Gupta", specialization: "Endocrinologist & Metabolic Lead", credentials: "DM Endocrinology • 11+ Years Exp", photo: "/doctor/prerna-gupta.png" },
  { name: "Dr. Sanheeta Dasgupta", specialization: "Yoga & Pelvic Floor Coach", credentials: "RYT 500, Physio • 6+ Years Exp", photo: "/doctor/sanheeta-dasgupta.png" },
  { name: "Dr. Uma Mishra", specialization: "Holistic Health Advisor", credentials: "BAMS • 14+ Years Exp", photo: "/doctor/uma-mishra.png" }
];

export default function DoctorMarquee() {
  const [doctorsList, setDoctorsList] = useState<DoctorItem[]>(MOCK_DOCTORS);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await fetch(`${getPublicApiBase()}/doctors`);
        const result = await res.json();
        
        if (result.success && Array.isArray(result.data) && result.data.length > 0) {
          const matchedPhoto = (name: string) => {
            const clean = name.toLowerCase().replace(/dr\.\s*/g, '').trim();
            if (clean.includes('akansha')) return '/doctor/akansha-gupta.png';
            if (clean.includes('deepa')) return '/doctor/deepa-gupta.png';
            if (clean.includes('manisha')) return '/doctor/manisha-ranjan.png';
            if (clean.includes('megha')) return '/doctor/megha-mehra.png';
            if (clean.includes('neha')) return '/doctor/neha-raj.png';
            if (clean.includes('nyyaya') || clean.includes('saini')) return '/doctor/nyyaya-saini.png';
            if (clean.includes('prerna')) return '/doctor/prerna-gupta.png';
            if (clean.includes('sanheeta')) return '/doctor/sanheeta-dasgupta.png';
            if (clean.includes('uma')) return '/doctor/uma-mishra.png';
            return '/doctor/megha-mehra.png'; // default fallback
          };

          const apiDoctors = result.data.map((d: any) => ({
            id: d.id,
            name: d.name.startsWith('Dr.') ? d.name : `Dr. ${d.name}`,
            specialization: d.specialization || "Clinical Advisor",
            credentials: d.credentials || "Verified Expert",
            photo: matchedPhoto(d.name)
          }));

          // Merge backend doctors with local placeholder list, avoiding exact duplicates by name
          const merged = [...apiDoctors];
          MOCK_DOCTORS.forEach(mockDoc => {
            const cleanMockName = mockDoc.name.toLowerCase().replace(/dr\.\s*/g, '').trim();
            const exists = apiDoctors.some(apiDoc => {
              const cleanApiName = apiDoc.name.toLowerCase().replace(/dr\.\s*/g, '').trim();
              return cleanApiName === cleanMockName;
            });
            if (!exists) {
              merged.push(mockDoc);
            }
          });

          setDoctorsList(merged);
        }
      } catch (err) {
        console.error('Fetch doctors error in marquee:', err);
      }
    };

    fetchDoctors();
  }, []);

  // Double the list to create a seamless infinite marquee scroll
  const marqueeItems = useMemo(() => {
    return [...doctorsList, ...doctorsList];
  }, [doctorsList]);

  return (
    <section className="py-10 bg-gradient-to-b from-slate-50 to-[#FCFDFB] overflow-hidden relative">
      {/* Dynamic inline styles for smooth hardware-accelerated infinite marquee translation */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marqueeScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee-infinite {
          display: flex;
          width: max-content;
          animation: marqueeScroll 45s linear infinite;
        }
        .animate-marquee-infinite:hover {
          animation-play-state: paused;
        }
      `}} />

      <div className="max-w-6xl mx-auto px-6 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-pink-500 bg-pink-50 px-3 py-1 rounded-full border border-pink-100 shadow-sm">
            Clinical Panel
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight mt-2.5">
            WombCare's Elite Clinical Advisors
          </h2>
          <p className="text-slate-500 text-xs font-medium mt-1">
            Certified expert gynaecologists and endocrinologists syncing your hormonal path daily.
          </p>
        </div>
        
        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 bg-white border border-slate-100 shadow-sm px-3.5 py-1.5 rounded-full shrink-0">
          <Sparkles className="w-3.5 h-3.5 text-pink-400 animate-pulse" />
          Hover to pause sliding
        </div>
      </div>

      {/* Marquee Row Container */}
      <div className="relative w-full flex overflow-x-hidden border-y border-slate-100 bg-white/40 backdrop-blur-sm py-6">
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none" />

        <div className="animate-marquee-infinite gap-6 px-4">
          {marqueeItems.map((doc, idx) => (
            <div
              key={`${doc.name}-${idx}`}
              className="group w-[360px] bg-white border border-slate-100 hover:border-pink-200 rounded-3xl p-5 flex items-center gap-4 shrink-0 shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-[1.01]"
            >
              {/* Photo Box */}
              <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-slate-50 shrink-0 border border-slate-100 shadow-inner">
                <img
                  src={doc.photo}
                  alt={doc.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Text Fields */}
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-800 tracking-tight group-hover:text-pink-600 transition-colors">
                    {doc.name}
                  </h4>
                  <CheckCircle className="w-3.5 h-3.5 text-green-500 shrink-0 ml-1.5" />
                </div>
                
                <p className="text-[11px] font-semibold text-pink-500 tracking-tight">
                  {doc.specialization}
                </p>
                
                <p className="text-[10px] font-bold text-slate-400">
                  {doc.credentials}
                </p>

                {/* Micro badge */}
                <div className="pt-1">
                  <span className="inline-block text-[8px] font-extrabold uppercase tracking-widest text-[#7CA851] bg-[#FAFDF8] border border-[#E0EDD4] px-2 py-0.5 rounded">
                    wombcare verified
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
