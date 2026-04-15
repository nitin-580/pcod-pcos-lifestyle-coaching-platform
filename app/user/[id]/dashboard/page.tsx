'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getPublicApiBase } from '@/lib/api-config';

import ActivePlanCard from '@/components/user/ActivePlanCard';
import Appointment from '@/components/user/Appointment';
import NutritionPlan from '@/components/user/NutritionPlan';
import PeriodTracker from '@/components/user/PeriodTracker';
import WaterTracker from '@/components/user/WaterTracker';
import WellnessStats from '@/components/user/WellnessStats';
import FloatingNavbar from '@/components/FloatingNavbar'
import Footer from '@/components/Footer'

export default function UserDashboardPage() {
  const params = useParams();
  const userId = params.id as string;

  const [profile, setProfile] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchProfile = useCallback(async () => {
    try {
      const token = localStorage.getItem('userToken');
      const res = await fetch(`${getPublicApiBase()}/profiles/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (data.success) {
        setProfile(data.data);
      } else {
        setError(data.message || 'Failed to load profile');
      }
    } catch (err) {
      console.error('Fetch profile error:', err);
      setError('Connection failed');
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    const savedData = localStorage.getItem('userData');
    if (savedData) setUserData(JSON.parse(savedData));
    fetchProfile();
  }, [fetchProfile]);

  const handleUpdateProfile = async (updates: any) => {
    if (isUpdating) return;
    setIsUpdating(true);
    
    try {
      const token = localStorage.getItem('userToken');
      const res = await fetch(`${getPublicApiBase()}/profiles/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });

      const data = await res.json();
      if (data.success) {
        setProfile((prev: any) => ({ ...prev, ...updates }));
      }
    } catch (err) {
      console.error('Update profile error:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  const getGrade = (score: number) => {
    if (score >= 90) return 'AA';
    if (score >= 82) return 'AB';
    if (score >= 75) return 'BB';
    if (score >= 65) return 'BC';
    if (score >= 55) return 'CC';
    return 'F';
  };

  const user = useMemo(() => {
    if (!profile) return {
      name: userData?.name || 'User',
      activePlan: 'Loading...',
      nextAppointment: 'No scheduled sessions',
      cycleDay: 1,
      nextPeriodDate: 'Calculating...',
      waterIntake: 0,
      targetWater: 8,
      caloriesTarget: 1800,
      proteinTarget: 80,
      bmi: 22.5,
      wellnessScore: 85,
      wellnessGrade: 'BB',
      symptoms: []
    };

    // Calculate dynamic cycle day
    let currentCycleDay = profile.cycleDay || 1;
    if (profile.cycleStartDate) {
      const start = new Date(profile.cycleStartDate);
      const today = new Date();
      // Calculate diff in days
      const diffTime = Math.abs(today.getTime() - start.getTime());
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      currentCycleDay = Math.min(diffDays + 1, 35); // Cap at 35 days or similar
    }

    const score = profile.wellnessScore || profile.wellness_score || 85;

    return {
      ...profile,
      cycleDay: currentCycleDay,
      caloriesTarget: profile.caloriesTarget || profile.calories_target || 1800,
      proteinTarget: profile.proteinTarget || profile.protein_target || 80,
      wellnessScore: score,
      wellnessGrade: getGrade(score),
      targetWater: profile.targetWater || profile.target_water || 8,
      waterIntake: profile.waterIntake || profile.water_intake || 0,
    };
  }, [profile, userData]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FCFDFB]">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="w-12 h-12 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin" />
          <p className="text-slate-500 font-medium tracking-wide">Curating your wellness space...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#FCFDFB] selection:bg-pink-100">
      <FloatingNavbar />
      
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        
        {/* Premium Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-[40px] bg-gradient-to-br from-[#F8FBFF] via-white to-[#FFF9FB] border border-slate-100 p-8 md:p-12 shadow-sm mt-8"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-pink-50/30 rounded-full blur-3xl -mr-20 -mt-20 shrink-0" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-50/30 rounded-full blur-2xl -ml-16 -mb-16 shrink-0" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="max-w-2xl">
              <span className="inline-block px-4 py-1.5 rounded-full bg-pink-50 text-pink-600 text-xs font-bold tracking-[0.15em] uppercase mb-6 shadow-sm">
                Wellness Dashboard
              </span>
              
              <h1 className="text-4xl md:text-6xl font-bold text-slate-900 leading-[1.15] tracking-tight">
                Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">{user.name || userData?.name}</span>
              </h1>

              <p className="text-slate-500 mt-6 text-lg md:text-xl font-medium max-w-lg leading-relaxed">
                Take a deep breath. Here is how your body is doing today.
              </p>
            </div>

            {/* Wellness Circular Score Overlay */}
            <div className="relative flex items-center justify-center shrink-0">
               <div className="w-40 h-40 md:w-48 md:h-48 rounded-full border-[10px] border-slate-50 flex flex-col items-center justify-center bg-white shadow-2xl shadow-pink-100/50">
                  <p className="text-xs uppercase font-bold text-slate-400 tracking-widest">Wellness Grade</p>
                  <h2 className="text-6xl font-black text-slate-900 mt-1">
                    {user.wellnessGrade}
                  </h2>
               </div>
            </div>
          </div>
        </motion.div>

        {/* Dynamic Grid Layout */}
        <div className="mt-12 grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
          
          {/* Main Column */}
          <div className="xl:col-span-8 space-y-8">
            
            {/* Horizontal Cards */}
            <div className="grid md:grid-cols-2 gap-8">
              <ActivePlanCard plan={user.activePlan} />
              <Appointment time={user.nextAppointment} />
            </div>

            {/* Primary Trackers */}
            <div className="grid lg:grid-cols-2 gap-8">
              <PeriodTracker
                cycleDay={user.cycleDay}
                nextDate={user.nextPeriodDate}
                onLogPeriod={() => {
                  const today = new Date().toISOString().split('T')[0];
                  handleUpdateProfile({ cycleDay: 1, cycleStartDate: today });
                }}
                onUndoPeriod={() => {
                  const currentDay = user.cycleDay;
                  if (currentDay > 1) {
                    // Adjust cycleStartDate back by one day
                    const start = new Date(user.cycleStartDate || new Date());
                    start.setDate(start.getDate() + 1);
                    handleUpdateProfile({ cycleDay: currentDay - 1, cycleStartDate: start.toISOString().split('T')[0] });
                  }
                }}
              />

              <WaterTracker
                intake={user.waterIntake}
                target={user.targetWater}
                onAddWater={() => handleUpdateProfile({ waterIntake: (user.waterIntake || 0) + 1 })}
                onUndoWater={() => handleUpdateProfile({ waterIntake: Math.max((user.waterIntake || 0) - 1, 0) })}
              />
            </div>

            {/* Mood / Journaling Placeholder Section */}
            <div className="rounded-[32px] bg-slate-900 p-10 text-white relative overflow-hidden group shadow-xl">
               <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-pink-500/10 to-transparent group-hover:scale-110 transition-transform duration-500" />
               <h3 className="text-2xl font-bold relative z-10">Holistic Insights</h3>
               <p className="text-slate-400 mt-3 text-sm leading-relaxed relative z-10 max-w-sm">
                 Our AI is analyzing your sleep and symptoms to generate tomorrow's personalized nutrition tips.
               </p>
               <button className="mt-6 px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-semibold transition relative z-10 backdrop-blur-md">
                 View Full Report
               </button>
            </div>
          </div>

          {/* Sidebar Column */}
          <div className="xl:col-span-4 space-y-8">
            
            {/* Stats Sidebar */}
            <WellnessStats
              bmi={user.bmi}
              score={user.wellnessScore}
              symptoms={user.symptoms}
            />

            {/* Quick Check-in Card */}
            <div className="rounded-[32px] bg-gradient-to-b from-[#F6FAF1] to-white border border-[#E5EEDC] p-8 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-2xl mb-6">
                ✨
              </div>
              <p className="text-sm font-bold text-[#6D8A4E] uppercase tracking-wider">
                Daily Check-in
              </p>

              <h3 className="text-3xl font-bold text-slate-900 mt-3 leading-tight">
                How's your mood today?
              </h3>

              <p className="text-slate-500 mt-4 text-sm leading-relaxed">
                Keeping track of your emotional wellness is key to balancing your hormones.
              </p>

              <button className="mt-8 w-full rounded-2xl bg-white py-4 shadow-md text-slate-700 font-bold hover:shadow-lg hover:-translate-y-0.5 transition-all text-sm uppercase tracking-widest border border-slate-50">
                Update Status
              </button>
            </div>

            {/* Nutrition Highlights */}
            <NutritionPlan
              target={user.caloriesTarget}
              proteinTarget={user.proteinTarget}
            />

          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}