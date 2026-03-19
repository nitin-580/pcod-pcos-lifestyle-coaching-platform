'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import BlogEditor, { BlogForm } from '@/components/admin/BlogEditor';

const BASE_URL = 'https://womb-care-backend-76858014616.us-central1.run.app/api/admin';

export default function NewBlogPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState<string | null>(null);

  useEffect(() => {
    const key = sessionStorage.getItem('pcod_admin_key');
    if (!key) {
      router.push('/wombcare-admin-9984');
      return;
    }
    setApiKey(key);
  }, [router]);

  const handleSave = async (data: BlogForm) => {
    if (!apiKey) return;
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/blogs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-api-key': apiKey,
        },
        body: JSON.stringify({
          title: data.title,
          content: data.content,
          authorName: data.authorName,
          published: data.published,
          contentType: data.contentType,
          cover_image: data.coverImage,
          excerpt: data.excerpt // Subheading
        }),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || result.error || 'Failed to create blog');
      }

      router.push('/wombcare-admin-9984');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!apiKey) return null;

  return (
    <BlogEditor 
      title="Create New Post"
      onSave={handleSave}
      onCancel={() => router.push('/wombcare-admin-9984')}
      loading={loading}
    />
  );
}
