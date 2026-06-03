'use client';

import { useMemo } from 'react';
import { Sparkles, CheckCircle } from 'lucide-react';

interface DoctorItem {
  name: string;
  specialization: string;
  credentials: string;
  photo: string;
}

const DOCTORS: DoctorItem[] = [
  {
    name: "Dr. Akansha Gupta",
    specialization: "Gynaecology & PCOS Expert",
    credentials: "MD, DGO • 12+ Years Exp",
    photo: "/doctor/akansha-gupta.png"
  },
  {
    name: "Dr. Deepa Gupta",
    specialization: "Clinical Nutritionist & Dietitian",
    credentials: "M.Sc. Nutrition • 8+ Years Exp",
    photo: "/doctor/deepa-gupta.png"
  },
  {
    name: "Dr. Manisha Ranjan",
    specialization: "Senior Consultant Gynecologist",
    credentials: "MBBS, MS • 15+ Years Exp",
    photo: "/doctor/manisha-ranjan.png"
  },
  {
    name: "Dr. Megha Mehra",
    specialization: "Hormonal Balance & Lifestyle Coach",
    credentials: "BAMS, MD (Ayurveda) • 9+ Years Exp",
    photo: "/doctor/megha-mehra.png"
  },
  {
    name: "Dr. Neha Raj",
    specialization: "PCOS & Fertility Consultant",
    credentials: "DNB, Gynec • 10+ Years Exp",
    photo: "/doctor/neha-raj.png"
  },
  {
    name: "Dr. Nyyaya Saini",
    specialization: "Women's Mental Health Specialist",
    credentials: "MD Psychiatry • 7+ Years Exp",
    photo: "/doctor/nyyaya-saini.png"
  },
  {
    name: "Dr. Prerna Gupta",
    specialization: "Endocrinologist & Metabolic Lead",
    credentials: "DM Endocrinology • 11+ Years Exp",
    photo: "/doctor/prerna-gupta.png"
  },
  {
    name: "Dr. Sanheeta Dasgupta",
    specialization: "Yoga & Pelvic Floor Coach",
    credentials: "RYT 500, Physio • 6+ Years Exp",
    photo: "/doctor/sanheeta-dasgupta.png"
  },
  {
    name: "Dr. Uma Mishra",
    specialization: "Holistic Health Advisor",
    credentials: "BAMS • 14+ Years Exp",
    photo: "/doctor/uma-mishra.png"
  }
];

export default function DoctorMarquee() {
  const marqueeItems = useMemo(() => {
    return [...DOCTORS, ...DOCTORS];
  }, []);

  return (
    <section className="py-12 bg-gradient-to-b from-slate-50 to-[#FCFDFB] overflow-hidden relative">
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes marqueeScroll {
              0% {
                transform: translateX(0);
              }
              100% {
                transform: translateX(-50%);
              }
            }

            .animate-marquee-infinite {
              display: flex;
              width: max-content;
              animation: marqueeScroll 45s linear infinite;
              will-change: transform;
            }

            .animate-marquee-infinite:hover {
              animation-play-state: paused;
            }
          `,
        }}
      />

      <div className="max-w-7xl mx-auto px-6 mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-[0.2em] bg-pink-50 text-pink-600 border border-pink-100">
              Clinical Excellence
            </span>

            <h2 className="mt-3 text-3xl md:text-4xl font-extrabold text-slate-900">
              Meet WombCare's Expert Care Team
            </h2>

            <p className="mt-2 text-slate-500 max-w-2xl">
              Dedicated specialists in PCOS, fertility, nutrition,
              endocrinology, mental wellness, yoga, and holistic healthcare.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white border border-slate-100 rounded-full px-4 py-2 shadow-sm">
            <Sparkles className="w-4 h-4 text-pink-500" />
            <span className="text-xs font-semibold text-slate-500">
              Hover to pause
            </span>
          </div>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-3 gap-4 mt-8">
          <div className="bg-white rounded-2xl border border-slate-100 p-4 text-center shadow-sm">
            <div className="text-2xl font-extrabold text-pink-600">50+</div>
            <div className="text-xs text-slate-500 mt-1">
              Clinical Experts
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 p-4 text-center shadow-sm">
            <div className="text-2xl font-extrabold text-pink-600">
              Multi-Speciality
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Women's Healthcare
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 p-4 text-center shadow-sm">
            <div className="text-2xl font-extrabold text-pink-600">
              Personalized
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Care & Guidance
            </div>
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden py-4">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none" />

        <div className="animate-marquee-infinite gap-6 px-4">
          {marqueeItems.map((doctor, index) => (
            <div
              key={`${doctor.name}-${index}`}
              className="group w-[360px] bg-white rounded-3xl border border-slate-100 p-5 shadow-sm hover:shadow-lg hover:border-pink-200 transition-all duration-300 shrink-0"
            >
              <div className="flex items-center gap-4">
                <div className="relative w-20 h-20 rounded-2xl overflow-hidden border border-slate-100 bg-slate-50">
                  <img
                    src={doctor.photo}
                    alt={doctor.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-slate-900 text-sm leading-tight">
                      {doctor.name}
                    </h3>

                    <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                  </div>

                  <p className="mt-1 text-xs font-semibold text-pink-600">
                    {doctor.specialization}
                  </p>

                  <p className="mt-1 text-[11px] text-slate-500 font-medium">
                    {doctor.credentials}
                  </p>

                  <div className="mt-3">
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider bg-green-50 text-green-700 border border-green-100">
                      WombCare Verified
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}