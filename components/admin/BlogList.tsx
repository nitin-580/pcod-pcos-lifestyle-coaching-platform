'use client';

import React from 'react';
import { format } from 'date-fns';
import { Edit3, Trash2 } from 'lucide-react';

interface Blog {
  id: string;
  title: string;
  authorName: string;
  createdAt: string;
  coverImage?: string;
  published?: boolean;
  contentType?: string;
  content: string;
}

interface BlogListProps {
  blogs: Blog[];
  loading: boolean;
  onEdit: (blog: Blog) => void;
  onDelete: (id: string) => void;
}

const BlogList: React.FC<BlogListProps> = ({ blogs, loading, onEdit, onDelete }) => {
  return (
    <div className="grid grid-cols-1 gap-4">
      {blogs.map((blog) => (
        <div 
          key={blog.id} 
          className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between hover:border-pink-200 transition-all translate-y-0 hover:-translate-y-1"
        >
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
              onClick={() => onEdit(blog)}
              className="p-3 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
            >
              <Edit3 className="w-5 h-5" />
            </button>
            <button 
              onClick={() => onDelete(blog.id)}
              className="p-3 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      ))}
      {blogs.length === 0 && !loading && (
        <div className="py-20 text-center text-slate-300">
          No blog posts yet. Click "New Blog Post" to start.
        </div>
      )}
    </div>
  );
};

export default BlogList;
