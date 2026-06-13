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

  // Device detection state
  const [isMobileView, setIsMobileView] = useState(false);

  // Referral Mobile active tab (within Referral tab)
  const [refMobileTab, setRefMobileTab] = useState<'referrals' | 'patients'>('referrals');

  // Referral submission success screen states
  const [showSuccessScreen, setShowSuccessScreen] = useState(false);
  const [successName, setSuccessName] = useState("");
  const [successMobile, setSuccessMobile] = useState("");
  const [successProblem, setSuccessProblem] = useState("");

  // Detect viewport size
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
  const [refProblem, setRefProblem] = useState('PCOD/PMOS');
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
  const [noteSuccess, setNoteSuccess] = useState('');
  const [noteError, setNoteError] = useState('');

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
    if (!refPatientName.trim() || !refMobile.trim()) {
      setFormFeedback({ type: 'error', message: 'Name and Mobile Number are required.' });
      return;
    }

    setSubmittingReferral(true);
    setFormFeedback(null);
    try {
      const token = localStorage.getItem('doctorToken') || localStorage.getItem('userToken');
      const apiBase = getPublicApiBase();
      const generatedEmail = `patient-${refMobile.trim().replace(/[^a-zA-Z0-9]/g, "") || Date.now()}@wombcare.in`;

      const response = await fetch(`${apiBase}/referrals`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          patientName: refPatientName.trim(),
          mobile: refMobile.trim(),
          email: generatedEmail,
          problem: refProblem || 'PCOD/PMOS',
        })
      });

      const resData = await response.json();
      if (resData.success) {
        setSuccessName(refPatientName.trim());
        setSuccessMobile(refMobile.trim());
        setSuccessProblem(refProblem || 'PCOD/PMOS');
        setShowSuccessScreen(true);

        setRefPatientName('');
        setRefMobile('');
        setRefProblem('PCOD/PMOS');

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

  // Render Dossier Drawer
  const renderDossierDrawer = () => {
    if (!selectedReferredPatientId) return null;
    const grouped = getTimelineData();
    const months = Object.keys(grouped);

    return (
      <div className="fixed inset-0 z-50 bg-[#111]/50 backdrop-blur-sm flex justify-end transition-opacity duration-300">
        <div className="bg-[#F8F4FF] w-full md:max-w-3xl h-full flex flex-col shadow-2xl relative animate-slide-in">
          
          {/* Header */}
          <div className="p-5 border-b border-[#EEE] bg-white flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setSelectedReferredPatientId(null);
                  setSelectedPatientHistory(null);
                }}
                className="p-2 hover:bg-slate-100 rounded-full text-slate-700 transition-all cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center border-none"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div>
                <h2 className="font-bold text-[#111] text-[24px] max-w-[200px] sm:max-w-xs truncate leading-none">
                  {dossierLoading
                    ? "Loading Dossier..."
                    : selectedPatientHistory?.patient?.patientName || "Clinical Dossier"}
                </h2>
                {!dossierLoading && (
                  <p className="text-[13px] text-[#666] truncate max-w-[200px] sm:max-w-xs mt-1 font-semibold">
                    {selectedPatientHistory?.patient?.email ? `${selectedPatientHistory.patient.email} • ` : ""}
                    {selectedPatientHistory?.patient?.mobile || ""}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={() => {
                setSelectedReferredPatientId(null);
                setSelectedPatientHistory(null);
              }}
              className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-700 cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center border-none"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {dossierLoading ? (
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="w-8 h-8 border-2 border-[#7C5CFF] border-t-transparent rounded-full animate-spin mb-3" />
              <p className="text-slate-500 text-xs font-semibold">Retrieving Clinical Dossier File...</p>
            </div>
          ) : (
            <>
              {/* Tab Selector */}
              <div className="p-[20px] pb-1 flex-shrink-0">
                <div className="flex bg-[#F0E9FF] p-[4px] rounded-[16px] border border-transparent w-full">
                  <button
                    onClick={() => setDossierActiveTab("overview")}
                    className={`py-2 px-3 text-[13px] font-bold transition-all rounded-[12px] cursor-pointer flex items-center gap-1.5 flex-1 justify-center min-h-[38px] ${
                      dossierActiveTab === "overview" ? "bg-[#7C5CFF] text-white shadow-sm" : "text-[#7C5CFF]"
                    }`}
                  >
                    Clinical Profile
                  </button>
                  <button
                    onClick={() => setDossierActiveTab("timeline")}
                    className={`py-2 px-3 text-[13px] font-bold transition-all rounded-[12px] cursor-pointer flex items-center gap-1.5 flex-1 justify-center min-h-[38px] ${
                      dossierActiveTab === "timeline" ? "bg-[#7C5CFF] text-white shadow-sm" : "text-[#7C5CFF]"
                    }`}
                  >
                    Date-wise History
                  </button>
                </div>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto px-5 pb-8 space-y-4">
                {dossierActiveTab === "overview" ? (
                  <>
                    {/* Clinical Profile Card */}
                    <div className="bg-white rounded-[28px] p-5 shadow-sm border border-slate-100 space-y-4">
                      <h4 className="font-bold text-[#111] text-[18px]">Clinical Profile</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div>
                          <span className="text-[12px] font-bold text-[#999] block uppercase">Age</span>
                          <span className="text-[16px] font-bold text-[#111] mt-1 block">
                            {selectedPatientHistory?.profile?.age ? `${selectedPatientHistory.profile.age} years` : "Not specified"}
                          </span>
                        </div>
                        <div>
                          <span className="text-[12px] font-bold text-[#999] block uppercase">Weight</span>
                          <span className="text-[16px] font-bold text-[#111] mt-1 block">
                            {selectedPatientHistory?.profile?.weight ? `${selectedPatientHistory.profile.weight} kg` : "Not specified"}
                          </span>
                        </div>
                        <div>
                          <span className="text-[12px] font-bold text-[#999] block uppercase">Height</span>
                          <span className="text-[16px] font-bold text-[#111] mt-1 block">
                            {selectedPatientHistory?.profile?.height ? `${selectedPatientHistory.profile.height} cm` : "Not specified"}
                          </span>
                        </div>
                        <div>
                          <span className="text-[12px] font-bold text-[#999] block uppercase">BMI Ratio</span>
                          <span className="text-[16px] font-bold text-[#111] mt-1 block">
                            {(() => {
                              const w = selectedPatientHistory?.profile?.weight;
                              const h = selectedPatientHistory?.profile?.height;
                              if (w && h) {
                                const bmiVal = parseFloat((w / Math.pow(h / 100, 2)).toFixed(1));
                                let cat = "Normal";
                                if (bmiVal < 18.5) cat = "Underweight";
                                else if (bmiVal >= 25 && bmiVal < 30) cat = "Overweight";
                                else if (bmiVal >= 30) cat = "Obese";
                                return `${bmiVal} (${cat})`;
                              }
                              return "N/A";
                            })()}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-50">
                        <div>
                          <span className="text-[12px] font-bold text-[#999] block uppercase">Cycle regularity</span>
                          <span className="text-[16px] font-bold text-[#111] mt-1 block">
                            {selectedPatientHistory?.patient?.cycleRegularity || "Regular"}
                          </span>
                        </div>
                        <div>
                          <span className="text-[12px] font-bold text-[#999] block uppercase">Country</span>
                          <span className="text-[16px] font-bold text-[#111] mt-1 block">
                            {selectedPatientHistory?.patient?.country || "India"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Care Plan & Goals */}
                    <div className="bg-white rounded-[28px] p-5 shadow-sm border border-slate-100 space-y-4">
                      <h4 className="font-bold text-[#111] text-[18px]">Care Plan & Goals</h4>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <span className="text-[12px] font-bold text-[#999] block uppercase">Active Subscription</span>
                          {selectedPatientHistory?.profile?.activePlan ? (
                            <div className={selectedPatientHistory.profile.activePlan.toLowerCase().includes("premium") ? "bg-[#FFF3D6] rounded-[12px] px-3 py-1 mt-1.5 inline-block" : "bg-[#E0F2FE] rounded-[12px] px-3 py-1 mt-1.5 inline-block"}>
                              <span className={selectedPatientHistory.profile.activePlan.toLowerCase().includes("premium") ? "text-[#D89B00] text-xs font-bold uppercase" : "text-[#0284C7] text-xs font-bold uppercase"}>
                                ✨ {selectedPatientHistory.profile.activePlan}
                              </span>
                            </div>
                          ) : (
                            <p className="text-xs text-slate-400 italic mt-1 font-semibold">No plan selected</p>
                          )}
                        </div>

                        <div>
                          <span className="text-[12px] font-bold text-[#999] block uppercase">Water Intake Target</span>
                          <span className="text-xs font-bold text-[#111] mt-2 block">
                            🥛 {selectedPatientHistory?.profile?.targetWater ? `${selectedPatientHistory.profile.targetWater} glasses` : "8 glasses"}
                          </span>
                        </div>
                      </div>

                      <div>
                        <span className="text-[12px] font-bold text-[#999] block uppercase mb-1.5">User Highlighted Symptoms</span>
                        {selectedPatientHistory?.profile?.symptoms && selectedPatientHistory.profile.symptoms.length > 0 ? (
                          <div className="flex flex-wrap gap-1.5">
                            {selectedPatientHistory.profile.symptoms.map((symptom: string, sIdx: number) => (
                              <span key={sIdx} className="bg-[#FFE5EF] text-[#FF4D8D] text-xs font-bold px-3 py-1 rounded-[12px]">
                                {symptom}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-slate-400 italic font-semibold">No active symptoms logged</p>
                        )}
                      </div>

                      <div>
                        <span className="text-[12px] font-bold text-[#999] block uppercase">Baseline Health Problem Description</span>
                        <p className="text-[15px] text-[#444] leading-[22px] mt-1.5 font-medium">
                          {selectedPatientHistory?.profile?.personalNotes || selectedPatientHistory?.patient?.problem || "No personal notes recorded."}
                        </p>
                      </div>
                    </div>

                    {/* Logged Cycles */}
                    <div className="bg-white rounded-[28px] p-5 shadow-sm border border-slate-100 space-y-4">
                      <h4 className="font-bold text-[#111] text-[18px]">Logged Cycles & Periods</h4>
                      {selectedPatientHistory?.periodHistory && selectedPatientHistory.periodHistory.length > 0 ? (
                        <div className="divide-y divide-[#F3EBFD]">
                          {selectedPatientHistory.periodHistory.map((cycle: any, idx: number) => {
                            const hasEnded = !!cycle.endDate;
                            const bleedingDays = hasEnded
                              ? Math.round((new Date(cycle.endDate).getTime() - new Date(cycle.startDate).getTime()) / (1000 * 60 * 60 * 24))
                              : null;
                            return (
                              <div key={idx} className="flex items-center py-2.5 gap-3">
                                <div className="w-9 h-9 rounded-full bg-[#FFE5EF] flex items-center justify-center text-pink-500 flex-shrink-0">
                                  🩸
                                </div>
                                <div className="text-xs flex-1 space-y-0.5">
                                  <p className="text-[14px] font-medium text-[#111]">
                                    Start: {new Date(cycle.startDate).toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' })}
                                  </p>
                                  <p className={`text-[14px] font-medium ${hasEnded ? "text-[#555]" : "text-[#FF4D8D]"}`}>
                                    End: {hasEnded ? new Date(cycle.endDate).toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' }) : "Ongoing Bleeding"}
                                  </p>
                                  <div className={hasEnded ? "bg-[#DCFCE7] rounded-lg px-2 py-0.5 mt-1 inline-block" : "bg-[#FEE2E2] rounded-lg px-2 py-0.5 mt-1 inline-block"}>
                                    <span className={hasEnded ? "text-[#16A34A] text-[11px] font-semibold" : "text-[#EF4444] text-[11px] font-semibold"}>
                                      {hasEnded ? `${bleedingDays || 1} days bleeding period` : "Period currently active"}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-xs text-[#999] italic font-semibold">No cycle logs tracked yet by user.</p>
                      )}
                    </div>

                    {/* Wellness Telemetry */}
                    <div className="bg-white rounded-[28px] p-5 shadow-sm border border-slate-100 space-y-4">
                      <h4 className="font-bold text-[#111] text-[18px]">Wellness Telemetry (Last 10 Days)</h4>
                      {selectedPatientHistory?.wellnessHistory && selectedPatientHistory.wellnessHistory.length > 0 ? (
                        <div className="divide-y divide-[#F3EBFD]">
                          {selectedPatientHistory.wellnessHistory.slice(0, 10).map((log: any, idx: number) => (
                            <div key={idx} className="flex items-center py-2.5 gap-3">
                              <div className="w-9 h-9 rounded-full bg-[#EEE9FF] flex items-center justify-center text-purple-500 flex-shrink-0">
                                ⚡
                              </div>
                              <div className="flex-1 space-y-0.5">
                                <p className="text-[14px] font-bold text-[#111]">
                                  {new Date(log.logDate || log.date).toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' })}
                                </p>
                                <div className="flex gap-4 text-[#666] text-xs font-semibold">
                                  <span>Mood: {log.mood || "N/A"}</span>
                                  <span>Sleep: {log.sleep || log.sleepHours || "0"} hrs</span>
                                  <span>Water: {log.waterIntake || log.waterIntakeMl || "0"} ml</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-[#999] italic font-semibold font-semibold">No daily wellness metrics logged yet.</p>
                      )}
                    </div>

                    {/* Recommendations Guidance */}
                    <div className="bg-white rounded-[28px] p-5 shadow-sm border border-[#EFEAFA] space-y-4">
                      <h4 className="font-bold text-[#111] text-[18px] flex items-center gap-1">
                        Clinical Guidance & Note
                      </h4>
                      <span className="text-[12px] font-bold text-[#999] block uppercase">Doctor Recommendations</span>

                      {noteError && (
                        <div className="p-3 bg-pink-50 border border-pink-100 text-pink-700 text-xs rounded-xl font-semibold">
                          {noteError}
                        </div>
                      )}

                      {noteSuccess && (
                        <div className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs rounded-xl font-semibold">
                          {noteSuccess}
                        </div>
                      )}

                      <textarea
                        rows={4}
                        className="w-full p-4 bg-[#FAFAFA] border border-[#EFEAFA] rounded-[18px] text-base sm:text-[14px] text-[#111] focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all resize-none font-medium"
                        placeholder="Recommend diet plans, supplement schedules, exercise logs, or guidance..."
                        value={editingNoteText}
                        onChange={(e) => setEditingNoteText(e.target.value)}
                      />

                      <button
                        onClick={handleSaveClinicalGuidance}
                        disabled={savingNote}
                        className="w-full h-[50px] bg-[#FF4D8D] hover:bg-pink-600 text-white font-bold rounded-[18px] text-[14px] shadow-sm transition-all cursor-pointer flex items-center justify-center border-none"
                      >
                        {savingNote ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          "Save Clinical Guidance 🌸"
                        )}
                      </button>
                    </div>
                  </>
                ) : (
                  // Timeline view
                  <div className="space-y-6">
                    {months.length === 0 ? (
                      <div className="bg-white rounded-[28px] p-8 text-center border border-slate-100">
                        <p className="text-xs text-[#999] italic font-semibold font-semibold">No timeline metrics or tracking logs available.</p>
                      </div>
                    ) : (
                      months.map((monthYear, mIdx) => (
                        <div key={mIdx} className="space-y-3">
                          <h5 className="text-[13px] font-black text-[#7C5CFF] tracking-wider uppercase ml-1">
                            {monthYear}
                          </h5>

                          <div className="border-l-2 border-[#E2D9F3] pl-[18px] ml-3.5 space-y-4">
                            {grouped[monthYear].map((event, eIdx) => {
                              let badgeColor = "#7C5CFF";
                              if (event.type === "period_start") {
                                badgeColor = "#FF4D8D";
                              } else if (event.type === "period_end") {
                                badgeColor = "#10B981";
                              } else if (event.type === "profile_created") {
                                badgeColor = "#3B82F6";
                              }

                              return (
                                <div key={eIdx} className="relative timelineEventItem">
                                  <div
                                    style={{ borderColor: badgeColor, color: badgeColor }}
                                    className="absolute top-1 left-[-29px] w-[22px] h-[22px] rounded-full bg-white border flex items-center justify-center text-[10px] font-bold"
                                  >
                                    •
                                  </div>
                                  
                                  <div className="bg-white rounded-[14px] p-3 border border-[#F3EBFD] shadow-sm space-y-1">
                                    <div className="flex items-center justify-between gap-2">
                                      <p className="text-[11px] font-bold text-[#111] truncate">{event.title}</p>
                                      <span className="text-[9px] text-[#888] font-bold flex-shrink-0">
                                        {event.date.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                                      </span>
                                    </div>
                                    <p className="text-[10px] text-[#555] leading-relaxed whitespace-pre-line font-medium">
                                      {event.details}
                                    </p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                <button
                  onClick={() => {
                    setSelectedReferredPatientId(null);
                    setSelectedPatientHistory(null);
                  }}
                  className="w-full h-14 bg-[#111] hover:bg-[#222] text-white font-semibold rounded-[24px] text-base transition-all cursor-pointer flex items-center justify-center mt-6 border-none"
                >
                  Close Dossier
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

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
              quickInsights={earnings || []}
            />

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              <AppointmentsTable appointments={appointments} />
              <UpcomingSessions sessions={todayAppointments} />
            </div>

            <EarningsAnalytics earnings={earnings} stats={earningsStats} doctorData={doctorData} />
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

            {isMobileView ? (
              /* MOBILE REFERRAL LAYOUT */
              <div className="space-y-6">
                {/* Tab Navigation Pill Control */}
                <div className="flex bg-[#F1EAFE] p-1.5 rounded-[22px] border border-transparent w-full">
                  <button
                    onClick={() => setRefMobileTab('referrals')}
                    className={`flex-1 text-center py-2.5 rounded-[18px] font-bold text-xs tracking-wide transition-all cursor-pointer min-h-[48px] flex items-center justify-center border-none ${
                      refMobileTab === 'referrals' ? 'bg-[#111] text-white shadow-md' : 'text-[#777]'
                    }`}
                  >
                    Referrals Feed
                  </button>
                  <button
                    onClick={() => setRefMobileTab('patients')}
                    className={`flex-1 text-center py-2.5 rounded-[18px] font-bold text-xs tracking-wide transition-all cursor-pointer min-h-[48px] flex items-center justify-center border-none ${
                      refMobileTab === 'patients' ? 'bg-[#111] text-white shadow-md' : 'text-[#777]'
                    }`}
                  >
                    My Active Patients
                  </button>
                </div>

                {refMobileTab === 'referrals' ? (
                  <>
                    {/* Stats Bars */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-[#FFE5EF] rounded-[28px] p-5 shadow-sm text-center">
                        <span className="text-[#666] text-[10px] font-bold uppercase tracking-wider block">Active Patients</span>
                        <p className="text-3xl font-black text-[#111] mt-2">{convertedPatientsList.length}</p>
                      </div>
                      
                      <div className="bg-[#EEE9FF] rounded-[28px] p-5 shadow-sm text-center">
                        <span className="text-[#666] text-[10px] font-bold uppercase tracking-wider block">Referrals Sent</span>
                        <p className="text-3xl font-black text-[#111] mt-2">{referrals.length}</p>
                      </div>
                    </div>

                    {/* Quick Referral Form or Success Screen */}
                    {showSuccessScreen ? (
                      <div className="bg-white rounded-[30px] p-6 shadow-sm border border-[#E2D9F3] text-center space-y-5">
                        <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-[#16A34A] text-3xl shadow-sm border border-emerald-100 animate-bounce">
                          ✓
                        </div>
                        
                        <div className="space-y-1">
                          <h3 className="text-xl font-black text-[#111]">Referral Registered!</h3>
                          <p className="text-xs text-[#666]">Successfully logged in WombCare administration</p>
                        </div>

                        <div className="bg-[#FAFAFA] border border-[#EEE] rounded-[20px] p-4 text-left space-y-2">
                          <span className="text-[10px] font-black text-[#999] uppercase tracking-wide block">Patient Summary</span>
                          <p className="text-sm font-bold text-[#111]">{successName}</p>
                          <div className="flex justify-between text-xs text-slate-500 pt-1.5 border-t border-slate-100/50">
                            <span>Goal: <span className="font-bold text-[#FF4D8D]">{successProblem}</span></span>
                            <span>Mobile: <span className="font-semibold">{successMobile}</span></span>
                          </div>
                        </div>

                        <button
                          onClick={() => setShowSuccessScreen(false)}
                          className="w-full h-12 bg-[#111] hover:bg-[#222] text-white font-bold rounded-[18px] text-xs shadow-md transition-all cursor-pointer flex items-center justify-center border-none"
                        >
                          Refer Another Patient 🌸
                        </button>
                      </div>
                    ) : (
                      <div className="bg-white rounded-[34px] p-5 shadow-sm border border-slate-100/50 space-y-5">
                        <div className="bg-gradient-to-r from-pink-500 to-rose-400 rounded-xl p-4 text-white flex items-center justify-between">
                          <div>
                            <h3 className="font-bold text-base">Quick Referral</h3>
                            <p className="text-[10px] text-pink-50 mt-0.5 font-semibold">Register a referred patient instantly</p>
                          </div>
                          <Sparkles className="w-6 h-6 text-white" />
                        </div>

                        <form onSubmit={handleRefer} className="space-y-4">
                          <div>
                            <label className="block text-[#555] text-xs font-bold mb-2">
                              Patient Name
                            </label>
                            <input
                              type="text"
                              required
                              className="w-full px-[18px] h-[58px] bg-[#FAFAFA] border border-[#EEE] rounded-[18px] text-[#111] focus:outline-none focus:ring-2 focus:ring-[#FF4D8D] focus:bg-white text-base font-semibold"
                              placeholder="Enter patient full name"
                              value={refPatientName}
                              onChange={(e) => setRefPatientName(e.target.value)}
                            />
                          </div>

                          <div>
                            <label className="block text-[#555] text-xs font-bold mb-2">
                              Mobile Number
                            </label>
                            <input
                              type="tel"
                              required
                              className="w-full px-[18px] h-[58px] bg-[#FAFAFA] border border-[#EEE] rounded-[18px] text-[#111] focus:outline-none focus:ring-2 focus:ring-[#FF4D8D] focus:bg-white text-base font-semibold"
                              placeholder="+91 98765 43210"
                              value={refMobile}
                              onChange={(e) => setRefMobile(e.target.value)}
                            />
                          </div>

                          <div>
                            <label className="block text-[#555] text-xs font-bold mb-2">
                              Clinical Goal / Category
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                              <button
                                type="button"
                                onClick={() => setRefProblem("PCOD/PMOS")}
                                className={`py-3 px-3 rounded-[16px] font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer min-h-[48px] border-none ${
                                  refProblem === "PCOD/PMOS"
                                    ? "bg-[#FF4D8D] text-white shadow-sm"
                                    : "bg-[#FFF0F5] border-[1.5px] border-[#FFE4E1] text-[#FF4D8D]"
                                  }`}
                              >
                                PCOS/PCOD/PMOS
                              </button>

                              <button
                                type="button"
                                onClick={() => setRefProblem("Conceive")}
                                className={`py-3 px-3 rounded-[16px] font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer min-h-[48px] border-none ${
                                  refProblem === "Conceive"
                                    ? "bg-[#FF4D8D] text-white shadow-sm"
                                    : "bg-[#FFF0F5] border-[1.5px] border-[#FFE4E1] text-[#FF4D8D]"
                                  }`}
                              >
                                Conceive
                              </button>
                            </div>
                          </div>

                          <button
                            type="submit"
                            disabled={submittingReferral}
                            className="w-full h-[58px] bg-[#111] hover:bg-[#222] text-white font-bold rounded-[24px] text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 min-h-[58px] border-none"
                          >
                            {submittingReferral ? (
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                              "Submit Referral"
                            )}
                          </button>
                        </form>
                      </div>
                    )}

                    {/* Recent Referrals List */}
                    <div className="space-y-4">
                      <h3 className="text-[20px] font-black text-[#111] px-1">Recent Referrals</h3>
                      {referralsLoading && referrals.length === 0 ? (
                        <div className="bg-white rounded-[28px] p-6 text-center shadow-sm">
                          <div className="w-6 h-6 border-2 border-[#FF4D8D] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                        </div>
                      ) : activeReferralsList.length === 0 ? (
                        <div className="bg-white rounded-[28px] p-8 text-center shadow-sm border border-slate-100/50">
                          <p className="text-slate-500 font-bold text-xs">No active referrals found</p>
                        </div>
                      ) : (
                        <div className="grid gap-3.5">
                          {activeReferralsList.map((ref) => (
                            <div
                              key={ref.id}
                              className="bg-white rounded-[28px] p-5 shadow-sm flex items-center justify-between gap-3 border border-slate-100/30"
                            >
                              <div className="space-y-1">
                                <p className="font-bold text-[#111] text-base leading-tight">{ref.patientName}</p>
                                <p className="text-[#555] text-xs font-normal">
                                  Condition: <span className="font-semibold text-[#FF4D8D]">{ref.problem}</span>
                                </p>
                                <p className="text-[#999] text-[10px]">
                                  {ref.mobile} • {new Date(ref.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                                </p>
                              </div>

                              <span
                                className={`text-[9px] font-extrabold uppercase px-2.5 py-1 rounded-full border tracking-wide flex-shrink-0 ${
                                  ref.referralStatus === "pending"
                                    ? "bg-[#FFE5EF] border-transparent text-[#FF4D8D]"
                                    : ref.referralStatus === "contacted"
                                    ? "bg-[#EEE9FF] border-transparent text-[#7C5CFF]"
                                    : ref.referralStatus === "converted"
                                    ? "bg-[#DCFCE7] border-transparent text-[#16A34A]"
                                    : "bg-[#FEE2E2] border-transparent text-[#EF4444]"
                                }`}
                              >
                                {ref.referralStatus}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  /* MOBILE ACTIVE PATIENTS */
                  <div className="space-y-4">
                    {/* Search */}
                    <div className="bg-white rounded-[18px] border border-[#E2D9F3] flex items-center px-4 h-[52px] shadow-sm w-full gap-2">
                      <Search className="w-5 h-5 text-[#7C5CFF]" />
                      <input
                        type="text"
                        placeholder="Search by name, referral code..."
                        className="bg-transparent border-none outline-none text-[#111] placeholder-[#A0A0A0] text-base ml-2 w-full focus:ring-0"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      {searchQuery && (
                        <button onClick={() => setSearchQuery("")} className="text-[#999] hover:text-[#555] cursor-pointer p-1">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>

                    {/* Converted Patients */}
                    {convertedPatientsList.length === 0 ? (
                      <div className="bg-white rounded-[28px] p-8 text-center shadow-sm border border-slate-100 flex flex-col items-center justify-center">
                        <p className="text-[#999] font-medium text-sm">No converted referral patients yet</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-4">
                        {convertedPatientsList.map((pat) => (
                          <div
                            key={pat.id}
                            className="bg-white rounded-[30px] p-5 shadow-sm border border-slate-100 flex flex-col justify-between gap-4"
                          >
                            <div className="space-y-2">
                              <div className="flex justify-between items-start">
                                <p className="font-bold text-[#111] text-lg">{pat.patientName}</p>
                                <span className="text-[9px] font-bold bg-[#DCFCE7] text-[#16A34A] px-2 py-0.5 rounded-full uppercase">Active</span>
                              </div>
                              
                              <div className="space-y-1 text-xs font-semibold">
                                <p className="text-[#7C5CFF] font-medium">Referral Code: <span className="font-bold font-mono text-slate-700">{pat.doctorReferralCode}</span></p>
                                {pat.email && <p className="text-[#999] truncate">{pat.email}</p>}
                                <p className="text-[#999]">Mobile: {pat.mobile}</p>
                              </div>
                            </div>

                            <button
                              onClick={() => handleViewPatientDossier(pat.id)}
                              className="w-full py-2.5 bg-[#DCFCE7] hover:bg-[#cbfacf] text-[#16A34A] font-bold rounded-full text-xs transition-all cursor-pointer flex items-center justify-center gap-1 min-h-[40px] border-none"
                            >
                              <span>View Health Dossier</span>
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              /* DESKTOP REFERRAL LAYOUT */
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* LEFT COLUMN: Search & Converted Patients */}
                <section className="lg:col-span-2 space-y-4">
                  <div className="bg-white rounded-[18px] border border-[#E2D9F3] flex items-center px-4 h-[52px] shadow-sm w-full gap-2.5 font-semibold">
                    <Search className="w-5 h-5 text-[#7C5CFF]" />
                    <input
                      type="text"
                      placeholder="Search converted patients by name, email, referral code..."
                      className="bg-transparent border-none outline-none text-[#111] placeholder-[#A0A0A0] text-sm ml-2 w-full focus:ring-0"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                      <button onClick={() => setSearchQuery("")} className="text-[#999] hover:text-[#555] cursor-pointer p-1">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>

                  {convertedPatientsList.length === 0 ? (
                    <div className="bg-white rounded-[28px] p-12 text-center shadow-sm border border-slate-100 flex flex-col items-center justify-center">
                      <Heart className="w-12 h-12 text-slate-300 mb-3" />
                      <p className="text-[#999] font-medium text-base">No converted referred patients found</p>
                      <p className="text-slate-400 text-xs mt-1 font-semibold">Your referred patients will appear here once they register on the WombCare app.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {convertedPatientsList.map((pat) => (
                        <div
                          key={pat.id}
                          className="bg-white rounded-[30px] p-6 shadow-sm border border-slate-100 flex flex-col justify-between hover:border-[#7C5CFF] transition-all gap-5"
                        >
                          <div className="space-y-2">
                            <div className="flex justify-between items-start">
                              <p className="font-bold text-[#111] text-[20px]">{pat.patientName}</p>
                              <span className="text-[9px] font-bold bg-[#DCFCE7] text-[#16A34A] px-2.5 py-1 rounded-full uppercase">Active</span>
                            </div>
                            
                            <div className="space-y-1 text-sm font-semibold">
                              <p className="text-[#7C5CFF] font-medium text-sm">Referral Code: <span className="font-bold font-mono text-slate-700">{pat.doctorReferralCode}</span></p>
                              {pat.email && <p className="text-[#999] text-xs font-semibold truncate">{pat.email}</p>}
                              <p className="text-[#999] text-xs font-semibold">Mobile: {pat.mobile}</p>
                            </div>
                          </div>

                          <button
                            onClick={() => handleViewPatientDossier(pat.id)}
                            className="w-full py-2.5 bg-[#DCFCE7] hover:bg-[#cbfacf] text-[#16A34A] font-bold rounded-full text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 min-h-[44px] border-none"
                          >
                            <span>View Clinical Dossier</span>
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </section>

                {/* RIGHT COLUMN: Quick Referral Form & Recent Referrals */}
                <section className="space-y-6">
                  {showSuccessScreen ? (
                    <div className="bg-white rounded-[30px] p-6 shadow-sm border border-[#E2D9F3] text-center space-y-5">
                      <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-[#16A34A] text-3xl shadow-sm border border-emerald-100 animate-bounce">
                        ✓
                      </div>
                      
                      <div className="space-y-1">
                        <h3 className="text-xl font-black text-[#111]">Referral Registered!</h3>
                        <p className="text-xs text-[#666]">Successfully logged in WombCare administration</p>
                      </div>

                      <div className="bg-[#FAFAFA] border border-[#EEE] rounded-[20px] p-4 text-left space-y-2">
                        <span className="text-[10px] font-black text-[#999] uppercase tracking-wide block">Patient Summary</span>
                        <p className="text-sm font-bold text-[#111]">{successName}</p>
                        <div className="flex justify-between text-xs text-slate-500 pt-1.5 border-t border-slate-100/50">
                          <span>Goal: <span className="font-bold text-[#FF4D8D]">{successProblem}</span></span>
                          <span>Mobile: <span className="font-semibold">{successMobile}</span></span>
                        </div>
                      </div>

                      <button
                        onClick={() => setShowSuccessScreen(false)}
                        className="w-full h-12 bg-[#111] hover:bg-[#222] text-white font-bold rounded-[18px] text-xs shadow-md transition-all cursor-pointer flex items-center justify-center border-none"
                      >
                        Refer Another Patient 🌸
                      </button>
                    </div>
                  ) : (
                    <div className="bg-white rounded-[30px] p-6 shadow-sm border border-[#E2D9F3] space-y-5">
                      <div className="bg-gradient-to-r from-pink-500 to-rose-400 rounded-xl p-4 text-white flex items-center justify-between">
                        <div>
                          <h3 className="font-bold text-sm">Quick Referral</h3>
                          <p className="text-[10px] text-pink-50 mt-0.5 font-semibold font-semibold">Register a referred patient instantly</p>
                        </div>
                        <Sparkles className="w-6 h-6 text-white" />
                      </div>

                      <form onSubmit={handleRefer} className="space-y-4">
                        <div>
                          <label className="block text-[#555] text-xs font-bold mb-2">
                            Patient Name
                          </label>
                          <input
                            type="text"
                            required
                            className="w-full px-4 h-12 bg-[#FAFAFA] border border-[#EEE] rounded-[14px] text-[#111] focus:outline-none focus:ring-2 focus:ring-[#FF4D8D] focus:bg-white text-sm font-semibold"
                            placeholder="Enter patient full name"
                            value={refPatientName}
                            onChange={(e) => setRefPatientName(e.target.value)}
                          />
                        </div>

                        <div>
                          <label className="block text-[#555] text-xs font-bold mb-2">
                            Mobile Number
                          </label>
                          <input
                            type="tel"
                            required
                            className="w-full px-4 h-12 bg-[#FAFAFA] border border-[#EEE] rounded-[14px] text-[#111] focus:outline-none focus:ring-2 focus:ring-[#FF4D8D] focus:bg-white text-sm font-semibold"
                            placeholder="+91 98765 43210"
                            value={refMobile}
                            onChange={(e) => setRefMobile(e.target.value)}
                          />
                        </div>

                        <div>
                          <label className="block text-[#555] text-xs font-bold mb-2">
                            Clinical Goal / Category
                          </label>
                          <div className="grid grid-cols-2 gap-3">
                            <button
                              type="button"
                              onClick={() => setRefProblem("PCOD/PMOS")}
                              className={`py-2 px-3 rounded-[12px] font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer min-h-[38px] border-none ${
                                refProblem === "PCOD/PMOS"
                                  ? "bg-[#FF4D8D] text-white shadow-sm"
                                  : "bg-[#FFF0F5] border-[1.5px] border-[#FFE4E1] text-[#FF4D8D]"
                                }`}
                            >
                              PCOS/PCOD/PMOS
                            </button>

                            <button
                              type="button"
                              onClick={() => setRefProblem("Conceive")}
                              className={`py-2 px-3 rounded-[12px] font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer min-h-[38px] border-none ${
                                refProblem === "Conceive"
                                  ? "bg-[#FF4D8D] text-white shadow-sm"
                                  : "bg-[#FFF0F5] border-[1.5px] border-[#FFE4E1] text-[#FF4D8D]"
                                }`}
                            >
                              Conceive
                            </button>
                          </div>
                        </div>

                        <button
                          type="submit"
                          disabled={submittingReferral}
                          className="w-full h-12 bg-[#111] hover:bg-[#222] text-white font-bold rounded-[18px] text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 border-none"
                        >
                          {submittingReferral ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : (
                            "Submit Patient Referral"
                          )}
                        </button>
                      </form>
                    </div>
                  )}

                  {/* Recent Referrals List */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-black text-[#111] px-1">Recent Referrals</h3>
                    {referralsLoading && referrals.length === 0 ? (
                      <div className="bg-white rounded-[30px] p-6 text-center shadow-sm border border-slate-100">
                        <div className="w-6 h-6 border-2 border-[#FF4D8D] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                      </div>
                    ) : activeReferralsList.length === 0 ? (
                      <div className="bg-white rounded-[30px] p-6 text-center shadow-sm border border-slate-100/50">
                        <p className="text-slate-500 font-bold text-xs">No active referrals found</p>
                      </div>
                    ) : (
                      <div className="grid gap-3.5">
                        {activeReferralsList.map((ref) => (
                          <div
                            key={ref.id}
                            className="bg-white rounded-[24px] p-4 shadow-sm flex items-center justify-between gap-3 border border-slate-100/30"
                          >
                            <div className="space-y-1">
                              <p className="font-bold text-[#111] text-sm leading-tight">{ref.patientName}</p>
                              <p className="text-[#555] text-[11px] font-normal">
                                Condition: <span className="font-semibold text-[#FF4D8D]">{ref.problem}</span>
                              </p>
                              <p className="text-[#999] text-[9px]">
                                {ref.mobile} • {new Date(ref.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                              </p>
                            </div>

                            <span
                              className={`text-[9px] font-extrabold uppercase px-2 py-1 rounded-full border tracking-wide flex-shrink-0 ${
                                ref.referralStatus === "pending"
                                  ? "bg-[#FFE5EF] border-transparent text-[#FF4D8D]"
                                  : ref.referralStatus === "contacted"
                                  ? "bg-[#EEE9FF] border-transparent text-[#7C5CFF]"
                                  : ref.referralStatus === "converted"
                                  ? "bg-[#DCFCE7] border-transparent text-[#16A34A]"
                                  : "bg-[#FEE2E2] border-transparent text-[#EF4444]"
                              }`}
                            >
                              {ref.referralStatus}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </section>
              </div>
            )}
          </div>
        )}

      </section>
      {/* --- PATIENT HEALTH DOSSIER DRAWERS --- */}
      {selectedReferredPatientId && renderDossierDrawer()}
    </main>
  );
}
