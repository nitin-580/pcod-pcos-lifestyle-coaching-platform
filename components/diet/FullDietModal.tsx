import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Flame } from 'lucide-react';
import MealCard from './MealCard';
import { DayDietPlan, Meal } from '@/types/diet';

interface FullDietModalProps {
  isOpen: boolean;
  onClose: () => void;
  dietData: DayDietPlan[];
}

export const FullDietModal: React.FC<FullDietModalProps> = ({ isOpen, onClose, dietData }) => {
  const [selectedDay, setSelectedDay] = useState(1);

  const activeDayData = dietData.find((d) => d.day === selectedDay) || dietData[0];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="bg-[#FDFCFD] rounded-[2.5rem] w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl border border-purple-100/60 overflow-hidden relative z-10"
          >
            {/* Header */}
            <div className="px-6 pt-8 pb-4 flex items-center justify-between border-b border-purple-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800">7-Day Diet Plan</h3>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mt-0.5">
                    Hormonal Balance & Gut Healing
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-xl transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Horizontal Tabs */}
            <div className="px-6 py-4 bg-slate-50/50 border-b border-purple-50 overflow-x-auto flex gap-2 no-scrollbar">
              {dietData.map((d) => (
                <button
                   key={d.day}
                   onClick={() => setSelectedDay(d.day)}
                   className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                     selectedDay === d.day
                       ? 'bg-purple-600 text-white shadow-md shadow-purple-200'
                       : 'bg-white text-slate-500 border border-slate-100 hover:text-slate-800'
                   }`}
                >
                  Day {d.day}
                </button>
              ))}
            </div>

            {/* Meals Content (Scrollable) */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4 no-scrollbar">
              {activeDayData?.meals.map((meal: Meal, idx: number) => (
                <MealCard key={idx} time={meal.time} food={meal.food} calories={meal.calories} />
              ))}
            </div>

            {/* Footer Summary */}
            <div className="px-6 py-5 bg-purple-50/40 border-t border-purple-50 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                  Daily Intake Summary
                </span>
                <span className="text-sm font-bold text-slate-600">Day {selectedDay} Target</span>
              </div>

              <div className="flex items-center gap-1.5 bg-white border border-pink-100 px-4 py-2 rounded-2xl">
                <Flame className="w-5 h-5 text-pink-500 fill-current" />
                <span className="text-base font-black text-slate-800">
                  {activeDayData?.totalCalories}
                </span>
                <span className="text-xs font-bold text-slate-400">kcal</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
export default FullDietModal;
