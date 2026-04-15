'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { calculatePCODRisk, type RiskLevel } from '@/lib/quizLogic';

const QUESTIONS = [
  { id: 'q1', text: 'Have you experienced irregular periods or missed cycles recently?', value: 3 },
  { id: 'q2', text: 'Have you noticed increased acne, particularly around your jawline or chin?', value: 2 },
  { id: 'q3', text: 'Are you experiencing noticeable excess hair growth on your face or body?', value: 3 },
  { id: 'q4', text: 'Have you had unexplained weight gain or difficulty losing weight?', value: 2 },
  { id: 'q5', text: 'Do you frequently feel fatigued, even after a full night of sleep?', value: 1 },
];

export default function SymptomChecker() {
  const [currentStep, setCurrentStep] = useState(0);
  const [score, setScore] = useState(0);
  const [result, setResult] = useState<{ level: RiskLevel; explanation: string } | null>(null);

  const handleAnswer = (yes: boolean, value: number) => {
    const newScore = score + (yes ? value : 0);
    setScore(newScore);

    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setResult(calculatePCODRisk(newScore));
    }
  };

  const reset = () => {
    setCurrentStep(0);
    setScore(0);
    setResult(null);
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-purple-100 p-8 max-w-xl mx-auto w-full">
      <h3 className="text-2xl font-bold text-slate-800 mb-6 text-center">PCOD Symptom Checker</h3>
      
      {!result ? (
        <div className="space-y-6">
          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-purple-500"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / QUESTIONS.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          
          <div className="min-h-[100px] flex items-center justify-center">
            <motion.p
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="text-lg text-slate-700 font-medium text-center"
            >
              {QUESTIONS[currentStep].text}
            </motion.p>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              onClick={() => handleAnswer(true, QUESTIONS[currentStep].value)}
              className="flex-1 py-3 px-6 rounded-xl border-2 border-purple-200 text-purple-700 font-semibold hover:bg-purple-50 hover:border-purple-300 transition-colors"
            >
              Yes
            </button>
            <button
              onClick={() => handleAnswer(false, QUESTIONS[currentStep].value)}
              className="flex-1 py-3 px-6 rounded-xl border-2 border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 hover:border-slate-300 transition-colors"
            >
              No
            </button>
          </div>
          <p className="text-center text-sm text-slate-400 mt-4">
            Question {currentStep + 1} of {QUESTIONS.length}
          </p>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-6"
        >
          <div className={`inline-flex items-center justify-center p-4 rounded-full mb-2 $\n            {result.level === 'High' ? 'bg-rose-100 text-rose-600' :\n            result.level === 'Moderate' ? 'bg-amber-100 text-amber-600' :\n            'bg-emerald-100 text-emerald-600'}`}>
            <span className="text-2xl font-bold">{result.level} Risk</span>
          </div>
          <p className="text-slate-600 leading-relaxed bg-slate-50 p-6 rounded-2xl">
            {result.explanation}
          </p>
          <button
            onClick={reset}
            className="text-purple-600 font-medium hover:text-purple-700 underline underline-offset-4"
          >
            Retake Quiz
          </button>
        </motion.div>
      )}
    </div>
  );
}
