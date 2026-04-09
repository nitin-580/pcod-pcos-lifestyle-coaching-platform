"use client"
import React, { useState, useEffect } from 'react';
import AdminTable, { Registration } from '@/components/AdminTable';
import { Sparkles, Key, LogOut, RefreshCw, Loader2, AlertCircle, LayoutDashboard, FileText, Plus, Trash2, Edit3, X, Briefcase } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import CareerModal from '@/components/admin/CareerModal';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminSidebar from '@/components/admin/AdminSidebar';
import BlogList from '@/components/admin/BlogList';
import CareerList from '@/components/admin/CareerList';
import EnrollmentTable, { Enrollment } from '@/components/admin/EnrollmentTable';

import { useRouter } from 'next/navigation';

import { API_BASE } from '@/lib/api-config';

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
  const [activeTab, setActiveTab] = useState<'registrations' | 'blogs' | 'careers' | 'enrollments'>('registrations');
  
  // Data States
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
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
    console.log('AdminPage init. API_BASE:', API_BASE);
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
      fetchCareers(key),
      fetchEnrollments(key)
    ]);
  };

  const fetchRegistrations = async (key: string) => {
    setLoading(true);
    try {
      if (key && typeof key === 'string') {
        console.log(`fetchRegistrations with key: ${key.substring(0, 2)}...${key.substring(key.length - 2)}`);
      } else {
        console.warn('fetchRegistrations: key is missing or not a string!', key);
      }
      const response = await fetch(`${API_BASE}/users`, {
        headers: { 'x-admin-api-key': key },
      });
      console.log('fetchRegistrations status:', response.status);
      if (!response.ok) {
        const text = await response.text();
        console.error('fetchRegistrations failed body:', text);
        try {
          const result = JSON.parse(text);
          throw new Error(result.message || result.error || 'Failed to fetch registrations');
        } catch (e) {
          throw new Error(`Failed to fetch registrations: ${response.status} ${response.statusText}`);
        }
      }
      const result = await response.json();
      setRegistrations(result.data || []);
    } catch (err: any) {
      console.error('Fetch registrations error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
const fetchEnrollments = async (key: string) => {
  setLoading(true);
  setError(null);

  try {
    const response = await fetch(
      'https://womb-care-backend-76858014616.us-central1.run.app/api/admin/enrollments',
      {
        method: 'GET',
        headers: {
          'x-admin-api-key': key,
        },
      }
    );

    console.log('fetchEnrollments status:', response.status);

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.message || 'Failed to fetch enrollments'
      );
    }

    setEnrollments(result.data || []);
  } catch (err: any) {
    console.error('Fetch enrollments error:', err);
    setError(err.message);
  } finally {
    setLoading(false);
  }
};
  const fetchBlogs = async (key: string) => {
    setLoading(true);
    try {
      if (key && typeof key === 'string') {
        console.log(`fetchBlogs with key: ${key.substring(0, 2)}...${key.substring(key.length - 2)}`);
      } else {
        console.warn('fetchBlogs: key is missing or not a string!', key);
      }
      const response = await fetch(`${API_BASE}/blogs`, {
        headers: { 'x-admin-api-key': key },
      });
      console.log('fetchBlogs status:', response.status);
      if (!response.ok) {
        const text = await response.text();
        console.error('fetchBlogs failed body:', text);
        try {
          const result = JSON.parse(text);
          throw new Error(result.message || result.error || 'Failed to fetch blogs');
        } catch (e) {
          throw new Error(`Failed to fetch blogs: ${response.status} ${response.statusText}`);
        }
      }
      const result = await response.json();
      setBlogs(result.data || []);
    } catch (err: any) {
      console.error('Fetch blogs error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCareers = async (key: string) => {
    setLoading(true);
    try {
      if (key && typeof key === 'string') {
        console.log(`fetchCareers with key: ${key.substring(0, 2)}...${key.substring(key.length - 2)}`);
      } else {
        console.warn('fetchCareers: key is missing or not a string!', key);
      }
      const response = await fetch(`${API_BASE}/careers`, {
        headers: { 'x-admin-api-key': key },
      });
      console.log('fetchCareers status:', response.status);
      if (!response.ok) {
        const text = await response.text();
        console.error('fetchCareers failed body:', text);
        try {
          const result = JSON.parse(text);
          throw new Error(result.message || result.error || 'Failed to fetch careers');
        } catch (e) {
          throw new Error(`Failed to fetch careers: ${response.status} ${response.statusText}`);
        }
      }
      const result = await response.json();
      setCareers(result.data || []);
    } catch (err: any) {
      console.error('Fetch careers error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };



  const handleCareerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const url = editingCareer ? `${API_BASE}/careers/${editingCareer.id}` : `${API_BASE}/careers`;
      const requestedMethod = editingCareer ? 'PATCH' : 'POST';
      
      const response = await fetch(url, {
        method: requestedMethod,
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
        const result = await response.json().catch(() => ({}));
        throw new Error(result.message || result.error || `Failed to save career (Status: ${response.status})`);
      }
      
      await fetchCareers(apiKey);
      setIsCareerModalOpen(false);
      setEditingCareer(null);
      setCareerForm({ title: '', department: '', location: '', type: 'Full-time', description: '', requirements: [''], active: true });
    } catch (err: any) {
      console.error('Career save error:', err);
      const isNetworkError = err.message.includes('Failed to fetch') || err.name === 'TypeError';
      setError(isNetworkError ? 'Network Error: Failed to connect to server through proxy. Check backend availability.' : err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteCareer = async (id: string) => {
    if (!confirm('Are you sure you want to delete this career?')) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/careers/${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-api-key': apiKey },
      });
      
      if (!response.ok) {
        let errorMessage = 'Failed to delete career';
        try {
          const result = await response.json();
          errorMessage = result.message || result.error || errorMessage;
        } catch (e) {
          // If response is not JSON (e.g. 404 HTML from failed proxy)
          errorMessage = `Server Error: ${response.status} ${response.statusText}. The proxy might be misconfigured or the server restarted.`;
        }
        throw new Error(errorMessage);
      }
      
      await fetchCareers(apiKey);
    } catch (err: any) {
      console.error('Delete career error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteBlog = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/blogs/${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-api-key': apiKey },
      });
      
      if (!response.ok) {
        let errorMessage = 'Failed to delete blog post';
        try {
          const result = await response.json();
          errorMessage = result.message || result.error || errorMessage;
        } catch (e) {
          errorMessage = `Server Error: ${response.status} ${response.statusText}. The proxy might be misconfigured or the server restarted.`;
        }
        throw new Error(errorMessage);
      }
      
      await fetchBlogs(apiKey);
    } catch (err: any) {
      console.error('Delete blog error:', err);
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
          else if (activeTab === 'enrollments') fetchEnrollments(apiKey);
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
        ) : activeTab === 'enrollments' ? (
          <EnrollmentTable data={enrollments} />
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
              
              // Ensure requirements is always an array
              let requirements = career.requirements || [''];
              if (typeof requirements === 'string') {
                try {
                  requirements = JSON.parse(requirements);
                } catch (e) {
                  // Cast to unknown then string to satisfy compiler
                  requirements = (requirements as unknown as string).split('\n').filter((r: string) => r.trim() !== '');
                }
              }
              if (!Array.isArray(requirements)) requirements = [''];

              setCareerForm({ 
                title: career.title || '', 
                department: career.department || '', 
                location: career.location || '',
                type: career.type || 'Full-time',
                description: career.description || '',
                requirements: requirements,
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
