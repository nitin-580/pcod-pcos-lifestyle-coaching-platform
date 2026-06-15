import React, { useState } from 'react';
import { Droplet, Flame, Compass, Activity, Moon } from 'lucide-react';
import DietCard from '../../components/diet/DietCard';
import MealCard from '../../components/diet/MealCard';
import AvoidFoodCard from '../../components/diet/AvoidFoodCard';
import FullDietModal from '../../components/diet/FullDietModal';
import { DietPlan, DayDietPlan, Meal, DailyTarget } from '@/types/diet';

interface DietScreenProps {
  dietPlan: DietPlan;
}

export const DietScreen: React.FC<DietScreenProps> = ({ dietPlan }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Default to Day 1 for "Today's Diet View"
  const todayPlan = dietPlan.dietData.find((d: DayDietPlan) => d.day === 1) || dietPlan.dietData[0];

  return (
    <div className="bg-[#FAF8FC] min-h-screen rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-inner flex flex-col font-sans">
      
      {/* Header Section */}
      <div className="bg-gradient-to-b from-purple-100/50 to-transparent px-6 pt-10 pb-6 text-center relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-purple-200/20 rounded-full blur-3xl pointer-events-none" />
        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">My Diet Plan</h1>
        <h2 className="text-sm font-bold text-purple-600 uppercase tracking-widest mt-1">
          {dietPlan.name || "PCOD + Ulcerative Colitis (UC)"}
        </h2>
        <p className="text-xs text-slate-500 font-medium mt-2 bg-white/60 border border-purple-100/40 rounded-full py-1.5 px-4 inline-block shadow-sm">
          {dietPlan.description || "Hormonal Balance • Gut Healing • Healthy Weight Gain"}
        </p>
      </div>

      <div className="px-6 pb-24 space-y-8 flex-1">
        
        {/* Top Patient Card */}
        <DietCard
          age={dietPlan.patientAge}
          height={dietPlan.patientHeight}
          weight={dietPlan.patientWeight}
          goal={dietPlan.patientGoal}
          diet={dietPlan.patientDiet}
        />

        {/* Today's Diet View */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-purple-100/40 pb-3">
            <h3 className="text-slate-800 font-extrabold text-lg flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-pink-500 rounded-full inline-block animate-pulse"></span>
              Today's Diet Plan
            </h3>
            <span className="bg-purple-100 text-purple-700 font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wider">
              Day {todayPlan?.day || 1}
            </span>
          </div>

          <div className="space-y-3">
            {todayPlan?.meals.map((meal: Meal, idx: number) => (
              <MealCard
                key={idx}
                time={meal.time}
                food={meal.food}
                calories={meal.calories}
              />
            ))}
          </div>

          {/* Today's Total Calories */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100/40 rounded-2xl p-5 flex items-center justify-between shadow-sm mt-5">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Summary</span>
              <span className="text-sm font-bold text-slate-700">Total Calories Today</span>
            </div>
            <div className="flex items-center gap-1 bg-white border border-pink-100 px-4 py-2 rounded-xl">
              <Flame className="w-5 h-5 text-pink-500 fill-current" />
              <span className="text-lg font-black text-slate-800">{todayPlan?.totalCalories || 1775}</span>
              <span className="text-xs font-bold text-slate-400">kcal</span>
            </div>
          </div>
        </div>

        {/* Full 7-Day Plan Button */}
        <div className="pt-2">
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-extrabold py-4 px-6 rounded-2xl shadow-lg shadow-purple-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 text-center"
          >
            View Complete 7-Day Diet Plan
          </button>
        </div>

        {/* Daily Targets Section */}
        <div className="space-y-4">
          <h3 className="text-slate-800 font-bold text-lg flex items-center gap-2">
            <span className="w-2 h-5 bg-purple-500 rounded-full inline-block"></span>
            Daily Targets
          </h3>

          <div className="grid grid-cols-2 gap-4">
            {dietPlan.dailyTargets?.map((target: DailyTarget, idx: number) => {
              const icon = getTargetIcon(target.name);
              const color = getTargetColor(target.name);
              return (
                <div key={idx} className="bg-white border border-slate-100 rounded-2xl p-4 flex items-center gap-3 shadow-sm hover:shadow-md transition-all">
                  <div className={`w-10 h-10 ${color.bg} ${color.text} rounded-xl flex items-center justify-center flex-shrink-0`}>
                    {icon}
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">{target.name}</span>
                    <span className="text-xs font-bold text-slate-800">{target.value}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Foods To Avoid Section */}
        <AvoidFoodCard foods={dietPlan.foodsToAvoid} />

      </div>

      {/* 7-Day Plan Modal */}
      <FullDietModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        dietData={dietPlan.dietData}
      />
    </div>
  );
};

// Helper function to return icon based on target name
function getTargetIcon(name: string) {
  switch (name.toLowerCase()) {
    case 'water':
      return <Droplet className="w-5 h-5" />;
    case 'walking':
      return <Compass className="w-5 h-5" />;
    case 'yoga':
      return <Activity className="w-5 h-5" />;
    case 'sleep':
      return <Moon className="w-5 h-5" />;
    default:
      return <Activity className="w-5 h-5" />;
  }
}

// Helper function to return color class based on target name
function getTargetColor(name: string) {
  switch (name.toLowerCase()) {
    case 'water':
      return { bg: 'bg-blue-50', text: 'text-blue-500' };
    case 'walking':
      return { bg: 'bg-amber-50', text: 'text-amber-500' };
    case 'yoga':
      return { bg: 'bg-purple-50', text: 'text-purple-500' };
    case 'sleep':
      return { bg: 'bg-indigo-50', text: 'text-indigo-500' };
    default:
      return { bg: 'bg-slate-50', text: 'text-slate-500' };
  }
}

export default DietScreen;
