import React, { useState } from 'react';
import { ChevronLeft, Calendar, Flame } from 'lucide-react';
import MealCard from '../../components/diet/MealCard';
import { DayDietPlan, Meal } from '@/types/diet';

interface FullDietPlanScreenProps {
  dietData: DayDietPlan[];
  onBack: () => void;
}

export const FullDietPlanScreen: React.FC<FullDietPlanScreenProps> = ({ dietData, onBack }) => {
  const [selectedDay, setSelectedDay] = useState(1);

  const activeDayData = dietData.find((d: DayDietPlan) => d.day === selectedDay) || dietData[0];

  return (
    <div className="bg-[#FAF8FC] min-h-screen rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-inner flex flex-col font-sans">
      
      {/* Header */}
      <div className="px-6 pt-10 pb-4 bg-gradient-to-b from-purple-100/50 to-transparent flex items-center justify-between border-b border-purple-50">
        <button
          onClick={onBack}
          className="p-2 text-slate-500 hover:text-slate-900 bg-white rounded-xl border border-slate-100 hover:shadow-sm transition-all"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="text-center flex-1">
          <h1 className="text-xl font-bold text-slate-800">7-Day Diet Plan</h1>
          <p className="text-[10px] font-bold text-purple-600 uppercase tracking-widest mt-0.5">
            Clinical Nutrition Chart
          </p>
        </div>

        {/* Empty placeholder for symmetry */}
        <div className="w-9 h-9" />
      </div>

      {/* Tabs */}
      <div className="px-6 py-4 bg-white border-b border-slate-50 overflow-x-auto flex gap-2 no-scrollbar">
        {dietData.map((d: DayDietPlan) => (
          <button
            key={d.day}
            onClick={() => setSelectedDay(d.day)}
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
              selectedDay === d.day
                ? 'bg-purple-600 text-white shadow-md shadow-purple-200'
                : 'bg-slate-50 text-slate-500 hover:text-slate-800'
            }`}
          >
            Day {d.day}
          </button>
        ))}
      </div>

      {/* Meals Content */}
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

    </div>
  );
};

export default FullDietPlanScreen;
