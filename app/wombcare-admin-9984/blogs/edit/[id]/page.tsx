'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import BlogEditor, { BlogForm } from '@/components/admin/BlogEditor';

import { API_BASE } from '@/lib/api-config';

export default function EditBlogPage() {
  const router = useRouter();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [initialData, setInitialData] = useState<Partial<BlogForm> | null>(null);

  useEffect(() => {
    const key = sessionStorage.getItem('pcod_admin_key');
    if (!key) {
      router.push('/wombcare-admin-9984');
      return;
    }
    setApiKey(key);
    fetchBlog(key);
  }, [id, router]);

  const fetchBlog = async (key: string) => {
    try {
      // Find the blog in the full list or fetch specific (if endpoint exists)
      // Documentation says /admin/blogs lists all. We'll find by ID.
      const response = await fetch(`${API_BASE}/blogs`, {
        headers: { 'x-admin-api-key': key },
      });
      const result = await response.json();
      if (result.success) {
        const blog = result.data.find((b: any) => b.id === id);
        if (blog) {
          setInitialData({
            title: blog.title,
            excerpt: blog.excerpt || '',
            content: blog.content,
            authorName: blog.authorName,
            coverImage: blog.coverImage || blog.cover_image || '',
            published: blog.published,
            contentType: blog.contentType || 'html',
          });
        } else {
          throw new Error('Blog not found');
        }
      }
    } catch (err: any) {
      alert(err.message);
      router.push('/wombcare-admin-9984');
    } finally {
      setFetching(false);
    }
  };

  const handleSave = async (data: BlogForm) => {
    if (!apiKey || !id) return;
    setLoading(true);
    
    const requestBody = {
      title: data.title,
      content: data.content,
      authorName: data.authorName,
      published: data.published,
      contentType: data.contentType,
      cover_image: data.coverImage,
      excerpt: data.excerpt
    };

    try {
      const response = await fetch(`${API_BASE}/blogs/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-api-key': apiKey,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const result = await response.json().catch(() => ({}));
        throw new Error(result.message || result.error || `Failed to update blog (Status: ${response.status})`);
      }

      router.push('/wombcare-admin-9984');
    } catch (err: any) {
      console.error('Save error:', err);
      const isNetworkError = err.message.includes('Failed to fetch') || err.name === 'TypeError';
      
      let errorMessage = err.message || 'Failed to connect to server';
      if (isNetworkError) {
        errorMessage = 'Network Error: Failed to connect to the backend through the proxy. Please ensure the backend is running and reachable.';
      }
      
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="min-h-screen flex items-center justify-center bg-[#FDFCFD] text-slate-400 font-bold">Loading Editor...</div>;
  if (!initialData) return null;

  return (
    <BlogEditor 
      title="Edit Post"
      initialData={initialData}
      onSave={handleSave}
      onCancel={() => router.push('/wombcare-admin-9984')}
      loading={loading}
    />
  );
}
