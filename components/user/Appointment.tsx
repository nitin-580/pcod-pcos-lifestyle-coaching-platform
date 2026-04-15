'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  time: string;
  userId: string;
  onRefresh?: () => void;
  patientName?: string;
  email?: string;
}

export default function Appointment({ time, userId, onRefresh, patientName, email }: Props) {
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    doctorName: 'Dr. Sarah (Lead Coach)',
    notes: ''
  });

  const handleSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const appointmentDate = new Date(`${formData.date}T${formData.time}`).toISOString();
      
      const res = await fetch(`/api/appointments/book`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          doctorName: formData.doctorName,
          appointmentDate,
          notes: formData.notes,
          email,
          patientName
        })
      });

      const data = await res.json();
      if (data.success) {
        setSuccessMsg('Your appointment has been scheduled successfully!');
        if (onRefresh) onRefresh();
        setTimeout(() => {
          setShowModal(false);
          setSuccessMsg('');
        }, 2000);
      }
    } catch (err) {
      console.error('Schedule error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-8 border border-purple-100 shadow-md h-full flex flex-col justify-between">
      <div>
        <p className="text-xs font-bold text-purple-500 uppercase tracking-widest mb-4">
          Upcoming Session
        </p>

        <h2 className="text-3xl font-bold text-slate-900">
          {time || 'No session scheduled'}
        </h2>

        <p className="text-slate-500 mt-2 text-sm">
          {time !== 'No scheduled sessions' ? 'Coach consultation scheduled' : 'Book a session with your health coach'}
        </p>
      </div>

      <button 
        onClick={() => setShowModal(true)}
        className="mt-8 w-full py-4 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-sm shadow-lg shadow-purple-100 hover:scale-[1.02] transition"
      >
        Schedule Appointment
      </button>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[40px] p-8 md:p-12 shadow-2xl"
            >
              {successMsg ? (
                <div className="text-center py-10">
                  <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center text-4xl mx-auto mb-6">
                    ✅
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">{successMsg}</h2>
                  <p className="text-slate-500 mt-2">Check your dashboard for updates.</p>
                </div>
              ) : (
                <>
                  <h2 className="text-3xl font-bold text-slate-900 text-center">Schedule Session</h2>
                  <p className="text-slate-500 text-center mt-2">Pick a date and time for your consultation</p>

                  <form onSubmit={handleSchedule} className="mt-10 space-y-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Select Date</label>
                      <input 
                        type="date" 
                        required
                        className="w-full border-b border-purple-100 py-3 focus:outline-none focus:border-purple-500 transition-colors"
                        onChange={(e) => setFormData({...formData, date: e.target.value})}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Select Time</label>
                      <input 
                        type="time" 
                        required
                        className="w-full border-b border-purple-100 py-3 focus:outline-none focus:border-purple-500 transition-colors"
                        onChange={(e) => setFormData({...formData, time: e.target.value})}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Lead Coach</label>
                      <select 
                        className="w-full border-b border-purple-100 py-3 focus:outline-none focus:border-purple-500 transition-colors bg-white"
                        onChange={(e) => setFormData({...formData, doctorName: e.target.value})}
                      >
                        <option>Dr. Sarah (Lead Coach)</option>
                        <option>Coach Priya (Nutritionist)</option>
                        <option>Dr. Ananya (Gynaecologist)</option>
                      </select>
                    </div>

                    <button 
                      disabled={isSubmitting}
                      className="w-full py-5 rounded-2xl bg-slate-900 text-white font-bold shadow-xl hover:bg-black transition disabled:opacity-50"
                    >
                      {isSubmitting ? 'Confirming...' : 'Confirm Appointment'}
                    </button>
                  </form>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}