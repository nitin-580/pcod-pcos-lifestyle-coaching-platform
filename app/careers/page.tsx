'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, Star, Heart, Zap, Globe, Users, X, CheckCircle2, User, Mail, Phone, MapPin, Briefcase } from 'lucide-react';
import FloatingNavbar from '@/components/FloatingNavbar';

const BASE_URL = 'https://womb-care-backend-76858014616.us-central1.run.app/api';

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

export default function CareersPage() {
  const [roles, setRoles] = useState<Career[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState<Career | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    fetch(`${BASE_URL}/careers`)
      .then(res => res.json())
      .then(data => {
        setRoles(data.data?.filter((r: Career) => r.active) || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleApply = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      age: 25, // Placeholder
      weight: 60, // Placeholder
      cycleRegularity: 'Job Application',
      symptoms: `Applied for: ${selectedRole?.title}`,
      country: 'IN',
      source: `Career: ${selectedRole?.title}`
    };

    try {
      const res = await fetch(`${BASE_URL}/early-access`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) setIsSuccess(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-white font-sans overflow-x-hidden flex flex-col">
      <FloatingNavbar />
      
      <div className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-32 pb-24 overflow-hidden">
          <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-pink-100/30 blur-[100px] rounded-full" />
          <div className="absolute bottom-[20%] right-[-5%] w-[30%] h-[50%] bg-purple-100/30 blur-[120px] rounded-full" />
          
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
              <motion.div 
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-50 border border-pink-100 text-pink-600 text-sm font-bold mb-8"
              >
                <Sparkles className="w-4 h-4" /> Join our mission
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-5xl md:text-7xl font-extrabold text-slate-900 leading-[1.05] tracking-tight mb-8"
              >
                Building the future of <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600">Women's Wellness</span>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl text-slate-500 leading-relaxed mb-12 max-w-2xl"
              >
                We're a remote-first team of experts, engineers, and visionaries dedicated to solving women's hormonal health issues through science, technology, and empathy.
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex gap-4"
              >
                <a href="#open-roles" className="px-8 py-4 bg-slate-900 text-white rounded-full font-bold shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all flex items-center gap-2">
                  View Open Positions <ArrowRight className="w-4 h-4" />
                </a>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: <Heart className="text-pink-500" />, title: 'Mission-First', desc: 'Everything we do is to improve the lives of women struggling with PCOD.' },
                { icon: <Globe className="text-blue-500" />, title: 'Remote-Always', desc: 'Work from anywhere in the world. We value ownership over clock-ins.' },
                { icon: <Users className="text-purple-500" />, title: 'Diverse Voices', desc: 'We believe solving collective problems requires unique, diverse perspectives.' },
                { icon: <Zap className="text-amber-500" />, title: 'Bias for Action', desc: 'We move fast, experiment deeply, and learn from every interaction.' },
              ].map((v, i) => (
                <div key={i} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center mb-6">{v.icon}</div>
                  <h3 className="text-xl font-bold text-slate-800 mb-3">{v.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Open Roles Section */}
        <section id="open-roles" className="py-32">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-extrabold text-slate-900 mb-4">Open Positions</h2>
              <p className="text-slate-500">Don't see a role that fits? Email us at careers@wombcare.in</p>
            </div>
            
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-20 text-slate-400">Loading open roles...</div>
              ) : roles.length > 0 ? (
                roles.map((role, i) => (
                  <motion.div 
                    key={role.id}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ x: 10 }}
                    onClick={() => { setSelectedRole(role); setIsModalOpen(true); setIsSuccess(false); }}
                    className="group p-8 bg-white border border-slate-100 rounded-[2rem] hover:border-pink-200 hover:shadow-xl hover:shadow-pink-50 transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-6"
                  >
                    <div>
                      <h3 className="text-xl font-bold text-slate-800 group-hover:text-pink-600 transition-colors">{role.title}</h3>
                      <div className="flex gap-4 mt-2 text-sm text-slate-400 font-medium font-mono uppercase tracking-tighter">
                        <span>{role.department}</span>
                        <span>•</span>
                        <span>{role.location}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <span className="px-4 py-1.5 rounded-full bg-slate-50 text-slate-500 text-xs font-bold">{role.type}</span>
                      <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-pink-500 group-hover:text-white transition-all">
                        <ArrowRight className="w-5 h-5" />
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                  <div className="text-center py-20 bg-slate-50 rounded-[2rem] border border-dashed border-slate-200 text-slate-400">
                      No active job openings at the moment. Check back soon!
                  </div>
              )}
            </div>
          </div>
        </section>
      </div>

      {/* Application Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl overflow-hidden relative"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-full transition-all text-slate-400 z-10"
              >
                <X className="w-6 h-6" />
              </button>

              {isSuccess ? (
                <div className="p-16 text-center">
                  <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8">
                    <CheckCircle2 className="w-10 h-10 text-green-500" />
                  </div>
                  <h3 className="text-3xl font-bold text-slate-800 mb-4">Application Received!</h3>
                  <p className="text-slate-500 text-lg leading-relaxed">
                    Thank you for your interest in joining WombCare. Our team will review your profile and get back to you soon.
                  </p>
                  <button onClick={() => setIsModalOpen(false)} className="mt-10 px-8 py-3 bg-slate-900 text-white rounded-full font-bold">Close</button>
                </div>
              ) : (
                <div className="flex flex-col md:flex-row h-full max-h-[85vh]">
                  {/* Left Role Info */}
                  <div className="md:w-[40%] bg-slate-50 p-10 border-r border-slate-100 overflow-y-auto">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-pink-50 text-pink-600 rounded-full text-xs font-bold mb-6">
                      <Briefcase className="w-3 h-3" /> Hiring Now
                    </div>
                    <h3 className="text-2xl font-extrabold text-slate-900 mb-2">{selectedRole?.title}</h3>
                    <div className="space-y-4 mb-8">
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                            <MapPin className="w-4 h-4" /> {selectedRole?.location}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                            <Users className="h-4 w-4" /> {selectedRole?.department}
                        </div>
                    </div>
                    
                    <div className="space-y-6 overflow-y-auto">
                        <div>
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">About the Role</h4>
                            <p className="text-sm text-slate-600 leading-relaxed">{selectedRole?.description}</p>
                        </div>
                        <div>
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Requirements</h4>
                            <ul className="space-y-2">
                                {selectedRole?.requirements.map((req, i) => (
                                    <li key={i} className="text-sm text-slate-600 flex gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-pink-400 mt-1.5 flex-shrink-0" />
                                        {req}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                  </div>

                  {/* Right Form */}
                  <div className="md:w-[60%] p-10 overflow-y-auto">
                    <div className="mb-8">
                        <h3 className="text-2xl font-bold text-slate-800 mb-2">Apply Now</h3>
                        <p className="text-sm text-slate-500">Fast-track your application today.</p>
                    </div>

                    <form onSubmit={handleApply} className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 ml-1">Full Name</label>
                        <div className="relative">
                            <User className="absolute left-4 top-3.5 w-5 h-5 text-slate-300" />
                            <input required name="name" className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-pink-500/20 outline-none text-sm transition-all" placeholder="Jane Doe" />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 ml-1">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-3.5 w-5 h-5 text-slate-300" />
                            <input required name="email" type="email" className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-pink-500/20 outline-none text-sm transition-all" placeholder="jane@example.com" />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 ml-1">Phone Number</label>
                        <div className="relative">
                            <Phone className="absolute left-4 top-3.5 w-5 h-5 text-slate-300" />
                            <input required name="phone" className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-pink-500/20 outline-none text-sm transition-all" placeholder="+1 234 567 890" />
                        </div>
                      </div>
                      <div className="pt-4">
                        <button 
                          type="submit" 
                          disabled={isSubmitting}
                          className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                        >
                          {isSubmitting ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          ) : (
                            <>Submit Application <ArrowRight className="w-4 h-4" /></>
                          )}
                        </button>
                        <p className="text-[10px] text-slate-400 text-center mt-4">By applying, you agree to our recruitment privacy policy.</p>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="bg-white py-20 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-slate-400 text-sm font-medium">Join us in making hormone health accessible to everyone.</p>
          <div className="mt-8 flex justify-center gap-8">
            <a href="#" className="text-slate-400 hover:text-slate-800">Twitter</a>
            <a href="#" className="text-slate-400 hover:text-slate-800">LinkedIn</a>
            <a href="#" className="text-slate-400 hover:text-slate-800">Instagram</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
