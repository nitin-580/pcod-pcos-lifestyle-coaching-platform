'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface CareerForm {
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
  requirements: string[];
  active: boolean;
}

interface CareerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  editingCareer: any | null;
  careerForm: CareerForm;
  setCareerForm: (form: CareerForm) => void;
  loading: boolean;
}

const CareerModal: React.FC<CareerModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingCareer,
  careerForm,
  setCareerForm,
  loading
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
              <h3 className="text-2xl font-bold text-slate-800">{editingCareer ? 'Edit Job Opening' : 'Create Job Opening'}</h3>
              <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-all text-slate-400">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={onSubmit} className="p-10 space-y-6 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700 ml-1 italic">Job Title</label>
                  <input required value={careerForm.title} onChange={e => setCareerForm({...careerForm, title: e.target.value})} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none" placeholder="e.g. Senior Health Coach" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700 ml-1 italic">Department</label>
                  <input required value={careerForm.department} onChange={e => setCareerForm({...careerForm, department: e.target.value})} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none" placeholder="e.g. Coaching" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700 ml-1 italic">Location</label>
                  <input required value={careerForm.location} onChange={e => setCareerForm({...careerForm, location: e.target.value})} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none" placeholder="e.g. Remote (India)" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700 ml-1 italic">Job Type</label>
                  <select value={careerForm.type} onChange={e => setCareerForm({...careerForm, type: e.target.value})} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none">
                    <option>Full-time</option>
                    <option>Part-time</option>
                    <option>Contract</option>
                    <option>Internship</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700 ml-1 italic">Description</label>
                <textarea required rows={4} value={careerForm.description} onChange={e => setCareerForm({...careerForm, description: e.target.value})} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none resize-none" placeholder="Provide a brief summary of the role..." />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700 ml-1 italic">Requirements (One per line)</label>
                <textarea rows={4} value={careerForm.requirements.join('\n')} onChange={e => setCareerForm({...careerForm, requirements: e.target.value.split('\n')})} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none resize-none" placeholder="What are we looking for?" />
              </div>

              <div className="flex items-center gap-2 ml-1">
                <input type="checkbox" id="active" checked={careerForm.active} onChange={e => setCareerForm({...careerForm, active: e.target.checked})} className="w-4 h-4 rounded text-pink-500 focus:ring-pink-500" />
                <label htmlFor="active" className="text-sm font-medium text-slate-700">List this job publicly</label>
              </div>

              <button type="submit" disabled={loading} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all active:scale-[0.98]">
                {loading ? 'Saving...' : editingCareer ? 'Update Job' : 'Post Job'}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CareerModal;
