'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { determineHormoneProfile, type HormoneProfile } from '@/lib/quizLogic';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

const QUESTIONS = [
  {
    id: 'sleep',
    text: 'How would you describe your current sleep quality?',
    options: [
      { value: 'poor', label: 'Restless, I wake up tired' },
      { value: 'average', label: 'Okay, but could be better' },
      { value: 'good', label: 'I sleep deeply and wake up refreshed' },
    ],
  },
  {
    id: 'stress',
    text: 'What is your average daily stress level?',
    options: [
      { value: 'high', label: 'Consistently high, feeling overwhelmed' },
      { value: 'moderate', label: 'Manageable but present' },
      { value: 'low', label: 'Generally calm and relaxed' },
    ],
  },
  {
    id: 'exercise',
    text: 'How often do you engage in vigorous exercise?',
    options: [
      { value: 'high', label: '4+ times a week (HIIT, heavy lifting)' },
      { value: 'moderate', label: 'Regular moderate activity (walking, yoga)' },
      { value: 'low', label: 'Rarely, primarily sedentary' },
    ],
  },
  {
    id: 'sugarCravings',
    text: 'Do you experience intense sugar or carb cravings, especially in the afternoon?',
    options: [
      { value: 'frequent', label: 'Yes, almost every day' },
      { value: 'occasional', label: 'Sometimes, depending on my cycle' },
      { value: 'rare', label: 'Rarely or never' },
    ],
  },
];

export default function HormoneQuiz() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{ profile: HormoneProfile; description: string } | null>(null);

  const handleSelect = (questionId: string, value: string) => {
    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);

    setTimeout(() => {
      if (currentStep < QUESTIONS.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        setResult(determineHormoneProfile(newAnswers));
      }
    }, 400); // slight delay for animation
  };

  const reset = () => {
    setAnswers({});
    setCurrentStep(0);
    setResult(null);
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl shadow-md p-8 max-w-2xl mx-auto w-full">
      <div className="mb-8 text-center">
        <h3 className="text-3xl font-bold text-slate-800 mb-2">Discover Your Hormone Profile</h3>
        <p className="text-slate-600">Answer 4 quick questions to understand your unique biochemical needs.</p>
      </div>

      {!result ? (
        <div className="relative min-h-[300px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0"
            >
              <h4 className="text-xl font-semibold text-slate-700 mb-6 text-center">
                {QUESTIONS[currentStep].text}
              </h4>
              
              <div className="space-y-3">
                {QUESTIONS[currentStep].options.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => handleSelect(QUESTIONS[currentStep].id, opt.value)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex justify-between items-center $\n                      {answers[QUESTIONS[currentStep].id] === opt.value \n                        ? 'border-pink-500 bg-pink-50 text-pink-700' \n                        : 'border-white bg-white hover:border-pink-200 hover:bg-pink-50/50 text-slate-600'}`}
                  >
                    <span className="font-medium">{opt.label}</span>
                    {answers[QUESTIONS[currentStep].id] === opt.value && (
                      <CheckCircle2 className="w-5 h-5 text-pink-500" />
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
          
          <div className="absolute bottom-0 w-full flex justify-center gap-2 mt-8">
            {QUESTIONS.map((_, idx) => (
              <div 
                key={idx} 
                className={`h-2 rounded-full transition-all duration-300 $\n                  {idx === currentStep ? 'w-8 bg-pink-500' : idx < currentStep ? 'w-2 bg-pink-300' : 'w-2 bg-pink-100'}`}
              />
            ))}
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center bg-white p-8 rounded-2xl shadow-sm border border-pink-100"
        >
          <div className="mx-auto w-16 h-16 bg-gradient-to-tr from-pink-400 to-purple-500 rounded-full flex items-center justify-center mb-6 shadow-md text-white">
             {result.profile.charAt(0)}
          </div>
          <h4 className="text-2xl font-bold text-slate-800 mb-4">{result.profile}</h4>
          <p className="text-slate-600 leading-relaxed mb-8">
            {result.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/pricing" className="px-6 py-3 bg-slate-800 text-white rounded-full font-medium hover:bg-slate-700 transition-colors flex items-center justify-center gap-2">
              Get Custom Plan <ArrowRight className="w-4 h-4" />
            </Link>
            <button
              onClick={reset}
              className="px-6 py-3 text-slate-500 font-medium hover:bg-slate-50 rounded-full transition-colors"
            >
              Retake Quiz
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
