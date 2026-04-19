'use client';

import {
  CalendarDays,
  Wallet,
  Clock3,
  Users,
  ArrowUpRight,
} from 'lucide-react';

export default function DoctorOverview({ 
  doctorData, 
  totalPatients = 0,
  todayAppointmentsCount = 0,
  monthlyEarnings = 0,
  totalSessions = 0,
  quickInsights = []
}: { 
  doctorData?: any, 
  totalPatients?: number,
  todayAppointmentsCount?: number,
  monthlyEarnings?: number,
  totalSessions?: number,
  quickInsights?: any[]
}) {
  const stats = [
    {
      title: 'Today Appointments',
      value: todayAppointmentsCount.toString(),
      sub: 'Scheduled for today',
      icon: CalendarDays,
    },
    {
      title: 'Monthly Earnings',
      value: `₹${monthlyEarnings.toLocaleString()}`,
      sub: 'Earnings this month',
      icon: Wallet,
    },
    {
      title: 'Sessions Booked',
      value: totalSessions.toString(),
      sub: 'Total across platform',
      icon: Clock3,
    },
    {
      title: 'Patients',
      value: totalPatients.toString(),
      sub: 'Total records',
      icon: Users,
    },
  ];

  return (
    <section>
      {/* Header */}
      <div className="mb-10 text-center lg:text-left">
        <h1 className="text-4xl font-bold text-slate-800">
          Welcome back, {doctorData?.name?.split(' ')[0] || 'Doctor'}
        </h1>
        <p className="text-slate-500 mt-2">
          Here’s your appointment and earnings overview
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((item) => {
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

                  <p className="text-sm text-slate-500 mt-2">
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
        {/* Quick Insights */}
        <div className="xl:col-span-2 bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-slate-800">
              Quick Insights
            </h2>
          </div>

          <div className="space-y-4">
            {quickInsights.length > 0 ? (
              quickInsights.map((session, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-5 rounded-2xl bg-slate-50 border border-slate-100 transition-all hover:bg-slate-100"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 font-bold shrink-0">
                      {session.patientName?.[0] || session.userName?.[0] || 'P'}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800">
                        {session.patientName || session.userName || 'Unknown Patient'}
                      </h3>
                      <p className="text-sm text-slate-500 mt-1">
                        {session.appointmentType || 'Consultation'}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold text-slate-700">
                      {new Date(session.appointmentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    <span className={`text-xs px-2 py-1 rounded-full mt-1 inline-block ${
                      session.status === 'confirmed' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                    }`}>
                      {session.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-slate-500">
                <CalendarDays size={48} className="mb-4 opacity-20" />
                <p>No insights available for today</p>
              </div>
            )}
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
              {doctorData?.name || 'Doctor'}
            </h3>

            <p className="text-slate-600 mt-2 font-medium">
              {doctorData?.specialization || 'Gynecologist & Health Specialist'}
            </p>

            <div className="w-full h-[1px] bg-slate-200 my-6"></div>

            <div className="w-full space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Credentials</span>
                <span className="text-slate-800 font-semibold">{doctorData?.credentials || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Total Patients</span>
                <span className="text-slate-800 font-semibold">{totalPatients}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Referral Code</span>
                <span className="text-slate-purple-600 font-bold bg-white px-2 py-1 rounded-lg border border-purple-100">
                  {doctorData?.referralCode || 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

