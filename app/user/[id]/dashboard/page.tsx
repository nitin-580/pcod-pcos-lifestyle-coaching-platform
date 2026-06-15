'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getPublicApiBase } from '@/lib/api-config';
import { supabase } from '@/lib/supabase-client';
import FloatingNavbar from '@/components/FloatingNavbar';
import Footer from '@/components/Footer';
import DietScreen from '@/screens/diet/DietScreen';

// Icons
import {
  Sparkles,
  Activity,
  Calendar,
  Coffee,
  Moon,
  BookOpen,
  Tv,
  Send,
  Heart,
  Smile,
  Clock,
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
  RefreshCw,
  FileText,
  CheckCircle2,
  Lock,
  User,
  Info,
  Play,
  Video,
  ListFilter,
  Check,
  X,
  ShieldAlert
} from 'lucide-react';

interface ChatMessage {
  id: string;
  classId: string;
  userId: string;
  senderName: string;
  senderRole: 'user' | 'doctor' | 'admin';
  message: string;
  createdAt: string;
}

interface PeriodHistoryItem {
  id: string;
  startDate: string;
  endDate?: string;
  notes?: string;
}

interface HistoryLog {
  date: string;
  waterIntake: number;
  sleep: number;
  mood: string;
  journal?: string;
}

interface WellnessClass {
  id: string;
  title: string;
  description: string;
  type: 'live' | 'recorded';
  thumbnailUrl: string;
  videoUrl: string;
  youtubeVideoId?: string;
  googleMeetLink?: string;
  scheduledAt?: string;
  instructorName: string;
  duration: number;
  categoryId: string;
  isActive: boolean;
  tags?: string[];
}

export default function UserDashboardPage() {
  const params = useParams();
  const userId = params.id as string;

  // Active View Tabs: 'tracker', 'classes', or 'nutrition'
  const [activeTab, setActiveTab] = useState<'tracker' | 'classes' | 'nutrition'>('tracker');

  // Core Data States
  const [profile, setProfile] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [periodHistory, setPeriodHistory] = useState<PeriodHistoryItem[]>([]);
  const [profileHistory, setProfileHistory] = useState<HistoryLog[]>([]);
  const [dietPlan, setDietPlan] = useState<any>(null);
  const [isDietViewOpen, setIsDietViewOpen] = useState(false);
  
  // Wellness Classes States
  const [allClasses, setAllClasses] = useState<WellnessClass[]>([]);
  const [classesLoading, setClassesLoading] = useState(true);
  const [selectedClassFilter, setSelectedClassFilter] = useState<'all' | 'live' | 'recorded'>('all');
  
  // App states
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Period calendar States
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<string | null>(null);

  // Active playing Class & Chat States
  const [liveClass, setLiveClass] = useState<WellnessClass | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatSending, setChatSending] = useState(false);
  const [chatConnection, setChatConnection] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');

  // Input edits
  const [journalInput, setJournalInput] = useState('');
  const [isSavingJournal, setIsSavingJournal] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Trigger brief alert toasts
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  /* =========================================================
     API DATA ORCHESTRATION
     ========================================================= */

  const fetchProfile = useCallback(async () => {
    try {
      const token = localStorage.getItem('userToken');
      const res = await fetch(`${getPublicApiBase()}/profiles/${userId}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (data.success) {
        setProfile(data.data);
        setJournalInput(data.data.journal || '');
      } else {
        setError(data.message || 'Failed to load profile');
      }
    } catch (err) {
      console.error('Fetch profile error:', err);
      setError('Connection failed');
    }
  }, [userId]);

  const fetchAppointments = useCallback(async () => {
    try {
      const token = localStorage.getItem('userToken');
      const res = await fetch(`${getPublicApiBase()}/appointments/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setAppointments(data.data);
      }
    } catch (err) {
      console.error('Fetch appointments error:', err);
    }
  }, [userId]);

  const fetchPeriodHistory = useCallback(async () => {
    try {
      const token = localStorage.getItem('userToken');
      const res = await fetch(`${getPublicApiBase()}/profiles/${userId}/period/history`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setPeriodHistory(data.data);
      }
    } catch (err) {
      console.error('Fetch period history error:', err);
    }
  }, [userId]);

  const fetchProfileHistory = useCallback(async () => {
    try {
      const token = localStorage.getItem('userToken');
      const res = await fetch(`${getPublicApiBase()}/profiles/${userId}/history`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setProfileHistory(data.data);
      }
    } catch (err) {
      console.error('Fetch profile history error:', err);
    }
  }, [userId]);

  const fetchClassesData = useCallback(async () => {
    try {
      setClassesLoading(true);
      const token = localStorage.getItem('userToken');
      
      // 1. Fetch all classes
      const allRes = await fetch(`${getPublicApiBase()}/classes`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const allData = await allRes.json();
      let fetchedClasses: WellnessClass[] = [];
      if (allData.success && Array.isArray(allData.data)) {
        fetchedClasses = allData.data;
        setAllClasses(fetchedClasses);
      }

      // 2. Fetch Placements to find active live Link 1
      const placementRes = await fetch(`${getPublicApiBase()}/classes/placements`);
      const placementResult = await placementRes.json();
      let resolvedClass = null;

      if (placementResult.success && Array.isArray(placementResult.data)) {
        const placement = placementResult.data.find((p: any) => p.label === 'Link 1');
        if (placement && placement.class) {
          resolvedClass = placement.class;
        }
      }

      // Fallback: use first active live class from array
      if (!resolvedClass) {
        resolvedClass = fetchedClasses.find(c => c.type === 'live' && c.isActive) || null;
      }

      // Final fallback: use first recorded class from array as initial player screen
      if (!resolvedClass && fetchedClasses.length > 0) {
        resolvedClass = fetchedClasses[0];
      }

      setLiveClass(resolvedClass);
    } catch (err) {
      console.error('Fetch classes error:', err);
    } finally {
      setClassesLoading(false);
    }
  }, []);

  const fetchDietPlan = useCallback(async () => {
    try {
      const token = localStorage.getItem('userToken');
      const res = await fetch(`${getPublicApiBase()}/diet-plans/user/${userId}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        setDietPlan(data.data);
      }
    } catch (err) {
      console.error('Error fetching diet plan:', err);
    }
  }, [userId]);

  // Combined Refresh
  const refreshData = useCallback(async () => {
    setIsLoading(true);
    await Promise.all([
      fetchProfile(),
      fetchAppointments(),
      fetchPeriodHistory(),
      fetchProfileHistory(),
      fetchClassesData(),
      fetchDietPlan()
    ]);
    setIsLoading(false);
  }, [fetchProfile, fetchAppointments, fetchPeriodHistory, fetchProfileHistory, fetchClassesData, fetchDietPlan]);

  useEffect(() => {
    const savedData = localStorage.getItem('userData');
    if (savedData) setUserData(JSON.parse(savedData));
    refreshData();
  }, [refreshData]);

  // Patch profile helper (water, sleep, mood)
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
        // Update history cache so graphs re-render instantly
        const todayStr = new Date().toISOString().split('T')[0];
        setProfileHistory(prev => {
          const exists = prev.findIndex(p => p.date === todayStr);
          if (exists > -1) {
            const updated = [...prev];
            updated[exists] = { ...updated[exists], ...updates };
            return updated;
          }
          return [{ date: todayStr, waterIntake: 0, sleep: 0, mood: '', ...updates }, ...prev];
        });
      }
    } catch (err) {
      console.error('Update profile error:', err);
      showToast('Hormone synchronization failed.');
    } finally {
      setIsUpdating(false);
    }
  };

  /* =========================================================
     LIVE CHAT SOCKET MANAGEMENT (SUPABASE)
     ========================================================= */

  useEffect(() => {
    if (!liveClass || activeTab !== 'classes') return;

    let channel: any;
    const connectToClassChat = async () => {
      try {
        setChatConnection('connecting');
        setChatMessages([]);
        const token = localStorage.getItem('userToken');

        // 1. Fetch past chat history for the class
        const chatHistoryRes = await fetch(`${getPublicApiBase()}/classes/${liveClass.id}/chat`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const chatHistoryData = await chatHistoryRes.json();
        if (chatHistoryData.success) {
          setChatMessages(chatHistoryData.data || []);
        }

        // 2. Setup Supabase changes listener
        if (supabase) {
          const channelName = `live-chat-${liveClass.id}-${Math.random().toString(36).substring(7)}`;
          channel = supabase
            .channel(channelName)
            .on(
              'postgres_changes',
              {
                event: 'INSERT',
                schema: 'public',
                table: 'wombcare_live_chats',
                filter: `class_id=eq.${liveClass.id}`,
              },
              (payload) => {
                const newMessage: ChatMessage = {
                  id: payload.new.id,
                  classId: payload.new.class_id,
                  userId: payload.new.user_id,
                  senderName: payload.new.sender_name,
                  senderRole: payload.new.sender_role,
                  message: payload.new.message,
                  createdAt: payload.new.created_at,
                };
                setChatMessages((prev) => {
                  if (prev.some((m) => m.id === newMessage.id)) return prev;
                  return [...prev, newMessage];
                });
              }
            )
            .subscribe((status) => {
              if (status === 'SUBSCRIBED') {
                setChatConnection('connected');
              } else {
                setChatConnection('disconnected');
              }
            });
        }
      } catch (err) {
        console.error('Chat initialization error:', err);
        setChatConnection('disconnected');
      }
    };

    connectToClassChat();

    return () => {
      if (channel && supabase) {
        supabase.removeChannel(channel);
      }
    };
  }, [liveClass, activeTab]);

  // Scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || chatSending || !liveClass) return;

    setChatSending(true);
    const messageContent = chatInput.trim();
    setChatInput('');

    try {
      const token = localStorage.getItem('userToken');
      const res = await fetch(`${getPublicApiBase()}/classes/${liveClass.id}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ message: messageContent })
      });
      const result = await res.json();
      if (!result.success) {
        console.error('Failed to submit message:', result.message);
      }
    } catch (err) {
      console.error('Send message error:', err);
    } finally {
      setChatSending(false);
    }
  };

  /* =========================================================
     CORRECT PERIOD TRACKER LOGIC
     ========================================================= */

  const startPeriod = async (dateStr: string) => {
    try {
      setIsUpdating(true);
      const token = localStorage.getItem('userToken');
      const res = await fetch(`${getPublicApiBase()}/profiles/${userId}/period/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ startDate: dateStr })
      });
      const result = await res.json();
      if (result.success) {
        showToast('Bleeding cycle registered! 🌸');
        await Promise.all([fetchProfile(), fetchPeriodHistory()]);
      }
    } catch (err) {
      console.error('Start period error:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  const endPeriod = async (dateStr: string) => {
    try {
      setIsUpdating(true);
      const token = localStorage.getItem('userToken');
      const res = await fetch(`${getPublicApiBase()}/profiles/${userId}/period/end`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ endDate: dateStr })
      });
      const result = await res.json();
      if (result.success) {
        showToast('Bleeding cycle closed safely! 🌿');
        await Promise.all([fetchProfile(), fetchPeriodHistory()]);
      }
    } catch (err) {
      console.error('End period error:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  // Date check helpers
  const getPeriodDayInfo = (dateStr: string) => {
    for (const cycle of periodHistory) {
      if (!cycle.startDate) continue;
      const start = new Date(cycle.startDate);
      start.setHours(0,0,0,0);
      const current = new Date(dateStr);
      current.setHours(0,0,0,0);

      if (!cycle.endDate) {
        if (current.getTime() === start.getTime()) return { isStart: true, isInCycle: true };
        continue;
      }

      const end = new Date(cycle.endDate);
      end.setHours(0,0,0,0);

      if (current.getTime() === start.getTime()) return { isStart: true, isInCycle: true };
      if (current.getTime() === end.getTime()) return { isEnd: true, isInCycle: true };
      if (current >= start && current <= end) return { isInCycle: true };
    }
    return null;
  };

  /* =========================================================
     COMPUTED DATA / ANALYTICS
     ========================================================= */

  const computedGrade = useMemo(() => {
    const score = profile?.wellnessScore || 85;
    if (score >= 90) return 'AA';
    if (score >= 82) return 'AB';
    if (score >= 75) return 'BB';
    if (score >= 65) return 'BC';
    if (score >= 55) return 'CC';
    return 'F';
  }, [profile?.wellnessScore]);

  // Dynamic cycle day based on start date
  const computedCycleDay = useMemo(() => {
    if (!profile?.cycleStartDate) return profile?.cycleDay || 1;
    const start = new Date(profile.cycleStartDate);
    const today = new Date();
    today.setHours(0,0,0,0);
    start.setHours(0,0,0,0);
    const diffTime = today.getTime() - start.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 ? (diffDays % (profile.cycleLength || 28)) + 1 : 1;
  }, [profile?.cycleStartDate, profile?.cycleLength, profile?.cycleDay]);

  const computedPhase = useMemo(() => {
    const day = computedCycleDay;
    if (day <= 5) return { name: 'Menstrual Phase', color: 'text-rose-500 bg-rose-50 border-rose-100', icon: '🩸', desc: 'Hormones are low. Prioritize rest, slow hydration, and iron-rich meals.' };
    if (day <= 14) return { name: 'Follicular & Ovulation', color: 'text-amber-600 bg-amber-50 border-amber-100', icon: '⚡', desc: 'Estrogen spikes. Maximum stamina, dynamic hydration, and metabolic strength.' };
    return { name: 'Luteal Phase', color: 'text-indigo-600 bg-indigo-50 border-indigo-100', icon: '🧘', desc: 'Progesterone climbs. Higher water retention, stable sleep, and steady energy flow.' };
  }, [computedCycleDay]);

  // Next appointment
  const nextAppointmentDisplay = useMemo(() => {
    if (appointments.length === 0) return 'No scheduled sessions';
    const future = appointments
      .filter(a => a.status === 'scheduled')
      .sort((a, b) => new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime())[0];
    
    if (!future) return 'No scheduled sessions';
    
    return new Date(future.appointmentDate).toLocaleString('en-US', {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  }, [appointments]);

  // Graph Data: Hydration levels over last 7 days
  const hydrationChartData = useMemo(() => {
    const days = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const str = d.toISOString().split('T')[0];
      const match = profileHistory.find(h => h.date === str);
      days.push({
        label: d.toLocaleDateString('en-US', { weekday: 'short' }),
        value: match ? match.waterIntake : (i === 0 ? (profile?.waterIntake || 0) : 0),
        target: profile?.targetWater || 8
      });
    }
    return days;
  }, [profileHistory, profile?.waterIntake, profile?.targetWater]);

  // Filtered classes library
  const filteredClasses = useMemo(() => {
    if (selectedClassFilter === 'all') return allClasses;
    return allClasses.filter(c => c.type === selectedClassFilter);
  }, [allClasses, selectedClassFilter]);

  // Save Journal
  const handleSaveJournal = async () => {
    setIsSavingJournal(true);
    await handleUpdateProfile({ journal: journalInput });
    setIsSavingJournal(false);
    showToast('Hormonal reflections archived! 📝');
  };

  // Bulletproof YouTube embed link resolver
  const getYoutubeEmbedId = (videoStr: string) => {
    if (!videoStr) return 'CqtlcsxK2Xw';
    
    // Trim whitespace
    const cleanUrl = videoStr.trim();
    
    // Check if it's already just an 11-character alphanumeric/underscore/dash ID
    if (/^[a-zA-Z0-9_-]{11}$/.test(cleanUrl)) {
      return cleanUrl;
    }
    
    // Regular expression to extract the ID from various YouTube URL formats
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/|live\/)([^#\&\?]*).*/;
    const match = cleanUrl.match(regExp);
    
    if (match && match[2] && match[2].length === 11) {
      return match[2];
    }
    
    // Fallback split methods
    if (cleanUrl.includes('/shorts/')) {
      return cleanUrl.split('/shorts/')[1]?.split('?')[0]?.split('&')[0] || 'CqtlcsxK2Xw';
    }
    if (cleanUrl.includes('/live/')) {
      return cleanUrl.split('/live/')[1]?.split('?')[0]?.split('&')[0] || 'CqtlcsxK2Xw';
    }
    if (cleanUrl.includes('youtube.com/embed/')) {
      return cleanUrl.split('embed/')[1]?.split('?')[0]?.split('&')[0] || 'CqtlcsxK2Xw';
    }
    if (cleanUrl.includes('v=')) {
      return cleanUrl.split('v=')[1]?.split('&')[0]?.split('?')[0] || 'CqtlcsxK2Xw';
    }
    if (cleanUrl.includes('youtu.be/')) {
      return cleanUrl.split('youtu.be/')[1]?.split('?')[0]?.split('&')[0] || 'CqtlcsxK2Xw';
    }
    
    return cleanUrl;
  };

  /* =========================================================
     CALENDAR GENERATOR
     ========================================================= */

  const calendarDays = useMemo(() => {
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
    const days = [];

    // Prepend padding cells
    for (let i = 0; i < firstDayIndex; i++) {
      days.push(null);
    }

    // Populate month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  }, [currentMonth, currentYear]);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const loggedMood = profile?.mood || '';

  const moodsList = [
    { label: 'Energetic', icon: '⚡' },
    { label: 'Happy', icon: '😊' },
    { label: 'Calm', icon: '🧘' },
    { label: 'Anxious', icon: '😰' },
    { label: 'Tired', icon: '😴' },
    { label: 'Crampy', icon: '😖' },
    { label: 'Bloated', icon: '🎈' },
    { label: 'Irritable', icon: '😤' },
  ];

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
    <main className="min-h-screen bg-[#FCFDFB] selection:bg-pink-100 text-slate-800">
      <FloatingNavbar />

      <section className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        
        {/* Toast Notification */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: -50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -50, scale: 0.95 }}
              className="fixed top-24 left-1/2 -translate-x-1/2 z-[999] px-6 py-3.5 bg-slate-900/95 backdrop-blur-md border border-slate-800 text-white rounded-full flex items-center gap-2.5 shadow-2xl text-xs font-bold uppercase tracking-wider"
            >
              <span className="w-2 h-2 rounded-full bg-pink-500 animate-ping" />
              {toastMessage}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Premium Header Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-[40px] bg-gradient-to-br from-[#FAFDF6] via-white to-[#FFF6F9] border border-slate-100 p-8 md:p-12 shadow-sm mt-8"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-pink-50/20 rounded-full blur-3xl -mr-20 -mt-20 shrink-0 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-50/20 rounded-full blur-2xl -ml-16 -mb-16 shrink-0 pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="max-w-2xl">
              <span className="inline-block px-4 py-1.5 rounded-full bg-pink-50 text-pink-600 text-xs font-bold tracking-[0.15em] uppercase mb-6 shadow-sm">
                Wellness Dashboard
              </span>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-[1.1] tracking-tight">
                Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">{profile?.name || userData?.name}</span>
              </h1>

              <p className="text-slate-500 mt-5 text-base md:text-lg font-medium max-w-lg leading-relaxed">
                Hormonal flow starts with daily consciousness. Here is how your telemetry and cycle state looks today.
              </p>

              <div className="mt-8 flex items-center gap-3">
                <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500/10 to-purple-500/10 text-pink-700 rounded-2xl border border-pink-100 shadow-sm">
                  <Sparkles className="w-4 h-4 text-pink-600" />
                  <span className="font-bold text-xs uppercase tracking-wider">PCOS Care Plan: Active</span>
                </div>
              </div>
            </div>

            {/* Circular Health Score Ring */}
            <div className="relative flex items-center justify-center shrink-0">
               <div className="w-36 h-36 md:w-44 md:h-44 rounded-full border-[10px] border-slate-50 flex flex-col items-center justify-center bg-white shadow-xl shadow-pink-100/50">
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Score Grade</p>
                  <h2 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-slate-900 to-slate-700 mt-0.5">
                    {computedGrade}
                  </h2>
                  <p className="text-[10px] text-pink-500 font-bold tracking-widest uppercase mt-1">wombcare</p>
               </div>
            </div>
          </div>
        </motion.div>

        {/* Sliding 3-View Tabs Controller */}
        <div className="mt-12 flex justify-center">
          <div className="relative p-1.5 bg-slate-100/80 backdrop-blur-lg rounded-[24px] flex gap-1 w-full max-w-lg shadow-inner border border-slate-200/50">
            <div 
              className="absolute top-1.5 bottom-1.5 left-1.5 rounded-[18px] bg-white shadow-md transition-all duration-300 pointer-events-none"
              style={{
                width: 'calc(33.33% - 6px)',
                transform: activeTab === 'tracker' ? 'translateX(0%)' : activeTab === 'nutrition' ? 'translateX(100%)' : 'translateX(200%)'
              }}
            />
            
            <button
              onClick={() => setActiveTab('tracker')}
              className={`flex-1 py-3.5 px-2 rounded-[18px] text-xs font-bold uppercase tracking-wider transition-all duration-300 z-10 flex items-center justify-center gap-1.5 ${
                activeTab === 'tracker' ? 'text-slate-900' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Activity className="w-4 h-4" />
              Health Space
            </button>

            <button
              onClick={() => setActiveTab('nutrition')}
              className={`flex-1 py-3.5 px-2 rounded-[18px] text-xs font-bold uppercase tracking-wider transition-all duration-300 z-10 flex items-center justify-center gap-1.5 ${
                activeTab === 'nutrition' ? 'text-slate-900' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Coffee className="w-4 h-4" />
              Nutrition Chart
            </button>

            <button
              onClick={() => setActiveTab('classes')}
              className={`flex-1 py-3.5 px-2 rounded-[18px] text-xs font-bold uppercase tracking-wider transition-all duration-300 z-10 flex items-center justify-center gap-1.5 ${
                activeTab === 'classes' ? 'text-slate-900' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Tv className="w-4 h-4" />
              Classes Hub
            </button>
          </div>
        </div>

        {/* Tab Animation Content wrapper */}
        <AnimatePresence mode="wait">
          
          {activeTab === 'tracker' && (
            <motion.div
              key="tracker-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
            >
              
              {/* Left Column (Trackers & Graphs) */}
              <div className="lg:col-span-8 space-y-8">
                
                {/* Visual Telemetry Graphs Panel */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  
                  {/* Hydration Bar History SVG */}
                  <div className="bg-white rounded-[32px] border border-slate-100 p-6 md:p-8 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <span className="text-[10px] font-bold tracking-widest text-blue-500 uppercase">H2O History</span>
                        <h3 className="text-xl font-bold text-slate-900">Hydration Trends</h3>
                      </div>
                      <Coffee className="w-5 h-5 text-blue-400" />
                    </div>

                    <div className="w-full flex items-end justify-between h-48 pt-4 pb-2 px-1 border-b border-slate-100">
                      {hydrationChartData.map((day, idx) => {
                        const maxVal = Math.max(...hydrationChartData.map(d => d.value), day.target, 1);
                        const pct = (day.value / maxVal) * 100;
                        return (
                          <div key={idx} className="flex flex-col items-center flex-1 gap-2.5 group">
                            <div className="relative w-7 bg-slate-50 rounded-full h-32 flex items-end justify-center overflow-hidden border border-slate-100">
                              <motion.div 
                                initial={{ height: 0 }}
                                animate={{ height: `${pct}%` }}
                                className="w-full rounded-full bg-gradient-to-t from-blue-500 to-sky-400"
                              />
                              <div className="absolute -top-7 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[9px] font-black rounded py-1 px-1.5 pointer-events-none whitespace-nowrap shadow-md z-20">
                                {day.value} gls
                              </div>
                            </div>
                            <span className="text-[10px] font-bold text-slate-400 tracking-tight">{day.label}</span>
                          </div>
                        );
                      })}
                    </div>
                    <div className="flex items-center gap-2 mt-4 text-[10px] font-semibold text-slate-500">
                      <span className="w-2 h-2 rounded-full bg-blue-400" />
                      Daily target: {profile?.targetWater || 8} glasses
                    </div>
                  </div>

                  {/* Hormonal Cycle Energy Wave SVG */}
                  <div className="bg-white rounded-[32px] border border-slate-100 p-6 md:p-8 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <span className="text-[10px] font-bold tracking-widest text-pink-500 uppercase">Bio Rhythms</span>
                        <h3 className="text-xl font-bold text-slate-900">Energy & Stamina</h3>
                      </div>
                      <Activity className="w-5 h-5 text-pink-400" />
                    </div>

                    <div className="relative w-full h-48 bg-slate-50/50 rounded-2xl border border-dashed border-slate-100 flex items-center justify-center p-2">
                      <svg viewBox="0 0 300 120" className="w-full h-full overflow-visible">
                        <defs>
                          <linearGradient id="waveGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#ec4899" stopOpacity="0.25" />
                            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.05" />
                          </linearGradient>
                        </defs>
                        {/* Wave Area Fill */}
                        <path 
                          d="M0,120 C40,40 100,10 150,30 C200,50 250,90 300,40 L300,120 L0,120 Z" 
                          fill="url(#waveGrad)" 
                        />
                        {/* Wave line */}
                        <path 
                          d="M0,120 C40,40 100,10 150,30 C200,50 250,90 300,40" 
                          fill="none" 
                          stroke="url(#waveGrad)" 
                          strokeWidth="3.5" 
                          strokeLinecap="round"
                        />
                        {/* Dynamic point representing current cycle day */}
                        {(() => {
                          const cycleDay = computedCycleDay;
                          const ratio = Math.min((cycleDay - 1) / (profile?.cycleLength || 28), 1);
                          const x = ratio * 300;
                          // approximate y based on wave logic
                          let y = 120 - (Math.sin(ratio * Math.PI) * 90 + 10);
                          if (ratio > 0.5) y = 40 + (Math.cos((ratio - 0.5) * Math.PI) * 50);
                          return (
                            <g>
                              <circle cx={x} cy={y} r="8" fill="#ec4899" className="animate-pulse" />
                              <circle cx={x} cy={y} r="3" fill="#ffffff" />
                              <text x={Math.max(x - 20, 10)} y={y - 12} fill="#ec4899" fontSize="8" fontWeight="bold">
                                Day {cycleDay}
                              </text>
                            </g>
                          );
                        })()}
                      </svg>
                    </div>

                    <div className="mt-4 flex items-center justify-between text-[11px] font-bold text-slate-500 bg-pink-50/30 p-2.5 rounded-xl border border-pink-100/30">
                      <span className="text-pink-600">Peak energy window: Days 10 - 15</span>
                      <span>Stamina: 82%</span>
                    </div>
                  </div>

                </div>

                {/* Primary Core Trackers: Period + Water */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  
                  {/* Premium Period Logger widget */}
                  <div className="bg-[#FAFDF8] rounded-[32px] p-6 md:p-8 border border-[#E0EDD4] shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center mb-6">
                        <div>
                          <span className="text-[10px] font-bold tracking-widest text-[#7CA851] uppercase">Cycle Control</span>
                          <h3 className="text-xl font-bold text-slate-900">Flow Tracker</h3>
                        </div>
                        <div className="w-10 h-6 rounded-full bg-[#E8F4DE] flex items-center px-1">
                          <div className="w-4 h-4 rounded-full bg-[#8EBC63]" />
                        </div>
                      </div>

                      {/* Center Day Circle */}
                      <div className="flex justify-center my-6">
                        <div className="relative w-48 h-48 rounded-full border-[6px] border-slate-100/80 bg-white flex flex-col items-center justify-center shadow-lg">
                          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Current state</span>
                          <h2 className="text-4xl font-extrabold text-slate-800 mt-1">Day {computedCycleDay}</h2>
                          <div className="mt-2.5 px-3 py-1 rounded-full text-[9px] font-extrabold tracking-wider uppercase border bg-white shadow-sm flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                            {computedPhase.name}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2 mt-4 p-3 rounded-2xl bg-white/70 border border-[#E9F3E1] text-xs">
                        <p className="text-slate-600 flex justify-between">
                          <span>Next Expected Period:</span>
                          <span className="font-bold text-slate-800">{profile?.nextPeriodDate || 'Calculating...'}</span>
                        </p>
                        <p className="text-slate-500 leading-relaxed pt-1.5 border-t border-slate-100">
                          {computedPhase.desc}
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-4">
                      <button
                        onClick={() => startPeriod(new Date().toISOString().split('T')[0])}
                        className="py-3 px-4 rounded-2xl bg-white hover:bg-slate-50 border border-slate-100 text-rose-500 font-bold text-xs uppercase tracking-wider shadow-sm hover:shadow transition"
                      >
                        Start Period 🩸
                      </button>
                      <button
                        onClick={() => endPeriod(new Date().toISOString().split('T')[0])}
                        className="py-3 px-4 rounded-2xl bg-[#8EBC63] hover:bg-[#80AA55] text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-green-100 hover:scale-[1.02] transition"
                      >
                        End Period 🌿
                      </button>
                    </div>
                  </div>

                  {/* Premium Hydration Tracker widget */}
                  <div className="bg-[#FAFDFE] rounded-[32px] p-6 md:p-8 border border-[#DFEDF2] shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center mb-6">
                        <div>
                          <span className="text-[10px] font-bold tracking-widest text-[#419BBF] uppercase">Intake System</span>
                          <h3 className="text-xl font-bold text-slate-900">Hydration tracker</h3>
                        </div>
                        <div className="w-10 h-6 rounded-full bg-[#E5F3F8] flex items-center px-1">
                          <div className="w-4 h-4 rounded-full bg-[#419BBF]" />
                        </div>
                      </div>

                      {/* Water Level Meter */}
                      <div className="flex justify-center my-6">
                        <div className="relative w-48 h-48 rounded-full border-[8px] border-blue-50/50 bg-white flex flex-col items-center justify-center overflow-hidden shadow-lg">
                          {/* Animated Wave simulation overlay */}
                          <div 
                            className="absolute bottom-0 left-0 right-0 bg-sky-200/40 transition-all duration-500 wave"
                            style={{ height: `${Math.min(((profile?.waterIntake || 0) / (profile?.targetWater || 8)) * 100, 100)}%` }}
                          />
                          <div className="relative z-10 flex flex-col items-center">
                            <span className="text-3xl">💧</span>
                            <h2 className="text-4xl font-extrabold text-slate-800 mt-1">{profile?.waterIntake || 0}</h2>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">of {profile?.targetWater || 8} glasses</p>
                          </div>
                        </div>
                      </div>

                      <p className="text-center text-slate-500 text-xs mt-4">
                        Consuming clean warm water balances gut biome and limits cortisol spikes.
                      </p>
                    </div>

                    <div className="mt-6 flex gap-4">
                      <button
                        onClick={() => handleUpdateProfile({ waterIntake: (profile?.waterIntake || 0) + 1, waterIntakeDate: new Date().toISOString() })}
                        className="flex-1 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 font-bold border border-slate-100 text-xs uppercase tracking-wider shadow-sm hover:shadow transition"
                      >
                        Add Glass 💧
                      </button>
                      {profile?.waterIntake > 0 && (
                        <button
                          onClick={() => handleUpdateProfile({ waterIntake: Math.max((profile?.waterIntake || 0) - 1, 0), waterIntakeDate: new Date().toISOString() })}
                          className="py-3.5 px-6 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-400 font-bold text-xs uppercase tracking-wider transition"
                        >
                          Undo
                        </button>
                      )}
                    </div>
                  </div>

                </div>

                {/* Recommended Diet Plan Card */}
                {dietPlan && (
                  <div className="bg-gradient-to-r from-purple-600 to-pink-500 rounded-[32px] p-8 text-white relative overflow-hidden shadow-xl shadow-purple-100/50">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
                    <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                      <div className="space-y-2">
                        <span className="inline-block px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-pink-200 bg-white/10 rounded-full border border-white/20">
                          Recommended Diet Plan
                        </span>
                        <h3 className="text-2xl font-black">{dietPlan.name || "PCOD + Ulcerative Colitis (UC) Diet"}</h3>
                        <p className="text-xs text-purple-100 font-medium max-w-md">
                          {dietPlan.description || "Hormonal Balance • Gut Healing • Healthy Weight Gain"}
                        </p>
                      </div>
                      <button
                        onClick={() => setIsDietViewOpen(true)}
                        className="px-6 py-3.5 bg-white hover:bg-purple-50 text-purple-700 font-extrabold text-xs uppercase tracking-wider rounded-2xl shadow-md transition-all hover:scale-[1.02] active:scale-100 shrink-0"
                      >
                        Open Diet Chart 🥗
                      </button>
                    </div>
                  </div>
                )}

                {/* Subordinate Trackers: Sleep log + Daily Reflections Journal */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  
                  {/* Sleep Log dial card */}
                  <div className="bg-white rounded-[32px] border border-slate-100 p-6 md:p-8 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <span className="text-[10px] font-bold tracking-widest text-indigo-500 uppercase">Sleep Dial</span>
                        <h3 className="text-xl font-bold text-slate-900">Sleep Telemetry</h3>
                      </div>
                      <Moon className="w-5 h-5 text-indigo-400" />
                    </div>

                    <div className="flex flex-col items-center justify-center p-4">
                      <div className="flex items-center gap-6 mb-6">
                        <button
                          onClick={() => handleUpdateProfile({ sleep: Math.max((profile?.sleep || 0) - 0.5, 0) })}
                          className="w-12 h-12 rounded-full border border-slate-100 bg-slate-50/50 hover:bg-slate-100 flex items-center justify-center text-slate-600 transition"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        
                        <div className="text-center">
                          <h2 className="text-4xl font-extrabold text-slate-800">{profile?.sleep || 0}</h2>
                          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mt-1 block">Hours logged</span>
                        </div>

                        <button
                          onClick={() => handleUpdateProfile({ sleep: Math.min((profile?.sleep || 0) + 0.5, 24) })}
                          className="w-12 h-12 rounded-full border border-slate-100 bg-slate-50/50 hover:bg-slate-100 flex items-center justify-center text-slate-600 transition"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="w-full bg-slate-50 rounded-2xl p-3 border border-slate-100/50 text-[11px] text-slate-500 leading-relaxed">
                        ⚠️ **Clinical Threshold**: Aim for 7.5 - 9 hours daily. Progesterone production peaks during non-REM deep sleep cycles.
                      </div>
                    </div>
                  </div>

                  {/* Daily check-in reflections journal */}
                  <div className="bg-white rounded-[32px] border border-slate-100 p-6 md:p-8 shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <span className="text-[10px] font-bold tracking-widest text-[#7CA851] uppercase">Self Reflection</span>
                          <h3 className="text-xl font-bold text-slate-900">Bio Journal</h3>
                        </div>
                        <BookOpen className="w-5 h-5 text-slate-400" />
                      </div>

                      <textarea
                        value={journalInput}
                        onChange={(e) => setJournalInput(e.target.value)}
                        placeholder="Log active pain, stress events, emotional shifts, or warm tea reflections..."
                        rows={3}
                        className="w-full rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-1 focus:ring-pink-400/50 p-4 text-xs font-medium text-slate-700 placeholder-slate-400 resize-none transition"
                      />
                    </div>

                    <button
                      onClick={handleSaveJournal}
                      disabled={isSavingJournal}
                      className="mt-4 w-full py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider shadow hover:scale-[1.01] transition"
                    >
                      {isSavingJournal ? 'Saving Reflections...' : 'Save Reflections 📝'}
                    </button>
                  </div>

                </div>

              </div>

              {/* Right Column (Sidebar & Calendar & Appointments) */}
              <div className="lg:col-span-4 space-y-8">
                
                {/* Visual Period Calendar Grid */}
                <div className="bg-white rounded-[32px] border border-slate-100 p-6 md:p-8 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-slate-900">Period Calendar</h3>
                    <div className="flex items-center gap-1">
                      <button onClick={handlePrevMonth} className="p-1.5 hover:bg-slate-50 rounded-lg"><ChevronLeft className="w-4 h-4 text-slate-600" /></button>
                      <span className="text-xs font-bold text-slate-800 tracking-tight whitespace-nowrap">{monthNames[currentMonth]} {currentYear}</span>
                      <button onClick={handleNextMonth} className="p-1.5 hover:bg-slate-50 rounded-lg"><ChevronRight className="w-4 h-4 text-slate-600" /></button>
                    </div>
                  </div>

                  {/* Calendar Matrix */}
                  <div className="grid grid-cols-7 gap-1 text-center mb-4">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => (
                      <span key={idx} className="text-[10px] font-bold text-slate-400">{day}</span>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-1.5">
                    {calendarDays.map((date, idx) => {
                      if (!date) return <div key={idx} className="aspect-square" />;
                      
                      const fullDate = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
                      const periodInfo = getPeriodDayInfo(fullDate);

                      return (
                        <button
                          key={idx}
                          onClick={() => {
                            setSelectedCalendarDate(fullDate);
                            showToast(`Selected date: ${fullDate}`);
                          }}
                          className={`aspect-square rounded-xl text-xs font-bold flex items-center justify-center transition-all ${
                            periodInfo?.isInCycle 
                              ? 'bg-rose-100 text-rose-600 border border-rose-200'
                              : 'bg-slate-50/60 hover:bg-slate-100 text-slate-700 border border-transparent'
                          } ${selectedCalendarDate === fullDate ? 'ring-2 ring-pink-500 scale-[1.05] z-10' : ''}`}
                        >
                          {date}
                        </button>
                      );
                    })}
                  </div>

                  {/* Interactive Selected Date controls */}
                  {selectedCalendarDate && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-5 p-3 rounded-2xl bg-rose-50/30 border border-rose-100/50 flex flex-col gap-2"
                    >
                      <p className="text-[10px] font-bold text-slate-500 text-center">Selected: {selectedCalendarDate}</p>
                      <div className="grid grid-cols-2 gap-2">
                        <button 
                          onClick={() => startPeriod(selectedCalendarDate)}
                          className="py-2 px-3 bg-white hover:bg-slate-50 text-[10px] font-bold text-rose-500 border border-rose-200 rounded-xl uppercase tracking-wider transition"
                        >
                          Start Here
                        </button>
                        <button 
                          onClick={() => endPeriod(selectedCalendarDate)}
                          className="py-2 px-3 bg-[#8EBC63] hover:bg-[#80AA55] text-[10px] font-bold text-white rounded-xl uppercase tracking-wider transition"
                        >
                          End Here
                        </button>
                      </div>
                    </motion.div>
                  )}

                  <div className="mt-4 flex items-center justify-center gap-4 text-[9px] font-bold text-slate-400">
                    <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-rose-100 border border-rose-200" /> Logged Flow</span>
                    <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-slate-50 border border-transparent" /> Clear days</span>
                  </div>
                </div>

                {/* Holistic Insights Checklist */}
                <div className="rounded-[32px] bg-gradient-to-b from-[#FDFBF7] to-white border border-[#EFEBE4] p-8 shadow-sm">
                  <div className="flex items-center gap-2.5 mb-6 text-[#9C7F52]">
                    <Smile className="w-5 h-5" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Hormonal Mood State</span>
                  </div>

                  <h3 className="text-2xl font-bold text-slate-900 leading-tight">Mood & Symptom Check-in</h3>
                  <p className="text-slate-500 text-xs mt-2.5 leading-relaxed">
                    {loggedMood ? `You logged your mood as "${loggedMood}" today.` : 'Balancing emotional wellness is core to lowering baseline stress levels.'}
                  </p>

                  <div className="grid grid-cols-2 gap-2 mt-6">
                    {moodsList.map((m) => (
                      <button
                        key={m.label}
                        onClick={() => handleUpdateProfile({ mood: m.label, moodDate: new Date().toISOString() })}
                        className={`flex items-center gap-2 p-3 rounded-2xl border text-left transition-all ${
                          loggedMood === m.label
                            ? 'bg-pink-50 border-pink-200 text-pink-700 font-bold scale-[1.02]'
                            : 'bg-white border-slate-100 hover:border-slate-200 text-slate-600'
                        }`}
                      >
                        <span className="text-lg">{m.icon}</span>
                        <span className="text-[10px] font-bold tracking-tight">{m.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Consultations Card */}
                <div className="rounded-[32px] bg-slate-900 p-8 text-white relative overflow-hidden shadow-xl">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-pink-500/15 to-transparent pointer-events-none" />
                  <span className="text-[9px] font-bold uppercase tracking-widest text-pink-400 bg-pink-500/10 px-2.5 py-1 rounded-full border border-pink-500/20">Sessions</span>
                  
                  <h3 className="text-xl font-bold mt-4">Next consultation</h3>
                  <p className="text-2xl font-black text-pink-300 mt-2">{nextAppointmentDisplay}</p>

                  <p className="text-xs text-slate-400 mt-3 leading-relaxed">
                    Review your targets with your expert doctor to customize care plans.
                  </p>
                </div>

              </div>

            </motion.div>
          )}

          {activeTab === 'classes' && (
            <motion.div
              key="classes-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="mt-10 max-w-6xl mx-auto space-y-12"
            >
              
              {classesLoading ? (
                <div className="h-96 flex items-center justify-center bg-white rounded-[32px] border border-slate-100 shadow-sm">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin" />
                    <p className="text-slate-500 font-medium text-xs tracking-wider">Syncing classes hub...</p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Dual Grid: Video Player + Real-Time WebSocket Chat */}
                  {liveClass ? (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                      
                      {/* Left Side: YouTube Watch Player */}
                      <div className="lg:col-span-8 flex flex-col justify-between bg-white border border-slate-100 rounded-[32px] p-6 md:p-8 shadow-sm">
                        <div>
                          {/* Top Badges */}
                          <div className="flex items-center justify-between mb-5">
                            <div className="flex items-center gap-2.5">
                              <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                                liveClass.type === 'live' 
                                  ? 'bg-rose-50 text-rose-600 border border-rose-100 animate-pulse'
                                  : 'bg-indigo-50 text-indigo-600 border border-indigo-100'
                              }`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${liveClass.type === 'live' ? 'bg-rose-600' : 'bg-indigo-600'}`} />
                                {liveClass.type} session
                              </div>
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{liveClass.duration} mins</span>
                            </div>
                            <span className="text-xs font-bold text-slate-400 tracking-tight">Coach: {liveClass.instructorName}</span>
                          </div>

                          <h2 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight">{liveClass.title}</h2>
                          <p className="text-slate-500 text-xs font-medium mt-2 leading-relaxed">{liveClass.description}</p>

                          {/* YouTube Frame */}
                          <div className="mt-6 aspect-video bg-black rounded-2xl overflow-hidden shadow-lg border border-slate-950/20">
                            <iframe
                              src={`https://www.youtube.com/embed/${getYoutubeEmbedId(liveClass.youtubeVideoId || liveClass.videoUrl || '')}?autoplay=1`}
                              title={liveClass.title}
                              className="w-full h-full"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            />
                          </div>
                        </div>

                        {/* Info Footer */}
                        <div className="mt-8 flex items-center justify-between p-3.5 rounded-2xl bg-amber-50/50 border border-amber-100/50 text-[11px] font-semibold text-amber-800">
                          <span className="flex items-center gap-1.5"><Info className="w-3.5 h-3.5" /> Direct streaming link initialized</span>
                          {liveClass.googleMeetLink && (
                            <a 
                              href={liveClass.googleMeetLink} 
                              target="_blank" 
                              rel="noreferrer" 
                              className="px-3.5 py-1.5 rounded-xl bg-amber-500 text-white text-[10px] font-black uppercase hover:bg-amber-600 transition"
                            >
                              Launch Meet call
                            </a>
                          )}
                        </div>
                      </div>

                      {/* Right Side: Chat Window */}
                      <div className="lg:col-span-4 bg-white border border-slate-100 rounded-[32px] shadow-sm flex flex-col justify-between overflow-hidden min-h-[480px]">
                        
                        {/* Header */}
                        <div className="px-6 py-4.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                          <div>
                            <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">Room Chat Logs</h4>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className={`w-2 h-2 rounded-full ${chatConnection === 'connected' ? 'bg-green-500' : 'bg-amber-500'}`} />
                              <span className="text-[9px] font-bold text-slate-400 tracking-tight">
                                {chatConnection === 'connected' ? 'WebSocket replication active' : 'Connecting to socket...'}
                              </span>
                            </div>
                          </div>
                          <RefreshCw onClick={fetchClassesData} className="w-3.5 h-3.5 text-slate-400 hover:text-slate-600 cursor-pointer transition" />
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4 max-h-[360px] min-h-[280px]">
                          {chatMessages.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center text-slate-300 gap-2">
                              <span className="text-4xl">💬</span>
                              <span className="text-[10px] font-bold uppercase tracking-wider">No messages yet</span>
                              <span className="text-[9px] text-slate-400">Say hello to the coach and class!</span>
                            </div>
                          ) : (
                            chatMessages.map((msg) => {
                              const isMe = msg.userId === userId;
                              const isDoc = msg.senderRole === 'doctor';
                              const isAdmin = msg.senderRole === 'admin';

                              return (
                                <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                  <span className="text-[8px] font-black text-slate-400 tracking-tight mb-1 uppercase flex items-center gap-1">
                                    {msg.senderName}
                                    {isDoc && <span className="text-[7px] bg-indigo-50 text-indigo-600 border border-indigo-100 px-1 rounded">DOCTOR</span>}
                                    {isAdmin && <span className="text-[7px] bg-rose-50 text-rose-600 border border-rose-100 px-1 rounded">ADMIN</span>}
                                  </span>
                                  
                                  <div className={`max-w-[85%] p-3.5 rounded-2xl text-[11px] font-medium leading-relaxed ${
                                    isMe 
                                      ? 'bg-slate-900 text-white rounded-tr-none' 
                                      : 'bg-slate-100 text-slate-800 rounded-tl-none'
                                  }`}>
                                    {msg.message}
                                  </div>
                                  <span className="text-[7px] text-slate-400 mt-0.5">
                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </span>
                                </div>
                              );
                            })
                          )}
                          <div ref={chatEndRef} />
                        </div>

                        {/* Send Inputs */}
                        <form onSubmit={handleSendChatMessage} className="p-4 bg-slate-50/50 border-t border-slate-100 flex gap-2">
                          <input
                            type="text"
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            placeholder="Type a message to class..."
                            className="flex-1 rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-1 focus:ring-pink-400/50 text-xs px-4 py-2.5 text-slate-700 font-medium placeholder-slate-400 transition"
                          />
                          <button
                            type="submit"
                            disabled={!chatInput.trim() || chatSending}
                            className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white transition flex items-center justify-center disabled:opacity-55"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                        </form>

                      </div>

                    </div>
                  ) : (
                    <div className="bg-white border border-slate-100 rounded-[32px] p-12 text-center shadow-sm">
                      <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-3xl mx-auto shadow-sm mb-6">🌙</div>
                      <h3 className="text-2xl font-bold text-slate-900">No active classes found</h3>
                      <p className="text-slate-500 text-sm max-w-sm mx-auto mt-2.5">
                        Wellness and hormone coaching webinars will display here soon. Check back shortly!
                      </p>
                    </div>
                  )}

                  {/* 🌿 Discover Classes Library Grid */}
                  <div className="bg-white border border-slate-100 rounded-[40px] p-8 md:p-12 shadow-sm space-y-8">
                    
                    {/* Header Controls */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 pb-8">
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-pink-500">Wellness Catalog</span>
                        <h3 className="text-3xl font-extrabold text-slate-950 mt-1">Discover Classes Library</h3>
                        <p className="text-slate-400 text-xs mt-1.5 font-medium">Browse dynamic live exercise panels or play past sessions on-demand.</p>
                      </div>

                      {/* Sub-Filters */}
                      <div className="flex items-center bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
                        {(['all', 'live', 'recorded'] as const).map((filter) => (
                          <button
                            key={filter}
                            onClick={() => setSelectedClassFilter(filter)}
                            className={`py-2 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                              selectedClassFilter === filter 
                                ? 'bg-white text-slate-950 shadow-sm' 
                                : 'text-slate-400 hover:text-slate-700'
                            }`}
                          >
                            {filter}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Classes Grid list */}
                    {filteredClasses.length === 0 ? (
                      <div className="py-12 text-center text-slate-400">
                        <span className="text-4xl">🔍</span>
                        <p className="text-xs font-bold uppercase tracking-widest mt-4">No matching sessions found</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredClasses.map((cls) => {
                          const isActive = liveClass?.id === cls.id;
                          return (
                            <motion.div
                              key={cls.id}
                              whileHover={{ y: -4 }}
                              className={`group overflow-hidden rounded-[28px] border bg-white flex flex-col justify-between shadow-sm hover:shadow-md transition-all ${
                                isActive ? 'border-pink-300 ring-2 ring-pink-500/20' : 'border-slate-100'
                              }`}
                            >
                              <div>
                                {/* Class Thumbnail preview */}
                                <div className="relative aspect-video bg-slate-50 overflow-hidden">
                                  <img 
                                    src={cls.thumbnailUrl || 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80'} 
                                    alt={cls.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />
                                  
                                  {/* Overlay Type Icon Badge */}
                                  <div className="absolute top-4 left-4 py-1.5 px-3 rounded-full bg-white/95 backdrop-blur-md text-[9px] font-black uppercase tracking-wider shadow flex items-center gap-1.5">
                                    <span className={`w-1.5 h-1.5 rounded-full ${cls.type === 'live' ? 'bg-rose-500 animate-pulse' : 'bg-indigo-500'}`} />
                                    {cls.type}
                                  </div>
                                </div>

                                <div className="p-6 space-y-3">
                                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                    <span>{cls.instructorName}</span>
                                    <span>{cls.duration} Mins</span>
                                  </div>

                                  <h4 className="text-lg font-bold text-slate-900 group-hover:text-pink-600 transition-colors leading-snug line-clamp-1">
                                    {cls.title}
                                  </h4>
                                  
                                  <p className="text-slate-400 text-[11px] font-medium leading-relaxed line-clamp-2">
                                    {cls.description}
                                  </p>
                                </div>
                              </div>

                              <div className="p-6 pt-0">
                                <button
                                  onClick={() => {
                                    setLiveClass(cls);
                                    showToast(`Now playing: ${cls.title} 🎥`);
                                  }}
                                  className={`w-full py-3.5 px-4 rounded-2xl font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                                    isActive 
                                      ? 'bg-pink-50 text-pink-600 border border-pink-100 cursor-default'
                                      : 'bg-slate-50 hover:bg-slate-900 hover:text-white text-slate-800 border border-slate-100 shadow-sm'
                                  }`}
                                >
                                  {isActive ? (
                                    <>
                                      <Check className="w-4 h-4" />
                                      Now Active
                                    </>
                                  ) : (
                                    <>
                                      <Play className="w-4 h-4 fill-current" />
                                      Play Session
                                    </>
                                  )}
                                </button>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    )}

                  </div>
                </>
              )}

            </motion.div>
          )}

          {activeTab === 'nutrition' && (
            <motion.div
              key="nutrition-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
            >
              {dietPlan ? (
                <DietScreen dietPlan={dietPlan} />
              ) : (
                <div className="max-w-md mx-auto bg-white border border-slate-100 rounded-[32px] p-8 text-center shadow-sm space-y-4 my-12">
                  <div className="w-16 h-16 bg-pink-50 rounded-full flex items-center justify-center text-pink-500 mx-auto">
                    <ShieldAlert className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">No Diet Plan Assigned</h3>
                  <p className="text-slate-500 text-xs leading-relaxed">
                    Your coaching doctor has not assigned a personalized nutrition and diet plan to your profile yet.
                    Once assigned, your daily schedule and tracking will appear here.
                  </p>
                </div>
              )}
            </motion.div>
          )}

        </AnimatePresence>

      </section>

      {/* Diet Plan Mobile Viewport Modal */}
      <AnimatePresence>
        {isDietViewOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 md:p-6"
          >
            <motion.div
              initial={{ scale: 0.95, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 30 }}
              className="relative w-full max-w-[420px] h-[90vh] bg-[#FAF8FC] rounded-[3rem] border-[12px] border-slate-900 shadow-2xl flex flex-col overflow-hidden"
            >
              {/* Camera Notch / Speaker Bar */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-900 rounded-b-2xl z-[110] flex items-center justify-center">
                <div className="w-12 h-1 bg-slate-800 rounded-full" />
              </div>

              {/* Close Button */}
              <button
                onClick={() => setIsDietViewOpen(false)}
                className="absolute top-4 right-4 z-[110] w-8 h-8 rounded-full bg-slate-900/50 hover:bg-slate-900/80 text-white flex items-center justify-center transition"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Screen Content Wrapper */}
              <div className="flex-1 overflow-y-auto">
                {dietPlan && <DietScreen dietPlan={dietPlan} />}
              </div>

              {/* Home Indicator */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-slate-300 rounded-full z-[110]" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </main>
  );
}