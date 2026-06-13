'use client';

import React from 'react';
import { LayoutDashboard, FileText, Briefcase, RefreshCw, Loader2, LogOut, Activity, UserPlus, Calendar, Video, Share2, UserCircle, Sparkles, Coins } from 'lucide-react';

interface AdminSidebarProps {
  activeTab: 'registrations' | 'blogs' | 'careers' | 'enrollments' | 'doctor-requests' | 'appointments' | 'classes' | 'referrals' | 'patients' | 'banners' | 'doctor-earnings';
  setActiveTab: (tab: 'registrations' | 'blogs' | 'careers' | 'enrollments' | 'doctor-requests' | 'appointments' | 'classes' | 'referrals' | 'patients' | 'banners' | 'doctor-earnings') => void;
  loading: boolean;
  onRefresh: () => void;
  onLogout: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  setActiveTab,
  loading,
  onRefresh,
  onLogout
}) => {
  return (
    <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-8">
        <h1 className="text-xl font-black text-slate-900 tracking-tighter flex items-center gap-2">
          <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white text-xs">WC</div>
          WOMBCARE <span className="text-slate-300 font-medium">ADMIN</span>
        </h1>
        
        <div className="hidden md:flex items-center gap-1 p-1 bg-slate-50 rounded-xl overflow-x-auto max-w-[70vw] md:max-w-none">
          <button 
            onClick={() => setActiveTab('registrations')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 flex-shrink-0 ${activeTab === 'registrations' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <LayoutDashboard className="w-4 h-4" /> Registrations
          </button>
          
          <button 
            onClick={() => setActiveTab('appointments')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 flex-shrink-0 ${activeTab === 'appointments' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <Calendar className="w-4 h-4" /> Appointments
          </button>

          <button 
            onClick={() => setActiveTab('blogs')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 flex-shrink-0 ${activeTab === 'blogs' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <FileText className="w-4 h-4" /> Blogs
          </button>
          
          <button 
            onClick={() => setActiveTab('classes')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 flex-shrink-0 ${activeTab === 'classes' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <Video className="w-4 h-4" /> Classes
          </button>

          <button 
            onClick={() => setActiveTab('careers')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 flex-shrink-0 ${activeTab === 'careers' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <Briefcase className="w-4 h-4" /> Careers
          </button>
          
          <button 
            onClick={() => setActiveTab('enrollments')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 flex-shrink-0 ${activeTab === 'enrollments' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <Activity className="w-4 h-4" /> Enrollments
          </button>

          <button 
            onClick={() => setActiveTab('patients')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 flex-shrink-0 ${activeTab === 'patients' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <UserCircle className="w-4 h-4" /> Patients
          </button>

          <button 
            onClick={() => setActiveTab('doctor-requests')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 flex-shrink-0 ${activeTab === 'doctor-requests' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <UserPlus className="w-4 h-4" /> Doctors
          </button>

          <button 
            onClick={() => setActiveTab('doctor-earnings')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 flex-shrink-0 ${activeTab === 'doctor-earnings' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <Coins className="w-4 h-4 text-emerald-500" /> Doc Finance
          </button>
          
          <button 
            onClick={() => setActiveTab('referrals')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 flex-shrink-0 ${activeTab === 'referrals' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <Share2 className="w-4 h-4" /> Referrals
          </button>

          <button 
            onClick={() => setActiveTab('banners')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 flex-shrink-0 ${activeTab === 'banners' ? 'bg-white text-slate-900 shadow-sm font-bold' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <Sparkles className="w-4 h-4 text-pink-500" /> Banners
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button 
          onClick={onRefresh}
          disabled={loading}
          className="p-2.5 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <RefreshCw className="w-5 h-5" />}
        </button>
        <button 
          onClick={onLogout}
          className="flex items-center gap-2 px-5 py-2.5 text-rose-500 hover:bg-rose-50 rounded-xl font-bold transition-all"
        >
          <LogOut className="w-4 h-4" /> 
          <span className="hidden md:inline">Logout</span>
        </button>
      </div>
    </nav>
  );
};

export default AdminSidebar;
