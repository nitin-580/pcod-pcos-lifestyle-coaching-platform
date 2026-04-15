'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import FloatingNavbar from '../../components/FloatingNavbar';
import Footer from '../../components/Footer';

export default function HormonalCheckPage() {
  const [form, setForm] = useState({
    age: '',
    height: '',
    weight: '',
    cycleLength: '',
    symptoms: [] as string[],
  });

  const symptomOptions = [
    'Irregular periods',
    'Weight gain',
    'Acne',
    'Hair loss',
    'Mood swings',
    'Difficulty conceiving',
  ];

  const bmi = useMemo(() => {
    const h = Number(form.height) / 100;
    const w = Number(form.weight);

    if (!h || !w) return null;

    return (w / (h * h)).toFixed(1);
  }, [form.height, form.weight]);

  const bmiStatus = useMemo(() => {
    if (!bmi) return '--';

    const value = Number(bmi);

    if (value < 18.5) return 'Underweight';
    if (value < 25) return 'Healthy';
    if (value < 30) return 'Overweight';

    return 'Obese';
  }, [bmi]);

  const riskScore = useMemo(() => {
    let score = 0;

    score += form.symptoms.length * 2;

    const cycle = Number(form.cycleLength);
    if (cycle > 35) score += 3;

    const bmiValue = Number(bmi);
    if (bmiValue >= 25) score += 2;

    return Math.min(score, 10);
  }, [form.symptoms, form.cycleLength, bmi]);

  const riskLevel = useMemo(() => {
    if (riskScore <= 3) return 'Low';
    if (riskScore <= 6) return 'Moderate';
    return 'High';
  }, [riskScore]);

  const toggleSymptom = (symptom: string) => {
    setForm((prev) => ({
      ...prev,
      symptoms: prev.symptoms.includes(symptom)
        ? prev.symptoms.filter((s) => s !== symptom)
        : [...prev.symptoms, symptom],
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <>
      <FloatingNavbar />

      <main className="min-h-screen bg-gradient-to-br from-white via-pink-50/20 to-purple-50/30 pt-28">
        {/* Header */}
        <section className="border-b border-pink-100 bg-gradient-to-r from-pink-50/60 to-purple-50/60">
          <div className="max-w-7xl mx-auto px-8 py-12">
            <p className="text-sm font-semibold tracking-wide text-pink-600 uppercase">
              Wellness Assessment
            </p>

            <h1 className="text-5xl font-bold mt-3 text-slate-900">
              Hormonal Health Assessment
            </h1>

            <p className="mt-4 text-lg text-slate-600 max-w-3xl leading-8">
              A clinically structured lifestyle screening tool designed to
              evaluate BMI, cycle health, and early hormonal imbalance indicators.
            </p>
          </div>
        </section>

        {/* Main layout */}
        <section className="max-w-7xl mx-auto px-8 py-14 grid lg:grid-cols-12 gap-14">
          {/* Left form */}
          <div className="lg:col-span-7">
            <div className="space-y-10">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Age
                </label>
                <input
                  name="age"
                  value={form.age}
                  onChange={handleChange}
                  placeholder="Enter age"
                  className="w-full border-b border-pink-200 py-3 bg-transparent focus:outline-none focus:border-pink-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-10">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Height (cm)
                  </label>
                  <input
                    name="height"
                    value={form.height}
                    onChange={handleChange}
                    placeholder="Height"
                    className="w-full border-b border-pink-200 py-3 bg-transparent focus:outline-none focus:border-pink-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Weight (kg)
                  </label>
                  <input
                    name="weight"
                    value={form.weight}
                    onChange={handleChange}
                    placeholder="Weight"
                    className="w-full border-b border-pink-200 py-3 bg-transparent focus:outline-none focus:border-pink-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Menstrual Cycle Length
                </label>
                <input
                  name="cycleLength"
                  value={form.cycleLength}
                  onChange={handleChange}
                  placeholder="Days"
                  className="w-full border-b border-pink-200 py-3 bg-transparent focus:outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-700 mb-5">
                  Symptoms Observed
                </p>

                <div className="grid grid-cols-2 gap-4">
                  {symptomOptions.map((symptom) => (
                    <button
                      key={symptom}
                      type="button"
                      onClick={() => toggleSymptom(symptom)}
                      className={`text-left py-4 border-b transition-all ${
                        form.symptoms.includes(symptom)
                          ? 'border-pink-500 text-pink-600 font-semibold'
                          : 'border-slate-200 text-slate-600'
                      }`}
                    >
                      {symptom}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right analytics */}
          <div className="lg:col-span-5">
            <div className="rounded-3xl bg-white border border-pink-100 shadow-xl shadow-pink-100/30 p-8 space-y-10">
              <div>
                <p className="text-sm text-purple-600 uppercase tracking-wide font-semibold">
                  BMI
                </p>

                <h2 className="text-5xl font-bold text-slate-900 mt-2">
                  {bmi || '--'}
                </h2>

                <p className="mt-2 text-slate-600">{bmiStatus}</p>
              </div>

              <div>
                <p className="text-sm text-pink-600 uppercase tracking-wide font-semibold">
                  Risk Score
                </p>

                <h2 className="text-5xl font-bold text-slate-900 mt-2">
                  {riskScore}/10
                </h2>

                <p className="mt-2 text-slate-600">
                  {riskLevel} hormonal risk
                </p>

                <div className="mt-5 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-pink-500 to-purple-600"
                    style={{ width: `${riskScore * 10}%` }}
                  />
                </div>
              </div>

              <div className="pt-8 border-t border-pink-100">
                <h3 className="text-xl font-semibold text-slate-900 mb-4">
                  Clinical Recommendation
                </h3>

                <p className="text-slate-600 leading-8">
                  Based on your current indicators, structured nutrition,
                  cycle tracking, and lifestyle guidance may support improved
                  hormonal wellness.
                </p>

                <Link
                  href="/pricing"
                  className="inline-block mt-8 px-7 py-4 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold shadow-lg hover:opacity-95 transition-all"
                >
                  Explore Care Plans
                </Link>

                <p className="text-xs text-slate-400 mt-6 leading-6">
                  This assessment is intended for wellness screening and does not
                  replace medical diagnosis or professional consultation.
                </p>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}