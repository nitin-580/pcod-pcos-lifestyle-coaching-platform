'use client';

import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Briefcase, 
  RefreshCw, 
  Loader2, 
  LogOut, 
  Activity, 
  UserPlus, 
  Calendar, 
  Video, 
  Share2, 
  UserCircle, 
  Sparkles, 
  Coins,
  Menu,
  X
} from 'lucide-react';

interface AdminSidebarProps {
  activeTab: 'registrations' | 'blogs' | 'careers' | 'enrollments' | 'doctor-requests' | 'appointments' | 'classes' | 'referrals' | 'patients' | 'banners' | 'doctor-earnings' | 'diet-plans';
  setActiveTab: (tab: 'registrations' | 'blogs' | 'careers' | 'enrollments' | 'doctor-requests' | 'appointments' | 'classes' | 'referrals' | 'patients' | 'banners' | 'doctor-earnings' | 'diet-plans') => void;
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
  const [isOpen, setIsOpen] = useState(false);

  interface MenuItem {
    id: AdminSidebarProps['activeTab'];
    label: string;
    icon: React.ComponentType<any>;
    highlight?: boolean;
    pink?: boolean;
    green?: boolean;
  }

  const menuItems: MenuItem[] = [
    { id: 'registrations', label: 'Registrations', icon: LayoutDashboard },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'patients', label: 'Patients', icon: UserCircle },
    { id: 'diet-plans', label: 'Diet Plans', icon: Sparkles, highlight: true },
    { id: 'classes', label: 'Classes', icon: Video },
    { id: 'enrollments', label: 'Enrollments', icon: Activity },
    { id: 'blogs', label: 'Blogs', icon: FileText },
    { id: 'careers', label: 'Careers', icon: Briefcase },
    { id: 'doctor-requests', label: 'Doctors', icon: UserPlus },
    { id: 'doctor-earnings', label: 'Doc Finance', icon: Coins, green: true },
    { id: 'referrals', label: 'Referrals', icon: Share2 },
    { id: 'banners', label: 'Banners', icon: Sparkles, pink: true },
  ];

  const handleTabClick = (tabId: typeof activeTab) => {
    setActiveTab(tabId);
    setIsOpen(false);
  };

  return (
    <>
      {/* MOBILE TOP BAR */}
      <div className="md:hidden flex items-center justify-between px-6 py-4 bg-white border-b border-slate-100 sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsOpen(true)}
            className="p-2 -ml-2 text-slate-500 hover:text-slate-900 rounded-xl hover:bg-slate-50 transition"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
            <div className="w-7 h-7 bg-slate-900 rounded-lg flex items-center justify-center text-white text-[10px] font-bold">WC</div>
            WOMBCARE <span className="text-[10px] font-bold text-slate-400">ADMIN</span>
          </h1>
        </div>

        <button 
          onClick={onRefresh}
          disabled={loading}
          className="p-2 text-slate-400 hover:text-slate-900 rounded-xl hover:bg-slate-50 transition disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <RefreshCw className="w-5 h-5" />}
        </button>
      </div>

      {/* MOBILE DRAWER BACKDROP */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          className="md:hidden fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 transition-opacity"
        />
      )}

      {/* MOBILE SIDEBAR DRAWER */}
      <div className={`fixed inset-y-0 left-0 w-72 bg-white z-50 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:hidden flex flex-col shadow-2xl`}>
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h1 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
            <div className="w-7 h-7 bg-slate-900 rounded-lg flex items-center justify-center text-white text-[10px] font-bold">WC</div>
            WOMBCARE <span className="text-[10px] font-bold text-slate-400">ADMIN</span>
          </h1>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-2 text-slate-400 hover:text-slate-900 rounded-xl hover:bg-slate-50 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Nav List */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isSelected = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  isSelected 
                    ? item.highlight 
                      ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md shadow-purple-100/30'
                      : 'bg-slate-900 text-white shadow-md shadow-slate-200'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${
                  isSelected 
                    ? 'text-current' 
                    : item.highlight 
                      ? 'text-purple-500' 
                      : item.pink 
                        ? 'text-pink-500' 
                        : item.green 
                          ? 'text-emerald-500' 
                          : 'text-slate-400'
                }`} />
                {item.label}
              </button>
            );
          })}
        </div>

        <div className="p-6 border-t border-slate-100 space-y-3">
          <button 
            onClick={onRefresh}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl text-xs font-bold uppercase tracking-wider transition disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin text-slate-400" /> : <RefreshCw className="w-4 h-4 text-slate-400" />}
            Refresh Data
          </button>
          
          <button 
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl text-xs font-bold uppercase tracking-wider transition"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>

      {/* DESKTOP FIXED SIDEBAR */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 bg-white border-r border-slate-100 shadow-sm z-30">
        {/* Brand Header */}
        <div className="px-6 py-6 border-b border-slate-100">
          <h1 className="text-xl font-black text-slate-900 tracking-tighter flex items-center gap-2.5">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white text-xs font-bold">WC</div>
            WOMBCARE <span className="text-slate-300 font-bold text-xs uppercase">ADMIN</span>
          </h1>
        </div>

        {/* Scrollable Nav List */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isSelected = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  isSelected 
                    ? item.highlight 
                      ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg shadow-purple-100/40'
                      : 'bg-slate-900 text-white shadow-lg shadow-slate-900/10'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50/70'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${
                  isSelected 
                    ? 'text-current' 
                    : item.highlight 
                      ? 'text-purple-500' 
                      : item.pink 
                        ? 'text-pink-500' 
                        : item.green 
                          ? 'text-emerald-500' 
                          : 'text-slate-400'
                }`} />
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Footer Area */}
        <div className="p-6 border-t border-slate-100 space-y-3">
          <button 
            onClick={onRefresh}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl text-xs font-bold uppercase tracking-wider transition disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin text-slate-400" /> : <RefreshCw className="w-4 h-4 text-slate-400" />}
            Refresh Data
          </button>
          
          <button 
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-rose-50 hover:bg-rose-100 border border-rose-100/35 text-rose-600 rounded-xl text-xs font-bold uppercase tracking-wider transition"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;
