'use client';

import { useState } from 'react';
import {
  Minus,
  Plus,
  Share2,
  Check,
} from 'lucide-react';

interface BlogContentProps {
  content: string;
  title?: string;
}

export default function BlogContent({
  content,
  title = 'WombCare Blog',
}: BlogContentProps) {
  const [fontSize, setFontSize] = useState(1.125);
  const [copied, setCopied] = useState(false);

  const increaseFontSize = () => {
    setFontSize((prev) => Math.min(prev + 0.125, 2));
  };

  const decreaseFontSize = () => {
    setFontSize((prev) => Math.max(prev - 0.125, 1));
  };

  const handleShare = async () => {
    const shareData = {
      title,
      text: 'Read this article on WombCare',
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        return;
      }

      await navigator.clipboard.writeText(
        window.location.href
      );

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error('Share failed:', error);
    }
  };

  return (
    <div className="relative">
      {/* Sticky Controls */}
      <div className="sticky top-24 z-10 hidden lg:block float-right -mr-24 bg-white/90 backdrop-blur-md border border-slate-100 rounded-2xl p-2 shadow-sm space-y-2">
        {/* Increase Font */}
        <button
          onClick={increaseFontSize}
          className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-50 text-slate-400 hover:text-pink-600 transition-colors"
          title="Increase font size"
        >
          <Plus className="w-5 h-5" />
        </button>

        {/* Decrease Font */}
        <button
          onClick={decreaseFontSize}
          className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-50 text-slate-400 hover:text-pink-600 transition-colors"
          title="Decrease font size"
        >
          <Minus className="w-5 h-5" />
        </button>

        {/* Only Share Button */}
        <button
          onClick={handleShare}
          className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-50 text-slate-400 hover:text-purple-600 transition-colors"
          title="Share article"
        >
          {copied ? (
            <Check className="w-5 h-5 text-green-500" />
          ) : (
            <Share2 className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Blog Content */}
      <div
        className="
          prose 
          prose-slate 
          max-w-none
          prose-p:leading-[1.8]
          prose-p:text-slate-600
          prose-headings:text-slate-900
          prose-headings:font-extrabold
          prose-strong:text-slate-900
          prose-img:rounded-3xl
          prose-img:shadow-md
          prose-h1:text-5xl
          prose-h1:mt-16
          prose-h1:mb-8
          prose-h2:text-4xl
          prose-h2:mt-12
          prose-h2:mb-6
          prose-a:text-pink-600
          prose-a:no-underline
          hover:prose-a:text-purple-600
        "
        style={{ fontSize: `${fontSize}rem` }}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
}