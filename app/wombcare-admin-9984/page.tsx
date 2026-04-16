"use client"
import React, { useState, useEffect } from 'react';
import AdminTable, { Registration } from '@/components/AdminTable';
import { Key, RefreshCw, Loader2, UserPlus, Check, X, Mail, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CareerModal from '@/components/admin/CareerModal';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminSidebar from '@/components/admin/AdminSidebar';
import BlogList from '@/components/admin/BlogList';
import CareerList from '@/components/admin/CareerList';
import EnrollmentTable, { Enrollment } from '@/components/admin/EnrollmentTable';

import { useRouter } from 'next/navigation';
import { API_BASE, getPublicApiBase } from '@/lib/api-config';

interface Blog {
  id: string;
  title: string;
  content: string;
  authorName: string;
  createdAt: string;
  coverImage?: string;
  cover_image?: string;
  published?: boolean;
  contentType?: string;
  excerpt?: string;
}

export default function AdminPage() {
  const router = useRouter();
  const [apiKey, setApiKey] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [activeTab, setActiveTab] = useState<'registrations' | 'blogs' | 'careers' | 'enrollments' | 'doctor-requests' | 'appointments'>('registrations');
  
  // Data States
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [careers, setCareers] = useState<any[]>([]);
  const [doctorRequests, setDoctorRequests] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Career Form States
  const [isCareerModalOpen, setIsCareerModalOpen] = useState(false);
  const [editingCareer, setEditingCareer] = useState<any | null>(null);
  const [careerForm, setCareerForm] = useState({
    title: '',
    department: '',
    location: '',
    type: 'Full-time',
    description: '',
    requirements: [''],
    active: true
  });

  useEffect(() => {
    const savedKey = sessionStorage.getItem('pcod_admin_key');
    if (savedKey) {
      setApiKey(savedKey);
      setIsAuthorized(true);
      fetchInitialData(savedKey);
    }
  }, []);

  const fetchInitialData = async (key: string) => {
    setLoading(true);
    await Promise.all([
      fetchRegistrations(key),
      fetchBlogs(key),
      fetchCareers(key),
      fetchEnrollments(key),
      fetchDoctorRequests(key),
      fetchAdminAppointments(key)
    ]);
    setLoading(false);
  };

  const fetchRegistrations = async (key: string) => {
    try {
      const response = await fetch(`${API_BASE}/users`, {
        headers: { 'x-admin-api-key': key },
      });
      const result = await response.json();
      setRegistrations(result.data || []);
    } catch (err: any) {
      console.error('Fetch registrations error:', err);
    }
  };

  const fetchEnrollments = async (key: string) => {
    try {
      const response = await fetch(`${API_BASE}/admin/enrollments`, {
        headers: { 'x-admin-api-key': key },
      });
      const result = await response.json();
      setEnrollments(result.data || []);
    } catch (err: any) {
      console.error('Fetch enrollments error:', err);
    }
  };

  const fetchBlogs = async (key: string) => {
    try {
      const response = await fetch(`${API_BASE}/blogs`, {
        headers: { 'x-admin-api-key': key },
      });
      const result = await response.json();
      setBlogs(result.data || []);
    } catch (err: any) {
      console.error('Fetch blogs error:', err);
    }
  };

  const fetchCareers = async (key: string) => {
    try {
      const response = await fetch(`${API_BASE}/careers`, {
        headers: { 'x-admin-api-key': key },
      });
      const result = await response.json();
      setCareers(result.data || []);
    } catch (err: any) {
      console.error('Fetch careers error:', err);
    }
  };

  const fetchDoctorRequests = async (key: string) => {
    try {
      const response = await fetch(`${getPublicApiBase()}/doctors/admin/join-requests`, {
        headers: { 'x-admin-api-key': key },
      });
      const result = await response.json();
      setDoctorRequests(result.data || []);
    } catch (err: any) {
      console.error('Fetch doctor requests error:', err);
    }
  };

  const fetchAdminAppointments = async (key: string) => {
    try {
      const response = await fetch(`${API_BASE}/appointments/admin/all`, {
        headers: { 'x-admin-api-key': key },
      });
      const result = await response.json();
      setAppointments(result.data || []);
    } catch (err: any) {
      console.error('Fetch admin appointments error:', err);
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${getPublicApiBase()}/doctors/admin/join-requests`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-api-key': apiKey 
        },
        body: JSON.stringify({ id, status })
      });
      if (res.ok) {
        await fetchDoctorRequests(apiKey);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAppointmentStatus = async (id: string, status: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/appointments/admin/${id}/status`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-api-key': apiKey 
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        await fetchAdminAppointments(apiKey);
      }
    } catch (err) {
      console.error(err);
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
    fetchInitialData(inputValue);
  };

  const handleLogout = () => {
    setApiKey('');
    setInputValue('');
    setIsAuthorized(false);
    sessionStorage.removeItem('pcod_admin_key');
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md w-full">
          <div className="bg-white rounded-[2rem] shadow-xl border border-slate-100 p-10 text-center">
            <div className="w-16 h-16 bg-gradient-to-tr from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-6 shadow-lg shadow-pink-100">
              <Key className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800 mb-2">Admin Access</h1>
            <p className="text-slate-500 mb-8">Enter your API key to manage WombCare.</p>
            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="password"
                placeholder="API Key"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-pink-500 outline-none transition-all pr-12 text-slate-800"
                autoFocus
              />
              <button type="submit" className="w-full bg-slate-900 text-white py-4 rounded-2xl font-semibold hover:bg-slate-800 transition-all shadow-lg active:scale-[0.98]">
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
      <AdminSidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        loading={loading} 
        onRefresh={() => fetchInitialData(apiKey)}
        onLogout={handleLogout}
      />

      <main className="max-w-7xl mx-auto px-6 pt-10">
        <AdminHeader 
          activeTab={activeTab} 
          onNewBlog={() => router.push('/wombcare-admin-9984/blogs/new')}
          onNewCareer={() => { 
            setEditingCareer(null); 
            setIsCareerModalOpen(true); 
          }}
        />

        {activeTab === 'registrations' ? (
          <AdminTable data={registrations} />
        ) : activeTab === 'enrollments' ? (
          <EnrollmentTable data={enrollments} />
        ) : activeTab === 'blogs' ? (
          <BlogList blogs={blogs} loading={loading} onEdit={(blog) => router.push(`/wombcare-admin-9984/blogs/edit/${blog.id}`)} onDelete={() => {}} />
        ) : activeTab === 'doctor-requests' ? (
          <div className="space-y-6">
            {doctorRequests.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-slate-100">
                <UserPlus className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                <p className="text-slate-400 font-medium">No pending doctor requests</p>
              </div>
            ) : (
              <div className="grid gap-6">
                {doctorRequests.map((req) => (
                  <motion.div 
                    layout
                    key={req.id} 
                    className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-slate-900">{req.fullName}</h3>
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${req.status === 'pending' ? 'bg-amber-50 text-amber-600' : req.status === 'approved' ? 'bg-green-50 text-green-600' : 'bg-rose-50 text-rose-600'}`}>
                          {req.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-2 text-sm text-slate-500">
                        <p><span className="font-bold text-slate-700">Email:</span> {req.email}</p>
                        <p><span className="font-bold text-slate-700">Specialization:</span> {req.specialization}</p>
                        <p><span className="font-bold text-slate-700">Reg No:</span> {req.medicalRegistrationNumber}</p>
                        <p><span className="font-bold text-slate-700">Exp:</span> {req.experienceYears} years</p>
                      </div>
                    </div>

                    {req.status === 'pending' && (
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => handleUpdateStatus(req.id, 'approved')}
                          className="p-3 bg-green-50 text-green-600 rounded-2xl hover:bg-green-100 transition shadow-sm"
                        >
                          <Check className="w-6 h-6" />
                        </button>
                        <button 
                          onClick={() => handleUpdateStatus(req.id, 'rejected')}
                          className="p-3 bg-rose-50 text-rose-600 rounded-2xl hover:bg-rose-100 transition shadow-sm"
                        >
                          <X className="w-6 h-6" />
                        </button>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        ) : activeTab === 'appointments' ? (
          <div className="space-y-6">
            {appointments.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-slate-100">
                <Activity className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                <p className="text-slate-400 font-medium">No appointments scheduled</p>
              </div>
            ) : (
              <div className="grid gap-6">
                {appointments.map((appt) => (
                  <motion.div 
                    layout
                    key={appt.id} 
                    className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-slate-900">{appt.doctorName}</h3>
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${appt.status === 'approved' ? 'bg-green-50 text-green-600' : appt.status === 'rejected' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'}`}>
                          {appt.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-2 text-sm text-slate-500">
                        <p><span className="font-bold text-slate-700">Patient:</span> {appt.patientName || 'WombCare User'}</p>
                        <p><span className="font-bold text-slate-700">Date:</span> {new Date(appt.appointmentDate).toLocaleString()}</p>
                        <p><span className="font-bold text-slate-700">Notes:</span> {appt.notes || 'N/A'}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <select 
                        value={appt.status}
                        onChange={(e) => handleUpdateAppointmentStatus(appt.id, e.target.value)}
                        className="bg-slate-50 border-none rounded-xl px-4 py-2 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-pink-500"
                      >
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="completed">Completed</option>
                        <option value="rejected">Rejected</option>
                      </select>
                      {appt.status !== 'rejected' && appt.status !== 'completed' && (
                        <div className="flex items-center gap-2">
                           <button 
                            onClick={() => handleUpdateAppointmentStatus(appt.id, 'approved')}
                            className="p-2 bg-green-50 text-green-600 rounded-lg"
                           >
                             <Check className="w-4 h-4" />
                           </button>
                           <button 
                            onClick={() => handleUpdateAppointmentStatus(appt.id, 'rejected')}
                            className="p-2 bg-rose-50 text-rose-600 rounded-lg"
                           >
                             <X className="w-4 h-4" />
                           </button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <CareerList careers={careers} loading={loading} onEdit={() => {}} onDelete={() => {}} />
        )}
      </main>
    </div>
  );
}
