'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { API_BASE } from '@/lib/api-config';

export default function JoinDoctorPage() {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    specialization: '',
    qualification: '',
    experience_years: '',
    hospital_clinic: '',
    city: '',
    consultation_mode: 'Online + Offline',
    medical_registration_number: '',
    agreed_to_terms: false,
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox'
          ? (e.target as HTMLInputElement).checked
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.agreed_to_terms) {
      alert('Please agree to the terms before continuing.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/doctors/join-request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          experience_years: Number(formData.experience_years),
        }),
      });

      const data = await res.json();

      if (data.success) {
        setSubmitted(true);
      } else {
        alert(data.message || 'Something went wrong');
      }
    } catch (err) {
      console.error(err);
      alert('Submission failed. Check your internet.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg text-center bg-white shadow-2xl rounded-[40px] p-12 border border-slate-100"
        >
          <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center text-4xl mx-auto mb-8">
            ✅
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Application Sent</h1>
          <p className="text-slate-500 text-lg leading-relaxed">
            Thank you, Dr. {formData.full_name}. Your credentials have been received. 
            A confirmation email has been sent to <strong>{formData.email}</strong>.
          </p>
          <button 
             onClick={() => window.location.href = '/'}
             className="mt-10 px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-black transition"
          >
            Back to Home
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FCFDFB] py-20 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-[40px] shadow-2xl shadow-pink-100/50 p-8 md:p-16 border border-slate-50">
        <div className="text-center mb-12">
           <span className="px-4 py-1.5 rounded-full bg-pink-50 text-pink-600 text-xs font-bold tracking-widest uppercase">
             For Providers
           </span>
           <h1 className="text-4xl md:text-5xl font-black text-slate-900 mt-6">Join WombCare</h1>
           <p className="text-slate-500 mt-4 text-lg">Partner with us to provide specialized care for women's hormonal wellness.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Full Name</label>
              <input name="full_name" placeholder="Dr. Jane Doe" required onChange={handleChange} className="w-full border-b-2 border-slate-100 p-4 focus:outline-none focus:border-pink-500 transition-colors text-lg" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
              <input name="email" type="email" placeholder="jane.doe@hospital.com" required onChange={handleChange} className="w-full border-b-2 border-slate-100 p-4 focus:outline-none focus:border-pink-500 transition-colors text-lg" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Phone Number</label>
              <input name="phone" placeholder="+91 98765 43210" required onChange={handleChange} className="w-full border-b-2 border-slate-100 p-4 focus:outline-none focus:border-pink-500 transition-colors text-lg" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Specialization</label>
              <input name="specialization" placeholder="e.g. Gynaecologist" required onChange={handleChange} className="w-full border-b-2 border-slate-100 p-4 focus:outline-none focus:border-pink-500 transition-colors text-lg" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Qualification</label>
              <input name="qualification" placeholder="e.g. MBBS, MD" required onChange={handleChange} className="w-full border-b-2 border-slate-100 p-4 focus:outline-none focus:border-pink-500 transition-colors text-lg" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Years of Experience</label>
              <input name="experience_years" type="number" placeholder="5" required onChange={handleChange} className="w-full border-b-2 border-slate-100 p-4 focus:outline-none focus:border-pink-500 transition-colors text-lg" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Medical Registration No.</label>
              <input name="medical_registration_number" placeholder="MC-123456" required onChange={handleChange} className="w-full border-b-2 border-slate-100 p-4 focus:outline-none focus:border-pink-500 transition-colors text-lg" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Consultation Mode</label>
              <select name="consultation_mode" onChange={handleChange} className="w-full border-b-2 border-slate-100 p-4 focus:outline-none focus:border-pink-500 transition-colors text-lg bg-transparent">
                <option>Online + Offline</option>
                <option>Online Only</option>
                <option>Offline Only</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Hospital / Clinic Name (Optional)</label>
            <input name="hospital_clinic" placeholder="City General Hospital" onChange={handleChange} className="w-full border-b-2 border-slate-100 p-4 focus:outline-none focus:border-pink-500 transition-colors text-lg" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">City</label>
            <input name="city" placeholder="Bangalore" required onChange={handleChange} className="w-full border-b-2 border-slate-100 p-4 focus:outline-none focus:border-pink-500 transition-colors text-lg" />
          </div>

          <label className="flex items-center gap-4 bg-slate-50 p-6 rounded-2xl cursor-pointer hover:bg-slate-100 transition">
            <input type="checkbox" name="agreed_to_terms" onChange={handleChange} className="w-5 h-5 accent-pink-500" />
            <span className="text-sm text-slate-600 font-medium leading-relaxed">I agree to join WombCare as a provider and accept the onboarding terms, data privacy policy, and medical guidelines.</span>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-6 rounded-2xl font-bold text-xl shadow-2xl shadow-pink-200 hover:scale-[1.01] transition-all disabled:opacity-50"
          >
            {loading ? 'Submitting Application...' : 'Submit Application'}
          </button>
        </form>
      </div>
    </div>
  );
}
