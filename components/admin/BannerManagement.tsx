'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Image as ImageIcon, Trash2, Globe, ListOrdered, ToggleLeft, ToggleRight, Sparkles, RefreshCw, Loader2, ArrowRight } from 'lucide-react';
import { API_BASE } from '@/lib/api-config';

interface Banner {
  id: string;
  title: string;
  imageUrl: string;
  targetUrl?: string;
  position: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface BannerManagementProps {
  apiKey: string;
}

export default function BannerManagement({ apiKey }: BannerManagementProps) {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form Drawer State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    title: '',
    imageUrl: '',
    targetUrl: '',
    position: 0,
    isActive: true
  });

  const fetchBanners = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/banners`, {
        headers: { 'x-admin-api-key': apiKey },
      });
      const result = await response.json();
      if (result.success) {
        setBanners(result.data || []);
      } else {
        setError(result.message || 'Failed to fetch banners.');
      }
    } catch (err: any) {
      setError('Connection to WombCare Server failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (apiKey) {
      fetchBanners();
    }
  }, [apiKey]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch(`${API_BASE}/banners/upload`, {
        method: 'POST',
        headers: { 'x-admin-api-key': apiKey },
        body: formData,
      });
      const result = await response.json();
      if (result.success) {
        setForm(prev => ({ ...prev, imageUrl: result.data.url }));
      } else {
        alert('Upload failed: ' + result.message);
      }
    } catch (err: any) {
      console.error('Upload error:', err);
      alert('Upload failed. Check server connection.');
    } finally {
      setUploading(false);
    }
  };

  const handleCreateBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.imageUrl) {
      alert('Title and Banner Photo are required.');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(`${API_BASE}/banners`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-api-key': apiKey
        },
        body: JSON.stringify({
          title: form.title,
          imageUrl: form.imageUrl,
          targetUrl: form.targetUrl || undefined,
          position: Number(form.position),
          isActive: form.isActive
        }),
      });

      const result = await response.json();
      if (result.success) {
        setIsModalOpen(false);
        setForm({
          title: '',
          imageUrl: '',
          targetUrl: '',
          position: 0,
          isActive: true
        });
        await fetchBanners();
      } else {
        alert(result.message || 'Failed to create banner.');
      }
    } catch (err) {
      console.error(err);
      alert('Error creating banner.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`${API_BASE}/banners/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-api-key': apiKey
        },
        body: JSON.stringify({ isActive: !currentStatus }),
      });
      const result = await response.json();
      if (result.success) {
        setBanners(prev =>
          prev.map(banner => banner.id === id ? { ...banner, isActive: !currentStatus } : banner)
        );
      } else {
        alert(result.message || 'Failed to update status.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteBanner = async (id: string) => {
    if (!confirm('Are you sure you want to delete this dashboard banner?')) return;

    try {
      const response = await fetch(`${API_BASE}/banners/${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-api-key': apiKey }
      });
      const result = await response.json();
      if (result.success) {
        setBanners(prev => prev.filter(b => b.id !== id));
      } else {
        alert(result.message || 'Failed to delete banner.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex items-center justify-between bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-pink-500" /> Banners Dashboard
        </h3>
        
        <div className="flex items-center gap-3">
          <button
            onClick={fetchBanners}
            disabled={loading}
            className="p-3 bg-slate-50 border border-slate-100 rounded-2xl hover:bg-slate-100 transition-all text-slate-600 flex items-center justify-center shrink-0 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl text-sm font-bold shadow-md hover:shadow-xl transition-all"
          >
            <Plus className="w-4 h-4" /> New Banner
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-700 text-sm font-medium flex items-center gap-2">
          <X className="w-5 h-5" />
          {error}
        </div>
      )}

      {/* Grid of Banners */}
      {loading && banners.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-3xl border border-slate-100 shadow-sm flex items-center justify-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
          <span className="text-slate-400 font-medium">Loading banners...</span>
        </div>
      ) : banners.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-3xl border border-slate-100 shadow-sm">
          <ImageIcon className="w-12 h-12 text-slate-200 mx-auto mb-4" />
          <p className="text-slate-400 font-medium mb-1">No banners configured</p>
          <p className="text-xs text-slate-300">Click &quot;New Banner&quot; to seed your first dashboard poster.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatePresence mode="popLayout">
            {banners.map((banner) => (
              <motion.div
                layout
                key={banner.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col group hover:shadow-md hover:border-slate-200/80 transition-all"
              >
                {/* Banner Photo Container */}
                <div className="h-44 bg-slate-50 relative overflow-hidden">
                  <img
                    src={banner.imageUrl}
                    alt={banner.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                  
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border shadow-sm ${
                      banner.isActive 
                        ? 'bg-emerald-500/90 text-white border-emerald-400/30' 
                        : 'bg-slate-500/90 text-white border-slate-400/30'
                    }`}>
                      {banner.isActive ? 'Active' : 'Draft'}
                    </span>
                    <span className="bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 text-[9px] font-black text-white uppercase tracking-wider flex items-center gap-1 shadow-sm">
                      <ListOrdered className="w-3 h-3" /> Position {banner.position}
                    </span>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h4 className="text-base font-bold text-slate-800 line-clamp-2 leading-snug">{banner.title}</h4>
                    {banner.targetUrl && (
                      <div className="flex items-center gap-1 mt-2 text-xs font-semibold text-pink-500 hover:text-pink-600 transition-all">
                        <Globe className="w-3.5 h-3.5" />
                        <span className="truncate max-w-[280px]">{banner.targetUrl}</span>
                        <ArrowRight className="w-3 h-3" />
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                    <button
                      onClick={() => handleToggleActive(banner.id, banner.isActive)}
                      className={`flex items-center gap-1 text-xs font-bold transition-all ${
                        banner.isActive ? 'text-pink-500' : 'text-slate-400 hover:text-slate-500'
                      }`}
                    >
                      {banner.isActive ? (
                        <>
                          <ToggleRight className="w-7 h-7" /> Active Status
                        </>
                      ) : (
                        <>
                          <ToggleLeft className="w-7 h-7" /> Deactivated
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleDeleteBanner(banner.id)}
                      className="p-2.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all shadow-sm border border-slate-50 hover:border-rose-100 flex items-center justify-center"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Create Modal Drawer */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="bg-gradient-to-tr from-pink-500 to-purple-600 p-6 text-white flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  <h3 className="text-lg font-bold">New Dashboard Banner</h3>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-full transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateBanner} className="p-8 space-y-5 overflow-y-auto flex-1">
                {/* Banner Photo Upload */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block pl-1">Banner Photo</label>
                  <div className="flex items-center gap-4 py-2 border border-slate-100 bg-slate-50/50 p-4 rounded-2xl">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="banner-image-file"
                    />
                    <label
                      htmlFor="banner-image-file"
                      className="flex items-center gap-2 px-4 py-3 bg-white border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-all text-xs font-bold text-slate-600 shadow-sm"
                    >
                      <ImageIcon className="w-4 h-4 text-pink-500" />
                      {uploading ? 'Uploading...' : form.imageUrl ? 'Change Photo' : 'Upload Banner'}
                    </label>
                    
                    {form.imageUrl && (
                      <div className="relative group">
                        <img
                          src={form.imageUrl}
                          alt="Preview"
                          className="w-16 h-12 rounded-xl object-cover shadow-md border-2 border-white"
                        />
                        <button
                          type="button"
                          onClick={() => setForm(prev => ({ ...prev, imageUrl: '' }))}
                          className="absolute -top-2 -right-2 p-1 bg-rose-500 text-white rounded-full shadow-lg hover:bg-rose-600 transition-all"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400 pl-1">Image will be securely hosted inside Supabase Storage bucket.</p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block pl-1">Banner Title</label>
                  <textarea
                    placeholder="Enter the title or slogan..."
                    value={form.title}
                    onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-pink-500 outline-none text-sm text-slate-800 h-20 resize-none leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block pl-1">Position / Order</label>
                    <input
                      type="number"
                      placeholder="0"
                      value={form.position}
                      onChange={(e) => setForm(prev => ({ ...prev, position: Number(e.target.value) }))}
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-pink-500 outline-none text-sm text-slate-800"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block pl-1">Initial Status</label>
                    <select
                      value={form.isActive ? 'true' : 'false'}
                      onChange={(e) => setForm(prev => ({ ...prev, isActive: e.target.value === 'true' }))}
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-pink-500 outline-none text-sm text-slate-800 font-bold"
                    >
                      <option value="true">Active (Visible)</option>
                      <option value="false">Draft (Hidden)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block pl-1">Target Click URL (Optional)</label>
                  <input
                    type="url"
                    placeholder="https://wombcare.in/classes/..."
                    value={form.targetUrl}
                    onChange={(e) => setForm(prev => ({ ...prev, targetUrl: e.target.value }))}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-pink-500 outline-none text-sm text-slate-800"
                  />
                </div>

                <div className="flex gap-3 pt-4 border-t border-slate-50 shrink-0">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold py-4 rounded-2xl transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting || uploading}
                    className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-2xl shadow-lg transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                    {submitting ? 'Creating...' : 'Create Poster'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
