'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getPublicApiBase } from '@/lib/api-config';
import { Calendar, Clock, AlertCircle, Plus, ChevronRight } from 'lucide-react';

interface Props {
  time: string;
  appointments: any[];
  userId: string;
  onRefresh?: () => void;
  patientName?: string;
  email?: string;
}

export default function Appointment({ time, appointments, userId, onRefresh, patientName, email }: Props) {
  const [showModal, setShowModal] = useState(false);
  const [showAllModal, setShowAllModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    doctorName: 'Dr. Sarah (Lead Coach)',
    notes: ''
  });

  const nextAppointment = useMemo(() => {
    return appointments
      .filter(a => a.status === 'scheduled' || a.status === 'approved')
      .sort((a, b) => new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime())[0];
  }, [appointments]);

  const urgency = useMemo(() => {
    if (!nextAppointment) return 'none';
    const apptDate = new Date(nextAppointment.appointmentDate);
    const now = new Date();
    const diff = apptDate.getTime() - now.getTime();
    const diffHours = diff / (1000 * 60 * 60);

    if (diffHours < 0) return 'past';
    if (diffHours < 24) return 'urgent'; // Less than 24 hours
    if (diffHours < 48) return 'near'; // Less than 48 hours
    return 'safe';
  }, [nextAppointment]);

  const handleSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('userToken');
      const appointmentDate = new Date(`${formData.date}T${formData.time}`).toISOString();
      
      const res = await fetch(`${getPublicApiBase()}/appointments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userId,
          doctorName: formData.doctorName,
          appointmentDate,
          notes: formData.notes
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

  const getUrgencyStyles = () => {
    switch (urgency) {
      case 'urgent':
        return 'bg-rose-50 border-rose-200 text-rose-600 shadow-rose-100';
      case 'near':
        return 'bg-amber-50 border-amber-200 text-amber-600 shadow-amber-100';
      default:
        return 'bg-white border-purple-100 text-purple-600 shadow-purple-50';
    }
  };

  return (
    <div className={`rounded-3xl p-8 border transition-all duration-500 shadow-lg flex flex-col justify-between h-full relative overflow-hidden ${getUrgencyStyles()}`}>
      {urgency === 'urgent' && (
        <motion.div 
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute top-0 right-0 w-32 h-32 bg-rose-200/20 rounded-full -mr-10 -mt-10 blur-2xl"
        />
      )}

      <div>
        <div className="flex items-center justify-between mb-6">
          <p className={`text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full border ${
            urgency === 'urgent' ? 'bg-rose-100 border-rose-200' : 'bg-purple-50 border-purple-100'
          }`}>
            {urgency === 'urgent' ? '🚨 Immediate' : urgency === 'near' ? '🕒 Coming Up' : '📅 Upcoming Session'}
          </p>
          
          {appointments.length > 0 && (
            <button 
              onClick={() => setShowAllModal(true)}
              className="text-xs font-bold text-slate-400 hover:text-slate-600 flex items-center gap-1"
            >
              View All ({appointments.length}) <ChevronRight className="w-3 h-3" />
            </button>
          )}
        </div>

        <h2 className={`text-3xl font-black tracking-tight leading-tight ${urgency === 'urgent' ? 'text-rose-900' : 'text-slate-900'}`}>
          {time || 'Ready for Care?'}
        </h2>

        <p className={`mt-3 text-sm font-medium ${urgency === 'urgent' ? 'text-rose-600' : 'text-slate-500'}`}>
          {nextAppointment ? `Session with ${nextAppointment.doctorName}` : 'Scale your wellness with a Lead Coach session.'}
        </p>

        {urgency === 'urgent' && (
          <div className="mt-4 flex items-center gap-2 text-rose-600 font-bold text-xs animate-pulse">
            <AlertCircle className="w-4 h-4" />
            Starting soon today!
          </div>
        )}
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4">
        <button 
          onClick={() => setShowModal(true)}
          className={`py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-md active:scale-95 ${
            urgency === 'urgent' 
              ? 'bg-rose-600 text-white shadow-rose-200' 
              : 'bg-slate-900 text-white shadow-slate-200'
          }`}
        >
          Book New
        </button>
        <button 
          disabled={!nextAppointment}
          className={`py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all border shadow-sm active:scale-95 ${
            urgency === 'urgent' 
              ? 'bg-white border-rose-200 text-rose-600' 
              : 'bg-white border-slate-100 text-slate-600'
          } disabled:opacity-30`}
        >
          Reschedule
        </button>
      </div>

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
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              className="relative w-full max-w-lg bg-white rounded-[40px] p-8 md:p-12 shadow-2xl border border-slate-100"
            >
              {successMsg ? (
                <div className="text-center py-10">
                  <div className="w-24 h-24 rounded-full bg-green-50 flex items-center justify-center text-5xl mx-auto mb-8 animate-bounce">
                    ✨
                  </div>
                  <h2 className="text-3xl font-black text-slate-900 mb-2">Confirmed!</h2>
                  <p className="text-slate-500 font-medium">{successMsg}</p>
                </div>
              ) : (
                <>
                  <h2 className="text-4xl font-black text-slate-900 mb-2">Schedule Session</h2>
                  <p className="text-slate-500 font-medium mb-10">Select your preferred slot for the consultation.</p>

                  <form onSubmit={handleSchedule} className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Date</label>
                        <input 
                          type="date" 
                          required
                          className="w-full bg-slate-50 border-none rounded-2xl p-4 text-slate-800 font-bold focus:ring-2 focus:ring-purple-500 transition-all"
                          onChange={(e) => setFormData({...formData, date: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Time</label>
                        <input 
                          type="time" 
                          required
                          className="w-full bg-slate-50 border-none rounded-2xl p-4 text-slate-800 font-bold focus:ring-2 focus:ring-purple-500 transition-all"
                          onChange={(e) => setFormData({...formData, time: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Lead Health Expert</label>
                      <select 
                        className="w-full bg-slate-50 border-none rounded-2xl p-4 text-slate-800 font-bold focus:ring-2 focus:ring-purple-500 transition-all appearance-none"
                        onChange={(e) => setFormData({...formData, doctorName: e.target.value})}
                      >
                        <option>Dr. Sarah (Lead Coach)</option>
                        <option>Coach Priya (Nutritionist)</option>
                        <option>Dr. Ananya (Gynaecologist)</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Reason for consultation (Optional)</label>
                      <textarea 
                        rows={3}
                        className="w-full bg-slate-50 border-none rounded-2xl p-4 text-slate-800 font-medium focus:ring-2 focus:ring-purple-500 transition-all"
                        placeholder="Ex: Sync issue with my cycle..."
                        onChange={(e) => setFormData({...formData, notes: e.target.value})}
                      />
                    </div>

                    <button 
                      disabled={isSubmitting}
                      className="w-full py-5 rounded-3xl bg-slate-900 text-white font-black text-lg shadow-xl shadow-slate-200 hover:bg-black transition disabled:opacity-50 mt-4 h-16 flex items-center justify-center"
                    >
                      {isSubmitting ? (
                        <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin" />
                      ) : 'Secure My Slot'}
                    </button>
                  </form>
                </>
              )}
            </motion.div>
          </div>
        )}

        {showAllModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAllModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-white p-8 md:p-12 shadow-2xl overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-3xl font-black text-slate-900">Your Sessions</h2>
                <button 
                  onClick={() => setShowAllModal(false)}
                  className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center hover:bg-slate-100 transition"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6">
                {appointments.length === 0 ? (
                  <div className="text-center py-20 bg-slate-50 rounded-3xl">
                    <Calendar className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                    <p className="text-slate-400 font-bold italic">No sessions found</p>
                  </div>
                ) : (
                  appointments.sort((a,b) => new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime()).map(appt => (
                    <div key={appt.id} className="p-6 rounded-3xl border border-slate-100 bg-white hover:border-purple-100 transition-all group">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-xs font-black text-purple-500 uppercase tracking-widest mb-1">{appt.status}</p>
                          <h4 className="text-lg font-black text-slate-900">{appt.doctorName}</h4>
                          <div className="flex items-center gap-4 mt-3 text-slate-400 text-sm font-medium">
                            <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {new Date(appt.appointmentDate).toLocaleDateString()}</span>
                            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {new Date(appt.appointmentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <button 
                onClick={() => {
                  setShowAllModal(false);
                  setShowModal(true);
                }}
                className="mt-10 w-full py-5 rounded-3xl bg-pink-500 text-white font-black flex items-center justify-center gap-3 shadow-xl shadow-pink-100 hover:bg-pink-600 transition"
              >
                <Plus className="w-6 h-6" /> Schedule New
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
