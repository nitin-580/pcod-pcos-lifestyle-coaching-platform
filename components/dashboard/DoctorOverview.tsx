'use client';

import {
  CalendarDays,
  Wallet,
  Clock3,
  Users,
  ArrowUpRight,
} from 'lucide-react';

const stats = [
  {
    title: 'Today Appointments',
    value: '12',
    sub: '+3 from yesterday',
    icon: CalendarDays,
  },
  {
    title: 'Monthly Earnings',
    value: '₹48,500',
    sub: '+12%',
    icon: Wallet,
  },
  {
    title: 'Sessions Booked',
    value: '38',
    sub: 'This week',
    icon: Clock3,
  },
  {
    title: 'Patients',
    value: '124',
    sub: 'Total records',
    icon: Users,
  },
];

const upcomingSessions = [
  {
    patient: 'Priya Sharma',
    time: '10:00 AM',
    type: 'PCOD Consultation',
  },
  {
    patient: 'Ananya Patel',
    time: '11:30 AM',
    type: 'Follow-up Session',
  },
  {
    patient: 'Riya Verma',
    time: '2:00 PM',
    type: 'Diet Consultation',
  },
];

export default function DoctorOverview({ doctorData, totalPatients }: { doctorData?: any, totalPatients?: number }) {
  const currentStats = [...stats];
  if (totalPatients !== undefined) {
    currentStats[3] = { ...currentStats[3], value: totalPatients.toString() };
  }

  return (
    <section>
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-slate-800">
          Welcome back, {doctorData?.name?.split(' ')[0] || 'Doctor'}
        </h1>
        <p className="text-slate-500 mt-2">
          Here’s your appointment and earnings overview
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {currentStats.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 transition-all hover:shadow-md"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-slate-500 text-sm">
                    {item.title}
                  </p>

                  <h2 className="text-3xl font-bold text-slate-800 mt-3">
                    {item.value}
                  </h2>

                  <p className="text-sm text-green-600 mt-2">
                    {item.sub}
                  </p>
                </div>

                <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 text-white flex items-center justify-center shrink-0">
                  <Icon size={20} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mt-8">
        {/* Upcoming Sessions - Relocated to Dashboard Page Grid for better layout but keeping original template logic here if used as standalone */}
        <div className="xl:col-span-2 bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-slate-800">
              Quick Insights
            </h2>

            <button className="text-purple-600 font-medium">
              View All
            </button>
          </div>

          <div className="space-y-4">
            {upcomingSessions.map((session, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-5 rounded-2xl bg-slate-50 border border-slate-100"
              >
                <div>
                  <h3 className="font-semibold text-slate-800">
                    {session.patient}
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">
                    {session.type}
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-semibold text-slate-700">
                    {session.time}
                  </p>
                  <button className="text-sm text-purple-600 mt-1 hover:underline">
                    Join Session
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Doctor Info */}
        <div className="bg-[#dfe8ff] rounded-3xl p-8 border border-slate-100 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
             <ArrowUpRight size={80} />
          </div>

          <h2 className="text-2xl font-bold text-slate-800 relative z-10">
            Current Profile
          </h2>

          <div className="mt-8 flex flex-col items-center relative z-10 text-center">
            {doctorData?.profilePicture ? (
              <img 
                src={doctorData.profilePicture} 
                className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover"
                alt="Profile"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white flex items-center justify-center text-3xl font-bold border-4 border-white shadow-lg">
                {doctorData?.name?.[0] || 'D'}
              </div>
            )}

            <h3 className="text-2xl font-bold mt-4 text-slate-800">
              {doctorData?.name || 'Dr. Sarah Watson'}
            </h3>

            <p className="text-slate-600 mt-2 font-medium">
              {doctorData?.specialization || 'Gynecologist & PCOD Specialist'}
            </p>

            <div className="w-full h-[1px] bg-slate-200 my-6"></div>

            <div className="w-full space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Credentials</span>
                <span className="text-slate-800 font-semibold">{doctorData?.credentials || 'MBBS, MD'}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Total Patients</span>
                <span className="text-slate-800 font-semibold">{totalPatients || '124'}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Referral Code</span>
                <span className="text-slate-purple-600 font-bold bg-white px-2 py-1 rounded-lg border border-purple-100">
                  {doctorData?.referralCode || 'WC-5829'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

