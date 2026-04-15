'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowRight, Loader2 } from 'lucide-react';
import FloatingNavbar from '@/components/FloatingNavbar';
import { format } from 'date-fns';
import { getPublicApiBase } from '@/lib/api-config';

const BACKEND_URL = `${getPublicApiBase()}/blogs`;

import { Blog } from '@/types/blog';

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBlogs() {
      try {
        const response = await fetch(BACKEND_URL);
        if (!response.ok) throw new Error('Failed to fetch blogs');
        const result = await response.json();
        setBlogs(result.data || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchBlogs();
  }, []);

  return (
    <main className="min-h-screen bg-[#FDFCFD] font-sans flex flex-col">
      <FloatingNavbar />
      
      <div className="flex-1">
        {/* Hero Section */}
        <section className="pt-32 pb-20 bg-gradient-to-b from-pink-50/50 to-transparent">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-extrabold text-slate-800 mb-6"
            >
              Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">Wellness Blog</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg text-slate-600 max-w-2xl mx-auto"
            >
              Insights, expert advice, and community stories about PCOD, hormone health, and mindful living.
            </motion.p>
          </div>
        </section>

        {/* Blog Grid */}
        <section className="max-w-7xl mx-auto px-6 pb-32">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-40 text-slate-400">
              <Loader2 className="w-10 h-10 animate-spin text-pink-500 mb-4" />
              <p>Loading latest articles...</p>
            </div>
          ) : error ? (
            <div className="text-center py-40 text-rose-500">
              <p className="text-lg font-medium">{error}</p>
              <button onClick={() => window.location.reload()} className="mt-4 text-slate-500 underline">Try again</button>
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-40 text-slate-400">
              <p className="text-lg">No blog posts found. Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((blog, i) => {
                const slug = blog.slug || blog.title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_]+/g, '-').replace(/^-+|-+$/g, '');
                return (
                  <motion.article
                    key={blog.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="group bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl hover:border-pink-100 transition-all duration-300 flex flex-col"
                  >
                    <div className="p-8 flex flex-col flex-1">
                      <div className="flex items-center gap-4 mb-6 text-xs font-semibold text-slate-400 uppercase tracking-widest">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          {format(new Date(blog.createdAt), 'MMM d, yyyy')}
                        </span>
                        <span className="w-1 h-1 bg-slate-200 rounded-full" />
                        <span className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5" />
                          {blog.authorName}
                        </span>
                      </div>
                      
                      <h2 className="text-2xl font-bold text-slate-800 mb-4 group-hover:text-pink-600 transition-colors line-clamp-2">
                        {blog.title}
                      </h2>
                      
                      <p className="text-slate-600 line-clamp-3 mb-8 flex-1 leading-relaxed">
                        {blog.excerpt || blog.content.replace(/<[^>]*>/g, '').substring(0, 150)}...
                      </p>
                      
                      <Link 
                        href={`/blogs/${slug}`}
                        className="inline-flex items-center gap-2 text-pink-600 font-bold group/link"
                      >
                        Read More 
                        <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {/* Footer Placeholder */}
      <footer className="bg-slate-900 text-slate-400 py-12 text-center text-sm border-t border-slate-800">
        <p>&copy; {new Date().getFullYear()} WombCare. All rights reserved.</p>
      </footer>
    </main>

  );
}
