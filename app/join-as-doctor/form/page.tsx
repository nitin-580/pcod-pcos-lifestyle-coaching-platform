'use client';

import { useState } from 'react';

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

    const res = await fetch('/api/join-doctor', {
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

    setLoading(false);

    if (data.success) {
      setSubmitted(true);
    } else {
      alert(data.message || 'Something went wrong');
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-lg text-center bg-white shadow-xl rounded-2xl p-8">
          <h1 className="text-3xl font-bold mb-4">Application Submitted</h1>
          <p className="text-gray-600">
            Thank you for joining WombCare as a doctor. A confirmation email
            has been sent to your registered email address.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-8">Join WombCare as Doctor</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input name="full_name" placeholder="Full Name" required onChange={handleChange} className="w-full border p-3 rounded-xl" />
          <input name="email" type="email" placeholder="Email" required onChange={handleChange} className="w-full border p-3 rounded-xl" />
          <input name="phone" placeholder="Phone Number" required onChange={handleChange} className="w-full border p-3 rounded-xl" />
          <input name="specialization" placeholder="Specialization" required onChange={handleChange} className="w-full border p-3 rounded-xl" />
          <input name="qualification" placeholder="Qualification" required onChange={handleChange} className="w-full border p-3 rounded-xl" />
          <input name="experience_years" type="number" placeholder="Years of Experience" required onChange={handleChange} className="w-full border p-3 rounded-xl" />
          <input name="hospital_clinic" placeholder="Hospital / Clinic Name" onChange={handleChange} className="w-full border p-3 rounded-xl" />
          <input name="city" placeholder="City" required onChange={handleChange} className="w-full border p-3 rounded-xl" />
          <input name="medical_registration_number" placeholder="Medical Registration Number" required onChange={handleChange} className="w-full border p-3 rounded-xl" />

          <select name="consultation_mode" onChange={handleChange} className="w-full border p-3 rounded-xl">
            <option>Online + Offline</option>
            <option>Online Only</option>
            <option>Offline Only</option>
          </select>

          <label className="flex items-center gap-3">
            <input type="checkbox" name="agreed_to_terms" onChange={handleChange} />
            <span>I agree to join WombCare and accept all onboarding terms.</span>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-pink-600 text-white py-3 rounded-xl font-semibold"
          >
            {loading ? 'Submitting...' : 'Agree & Join'}
          </button>
        </form>
      </div>
    </div>
  );
}