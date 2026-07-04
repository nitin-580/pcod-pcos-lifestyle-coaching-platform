'use client';

import React, { useState } from 'react';
import { format } from 'date-fns';
import { 
  Mail, Phone, User, Calendar, Weight, UserCircle, Eye, X, 
  MapPin, Clipboard, Activity, Clock, Heart, Award, Sparkles, Flame, Moon, Droplets
} from 'lucide-react';

export interface HealthAssessmentRow {
  id: string;
  name: string;
  age: number;
  city: string;
  height: number;
  weight: number;
  occupation: string;
  work_schedule: string;
  pcos: string;
  cycle_pattern: string[];
  medications: string;
  thyroid: string;
  diabetes: string;
  htn: string;
  fatty_liver: string;
  vitamins: string[];
  other_conditions: string;
  diet: string;
  allergies: string;
  food_prefs: string;
  wake_time: string;
  bed_time: string;
  sleep_hours: number;
  water_intake: number;
  activity_level: string;
  daily_steps: number;
  exercise_routine: string;
  stress_level: number;
  goals: string[];
  created_at: string;
}

interface HealthAssessmentTableProps {
  data: HealthAssessmentRow[];
}

export default function HealthAssessmentTable({ data }: HealthAssessmentTableProps) {
  const [selectedItem, setSelectedItem] = useState<HealthAssessmentRow | null>(null);

  const formatList = (arr: any) => {
    if (!arr) return '—';
    if (Array.isArray(arr)) return arr.length > 0 ? arr.join(', ') : '—';
    return arr;
  };

  return (
    <div className="overflow-x-auto bg-white rounded-3xl shadow-sm border border-slate-100">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-100">
            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Patient Name</th>
            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Demographics</th>
            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Cycle & PCOS</th>
            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Lifestyle Summary</th>
            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Goals</th>
            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Submitted</th>
            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {data.map((row) => (
            <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
              <td className="px-6 py-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-pink-50 flex items-center justify-center text-pink-600 font-bold shrink-0">
                    {row.name ? row.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div>
                    <div className="font-bold text-slate-850">{row.name}</div>
                    <div className="text-xs text-slate-400 capitalize">{row.occupation || '—'}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-5">
                <div className="text-sm text-slate-650 font-medium">
                  <div>{row.age} yrs · {row.city || '—'}</div>
                  <div className="text-xs text-slate-450">{row.height}cm · {row.weight}kg</div>
                </div>
              </td>
              <td className="px-6 py-5">
                <div className="text-sm">
                  <span className={`inline-flex px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase ${row.pcos === 'Yes' ? 'bg-rose-50 text-rose-700 border border-rose-100' : 'bg-green-50 text-green-700 border border-green-100'}`}>
                    PCOS: {row.pcos}
                  </span>
                  <div className="text-xs text-slate-500 mt-1.5 max-w-[155px] truncate font-medium" title={formatList(row.cycle_pattern)}>
                    {formatList(row.cycle_pattern)}
                  </div>
                </div>
              </td>
              <td className="px-6 py-5">
                <div className="text-xs text-slate-500 space-y-0.5 font-medium">
                  <div>Diet: <span className="text-slate-700 font-semibold">{row.diet || '—'}</span></div>
                  <div>Sleep: <span className="text-slate-700 font-semibold">{row.sleep_hours || '—'}h</span></div>
                  <div>Stress: <span className="text-slate-700 font-semibold">{row.stress_level}/10</span></div>
                </div>
              </td>
              <td className="px-6 py-5">
                <div className="text-xs text-slate-500 max-w-[150px] truncate font-medium" title={formatList(row.goals)}>
                  {formatList(row.goals)}
                </div>
              </td>
              <td className="px-6 py-5">
                <div className="text-sm text-slate-600 font-medium">
                  {format(new Date(row.created_at), 'MMM d, yyyy')}
                  <div className="text-[10px] opacity-40">{format(new Date(row.created_at), 'h:mm a')}</div>
                </div>
              </td>
              <td className="px-6 py-5 text-right">
                <button
                  onClick={() => setSelectedItem(row)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-pink-600 bg-pink-50 rounded-xl hover:bg-pink-100 transition"
                >
                  <Eye className="w-3.5 h-3.5" />
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {data.length === 0 && (
        <div className="py-20 text-center text-slate-400">
          <p className="text-lg">No health assessments submitted yet.</p>
        </div>
      )}

      {/* Details Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FBF6EF] rounded-[2.5rem] w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col border border-slate-100">
            <div className="flex items-center justify-between p-6 bg-white border-b border-slate-100 sticky top-0 z-10">
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-5 h-5 text-pink-500" />
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Health Assessment Details</h3>
                  <p className="text-[10px] font-semibold text-slate-450 uppercase tracking-widest mt-0.5">Submitted: {format(new Date(selectedItem.created_at), 'PPP p')}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-50 transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-8 space-y-8">
              {/* Profile Demographic Info */}
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                <h4 className="font-black text-slate-800 text-xs uppercase tracking-widest flex items-center gap-2">
                  <User className="w-4 h-4 text-pink-500" /> Patient Demographics
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-4 text-sm">
                  <div><span className="text-slate-450 block text-[10px] uppercase font-bold">Full Name</span> <strong className="text-slate-800">{selectedItem.name}</strong></div>
                  <div><span className="text-slate-450 block text-[10px] uppercase font-bold">Age</span> <strong className="text-slate-800">{selectedItem.age} years</strong></div>
                  <div><span className="text-slate-450 block text-[10px] uppercase font-bold">Location</span> <strong className="text-slate-800">{selectedItem.city || '—'}</strong></div>
                  <div><span className="text-slate-450 block text-[10px] uppercase font-bold">Height</span> <strong className="text-slate-800">{selectedItem.height} cm</strong></div>
                  <div><span className="text-slate-450 block text-[10px] uppercase font-bold">Weight</span> <strong className="text-slate-800">{selectedItem.weight} kg</strong></div>
                  <div><span className="text-slate-450 block text-[10px] uppercase font-bold">BMI</span> <strong className="text-slate-800">{(selectedItem.weight / ((selectedItem.height/100)**2)).toFixed(1)}</strong></div>
                  <div><span className="text-slate-450 block text-[10px] uppercase font-bold">Occupation</span> <strong className="text-slate-800">{selectedItem.occupation || '—'}</strong></div>
                  <div className="col-span-2"><span className="text-slate-450 block text-[10px] uppercase font-bold">Work Schedule</span> <strong className="text-slate-800">{selectedItem.work_schedule || '—'}</strong></div>
                </div>
              </div>

              {/* Medical Diagnostic Info */}
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                <h4 className="font-black text-slate-800 text-xs uppercase tracking-widest flex items-center gap-2">
                  <Activity className="w-4 h-4 text-purple-500" /> Medical & Diagnostic Profiles
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-4 text-sm">
                  <div>
                    <span className="text-slate-450 block text-[10px] uppercase font-bold">PCOS / PCOD Diagnosis</span> 
                    <span className={`inline-flex px-2 py-0.5 rounded text-xs font-black uppercase mt-1 ${selectedItem.pcos === 'Yes' ? 'bg-rose-50 text-rose-700' : 'bg-green-50 text-green-700'}`}>
                      {selectedItem.pcos}
                    </span>
                  </div>
                  <div><span className="text-slate-450 block text-[10px] uppercase font-bold">Thyroid Status</span> <strong className="text-slate-800">{selectedItem.thyroid || 'None'}</strong></div>
                  <div><span className="text-slate-450 block text-[10px] uppercase font-bold">Diabetes</span> <strong className="text-slate-800">{selectedItem.diabetes || 'No'}</strong></div>
                  <div><span className="text-slate-450 block text-[10px] uppercase font-bold">Hypertension</span> <strong className="text-slate-800">{selectedItem.htn || 'No'}</strong></div>
                  <div><span className="text-slate-450 block text-[10px] uppercase font-bold">Fatty Liver</span> <strong className="text-slate-800">{selectedItem.fatty_liver || 'No'}</strong></div>
                  <div><span className="text-slate-450 block text-[10px] uppercase font-bold">Deficiencies</span> <strong className="text-slate-800">{formatList(selectedItem.vitamins)}</strong></div>
                  <div className="col-span-2 sm:col-span-3"><span className="text-slate-450 block text-[10px] uppercase font-bold">Menstrual Cycle Patterns</span> <strong className="text-slate-800">{formatList(selectedItem.cycle_pattern)}</strong></div>
                  <div className="col-span-2 sm:col-span-3"><span className="text-slate-450 block text-[10px] uppercase font-bold">Current Medications & Dosages</span> <p className="text-slate-800 mt-1 whitespace-pre-line bg-slate-50 p-3 rounded-xl border border-slate-100">{selectedItem.medications || 'None'}</p></div>
                  <div className="col-span-2 sm:col-span-3"><span className="text-slate-450 block text-[10px] uppercase font-bold">Other Conditions</span> <p className="text-slate-800 mt-1 whitespace-pre-line bg-slate-50 p-3 rounded-xl border border-slate-100">{selectedItem.other_conditions || 'None'}</p></div>
                </div>
              </div>

              {/* Lifestyle Habits Info */}
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                <h4 className="font-black text-slate-800 text-xs uppercase tracking-widest flex items-center gap-2">
                  <Flame className="w-4 h-4 text-amber-500" /> Lifestyle & Daily Rhythm
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-4 text-sm">
                  <div><span className="text-slate-450 block text-[10px] uppercase font-bold">Diet Preferences</span> <strong className="text-slate-800">{selectedItem.diet || '—'}</strong></div>
                  <div><span className="text-slate-450 block text-[10px] uppercase font-bold">Stress Index</span> <strong className="text-slate-800">{selectedItem.stress_level} / 10</strong></div>
                  <div><span className="text-slate-450 block text-[10px] uppercase font-bold">Daily Activity</span> <strong className="text-slate-800">{selectedItem.activity_level || '—'}</strong></div>
                  <div><span className="text-slate-450 block text-[10px] uppercase font-bold">Sleep rhythm</span> <strong className="text-slate-800">{selectedItem.wake_time || '—'} to {selectedItem.bed_time || '—'}</strong></div>
                  <div><span className="text-slate-450 block text-[10px] uppercase font-bold">Sleep duration</span> <strong className="text-slate-800">{selectedItem.sleep_hours || '—'} hours</strong></div>
                  <div><span className="text-slate-450 block text-[10px] uppercase font-bold">Water intake</span> <strong className="text-slate-800">{selectedItem.water_intake || '—'} Litres</strong></div>
                  <div><span className="text-slate-450 block text-[10px] uppercase font-bold">Steps index</span> <strong className="text-slate-800">{selectedItem.daily_steps || '—'} steps</strong></div>
                  <div className="col-span-2"><span className="text-slate-450 block text-[10px] uppercase font-bold">Food Allergies</span> <p className="text-slate-800 mt-1">{selectedItem.allergies || 'None'}</p></div>
                  <div className="col-span-2 sm:col-span-3"><span className="text-slate-450 block text-[10px] uppercase font-bold">Specific Food Restrictions</span> <p className="text-slate-800 mt-1">{selectedItem.food_prefs || 'None'}</p></div>
                  <div className="col-span-2 sm:col-span-3"><span className="text-slate-450 block text-[10px] uppercase font-bold">Exercise & Gym Routine</span> <p className="text-slate-800 mt-1 whitespace-pre-line bg-slate-50 p-3 rounded-xl border border-slate-100">{selectedItem.exercise_routine || 'None'}</p></div>
                </div>
              </div>

              {/* Goals */}
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                <h4 className="font-black text-slate-800 text-xs uppercase tracking-widest flex items-center gap-2">
                  <Award className="w-4 h-4 text-emerald-500" /> Focus Health & Recovery Goals
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedItem.goals && selectedItem.goals.map((g) => (
                    <span key={g} className="px-3.5 py-1.5 bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs font-bold rounded-xl">
                      {g}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
