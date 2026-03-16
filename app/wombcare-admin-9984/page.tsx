'use client';

import React, { useState, useEffect } from 'react';
import AdminTable, { Registration } from '@/components/AdminTable';
import { Sparkles, Key, LogOut, RefreshCw, Loader2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const BACKEND_URL = 'https://womb-care-backend-76858014616.us-central1.run.app/api/admin/users';

export default function AdminPage() {
  const [apiKey, setApiKey] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const savedKey = sessionStorage.getItem('pcod_admin_key');
    if (savedKey) {
      setApiKey(savedKey);
      setIsAuthorized(true);
      fetchData(savedKey);
    }
  }, []);

  const fetchData = async (key: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(BACKEND_URL, {
        headers: {
          'x-admin-api-key': key,
        },
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          throw new Error('Invalid API Key. Access denied.');
        }
        throw new Error('Failed to fetch data. Please try again later.');
      }

      const result = await response.json();
      setRegistrations(result.data || []);
    } catch (err: any) {
      setError(err.message);
      if (err.message.includes('Access denied')) {
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    
    setApiKey(inputValue);
    setIsAuthorized(true);
    sessionStorage.setItem('pcod_admin_key', inputValue);
    fetchData(inputValue);
  };

  const handleLogout = () => {
    setApiKey('');
    setInputValue('');
    setIsAuthorized(false);
    setRegistrations([]);
    sessionStorage.removeItem('pcod_admin_key');
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full"
        >
          <div className="bg-white rounded-[2rem] shadow-xl border border-slate-100 p-10 text-center">
            <div className="w-16 h-16 bg-gradient-to-tr from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-6 shadow-lg shadow-pink-100">
              <Key className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800 mb-2">Admin Access</h1>
            <p className="text-slate-500 mb-8">Enter your API key to view registrations.</p>
            
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="relative">
                <input
                  type="password"
                  placeholder="API Key"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all pr-12 text-slate-800"
                  autoFocus
                />
                <Key className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
              </div>
              <button
                type="submit"
                className="w-full bg-slate-900 text-white py-4 rounded-2xl font-semibold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 active:scale-[0.98]"
              >
                Authenticate
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFCFD] font-sans pb-20">
      {/* Header */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="bg-gradient-to-br from-pink-500 to-purple-600 p-2 rounded-xl text-white shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold text-slate-800">
              WombCare <span className="text-pink-500 text-sm font-medium ml-2 px-2 py-0.5 bg-pink-50 rounded-lg">Admin</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => fetchData(apiKey)}
              disabled={loading}
              className="p-2.5 text-slate-500 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all"
              title="Refresh Data"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <div className="h-6 w-px bg-slate-100 mx-2" />
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all font-medium"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 pt-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <h2 className="text-3xl font-bold text-slate-800 mb-2">Early Access Registrations</h2>
            <p className="text-slate-500">Manage and track your program's growth.</p>
          </div>
          
          <div className="bg-white border border-slate-100 rounded-2xl p-4 flex gap-10 shadow-sm">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Users</p>
              <p className="text-2xl font-bold text-slate-800">{registrations.length}</p>
            </div>
            <div className="w-px h-10 bg-slate-100" />
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Last 24h</p>
              <p className="text-2xl font-bold text-slate-800">
                {registrations.filter(r => {
                  const day = 24 * 60 * 60 * 1000;
                  return new Date().getTime() - new Date(r.createdAt).getTime() < day;
                }).length}
              </p>
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {error ? (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-rose-50 border border-rose-100 p-6 rounded-2xl flex items-center gap-4 text-rose-700 max-w-2xl mx-auto"
            >
              <AlertCircle className="w-6 h-6 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-semibold">Sync Error</p>
                <p className="text-sm opacity-90">{error}</p>
              </div>
              <button 
                onClick={() => fetchData(apiKey)}
                className="px-4 py-2 bg-rose-100 hover:bg-rose-200 rounded-xl text-sm font-bold transition-colors"
              >
                Retry
              </button>
            </motion.div>
          ) : loading && registrations.length === 0 ? (
            <div className="py-40 flex flex-col items-center justify-center gap-4 text-slate-400">
              <Loader2 className="w-10 h-10 animate-spin text-purple-500" />
              <p className="font-medium">Fetching secure data...</p>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <AdminTable data={registrations} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
