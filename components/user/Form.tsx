'use client';

import { useState, useEffect } from 'react';
import { getPublicApiBase } from '@/lib/api-config';

interface Props {
  userId: string;
  onComplete: () => void;
}

export default function Form({ userId, onComplete }: Props) {
  const [formData, setFormData] = useState({
    age: '',
    weight: '',
    height: '',
    cycleLength: '28',
    targetWater: '8',
    activePlan: '',
    symptoms: '',
    personalNotes: '',
    wellnessGoal: '',
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
    const requiredFields = ['age', 'weight', 'height', 'cycleLength', 'targetWater', 'activePlan', 'symptoms', 'wellnessGoal'];
    const missing = requiredFields.filter(f => !formData[f as keyof typeof formData]);
    
    if (missing.length > 0) {
      setError(`Please fill in all details: ${missing.join(', ')}`);
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
        targetWater: Number(formData.targetWater),
        activePlan: formData.activePlan,
        symptoms: formData.symptoms
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        personalNotes: formData.personalNotes,
        wellnessGoal: formData.wellnessGoal,
        bmi: calculateBMI(),
        wellnessScore: 82,
        profileCompleted: true, // Mark as completed in DB
      };

      console.log('Submitting payload:', profilePayload);

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

      onComplete(); // redirect to dashboard
    } catch (err) {
      setError('Connection failed. Please check if backend is running.');
      console.error('Profile save error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-7">
      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-100 text-red-600 font-medium">
          {error}
        </div>
      )}

      {/* Age + Cycle */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Age *</label>
          <input
            name="age"
            placeholder="e.g. 24"
            value={formData.age}
            onChange={handleChange}
            required
            className="w-full border-b border-pink-200 py-3 bg-transparent focus:outline-none focus:border-pink-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Cycle Length * (Days)</label>
          <input
            name="cycleLength"
            placeholder="e.g. 28"
            value={formData.cycleLength}
            onChange={handleChange}
            required
            className="w-full border-b border-pink-200 py-3 bg-transparent focus:outline-none focus:border-pink-500 transition-colors"
          />
        </div>
      </div>

      {/* Height + Weight */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Height * (cm)</label>
          <input
            name="height"
            placeholder="e.g. 165"
            value={formData.height}
            onChange={handleChange}
            required
            className="w-full border-b border-pink-200 py-3 bg-transparent focus:outline-none focus:border-pink-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Weight * (kg)</label>
          <input
            name="weight"
            placeholder="e.g. 62"
            value={formData.weight}
            onChange={handleChange}
            required
            className="w-full border-b border-pink-200 py-3 bg-transparent focus:outline-none focus:border-pink-500 transition-colors"
          />
        </div>
      </div>

      {/* Water */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Daily Water Target * (Glasses)</label>
        <input
          name="targetWater"
          placeholder="e.g. 8"
          value={formData.targetWater}
          onChange={handleChange}
          required
          className="w-full border-b border-pink-200 py-3 bg-transparent focus:outline-none focus:border-pink-500 transition-colors"
        />
      </div>

      {/* Symptoms */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Common Symptoms *</label>
        <textarea
          name="symptoms"
          rows={2}
          placeholder="e.g. Acne, bloating, fatigue (comma separated)"
          value={formData.symptoms}
          onChange={handleChange}
          required
          className="w-full border-b border-pink-200 py-3 bg-transparent focus:outline-none focus:border-pink-500 transition-colors resize-none"
        />
      </div>

      {/* Wellness Goal */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Wellness Goal *</label>
        <textarea
          name="wellnessGoal"
          rows={2}
          placeholder="e.g. Regularize periods, manage weight"
          value={formData.wellnessGoal}
          onChange={handleChange}
          required
          className="w-full border-b border-pink-200 py-3 bg-transparent focus:outline-none focus:border-pink-500 transition-colors resize-none"
        />
      </div>

      {/* Personal Notes */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Additional Health Notes (Optional)</label>
        <textarea
          name="personalNotes"
          rows={2}
          placeholder="Anything else you'd like to share..."
          value={formData.personalNotes}
          onChange={handleChange}
          className="w-full border-b border-pink-200 py-3 bg-transparent focus:outline-none focus:border-pink-500 transition-colors resize-none"
        />
      </div>

      {/* Plan */}
      <div className="pt-2">
        <label className="block text-sm font-medium text-slate-700 mb-2">Active Plan *</label>
        <select
          name="activePlan"
          value={formData.activePlan}
          onChange={handleChange}
          required
          className="w-full border-b border-pink-200 py-3 bg-transparent focus:outline-none focus:border-pink-500 transition-colors"
        >
          <option value="">Select active plan</option>
          <option value="Starter Plan">Starter Plan</option>
          <option value="Premium 90-Day Hormonal Wellness">Premium 90-Day Hormonal Wellness</option>
          <option value="Doctor Consultation">Doctor Consultation</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full mt-6 py-4 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold text-lg shadow-xl shadow-pink-100 hover:opacity-95 transition-all active:scale-[0.98] disabled:opacity-50"
      >
        {isLoading ? 'Saving...' : 'Complete Profile'}
      </button>
    </form>
  );
}