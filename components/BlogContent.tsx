'use client';

import { useState } from 'react';
import { Minus, Plus, Type } from 'lucide-react';

interface BlogContentProps {
  content: string;
}

export default function BlogContent({ content }: BlogContentProps) {
  const [fontSize, setFontSize] = useState(1.125); // base 1.125rem (xl)

  const increaseFontSize = () => setFontSize(prev => Math.min(prev + 0.125, 2));
  const decreaseFontSize = () => setFontSize(prev => Math.max(prev - 0.125, 1));

  return (
    <div className="relative">
      {/* Font Size Controls */}
      <div className="sticky top-24 z-10 hidden lg:block float-right -mr-24 bg-white/80 backdrop-blur-md border border-slate-100 rounded-2xl p-2 shadow-sm space-y-2">
        <button 
          onClick={increaseFontSize}
          className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-50 text-slate-400 hover:text-pink-600 transition-colors"
          title="Increase font size"
        >
          <Plus className="w-5 h-5" />
        </button>
        <div className="w-10 h-10 flex items-center justify-center text-slate-300">
          <Type className="w-5 h-5" />
        </div>
        <button 
          onClick={decreaseFontSize}
          className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-50 text-slate-400 hover:text-pink-600 transition-colors"
          title="Decrease font size"
        >
          <Minus className="w-5 h-5" />
        </button>
      </div>

      <div 
        className="prose prose-slate max-w-none prose-p:leading-[1.8] prose-p:text-slate-600 prose-headings:text-slate-900 prose-headings:font-extrabold prose-strong:text-slate-900 prose-img:rounded-3xl prose-h1:text-5xl prose-h1:mt-16 prose-h1:mb-8 prose-h2:text-4xl prose-h2:mt-12 prose-h2:mb-6"
        style={{ fontSize: `${fontSize}rem` }}
        dangerouslySetInnerHTML={{ __html: content }} 
      />
    </div>
  );
}
