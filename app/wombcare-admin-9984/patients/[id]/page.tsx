'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase-client';
import { 
  ArrowLeft, Calendar, Loader2, Sparkles, Plus, 
  Trash2, Save, Activity, Trash, Mail, Phone, MapPin, 
  ChevronRight, Heart, HeartCrack, Info, Clock, Moon, Droplets, Smile, BookOpen, CheckSquare, Utensils
} from 'lucide-react';
import FloatingNavbarComponent from '@/components/FloatingNavbar';
import FooterComponent from '@/components/Footer';

interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  age: number;
  weight: number;
  cycleRegularity: string;
  symptoms: string;
  country: string;
  referredBy?: string;
  created_at?: string;
}

interface PeriodLog {
  id: string;
  user_id: string;
  start_date: string;
  end_date: string;
  symptoms: string[];
  notes?: string;
  created_at: string;
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  active_plan?: string;
  plan_status?: string;
  wellness_goal?: string;
  wellness_score?: number;
  water_intake?: number;
  target_water?: number;
  calories_target?: number;
  protein_target?: number;
  bmi?: number;
  mood?: string;
  sleep?: number;
  journal?: string;
  doctor_note?: string;
}

interface ProfileHistory {
  id: string;
  user_id: string;
  date: string;
  water_intake: number;
  mood: string;
  sleep: number;
  cycle_day?: number;
  symptoms?: string[];
  journal?: string;
}

interface Appointment {
  id: string;
  appointment_date: string;
  doctor_name: string;
  status: string;
  notes?: string;
}

interface MealLog {
  id: string;
  date: string;
  meal_name: string;
  status: string;
  completion_time?: string;
}

export default function PatientDetailPage() {
  const params = useParams();
  const router = useRouter();
  const patientId = params.id as string;

  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'cycle' | 'rhythm' | 'care'>('profile');
  const [patient, setPatient] = useState<Patient | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [periodLogs, setPeriodLogs] = useState<PeriodLog[]>([]);
  
  // Rhythm Pagination & Filter States
  const [historyLogs, setHistoryLogs] = useState<ProfileHistory[]>([]);
  const [historyPage, setHistoryPage] = useState(0);
  const [hasMoreHistory, setHasMoreHistory] = useState(true);
  const [filterMood, setFilterMood] = useState('all');
  const [filterSymptom, setFilterSymptom] = useState('all');
  const [loadingHistory, setLoadingHistory] = useState(false);

  // Appointments Pagination & Filter States
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [apptPage, setApptPage] = useState(0);
  const [hasMoreAppt, setHasMoreAppt] = useState(true);
  const [loadingAppt, setLoadingAppt] = useState(false);

  // Meal Logs Pagination States
  const [mealLogs, setMealLogs] = useState<MealLog[]>([]);
  const [mealPage, setMealPage] = useState(0);
  const [hasMoreMeals, setHasMoreMeals] = useState(true);
  const [loadingMeals, setLoadingMeals] = useState(false);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loggingPeriod, setLoggingPeriod] = useState(false);

  // Edit Patient Form State
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    age: 0,
    weight: 0,
    cycleRegularity: '',
    symptoms: '',
    country: ''
  });

  // Edit Profile Fields
  const [profileForm, setProfileForm] = useState({
    active_plan: '',
    plan_status: '',
    wellness_goal: '',
    wellness_score: 0,
    doctor_note: ''
  });

  // Add Period Log Form State
  const [newLog, setNewLog] = useState({
    start_date: '',
    end_date: '',
    symptoms: [] as string[],
    notes: ''
  });

  useEffect(() => {
    if (patientId) {
      loadData();
    }
  }, [patientId]);

  const loadData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Patient details
      const { data: patientData, error: patientError } = await supabase
        .from('patients')
        .select('*')
        .eq('id', patientId)
        .single();

      if (patientError) throw patientError;
      setPatient(patientData);
      setForm({
        name: patientData.name || '',
        email: patientData.email || '',
        phone: patientData.phone || '',
        age: patientData.age || 0,
        weight: patientData.weight || 0,
        cycleRegularity: patientData.cycle_regular || '',
        symptoms: patientData.symptoms || '',
        country: patientData.country || ''
      });

      // 2. Fetch Wombcare User Profile (by matching patient's email or ID)
      const { data: profileData } = await supabase
        .from('wombcare_user_profiles')
        .select('*')
        .or(`id.eq.${patientId},email.eq.${patientData.email}`)
        .maybeSingle();

      let resolvedProfile = null;
      if (profileData) {
        setProfile(profileData);
        resolvedProfile = profileData;
        setProfileForm({
          active_plan: profileData.active_plan || 'None',
          plan_status: profileData.plan_status || 'inactive',
          wellness_goal: profileData.wellness_goal || '',
          wellness_score: profileData.wellness_score || 0,
          doctor_note: profileData.doctor_note || ''
        });
      }

      const targetUserId = profileData?.id || patientId;

      // 3. Fetch Period History
      const { data: periodData } = await supabase
        .from('wombcare_period_history')
        .select('*')
        .eq('user_id', targetUserId)
        .order('start_date', { ascending: true });

      setPeriodLogs(periodData || []);

      // Load initial paginated history logs
      await fetchHistoryLogs(targetUserId, 0, true, 'all', 'all');
      await fetchApptLogs(targetUserId, 0, true);
      await fetchMealLogs(targetUserId, 0, true);

    } catch (err: any) {
      console.error('Error loading patient detail:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchHistoryLogs = async (targetId: string, pageNum: number, reset = false, moodFilter = 'all', symptomFilter = 'all') => {
    setLoadingHistory(true);
    const from = pageNum * 5;
    const to = from + 4;

    try {
      let query = supabase
        .from('wombcare_user_profile_history')
        .select('*')
        .eq('user_id', targetId)
        .order('date', { ascending: false });

      if (moodFilter !== 'all') {
        query = query.eq('mood', moodFilter);
      }

      const { data, error } = await query.range(from, to);
      if (error) throw error;

      const newLogs = data || [];
      
      // Filter client-side for symptoms since it is a JSON array
      let filteredLogs = newLogs;
      if (symptomFilter !== 'all') {
        filteredLogs = newLogs.filter(log => 
          Array.isArray(log.symptoms) && log.symptoms.includes(symptomFilter)
        );
      }

      if (reset) {
        setHistoryLogs(filteredLogs);
      } else {
        setHistoryLogs(prev => [...prev, ...filteredLogs]);
      }
      setHistoryPage(pageNum + 1);
      setHasMoreHistory(newLogs.length === 5);
    } catch (err) {
      console.error('Error fetching history:', err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const fetchApptLogs = async (targetId: string, pageNum: number, reset = false) => {
    setLoadingAppt(true);
    const from = pageNum * 5;
    const to = from + 4;

    try {
      const { data, error } = await supabase
        .from('wombcare_appointments')
        .select('*')
        .eq('user_id', targetId)
        .order('appointment_date', { ascending: false })
        .range(from, to);

      if (error) throw error;

      const newAppts = data || [];
      if (reset) {
        setAppointments(newAppts);
      } else {
        setAppointments(prev => [...prev, ...newAppts]);
      }
      setApptPage(pageNum + 1);
      setHasMoreAppt(newAppts.length === 5);
    } catch (err) {
      console.error('Error fetching appts:', err);
    } finally {
      setLoadingAppt(false);
    }
  };

  const fetchMealLogs = async (targetId: string, pageNum: number, reset = false) => {
    setLoadingMeals(true);
    const from = pageNum * 5;
    const to = from + 4;

    try {
      const { data, error } = await supabase
        .from('wombcare_meal_logs')
        .select('*')
        .eq('user_id', targetId)
        .order('date', { ascending: false })
        .range(from, to);

      if (error) throw error;

      const newMeals = data || [];
      if (reset) {
        setMealLogs(newMeals);
      } else {
        setMealLogs(prev => [...prev, ...newMeals]);
      }
      setMealPage(pageNum + 1);
      setHasMoreMeals(newMeals.length === 5);
    } catch (err) {
      console.error('Error fetching meals:', err);
    } finally {
      setLoadingMeals(false);
    }
  };

  const handleUpdatePatientAndProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Update patient profile
      const { error: patientErr } = await supabase
        .from('patients')
        .update({
          name: form.name,
          email: form.email,
          phone: form.phone,
          age: Number(form.age),
          weight: Number(form.weight),
          cycle_regular: form.cycleRegularity,
          symptoms: form.symptoms,
          country: form.country
        })
        .eq('id', patientId);

      if (patientErr) throw patientErr;

      // Update wombcare_user_profiles if exists
      if (profile) {
        const { error: profileErr } = await supabase
          .from('wombcare_user_profiles')
          .update({
            active_plan: profileForm.active_plan,
            plan_status: profileForm.plan_status,
            wellness_goal: profileForm.wellness_goal,
            wellness_score: Number(profileForm.wellness_score) || 0,
            doctor_note: profileForm.doctor_note
          })
          .eq('id', profile.id);

        if (profileErr) throw profileErr;
      }

      alert('Patient and wellness profile updated successfully!');
      await loadData();
    } catch (err: any) {
      alert('Failed to update: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleAddPeriodLog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLog.start_date || !newLog.end_date) return;
    setLoggingPeriod(true);

    const targetUserId = profile?.id || patientId;
    try {
      const { error } = await supabase
        .from('wombcare_period_history')
        .insert([{
          user_id: targetUserId,
          start_date: newLog.start_date,
          end_date: newLog.end_date,
          symptoms: newLog.symptoms,
          notes: newLog.notes
        }]);

      if (error) throw error;
      
      setNewLog({ start_date: '', end_date: '', symptoms: [], notes: '' });
      await loadData();
    } catch (err: any) {
      alert('Failed to log period cycle: ' + err.message);
    } finally {
      setLoggingPeriod(false);
    }
  };

  const handleDeletePeriodLog = async (logId: string) => {
    if (!confirm('Are you sure you want to delete this period log?')) return;
    try {
      const { error } = await supabase
        .from('wombcare_period_history')
        .delete()
        .eq('id', logId);

      if (error) throw error;
      await loadData();
    } catch (err: any) {
      alert('Failed to delete log: ' + err.message);
    }
  };

  const toggleSymptom = (sym: string) => {
    const list = [...newLog.symptoms];
    const idx = list.indexOf(sym);
    if (idx > -1) {
      list.splice(idx, 1);
    } else {
      list.push(sym);
    }
    setNewLog({ ...newLog, symptoms: list });
  };

  // Helper calculations for sophisticated SVG Graphs
  const calculateCycleLengths = () => {
    if (periodLogs.length < 2) return [];
    const lengths = [];
    for (let i = 1; i < periodLogs.length; i++) {
      const prev = new Date(periodLogs[i-1].start_date);
      const curr = new Date(periodLogs[i].start_date);
      const diffTime = Math.abs(curr.getTime() - prev.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      lengths.push({
        date: periodLogs[i].start_date,
        length: diffDays
      });
    }
    return lengths;
  };

  const calculateFlowDurations = () => {
    return periodLogs.map(log => {
      const start = new Date(log.start_date);
      const end = new Date(log.end_date);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      return {
        date: log.start_date,
        duration: diffDays
      };
    });
  };

  const cycleLengths = calculateCycleLengths();
  const flowDurations = calculateFlowDurations();

  const handleFilterChange = (mood: string, symptom: string) => {
    setFilterMood(mood);
    setFilterSymptom(symptom);
    const targetId = profile?.id || patientId;
    fetchHistoryLogs(targetId, 0, true, mood, symptom);
  };

  const loadMoreHistory = () => {
    const targetId = profile?.id || patientId;
    fetchHistoryLogs(targetId, historyPage, false, filterMood, filterSymptom);
  };

  const loadMoreAppointments = () => {
    const targetId = profile?.id || patientId;
    fetchApptLogs(targetId, apptPage, false);
  };

  const loadMoreMeals = () => {
    const targetId = profile?.id || patientId;
    fetchMealLogs(targetId, mealPage, false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FBF6EF] flex flex-col justify-between">
        <FloatingNavbarComponent />
        <div className="flex-1 flex flex-col items-center justify-center py-40">
          <Loader2 className="w-10 h-10 animate-spin text-pink-600 mb-4" />
          <p className="text-slate-500 font-semibold">Loading clinical database profiles...</p>
        </div>
        <FooterComponent />
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="min-h-screen bg-[#FBF6EF] flex flex-col justify-between">
        <FloatingNavbarComponent />
        <div className="flex-1 flex flex-col items-center justify-center py-40 text-slate-500">
          <ChevronRight className="w-16 h-16 text-slate-300 mb-4 rotate-180" />
          <h2 className="text-2xl font-bold text-slate-800">Patient Not Found</h2>
          <p className="mt-2 text-slate-400">The patient ID does not match any care profile.</p>
        </div>
        <FooterComponent />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBF6EF] font-sans flex flex-col justify-between">
      <FloatingNavbarComponent />

      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-28 space-y-8">
        {/* Back and Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <button 
            onClick={() => router.push('/wombcare-admin-9984?tab=patients')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 rounded-xl text-slate-600 font-semibold border border-slate-100 shadow-sm self-start transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Directory
          </button>
          
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-pink-500" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Patient Care Hub</h1>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex gap-2 border-b border-slate-200 pb-px overflow-x-auto">
          {[
            { id: 'profile', label: 'Clinical Bio & Profile', icon: Activity },
            { id: 'cycle', label: 'Cycle & Flow History', icon: Calendar },
            { id: 'rhythm', label: 'Daily Rhythm & Habits', icon: Clock },
            { id: 'care', label: 'Appointments & Care Plan', icon: CheckSquare }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`flex items-center gap-2 px-5 py-3 border-b-2 font-bold text-sm transition whitespace-nowrap ${
                activeSubTab === tab.id 
                  ? 'border-pink-500 text-pink-600' 
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {activeSubTab === 'profile' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* LEFT: Profile Form */}
            <div className="lg:col-span-8 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
              <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-3">Edit Patient & Wellness profile</h2>
              
              <form onSubmit={handleUpdatePatientAndProfile} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-500">Name</label>
                    <input 
                      type="text" 
                      value={form.name} 
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      required
                      className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-800 text-sm focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-500">Email</label>
                    <input 
                      type="email" 
                      value={form.email} 
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      required
                      className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-800 text-sm focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-500">Phone</label>
                    <input 
                      type="text" 
                      value={form.phone} 
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      required
                      className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-800 text-sm focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-500">Country</label>
                    <input 
                      type="text" 
                      value={form.country} 
                      onChange={(e) => setForm({ ...form, country: e.target.value })}
                      required
                      className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-800 text-sm focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-500">Age</label>
                    <input 
                      type="number" 
                      value={form.age} 
                      onChange={(e) => setForm({ ...form, age: Number(e.target.value) })}
                      required
                      className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-800 text-sm focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-500">Weight (kg)</label>
                    <input 
                      type="number" 
                      value={form.weight} 
                      onChange={(e) => setForm({ ...form, weight: Number(e.target.value) })}
                      required
                      className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-800 text-sm focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                </div>

                {profile && (
                  <div className="border-t border-slate-100 pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-500">Active Program Plan</label>
                      <input 
                        type="text" 
                        value={profileForm.active_plan} 
                        onChange={(e) => setProfileForm({ ...profileForm, active_plan: e.target.value })}
                        className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-800 text-sm focus:ring-2 focus:ring-pink-500"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-500">Plan Status</label>
                      <select 
                        value={profileForm.plan_status} 
                        onChange={(e) => setProfileForm({ ...profileForm, plan_status: e.target.value })}
                        className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-800 text-sm focus:ring-2 focus:ring-pink-500"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="paused">Paused</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-500">Wellness Goal</label>
                      <input 
                        type="text" 
                        value={profileForm.wellness_goal} 
                        onChange={(e) => setProfileForm({ ...profileForm, wellness_goal: e.target.value })}
                        className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-800 text-sm focus:ring-2 focus:ring-pink-500"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-500">Wellness Score (0-100)</label>
                      <input 
                        type="number" 
                        value={profileForm.wellness_score} 
                        onChange={(e) => setProfileForm({ ...profileForm, wellness_score: Number(e.target.value) })}
                        className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-800 text-sm focus:ring-2 focus:ring-pink-500"
                      />
                    </div>
                  </div>
                )}

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500">Cycle Regularity</label>
                  <input 
                    type="text" 
                    value={form.cycleRegularity} 
                    onChange={(e) => setForm({ ...form, cycleRegularity: e.target.value })}
                    className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-800 text-sm focus:ring-2 focus:ring-pink-500"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500">Reported Symptoms</label>
                  <textarea 
                    value={form.symptoms} 
                    onChange={(e) => setForm({ ...form, symptoms: e.target.value })}
                    rows={3}
                    className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-800 text-sm focus:ring-2 focus:ring-pink-500"
                  />
                </div>

                {profile && (
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-500">Clinical & Doctor Notes</label>
                    <textarea 
                      value={profileForm.doctor_note} 
                      onChange={(e) => setProfileForm({ ...profileForm, doctor_note: e.target.value })}
                      rows={3}
                      className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-800 text-sm focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                )}

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition disabled:opacity-50 text-sm"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Save All Profile Changes
                </button>
              </form>
            </div>

            {/* RIGHT: Stats Summary Card */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                <h3 className="font-bold text-slate-800 border-b border-slate-100 pb-2">Active Care Bio</h3>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-pink-50 flex items-center justify-center text-pink-600 font-bold shrink-0">
                    {patient.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{patient.name}</h4>
                    <span className="text-[10px] font-bold text-purple-600 uppercase">Age {patient.age} • {patient.weight}kg</span>
                  </div>
                </div>

                <div className="space-y-2.5 pt-2 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="truncate">{patient.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{patient.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{patient.country || 'India'}</span>
                  </div>
                </div>
              </div>

              {profile && (
                <div className="bg-gradient-to-tr from-purple-500 to-indigo-600 p-6 rounded-3xl text-white shadow-md space-y-4">
                  <h3 className="font-bold border-b border-white/20 pb-2">App Wellness Dashboard</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-[10px] opacity-75 uppercase block">Plan Level</span>
                      <strong className="text-sm uppercase tracking-wider">{profile.active_plan}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] opacity-75 uppercase block">Status</span>
                      <strong className="text-sm uppercase tracking-wider">{profile.plan_status}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] opacity-75 uppercase block">BMI</span>
                      <strong className="text-sm">{profile.bmi || '—'}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] opacity-75 uppercase block">Wellness Score</span>
                      <strong className="text-sm">{profile.wellness_score || '—'}/100</strong>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeSubTab === 'cycle' && (
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
              <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-3">Cycle & Flow Analytics</h2>

              {periodLogs.length === 0 ? (
                <div className="py-20 text-center text-slate-400">
                  <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <p>No cycle history recorded yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Flow Duration Bar Chart (SVG) */}
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Flow Days</h3>
                    <div className="w-full">
                      <svg viewBox="0 0 500 220" className="w-full h-auto overflow-visible">
                        {/* Grid lines */}
                        {[2, 4, 6, 8, 10].map((val) => {
                          const y = 170 - (val / 10) * 140;
                          return (
                            <g key={val}>
                              <line x1="40" y1={y} x2="480" y2={y} stroke="#E2E8F0" strokeDasharray="4" />
                              <text x="15" y={y + 4} className="text-[10px] fill-slate-400 font-mono font-semibold">{val}d</text>
                            </g>
                          );
                        })}
                        {/* X Axis line */}
                        <line x1="40" y1="170" x2="480" y2="170" stroke="#CBD5E1" strokeWidth="1.5" />
                        
                        {/* Bars */}
                        {flowDurations.map((fd, idx) => {
                          const numBars = flowDurations.length;
                          const barWidth = Math.max(12, Math.min(28, 380 / numBars));
                          const spacing = (440 - barWidth) / (numBars - 1 || 1);
                          const x = 40 + idx * spacing;
                          const barHeight = (fd.duration / 10) * 140;
                          const y = 170 - barHeight;
                          const formattedDate = new Date(fd.date).toLocaleDateString(undefined, {month:'short', day:'numeric'});

                          return (
                            <g key={idx} className="group cursor-pointer">
                              <title>{fd.duration} days ({new Date(fd.date).toLocaleDateString()})</title>
                              <rect 
                                x={x} 
                                y={y} 
                                width={barWidth} 
                                height={barHeight} 
                                fill="url(#flowGradient)" 
                                rx="4"
                                className="transition-all duration-300 hover:fill-rose-500"
                              />
                              <text 
                                x={x + barWidth / 2} 
                                y="185" 
                                textAnchor="middle" 
                                className="text-[8px] fill-slate-500 font-mono font-medium"
                                transform={`rotate(-35, ${x + barWidth / 2}, 185)`}
                              >
                                {formattedDate}
                              </text>
                            </g>
                          );
                        })}

                        {/* Gradients */}
                        <defs>
                          <linearGradient id="flowGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#FB7185" />
                            <stop offset="100%" stopColor="#FDA4AF" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>
                  </div>

                  {/* Cycle Length Line Chart (SVG) */}
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Cycle Length (Days)</h3>
                    {cycleLengths.length === 0 ? (
                      <div className="h-44 flex items-center justify-center text-slate-400 text-xs italic">
                        Requires at least 2 logged cycles to compute intervals.
                      </div>
                    ) : (
                      <div className="w-full">
                        <svg viewBox="0 0 500 220" className="w-full h-auto overflow-visible">
                          {/* Grid lines */}
                          {[15, 30, 45, 60].map((val) => {
                            const y = 170 - (val / 60) * 140;
                            return (
                              <g key={val}>
                                <line x1="40" y1={y} x2="480" y2={y} stroke="#E2E8F0" strokeDasharray="4" />
                                <text x="15" y={y + 4} className="text-[10px] fill-slate-400 font-mono font-semibold">{val}d</text>
                              </g>
                            );
                          })}
                          {/* X Axis line */}
                          <line x1="40" y1="170" x2="480" y2="170" stroke="#CBD5E1" strokeWidth="1.5" />

                          {/* Line Path */}
                          {(() => {
                            const numPoints = cycleLengths.length;
                            const spacing = 420 / (numPoints - 1 || 1);
                            const points = cycleLengths.map((cl, idx) => {
                              const x = 40 + idx * spacing;
                              const y = 170 - (cl.length / 60) * 140;
                              return { x, y };
                            });

                            const dLine = points.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
                            const dArea = `${dLine} L ${points[points.length - 1].x} 170 L ${points[0].x} 170 Z`;

                            return (
                              <g>
                                <path d={dArea} fill="url(#cycleAreaGradient)" opacity="0.15" />
                                <path d={dLine} fill="none" stroke="#8B5CF6" strokeWidth="3" strokeLinecap="round" />
                                {cycleLengths.map((cl, idx) => {
                                  const p = points[idx];
                                  const formattedDate = new Date(cl.date).toLocaleDateString(undefined, {month:'short', day:'numeric'});
                                  return (
                                    <g key={idx} className="group cursor-pointer">
                                      <title>{cl.length} days ({new Date(cl.date).toLocaleDateString()})</title>
                                      <circle 
                                        cx={p.x} 
                                        cy={p.y} 
                                        r="6" 
                                        fill="#7C3AED" 
                                        stroke="#FFFFFF" 
                                        strokeWidth="2"
                                        className="transition-all duration-300 hover:r-8 hover:fill-purple-800"
                                      />
                                      <text 
                                        x={p.x} 
                                        y="185" 
                                        textAnchor="middle" 
                                        className="text-[8px] fill-slate-500 font-mono font-medium"
                                        transform={`rotate(-35, ${p.x}, 185)`}
                                      >
                                        {formattedDate}
                                      </text>
                                    </g>
                                  );
                                })}
                              </g>
                            );
                          })()}

                          {/* Gradients */}
                          <defs>
                            <linearGradient id="cycleAreaGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#A78BFA" />
                              <stop offset="100%" stopColor="#DDD6FE" stopOpacity="0" />
                            </linearGradient>
                          </defs>
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Logs List */}
              <div className="lg:col-span-7 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-3">Cycle Logs history</h2>
                {periodLogs.length === 0 ? (
                  <p className="text-sm text-slate-400 italic">No cycle logs.</p>
                ) : (
                  <div className="space-y-3">
                    {periodLogs.map(log => {
                      const dur = Math.ceil(Math.abs(new Date(log.end_date).getTime() - new Date(log.start_date).getTime()) / (1000 * 60 * 60 * 24)) + 1;
                      return (
                        <div key={log.id} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-slate-800">
                                {new Date(log.start_date).toLocaleDateString()} — {new Date(log.end_date).toLocaleDateString()}
                              </span>
                              <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-pink-50 text-pink-700">
                                {dur} Days
                              </span>
                            </div>
                            {log.symptoms && log.symptoms.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1.5">
                                {log.symptoms.map(s => (
                                  <span key={s} className="px-1.5 py-0.5 bg-slate-200 text-slate-600 rounded text-[9px] font-semibold">{s}</span>
                                ))}
                              </div>
                            )}
                          </div>
                          <button
                            onClick={() => handleDeletePeriodLog(log.id)}
                            className="p-2 text-rose-500 hover:text-rose-700 rounded-lg hover:bg-rose-50 transition shrink-0"
                          >
                            <Trash className="w-4 h-4" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Form */}
              <div className="lg:col-span-5 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-3">Log Menstrual Period</h2>
                <form onSubmit={handleAddPeriodLog} className="space-y-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">Start Date</label>
                    <input 
                      type="date" 
                      value={newLog.start_date}
                      onChange={(e) => setNewLog({ ...newLog, start_date: e.target.value })}
                      required
                      className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm text-slate-800 focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">End Date</label>
                    <input 
                      type="date" 
                      value={newLog.end_date}
                      onChange={(e) => setNewLog({ ...newLog, end_date: e.target.value })}
                      required
                      className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm text-slate-800 focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">Symptoms</label>
                    <div className="grid grid-cols-2 gap-2 mt-1">
                      {['Cramps', 'Bloating', 'Headache', 'Mood Swings', 'Fatigue', 'Acne'].map(sym => {
                        const isChecked = newLog.symptoms.includes(sym);
                        return (
                          <button
                            key={sym}
                            type="button"
                            onClick={() => toggleSymptom(sym)}
                            className={`px-3 py-2 rounded-xl text-xs font-semibold border transition ${
                              isChecked 
                                ? 'bg-pink-500 border-pink-500 text-white' 
                                : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                            }`}
                          >
                            {sym}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={loggingPeriod}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition text-sm"
                  >
                    {loggingPeriod ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                    Log Cycle
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {activeSubTab === 'rhythm' && (
          <div className="space-y-6 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 gap-4">
              <h2 className="text-lg font-bold text-slate-800">Daily Rhythm & Habit Logs</h2>
              <div className="flex gap-3 flex-wrap">
                <select 
                  value={filterMood} 
                  onChange={(e) => handleFilterChange(e.target.value, filterSymptom)}
                  className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 outline-none focus:ring-1 focus:ring-pink-500"
                >
                  <option value="all">All Moods</option>
                  <option value="Happy">Happy</option>
                  <option value="Energetic">Energetic</option>
                  <option value="Sad">Sad</option>
                  <option value="Tired">Tired</option>
                  <option value="Irritable">Irritable</option>
                  <option value="Anxious">Anxious</option>
                </select>

                <select 
                  value={filterSymptom} 
                  onChange={(e) => handleFilterChange(filterMood, e.target.value)}
                  className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 outline-none focus:ring-1 focus:ring-pink-500"
                >
                  <option value="all">All Symptoms</option>
                  <option value="Cramps">Cramps</option>
                  <option value="Bloating">Bloating</option>
                  <option value="Headache">Headache</option>
                  <option value="Mood Swings">Mood Swings</option>
                  <option value="Fatigue">Fatigue</option>
                  <option value="Acne">Acne</option>
                </select>
              </div>
            </div>

            {historyLogs.length === 0 ? (
              <div className="py-20 text-center text-slate-400">
                <Clock className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p>No rhythm logs found matching the filter criteria.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {historyLogs.map(log => (
                  <div key={log.id} className="p-5 bg-slate-50 border border-slate-100 rounded-2xl space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <span className="font-bold text-slate-800">{new Date(log.date).toLocaleDateString()}</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Cycle Day {log.cycle_day || '—'}</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                      <div className="flex items-center gap-2">
                        <Moon className="w-4 h-4 text-indigo-500 shrink-0" />
                        <span>Sleep: <strong>{log.sleep} hrs</strong></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Droplets className="w-4 h-4 text-blue-500 shrink-0" />
                        <span>Water: <strong>{log.water_intake} L</strong></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Smile className="w-4 h-4 text-amber-500 shrink-0" />
                        <span>Mood: <strong>{log.mood || '—'}</strong></span>
                      </div>
                      {log.symptoms && log.symptoms.length > 0 && (
                        <div className="flex items-center gap-2">
                          <Activity className="w-4 h-4 text-pink-500 shrink-0" />
                          <span className="truncate">Symptoms: <strong>{log.symptoms.join(', ')}</strong></span>
                        </div>
                      )}
                    </div>

                    {log.journal && (
                      <div className="bg-white p-3 rounded-xl border border-slate-100 text-xs text-slate-600 flex gap-2">
                        <BookOpen className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                        <p className="italic">"{log.journal}"</p>
                      </div>
                    )}
                  </div>
                ))}

                {hasMoreHistory && (
                  <button
                    onClick={loadMoreHistory}
                    disabled={loadingHistory}
                    className="w-full py-3 border border-slate-200 rounded-2xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loadingHistory ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Loading more rhythm logs...
                      </>
                    ) : (
                      'Load More Logs'
                    )}
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {activeSubTab === 'care' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Appointments */}
            <div className="lg:col-span-6 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-3 mb-4">Consultations & Sessions</h2>
                {appointments.length === 0 ? (
                  <p className="text-sm text-slate-400 italic">No consultations scheduled.</p>
                ) : (
                  <div className="space-y-3">
                    {appointments.map(appt => (
                      <div key={appt.id} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex justify-between items-start gap-4">
                        <div>
                          <h4 className="font-bold text-slate-800">Dr. {appt.doctor_name}</h4>
                          <p className="text-xs text-slate-500">{new Date(appt.appointment_date).toLocaleString()}</p>
                          {appt.notes && <p className="text-xs text-slate-600 mt-2 bg-white p-2 rounded-xl border border-slate-100">"{appt.notes}"</p>}
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                          appt.status === 'completed' ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'
                        }`}>
                          {appt.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {hasMoreAppt && appointments.length > 0 && (
                <button
                  onClick={loadMoreAppointments}
                  disabled={loadingAppt}
                  className="w-full mt-4 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loadingAppt ? (
                    <>
                      <Loader2 className="w-3 h-3 animate-spin" />
                      Loading appointments...
                    </>
                  ) : (
                    'Load More Sessions'
                  )}
                </button>
              )}
            </div>

            {/* Meal Logs / Wellness Chart */}
            <div className="lg:col-span-6 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-3 mb-4">Diet Plan Compliance</h2>
                {mealLogs.length === 0 ? (
                  <p className="text-sm text-slate-400 italic">No meal logging history found.</p>
                ) : (
                  <div className="space-y-3">
                    {mealLogs.map(log => (
                      <div key={log.id} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex justify-between items-center gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <Utensils className="w-4 h-4 text-slate-400" />
                            <h4 className="font-bold text-sm text-slate-800">{log.meal_name}</h4>
                          </div>
                          <p className="text-[10px] text-slate-400 font-mono mt-1">{new Date(log.date).toLocaleDateString()}</p>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                          log.status === 'completed' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {log.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {hasMoreMeals && mealLogs.length > 0 && (
                <button
                  onClick={loadMoreMeals}
                  disabled={loadingMeals}
                  className="w-full mt-4 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loadingMeals ? (
                    <>
                      <Loader2 className="w-3 h-3 animate-spin" />
                      Loading meals...
                    </>
                  ) : (
                    'Load More Meals'
                  )}
                </button>
              )}
            </div>
          </div>
        )}

      </main>

      <FooterComponent />
    </div>
  );
}
