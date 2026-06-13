'use client';

import React, { useState, useEffect } from 'react';
import { 
  Coins, Landmark, Plus, Save, User, FileText, Phone, 
  Mail, Award, CheckCircle, AlertCircle, Loader2, IndianRupee 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getPublicApiBase } from '@/lib/api-config';

interface Doctor {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  credentials: string;
  referralCode: string;
  createdAt: string;
}

interface Earning {
  id: string;
  doctorId: string;
  amount: number;
  description: string;
  status: 'processed' | 'pending' | 'failed' | 'withdrawn';
  date: string;
}

interface DoctorFinanceProps {
  apiKey: string;
}

export default function DoctorFinance({ apiKey }: DoctorFinanceProps) {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>('');
  const [earnings, setEarnings] = useState<Earning[]>([]);
  const [totalEarnings, setTotalEarnings] = useState<number>(0);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [loadingEarnings, setLoadingEarnings] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Bank Form State
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');

  // Add Earning Form State
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  // Fetch doctors on mount
  useEffect(() => {
    fetchDoctors();
  }, []);

  // Fetch earnings and bank details when doctor selection changes
  useEffect(() => {
    if (selectedDoctorId) {
      const selectedDoc = doctors.find(d => d.id === selectedDoctorId);
      if (selectedDoc) {
        // Parse bank details from credentials
        try {
          const parsed = JSON.parse(selectedDoc.credentials || '{}');
          if (parsed && typeof parsed === 'object') {
            setBankName(parsed.bankName || '');
            setAccountNumber(parsed.accountNumber || '');
            setIfscCode(parsed.ifscCode || '');
          } else {
            resetBankForm();
          }
        } catch (e) {
          resetBankForm();
        }
      }
      fetchDoctorEarnings(selectedDoctorId);
    } else {
      setEarnings([]);
      setTotalEarnings(0);
      resetBankForm();
    }
  }, [selectedDoctorId, doctors]);

  const resetBankForm = () => {
    setBankName('');
    setAccountNumber('');
    setIfscCode('');
  };

  const fetchDoctors = async () => {
    setLoadingDoctors(true);
    setError(null);
    try {
      const response = await fetch(`${getPublicApiBase()}/doctors`, {
        headers: { 'x-admin-api-key': apiKey }
      });
      const result = await response.json();
      if (result.success) {
        setDoctors(result.data || []);
        if (result.data && result.data.length > 0) {
          setSelectedDoctorId(result.data[0].id);
        }
      } else {
        setError(result.message || 'Failed to fetch doctors');
      }
    } catch (err: any) {
      console.error(err);
      setError('Error connecting to server to fetch doctors');
    } finally {
      setLoadingDoctors(false);
    }
  };

  const fetchDoctorEarnings = async (doctorId: string) => {
    setLoadingEarnings(true);
    setError(null);
    try {
      const response = await fetch(`${getPublicApiBase()}/doctors/admin/${doctorId}/earnings`, {
        headers: { 'x-admin-api-key': apiKey }
      });
      const result = await response.json();
      if (result.success) {
        setEarnings(result.earnings || []);
        setTotalEarnings(result.totalEarnings || 0);
      } else {
        setError(result.message || 'Failed to fetch doctor earnings');
      }
    } catch (err: any) {
      console.error(err);
      setError('Error fetching doctor earnings');
    } finally {
      setLoadingEarnings(false);
    }
  };

  const handleUpdateBankDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoctorId) return;
    setActionLoading(true);
    setError(null);
    setSuccessMessage(null);

    const selectedDoc = doctors.find(d => d.id === selectedDoctorId);
    if (!selectedDoc) return;

    let credentialsObj: any = {};
    try {
      credentialsObj = JSON.parse(selectedDoc.credentials || '{}');
      if (typeof credentialsObj !== 'object' || credentialsObj === null) {
        credentialsObj = {};
      }
    } catch (e) {
      // In case credentials is a plain text string instead of JSON
      if (selectedDoc.credentials) {
        credentialsObj = { originalText: selectedDoc.credentials };
      }
    }

    credentialsObj.bankName = bankName.trim();
    credentialsObj.accountNumber = accountNumber.trim();
    credentialsObj.ifscCode = ifscCode.trim();

    try {
      const response = await fetch(`${getPublicApiBase()}/doctors/admin/${selectedDoctorId}/profile`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-api-key': apiKey
        },
        body: JSON.stringify({
          credentials: JSON.stringify(credentialsObj)
        })
      });

      const result = await response.json();
      if (result.success) {
        setSuccessMessage('Bank account details updated successfully.');
        // Update local doctor object state
        setDoctors(prev => prev.map(d => {
          if (d.id === selectedDoctorId) {
            return { ...d, credentials: JSON.stringify(credentialsObj) };
          }
          return d;
        }));
      } else {
        setError(result.message || 'Failed to update bank details');
      }
    } catch (err: any) {
      console.error(err);
      setError('Error sending request to update bank details');
    } finally {
      setActionLoading(false);
    }
  };

  const handleAddEarning = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoctorId || !amount) return;
    setActionLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch(`${getPublicApiBase()}/doctors/admin/earnings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-api-key': apiKey
        },
        body: JSON.stringify({
          doctorId: selectedDoctorId,
          amount: parseFloat(amount),
          description: description.trim() || 'Referral Commission',
          status: 'processed',
          date: new Date().toISOString()
        })
      });

      const result = await response.json();
      if (result.success) {
        setSuccessMessage(`Commission of ₹${amount} added and transferred successfully.`);
        setAmount('');
        setDescription('');
        // Refresh earnings history
        fetchDoctorEarnings(selectedDoctorId);
      } else {
        setError(result.message || 'Failed to add earning record');
      }
    } catch (err: any) {
      console.error(err);
      setError('Error sending request to add earning');
    } finally {
      setActionLoading(false);
    }
  };

  const selectedDoctor = doctors.find(d => d.id === selectedDoctorId);

  return (
    <div className="space-y-8 font-sans text-slate-800">
      {/* Messages */}
      <AnimatePresence mode="wait">
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl flex items-center gap-3"
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-500" />
            <span className="font-semibold text-sm">{error}</span>
          </motion.div>
        )}
        {successMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-2xl flex items-center gap-3"
          >
            <CheckCircle className="w-5 h-5 flex-shrink-0 text-emerald-500" />
            <span className="font-semibold text-sm">{successMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Doctor Selector & Info Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Select Medical Provider
              </label>
              {loadingDoctors ? (
                <div className="flex items-center justify-center p-4 bg-slate-50 rounded-2xl">
                  <Loader2 className="w-6 h-6 animate-spin text-pink-500" />
                </div>
              ) : (
                <select 
                  value={selectedDoctorId}
                  onChange={(e) => setSelectedDoctorId(e.target.value)}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-pink-500 outline-none transition-all font-semibold text-slate-700"
                >
                  <option value="">-- Choose a Doctor --</option>
                  {doctors.map(doc => (
                    <option key={doc.id} value={doc.id}>{doc.name} ({doc.specialization})</option>
                  ))}
                </select>
              )}
            </div>

            {selectedDoctor && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="pt-6 border-t border-slate-50 space-y-5"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-tr from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center text-white shadow-md shadow-pink-100">
                    <User className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg">{selectedDoctor.name}</h3>
                    <p className="text-slate-400 text-sm font-semibold flex items-center gap-1">
                      <Award className="w-3.5 h-3.5 text-pink-500" /> {selectedDoctor.specialization}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-3 text-sm text-slate-500">
                    <Mail className="w-4 h-4 text-slate-400" />
                    <span>{selectedDoctor.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-500">
                    <Phone className="w-4 h-4 text-slate-400" />
                    <span>{selectedDoctor.phone || 'No phone number'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <FileText className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-500">Referral Code:</span>
                    <span className="px-2 py-0.5 bg-pink-50 text-pink-600 rounded-md font-bold text-xs">
                      {selectedDoctor.referralCode}
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {selectedDoctor && (
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 p-6 rounded-[2rem] text-white shadow-xl flex flex-col justify-between h-44"
            >
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-xs font-black uppercase tracking-widest">Total Settled Earnings</span>
                <Coins className="w-6 h-6 text-pink-400" />
              </div>
              <div>
                <p className="text-4xl font-extrabold text-white flex items-center gap-0.5">
                  <IndianRupee className="w-8 h-8 text-pink-400 flex-shrink-0" />
                  <span>{totalEarnings.toLocaleString('en-IN')}</span>
                </p>
                <p className="text-slate-400 text-xs font-semibold mt-1">Direct bank transfers processed</p>
              </div>
            </motion.div>
          )}
        </div>

        {/* Right Side: Bank Configuration & Earnings Adding Forms */}
        <div className="lg:col-span-2 space-y-8">
          
          {selectedDoctorId ? (
            <>
              {/* Form 1: Bank Details Configuration */}
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-slate-50">
                  <Landmark className="w-6 h-6 text-pink-500" />
                  <h3 className="font-extrabold text-slate-900 text-xl">Payout Bank Account</h3>
                </div>

                <form onSubmit={handleUpdateBankDetails} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-1">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                      Bank Name
                    </label>
                    <input 
                      type="text" 
                      placeholder="e.g. HDFC Bank" 
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      required
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none transition-all font-semibold"
                    />
                  </div>

                  <div className="md:col-span-1">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                      Account Number
                    </label>
                    <input 
                      type="text" 
                      placeholder="e.g. 50100293849182" 
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      required
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none transition-all font-semibold"
                    />
                  </div>

                  <div className="md:col-span-1">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                      IFSC Code
                    </label>
                    <input 
                      type="text" 
                      placeholder="e.g. HDFC0000241" 
                      value={ifscCode}
                      onChange={(e) => setIfscCode(e.target.value)}
                      required
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none transition-all font-semibold"
                    />
                  </div>

                  <div className="md:col-span-3 flex justify-end">
                    <button 
                      type="submit" 
                      disabled={actionLoading}
                      className="flex items-center gap-2 px-6 py-3.5 bg-slate-900 text-white hover:bg-slate-800 rounded-2xl font-bold transition-all disabled:opacity-50 shadow-md shadow-slate-100 hover:scale-[1.01] active:scale-[0.99]"
                    >
                      {actionLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                      Save Bank Details
                    </button>
                  </div>
                </form>
              </div>

              {/* Form 2: Add Payout/Earning */}
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-slate-50">
                  <Coins className="w-6 h-6 text-pink-500" />
                  <h3 className="font-extrabold text-slate-900 text-xl">Record New Earning / Commission</h3>
                </div>

                <form onSubmit={handleAddEarning} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                  <div className="md:col-span-1">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                      Amount (₹)
                    </label>
                    <input 
                      type="number" 
                      placeholder="e.g. 1500" 
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      required
                      min="1"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none transition-all font-semibold"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                      Payout Description
                    </label>
                    <div className="flex gap-4">
                      <input 
                        type="text" 
                        placeholder="e.g. Referral reward for PCOS Program enrollment" 
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        className="flex-1 px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none transition-all font-semibold"
                      />
                      <button 
                        type="submit" 
                        disabled={actionLoading}
                        className="flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl font-bold transition-all disabled:opacity-50 shadow-md shadow-pink-100 hover:scale-[1.01] active:scale-[0.99] flex-shrink-0"
                      >
                        {actionLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                        Add & Transfer
                      </button>
                    </div>
                  </div>
                </form>
              </div>

              {/* Section 3: Payout Transaction History */}
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
                <h3 className="font-extrabold text-slate-900 text-lg">Earning & Payout History</h3>
                
                {loadingEarnings ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-pink-500" />
                  </div>
                ) : earnings.length === 0 ? (
                  <div className="text-center py-12 bg-slate-50 rounded-2xl">
                    <p className="text-slate-400 font-medium">No payout transactions recorded for this doctor</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-100 text-xs font-bold uppercase tracking-wider text-slate-400">
                          <th className="pb-3 pl-4">Date</th>
                          <th className="pb-3">Description</th>
                          <th className="pb-3">Amount</th>
                          <th className="pb-3 pr-4">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {earnings.map((e) => (
                          <tr key={e.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-all text-sm">
                            <td className="py-4 pl-4 font-semibold text-slate-500">
                              {new Date(e.date).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                              })}
                            </td>
                            <td className="py-4 font-bold text-slate-700">{e.description}</td>
                            <td className="py-4 font-black text-slate-900">₹{e.amount.toLocaleString('en-IN')}</td>
                            <td className="py-4 pr-4">
                              <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-black uppercase tracking-wider">
                                <CheckCircle className="w-3.5 h-3.5" /> Transferred
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="h-96 flex flex-col items-center justify-center bg-white border border-slate-100 rounded-[2.5rem] shadow-sm text-center p-8">
              <Landmark className="w-16 h-16 text-slate-200 mb-4" />
              <h3 className="text-xl font-bold text-slate-800 mb-2">No Doctor Selected</h3>
              <p className="text-slate-400 max-w-sm">
                Select a medical provider from the left sidebar to manage their bank accounts, payout transactions, and view financials.
              </p>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
