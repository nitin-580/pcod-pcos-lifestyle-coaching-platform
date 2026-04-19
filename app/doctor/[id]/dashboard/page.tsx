'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import DoctorOverview from '@/components/dashboard/DoctorOverview';
import AppointmentsTable from '@/components/dashboard/AppointmentsTable';
import EarningsAnalytics from '@/components/dashboard/EarningsAnalytics';
import PatientHistory from '@/components/dashboard/PatientHistory';
import UpcomingSessions from '@/components/dashboard/UpcomingSessions';
import { getPublicApiBase } from '@/lib/api-config';

export default function DashboardPage() {
  const router = useRouter();
  const params = useParams();
  const [doctorData, setDoctorData] = useState<any>(null);
  const [patients, setPatients] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [earnings, setEarnings] = useState<any[]>([]);
  const [earningsStats, setEarningsStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('doctorToken') || localStorage.getItem('userToken');
      
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const headers = { 'Authorization': `Bearer ${token}` };
        const apiBase = getPublicApiBase();

        const [profileRes, appointmentsRes, earningsRes] = await Promise.all([
          fetch(`${apiBase}/doctors/profile`, { headers }),
          fetch(`${apiBase}/doctors/appointments`, { headers }),
          fetch(`${apiBase}/doctors/earnings`, { headers })
        ]);

        const profileData = await profileRes.json();
        const appointmentsData = await appointmentsRes.json();
        const earningsData = await earningsRes.json();

        if (profileData.success) {
          setDoctorData(profileData.doctor);
          setPatients(profileData.referredPatients || []);
        } else {
          localStorage.removeItem('doctorToken');
          router.push('/login-doctor');
          return;
        }

        if (appointmentsData.success) {
          setAppointments(appointmentsData.appointments || []);
        }

        if (earningsData.success) {
          setEarnings(earningsData.earnings || []);
          setEarningsStats({
            totalEarnings: earningsData.totalEarnings,
            stats: earningsData.stats
          });
        }
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-500">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  const todayAppointments = appointments.filter(apt => {
    const aptDate = new Date(apt.appointmentDate);
    const today = new Date();
    return aptDate.getDate() === today.getDate() &&
           aptDate.getMonth() === today.getMonth() &&
           aptDate.getFullYear() === today.getFullYear();
  });

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthlyEarnings = earnings
    .filter(e => {
      const d = new Date(e.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    })
    .reduce((sum, e) => sum + (e.amount || 0), 0);

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Main Content */}
      <section className="max-w-7xl mx-auto p-6 lg:p-10">
        <div className="space-y-8">
          <DoctorOverview 
            doctorData={doctorData} 
            totalPatients={patients.length || 0}
            todayAppointmentsCount={todayAppointments.length || 0}
            monthlyEarnings={monthlyEarnings || 0}
            totalSessions={appointments.length || 0}
            quickInsights={todayAppointments || []}
          />

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <AppointmentsTable appointments={appointments} />
            <UpcomingSessions sessions={todayAppointments} />
          </div>

          <EarningsAnalytics earnings={earnings} stats={earningsStats} />

          <PatientHistory patients={patients} />
        </div>
      </section>
    </main>
  );
}
