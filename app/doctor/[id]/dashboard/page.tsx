'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import DoctorSidebar from '@/components/dashboard/Sidebar';
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

  return (
    <main className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <DoctorSidebar doctorName={doctorData?.name} profilePicture={doctorData?.profilePicture} />

      {/* Main Content */}
      <section className="flex-1 p-8 lg:p-10 overflow-y-auto">
        <div className="space-y-8">
          <DoctorOverview doctorData={doctorData} totalPatients={patients.length} />

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
