'use client';

import React, { useState } from 'react';
import { Registration } from '../AdminTable';
import { UserPlus, Sparkles, AlertCircle, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { getPublicApiBase } from '@/lib/api-config';

interface EnrollmentFormProps {
  registrations: Registration[];
  onEnrollSuccess: () => void;
}

export default function EnrollmentForm({ registrations, onEnrollSuccess }: EnrollmentFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    phone: '',
    city: '',
    symptoms: '',
    duration: '',
    plan: '',
    consultationTime: '',
    notes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUserSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const userId = e.target.value;
    setSelectedUserId(userId);
    
    if (!userId) {
      setFormData({
        fullName: '',
        age: '',
        phone: '',
        city: '',
        symptoms: '',
        duration: '',
        plan: '',
        consultationTime: '',
        notes: '',
      });
      return;
    }

    const matchedUser = registrations.find(u => u.id === userId);
    if (matchedUser) {
      setFormData({
        fullName: matchedUser.name || '',
        age: matchedUser.age ? String(matchedUser.age) : '',
        phone: matchedUser.phone || '',
        city: matchedUser.country || '',
        symptoms: matchedUser.symptoms || '',
        duration: matchedUser.cycleRegularity || '',
        plan: '',
        consultationTime: '',
        notes: '',
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const endpoint = `${getPublicApiBase()}/enrollments`;
      const payload = {
        fullName: formData.fullName,
        age: Number(formData.age),
        phone: formData.phone,
        city: formData.city,
        symptoms: formData.symptoms,
        duration: formData.duration,
        plan: formData.plan || 'starter',
        consultationTime: formData.consultationTime,
        notes: formData.notes,
      };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to enroll member.');
      }

      setSuccess(true);
      setFormData({
        fullName: '',
        age: '',
        phone: '',
        city: '',
        symptoms: '',
        duration: '',
        plan: '',
        consultationTime: '',
        notes: '',
      });
      setSelectedUserId('');
      onEnrollSuccess();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred during program enrollment.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
      {/* Form Trigger Header */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-slate-50/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center text-pink-600">
            <UserPlus className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-lg">Manual Program Enrollment</h3>
            <p className="text-xs text-slate-500 mt-0.5">Enroll an existing registered user into a custom WombCare plan.</p>
          </div>
        </div>
        {isOpen ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
      </button>

      {isOpen && (
        <div className="border-t border-slate-100 p-6 bg-slate-50/30">
          <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
            {success && (
              <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-emerald-800 text-sm">
                <CheckCircle className="w-5 h-5 shrink-0 text-emerald-600" />
                <span>Patient successfully enrolled in program! List updated below.</span>
              </div>
            )}

            {error && (
              <div className="flex items-center gap-3 p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-800 text-sm">
                <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
                <span>{error}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* User Selection Dropdown */}
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Select Registered User (Optional Auto-Fill)
                </label>
                <select
                  value={selectedUserId}
                  onChange={handleUserSelect}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none transition-all text-sm text-slate-800"
                >
                  <option value="">-- Choose registered user to auto-fill --</option>
                  {registrations.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.email || u.phone})
                    </option>
                  ))}
                </select>
              </div>

              {/* Patient Basic Info */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Priyanshi Mehta"
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none transition-all text-sm text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Age
                  </label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    required
                    placeholder="e.g. 26"
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none transition-all text-sm text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    City / Country
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="e.g. New Delhi"
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none transition-all text-sm text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Phone Number
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="e.g. +91 9876543210"
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none transition-all text-sm text-slate-800"
                />
              </div>

              {/* Plan Choice */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Select Program Plan
                </label>
                <select
                  name="plan"
                  value={formData.plan}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none transition-all text-sm text-slate-800"
                >
                  <option value="">-- Select plan --</option>
                  <option value="Starter Plan">Starter Plan</option>
                  <option value="Premium 90-Day Plan">Premium 90-Day Plan</option>
                  <option value="Doctor Consultation">Doctor Consultation</option>
                </select>
              </div>

              {/* Consultation Time */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Preferred Call Time
                </label>
                <input
                  type="text"
                  name="consultationTime"
                  value={formData.consultationTime}
                  onChange={handleChange}
                  placeholder="e.g. 5:00 PM - 7:00 PM"
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none transition-all text-sm text-slate-800"
                />
              </div>

              {/* Symptom Duration */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Symptom Duration
                </label>
                <input
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  placeholder="e.g. 6 Months / 2 Years"
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none transition-all text-sm text-slate-800"
                />
              </div>

              {/* Symptoms */}
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Symptoms Description
                </label>
                <textarea
                  name="symptoms"
                  value={formData.symptoms}
                  onChange={handleChange}
                  rows={2}
                  placeholder="Describe menstrual symptoms, irregular cycles, hair loss, acne, weight changes etc."
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none transition-all text-sm text-slate-800 resize-none"
                />
              </div>

              {/* Notes */}
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Internal Staff Notes
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={2}
                  placeholder="Any additional details or follow-up plans."
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none transition-all text-sm text-slate-800 resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  setSuccess(false);
                  setError(null);
                }}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-sm font-bold text-slate-700 transition"
              >
                Close Form
              </button>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-pink-600 hover:bg-pink-700 disabled:opacity-50 text-white rounded-xl text-sm font-bold shadow-md shadow-pink-100 transition flex items-center gap-2"
              >
                {isSubmitting ? 'Enrolling...' : 'Enroll Patient'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
