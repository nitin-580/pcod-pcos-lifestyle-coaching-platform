'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import DoctorOverview from '@/components/dashboard/DoctorOverview';
import AppointmentsTable from '@/components/dashboard/AppointmentsTable';
import EarningsAnalytics from '@/components/dashboard/EarningsAnalytics';
import UpcomingSessions from '@/components/dashboard/UpcomingSessions';
import { getPublicApiBase } from '@/lib/api-config';
import { 
  Sparkles, 
  Search, 
  Calendar, 
  User, 
  Activity, 
  Droplet, 
  ChevronLeft, 
  Heart, 
  Clock, 
  Plus, 
  Smile, 
  Moon, 
  FileText, 
  UserPlus, 
  ShieldCheck, 
  Info,
  Phone,
  Mail,
  FileCheck
} from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const params = useParams();

  // Top level Portal navigation
  const [activePortalTab, setActivePortalTab] = useState<'dashboard' | 'referrals'>('dashboard');

  // Existing Dashboard States
  const [doctorData, setDoctorData] = useState<any>(null);
  const [patients, setPatients] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [earnings, setEarnings] = useState<any[]>([]);
  const [earningsStats, setEarningsStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Referral States
  const [referrals, setReferrals] = useState<any[]>([]);
  const [referralsLoading, setReferralsLoading] = useState(false);
  const [submittingReferral, setSubmittingReferral] = useState(false);
  
  // Referral Form Input
  const [refPatientName, setRefPatientName] = useState('');
  const [refMobile, setRefMobile] = useState('');
  const [refEmail, setRefEmail] = useState('');
  const [refProblem, setRefProblem] = useState('');
  const [formFeedback, setFormFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  // Search referred patients
  const [searchQuery, setSearchQuery] = useState('');

  // Selected patient history / dossier details
  const [selectedReferredPatientId, setSelectedReferredPatientId] = useState<string | null>(null);
  const [selectedPatientHistory, setSelectedPatientHistory] = useState<any | null>(null);
  const [dossierLoading, setDossierLoading] = useState(false);
  const [dossierActiveTab, setDossierActiveTab] = useState<'overview' | 'timeline'>('overview');
  const [editingNoteText, setEditingNoteText] = useState('');
  const [savingNote, setSavingNote] = useState(false);

  // Main Fetch Routine
  const fetchData = async () => {
    const token = localStorage.getItem('doctorToken') || localStorage.getItem('userToken');
    
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const headers = { 'Authorization': `Bearer ${token}` };
      const apiBase = getPublicApiBase();

      const [profileRes, appointmentsRes, earningsRes, referralsRes] = await Promise.all([
        fetch(`${apiBase}/doctors/profile`, { headers }),
        fetch(`${apiBase}/doctors/appointments`, { headers }),
        fetch(`${apiBase}/doctors/earnings`, { headers }),
        fetch(`${apiBase}/referrals/my-referrals`, { headers })
      ]);

      const profileData = await profileRes.json();
      const appointmentsData = await appointmentsRes.json();
      const earningsData = await earningsRes.json();
      const referralsData = await referralsRes.json();

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

      if (referralsData.success) {
        setReferrals(referralsData.referrals || []);
      }
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [router]);

  // Handle Quick Referral Submission
  const handleRefer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!refPatientName.trim() || !refMobile.trim() || !refEmail.trim()) {
      setFormFeedback({ type: 'error', message: 'Name, Mobile, and Email are strictly required.' });
      return;
    }

    setSubmittingReferral(true);
    setFormFeedback(null);
    try {
      const token = localStorage.getItem('doctorToken') || localStorage.getItem('userToken');
      const apiBase = getPublicApiBase();
      const response = await fetch(`${apiBase}/referrals`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          patientName: refPatientName.trim(),
          mobile: refMobile.trim(),
          email: refEmail.trim(),
          problem: refProblem.trim(),
        })
      });

      const resData = await response.json();
      if (resData.success) {
        setFormFeedback({ type: 'success', message: `Successfully referred ${refPatientName}! Active invitation sent.` });
        setRefPatientName('');
        setRefMobile('');
        setRefEmail('');
        setRefProblem('');
        // Reload referrals list
        const headers = { 'Authorization': `Bearer ${token}` };
        const referralsRes = await fetch(`${apiBase}/referrals/my-referrals`, { headers });
        const referralsData = await referralsRes.json();
        if (referralsData.success) {
          setReferrals(referralsData.referrals || []);
        }
      } else {
        setFormFeedback({ type: 'error', message: resData.message || 'Failed to submit referral.' });
      }
    } catch (err) {
      setFormFeedback({ type: 'error', message: 'Network timeout. Could not reach WombCare servers.' });
    } finally {
      setSubmittingReferral(false);
      setTimeout(() => setFormFeedback(null), 6000);
    }
  };

  // Fetch individual referred patient history (Dossier)
  const handleViewPatientDossier = async (referredId: string) => {
    setSelectedReferredPatientId(referredId);
    setDossierLoading(true);
    try {
      const token = localStorage.getItem('doctorToken') || localStorage.getItem('userToken');
      const apiBase = getPublicApiBase();
      const response = await fetch(`${apiBase}/doctor/patient-history/${referredId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const resJson = await response.json();
      if (resJson.success) {
        setSelectedPatientHistory(resJson);
        setEditingNoteText(resJson.profile?.doctorNote || '');
      } else {
        alert(resJson.message || 'Unable to retrieve patient dossier.');
        setSelectedReferredPatientId(null);
      }
    } catch (err) {
      alert('Failed to retrieve patient medical telemetry.');
      setSelectedReferredPatientId(null);
    } finally {
      setDossierLoading(false);
    }
  };

  // Save Doctor Recommendations Note
  const handleSaveClinicalGuidance = async () => {
    if (!selectedPatientHistory?.profile?.id) return;
    setSavingNote(true);
    try {
      const token = localStorage.getItem('doctorToken') || localStorage.getItem('userToken');
      const apiBase = getPublicApiBase();
      const response = await fetch(`${apiBase}/profiles/${selectedPatientHistory.profile.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ doctorNote: editingNoteText })
      });
      const resJson = await response.json();
      if (resJson.success) {
        setFormFeedback({ type: 'success', message: 'Recommendations saved to patient files successfully!' });
        setSelectedPatientHistory({
          ...selectedPatientHistory,
          profile: {
            ...selectedPatientHistory.profile,
            doctorNote: editingNoteText
          }
        });
      } else {
        alert(resJson.message || 'Failed to update clinical recommendations.');
      }
    } catch (err) {
      alert('Connection issue. Recommendations could not be stored.');
    } finally {
      setSavingNote(false);
      setTimeout(() => setFormFeedback(null), 4000);
    }
  };

  // Timeline processing logic
  const getTimelineData = () => {
    if (!selectedPatientHistory) return {};
    const events: any[] = [];

    // Account baseline creation
    if (selectedPatientHistory.profile?.createdAt) {
      events.push({
        date: new Date(selectedPatientHistory.profile.createdAt),
        type: 'profile_created',
        title: 'Account Baseline Profile Created 🌸',
        details: 'Initial registration completed. Lifestyle profiles, dietary inputs, and baseline hormonal metrics logged.'
      });
    }

    // Period log cycles
    if (selectedPatientHistory.periodHistory) {
      selectedPatientHistory.periodHistory.forEach((cycle: any) => {
        if (cycle.startDate) {
          events.push({
            date: new Date(cycle.startDate),
            type: 'period_start',
            title: 'Period Bleeding Cycle Started 🩸',
            details: `Logged start of cycle. Bleeding phase active. Symptoms: ${
              Array.isArray(cycle.symptoms) && cycle.symptoms.length > 0 ? cycle.symptoms.join(', ') : 'None logged'
            }.`
          });
        }
        if (cycle.endDate) {
          const days = Math.round((new Date(cycle.endDate).getTime() - new Date(cycle.startDate).getTime()) / (1000 * 60 * 60 * 24));
          events.push({
            date: new Date(cycle.endDate),
            type: 'period_end',
            title: 'Period Bleeding Phase Ended ✨',
            details: `Completed active bleeding phase. Bleeding duration: ${days || 1} days. Doctor recommendation logs check. Notes: "${cycle.notes || 'None'}"`
          });
        }
      });
    }

    // Daily Telemetry logging
    if (selectedPatientHistory.wellnessHistory) {
      selectedPatientHistory.wellnessHistory.forEach((log: any) => {
        const logDateStr = log.date || log.logDate;
        if (logDateStr) {
          const symptomsList = Array.isArray(log.symptoms) && log.symptoms.length > 0
            ? log.symptoms.join(', ')
            : 'None';
          events.push({
            date: new Date(logDateStr),
            type: 'wellness_log',
            title: 'Daily Wellness Telemetry Log 📈',
            details: `Mood Tracker: ${log.mood || 'N/A'} • Sleep Duration: ${log.sleep || 0} hrs • Water Hydration: ${log.waterIntake || 0} ml • Log Cycle Day: ${log.cycleDay || 'N/A'}
Active Physical Symptoms: ${symptomsList}${log.journal ? `\nJournal Notes: "${log.journal}"` : ''}`
          });
        }
      });
    }

    // Sort chronologically descending
    events.sort((a, b) => b.date.getTime() - a.date.getTime());

    // Group by month and year
    const grouped: { [key: string]: any[] } = {};
    events.forEach(e => {
      const monthYear = e.date.toLocaleDateString("en-IN", { month: "long", year: "numeric" });
      if (!grouped[monthYear]) {
        grouped[monthYear] = [];
      }
      grouped[monthYear].push(e);
    });

    return grouped;
  };

  // Filtering pending/contacted referrals vs converted patients
  const activeReferralsList = useMemo(() => {
    return referrals.filter(r => r.referralStatus !== 'converted');
  }, [referrals]);

  const convertedPatientsList = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    const list = referrals.filter(r => r.referralStatus === 'converted');
    if (!q) return list;
    return list.filter(p => 
      (p.patientName || '').toLowerCase().includes(q) ||
      (p.email || '').toLowerCase().includes(q) ||
      (p.mobile || '').toLowerCase().includes(q) ||
      (p.doctorReferralCode || '').toLowerCase().includes(q)
    );
  }, [referrals, searchQuery]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-500">Retrieving Clinical Portal...</p>
        </div>
      </div>
    );
  }

  // Helper values for dashboard stats
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
    <main className="min-h-screen bg-slate-50/50 pb-20">
      
      {/* Sliding Tab Header */}
      <section className="bg-white border-b border-slate-100 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-pink-500 flex items-center justify-center text-white font-bold text-lg shadow-pink-100 shadow-lg">
              W
            </div>
            <div>
              <h1 className="text-lg font-extrabold text-slate-800 tracking-tight">WombCare Clinic</h1>
              <p className="text-xs text-slate-500 font-medium">Doctor Administrative Portal</p>
            </div>
          </div>

          {/* Premium Sliding Toggle Controller */}
          <div className="relative flex bg-slate-100 p-1 rounded-full w-full max-w-sm border border-slate-200/50">
            <div 
              className="absolute top-1 bottom-1 left-1 rounded-full bg-white shadow-sm border border-slate-200/20 transition-all duration-300 ease-out"
              style={{
                width: 'calc(50% - 4px)',
                transform: `translateX(${activePortalTab === 'dashboard' ? '0%' : '100%'})`
              }}
            />
            <button
              onClick={() => {
                setActivePortalTab('dashboard');
                setSelectedReferredPatientId(null);
              }}
              className={`relative z-10 w-1/2 py-2 text-xs font-bold rounded-full transition-colors duration-300 text-center ${
                activePortalTab === 'dashboard' ? 'text-slate-800' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              💼 Clinical Dashboard
            </button>
            <button
              onClick={() => setActivePortalTab('referrals')}
              className={`relative z-10 w-1/2 py-2 text-xs font-bold rounded-full transition-colors duration-300 text-center ${
                activePortalTab === 'referrals' ? 'text-slate-800' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              🌸 Referral Program
            </button>
          </div>
        </div>
      </section>

      {/* Main Responsive Grid Layout */}
      <section className="max-w-7xl mx-auto p-6 lg:p-10 transition-all duration-500">
        
        {/* Dynamic Portal View Selector */}
        {activePortalTab === 'dashboard' ? (
          /* TAB 1: CLINICAL DASHBOARD VIEW */
          <div className="space-y-8 animate-fadeIn duration-200">
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
          </div>
        ) : (
          /* TAB 2: REFERRALS AND DOSSIER PROGRAM VIEW */
          <div className="animate-fadeIn duration-200">
            
            {/* Inline Feedback Alerts */}
            {formFeedback && (
              <div className={`p-4 mb-6 rounded-xl border flex items-start gap-3 shadow-sm ${
                formFeedback.type === 'success' 
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-100' 
                  : 'bg-rose-50 text-rose-800 border-rose-100'
              }`}>
                <Info className="w-5 h-5 shrink-0 mt-0.5" />
                <span className="text-sm font-semibold">{formFeedback.message}</span>
              </div>
            )}

            {selectedReferredPatientId ? (
              /* ACTIVE DOSSIER PANEL SUBVIEW */
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                
                {/* Dossier Header banner */}
                <div className="bg-violet-50/50 p-6 border-b border-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => {
                        setSelectedReferredPatientId(null);
                        setSelectedPatientHistory(null);
                      }}
                      className="p-2.5 rounded-full bg-white hover:bg-slate-50 border border-slate-200/50 text-slate-600 hover:text-slate-800 transition-colors shadow-sm"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div>
                      <h2 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                        {dossierLoading ? 'Loading Profile...' : (selectedPatientHistory?.patient?.patientName || 'Medical Dossier')}
                        <span className="text-xs bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full font-bold">
                          Converted Patient 🩸
                        </span>
                      </h2>
                      {!dossierLoading && selectedPatientHistory && (
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-slate-500 text-xs mt-1 font-medium">
                          <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-slate-400" /> {selectedPatientHistory?.patient?.email}</span>
                          <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-slate-400" /> {selectedPatientHistory?.patient?.mobile}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Dossier sub tabs */}
                  {!dossierLoading && (
                    <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200/40">
                      <button
                        onClick={() => setDossierActiveTab('overview')}
                        className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                          dossierActiveTab === 'overview' 
                            ? 'bg-white text-slate-800 shadow-sm' 
                            : 'text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        Clinical Profile
                      </button>
                      <button
                        onClick={() => setDossierActiveTab('timeline')}
                        className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                          dossierActiveTab === 'timeline' 
                            ? 'bg-white text-slate-800 shadow-sm' 
                            : 'text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        Date-wise History
                      </button>
                    </div>
                  )}
                </div>

                {dossierLoading ? (
                  <div className="py-24 text-center">
                    <div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-sm font-medium text-slate-400">Loading Clinical dossiers & cycle telemetry...</p>
                  </div>
                ) : (
                  <div className="p-6 md:p-10 space-y-10">
                    
                    {dossierActiveTab === 'overview' ? (
                      /* DOSSIER SUBTAB A: CLINICAL OVERVIEW PARAMETERS */
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        
                        {/* Clinical Bio Column */}
                        <div className="lg:col-span-2 space-y-8">
                          
                          {/* Profile Data */}
                          <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-6">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-1.5">
                              <User className="w-3.5 h-3.5 text-violet-500" /> Patient Parameters
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                              <div>
                                <span className="text-xs text-slate-400 block font-medium">Age</span>
                                <span className="text-sm font-bold text-slate-700 mt-1 block">
                                  {selectedPatientHistory?.profile?.age ? `${selectedPatientHistory.profile.age} years` : 'Not Logged'}
                                </span>
                              </div>
                              <div>
                                <span className="text-xs text-slate-400 block font-medium">Weight</span>
                                <span className="text-sm font-bold text-slate-700 mt-1 block">
                                  {selectedPatientHistory?.profile?.weight ? `${selectedPatientHistory.profile.weight} kg` : 'Not Logged'}
                                </span>
                              </div>
                              <div>
                                <span className="text-xs text-slate-400 block font-medium">Height</span>
                                <span className="text-sm font-bold text-slate-700 mt-1 block">
                                  {selectedPatientHistory?.profile?.height ? `${selectedPatientHistory.profile.height} cm` : 'Not Logged'}
                                </span>
                              </div>
                              <div>
                                <span className="text-xs text-slate-400 block font-medium">BMI Analysis</span>
                                <span className="text-sm font-bold text-slate-700 mt-1 block">
                                  {(() => {
                                    const w = selectedPatientHistory?.profile?.weight;
                                    const h = selectedPatientHistory?.profile?.height;
                                    if (w && h) {
                                      const bmi = (w / ((h / 100) * (h / 100))).toFixed(1);
                                      let cat = 'Normal';
                                      if (parseFloat(bmi) < 18.5) cat = 'Underweight';
                                      else if (parseFloat(bmi) >= 25 && parseFloat(bmi) < 30) cat = 'Overweight';
                                      else if (parseFloat(bmi) >= 30) cat = 'Obese';
                                      return `${bmi} (${cat})`;
                                    }
                                    return 'N/A';
                                  })()}
                                </span>
                              </div>
                              <div>
                                <span className="text-xs text-slate-400 block font-medium">Cycle regularity</span>
                                <span className="text-sm font-bold text-slate-700 mt-1 block">
                                  {selectedPatientHistory?.patient?.cycleRegularity || 'Regular'}
                                </span>
                              </div>
                              <div>
                                <span className="text-xs text-slate-400 block font-medium">Care Plan</span>
                                <span className={`inline-block text-[10px] font-extrabold tracking-wide uppercase px-2 py-0.5 rounded-full mt-1 ${
                                  selectedPatientHistory?.profile?.activePlan ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                                }`}>
                                  {selectedPatientHistory?.profile?.activePlan || 'No Plan Active'}
                                </span>
                              </div>
                            </div>

                            {/* Highlighted Symptoms */}
                            <div className="mt-6 border-t border-slate-100 pt-5">
                              <span className="text-xs text-slate-400 block font-medium mb-2.5">User Highlighted Symptoms</span>
                              <div className="flex flex-wrap gap-2">
                                {selectedPatientHistory?.profile?.symptoms && selectedPatientHistory.profile.symptoms.length > 0 ? (
                                  selectedPatientHistory.profile.symptoms.map((symptom: string, i: number) => (
                                    <span key={i} className="text-xs bg-rose-50 border border-rose-100 text-rose-600 px-3 py-1 rounded-lg font-semibold">
                                      {symptom}
                                    </span>
                                  ))
                                ) : (
                                  <span className="text-xs text-slate-400 italic">No symptoms highlighted by user.</span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Logged Periods Calendar representation */}
                          <div className="border border-slate-100 rounded-2xl p-6">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-pink-500" /> Logged Cycles & Period History (Month-wise)
                            </h3>
                            {selectedPatientHistory?.periodHistory && selectedPatientHistory.periodHistory.length > 0 ? (
                              <div className="space-y-4">
                                {selectedPatientHistory.periodHistory.map((cycle: any, idx: number) => {
                                  const end = cycle.endDate ? new Date(cycle.endDate) : null;
                                  const start = new Date(cycle.startDate);
                                  const duration = end ? Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) : null;
                                  return (
                                    <div key={idx} className="flex items-center gap-4 bg-slate-50/50 p-4 rounded-xl border border-slate-100 hover:shadow-sm transition-shadow">
                                      <div className="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center text-pink-500 shrink-0">
                                        <Droplet className="w-5 h-5" />
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-center">
                                          <p className="text-sm font-bold text-slate-800">
                                            Start: {start.toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' })}
                                          </p>
                                          <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                                            end ? 'bg-slate-200 text-slate-700' : 'bg-pink-100 text-pink-700 animate-pulse'
                                          }`}>
                                            {end ? `${duration || 1} Days Cycle` : 'Ongoing 🩸'}
                                          </span>
                                        </div>
                                        <p className="text-xs text-slate-500 mt-1 font-medium">
                                          End Date: {end ? end.toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' }) : 'Still Active'}
                                        </p>
                                        {cycle.notes && (
                                          <p className="text-xs bg-white p-2 rounded border border-slate-200/50 text-slate-600 mt-2 font-medium">
                                            Notes: "{cycle.notes}"
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            ) : (
                              <div className="text-center py-8 bg-slate-50 rounded-xl">
                                <p className="text-xs text-slate-400 italic">No cycle dates logged yet.</p>
                              </div>
                            )}
                          </div>

                          {/* Daily Wellness Telemetry Data Representation */}
                          <div className="border border-slate-100 rounded-2xl p-6">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-1.5">
                              <Activity className="w-3.5 h-3.5 text-emerald-500" /> Daily Wellness Telemetry (Last 10 Logs)
                            </h3>
                            {selectedPatientHistory?.wellnessHistory && selectedPatientHistory.wellnessHistory.length > 0 ? (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {selectedPatientHistory.wellnessHistory.slice(0, 10).map((log: any, idx: number) => (
                                  <div key={idx} className="bg-slate-50/50 p-4 rounded-xl border border-slate-100 space-y-2">
                                    <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                                      <span className="text-[11px] font-bold text-slate-500">
                                        {new Date(log.logDate || log.date).toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' })}
                                      </span>
                                      <span className="text-xs font-semibold bg-violet-50 text-violet-700 px-2 py-0.5 rounded-lg">
                                        Mood: {log.mood || 'Normal'}
                                      </span>
                                    </div>
                                    <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                                      <span className="flex items-center gap-1"><Moon className="w-3.5 h-3.5 text-violet-400" /> {log.sleep || log.sleepHours || 0} hrs Sleep</span>
                                      <span className="flex items-center gap-1"><Droplet className="w-3.5 h-3.5 text-sky-400" /> {log.waterIntake || log.waterIntakeMl || 0} ml Hydration</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-center py-8 bg-slate-50 rounded-xl">
                                <p className="text-xs text-slate-400 italic">No daily wellness logs reported.</p>
                              </div>
                            )}
                          </div>

                        </div>

                        {/* Clinical Guidance Recommendations column */}
                        <div className="space-y-6">
                          <div className="bg-violet-50/30 border border-violet-100 rounded-2xl p-6 sticky top-28">
                            <h3 className="text-xs font-black text-violet-700 uppercase tracking-widest mb-4 flex items-center gap-1.5">
                              <FileText className="w-4 h-4" /> Clinical Guidance & Notes
                            </h3>
                            <p className="text-xs text-slate-500 mb-4 leading-relaxed font-medium">
                              Write diet recommendations, exercise schedules, customized herbal wellness goals, or PCOD management feedback. WombCare user app synchronizes this note immediately.
                            </p>

                            <textarea
                              rows={8}
                              className="w-full text-xs font-medium border border-violet-100 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:bg-white bg-white/60 text-slate-700 placeholder-slate-400 shadow-inner"
                              value={editingNoteText}
                              onChange={(e) => setEditingNoteText(e.target.value)}
                              placeholder="Write clinical guidance, dietary supplement prescriptions, exercise target, cycle therapy recommendations here..."
                            />

                            <button
                              onClick={handleSaveClinicalGuidance}
                              disabled={savingNote}
                              className="w-full mt-4 bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold py-3 rounded-xl transition-all shadow-md shadow-violet-100 flex items-center justify-center gap-2"
                            >
                              {savingNote ? (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              ) : (
                                <>
                                  <FileCheck className="w-4 h-4" /> Save Clinical Guidance 🌸
                                </>
                              )}
                            </button>
                          </div>
                        </div>

                      </div>
                    ) : (
                      /* DOSSIER SUBTAB B: DATE-WISE DETAILED HISTORY TIMELINE */
                      <div className="space-y-6">
                        {(() => {
                          const grouped = getTimelineData();
                          const months = Object.keys(grouped);

                          if (months.length === 0) {
                            return (
                              <div className="text-center py-16 bg-slate-50 rounded-2xl">
                                <p className="text-sm text-slate-400 italic">No timeline telemetry tracked yet.</p>
                              </div>
                            );
                          }

                          return months.map((monthYear, mIdx) => (
                            <div key={mIdx} className="space-y-4">
                              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest pl-3 flex items-center gap-2">
                                <Clock className="w-3.5 h-3.5 text-slate-400" /> {monthYear}
                              </h3>
                              
                              <div className="border-l-2 border-slate-100 ml-4 pl-6 space-y-6">
                                {grouped[monthYear].map((event, eIdx) => {
                                  let typeColor = 'bg-violet-500';
                                  if (event.type === 'period_start') typeColor = 'bg-pink-500';
                                  if (event.type === 'period_end') typeColor = 'bg-emerald-500';
                                  if (event.type === 'profile_created') typeColor = 'bg-blue-500';

                                  return (
                                    <div key={eIdx} className="relative group">
                                      {/* Event Badge Point */}
                                      <div className={`absolute -left-[31px] top-1.5 w-3 h-3 rounded-full border-2 border-white ring-2 ring-slate-100 ${typeColor}`} />
                                      
                                      <div className="bg-slate-50/50 hover:bg-slate-50 border border-slate-100 hover:border-slate-200/60 p-4 rounded-xl transition-all">
                                        <div className="flex justify-between items-start gap-4">
                                          <h4 className="text-xs font-black text-slate-800 tracking-tight">
                                            {event.title}
                                          </h4>
                                          <span className="text-[10px] text-slate-400 font-bold whitespace-nowrap">
                                            {event.date.toLocaleDateString("en-IN", { day: 'numeric', month: 'short' })}
                                          </span>
                                        </div>
                                        <p className="text-[11px] text-slate-500 font-semibold mt-1.5 leading-relaxed whitespace-pre-line">
                                          {event.details}
                                        </p>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          ));
                        })()}
                      </div>
                    )}

                  </div>
                )}
              </div>
            ) : (
              /* PRIMARY REFERRALS DASHBOARD */
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* 1. Add Referral Side Panel Form */}
                <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-sm space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-black text-slate-800 tracking-tight flex items-center gap-1.5">
                        <Sparkles className="w-5 h-5 text-pink-500" /> Quick Referral
                      </h2>
                      <p className="text-xs text-slate-400 font-semibold mt-1">Introduce a patient to WombCare Care</p>
                    </div>
                  </div>

                  <form onSubmit={handleRefer} className="space-y-4 pt-2">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Patient Name</label>
                      <input 
                        type="text"
                        required
                        className="w-full text-xs font-semibold border border-slate-200/80 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:bg-white bg-slate-50/40 text-slate-700 placeholder-slate-400"
                        placeholder="e.g. Priyanjali Sharma"
                        value={refPatientName}
                        onChange={(e) => setRefPatientName(e.target.value)}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Mobile Number</label>
                      <input 
                        type="tel"
                        required
                        className="w-full text-xs font-semibold border border-slate-200/80 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:bg-white bg-slate-50/40 text-slate-700 placeholder-slate-400"
                        placeholder="e.g. +91 98765 43210"
                        value={refMobile}
                        onChange={(e) => setRefMobile(e.target.value)}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Email Address</label>
                      <input 
                        type="email"
                        required
                        className="w-full text-xs font-semibold border border-slate-200/80 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:bg-white bg-slate-50/40 text-slate-700 placeholder-slate-400"
                        placeholder="e.g. priya@email.com"
                        value={refEmail}
                        onChange={(e) => setRefEmail(e.target.value)}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Clinical Problem Details</label>
                      <textarea 
                        rows={3}
                        className="w-full text-xs font-semibold border border-slate-200/80 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:bg-white bg-slate-50/40 text-slate-700 placeholder-slate-400 shadow-inner"
                        placeholder="Irregular periods, bloating, severe cycle acne, PCOD symptoms..."
                        value={refProblem}
                        onChange={(e) => setRefProblem(e.target.value)}
                      />
                    </div>

                    <button 
                      type="submit"
                      disabled={submittingReferral}
                      className="w-full bg-pink-500 hover:bg-pink-600 active:scale-95 text-white text-xs font-extrabold py-3 rounded-xl transition-all shadow-md shadow-pink-100 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {submittingReferral ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <>
                          <Plus className="w-4 h-4" /> Refer Patient 🌸
                        </>
                      )}
                    </button>
                  </form>
                </div>

                {/* 2. Referral Tracker & Patient dossiers */}
                <div className="lg:col-span-8 space-y-8">
                  
                  {/* Converted Referred Patients List Section */}
                  <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-sm space-y-6">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                      <div>
                        <h2 className="text-lg font-black text-slate-800 tracking-tight flex items-center gap-1.5">
                          <Heart className="w-5 h-5 text-violet-500" /> Converted Patients Dossiers
                        </h2>
                        <p className="text-xs text-slate-400 font-semibold mt-1">Review cycle trends and telemetry date-wise</p>
                      </div>

                      {/* Real-time Filter Query */}
                      <div className="relative w-full md:w-72">
                        <Search className="w-4 h-4 text-violet-400 absolute left-3 top-3" />
                        <input
                          type="text"
                          className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-violet-400"
                          placeholder="Search patient name, code..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                    </div>

                    {convertedPatientsList.length === 0 ? (
                      <div className="text-center py-12 border border-dashed border-slate-200 rounded-2xl">
                        <UserPlus className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                        <p className="text-xs font-medium text-slate-400">No active referred patients match your query.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {convertedPatientsList.map((pat) => (
                          <div 
                            key={pat.id}
                            className="p-4 rounded-xl border border-slate-100 hover:border-violet-100 hover:shadow-sm transition-all bg-slate-50/50 flex flex-col justify-between gap-4"
                          >
                            <div className="space-y-1">
                              <h3 className="text-sm font-bold text-slate-800">{pat.patientName}</h3>
                              <p className="text-[10px] font-black text-violet-600 bg-violet-50 px-2 py-0.5 rounded inline-block">
                                Ref Code: {pat.doctorReferralCode}
                              </p>
                              <div className="text-[11px] text-slate-500 font-medium space-y-0.5 pt-1">
                                <p className="truncate">Email: {pat.email}</p>
                                <p>Phone: {pat.mobile}</p>
                              </div>
                            </div>
                            
                            <button
                              onClick={() => handleViewPatientDossier(pat.id)}
                              className="w-full bg-white hover:bg-violet-600 text-violet-600 hover:text-white border border-violet-200 hover:border-violet-600 text-[11px] font-bold py-2 rounded-lg transition-all flex items-center justify-center gap-1.5"
                            >
                              <FileText className="w-3.5 h-3.5" /> View Clinical Dossier
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Pending/Contacted Tracker logs */}
                  <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-sm space-y-6">
                    <div>
                      <h2 className="text-lg font-black text-slate-800 tracking-tight flex items-center gap-1.5">
                        <UserPlus className="w-5 h-5 text-slate-600" /> Pending Referrals Tracker
                      </h2>
                      <p className="text-xs text-slate-400 font-semibold mt-1">Pending and contacted patient referral records</p>
                    </div>

                    {activeReferralsList.length === 0 ? (
                      <div className="text-center py-12 bg-slate-50 rounded-2xl">
                        <p className="text-xs text-slate-400 italic">No pending referral invites logged.</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {activeReferralsList.map((ref) => (
                          <div 
                            key={ref.id}
                            className="p-4 rounded-xl border border-slate-100 bg-slate-50/30 flex items-center justify-between gap-4 hover:shadow-xs transition-shadow"
                          >
                            <div className="min-w-0 flex-1">
                              <h3 className="text-xs font-black text-slate-800 truncate">{ref.patientName}</h3>
                              <p className="text-[10px] text-slate-400 font-bold mt-0.5 truncate">
                                {ref.email} • {ref.mobile}
                              </p>
                              {ref.problem && (
                                <p className="text-[11px] text-slate-500 mt-1 font-semibold line-clamp-1 italic">
                                  Symptom details: "{ref.problem}"
                                </p>
                              )}
                            </div>

                            <span className={`text-[10px] font-extrabold tracking-wider uppercase px-2.5 py-1 rounded-full shrink-0 ${
                              ref.referralStatus === 'contacted' ? 'bg-amber-100 text-amber-700 border border-amber-200/50' :
                              ref.referralStatus === 'rejected' ? 'bg-rose-100 text-rose-700 border border-rose-200/50' :
                              'bg-slate-100 text-slate-600 border border-slate-200/50'
                            }`}>
                              {ref.referralStatus}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                </div>

              </div>
            )}

          </div>
        )}

      </section>
    </main>
  );
}
