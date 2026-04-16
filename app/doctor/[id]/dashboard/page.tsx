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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('doctorToken') || localStorage.getItem('userToken');
      
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const res = await fetch(`${getPublicApiBase()}/doctors/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await res.json();

        if (data.success) {
          setDoctorData(data.doctor);
          setPatients(data.referredPatients || []);
        } else {
          // Token might be invalid
          localStorage.removeItem('doctorToken');
          router.push('/login');
        }
      } catch (err) {
        console.error('Failed to fetch doctor profile:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
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

  return (
    <main className="min-h-screen bg-slate-50 flex">
      {/* Sidebar
      <DoctorSidebar doctorName={doctorData?.name} profilePicture={doctorData?.profilePicture} /> */}

      {/* Main Content */}
      <section className="flex-1 p-8 lg:p-10 overflow-y-auto">
        <div className="space-y-8">
          <DoctorOverview doctorData={doctorData} totalPatients={patients.length} />

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <AppointmentsTable />
            <UpcomingSessions />
          </div>

          <EarningsAnalytics />

          <PatientHistory patients={patients} />
        </div>
      </section>
    </main>
  );
}
