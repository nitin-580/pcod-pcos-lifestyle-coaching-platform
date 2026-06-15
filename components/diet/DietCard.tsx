import React from 'react';
import { User, Scaling, Weight, Target, Utensils } from 'lucide-react';

interface DietCardProps {
  age?: string;
  height?: string;
  weight?: string;
  goal?: string;
  diet?: string;
}

export const DietCard: React.FC<DietCardProps> = ({
  age = '31 Years',
  height = '162 cm',
  weight = '50 kg',
  goal = 'Healthy Weight Gain (+3-5 kg)',
  diet = 'Vegetarian',
}) => {
  return (
    <div className="bg-white rounded-[2rem] border border-purple-100/60 p-6 md:p-8 shadow-sm relative overflow-hidden">
      {/* Soft Background Accents */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-pink-100/30 rounded-full blur-xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-100/30 rounded-full blur-xl pointer-events-none" />

      <h3 className="text-slate-800 font-bold text-lg mb-5 flex items-center gap-2">
        <span className="w-2 h-5 bg-purple-500 rounded-full inline-block"></span>
        Patient Profile
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6 relative z-10">
        {/* Age Card */}
        <div className="bg-purple-50/40 border border-purple-100/40 rounded-2xl p-4 flex flex-col items-center text-center transition-all duration-300 hover:scale-[1.02]">
          <User className="w-5 h-5 text-purple-500 mb-2" />
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Age</span>
          <span className="text-base font-bold text-slate-800 mt-1">{age}</span>
        </div>

        {/* Height Card */}
        <div className="bg-pink-50/40 border border-pink-100/40 rounded-2xl p-4 flex flex-col items-center text-center transition-all duration-300 hover:scale-[1.02]">
          <Scaling className="w-5 h-5 text-pink-500 mb-2" />
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Height</span>
          <span className="text-base font-bold text-slate-800 mt-1">{height}</span>
        </div>

        {/* Weight Card */}
        <div className="bg-purple-50/40 border border-purple-100/40 rounded-2xl p-4 flex flex-col items-center text-center transition-all duration-300 hover:scale-[1.02]">
          <Weight className="w-5 h-5 text-purple-500 mb-2" />
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Weight</span>
          <span className="text-base font-bold text-slate-800 mt-1">{weight}</span>
        </div>

        {/* Goal Card */}
        <div className="col-span-2 md:col-span-1 bg-pink-50/40 border border-pink-100/40 rounded-2xl p-4 flex flex-col items-center text-center transition-all duration-300 hover:scale-[1.02]">
          <Target className="w-5 h-5 text-pink-500 mb-2" />
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Goal</span>
          <span className="text-sm font-bold text-slate-800 mt-1 line-clamp-1">{goal}</span>
        </div>

        {/* Diet Card */}
        <div className="col-span-2 md:col-span-1 bg-purple-50/40 border border-purple-100/40 rounded-2xl p-4 flex flex-col items-center text-center transition-all duration-300 hover:scale-[1.02]">
          <Utensils className="w-5 h-5 text-purple-500 mb-2" />
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Diet Type</span>
          <span className="text-base font-bold text-slate-800 mt-1">{diet}</span>
        </div>
      </div>
    </div>
  );
};
export default DietCard;
