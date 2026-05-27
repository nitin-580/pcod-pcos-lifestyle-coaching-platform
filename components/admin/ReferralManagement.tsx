'use client';

import React, { useState, useEffect } from 'react';
import { Mail, Phone, User, Calendar, FileText, CheckCircle2, AlertCircle, XCircle, Search, RefreshCw, Sparkles, Key, UserCheck, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Referral {
  id: string;
  patientName: string;
  mobile: string;
  email: string;
  problem: string;
  doctorId: string;
  doctorReferralCode: string;
  referralStatus: 'pending' | 'contacted' | 'converted' | 'rejected' | 'inactive';
  convertedPatientId: string | null;
  createdAt: string;
  updatedAt: string;
}

interface ReferralManagementProps {
  apiKey: string;
}

export default function ReferralManagement({ apiKey }: ReferralManagementProps) {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Search and Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Conversion Success Modal
  const [conversionSuccess, setConversionSuccess] = useState<{
    isOpen: boolean;
    patientName: string;
    email: string;
    tempPassword?: string;
  }>({
    isOpen: false,
    patientName: '',
    email: ''
  });

  const fetchReferrals = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/admin-proxy/referrals?limit=100`, {
        headers: { 'x-admin-api-key': apiKey },
      });
      const result = await response.json();
      if (result.success) {
        setReferrals(result.data || []);
      } else {
        setError(result.message || 'Failed to fetch referrals');
      }
    } catch (err: any) {
      setError('Connection to WombCare Server failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (apiKey) {
      fetchReferrals();
    }
  }, [apiKey]);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin-proxy/referrals/${id}/status`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-api-key': apiKey 
        },
        body: JSON.stringify({ status: newStatus })
      });
      const result = await res.json();
      if (result.success) {
        // Refresh local data
        setReferrals(prev => 
          prev.map(ref => ref.id === id ? { ...ref, referralStatus: newStatus as any } : ref)
        );
      } else {
        alert(result.message || 'Failed to update referral status');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleConvertReferral = async (id: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin-proxy/referrals/convert/${id}`, {
        method: 'POST',
        headers: { 
          'x-admin-api-key': apiKey 
        }
      });
      const result = await res.json();
      if (result.success) {
        // Open Success credential card
        setConversionSuccess({
          isOpen: true,
          patientName: result.referral.patientName,
          email: result.referral.email,
          tempPassword: result.tempPassword
        });
        
        // Update local referrals status
        setReferrals(prev => 
          prev.map(ref => ref.id === id ? { ...ref, referralStatus: 'converted', convertedPatientId: result.referral.convertedPatientId } : ref)
        );
      } else {
        alert(result.message || 'Conversion failed');
      }
    } catch (err) {
      console.error(err);
      alert('Error during conversion process.');
    } finally {
      setLoading(false);
    }
  };

  // Filtered referrals logic
  const filteredReferrals = referrals.filter(ref => {
    const matchesSearch = 
      ref.patientName.toLowerCase().includes(searchQuery.toLowerCase()) || 
      ref.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ref.doctorReferralCode.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesStatus = statusFilter === 'all' ? true : ref.referralStatus === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'converted':
        return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'contacted':
        return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'rejected':
        return 'bg-rose-50 text-rose-700 border-rose-100';
      case 'pending':
        return 'bg-amber-50 text-amber-700 border-amber-100';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters and Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-2 p-1 bg-slate-50 rounded-xl overflow-x-auto">
          {['all', 'pending', 'contacted', 'converted', 'rejected'].map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all flex-shrink-0 ${
                statusFilter === tab
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search referrals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11 pr-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 w-full md:w-64 text-slate-800"
            />
          </div>
          <button
            onClick={fetchReferrals}
            disabled={loading}
            className="p-3 bg-slate-50 border border-slate-100 rounded-2xl hover:bg-slate-100 transition-all text-slate-600 flex items-center justify-center shrink-0 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-700 text-sm font-medium flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {/* Referrals Cards Grid */}
      {filteredReferrals.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-3xl border border-slate-100 shadow-sm">
          <AlertCircle className="w-12 h-12 text-slate-200 mx-auto mb-4" />
          <p className="text-slate-400 font-medium">No matching patient referrals found</p>
        </div>
      ) : (
        <div className="grid gap-6">
          <AnimatePresence mode="popLayout">
            {filteredReferrals.map((ref) => (
              <motion.div
                layout
                key={ref.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 hover:border-slate-200 hover:shadow-md transition-all"
              >
                <div className="flex-1 space-y-4 w-full">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <h3 className="text-xl font-black text-slate-900">{ref.patientName}</h3>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusBadgeClass(ref.referralStatus)}`}>
                        {ref.referralStatus}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100 uppercase tracking-wider">
                        Doc Code: {ref.doctorReferralCode}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-2 gap-x-6 text-sm text-slate-500">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                      <span className="truncate">{ref.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>{ref.mobile}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>{new Date(ref.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}</span>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50/60 rounded-2xl border border-slate-100/80 flex items-start gap-3">
                    <FileText className="w-4 h-4 text-slate-400 mt-1 shrink-0" />
                    <div>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Clinical Problem / Reason</span>
                      <p className="text-sm text-slate-600 font-medium leading-relaxed">{ref.problem}</p>
                    </div>
                  </div>
                </div>

                {/* Operations Section */}
                <div className="flex sm:flex-row items-center gap-3 w-full lg:w-auto shrink-0 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                  {ref.referralStatus === 'pending' && (
                    <>
                      <button
                        onClick={() => handleUpdateStatus(ref.id, 'contacted')}
                        className="px-5 py-3 text-xs font-bold text-blue-600 hover:bg-blue-50 border border-blue-100 rounded-2xl transition-all shadow-sm flex items-center gap-1.5 flex-1 sm:flex-none justify-center"
                      >
                        <Phone className="w-3.5 h-3.5" /> Mark Contacted
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(ref.id, 'rejected')}
                        className="px-5 py-3 text-xs font-bold text-rose-500 hover:bg-rose-50 border border-rose-100 rounded-2xl transition-all shadow-sm flex items-center gap-1.5 flex-1 sm:flex-none justify-center"
                      >
                        <XCircle className="w-3.5 h-3.5" /> Reject
                      </button>
                    </>
                  )}

                  {ref.referralStatus === 'contacted' && (
                    <button
                      onClick={() => handleUpdateStatus(ref.id, 'rejected')}
                      className="px-5 py-3 text-xs font-bold text-rose-500 hover:bg-rose-50 border border-rose-100 rounded-2xl transition-all shadow-sm flex items-center gap-1.5 flex-1 sm:flex-none justify-center"
                    >
                      <XCircle className="w-3.5 h-3.5" /> Reject
                    </button>
                  )}

                  {(ref.referralStatus === 'pending' || ref.referralStatus === 'contacted') && (
                    <button
                      onClick={() => handleConvertReferral(ref.id)}
                      className="px-6 py-3 text-xs font-black uppercase tracking-wider text-white bg-slate-900 hover:bg-slate-800 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 flex-1 sm:flex-none active:scale-[0.98]"
                    >
                      <UserCheck className="w-4 h-4" /> Convert to Patient
                    </button>
                  )}

                  {ref.referralStatus === 'converted' && (
                    <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-4 py-2.5 rounded-2xl border border-emerald-100 text-xs font-bold w-full lg:w-auto justify-center">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>Active WombCare Account</span>
                    </div>
                  )}

                  {ref.referralStatus === 'rejected' && (
                    <div className="flex items-center gap-2 text-rose-600 bg-rose-50 px-4 py-2.5 rounded-2xl border border-rose-100 text-xs font-bold w-full lg:w-auto justify-center">
                      <ShieldAlert className="w-4 h-4 shrink-0" />
                      <span>Rejected Request</span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Success Modal / Credentials Presenter */}
      <AnimatePresence>
        {conversionSuccess.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 max-w-lg w-full overflow-hidden"
            >
              <div className="bg-gradient-to-tr from-pink-500 to-purple-600 p-8 text-white text-center relative">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-black">Conversion Success!</h3>
                <p className="text-pink-100 text-sm mt-1">WombCare patient portal credentials generated successfully</p>
              </div>

              <div className="p-8 space-y-6">
                <div className="space-y-4">
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">Patient Name</span>
                    <span className="text-base font-bold text-slate-800">{conversionSuccess.patientName}</span>
                  </div>

                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">Login Username / Email</span>
                    <span className="text-base font-bold text-slate-800">{conversionSuccess.email}</span>
                  </div>

                  {conversionSuccess.tempPassword && (
                    <div className="bg-amber-50/50 p-5 rounded-2xl border border-amber-100/60 relative overflow-hidden">
                      <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 block mb-1">Temporary Account Password</span>
                      <div className="flex items-center gap-2">
                        <Key className="w-4 h-4 text-amber-500 shrink-0" />
                        <span className="text-lg font-black text-amber-800 font-mono tracking-widest">{conversionSuccess.tempPassword}</span>
                      </div>
                      <p className="text-[10px] text-amber-600/70 mt-2 font-medium">An automated onboarding email has been sent to this patient with login instructions.</p>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setConversionSuccess(prev => ({ ...prev, isOpen: false }))}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-2xl shadow-lg transition-all active:scale-[0.98]"
                >
                  Got it, close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
