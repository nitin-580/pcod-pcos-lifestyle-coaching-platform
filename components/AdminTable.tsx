import React, { useState } from 'react';
import { format } from 'date-fns';
import { Mail, Phone, User, Calendar, Weight, UserCircle, ArrowUpRight, Loader2, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/lib/supabase-client';

export interface Registration {
  id: string;
  name: string;
  email: string;
  phone: string;
  age: number;
  weight: number;
  cycleRegularity?: string;
  symptoms?: string;
  country?: string;
  source?: string;
  createdAt: string;
}

interface AdminTableProps {
  data: Registration[];
  onPromoteSuccess?: () => void;
}

export default function AdminTable({ data, onPromoteSuccess }: AdminTableProps) {
  const [promotingIds, setPromotingIds] = useState<string[]>([]);
  const [promotedIds, setPromotedIds] = useState<string[]>([]);

  const promoteToPatient = async (row: Registration) => {
    setPromotingIds(prev => [...prev, row.id]);
    try {
      const profile = (row as any).profile;
      const finalAge = Number(profile?.age || row.age) || 0;
      const finalWeight = Number(profile?.weight || row.weight) || 0;
      const finalSymptoms = Array.isArray(profile?.symptoms) 
        ? profile.symptoms.join(', ') 
        : profile?.symptoms || row.symptoms || '';

      const { error } = await supabase
        .from('patients')
        .insert([{
          name: profile?.name || row.name,
          email: row.email,
          phone: row.phone || '',
          age: finalAge,
          weight: finalWeight,
          cycle_regular: row.cycleRegularity || 'Regular',
          symptoms: finalSymptoms,
          country: row.country || 'India',
          referred_by: null
        }]);

      if (error) throw error;
      setPromotedIds(prev => [...prev, row.id]);
      if (onPromoteSuccess) onPromoteSuccess();
    } catch (err: any) {
      alert('Failed to promote user to patient: ' + err.message);
    } finally {
      setPromotingIds(prev => prev.filter(id => id !== row.id));
    }
  };

  return (
    <div className="overflow-x-auto bg-white rounded-2xl shadow-sm border border-slate-100">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-100">
            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">User</th>
            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Contact</th>
            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Stats</th>
            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Details</th>
            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Joined</th>
            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {data.map((row) => (
            <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
              <td className="px-6 py-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center text-pink-600">
                    <UserCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-800">{row.name}</div>
                    <div className="text-xs text-slate-500 lowercase">{row.source || 'Direct'}</div>
                    {(row as any).profile && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        <span className="inline-flex px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 text-[9px] font-bold uppercase tracking-wider">
                          Plan: {(row as any).profile.active_plan || 'None'} ({(row as any).profile.plan_status || 'inactive'})
                        </span>
                        {(row as any).profile.wellness_goal && (
                          <span className="inline-flex px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[9px] font-bold">
                            Goal: {(row as any).profile.wellness_goal}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </td>
              <td className="px-6 py-5">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Mail className="w-3.5 h-3.5 opacity-40" />
                    {row.email}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Phone className="w-3.5 h-3.5 opacity-40" />
                    {row.phone}
                  </div>
                </div>
              </td>
              <td className="px-6 py-5">
                <div className="flex gap-4">
                  <div className="text-sm">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Age</span>
                    <span className="text-slate-700 font-medium">{row.age}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Weight</span>
                    <span className="text-slate-700 font-medium">{row.weight}kg</span>
                  </div>
                </div>
              </td>
              <td className="px-6 py-5">
                <div className="text-xs text-slate-500 max-w-[200px] truncate">
                  <span className="font-medium text-slate-700">{row.cycleRegularity || 'N/A'}</span>
                  <br />
                  {row.symptoms || 'No symptoms noted'}
                </div>
              </td>
              <td className="px-6 py-5">
                <div className="text-sm text-slate-600">
                  {format(new Date(row.createdAt), 'MMM d, yyyy')}
                  <div className="text-[10px] opacity-40">{format(new Date(row.createdAt), 'h:mm a')}</div>
                </div>
              </td>
              <td className="px-6 py-5">
                {promotedIds.includes(row.id) ? (
                  <span className="flex items-center gap-1 text-xs font-semibold text-green-600 bg-green-50 px-3 py-1.5 rounded-xl">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Enrolled
                  </span>
                ) : (
                  <button
                    onClick={() => promoteToPatient(row)}
                    disabled={promotingIds.includes(row.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-pink-600 bg-pink-50 rounded-xl hover:bg-pink-100 transition disabled:opacity-50"
                  >
                    {promotingIds.includes(row.id) ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    )}
                    Promote Patient
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {data.length === 0 && (
        <div className="py-20 text-center text-slate-400">
          <p className="text-lg">No registrations found yet.</p>
        </div>
      )}
    </div>
  );
}
