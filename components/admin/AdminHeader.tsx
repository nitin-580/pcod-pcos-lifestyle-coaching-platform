'use client';

import React from 'react';
import { Plus } from 'lucide-react';

interface AdminHeaderProps {
  activeTab: 'registrations' | 'blogs' | 'careers';
  onNewBlog: () => void;
  onNewCareer: () => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ activeTab, onNewBlog, onNewCareer }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
      <div>
        <h2 className="text-3xl font-bold text-slate-800 mb-2">
          {activeTab === 'registrations' ? 'User Registrations' : activeTab === 'blogs' ? 'Blog Management' : 'Career Opportunities'}
        </h2>
        <p className="text-slate-500">
          {activeTab === 'registrations' ? 'Track your growth and user data.' : activeTab === 'blogs' ? 'Create and manage educational content.' : 'Manage job openings and hiring.'}
        </p>
      </div>
      
      {activeTab === 'blogs' && (
        <button 
          onClick={onNewBlog}
          className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-full font-bold shadow-lg hover:shadow-xl transition-all"
        >
          <Plus className="w-5 h-5" /> New Blog Post
        </button>
      )}

      {activeTab === 'careers' && (
        <button 
          onClick={onNewCareer}
          className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-full font-bold shadow-lg hover:shadow-xl transition-all"
        >
          <Plus className="w-5 h-5" /> New Job Opening
        </button>
      )}
    </div>
  );
};

export default AdminHeader;
