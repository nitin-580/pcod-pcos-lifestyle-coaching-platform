'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase-client';
import { 
  UserCircle, Mail, Phone, Calendar, Clipboard, 
  MapPin, Sparkles, Check, X, Edit2, Loader2, ArrowRight, UserPlus 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Doctor {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  credentials: string;
  referralCode: string;
  created_at: string;
}

interface DoctorJoinRequest {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  specialization: string;
  qualification: string;
  experienceYears: number;
  hospitalClinic: string;
  city: string;
  consultationMode: string;
  medicalRegistrationNumber: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

interface DoctorManagementProps {
  apiKey: string;
  doctorRequests: DoctorJoinRequest[];
  onUpdateStatus: (id: string, status: string) => Promise<void>;
}

export default function DoctorManagement({ 
  apiKey, 
  doctorRequests, 
  onUpdateStatus 
}: DoctorManagementProps) {
  const [subTab, setSubTab] = useState<'active' | 'requests'>('active');
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loadingDocs, setLoadingDocs] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<Doctor | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // Doctor Edit Form State
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    phone: '',
    specialization: '',
    credentials: '',
    referralCode: ''
  });
  
  // Mapping Tool States
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [selectedRegId, setSelectedRegId] = useState('');
  const [mappingType, setMappingType] = useState<'patient' | 'referral'>('patient');
  const [isMapping, setIsMapping] = useState(false);
  const [mappingMessage, setMappingMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchActiveDoctors();
    fetchRegistrations();
  }, []);

  const fetchActiveDoctors = async () => {
    setLoadingDocs(true);
    try {
      const res = await fetch('/api/admin/doctors');
      const data = await res.json();
      if (data.success) {
        setDoctors(data.doctors || []);
        setRegistrations(data.registrations || []);
      }
    } catch (err) {
      console.error('Error fetching doctors:', err);
    } finally {
      setLoadingDocs(false);
    }
  };

  const fetchRegistrations = async () => {
    // Loaded in fetchActiveDoctors
  };

  const formatTitleCase = (str: string) => {
    if (!str) return '—';
    // If the string is all uppercase or mixed caps, normalize it to Title Case
    return str.toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  const handleEditClick = (doc: Doctor) => {
    setEditForm({
      name: doc.name || '',
      email: doc.email || '',
      phone: doc.phone || '',
      specialization: doc.specialization || '',
      credentials: doc.credentials || '',
      referralCode: doc.referralCode || ''
    });
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedDoc) return;
    setLoadingDocs(true);
    try {
      const res = await fetch('/api/admin/doctors', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedDoc.id,
          name: editForm.name,
          email: editForm.email,
          phone: editForm.phone,
          specialization: editForm.specialization,
          credentials: editForm.credentials,
          referralCode: editForm.referralCode
        })
      });
      const data = await res.json();
      if (data.success) {
        setSelectedDoc(prev => prev ? { ...prev, ...editForm } : null);
        setIsEditing(false);
        await fetchActiveDoctors();
      } else {
        throw new Error(data.message);
      }
    } catch (err: any) {
      alert('Failed to update doctor: ' + err.message);
    } finally {
      setLoadingDocs(false);
    }
  };

  const handleMapUser = async () => {
    if (!selectedDoc || !selectedRegId) return;
    setIsMapping(true);
    setMappingMessage(null);

    const user = registrations.find(r => r.id === selectedRegId);
    if (!user) return;

    try {
      const res = await fetch('/api/admin/doctors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: mappingType,
          user,
          doctorId: selectedDoc.id,
          doctorName: selectedDoc.name,
          doctorReferralCode: selectedDoc.referralCode
        })
      });
      const data = await res.json();
      if (data.success) {
        setMappingMessage({ 
          type: 'success', 
          text: mappingType === 'patient' 
            ? `Successfully mapped ${user.name} as a Patient to Dr. ${selectedDoc.name}` 
            : `Successfully mapped ${user.name} in Referral Stage to Dr. ${selectedDoc.name}` 
        });
      } else {
        throw new Error(data.message);
      }
    } catch (err: any) {
      console.error(err);
      setMappingMessage({ type: 'error', text: err.message || 'Mapping failed.' });
    } finally {
      setIsMapping(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Sub Tabs */}
      <div className="flex justify-between items-center bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex gap-2">
          <button
            onClick={() => setSubTab('active')}
            className={`px-5 py-2.5 rounded-2xl text-sm font-semibold transition ${
              subTab === 'active' 
                ? 'bg-slate-900 text-white' 
                : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            Active Doctors ({doctors.length})
          </button>
          <button
            onClick={() => setSubTab('requests')}
            className={`px-5 py-2.5 rounded-2xl text-sm font-semibold transition ${
              subTab === 'requests' 
                ? 'bg-slate-900 text-white' 
                : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            Join Requests ({doctorRequests.length})
          </button>
        </div>
      </div>

      {subTab === 'active' ? (
        loadingDocs ? (
          <div className="flex items-center justify-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
            <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
          </div>
        ) : doctors.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-3xl border border-slate-100 shadow-sm text-slate-400">
            <p className="text-lg">No active doctors found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctors.map((doc) => (
              <div
                key={doc.id}
                onClick={() => setSelectedDoc(doc)}
                className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 font-bold shrink-0">
                      {doc.name ? doc.name.charAt(0).toUpperCase() : 'D'}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 line-clamp-1">{formatTitleCase(doc.name)}</h3>
                      <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-purple-700 uppercase tracking-wider mt-1">
                        {formatTitleCase(doc.specialization || 'General Doctor')}
                      </span>
                    </div>
                  </div>

                  <hr className="border-slate-100 my-4" />

                  <div className="space-y-2 text-sm text-slate-500">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                      <span className="truncate">{doc.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>{doc.phone || '—'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clipboard className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>Code: <strong>{doc.referralCode || '—'}</strong></span>
                    </div>
                  </div>
                </div>

                <div className="text-[10px] text-slate-400 mt-4 text-right font-mono">
                  ID: #{doc.id.slice(0, 8)}
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        /* Requests sub-tab */
        <div className="space-y-6">
          {doctorRequests.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-slate-100">
              <UserPlus className="w-12 h-12 text-slate-200 mx-auto mb-4" />
              <p className="text-slate-400 font-medium">No pending doctor requests</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {doctorRequests.map((req) => (
                <div 
                  key={req.id} 
                  className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-slate-900">{formatTitleCase(req.fullName)}</h3>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${req.status === 'pending' ? 'bg-amber-50 text-amber-600' : req.status === 'approved' ? 'bg-green-50 text-green-600' : 'bg-rose-50 text-rose-600'}`}>
                        {req.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-2 text-sm text-slate-500">
                      <p><span className="font-bold text-slate-700">Email:</span> {req.email}</p>
                      <p><span className="font-bold text-slate-700">Specialization:</span> {formatTitleCase(req.specialization)}</p>
                      <p><span className="font-bold text-slate-700">Reg No:</span> {req.medicalRegistrationNumber}</p>
                      <p><span className="font-bold text-slate-700">Exp:</span> {req.experienceYears} years</p>
                    </div>
                  </div>

                  {req.status === 'pending' && (
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => onUpdateStatus(req.id, 'approved')}
                        className="p-3 bg-green-50 text-green-600 rounded-2xl hover:bg-green-100 transition shadow-sm"
                      >
                        <Check className="w-6 h-6" />
                      </button>
                      <button 
                        onClick={() => onUpdateStatus(req.id, 'rejected')}
                        className="p-3 bg-rose-50 text-rose-600 rounded-2xl hover:bg-rose-100 transition shadow-sm"
                      >
                        <X className="w-6 h-6" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Details / Edit / Mapping Modal */}
      <AnimatePresence>
        {selectedDoc && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between p-6 border-b border-slate-100 sticky top-0 bg-white z-10">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Dr. {formatTitleCase(selectedDoc.name)}</h3>
                  <p className="text-xs text-purple-600 font-bold uppercase tracking-wider mt-1">{formatTitleCase(selectedDoc.specialization)}</p>
                </div>
                <button
                  onClick={() => {
                    setSelectedDoc(null);
                    setIsEditing(false);
                    setMappingMessage(null);
                  }}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-50 transition"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-8 space-y-6">
                {isEditing ? (
                  /* Edit Details Section */
                  <div className="space-y-4">
                    <h4 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-2">Edit Doctor Details</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-slate-500">Name</label>
                        <input 
                          type="text" 
                          value={editForm.name} 
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                          className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-800 text-sm focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-slate-500">Email</label>
                        <input 
                          type="email" 
                          value={editForm.email} 
                          onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                          className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-800 text-sm focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-slate-500">Phone</label>
                        <input 
                          type="text" 
                          value={editForm.phone} 
                          onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                          className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-800 text-sm focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-slate-500">Referral Code</label>
                        <input 
                          type="text" 
                          value={editForm.referralCode} 
                          onChange={(e) => setEditForm({ ...editForm, referralCode: e.target.value })}
                          className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-800 text-sm focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-slate-500">Specialization</label>
                        <input 
                          type="text" 
                          value={editForm.specialization} 
                          onChange={(e) => setEditForm({ ...editForm, specialization: e.target.value })}
                          className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-800 text-sm focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-slate-500">Credentials</label>
                        <input 
                          type="text" 
                          value={editForm.credentials} 
                          onChange={(e) => setEditForm({ ...editForm, credentials: e.target.value })}
                          className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-800 text-sm focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-3 mt-4">
                      <button 
                        onClick={() => setIsEditing(false)} 
                        className="px-4 py-2 rounded-xl text-sm font-semibold border border-slate-200 text-slate-500 hover:bg-slate-50 transition"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={handleSaveEdit}
                        className="px-5 py-2 rounded-xl text-sm font-semibold bg-purple-600 text-white hover:bg-purple-700 transition"
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Display details */
                  <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                      <h4 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Details</h4>
                      <button 
                        onClick={() => handleEditClick(selectedDoc)} 
                        className="flex items-center gap-1.5 text-xs text-purple-600 font-bold hover:underline"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        Edit Details
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl text-sm">
                      <div><span className="text-slate-500">Full Name:</span> <strong className="text-slate-800">{formatTitleCase(selectedDoc.name)}</strong></div>
                      <div><span className="text-slate-500">Email:</span> <strong className="text-slate-800">{selectedDoc.email}</strong></div>
                      <div><span className="text-slate-500">Phone:</span> <strong className="text-slate-800">{selectedDoc.phone || '—'}</strong></div>
                      <div><span className="text-slate-500">Referral Code:</span> <strong className="text-slate-800">{selectedDoc.referralCode || '—'}</strong></div>
                      <div><span className="text-slate-500">Specialization:</span> <strong className="text-slate-800">{formatTitleCase(selectedDoc.specialization)}</strong></div>
                      <div><span className="text-slate-500">Credentials:</span> <strong className="text-slate-800">{selectedDoc.credentials || '—'}</strong></div>
                    </div>
                  </div>
                )}

                {/* Mapping Tool Section */}
                <div className="border-t border-slate-100 pt-6 space-y-4">
                  <h4 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Map Patient/Referral to Dr. {formatTitleCase(selectedDoc.name)}</h4>
                  
                  {mappingMessage && (
                    <div className={`p-4 rounded-xl text-sm ${mappingMessage.type === 'success' ? 'bg-green-50 border border-green-100 text-green-700' : 'bg-red-50 border border-red-100 text-red-700'}`}>
                      {mappingMessage.text}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-slate-500">Select User/Registration</label>
                      <select 
                        value={selectedRegId}
                        onChange={(e) => setSelectedRegId(e.target.value)}
                        className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-800 text-sm focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="">Select a user...</option>
                        {registrations.map(r => (
                          <option key={r.id} value={r.id}>
                            {r.name} ({r.email})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-slate-500">Mapping Stage</label>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setMappingType('patient')}
                          className={`flex-1 py-2.5 rounded-xl border text-sm font-semibold transition ${
                            mappingType === 'patient' 
                              ? 'bg-purple-600 border-purple-600 text-white' 
                              : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          Patient
                        </button>
                        <button
                          type="button"
                          onClick={() => setMappingType('referral')}
                          className={`flex-1 py-2.5 rounded-xl border text-sm font-semibold transition ${
                            mappingType === 'referral' 
                              ? 'bg-purple-600 border-purple-600 text-white' 
                              : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          Referral Stage
                        </button>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleMapUser}
                    disabled={isMapping || !selectedRegId}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-slate-900 text-white hover:bg-slate-800 rounded-xl font-bold transition disabled:opacity-50 disabled:cursor-not-allowed text-sm mt-2"
                  >
                    {isMapping ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Mapping user...
                      </>
                    ) : (
                      <>
                        <UserCircle className="w-4 h-4" />
                        Complete Doctor-User Mapping
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
