'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus } from 'lucide-react';

interface BlogForm {
  title: string;
  content: string;
  authorName: string;
  coverImage: string;
  published: boolean;
  contentType: string;
}

interface BlogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  editingBlog: any | null;
  blogForm: BlogForm;
  setBlogForm: (form: BlogForm) => void;
  loading: boolean;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  insertFormatting: (type: 'bold' | 'italic') => void;
}

const BlogModal: React.FC<BlogModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingBlog,
  blogForm,
  setBlogForm,
  loading,
  handleImageUpload,
  insertFormatting
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: 30 }} 
            className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl overflow-hidden"
          >
            <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-2xl font-bold text-slate-800">{editingBlog ? 'Edit Blog Post' : 'Create Blog Post'}</h3>
              <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-all text-slate-400">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={onSubmit} className="p-10 space-y-6 max-h-[70vh] overflow-y-auto">
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
                      <button type="button" onClick={() => setBlogForm({...blogForm, coverImage: ''})} className="text-rose-500 p-1 hover:bg-rose-50 rounded-full">
                        <X className="w-3 h-3" />
                      </button>
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
  );
};

export default BlogModal;
