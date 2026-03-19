'use client';

import React from 'react';
import { Edit3, Trash2 } from 'lucide-react';

interface Career {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
  requirements: string[];
  active: boolean;
}

interface CareerListProps {
  careers: Career[];
  loading: boolean;
  onEdit: (career: Career) => void;
  onDelete: (id: string) => void;
}

const CareerList: React.FC<CareerListProps> = ({ careers, loading, onEdit, onDelete }) => {
  return (
    <div className="grid grid-cols-1 gap-4">
      {careers.map((career) => (
        <div 
          key={career.id} 
          className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between hover:border-pink-200 transition-all translate-y-0 hover:-translate-y-1"
        >
          <div className="flex-1 min-w-0 pr-6">
            <h3 className="font-bold text-lg text-slate-800 truncate mb-1">{career.title}</h3>
            <div className="flex items-center gap-4 text-xs text-slate-400 font-medium uppercase tracking-wider">
              <span>{career.department}</span>
              <span>•</span>
              <span>{career.location}</span>
              <span>•</span>
              <span className={career.active ? 'text-emerald-500' : 'text-slate-400'}>
                {career.active ? 'Active' : 'Hidden'}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => onEdit(career)}
              className="p-3 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
            >
              <Edit3 className="w-5 h-5" />
            </button>
            <button 
              onClick={() => onDelete(career.id)}
              className="p-3 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      ))}
      {careers.length === 0 && !loading && (
        <div className="py-20 text-center text-slate-300">
          No job openings yet. Click "New Job Opening" to start.
        </div>
      )}
    </div>
  );
};

export default CareerList;
