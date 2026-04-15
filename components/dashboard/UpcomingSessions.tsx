'use client';

import { useState } from 'react';

const sessionData = [
  {
    time: '10:00 AM',
    patient: 'Priya Sharma',
    type: 'PCOD Consultation',
    duration: '45 mins',
    status: 'Upcoming',
  },
  {
    time: '11:30 AM',
    patient: 'Riya Verma',
    type: 'Diet Follow-up',
    duration: '30 mins',
    status: 'Upcoming',
  },
  {
    time: '2:00 PM',
    patient: 'Ananya Patel',
    type: 'Hormonal Review',
    duration: '60 mins',
    status: 'Upcoming',
  },
  {
    time: '5:00 PM',
    patient: 'Kavya Singh',
    type: 'Fertility Session',
    duration: '45 mins',
    status: 'Upcoming',
  },
];

export default function UpcomingSessions() {
  const [selectedSession, setSelectedSession] = useState(0);

  return (
    <section className="mt-8 bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            Upcoming Sessions
          </h2>
          <p className="text-slate-500 mt-1">
            Today’s scheduled consultations
          </p>
        </div>

        <button className="text-purple-600 font-medium">
          Full Calendar
        </button>
      </div>

      {/* Sessions */}
      <div className="space-y-4">
        {sessionData.map((session, index) => (
          <button
            key={index}
            onClick={() => setSelectedSession(index)}
            className={`w-full text-left p-5 rounded-2xl transition-all ${
              selectedSession === index
                ? 'bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-100'
                : 'bg-slate-50 hover:bg-slate-100'
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-slate-800">
                  {session.patient}
                </h3>

                <p className="text-sm text-slate-500 mt-1">
                  {session.type}
                </p>

                <p className="text-sm text-slate-400 mt-2">
                  {session.duration}
                </p>
              </div>

              <div className="text-right">
                <p className="font-semibold text-purple-600">
                  {session.time}
                </p>

                <span className="inline-block mt-2 px-3 py-1 rounded-full bg-green-100 text-green-600 text-xs font-medium">
                  {session.status}
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-4 mt-6">
        <button className="py-3 rounded-2xl bg-slate-900 text-white font-medium">
          Join Session
        </button>

        <button className="py-3 rounded-2xl border border-slate-200 text-slate-700 font-medium">
          Reschedule
        </button>
      </div>
    </section>
  );
}
