'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowLeft, Loader2, Share2 } from 'lucide-react';
import FloatingNavbar from '@/components/FloatingNavbar';
import { format } from 'date-fns';

const BACKEND_URL = 'https://womb-care-backend-76858014616.us-central1.run.app/api/blogs';

interface Blog {
  id: string;
  title: string;
  content: string;
  authorName: string;
  createdAt: string;
}

export default function BlogDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBlog() {
      if (!id) return;
      try {
        const response = await fetch(`${BACKEND_URL}/${id}`);
        if (!response.ok) throw new Error('Blog post not found');
        const result = await response.json();
        setBlog(result.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchBlog();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFCFD]">
        <Loader2 className="w-10 h-10 animate-spin text-pink-500" />
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FDFCFD] p-6 text-center">
        <h1 className="text-2xl font-bold text-slate-800 mb-4">Oops! Blog not found.</h1>
        <p className="text-slate-500 mb-8 max-w-md">{error || "The article you're looking for might have been moved or deleted."}</p>
        <button 
          onClick={() => router.push('/blogs')}
          className="px-6 py-3 bg-slate-900 text-white rounded-full font-semibold shadow-lg shadow-slate-200"
        >
          Back to Blogs
        </button>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white font-sans">
      <FloatingNavbar />
      
      {/* Header / Banner */}
      <div className="pt-32 pb-16 bg-[#FDFCFD] border-b border-slate-50">
        <div className="max-w-4xl mx-auto px-6">
          <button 
            onClick={() => router.push('/blogs')}
            className="flex items-center gap-2 text-slate-400 hover:text-pink-600 transition-colors mb-10 group text-sm font-semibold"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Articles
          </button>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-4 mb-6 text-xs font-bold text-pink-500 uppercase tracking-[0.2em]">
              <span className="bg-pink-50 px-3 py-1 rounded-full border border-pink-100 italic">Self-Care & Hormones</span>
              <span className="w-1.5 h-1.5 bg-slate-200 rounded-full" />
              <span>{Math.ceil(blog.content.length / 1000)} min read</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-[1.15] mb-8">
              {blog.title}
            </h1>
            
            <div className="flex items-center justify-between py-8 border-y border-slate-100">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-pink-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                    {blog.authorName.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-slate-800">{blog.authorName}</div>
                    <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5 uppercase tracking-wider">
                      <Calendar className="w-3 h-3" />
                      {format(new Date(blog.createdAt), 'MMMM dd, yyyy')}
                    </div>
                  </div>
               </div>
               
               <button className="flex items-center gap-2 text-slate-400 hover:text-slate-800 transition-all font-semibold text-sm">
                 <Share2 className="w-4 h-4" />
                 Share
               </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Blog Content */}
      <article className="max-w-4xl mx-auto px-6 py-20">
        <div 
          className="prose prose-lg md:prose-xl prose-slate max-w-none prose-p:leading-[1.8] prose-p:text-slate-600 prose-headings:text-slate-900 prose-headings:font-extrabold prose-strong:text-slate-900"
          dangerouslySetInnerHTML={{ __html: blog.content.replace(/\n/g, '<br />') }}
        />
        
        {/* Newsletter Signup */}
        <div className="mt-24 p-12 rounded-[2.5rem] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-center text-white shadow-2xl overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/10 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10">
            <h3 className="text-3xl font-bold mb-4">Love these insights?</h3>
            <p className="text-slate-400 mb-8 max-w-sm mx-auto">Subscribe for weekly wellness tips tailored to your cycle.</p>
            <div className="max-w-md mx-auto flex gap-3 flex-col sm:flex-row">
              <input 
                type="email" 
                placeholder="nina@example.com"
                className="flex-1 px-6 py-4 rounded-full bg-white/5 border border-white/10 outline-none focus:bg-white/10 focus:border-pink-500 transition-all text-white placeholder:text-slate-600"
              />
              <button className="px-8 py-4 bg-pink-500 hover:bg-pink-600 rounded-full font-bold shadow-lg shadow-pink-500/20 transition-all active:scale-[0.98]">
                Join Now
              </button>
            </div>
          </div>
        </div>
      </article>

      <footer className="bg-slate-50 text-slate-400 py-12 text-center text-xs border-t border-slate-100">
        <p>&copy; {new Date().getFullYear()} WombCare Wellness. Empowering your hormonal journey.</p>
      </footer>
    </main>
  );
}
