"use client"
import React, { useState, useEffect } from 'react';
import AdminTable, { Registration } from '@/components/AdminTable';
import { Sparkles, Key, LogOut, RefreshCw, Loader2, AlertCircle, LayoutDashboard, FileText, Plus, Trash2, Edit3, X, Briefcase } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import AdminSidebar from '@/components/admin/AdminSidebar';
import BlogList from '@/components/admin/BlogList';
import CareerList from '@/components/admin/CareerList';

import { useRouter } from 'next/navigation';

const BASE_URL = 'https://womb-care-backend-76858014616.us-central1.run.app/api/admin';

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
  const [activeTab, setActiveTab] = useState<'registrations' | 'blogs' | 'careers'>('registrations');
  
  // Data States
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [careers, setCareers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Blog states can be removed as they are handled in the new pages, 
  // but we keep 'blogs' list here.

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
    await Promise.all([
      fetchRegistrations(key),
      fetchBlogs(key),
      fetchCareers(key)
    ]);
  };

  const fetchRegistrations = async (key: string) => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/users`, {
        headers: { 'x-admin-api-key': key },
      });
      const result = await response.json();
      setRegistrations(result.data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchBlogs = async (key: string) => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/blogs`, {
        headers: { 'x-admin-api-key': key },
      });
      const result = await response.json();
      setBlogs(result.data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCareers = async (key: string) => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/careers`, {
        headers: { 'x-admin-api-key': key },
      });
      const result = await response.json();
      setCareers(result.data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };



  const handleCareerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = editingCareer ? `${BASE_URL}/careers/${editingCareer.id}` : `${BASE_URL}/careers`;
      const method = editingCareer ? 'PATCH' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'x-admin-api-key': apiKey,
        },
        body: JSON.stringify({
          ...careerForm,
          requirements: careerForm.requirements.filter(r => r.trim() !== '')
        }),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || result.error || 'Failed to save career');
      }
      
      await fetchCareers(apiKey);
      setIsCareerModalOpen(false);
      setEditingCareer(null);
      setCareerForm({ title: '', department: '', location: '', type: 'Full-time', description: '', requirements: [''], active: true });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteCareer = async (id: string) => {
    if (!confirm('Are you sure you want to delete this career?')) return;
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/careers/${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-api-key': apiKey },
      });
      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || result.error || 'Failed to delete career');
      }
      await fetchCareers(apiKey);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteBlog = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/blogs/${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-api-key': apiKey },
      });
      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || result.error || 'Failed to delete blog post');
      }
      await fetchBlogs(apiKey);
    } catch (err: any) {
      setError(err.message);
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
        onRefresh={() => {
          if (activeTab === 'registrations') fetchRegistrations(apiKey);
          else if (activeTab === 'blogs') fetchBlogs(apiKey);
          else if (activeTab === 'careers') fetchCareers(apiKey);
        }}
        onLogout={handleLogout}
      />

      <main className="max-w-7xl mx-auto px-6 pt-10">
        <AdminHeader 
          activeTab={activeTab} 
          onNewBlog={() => router.push('/wombcare-admin-9984/blogs/new')}
          onNewCareer={() => { 
            setEditingCareer(null); 
            setCareerForm({ title: '', department: '', location: '', type: 'Full-time', description: '', requirements: [''], active: true }); 
            setIsCareerModalOpen(true); 
          }}
        />

        {activeTab === 'registrations' ? (
          <AdminTable data={registrations} />
        ) : activeTab === 'blogs' ? (
          <BlogList 
            blogs={blogs} 
            loading={loading} 
            onEdit={(blog) => router.push(`/wombcare-admin-9984/blogs/edit/${blog.id}`)}
            onDelete={deleteBlog}
          />
        ) : (
          <CareerList 
            careers={careers} 
            loading={loading} 
            onEdit={(career) => {
              setEditingCareer(career); 
              setCareerForm({ 
                title: career.title, 
                department: career.department, 
                location: career.location,
                type: career.type,
                description: career.description,
                requirements: career.requirements || [''],
                active: career.active !== undefined ? career.active : true
              }); 
              setIsCareerModalOpen(true); 
            }}
            onDelete={deleteCareer}
          />
        )}
      </main>

      <CareerModal 
        isOpen={isCareerModalOpen}
        onClose={() => setIsCareerModalOpen(false)}
        onSubmit={handleCareerSubmit}
        editingCareer={editingCareer}
        careerForm={careerForm}
        setCareerForm={setCareerForm}
        loading={loading}
      />
    </div>
  );
}
