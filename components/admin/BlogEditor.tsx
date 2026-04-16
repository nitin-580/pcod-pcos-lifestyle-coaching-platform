'use client';

import React, { useState } from 'react';
import { Sparkles, ArrowLeft, Save, Plus, X, Image as ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { API_BASE } from '@/lib/api-config';
import TiptapEditor from './TiptapEditor';

export interface BlogForm {
  title: string;
  excerpt: string; // Used as Subheading
  content: string;
  authorName: string;
  coverImage: string;
  published: boolean;
  contentType: string;
}

interface BlogEditorProps {
  initialData?: Partial<BlogForm>;
  onSave: (data: BlogForm) => Promise<void>;
  onCancel: () => void;
  loading: boolean;
  title: string;
}

const BlogEditor: React.FC<BlogEditorProps> = ({
  initialData,
  onSave,
  onCancel,
  loading,
  title
}) => {
  const [form, setForm] = useState<BlogForm>({
    title: initialData?.title || '',
    excerpt: initialData?.excerpt || '',
    content: initialData?.content || '',
    authorName: initialData?.authorName || '',
    coverImage: initialData?.coverImage || '',
    published: initialData?.published !== undefined ? initialData.published : true,
    contentType: initialData?.contentType || 'html',
  });

  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      // We need the API key here. Assuming it's in sessionStorage or passed via context/props.
      // For now, we'll use a placeholder or handle it in the parent.
      // Better: let the parent handle the actual upload function.
      const apiKey = sessionStorage.getItem('pcod_admin_key');
      const response = await fetch(`${API_BASE}/upload`, {
        method: 'POST',
        headers: { 'x-admin-api-key': apiKey || '' },
        body: formData,
      });
      const result = await response.json();
      if (result.success) {
        setForm({ ...form, coverImage: result.data.url });
      } else {
        alert('Upload failed: ' + result.message);
      }
    } catch (err: any) {
      console.error('Upload error:', err);
      alert('Upload error: ' + err.message);
    } finally {
      setUploading(false);
    }
  };


  return (
    <div className="min-h-screen bg-[#FDFCFD] pb-20">
      {/* Top Bar */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={onCancel}
              className="p-2 hover:bg-slate-100 rounded-full transition-all text-slate-500"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-slate-800">{title}</h1>
              <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                <Sparkles className="w-3 h-3 text-pink-500" />
                <span>WombCare Content Studio</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 mr-4 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-100">
               <input 
                type="checkbox" 
                id="published" 
                checked={form.published} 
                onChange={e => setForm({...form, published: e.target.checked})} 
                className="w-4 h-4 rounded text-pink-500 focus:ring-pink-500" 
              />
              <label htmlFor="published" className="text-sm font-bold text-slate-600 cursor-pointer select-none">Publish</label>
            </div>
            <button 
              onClick={() => onSave(form)}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-full font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 pt-12">
        <div className="space-y-10">
          {/* Header Section */}
          <div className="space-y-6">
            <textarea 
              value={form.title}
              onChange={e => setForm({...form, title: e.target.value})}
              placeholder="Post Title"
              className="w-full text-4xl md:text-5xl font-black text-slate-900 placeholder:text-slate-200 bg-transparent border-none outline-none resize-none overflow-hidden h-auto"
              rows={1}
            />
            
            <textarea 
              value={form.excerpt}
              onChange={e => setForm({...form, excerpt: e.target.value})}
              placeholder="Add a compelling subheading..."
              className="w-full text-xl font-medium text-slate-500 placeholder:text-slate-200 bg-transparent border-none outline-none resize-none"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-6 border-y border-slate-100">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 tracking-widest uppercase">Author Name</label>
              <input 
                value={form.authorName}
                onChange={e => setForm({...form, authorName: e.target.value})}
                placeholder="Name of the writer"
                className="w-full px-0 py-2 text-lg font-bold text-slate-700 bg-transparent border-none outline-none focus:ring-0"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 tracking-widest uppercase">Cover Image</label>
              <div className="flex items-center gap-4 py-2">
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="page-image-upload" />
                <label htmlFor="page-image-upload" className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-all text-sm font-bold text-slate-600 shadow-sm">
                  <ImageIcon className="w-4 h-4" /> 
                  {uploading ? 'Uploading...' : form.coverImage ? 'Change Image' : 'Pick Image'}
                </label>
                {form.coverImage && (
                  <div className="relative group">
                    <img src={form.coverImage} alt="Preview" className="w-12 h-12 rounded-xl object-cover shadow-md border-2 border-white" />
                    <button onClick={() => setForm({...form, coverImage: ''})} className="absolute -top-2 -right-2 p-1 bg-rose-500 text-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Content Editor */}
          <div className="space-y-4">
            <TiptapEditor 
              content={form.content} 
              onChange={(html, json) => {
                setForm({...form, content: html});
                // Note: If we needed the JSON for something specific, we'd store it here.
                // But the requirement is primarily clean HTML for prose rendering.
                console.log('Tiptap change:', { html, json });
              }} 
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default BlogEditor;
