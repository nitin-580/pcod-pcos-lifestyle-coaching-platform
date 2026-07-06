'use client';

import React, { useState, useEffect } from 'react';
import { getPublicApiBase } from '@/lib/api-config';
import { Sparkles, Check, Smile, Heart, RefreshCw } from 'lucide-react';

interface Props {
  userId: string;
  onComplete: () => void;
}

const SYMPTOM_OPTIONS = [
  'Irregular periods',
  'Acne / Pimples',
  'Excessive hair growth (Hirsutism)',
  'Weight gain',
  'Hair thinning / Loss',
  'Fatigue / Low energy',
  'Severe cramps',
  'Mood swings',
  'Bloating',
  'Headache'
];

const GOAL_OPTIONS = [
  'Regularize menstrual cycle',
  'Weight management / Loss',
  'Clear skin / Reduce acne',
  'Improve sleep & energy levels',
  'Reduce stress & anxiety',
  'Conceive naturally',
  'Manage insulin resistance'
];

export default function Form({ userId, onComplete }: Props) {
  const [formData, setFormData] = useState({
    age: '',
    weight: '',
    height: '',
    cycleLength: '28',
    targetWater: '2.5', // Default 2.5 Liters
    activePlan: 'Premium 90-Day Hormonal Wellness', // Default Premium Active Plan
    symptoms: [] as string[],
    personalNotes: '',
    wellnessGoals: [] as string[],
  });

  const [userData, setUserData] = useState<{ name: string; email: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const savedData = localStorage.getItem('userData');
    if (savedData) {
      try {
        setUserData(JSON.parse(savedData));
      } catch (e) {
        console.error('Failed to parse userData');
      }
    }
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const toggleSymptom = (sym: string) => {
    setFormData(prev => {
      const exists = prev.symptoms.includes(sym);
      const symptoms = exists 
        ? prev.symptoms.filter(s => s !== sym)
        : [...prev.symptoms, sym];
      return { ...prev, symptoms };
    });
  };

  const toggleGoal = (goal: string) => {
    setFormData(prev => {
      const exists = prev.wellnessGoals.includes(goal);
      const wellnessGoals = exists 
        ? prev.wellnessGoals.filter(g => g !== goal)
        : [...prev.wellnessGoals, goal];
      return { ...prev, wellnessGoals };
    });
  };

  const calculateBMI = () => {
    const h = Number(formData.height) / 100;
    const w = Number(formData.weight);

    if (!h || !w) return 0;

    return +(w / (h * h)).toFixed(1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Ensure all fields are filled
    if (!formData.age || !formData.weight || !formData.height || !formData.cycleLength || !formData.targetWater) {
      setError('Please fill in age, weight, height, cycle length, and water target.');
      setIsLoading(false);
      return;
    }

    if (formData.symptoms.length === 0) {
      setError('Please select at least one common symptom.');
      setIsLoading(false);
      return;
    }

    if (formData.wellnessGoals.length === 0) {
      setError('Please select at least one wellness goal.');
      setIsLoading(false);
      return;
    }

    if (Number(formData.age) < 13) {
      setError('You must be at least 13 years old.');
      setIsLoading(false);
      return;
    }

    if (!userData) {
      setError('User session missing. Please log in again.');
      setIsLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('userToken');

      const profilePayload = {
        id: userId,
        name: userData.name,
        email: userData.email,
        age: Number(formData.age),
        weight: Number(formData.weight),
        height: Number(formData.height),
        cycleLength: Number(formData.cycleLength),
        targetWater: Math.round(Number(formData.targetWater) / 0.25), // convert Liters to glasses (integer)
        activePlan: formData.activePlan,
        symptoms: formData.symptoms,
        personalNotes: formData.personalNotes,
        wellnessGoal: formData.wellnessGoals.join(', '),
        bmi: calculateBMI(),
        wellnessScore: 82,
        profileCompleted: true,
      };

      console.log('Submitting onboarding payload:', profilePayload);

      const res = await fetch(
        `${getPublicApiBase()}/profiles`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(profilePayload),
        }
      );

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || 'Failed to save profile');
        return;
      }

      onComplete(); // Redirect to dashboard
    } catch (err) {
      setError('Connection failed. Please check if backend is running.');
      console.error('Profile save error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 font-bold text-sm">
          {error}
        </div>
      )}

      {/* Basic Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Age *</label>
          <input
            name="age"
            type="number"
            placeholder="e.g. 24"
            value={formData.age}
            onChange={handleChange}
            required
            className="w-full border-b border-pink-100 py-3 bg-transparent text-slate-800 font-semibold focus:outline-none focus:border-pink-500 transition-colors text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Cycle Length * (Days)</label>
          <input
            name="cycleLength"
            type="number"
            placeholder="e.g. 28"
            value={formData.cycleLength}
            onChange={handleChange}
            required
            className="w-full border-b border-pink-100 py-3 bg-transparent text-slate-800 font-semibold focus:outline-none focus:border-pink-500 transition-colors text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Height * (cm)</label>
          <input
            name="height"
            type="number"
            placeholder="e.g. 165"
            value={formData.height}
            onChange={handleChange}
            required
            className="w-full border-b border-pink-100 py-3 bg-transparent text-slate-800 font-semibold focus:outline-none focus:border-pink-500 transition-colors text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Weight * (kg)</label>
          <input
            name="weight"
            type="number"
            placeholder="e.g. 62"
            value={formData.weight}
            onChange={handleChange}
            required
            className="w-full border-b border-pink-100 py-3 bg-transparent text-slate-800 font-semibold focus:outline-none focus:border-pink-500 transition-colors text-sm"
          />
        </div>
      </div>

      {/* Target Water - in Liters */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Daily Water Target * (Liters)</label>
        <input
          name="targetWater"
          type="number"
          step="0.1"
          placeholder="e.g. 2.5"
          value={formData.targetWater}
          onChange={handleChange}
          required
          className="w-full border-b border-pink-100 py-3 bg-transparent text-slate-800 font-semibold focus:outline-none focus:border-pink-500 transition-colors text-sm"
        />
      </div>

      {/* Symptoms Checkboxes */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Common Symptoms * (Select all that apply)</label>
        <div className="flex flex-wrap gap-2.5">
          {SYMPTOM_OPTIONS.map((sym) => {
            const isSelected = formData.symptoms.includes(sym);
            return (
              <button
                key={sym}
                type="button"
                onClick={() => toggleSymptom(sym)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold border transition flex items-center gap-1.5 ${
                  isSelected 
                    ? 'bg-pink-500 border-pink-500 text-white shadow-md shadow-pink-100'
                    : 'bg-white border-slate-100 text-slate-650 hover:bg-slate-50'
                }`}
              >
                {isSelected && <Check className="w-3.5 h-3.5" />}
                {sym}
              </button>
            );
          })}
        </div>
      </div>

      {/* Goals Checkboxes */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Wellness Recovery Goals * (Select all that apply)</label>
        <div className="flex flex-wrap gap-2.5">
          {GOAL_OPTIONS.map((goal) => {
            const isSelected = formData.wellnessGoals.includes(goal);
            return (
              <button
                key={goal}
                type="button"
                onClick={() => toggleGoal(goal)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold border transition flex items-center gap-1.5 ${
                  isSelected 
                    ? 'bg-purple-650 border-purple-650 bg-gradient-to-r from-purple-600 to-indigo-650 text-white shadow-md shadow-purple-100'
                    : 'bg-white border-slate-100 text-slate-650 hover:bg-slate-50'
                }`}
              >
                {isSelected && <Check className="w-3.5 h-3.5" />}
                {goal}
              </button>
            );
          })}
        </div>
      </div>

      {/* Personal Notes */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Additional Health Notes (Optional)</label>
        <textarea
          name="personalNotes"
          rows={2}
          placeholder="Anything else you'd like to share with your care team..."
          value={formData.personalNotes}
          onChange={handleChange}
          className="w-full border-b border-pink-100 py-3 bg-transparent text-slate-800 font-medium focus:outline-none focus:border-pink-500 transition-colors text-sm resize-none"
        />
      </div>

      {/* Plan Selection */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Active Plan *</label>
        <select
          name="activePlan"
          value={formData.activePlan}
          onChange={handleChange}
          required
          className="w-full border-b border-pink-100 py-3 bg-transparent text-slate-800 font-semibold focus:outline-none focus:border-pink-500 transition-colors text-sm"
        >
          <option value="Premium 90-Day Hormonal Wellness">Premium 90-Day Hormonal Wellness (Default)</option>
          <option value="Starter Plan">Starter Plan</option>
          <option value="Doctor Consultation">Doctor Consultation</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full mt-6 py-4 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-base shadow-xl shadow-pink-100 hover:opacity-95 transition-all active:scale-[0.98] disabled:opacity-50"
      >
        {isLoading ? 'Saving your health profile...' : 'Complete & Open Dashboard'}
      </button>
    </form>
  );
}