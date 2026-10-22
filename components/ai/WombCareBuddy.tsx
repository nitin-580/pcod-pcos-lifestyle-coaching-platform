'use client';

import React, { useState } from 'react';
import { 
  Activity, 
  ExternalLink, 
  ShieldCheck, 
  Apple, 
  Droplet, 
  Clock, 
  HelpCircle, 
  CheckCircle2, 
  Sparkles, 
  Bot, 
  User
} from 'lucide-react';

export default function WombCareBuddy() {
  const [activeScenario, setActiveScenario] = useState<number>(0);

  const sampleScenarios = [
    {
      id: 0,
      question: "What does my 22-week anomaly scan report mean by 'Hadlock 54th percentile'?",
      userCategory: "Ultrasound Context",
      assistantResponse: {
        intro: "Hadlock 54th percentile is an encouraging, normal indicator. Here is what your clinician evaluates:",
        bullets: [
          "Percentile Meaning: The 54th percentile means your baby's estimated growth is right in the healthy middle range (50th percentile is the average reference).",
          "Biometric Concordance: Your head, abdominal, and femur measurements are harmoniously proportioned for 22 weeks.",
          "Clinician Verification: Your OB-GYN will compare this scan against your earlier first-trimester dating ultrasound to track steady trajectory."
        ],
        badge: "Normative Range • Trimester 2",
        urgency: "Informational",
        actionItem: "Context logged into your maternal timeline for your next prenatal visit."
      }
    },
    {
      id: 1,
      question: "I have mild lower back ache after sitting for 2 hours at work. Is this normal?",
      userCategory: "Symptom Triage",
      assistantResponse: {
        intro: "Mild lower back discomfort is common around 20-24 weeks due to shifting center of gravity and relaxing pelvic ligaments (relaxin hormone).",
        bullets: [
          "Comfort Routine: Perform seated pelvic tilts, place a lumbar support pillow behind your lower spine, and take a 5-minute walking break every 45 minutes.",
          "Hydration Connection: Mild muscle cramps can be aggravated by low hydration. Aim for your 2.5L daily target.",
          "Triage Flag: If back pain becomes sharp, rhythmic, accompanied by fever, or radiates to the groin, contact your doctor immediately."
        ],
        badge: "Mild Discomfort • Non-Urgent",
        urgency: "Comfort & Posture Guidance",
        actionItem: "Added gentle pelvic mobility stretch routine to your evening wellness schedule."
      }
    },
    {
      id: 2,
      question: "What should my daily hydration and nutrition schedule look like in trimester 2?",
      userCategory: "Nutrition & Hydration",
      assistantResponse: {
        intro: "Here is your personalized maternal hydration and nutrient timing timeline:",
        bullets: [
          "08:00 AM — Iron + Vitamin C: Iron supplement with orange/lemon water (avoid calcium/tea within 1 hour to maximize absorption).",
          "11:30 AM — Hydration Anchor: 500ml water + electrolytes (coconut water or buttermilk) to prevent mid-day fatigue.",
          "01:30 PM — Fiber & Protein: Lentil soup with dark leafy greens (folate) and paneer/tofu for steady glycemic curve.",
          "05:00 PM — Calcium & Snack: Handful of walnuts, chia pudding, and warm milk."
        ],
        badge: "Personalized Daily Plan",
        urgency: "Lifestyle Protocol",
        actionItem: "Timeline synced with your hydration reminder notifications."
      }
    }
  ];

  const features = [
    {
      title: "24/7 Maternal Companion",
      description: "Accessible maternal wellness support whenever questions arise, from midnight symptom inquiries to appointment prep.",
      icon: Activity,
    },
    {
      title: "Rapid Symptom Triage",
      description: "Structured triage filters distinguish typical pregnancy symptoms from red-flag warning signs that require clinical escalation.",
      icon: ShieldCheck,
    },
    {
      title: "Personalized Nutrition Guidance",
      description: "Trimester-specific meal planning, micronutrient tracking (iron, folate, calcium, DHA), and gestation-friendly food suggestions.",
      icon: Apple,
    },
    {
      title: "Hydration & Wellness Timelines",
      description: "Interactive daily routines balancing hydration quotas, gentle mobility sessions, and restorative rest intervals.",
      icon: Droplet,
    },
    {
      title: "Ultrasound Interpretation Context",
      description: "Plain-language explanations of ultrasound terminology, biometric abbreviations, and fetal growth percentiles.",
      icon: HelpCircle,
    },
    {
      title: "Symptom & Wellness Tracking",
      description: "Logs daily observations, kicks, blood pressure, and energy patterns into structured reports ready for your OB-GYN.",
      icon: Clock,
    },
  ];

  return (
    <section 
      id="wombcare-ai" 
      className="py-24 md:py-32 bg-[#0B0F17] relative border-t border-slate-800/80 scroll-mt-20 overflow-hidden"
    >
      {/* Ambient background glow */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute top-1/2 left-0 w-[550px] h-[550px] bg-violet-600/5 blur-[140px] rounded-full" 
      />
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute bottom-0 right-1/4 w-[450px] h-[450px] bg-cyan-600/5 blur-[120px] rounded-full" 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-violet-950/70 border border-violet-500/30 text-violet-300 text-xs font-semibold uppercase tracking-wider">
            <Bot className="w-3.5 h-3.5 text-violet-400" />
            Conversational Maternal AI
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Meet WombCare Buddy.{' '}
            <span className="bg-gradient-to-r from-violet-400 via-sky-300 to-cyan-400 bg-clip-text text-transparent">
              Support That Understands Your Journey.
            </span>
          </h2>

          <p className="text-base sm:text-lg text-slate-300/90 leading-relaxed font-normal">
            Your intelligent maternal wellness companion, available around the clock to help you navigate everyday pregnancy and maternal health questions with personalized guidance and accessible information.
          </p>
        </div>

        {/* Top Interactive Chat Showcase */}
        <div className="mb-20 rounded-2xl border border-slate-800 bg-[#111827] overflow-hidden shadow-2xl shadow-black/80">
          
          {/* Header Bar of Chat Mockup */}
          <div className="p-4 sm:p-5 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#131b2c]">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-violet-600 p-[1px]">
                  <div className="w-full h-full rounded-xl bg-slate-900 flex items-center justify-center">
                    <Activity className="w-5 h-5 text-cyan-300" />
                  </div>
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-900" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white">WombCare Buddy</h3>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-300">
                    24/7 Companion
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Intelligent Triage & Maternal Guidance • HIPAA Aligned
                </p>
              </div>
            </div>

            {/* Prominent CTA Button in Header */}
            <a
              href="https://chat.wombcare.in"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-cyan-600 to-violet-600 hover:from-cyan-500 hover:to-violet-500 rounded-xl shadow-lg shadow-cyan-950/60 transition-all duration-300 hover:scale-[1.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
            >
              <span>Launch WombCare Buddy</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Interactive Chat Inquiries Switcher */}
          <div className="p-4 sm:p-6 border-b border-slate-800/80 bg-slate-900/60">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
              Select Sample Maternal Consultation:
            </p>
            <div className="flex flex-wrap gap-2">
              {sampleScenarios.map((scenario) => (
                <button
                  key={scenario.id}
                  type="button"
                  onClick={() => setActiveScenario(scenario.id)}
                  className={`text-left px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${
                    activeScenario === scenario.id
                      ? 'bg-cyan-950/90 text-cyan-200 border border-cyan-500/50 shadow-sm'
                      : 'bg-slate-800/60 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700/60'
                  }`}
                >
                  <span className="text-[10px] block text-cyan-400 font-mono font-semibold uppercase">
                    {scenario.userCategory}
                  </span>
                  <span className="truncate max-w-[280px] sm:max-w-xs block">
                    {scenario.question}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Chat Conversation Thread */}
          <div className="p-4 sm:p-8 space-y-6">
            
            {/* User Bubble */}
            <div className="flex items-start justify-end gap-3">
              <div className="max-w-xl p-4 rounded-2xl rounded-tr-sm bg-gradient-to-r from-violet-900/40 to-slate-800 border border-violet-500/30 text-white text-sm shadow-md">
                <p className="font-medium text-slate-200">
                  {sampleScenarios[activeScenario].question}
                </p>
              </div>
              <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-violet-300" />
              </div>
            </div>

            {/* Assistant Bubble */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-500/40 flex items-center justify-center flex-shrink-0">
                <Activity className="w-4 h-4 text-cyan-400" />
              </div>

              <div className="max-w-2xl space-y-4">
                <div className="p-5 rounded-2xl rounded-tl-sm bg-[#161F30] border border-slate-700/80 text-sm shadow-lg space-y-3.5">
                  
                  {/* Status Indicator Bar */}
                  <div className="flex items-center justify-between pb-2.5 border-b border-slate-700/60 text-xs">
                    <span className="text-cyan-400 font-semibold flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                      {sampleScenarios[activeScenario].assistantResponse.badge}
                    </span>
                    <span className="text-slate-400 font-mono text-[11px]">
                      {sampleScenarios[activeScenario].assistantResponse.urgency}
                    </span>
                  </div>

                  {/* Message Body */}
                  <p className="text-slate-200 leading-relaxed font-normal">
                    {sampleScenarios[activeScenario].assistantResponse.intro}
                  </p>

                  {/* Bullet Insights */}
                  <ul className="space-y-2 text-xs text-slate-300/90 pl-1">
                    {sampleScenarios[activeScenario].assistantResponse.bullets.map((bullet, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 leading-relaxed">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0 mt-0.5" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Structured Action Banner */}
                  <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs text-slate-300">
                    <span className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-violet-400" />
                      {sampleScenarios[activeScenario].assistantResponse.actionItem}
                    </span>
                    <span className="text-[10px] text-cyan-400 font-medium">Logged</span>
                  </div>
                </div>

                {/* Safety & Triage Notice */}
                <p className="text-[11px] text-slate-500 pl-2">
                  * Illustrative companion interaction. WombCare Buddy provides informational wellness triage and does not replace emergency medical response.
                </p>
              </div>
            </div>

          </div>

          {/* Footer Call to Action Strip */}
          <div className="p-4 sm:p-6 bg-slate-950/90 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <h4 className="text-sm font-bold text-white">
                Experience full conversational maternal care
              </h4>
              <p className="text-xs text-slate-400">
                Log symptoms, clarify scan metrics, and receive daily hydration schedules in real-time.
              </p>
            </div>

            <a
              href="https://chat.wombcare.in"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-cyan-200 bg-gradient-to-r from-cyan-950 to-violet-950 hover:from-cyan-900 hover:to-violet-900 border border-cyan-500/40 hover:border-cyan-400 rounded-xl shadow-lg transition-all"
            >
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>Launch WombCare Buddy</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

        </div>

        {/* 6 Capabilities Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon;

            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-[#111827] border border-slate-800/90 hover:border-violet-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-black/60 group"
              >
                <div className="w-12 h-12 rounded-xl bg-violet-950/60 border border-violet-500/30 flex items-center justify-center text-violet-400 mb-4 group-hover:border-violet-400/60 transition-colors">
                  <Icon className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-white group-hover:text-violet-200 transition-colors">
                  {feature.title}
                </h4>
                <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
