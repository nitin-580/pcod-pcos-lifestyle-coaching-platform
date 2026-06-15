import React from 'react';
import { Flame, Clock } from 'lucide-react';

interface MealCardProps {
  time: string;
  food: string | string[];
  calories: number;
}

export const MealCard: React.FC<MealCardProps> = ({ time, food, calories }) => {
  const foodItems = Array.isArray(food) 
    ? food 
    : typeof food === 'string' 
      ? food.split('+').map(item => item.trim()).filter(Boolean)
      : [];

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 flex items-center justify-between gap-4 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-start gap-4">
        {/* Time Badge & Indicator */}
        <div className="flex-shrink-0 w-11 h-11 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
          <Clock className="w-5 h-5" />
        </div>

        <div>
          {/* Meal Time Title */}
          <h4 className="text-slate-800 font-bold text-sm uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
            {time}
          </h4>

          {/* Food Items List */}
          <ul className="space-y-1">
            {foodItems.map((item, idx) => (
              <li key={idx} className="text-slate-600 text-sm font-medium flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-pink-400 rounded-full inline-block"></span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Calories Badge */}
      <div className="flex-shrink-0 flex flex-col items-end justify-center bg-pink-50/50 border border-pink-100/30 rounded-2xl py-2 px-4">
        <div className="flex items-center gap-1 text-pink-600">
          <Flame className="w-4 h-4 fill-current" />
          <span className="text-sm font-black tracking-tight">{calories}</span>
        </div>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">kcal</span>
      </div>
    </div>
  );
};
export default MealCard;
