'use client';

import React, { useMemo, useState } from 'react';
import { CalendarDays, Heart, Activity, Moon, Sparkles } from 'lucide-react';

const phases = [
  { name: 'Menstrual', days: '1-5', tip: 'Rest, hydration, and iron-rich food.' },
  { name: 'Follicular', days: '6-13', tip: 'Energy rises — great time for focused work.' },
  { name: 'Ovulation', days: '14-16', tip: 'Peak confidence and social energy.' },
  { name: 'Luteal', days: '17-28', tip: 'Slow down and prioritize self-care.' },
];

export default function CycleTrackingBlogPage() {
  const [cycleLength, setCycleLength] = useState(28);
  const [currentDay, setCurrentDay] = useState(1);
  const [notes, setNotes] = useState('');

  const currentPhase = useMemo(() => {
    if (currentDay <= 5) return phases[0];
    if (currentDay <= 13) return phases[1];
    if (currentDay <= 16) return phases[2];
    return phases[3];
  }, [currentDay]);

  const progress = (currentDay / cycleLength) * 100;

  return (
    <div className="min-h-screen bg-white text-gray-900 px-4 md:px-8 py-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-3xl shadow-lg border border-gray-100 p-6 bg-white">
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="w-6 h-6" />
              <h1 className="text-3xl font-bold">Track & Analyze: Decode Your Monthly Cycle</h1>
            </div>

            <div className="space-y-6 text-base leading-8">
              <p>
                Understanding your cycle is about knowing your body, mood, energy,
                and wellness patterns in a more human and comforting way.
              </p>
              <p>
                Every phase brings a different version of you. Some days are highly productive,
                while others need more rest and care.
              </p>

              <div className="grid md:grid-cols-2 gap-4">
                {phases.map((phase, index) => (
                  <div key={index} className="rounded-2xl shadow-sm border border-gray-100 p-5">
                    <h3 className="font-semibold text-lg">{phase.name}</h3>
                    <p className="text-sm text-gray-500">Days {phase.days}</p>
                    <p className="mt-2 text-sm">{phase.tip}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl shadow-lg border border-gray-100 p-6 bg-white sticky top-6">
            <h2 className="flex items-center gap-2 text-xl font-semibold mb-5">
              <CalendarDays className="w-5 h-5" />
              Your Cycle Tracker
            </h2>

            <div className="space-y-5">
              <div>
                <label className="text-sm font-medium">Cycle Length</label>
                <input
                  type="number"
                  value={cycleLength}
                  onChange={(e) => setCycleLength(Number(e.target.value))}
                  className="mt-2 w-full border border-gray-200 rounded-xl px-3 py-2"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Current Day</label>
                <input
                  type="number"
                  value={currentDay}
                  onChange={(e) => setCurrentDay(Number(e.target.value))}
                  className="mt-2 w-full border border-gray-200 rounded-xl px-3 py-2"
                />
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-2">Cycle Progress</p>
                <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gray-900 rounded-full" style={{ width: `${progress}%` }} />
                </div>
                <p className="mt-2 font-medium">{Math.round(progress)}% completed</p>
              </div>

              <div className="rounded-2xl bg-gray-50 p-4">
                <p className="text-sm text-gray-500">Current Phase</p>
                <h3 className="text-lg font-semibold mt-1">{currentPhase.name}</h3>
                <p className="text-sm mt-2">{currentPhase.tip}</p>
              </div>

              <div>
                <label className="text-sm font-medium">Mood & Symptoms Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="How are you feeling today?"
                  className="w-full mt-2 min-h-[120px] rounded-2xl border border-gray-200 p-3 outline-none"
                />
              </div>

              <button className="w-full rounded-2xl h-11 bg-black text-white font-medium">
                Save Today's Entry
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-4 left-4 right-4 md:hidden">
        <div className="rounded-2xl shadow-xl border border-gray-100 bg-white p-3 flex justify-around">
          <button className="flex flex-col items-center text-sm"><Heart className="w-5 h-5" /> Mood</button>
          <button className="flex flex-col items-center text-sm"><Activity className="w-5 h-5" /> Health</button>
          <button className="flex flex-col items-center text-sm"><Moon className="w-5 h-5" /> Sleep</button>
        </div>
      </div>
    </div>
  );
}
