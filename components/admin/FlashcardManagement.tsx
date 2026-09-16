import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase-client';
import { Loader2, Plus, Trash2, Eye, LayoutGrid, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Slide {
  title: string;
  content: string;
}

interface Flashcard {
  id: string;
  cover_title: string;
  cover_image: string;
  bg_color: string;
  text_color: string;
  slides: Slide[];
}

export default function FlashcardManagement({ apiKey }: { apiKey: string }) {
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form States
  const [coverTitle, setCoverTitle] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [bgColor, setBgColor] = useState('#4E8B7A');
  const [textColor, setTextColor] = useState('#FFFFFF');
  const [slides, setSlides] = useState<Slide[]>([{ title: '', content: '' }]);

  // Preview State
  const [previewCard, setPreviewCard] = useState<Flashcard | null>(null);
  const [activePreviewSlide, setActivePreviewSlide] = useState(0);

  const fetchCards = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('wombcare_flashcards')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setCards(data);
      }
    } catch (err) {
      console.error('Error loading flashcards:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  const handleAddSlide = () => {
    setSlides([...slides, { title: '', content: '' }]);
  };

  const handleRemoveSlide = (idx: number) => {
    setSlides(slides.filter((_, i) => i !== idx));
  };

  const handleSlideChange = (idx: number, field: keyof Slide, val: string) => {
    const updated = [...slides];
    updated[idx][field] = val;
    setSlides(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!coverTitle.trim()) return;

    try {
      setSaving(true);
      const cleanedSlides = slides.filter(s => s.title.trim() || s.content.trim());

      const { error } = await supabase
        .from('wombcare_flashcards')
        .insert({
          cover_title: coverTitle.trim(),
          cover_image: coverImage.trim() || null,
          bg_color: bgColor,
          text_color: textColor,
          slides: cleanedSlides
        });

      if (!error) {
        setCoverTitle('');
        setCoverImage('');
        setBgColor('#4E8B7A');
        setTextColor('#FFFFFF');
        setSlides([{ title: '', content: '' }]);
        fetchCards();
      } else {
        alert('Supabase Error: Make sure the wombcare_flashcards table exists by running the migration SQL.');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this flashcard?')) return;
    try {
      const { error } = await supabase
        .from('wombcare_flashcards')
        .delete()
        .eq('id', id);

      if (!error) {
        fetchCards();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8 font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Creation Form */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
          <h3 className="font-bold text-slate-800 text-xl mb-6">Create New Onboarding Flashcard</h3>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-600 mb-2">Cover Card Title</label>
                <input
                  type="text"
                  placeholder="E.g., Eco-friendly periods"
                  value={coverTitle}
                  onChange={(e) => setCoverTitle(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none text-slate-800"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-600 mb-2">Cover Illustration Image URL</label>
                <input
                  type="text"
                  placeholder="https://... or empty for fallback"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none text-slate-800"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-600 mb-2">Card Background Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-12 h-12 rounded-xl border border-slate-200 cursor-pointer overflow-hidden p-0"
                  />
                  <input
                    type="text"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-600 mb-2">Text Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="w-12 h-12 rounded-xl border border-slate-200 cursor-pointer overflow-hidden p-0"
                  />
                  <input
                    type="text"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Carousel Slides */}
            <div className="border-t border-slate-100 pt-6 space-y-4">
              <div className="flex justify-between items-center mb-4">
                <label className="text-sm font-bold text-slate-700">Detail Slides (Swipable inside popup)</label>
                <button
                  type="button"
                  onClick={handleAddSlide}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-pink-50 text-pink-600 hover:bg-pink-100 transition rounded-xl text-xs font-bold"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Slide
                </button>
              </div>

              {slides.map((slide, idx) => (
                <div key={idx} className="bg-slate-50 p-6 rounded-2xl relative space-y-4 border border-slate-100">
                  {slides.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveSlide(idx)}
                      className="absolute top-4 right-4 text-slate-400 hover:text-rose-500 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                  
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Slide #{idx + 1}</span>

                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Slide Title (e.g., Menstrual Cups)"
                      value={slide.title}
                      onChange={(e) => handleSlideChange(idx, 'title', e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none text-sm text-slate-800"
                      required
                    />
                    <textarea
                      placeholder="Slide content paragraphs..."
                      value={slide.content}
                      onChange={(e) => handleSlideChange(idx, 'content', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none text-sm text-slate-800"
                      required
                    />
                  </div>
                </div>
              ))}
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 active:scale-[0.98] transition flex justify-center items-center gap-2"
            >
              {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Publish Flashcard'}
            </button>
          </form>
        </div>

        {/* Live List Preview / Mock View */}
        <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
          <h3 className="font-bold text-slate-800 text-xl mb-6">Current Flashcards</h3>

          {loading ? (
            <div className="py-12 flex justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-pink-500" />
            </div>
          ) : cards.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <LayoutGrid className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm font-medium">No cards defined. Seeding default fallback cards.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cards.map((card) => (
                <div
                  key={card.id}
                  style={{ backgroundColor: card.bg_color }}
                  className="p-6 rounded-2xl relative flex flex-col justify-between h-40 shadow-sm border border-black/5"
                >
                  <div className="flex justify-between items-start">
                    <TextWithStyle color={card.text_color} className="font-bold text-lg leading-tight flex-1 mr-6">
                      {card.cover_title}
                    </TextWithStyle>
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => {
                          setPreviewCard(card);
                          setActivePreviewSlide(0);
                        }}
                        className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(card.id)}
                        className="p-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-200 rounded-lg transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {card.cover_image && (
                    <img
                      src={card.cover_image}
                      alt="icon"
                      className="w-12 h-12 object-contain absolute bottom-4 right-4 opacity-90"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  )}

                  <span style={{ color: card.text_color, opacity: 0.8 }} className="text-[10px] font-bold uppercase tracking-wider">
                    {card.slides?.length || 0} Swipable Slides
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* POPUP MODAL CAROUSEL PREVIEW */}
      {previewCard && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div
            style={{ backgroundColor: previewCard.bg_color, color: previewCard.text_color }}
            className="max-w-md w-full rounded-[2.5rem] p-8 relative shadow-2xl h-[420px] flex flex-col justify-between transition-all"
          >
            <button
              onClick={() => setPreviewCard(null)}
              className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full transition text-current"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex-1 mt-6 justify-center flex flex-col">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activePreviewSlide}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <h4 className="text-2xl font-black">{previewCard.slides[activePreviewSlide]?.title}</h4>
                  <p className="opacity-90 leading-relaxed text-sm">{previewCard.slides[activePreviewSlide]?.content}</p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Slider Dots */}
            <div className="flex justify-between items-center mt-6">
              <div className="flex gap-2">
                {previewCard.slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActivePreviewSlide(i)}
                    style={{ backgroundColor: previewCard.text_color }}
                    className={`w-2 h-2 rounded-full transition-all ${activePreviewSlide === i ? 'opacity-100 scale-125' : 'opacity-30'}`}
                  />
                ))}
              </div>
              <span className="text-xs opacity-75 font-semibold">
                {activePreviewSlide + 1} of {previewCard.slides.length}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Simple Helper to map colors dynamically inline
function TextWithStyle({ color, children, className }: { color: string; children: React.ReactNode; className: string }) {
  return (
    <span style={{ color }} className={className}>
      {children}
    </span>
  );
}
