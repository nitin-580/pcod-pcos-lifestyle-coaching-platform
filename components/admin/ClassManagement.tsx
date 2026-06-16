'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Video, 
  Calendar, 
  Users, 
  Clock, 
  Tag, 
  Plus, 
  Edit3, 
  Trash2, 
  Award, 
  TrendingUp, 
  Sparkles, 
  ChevronRight, 
  FolderPlus, 
  Grid, 
  CheckCircle, 
  XCircle, 
  Layout, 
  ExternalLink,
  Loader2,
  AlertCircle,
  MessageSquare,
  Send,
  Trash,
  Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@supabase/supabase-js';

// Setup Supabase Client for Real-time chat monitor
const SUPABASE_URL = "https://uzxejobfqbjldutqplpx.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV6eGVqb2JmcWJqbGR1dHFwbHB4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzU4MDQ1OSwiZXhwIjoyMDg5MTU2NDU5fQ.Fc-70eYP_73PmR0NZYGaaE3GnTltco0wBnPk7OpyagQ";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

interface ClassCategory {
  id: string;
  name: string;
  slug: string;
}

interface WellnessClass {
  id: string;
  title: string;
  description: string;
  type: 'live' | 'recorded';
  thumbnailUrl: string;
  videoUrl: string;
  youtubeVideoId: string;
  googleMeetLink?: string;
  scheduledAt?: string;
  instructorName: string;
  duration: number;
  categoryId: string;
  isFeatured: boolean;
  isActive: boolean;
  tags: string[];
  createdAt: string;
  jitsiRecordingUrl?: string;
  jitsiSessionStatus?: string;
}

interface VideoPlacement {
  id: string;
  label: string;
  classId: string | null;
  isActive: boolean;
  class?: WellnessClass;
}

interface AnalyticsData {
  totalAttendees: number;
  activeLiveUsers: number;
  classCompletionRates: number;
  dropoutRates: number;
  interactionParticipation: number;
  attendanceTrends: { date: string; count: number }[];
  mostAttendedClasses: {
    classId: string;
    title: string;
    type: 'live' | 'recorded';
    instructor: string;
    count: number;
  }[];
  topWellnessSessions: {
    classId: string;
    title: string;
    instructor: string;
    completionRate: number;
    totalAttempts: number;
  }[];
}

interface ChatMessage {
  id: string;
  class_id: string;
  user_id: string;
  sender_name: string;
  sender_role: 'user' | 'doctor' | 'admin';
  message: string;
  created_at: string;
}

interface ClassManagementProps {
  apiKey: string;
}

const ClassManagement: React.FC<ClassManagementProps> = ({ apiKey }) => {
  const [activeSubTab, setActiveSubTab] = useState<'analytics' | 'classes' | 'placements' | 'categories'>('analytics');
  
  // Data States
  const [classes, setClasses] = useState<WellnessClass[]>([]);
  const [categories, setCategories] = useState<ClassCategory[]>([]);
  const [placements, setPlacements] = useState<VideoPlacement[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [teachers, setTeachers] = useState<any[]>([]);
  
  // UI States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'live' | 'recorded'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Live Chat Drawer States
  const [activeChatClass, setActiveChatClass] = useState<WellnessClass | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessageText, setNewMessageText] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [clearingChat, setClearingChat] = useState(false);
  const chatScrollRef = useRef<HTMLDivElement>(null);
  
  // Modal / Form States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<WellnessClass | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [addingCategory, setAddingCategory] = useState(false);
  
  // Class Form Fields
  const [formFields, setFormFields] = useState({
    title: '',
    description: '',
    type: 'recorded' as 'live' | 'recorded',
    thumbnailUrl: '',
    videoUrl: '',
    googleMeetLink: '',
    scheduledAt: '',
    instructorName: '',
    instructorId: '',
    duration: 30,
    categoryId: '',
    isFeatured: false,
    isActive: true,
    tagsString: '',
    liveProvider: 'youtube' as 'youtube' | 'jitsi',
    jitsiRoom: ''
  });

  const getProxyBase = () => '/api/public-proxy';

  useEffect(() => {
    fetchData();
  }, [apiKey]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const headers = { 
        'x-admin-api-key': apiKey,
        'Content-Type': 'application/json'
      };

      // Fetch categories, classes, placements
      const [catsRes, classesRes, placementsRes, analyticsRes, doctorsRes] = await Promise.all([
        fetch(`${getProxyBase()}/classes/categories`, { headers }),
        fetch(`${getProxyBase()}/classes`, { headers }),
        fetch(`${getProxyBase()}/classes/placements`, { headers }),
        fetch(`${getProxyBase()}/classes/analytics`, { headers }),
        fetch(`${getProxyBase()}/doctors`, { headers }).catch(() => null)
      ]);

      const catsData = await catsRes.json();
      const classesData = await classesRes.json();
      const placementsData = await placementsRes.json();
      
      let analyticsData = null;
      if (analyticsRes.ok) {
        const res = await analyticsRes.json();
        analyticsData = res.data;
      }

      let teachersList: any[] = [];
      if (doctorsRes) {
        const doctorsData = await doctorsRes.json();
        if (doctorsData.success) {
          teachersList = doctorsData.data || [];
        }
      }
      setTeachers(teachersList);

      setCategories(catsData.data || []);
      
      // Ensure tags is array
      const cleanedClasses = (classesData.data || []).map((c: any) => ({
        ...c,
        tags: Array.isArray(c.tags) ? c.tags : []
      }));
      setClasses(cleanedClasses);
      
      setPlacements(placementsData.data || []);
      setAnalytics(analyticsData);
      
      if (catsData.data && catsData.data.length > 0 && !formFields.categoryId) {
        setFormFields(prev => ({ ...prev, categoryId: catsData.data[0].id }));
      }
    } catch (err: any) {
      console.error(err);
      setError('Failed to fetch class management data. Please verify your connection or API key.');
    } finally {
      setLoading(false);
    }
  };

  // Setup Real-time Chat Subscription
  useEffect(() => {
    if (!activeChatClass) return;

    // 1. Fetch initial chat history from Supabase
    const loadChatHistory = async () => {
      try {
        const { data, error } = await supabase
          .from('wombcare_live_chats')
          .select('*')
          .eq('class_id', activeChatClass.id)
          .order('created_at', { ascending: true });
        
        if (error) throw error;
        setChatMessages(data || []);
      } catch (err) {
        console.error('Error fetching chat history:', err);
      }
    };
    loadChatHistory();

    // 2. Subscribe to realtime broadcast events
    const channel = supabase
      .channel(`live-chat-${activeChatClass.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'wombcare_live_chats',
          filter: `class_id=eq.${activeChatClass.id}`
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setChatMessages(prev => {
              if (prev.some(m => m.id === payload.new.id)) return prev;
              return [...prev, payload.new as ChatMessage];
            });
          } else if (payload.eventType === 'DELETE') {
            // If rows are deleted (cleared chat), reset local list
            setChatMessages([]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeChatClass]);

  // Scroll Chat to bottom
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // Send message as Admin
  const handleSendAdminMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessageText.trim() || !activeChatClass) return;

    setSendingMessage(true);
    try {
      const { error } = await supabase
        .from('wombcare_live_chats')
        .insert({
          class_id: activeChatClass.id,
          user_id: '00000000-0000-0000-0000-000000000000', // valid UUID format for static admin
          sender_name: 'Dr. Aaradhya (Admin)',
          sender_role: 'admin',
          message: newMessageText.trim()
        });

      if (error) throw error;
      setNewMessageText('');
    } catch (err) {
      console.error('Error sending message:', err);
      alert('Could not broadcast message.');
    } finally {
      setSendingMessage(false);
    }
  };

  // Clear Chat History for moderation
  const handleClearChatHistory = async () => {
    if (!activeChatClass || !window.confirm("Are you sure you want to delete ALL message history for this class? This cannot be undone!")) return;

    setClearingChat(true);
    try {
      const { error } = await supabase
        .from('wombcare_live_chats')
        .delete()
        .eq('class_id', activeChatClass.id);

      if (error) throw error;
      setChatMessages([]);
      alert("Chat logs flushed successfully!");
    } catch (err) {
      console.error('Error clearing messages:', err);
      alert('Failed to delete messages.');
    } finally {
      setClearingChat(false);
    }
  };

  // Toggle Class Join Active Permission
  const toggleClassActive = async (classId: string, currentStatus: boolean) => {
    setUpdatingId(classId);
    try {
      const response = await fetch(`${getProxyBase()}/classes/${classId}`, {
        method: 'PATCH',
        headers: {
          'x-admin-api-key': apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          isActive: !currentStatus
        })
      });

      if (!response.ok) {
        throw new Error('Failed to toggle active state.');
      }

      await fetchData();
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Error updating status.');
    } finally {
      setUpdatingId(null);
    }
  };

  // Button Mode Selector (Meet vs YouTube)
  const setButtonMode = async (classId: string, currentTags: string[], mode: 'gmeet' | 'youtube') => {
    setUpdatingId(classId);
    try {
      const cleaned = (currentTags || []).filter(t => t !== 'button:gmeet' && t !== 'button:youtube');
      const updatedTags = [...cleaned, `button:${mode}`];

      const response = await fetch(`${getProxyBase()}/classes/${classId}`, {
        method: 'PATCH',
        headers: {
          'x-admin-api-key': apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          tags: updatedTags
        })
      });

      if (!response.ok) {
        throw new Error('Failed to change button configuration.');
      }

      await fetchData();
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Error setting mode.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleOpenCreateModal = () => {
    setEditingClass(null);
    setFormFields({
      title: '',
      description: '',
      type: 'recorded',
      thumbnailUrl: '',
      videoUrl: '',
      googleMeetLink: '',
      scheduledAt: '',
      instructorName: teachers[0]?.name || '',
      instructorId: teachers[0]?.id || '',
      duration: 30,
      categoryId: categories[0]?.id || '',
      isFeatured: false,
      isActive: true,
      tagsString: '',
      liveProvider: 'youtube',
      jitsiRoom: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (cls: WellnessClass) => {
    setEditingClass(cls);
    
    let formattedDate = '';
    if (cls.scheduledAt) {
      const d = new Date(cls.scheduledAt);
      if (!isNaN(d.getTime())) {
        formattedDate = d.toISOString().substring(0, 16);
      }
    }

    const isJitsi = cls.videoUrl && cls.videoUrl.startsWith('jitsi:');
    const jitsiRoomName = isJitsi ? cls.videoUrl.replace('jitsi:', '') : '';

    setFormFields({
      title: cls.title,
      description: cls.description,
      type: cls.type,
      thumbnailUrl: cls.thumbnailUrl,
      videoUrl: cls.videoUrl,
      googleMeetLink: cls.googleMeetLink || '',
      scheduledAt: formattedDate,
      instructorName: cls.instructorName,
      instructorId: (cls as any).instructorId || '',
      duration: cls.duration,
      categoryId: cls.categoryId,
      isFeatured: cls.isFeatured,
      isActive: cls.isActive,
      tagsString: (cls.tags || []).join(', '),
      liveProvider: isJitsi ? 'jitsi' : 'youtube',
      jitsiRoom: jitsiRoomName
    });
    setIsModalOpen(true);
  };

  const handleSaveClass = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const isJitsiLive = formFields.type === 'live' && formFields.liveProvider === 'jitsi';
    const hasVideoUrl = isJitsiLive ? true : !!formFields.videoUrl;

    if (!formFields.title || !formFields.description || !formFields.instructorName || !hasVideoUrl) {
      setError('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    try {
      const tags = formFields.tagsString
        ? formFields.tagsString.split(',').map(t => t.trim()).filter(t => t.length > 0)
        : [];

      let finalVideoUrl = formFields.videoUrl;
      if (isJitsiLive) {
        finalVideoUrl = `jitsi:${formFields.jitsiRoom || 'wombcare-class-' + Math.floor(1000 + Math.random() * 9000)}`;
      }

      const payload: any = {
        title: formFields.title,
        description: formFields.description,
        type: formFields.type,
        thumbnailUrl: formFields.thumbnailUrl || 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b',
        videoUrl: finalVideoUrl,
        instructorName: formFields.instructorName,
        instructorId: formFields.instructorId || undefined,
        duration: Number(formFields.duration),
        categoryId: formFields.categoryId,
        isFeatured: formFields.isFeatured,
        isActive: formFields.isActive,
        tags
      };

      if (formFields.type === 'live') {
        if (formFields.googleMeetLink) payload.googleMeetLink = formFields.googleMeetLink;
        if (formFields.scheduledAt) {
          payload.scheduledAt = new Date(formFields.scheduledAt).toISOString();
        } else {
          payload.scheduledAt = new Date().toISOString();
        }
      }

      const url = editingClass 
        ? `${getProxyBase()}/classes/${editingClass.id}`
        : `${getProxyBase()}/classes`;
      
      const method = editingClass ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'x-admin-api-key': apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error saving class.');
      }

      setIsModalOpen(false);
      await fetchData();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred while saving the wellness class.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClass = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this wellness class? This action cannot be undone.')) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${getProxyBase()}/classes/${id}`, {
        method: 'DELETE',
        headers: {
          'x-admin-api-key': apiKey
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error deleting class.');
      }

      await fetchData();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to delete class.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePlacement = async (placementId: string, classId: string | null) => {
    setLoading(true);
    try {
      const response = await fetch(`${getProxyBase()}/classes/placements/${placementId}`, {
        method: 'PATCH',
        headers: {
          'x-admin-api-key': apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          classId: classId === 'none' ? null : classId,
          isActive: classId !== 'none' && classId !== null
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update video placement.');
      }

      await fetchData();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to update placement.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    setAddingCategory(true);
    try {
      const response = await fetch(`${getProxyBase()}/classes/categories`, {
        method: 'POST',
        headers: {
          'x-admin-api-key': apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: newCategoryName.trim() })
      });

      if (!response.ok) {
        throw new Error('Failed to create category.');
      }

      setNewCategoryName('');
      await fetchData();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to create category.');
    } finally {
      setAddingCategory(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this category? Any classes assigned to it may remain, but their category association might be broken.')) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${getProxyBase()}/classes/categories/${id}`, {
        method: 'DELETE',
        headers: {
          'x-admin-api-key': apiKey
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete category.');
      }

      await fetchData();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to delete category.');
    } finally {
      setLoading(false);
    }
  };

  // Filter Classes logic
  const filteredClasses = classes.filter(cls => {
    const matchesSearch = cls.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          cls.instructorName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (cls.tags || []).some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = typeFilter === 'all' ? true : cls.type === typeFilter;
    const matchesCategory = categoryFilter === 'all' ? true : cls.categoryId === categoryFilter;

    return matchesSearch && matchesType && matchesCategory;
  });

  return (
    <div className="space-y-8 pb-10">
      
      {/* Sub Tabs Navigation */}
      <div className="flex border-b border-slate-100 gap-6">
        <button 
          onClick={() => setActiveSubTab('analytics')}
          className={`pb-4 font-bold text-sm transition-all border-b-2 flex items-center gap-2 ${activeSubTab === 'analytics' ? 'border-pink-500 text-pink-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
        >
          <TrendingUp className="w-4 h-4" /> Overview & Analytics
        </button>
        <button 
          onClick={() => setActiveSubTab('classes')}
          className={`pb-4 font-bold text-sm transition-all border-b-2 flex items-center gap-2 ${activeSubTab === 'classes' ? 'border-pink-500 text-pink-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
        >
          <Video className="w-4 h-4" /> Wellness Classes
        </button>
        <button 
          onClick={() => setActiveSubTab('placements')}
          className={`pb-4 font-bold text-sm transition-all border-b-2 flex items-center gap-2 ${activeSubTab === 'placements' ? 'border-pink-500 text-pink-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
        >
          <Layout className="w-4 h-4" /> Video Placements
        </button>
        <button 
          onClick={() => setActiveSubTab('categories')}
          className={`pb-4 font-bold text-sm transition-all border-b-2 flex items-center gap-2 ${activeSubTab === 'categories' ? 'border-pink-500 text-pink-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
        >
          <Grid className="w-4 h-4" /> Categories
        </button>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4 flex items-center gap-3 text-rose-700 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="flex-1 font-medium">{error}</p>
          <button onClick={() => setError(null)} className="text-rose-400 hover:text-rose-600 font-bold">×</button>
        </div>
      )}

      {/* SUB-TAB CONTENTS */}
      <AnimatePresence mode="wait">
        
        {/* 1. ANALYTICS SUB TAB */}
        {activeSubTab === 'analytics' && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -15 }}
            className="space-y-8"
          >
            {/* Stats Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Stat 1: Total Attendees */}
              <div className="bg-gradient-to-tr from-pink-500 to-rose-500 rounded-[2rem] p-6 text-white shadow-xl shadow-pink-100/50 flex flex-col justify-between h-44 relative overflow-hidden">
                <div className="absolute right-0 bottom-0 opacity-10 translate-y-1/4 translate-x-1/4">
                  <Users className="w-36 h-36" />
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-white/80 font-bold text-xs uppercase tracking-widest">Total Unique Attendees</span>
                  <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
                    <Users className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <h3 className="text-4xl font-black mb-1">{analytics?.totalAttendees ?? 0}</h3>
                  <p className="text-xs text-white/70 font-medium">Enrolled & participating in classes</p>
                </div>
              </div>

              {/* Stat 2: Active Live Users */}
              <div className="bg-gradient-to-tr from-violet-600 to-indigo-600 rounded-[2rem] p-6 text-white shadow-xl shadow-indigo-100/50 flex flex-col justify-between h-44 relative overflow-hidden">
                <div className="absolute right-0 bottom-0 opacity-10 translate-y-1/4 translate-x-1/4">
                  <Calendar className="w-36 h-36" />
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-white/80 font-bold text-xs uppercase tracking-widest">Active Live Attendees</span>
                  <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
                    <Video className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <h3 className="text-4xl font-black mb-1">{analytics?.activeLiveUsers ?? 0}</h3>
                  <p className="text-xs text-white/70 font-medium">Joined Google Meet interactive sessions</p>
                </div>
              </div>

              {/* Stat 3: Completion Rates */}
              <div className="bg-gradient-to-tr from-emerald-500 to-teal-600 rounded-[2rem] p-6 text-white shadow-xl shadow-emerald-100/50 flex flex-col justify-between h-44 relative overflow-hidden">
                <div className="absolute right-0 bottom-0 opacity-10 translate-y-1/4 translate-x-1/4">
                  <Award className="w-36 h-36" />
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-white/80 font-bold text-xs uppercase tracking-widest">Avg Completion Rate</span>
                  <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
                    <Award className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <h3 className="text-4xl font-black mb-1">{(analytics?.classCompletionRates ?? 0)}%</h3>
                  <p className="text-xs text-white/70 font-medium">Classes watched to 80% completion</p>
                </div>
              </div>

              {/* Stat 4: Dropout Rates */}
              <div className="bg-gradient-to-tr from-amber-500 to-orange-600 rounded-[2rem] p-6 text-white shadow-xl shadow-orange-100/50 flex flex-col justify-between h-44 relative overflow-hidden">
                <div className="absolute right-0 bottom-0 opacity-10 translate-y-1/4 translate-x-1/4">
                  <Clock className="w-36 h-36" />
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-white/80 font-bold text-xs uppercase tracking-widest">Engagement Dropout Rate</span>
                  <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
                    <Clock className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <h3 className="text-4xl font-black mb-1">{(analytics?.dropoutRates ?? 0)}%</h3>
                  <p className="text-xs text-white/70 font-medium">Classes with &lt;20% watch percentage</p>
                </div>
              </div>

            </div>

            {/* Side-by-Side Analytics Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Column 1: Most Attended Classes */}
              <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-2xl bg-pink-50 flex items-center justify-center text-pink-500">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-slate-800">Most Popular Classes</h3>
                    <p className="text-xs text-slate-400">Top 5 classes by total audience visits</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {analytics?.mostAttendedClasses && analytics.mostAttendedClasses.length > 0 ? (
                    analytics.mostAttendedClasses.map((item, idx) => (
                      <div key={item.classId} className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl hover:bg-slate-50 transition-all">
                        <div className="flex items-center gap-4 min-w-0 flex-1">
                          <span className="text-slate-300 font-black text-xl w-6 text-center">#{idx + 1}</span>
                          <div className="min-w-0">
                            <h4 className="font-bold text-slate-800 text-sm truncate">{item.title}</h4>
                            <div className="flex items-center gap-2 text-xs text-slate-400 font-medium mt-1">
                              <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${item.type === 'live' ? 'bg-pink-50 text-pink-600' : 'bg-purple-50 text-purple-600'}`}>
                                {item.type}
                              </span>
                              <span>•</span>
                              <span>By {item.instructor}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right pl-4">
                          <span className="font-black text-slate-800 text-base">{item.count}</span>
                          <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mt-0.5">Views</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-12 text-center text-slate-300 text-sm font-medium">No popular classes data recorded yet.</div>
                  )}
                </div>
              </div>

              {/* Column 2: Top Wellness Sessions (Highest Completion) */}
              <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-500">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-slate-800">Top Rated Wellness Sessions</h3>
                    <p className="text-xs text-slate-400">Top 5 classes by student completion rates</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {analytics?.topWellnessSessions && analytics.topWellnessSessions.length > 0 ? (
                    analytics.topWellnessSessions.map((item, idx) => (
                      <div key={item.classId} className="flex flex-col p-4 bg-slate-50/50 rounded-2xl hover:bg-slate-50 transition-all gap-3">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-3 min-w-0">
                            <span className="text-slate-300 font-black text-xl w-6 text-center">#{idx + 1}</span>
                            <div className="min-w-0">
                              <h4 className="font-bold text-slate-800 text-sm truncate">{item.title}</h4>
                              <p className="text-[11px] text-slate-400 font-medium mt-0.5">Instructor: {item.instructor}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="font-black text-emerald-600 text-base">{item.completionRate}%</span>
                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Completion</p>
                          </div>
                        </div>
                        
                        {/* Progress Bar */}
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full" 
                            style={{ width: `${item.completionRate}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase tracking-wide">
                          <span>Total Watch Tries: {item.totalAttempts}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-12 text-center text-slate-300 text-sm font-medium">No completions data recorded yet.</div>
                  )}
                </div>
              </div>

            </div>

            {/* Extra Analytics Details */}
            <div className="bg-slate-900 text-white rounded-[2.5rem] p-8 relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500 rounded-full filter blur-[100px] opacity-10" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500 rounded-full filter blur-[100px] opacity-10" />
              
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-pink-400">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-black text-lg">Interactive Wellness Activities</h4>
                  <p className="text-slate-400 text-sm mt-0.5">Total class interaction & Google Meet participations: <span className="text-pink-400 font-bold">{analytics?.interactionParticipation ?? 0}</span></p>
                </div>
              </div>

              <button 
                onClick={() => setActiveSubTab('classes')}
                className="px-6 py-3 bg-white text-slate-900 rounded-full font-black text-xs uppercase tracking-widest hover:bg-slate-100 transition-all flex items-center gap-2 active:scale-[0.98] relative z-10"
              >
                Go to Classes <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </motion.div>
        )}

        {/* 2. WELLNESS CLASSES LIST SUB TAB */}
        {activeSubTab === 'classes' && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            {/* Search & Filters */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              
              {/* Search Bar */}
              <input
                type="text"
                placeholder="Search classes by title, instructor, tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full md:w-96 px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-pink-400 outline-none transition-all text-sm font-medium"
              />

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                
                {/* Type Filter */}
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value as any)}
                  className="px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-600 focus:ring-2 focus:ring-pink-400 outline-none"
                >
                  <option value="all">All Types</option>
                  <option value="live">Live Sessions</option>
                  <option value="recorded">Recorded Sessions</option>
                </select>

                {/* Category Filter */}
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-600 focus:ring-2 focus:ring-pink-400 outline-none"
                >
                  <option value="all">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>

                {/* New Class Button */}
                <button
                  onClick={handleOpenCreateModal}
                  className="flex items-center gap-2 px-5 py-3.5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition shadow-md active:scale-95 ml-auto md:ml-0"
                >
                  <Plus className="w-4 h-4" /> Add Class
                </button>

              </div>
            </div>

            {/* Classes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {filteredClasses.map((cls) => {
                const category = categories.find(c => c.id === cls.categoryId);
                const isJoinActive = cls.isActive !== false;
                const isYoutubeMode = cls.tags?.includes('button:youtube');
                const isMeetMode = cls.tags?.includes('button:gmeet') || (!isYoutubeMode && !!cls.googleMeetLink);

                return (
                  <div 
                    key={cls.id}
                    className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col justify-between group hover:border-pink-200 transition-all translate-y-0 hover:-translate-y-1.5"
                  >
                    
                    {/* Top Thumbnail Section */}
                    <div className="relative aspect-video w-full bg-slate-100 overflow-hidden">
                      <img 
                        src={cls.thumbnailUrl} 
                        alt={cls.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                      />
                      
                      {/* Top Badges */}
                      <div className="absolute top-4 left-4 flex gap-2 z-10">
                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider text-white backdrop-blur-md shadow-sm ${cls.type === 'live' ? 'bg-pink-600/90' : 'bg-purple-600/90'}`}>
                          {cls.type === 'live' ? '🔴 Live' : '🎬 Recorded'}
                        </span>
                        {cls.isFeatured && (
                          <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider text-slate-900 bg-amber-300/90 backdrop-blur-md shadow-sm">
                            ⭐ Featured
                          </span>
                        )}
                      </div>

                      {/* Duration Tag */}
                      <div className="absolute bottom-4 right-4 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-white text-[10px] font-black tracking-wider flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-pink-400" /> {cls.duration} Min
                      </div>
                    </div>

                    {/* Class Info */}
                    <div className="p-6 flex-1 flex flex-col justify-between gap-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] bg-slate-100 text-slate-500 px-2.5 py-1 rounded-md font-bold uppercase tracking-wider">
                            {category?.name || 'Wellness'}
                          </span>
                          
                          {/* Live Switch Button */}
                          <button
                            onClick={() => toggleClassActive(cls.id, isJoinActive)}
                            disabled={updatingId === cls.id}
                            className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border transition-all ${
                              isJoinActive 
                                ? 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100' 
                                : 'bg-rose-50 text-rose-600 border-rose-200 hover:bg-rose-100'
                            }`}
                          >
                            {updatingId === cls.id ? (
                              <Loader2 className="w-3 h-3 animate-spin text-slate-400" />
                            ) : (
                              <>
                                <span className={`w-2 h-2 rounded-full ${isJoinActive ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                                {isJoinActive ? 'Active' : 'Inactive'}
                              </>
                            )}
                          </button>
                        </div>

                        <h4 className="font-extrabold text-slate-800 text-base leading-snug line-clamp-1 mb-2">
                          {cls.title}
                        </h4>
                        
                        <p className="text-slate-400 text-xs font-medium line-clamp-2 leading-relaxed mb-4">
                          {cls.description}
                        </p>
                      </div>

                      <div className="space-y-4">
                        
                        {/* Dynamic Button Mode Selector (Google Meet vs YouTube Video watch) */}
                        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3">
                          <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-2">
                            ⚙️ ACTIVE BUTTON TYPE SELECTOR
                          </span>
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={() => setButtonMode(cls.id, cls.tags, 'gmeet')}
                              disabled={updatingId === cls.id}
                              className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all ${
                                isMeetMode 
                                  ? 'bg-pink-500 text-white shadow-sm shadow-pink-100' 
                                  : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-100'
                              }`}
                            >
                              <Video className="w-3.5 h-3.5" /> Meet Link
                            </button>
                            <button
                              type="button"
                              onClick={() => setButtonMode(cls.id, cls.tags, 'youtube')}
                              disabled={updatingId === cls.id}
                              className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all ${
                                isYoutubeMode 
                                  ? 'bg-pink-500 text-white shadow-sm shadow-pink-100' 
                                  : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-100'
                              }`}
                            >
                              <Play className="w-3.5 h-3.5" /> Watch Video
                            </button>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-slate-50 flex items-center justify-between text-xs text-slate-500">
                          <span className="font-semibold text-slate-600">Instructor: <span className="font-black text-slate-800">{cls.instructorName}</span></span>
                        </div>

                        {cls.type === 'live' && cls.scheduledAt && (
                          <div className="bg-pink-50/50 rounded-xl p-3 flex items-center gap-2.5 text-[11px] text-pink-700 font-bold border border-pink-100/30">
                            <Calendar className="w-4 h-4 text-pink-500 flex-shrink-0" />
                            <span className="truncate">
                              {new Date(cls.scheduledAt).toLocaleString()}
                            </span>
                          </div>
                        )}

                        {/* Tags list */}
                        {cls.tags && cls.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {cls.tags.map(t => (
                              <span key={t} className="text-[9px] bg-slate-50 text-slate-400 font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                                #{t}
                              </span>
                            ))}
                          </div>
                        )}
                        
                        {/* Admin Action Buttons */}
                        <div className="flex gap-2 pt-2">
                          <button
                            onClick={() => setActiveChatClass(cls)}
                            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 bg-pink-50 hover:bg-pink-100 text-pink-600 rounded-xl text-xs font-bold transition-all"
                          >
                            <MessageSquare className="w-3.5 h-3.5" /> Monitor Chat
                          </button>
                          {((cls.jitsiRecordingUrl) || (cls.type === 'recorded' && cls.videoUrl && !cls.videoUrl.includes('youtube') && !cls.videoUrl.includes('youtu.be') && !cls.videoUrl.startsWith('jitsi:'))) && (
                            <a
                              href={cls.jitsiRecordingUrl || cls.videoUrl}
                              download
                              target="_blank"
                              rel="noopener noreferrer"
                              title="Download Recording"
                              className="flex items-center justify-center p-2.5 bg-pink-50 hover:bg-pink-100 text-pink-600 rounded-xl transition-all"
                            >
                              <Download className="w-4 h-4" />
                            </a>
                          )}
                          <button
                            onClick={() => handleOpenEditModal(cls)}
                            className="flex items-center justify-center p-2.5 bg-slate-50 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-bold transition-all"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteClass(cls.id)}
                            className="flex items-center justify-center p-2.5 bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-xl transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                    </div>
                  </div>
                );
              })}

              {filteredClasses.length === 0 && (
                <div className="col-span-full py-20 text-center bg-white border border-slate-100 rounded-3xl">
                  <Video className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                  <p className="text-slate-400 font-medium">No classes match the selected criteria.</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* 3. PLACEMENTS SUB TAB */}
        {activeSubTab === 'placements' && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-2xl bg-pink-50 flex items-center justify-center text-pink-500">
                  <Layout className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-slate-800">Featured Video Placements</h3>
                  <p className="text-xs text-slate-400">Map specific wellness classes to Link 1, Link 2, and Link 3 targets displayed on patient portals.</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {placements.map(placement => {
                const currentCls = classes.find(c => c.id === placement.classId);
                const isPlacementActive = placement.isActive && currentCls;

                return (
                  <div 
                    key={placement.id}
                    className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm flex flex-col justify-between gap-6 group hover:border-pink-200 transition-all"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                          <span className="font-black text-xl text-slate-900">{placement.label}</span>
                          <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${isPlacementActive ? 'bg-green-50 text-green-600' : 'bg-slate-100 text-slate-400'}`}>
                            {isPlacementActive ? 'ACTIVE' : 'INACTIVE'}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Placement Target</span>
                      </div>

                      {/* Display Selected Class Info Card */}
                      {currentCls ? (
                        <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100/50">
                          <img 
                            src={currentCls.thumbnailUrl} 
                            alt={currentCls.title}
                            className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider inline-block mb-1 ${currentCls.type === 'live' ? 'bg-pink-100 text-pink-600' : 'bg-purple-100 text-purple-600'}`}>
                              {currentCls.type}
                            </span>
                            <h4 className="font-bold text-slate-800 text-sm truncate leading-snug">{currentCls.title}</h4>
                            <p className="text-[11px] text-slate-400 mt-0.5">Instructor: {currentCls.instructorName}</p>
                          </div>
                        </div>
                      ) : (
                        <div className="py-8 text-center bg-slate-50 border border-dashed border-slate-200 rounded-2xl text-slate-400 text-xs font-semibold">
                          No class assigned. This slot will be empty.
                        </div>
                      )}
                    </div>

                    {/* Change Assignment Control */}
                    <div className="space-y-2">
                      <label className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Map to Class:</label>
                      <select
                        value={placement.classId || 'none'}
                        onChange={(e) => handleUpdatePlacement(placement.id, e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-700 outline-none focus:ring-2 focus:ring-pink-400"
                      >
                        <option value="none">-- Unassign / Empty --</option>
                        {classes.map(cls => (
                          <option key={cls.id} value={cls.id}>
                            [{cls.type.toUpperCase()}] {cls.title} (by {cls.instructorName})
                          </option>
                        ))}
                      </select>
                    </div>

                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* 4. CATEGORIES SUB TAB */}
        {activeSubTab === 'categories' && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -15 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            
            {/* Create Category Form */}
            <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm h-fit">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-2xl bg-pink-50 flex items-center justify-center text-pink-500">
                  <FolderPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-slate-800">Add Category</h3>
                  <p className="text-xs text-slate-400">Define a new category to group classes.</p>
                </div>
              </div>

              <form onSubmit={handleCreateCategory} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Category Name:</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Hormonal Balance Yoga"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-pink-400"
                  />
                </div>

                <button
                  type="submit"
                  disabled={addingCategory}
                  className="w-full bg-slate-900 text-white py-3.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                >
                  {addingCategory ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />} Create Category
                </button>
              </form>
            </div>

            {/* Categories List */}
            <div className="lg:col-span-2 bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm">
              <h3 className="font-extrabold text-lg text-slate-800 mb-6">Existing Categories</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {categories.map(cat => {
                  const classCount = classes.filter(c => c.categoryId === cat.id).length;
                  return (
                    <div 
                      key={cat.id} 
                      className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100/50 hover:border-pink-200 transition-all"
                    >
                      <div>
                        <h4 className="font-bold text-slate-800 text-sm leading-snug">{cat.name}</h4>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">{classCount} classes assigned</p>
                      </div>
                      <button 
                        onClick={() => handleDeleteCategory(cat.id)}
                        className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}

                {categories.length === 0 && (
                  <div className="col-span-full py-16 text-center text-slate-300 text-sm font-semibold">
                    No categories found. Adding defaults is triggered automatically on first load.
                  </div>
                )}
              </div>
            </div>

          </motion.div>
        )}

      </AnimatePresence>

      {/* 5. LIVE CHAT DRAWER MODAL */}
      <AnimatePresence>
        {activeChatClass && (
          <div className="fixed inset-0 z-50 overflow-hidden font-sans flex justify-end">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveChatClass(null)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" 
            />

            {/* Sidebar drawer content */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-md bg-white h-full flex flex-col justify-between shadow-2xl border-l border-slate-100 z-10"
            >
              {/* Header */}
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="min-w-0">
                  <span className="text-[9px] bg-pink-100 text-pink-600 px-2 py-0.5 rounded font-black uppercase tracking-wider">
                    REALTIME BROADCAST
                  </span>
                  <h3 className="text-base font-extrabold text-slate-900 truncate mt-1">
                    {activeChatClass.title}
                  </h3>
                  <p className="text-[11px] text-slate-400 font-medium">Instructor: {activeChatClass.instructorName}</p>
                </div>
                
                <button
                  onClick={() => setActiveChatClass(null)}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              {/* Chat messages workspace */}
              <div 
                ref={chatScrollRef}
                className="flex-1 p-6 overflow-y-auto bg-slate-50/30 space-y-4 min-h-0"
              >
                {chatMessages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6">
                    <MessageSquare className="w-10 h-10 text-slate-200 mb-2" />
                    <p className="text-slate-400 text-sm font-semibold">No messages in room</p>
                    <p className="text-slate-300 text-xs mt-1">Messages sent by patients or doctors will show up here in real time.</p>
                  </div>
                ) : (
                  chatMessages.map((msg) => {
                    const isSelf = msg.sender_role === 'admin';
                    const isDoc = msg.sender_role === 'doctor';

                    return (
                      <div 
                        key={msg.id}
                        className={`flex flex-col ${isSelf ? 'items-end' : 'items-start'}`}
                      >
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="text-[10px] font-black text-slate-500">{msg.sender_name}</span>
                          <span className={`text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded ${
                            isSelf ? 'bg-pink-100 text-pink-600' : isDoc ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-400'
                          }`}>
                            {msg.sender_role}
                          </span>
                        </div>
                        <div className={`px-4 py-2.5 rounded-2xl text-xs max-w-[85%] leading-relaxed ${
                          isSelf 
                            ? 'bg-slate-900 text-white rounded-tr-none' 
                            : 'bg-white border border-slate-150 text-slate-800 rounded-tl-none shadow-sm'
                        }`}>
                          {msg.message}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Command box input area */}
              <div className="p-4 border-t border-slate-100 bg-white">
                <form onSubmit={handleSendAdminMessage} className="flex gap-2 mb-3">
                  <input
                    type="text"
                    placeholder="Type official admin alert..."
                    value={newMessageText}
                    onChange={(e) => setNewMessageText(e.target.value)}
                    className="flex-1 px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold outline-none focus:ring-2 focus:ring-pink-500"
                  />
                  <button
                    type="submit"
                    disabled={sendingMessage || !newMessageText.trim()}
                    className="p-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl transition flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {sendingMessage ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </button>
                </form>

                {/* Moderation Controls */}
                <div className="flex items-center justify-between border-t border-slate-50 pt-3">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    Moderator Commands:
                  </span>
                  
                  <button
                    type="button"
                    onClick={handleClearChatHistory}
                    disabled={clearingChat || chatMessages.length === 0}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all disabled:opacity-50"
                  >
                    {clearingChat ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <Trash className="w-3.5 h-3.5" />
                    )}
                    Clear Room
                  </button>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 6. CLASS CREATE / EDIT DIALOG MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto font-sans">
            
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" 
            />

            {/* Modal Dialog */}
            <div className="flex min-h-screen items-center justify-center p-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 30 }}
                className="relative max-w-2xl w-full bg-white rounded-[2.5rem] shadow-2xl p-10 overflow-hidden border border-slate-100"
              >
                
                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-2xl font-extrabold text-slate-900">
                      {editingClass ? 'Edit Wellness Class' : 'Create Wellness Class'}
                    </h3>
                    <p className="text-slate-400 text-xs font-semibold mt-1">
                      {editingClass ? 'Modify details of the wellness lesson.' : 'Set up a new live or pre-recorded wellness lesson.'}
                    </p>
                  </div>
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSaveClass} className="space-y-6">
                  
                  {/* Two column layout */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Title */}
                    <div className="space-y-2">
                      <label className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Class Title*</label>
                      <input 
                        type="text" 
                        required
                        value={formFields.title}
                        onChange={(e) => setFormFields(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="e.g. Hormonal PMOS Yoga Flow"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-pink-400"
                      />
                    </div>

                    {/* Instructor Dropdown Selection */}
                    <div className="space-y-2">
                      <label className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Wellness Instructor*</label>
                      <select 
                        required
                        value={formFields.instructorId}
                        onChange={(e) => {
                          const selectedId = e.target.value;
                          const selectedTeacher = teachers.find(t => t.id === selectedId);
                          setFormFields(prev => ({ 
                            ...prev, 
                            instructorId: selectedId,
                            instructorName: selectedTeacher ? selectedTeacher.name : '' 
                          }));
                        }}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold uppercase tracking-wider text-slate-700 outline-none focus:ring-2 focus:ring-pink-400"
                      >
                        <option value="">Select Instructor...</option>
                        {teachers.map(teacher => (
                          <option key={teacher.id} value={teacher.id}>
                            {teacher.name} ({teacher.email})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Class Type */}
                    <div className="space-y-2">
                      <label className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Class Type*</label>
                      <select 
                        value={formFields.type}
                        onChange={(e) => setFormFields(prev => ({ ...prev, type: e.target.value as any }))}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold uppercase tracking-wider text-slate-700 outline-none focus:ring-2 focus:ring-pink-400"
                      >
                        <option value="recorded">Pre-Recorded</option>
                        <option value="live">Live Session</option>
                      </select>
                    </div>

                    {/* Category Selection */}
                    <div className="space-y-2">
                      <label className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Wellness Category*</label>
                      <select 
                        value={formFields.categoryId}
                        onChange={(e) => setFormFields(prev => ({ ...prev, categoryId: e.target.value }))}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold uppercase tracking-wider text-slate-700 outline-none focus:ring-2 focus:ring-pink-400"
                      >
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>

                    {/* Duration in Minutes */}
                    <div className="space-y-2">
                      <label className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Duration (Minutes)*</label>
                      <input 
                        type="number" 
                        min="1" 
                        required
                        value={formFields.duration}
                        onChange={(e) => setFormFields(prev => ({ ...prev, duration: Number(e.target.value) }))}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-pink-400"
                      />
                    </div>

                    {/* Dynamic Inputs based on Recorded vs Live */}
                    {formFields.type === 'recorded' ? (
                      /* Pre-Recorded YouTube Video URL */
                      <div className="space-y-2">
                        <label className="text-[10px] text-slate-400 font-black uppercase tracking-wider">YouTube URL*</label>
                        <input 
                          type="url" 
                          required
                          value={formFields.videoUrl}
                          onChange={(e) => setFormFields(prev => ({ ...prev, videoUrl: e.target.value }))}
                          placeholder="https://www.youtube.com/watch?v=..."
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-pink-400"
                        />
                      </div>
                    ) : (
                      /* Live Broadcast Options */
                      <>
                        <div className="space-y-2">
                          <label className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Live Broadcast Provider*</label>
                          <select 
                            value={formFields.liveProvider}
                            onChange={(e) => setFormFields(prev => ({ ...prev, liveProvider: e.target.value as any }))}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold uppercase tracking-wider text-slate-700 outline-none focus:ring-2 focus:ring-pink-400"
                          >
                            <option value="youtube">YouTube Live Stream</option>
                            <option value="jitsi">8x8 JaaS Jitsi Classroom</option>
                          </select>
                        </div>

                        {formFields.liveProvider === 'youtube' ? (
                          <div className="space-y-2">
                            <label className="text-[10px] text-slate-400 font-black uppercase tracking-wider">YouTube Live Stream URL*</label>
                            <input 
                              type="url" 
                              required
                              value={formFields.videoUrl}
                              onChange={(e) => setFormFields(prev => ({ ...prev, videoUrl: e.target.value }))}
                              placeholder="https://www.youtube.com/watch?v=..."
                              className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-pink-400"
                            />
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <label className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Jitsi Classroom Room ID*</label>
                            <input 
                              type="text" 
                              required
                              value={formFields.jitsiRoom}
                              onChange={(e) => setFormFields(prev => ({ ...prev, jitsiRoom: e.target.value.replace(/\s+/g, '-').toLowerCase() }))}
                              placeholder="e.g. prenatal-care-yoga"
                              className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-pink-400"
                            />
                          </div>
                        )}
                      </>
                    )}

                    {/* Dynamic Scheduled At (Only shown if type is live) */}
                    {formFields.type === 'live' && (
                      <div className="space-y-2">
                        <label className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Scheduled At*</label>
                        <input 
                          type="datetime-local" 
                          required
                          value={formFields.scheduledAt}
                          onChange={(e) => setFormFields(prev => ({ ...prev, scheduledAt: e.target.value }))}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-pink-400 text-slate-600"
                        />
                      </div>
                    )}

                    {/* Dynamic Google Meet Link (Only shown if type is live) */}
                    {formFields.type === 'live' && (
                      <div className="space-y-2">
                        <label className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Alternative Google Meet Link</label>
                        <input 
                          type="url" 
                          value={formFields.googleMeetLink}
                          onChange={(e) => setFormFields(prev => ({ ...prev, googleMeetLink: e.target.value }))}
                          placeholder="https://meet.google.com/abc-defg-hij"
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-pink-400"
                        />
                      </div>
                    )}

                    {/* Thumbnail URL */}
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Thumbnail Image URL</label>
                      <input 
                        type="url" 
                        value={formFields.thumbnailUrl}
                        onChange={(e) => setFormFields(prev => ({ ...prev, thumbnailUrl: e.target.value }))}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-pink-400"
                      />
                    </div>

                    {/* Description */}
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Description*</label>
                      <textarea 
                        required
                        rows={3}
                        value={formFields.description}
                        onChange={(e) => setFormFields(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Provide details about the wellness focus of this session..."
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-pink-400 resize-none"
                      />
                    </div>

                    {/* Tags String */}
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Tags (comma separated)</label>
                      <input 
                        type="text" 
                        value={formFields.tagsString}
                        onChange={(e) => setFormFields(prev => ({ ...prev, tagsString: e.target.value }))}
                        placeholder="e.g. yoga, pmos, meditation, daily"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-pink-400"
                      />
                    </div>

                    {/* Featured / Active Toggles */}
                    <div className="flex gap-6 md:col-span-2 pt-2">
                      <label className="flex items-center gap-2.5 cursor-pointer select-none text-xs font-bold uppercase tracking-wider text-slate-600">
                        <input 
                          type="checkbox"
                          checked={formFields.isFeatured}
                          onChange={(e) => setFormFields(prev => ({ ...prev, isFeatured: e.target.checked }))}
                          className="w-4.5 h-4.5 text-pink-500 focus:ring-pink-400 rounded border-slate-200"
                        />
                        Featured Class
                      </label>

                      <label className="flex items-center gap-2.5 cursor-pointer select-none text-xs font-bold uppercase tracking-wider text-slate-600">
                        <input 
                          type="checkbox"
                          checked={formFields.isActive}
                          onChange={(e) => setFormFields(prev => ({ ...prev, isActive: e.target.checked }))}
                          className="w-4.5 h-4.5 text-pink-500 focus:ring-pink-400 rounded border-slate-200"
                        />
                        Active / Visible
                      </label>
                    </div>

                  </div>

                  {/* Actions */}
                  <div className="flex gap-4 pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="flex-1 py-3.5 bg-slate-50 text-slate-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-100 transition-all"
                    >
                      Cancel
                    </button>
                    
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 py-3.5 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                    >
                      {loading && <Loader2 className="w-4 h-4 animate-spin" />} Save Changes
                    </button>
                  </div>

                </form>

              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default ClassManagement;
