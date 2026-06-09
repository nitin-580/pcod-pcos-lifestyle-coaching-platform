'use client';

import React, { useState } from 'react';
import { format } from 'date-fns';
import { Mail, Phone, User, Calendar, MapPin, Activity, Clock, FileText, UserCircle, Search, Sparkles } from 'lucide-react';
import { Enrollment } from './EnrollmentTable';

interface PatientTableProps {
  data: any[];
}

export default function PatientTable({ data }: PatientTableProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPatients = data.filter(patient => {
    const searchLower = searchTerm.toLowerCase();
    const name = (patient.fullName || patient.name || '').toLowerCase();
    const phone = (patient.phone || '').toLowerCase();
    const city = (patient.city || patient.country || '').toLowerCase();
    const plan = (patient.plan || 'Referred Patient').toLowerCase();
    return (
      name.includes(searchLower) ||
      phone.includes(searchLower) ||
      city.includes(searchLower) ||
      plan.includes(searchLower)
    );
  });

  return (
    <div className="space-y-6">
      {/* Controls & Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-pink-500" />
            Enrolled Program Patients
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Active care members currently undergoing PMOS recovery and coaching programs.
          </p>
        </div>
        
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search patients, plan, phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none transition-all text-sm text-slate-800"
          />
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
        </div>
      </div>

      {/* Patients Grid / Table */}
      {filteredPatients.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-3xl border border-slate-100 shadow-sm text-slate-400">
          <p className="text-lg">No active patients found matching criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {filteredPatients.map((patient) => {
             const patientName = patient.fullName || patient.name || 'Anonymous';
             const patientPlan = patient.plan || 'Referred Patient';
             const patientCity = patient.city || patient.country || '';
             const patientDuration = patient.duration || patient.cycleRegularity || '';
             const patientCreatedAt = patient.createdAt || patient.created_at || new Date().toISOString();
             
             return (
               <div 
                 key={patient.id} 
                 className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all p-6 relative overflow-hidden flex flex-col justify-between"
               >
                 {/* Plan decorative bar */}
                 <div 
                   className={`absolute top-0 inset-x-0 h-1.5 ${
                     patientPlan.toLowerCase().includes('premium') 
                       ? 'bg-gradient-to-r from-purple-500 to-pink-500' 
                       : patientPlan.toLowerCase().includes('starter')
                       ? 'bg-pink-500'
                       : 'bg-indigo-500'
                   }`}
                 />

                 <div>
                   {/* Header Profile */}
                   <div className="flex justify-between items-start gap-4 mb-4">
                     <div className="flex items-center gap-3">
                       <div className="w-12 h-12 rounded-2xl bg-pink-50 flex items-center justify-center text-pink-600 font-bold shrink-0">
                         {patientName.charAt(0).toUpperCase()}
                       </div>
                       <div>
                         <h3 className="font-bold text-slate-900 line-clamp-1">{patientName}</h3>
                         <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 mt-1">
                           Age {patient.age}
                         </span>
                       </div>
                     </div>

                     <span className={`inline-flex px-3 py-1 rounded-xl text-[10px] font-bold uppercase tracking-wider ${
                       patientPlan.toLowerCase().includes('premium')
                         ? 'bg-purple-50 text-purple-700 border border-purple-100'
                         : patientPlan.toLowerCase().includes('starter')
                         ? 'bg-pink-50 text-pink-700 border border-pink-100'
                         : 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                     }`}>
                       {patientPlan}
                     </span>
                   </div>

                   <hr className="border-slate-100 my-4" />

                   {/* Patient Contact Cards */}
                   <div className="space-y-2 text-sm text-slate-600 mb-4">
                     <div className="flex items-center gap-2">
                       <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                       <span className="font-medium">{patient.phone}</span>
                     </div>
                     {patientCity && (
                       <div className="flex items-center gap-2">
                         <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                         <span>{patientCity}</span>
                       </div>
                     )}
                   </div>

                   {/* Medical & Symptoms Card Details */}
                   <div className="bg-slate-50 rounded-2xl p-4 space-y-3 mb-4">
                     <div>
                       <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
                         Reported Symptoms
                       </span>
                       <p className="text-xs text-slate-700 leading-relaxed line-clamp-2">
                         {patient.symptoms || 'No primary symptoms reported.'}
                       </p>
                     </div>

                     {patientDuration && (
                       <div>
                         <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
                           Symptom Duration / Cycle Regularity
                         </span>
                         <p className="text-xs text-slate-600 italic">
                           {patientDuration}
                         </p>
                       </div>
                     )}

                     {patient.consultationTime && (
                       <div className="flex items-center gap-2 text-xs text-slate-500">
                         <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                         <span>Prefers: <span className="font-semibold text-slate-700">{patient.consultationTime}</span></span>
                       </div>
                     )}
                   </div>
                 </div>

                 {/* Bottom Card Footer */}
                 <div>
                   {patient.notes && (
                     <div className="border-t border-slate-100 pt-3 flex gap-2 text-xs text-slate-400 italic mb-3">
                       <FileText className="w-4 h-4 text-slate-300 shrink-0" />
                       <span className="line-clamp-2">{patient.notes}</span>
                     </div>
                   )}
                   
                   <div className="flex justify-between items-center text-[10px] text-slate-400 mt-2 font-mono">
                     <span>ID: #{patient.id.slice(0, 8)}</span>
                     <span>Enrolled: {format(new Date(patientCreatedAt), 'MMM dd, yyyy')}</span>
                   </div>
                 </div>
               </div>
             );
           })}
        </div>
      )}
    </div>
  );
}
