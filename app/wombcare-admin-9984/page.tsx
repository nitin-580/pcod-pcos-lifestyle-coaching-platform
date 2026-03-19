"use client"
import React, { useState, useEffect } from 'react';
import AdminTable, { Registration } from '@/components/AdminTable';
import { Sparkles, Key, LogOut, RefreshCw, Loader2, AlertCircle, LayoutDashboard, FileText, Plus, Trash2, Edit3, X, Briefcase } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';

const BASE_URL = 'https://womb-care-backend-76858014616.us-central1.run.app/api/admin';

interface Blog {
  id: string;
  title: string;
  content: string;
  authorName: string;
  createdAt: string;
  coverImage?: string;
  published?: boolean;
  contentType?: string;
}

export default function AdminPage() {
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

  // Blog Form States
  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<any | null>(null);
  const [blogForm, setBlogForm] = useState({ 
    title: '', 
    content: '', 
    authorName: '', 
    coverImage: '',
    published: true,
    contentType: 'html'
  });

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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/upload`, {
        method: 'POST',
        headers: { 'x-admin-api-key': apiKey },
        body: formData,
      });
      const result = await response.json();
      if (result.success) {
        setBlogForm({ ...blogForm, coverImage: result.data.url });
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const insertFormatting = (tag: string) => {
    const textarea = document.getElementById('blog-content') as HTMLTextAreaElement;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = blogForm.content;
    const before = text.substring(0, start);
    const after = text.substring(end);
    const selection = text.substring(start, end);
    
    let newContent = '';
    if (tag === 'bold') newContent = `${before}<b>${selection}</b>${after}`;
    if (tag === 'italic') newContent = `${before}<i>${selection}</i>${after}`;
    
    setBlogForm({ ...blogForm, content: newContent });
  };

  const handleBlogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = editingBlog ? `${BASE_URL}/blogs/${editingBlog.id}` : `${BASE_URL}/blogs`;
      const method = editingBlog ? 'PATCH' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'x-admin-api-key': apiKey,
        },
        body: JSON.stringify(blogForm),
      });

      if (!response.ok) throw new Error('Failed to save blog post');
      
      await fetchBlogs(apiKey);
      setIsBlogModalOpen(false);
      setEditingBlog(null);
      setBlogForm({ title: '', content: '', authorName: '', coverImage: '', published: true, contentType: 'html' });
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

      if (!response.ok) throw new Error('Failed to save career');
      
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
      if (!response.ok) throw new Error('Failed to delete career');
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
      if (!response.ok) throw new Error('Failed to delete blog post');
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
      {/* Header */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="bg-gradient-to-br from-pink-500 to-purple-600 p-2 rounded-xl text-white shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold text-slate-800 hidden sm:block">
              WombCare <span className="text-pink-500 text-sm font-medium ml-2 px-2 py-0.5 bg-pink-50 rounded-lg">Admin</span>
            </span>
          </div>

          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button 
              onClick={() => setActiveTab('registrations')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'registrations' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <LayoutDashboard className="w-4 h-4" /> Registrations
            </button>
            <button 
              onClick={() => setActiveTab('blogs')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'blogs' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <FileText className="w-4 h-4" /> Blogs
            </button>
            <button 
              onClick={() => setActiveTab('careers')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'careers' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <Briefcase className="w-4 h-4" /> Careers
            </button>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={() => {
              if (activeTab === 'registrations') fetchRegistrations(apiKey);
              if (activeTab === 'blogs') fetchBlogs(apiKey);
              if (activeTab === 'careers') fetchCareers(apiKey);
            }} disabled={loading} className="p-2.5 text-slate-500 hover:text-purple-600 rounded-xl transition-all">
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button onClick={handleLogout} className="text-slate-400 hover:text-rose-600 p-2.5 rounded-xl transition-all"><LogOut className="w-5 h-5" /></button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <h2 className="text-3xl font-bold text-slate-800 mb-2">
              {activeTab === 'registrations' ? 'User Registrations' : activeTab === 'blogs' ? 'Blog Management' : 'Career Opportunities'}
            </h2>
            <p className="text-slate-500">
              {activeTab === 'registrations' ? 'Track your growth and user data.' : activeTab === 'blogs' ? 'Create and manage educational content.' : 'Manage job openings and hiring.'}
            </p>
          </div>
          
          {activeTab === 'blogs' && (
            <button 
              onClick={() => { 
                setEditingBlog(null); 
                setBlogForm({ title: '', content: '', authorName: '', coverImage: '', published: true, contentType: 'html' }); 
                setIsBlogModalOpen(true); 
              }}
              className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-full font-bold shadow-lg hover:shadow-xl transition-all"
            >
              <Plus className="w-5 h-5" /> New Blog Post
            </button>
          )}

          {activeTab === 'careers' && (
            <button 
              onClick={() => { 
                setEditingCareer(null); 
                setCareerForm({ title: '', department: '', location: '', type: 'Full-time', description: '', requirements: [''], active: true }); 
                setIsCareerModalOpen(true); 
              }}
              className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-full font-bold shadow-lg hover:shadow-xl transition-all"
            >
              <Plus className="w-5 h-5" /> New Job Opening
            </button>
          )}
        </div>

        {activeTab === 'registrations' ? (
          <AdminTable data={registrations} />
        ) : activeTab === 'blogs' ? (
          <div className="grid grid-cols-1 gap-4">
            {blogs.map((blog) => (
              <div key={blog.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between hover:border-pink-200 transition-all translate-y-0 hover:-translate-y-1">
                <div className="flex-1 min-w-0 pr-6 flex items-center gap-4">
                  {blog.coverImage && (
                    <img src={blog.coverImage} alt="" className="w-16 h-16 rounded-xl object-cover bg-slate-100" />
                  )}
                  <div>
                    <h3 className="font-bold text-lg text-slate-800 truncate mb-1">{blog.title}</h3>
                    <div className="flex items-center gap-4 text-xs text-slate-400 font-medium uppercase tracking-wider">
                      <span>{blog.authorName}</span>
                      <span>•</span>
                      <span>{format(new Date(blog.createdAt), 'MMM d, yyyy')}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => { 
                      setEditingBlog(blog); 
                      setBlogForm({ 
                        title: blog.title, 
                        content: blog.content, 
                        authorName: blog.authorName,
                        coverImage: blog.coverImage || '',
                        published: blog.published !== undefined ? blog.published : true,
                        contentType: blog.contentType || 'html'
                      }); 
                      setIsBlogModalOpen(true); 
                    }}
                    className="p-3 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                  >
                    <Edit3 className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => deleteBlog(blog.id)}
                    className="p-3 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
            {blogs.length === 0 && !loading && <div className="py-20 text-center text-slate-300">No blog posts yet. Click "New Blog Post" to start.</div>}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {careers.map((career) => (
              <div key={career.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between hover:border-pink-200 transition-all translate-y-0 hover:-translate-y-1">
                <div className="flex-1 min-w-0 pr-6">
                  <h3 className="font-bold text-lg text-slate-800 truncate mb-1">{career.title}</h3>
                  <div className="flex items-center gap-4 text-xs text-slate-400 font-medium uppercase tracking-wider">
                    <span>{career.department}</span>
                    <span>•</span>
                    <span>{career.location}</span>
                    <span>•</span>
                    <span className={career.active ? 'text-emerald-500' : 'text-slate-400'}>{career.active ? 'Active' : 'Hidden'}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => { 
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
                    className="p-3 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                  >
                    <Edit3 className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => deleteCareer(career.id)}
                    className="p-3 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
            {careers.length === 0 && !loading && <div className="py-20 text-center text-slate-300">No job openings yet. Click "New Job Opening" to start.</div>}
          </div>
        )}
      </main>

      {/* Blog Modal */}
      <AnimatePresence>
        {isBlogModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }} className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl overflow-hidden">
              <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-2xl font-bold text-slate-800">{editingBlog ? 'Edit Blog Post' : 'Create Blog Post'}</h3>
                <button onClick={() => setIsBlogModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-all text-slate-400"><X className="w-6 h-6" /></button>
              </div>
              <form onSubmit={handleBlogSubmit} className="p-10 space-y-6 max-h-[70vh] overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-slate-700 ml-1 italic">Title</label>
                    <input required value={blogForm.title} onChange={e => setBlogForm({...blogForm, title: e.target.value})} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none" placeholder="e.g. Managing PCOD with Yoga" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-slate-700 ml-1 italic">Author Name</label>
                    <input required value={blogForm.authorName} onChange={e => setBlogForm({...blogForm, authorName: e.target.value})} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none" placeholder="e.g. Dr. Sarah" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700 ml-1 italic">Cover Image</label>
                  <div className="flex items-center gap-4">
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="image-upload" />
                    <label htmlFor="image-upload" className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer transition-all text-sm font-bold text-slate-600">
                      <Plus className="w-4 h-4" /> Upload Image
                    </label>
                    {blogForm.coverImage && (
                      <div className="flex items-center gap-2 text-xs text-emerald-600 font-medium">
                        <img src={blogForm.coverImage} alt="Preview" className="w-10 h-10 rounded-lg object-cover" />
                        Uploaded successfully
                        <button type="button" onClick={() => setBlogForm({...blogForm, coverImage: ''})} className="text-rose-500 p-1 hover:bg-rose-50 rounded-full"><X className="w-3 h-3" /></button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between ml-1">
                    <label className="text-sm font-bold text-slate-700 italic">Content</label>
                    <div className="flex gap-2">
                       <button type="button" onClick={() => insertFormatting('bold')} className="p-1 px-2 text-xs font-bold bg-slate-100 rounded hover:bg-slate-200">B</button>
                       <button type="button" onClick={() => insertFormatting('italic')} className="p-1 px-2 text-xs italic bg-slate-100 rounded hover:bg-slate-200">I</button>
                    </div>
                  </div>
                  <textarea id="blog-content" required rows={8} value={blogForm.content} onChange={e => setBlogForm({...blogForm, content: e.target.value})} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none resize-none font-sans" placeholder="Write your content here..." />
                </div>
                
                <div className="flex items-center gap-2 ml-1">
                  <input type="checkbox" id="published" checked={blogForm.published} onChange={e => setBlogForm({...blogForm, published: e.target.checked})} className="w-4 h-4 rounded text-pink-500 focus:ring-pink-500" />
                  <label htmlFor="published" className="text-sm font-medium text-slate-700">Publish immediately</label>
                </div>

                <button type="submit" disabled={loading} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all active:scale-[0.98]">
                  {loading ? 'Saving...' : editingBlog ? 'Update Post' : 'Publish Post'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Career Modal */}
      <AnimatePresence>
        {isCareerModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }} className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl overflow-hidden">
              <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-2xl font-bold text-slate-800">{editingCareer ? 'Edit Job Opening' : 'Create Job Opening'}</h3>
                <button onClick={() => setIsCareerModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-all text-slate-400"><X className="w-6 h-6" /></button>
              </div>
              <form onSubmit={handleCareerSubmit} className="p-10 space-y-6 max-h-[70vh] overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-slate-700 ml-1 italic">Job Title</label>
                    <input required value={careerForm.title} onChange={e => setCareerForm({...careerForm, title: e.target.value})} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none" placeholder="e.g. Senior Health Coach" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-slate-700 ml-1 italic">Department</label>
                    <input required value={careerForm.department} onChange={e => setCareerForm({...careerForm, department: e.target.value})} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none" placeholder="e.g. Coaching" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-slate-700 ml-1 italic">Location</label>
                    <input required value={careerForm.location} onChange={e => setCareerForm({...careerForm, location: e.target.value})} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none" placeholder="e.g. Remote (India)" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-slate-700 ml-1 italic">Job Type</label>
                    <select value={careerForm.type} onChange={e => setCareerForm({...careerForm, type: e.target.value})} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none">
                      <option>Full-time</option>
                      <option>Part-time</option>
                      <option>Contract</option>
                      <option>Internship</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700 ml-1 italic">Description</label>
                  <textarea required rows={4} value={careerForm.description} onChange={e => setCareerForm({...careerForm, description: e.target.value})} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none resize-none" placeholder="Provide a brief summary of the role..." />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700 ml-1 italic">Requirements (One per line)</label>
                  <textarea rows={4} value={careerForm.requirements.join('\n')} onChange={e => setCareerForm({...careerForm, requirements: e.target.value.split('\n')})} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none resize-none" placeholder="What are we looking for?" />
                </div>

                <div className="flex items-center gap-2 ml-1">
                  <input type="checkbox" id="active" checked={careerForm.active} onChange={e => setCareerForm({...careerForm, active: e.target.checked})} className="w-4 h-4 rounded text-pink-500 focus:ring-pink-500" />
                  <label htmlFor="active" className="text-sm font-medium text-slate-700">List this job publicly</label>
                </div>

                <button type="submit" disabled={loading} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all active:scale-[0.98]">
                  {loading ? 'Saving...' : editingCareer ? 'Update Job' : 'Post Job'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
