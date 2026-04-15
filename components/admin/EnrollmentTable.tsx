'use client';

import React from 'react';
import { format } from 'date-fns';
import { Mail, Phone, User, Calendar, MapPin, Activity, Clock, FileText, UserCircle } from 'lucide-react';

export interface Enrollment {
  id: string;
  fullName: string;
  age: number;
  phone: string;
  city: string;
  symptoms?: string;
  duration?: string;
  plan: string;
  consultationTime?: string;
  notes?: string;
  createdAt: string;
}

interface EnrollmentTableProps {
  data: Enrollment[];
}

export default function EnrollmentTable({ data }: EnrollmentTableProps) {
  return (
    <div className="overflow-x-auto bg-white rounded-2xl shadow-sm border border-slate-100">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-100">
            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Applicant</th>
            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Contact & Location</th>
            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Plan & Time</th>
            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Health Details</th>
            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Submitted</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {data.map((row) => (
            <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
              <td className="px-6 py-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
                    <UserCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-800">{row.fullName}</div>
                    <div className="text-xs text-slate-500">Age: {row.age}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-5">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Phone className="w-3.5 h-3.5 opacity-40" />
                    {row.phone}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <MapPin className="w-3.5 h-3.5 opacity-40" />
                    {row.city}
                  </div>
                </div>
              </td>
              <td className="px-6 py-5">
                <div className="space-y-1">
                  <div className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-pink-100 text-pink-700">
                    {row.plan}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Clock className="w-3.5 h-3.5 opacity-40" />
                    {row.consultationTime || 'Flexible'}
                  </div>
                </div>
              </td>
              <td className="px-6 py-5">
                <div className="text-xs text-slate-500 max-w-[250px] space-y-1">
                  <div className="flex gap-1">
                    <Activity className="w-3 h-3 mt-0.5 shrink-0 opacity-40" />
                    <span className="text-slate-700 line-clamp-1">{row.symptoms || 'None'}</span>
                  </div>
                  {row.duration && (
                    <div className="text-[10px] text-slate-400 pl-4 italic">
                      Duration: {row.duration}
                    </div>
                  )}
                  {row.notes && (
                    <div className="flex gap-1 text-[10px] text-slate-400 line-clamp-1">
                      <FileText className="w-3 h-3 shrink-0 opacity-40" />
                      {row.notes}
                    </div>
                  )}
                </div>
              </td>
              <td className="px-6 py-5">
                <div className="text-sm text-slate-600">
                  {format(new Date(row.createdAt), 'MMM d, yyyy')}
                  <div className="text-[10px] opacity-40">{format(new Date(row.createdAt), 'h:mm a')}</div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {data.length === 0 && (
        <div className="py-20 text-center text-slate-400">
          <p className="text-lg">No program enrollments found yet.</p>
        </div>
      )}
    </div>
  );
}
