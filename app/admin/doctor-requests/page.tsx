'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminDoctorRequests() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);

  const fetchRequests = async () => {
    try {
      const res = await fetch('/api/admin/doctor-requests');
      const data = await res.json();
      if (data.success) setRequests(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      // Optimistic Update
      setRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r));
      
      const res = await fetch('/api/admin/doctor-requests', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      });
      
      const data = await res.json();
      if (!data.success) {
        alert('Failed to update: ' + data.message);
        fetchRequests(); // Rollback
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-bold text-slate-900">Doctor Onboarding</h1>
            <p className="text-slate-500 mt-2">Manage provider join requests and approvals</p>
          </div>
          <div className="flex gap-4">
            <div className="px-6 py-3 bg-white rounded-2xl shadow-sm border border-slate-100">
               <span className="text-sm text-slate-400 font-bold uppercase tracking-widest">Total Pending</span>
               <p className="text-2xl font-black text-pink-600">{requests.filter(r => r.status === 'pending').length}</p>
            </div>
          </div>
        </header>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-5 text-sm font-bold text-slate-500 uppercase tracking-wider">Doctor</th>
                <th className="px-8 py-5 text-sm font-bold text-slate-500 uppercase tracking-wider">Specialization</th>
                <th className="px-8 py-5 text-sm font-bold text-slate-500 uppercase tracking-wider">Registration</th>
                <th className="px-8 py-5 text-sm font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-8 py-5 text-sm font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                   <td colSpan={5} className="px-8 py-20 text-center text-slate-400">Loading requests...</td>
                </tr>
              ) : requests.length === 0 ? (
                <tr>
                   <td colSpan={5} className="px-8 py-20 text-center text-slate-400">No join requests found.</td>
                </tr>
              ) : requests.map((req) => (
                <tr key={req.id} className="hover:bg-slate-50/30 transition-colors">
                  <td className="px-8 py-6">
                    <div className="font-bold text-slate-900">{req.full_name}</div>
                    <div className="text-xs text-slate-500">{req.email}</div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="text-sm font-medium text-slate-700">{req.specialization}</div>
                    <div className="text-xs text-slate-400">{req.experience_years} years exp.</div>
                  </td>
                  <td className="px-8 py-6">
                    <code className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-600">{req.medical_registration_number}</code>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest ${
                      req.status === 'approved' ? 'bg-green-50 text-green-600' :
                      req.status === 'rejected' ? 'bg-red-50 text-red-600' :
                      'bg-amber-50 text-amber-600'
                    }`}>
                      {req.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right space-x-2">
                    <button 
                      onClick={() => setSelectedRequest(req)}
                      className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition"
                    >
                      View Details
                    </button>
                    {req.status === 'pending' && (
                      <>
                        <button 
                          onClick={() => handleUpdateStatus(req.id, 'approved')}
                          className="px-6 py-2 bg-pink-500 text-white rounded-xl text-xs font-bold hover:bg-pink-600 shadow-lg shadow-pink-100 transition"
                        >
                          Approve
                        </button>
                        <button 
                          onClick={() => handleUpdateStatus(req.id, 'rejected')}
                          className="px-6 py-2 bg-white text-red-500 border border-red-100 rounded-xl text-xs font-bold hover:bg-red-50 transition"
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Modal */}
      <AnimatePresence>
        {selectedRequest && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedRequest(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[40px] p-12 shadow-2xl"
            >
              <h2 className="text-3xl font-bold text-slate-900">Doctor Details</h2>
              <div className="mt-8 grid grid-cols-2 gap-8">
                 <div>
                    <label className="text-xs font-bold text-slate-400 uppercase">Hospital / Clinic</label>
                    <p className="text-slate-900 font-medium mt-1">{selectedRequest.hospital_clinic || 'Not provided'}</p>
                 </div>
                 <div>
                    <label className="text-xs font-bold text-slate-400 uppercase">City</label>
                    <p className="text-slate-900 font-medium mt-1">{selectedRequest.city}</p>
                 </div>
                 <div>
                    <label className="text-xs font-bold text-slate-400 uppercase">Consultation Mode</label>
                    <p className="text-slate-900 font-medium mt-1">{selectedRequest.consultation_mode}</p>
                 </div>
                 <div>
                    <label className="text-xs font-bold text-slate-400 uppercase">Qualification</label>
                    <p className="text-slate-900 font-medium mt-1">{selectedRequest.qualification}</p>
                 </div>
              </div>
              <button 
                onClick={() => setSelectedRequest(null)}
                className="mt-12 w-full py-4 bg-slate-100 rounded-2xl font-bold text-slate-600 hover:bg-slate-200 transition"
              >
                Close
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
