import React from 'react';
import { AlertTriangle, ShieldAlert } from 'lucide-react';

interface AvoidFoodCardProps {
  foods?: string[];
}

export const AvoidFoodCard: React.FC<AvoidFoodCardProps> = ({
  foods = [
    'Milk Products',
    'Sprouts',
    'Bakery Foods',
    'Desi Ghee',
    'Fried Foods',
    'Excess Sugar',
    'Mango',
    'Excess Dry Fruits',
    'Carbonated Drinks',
  ],
}) => {
  return (
    <div className="bg-rose-50/50 border border-rose-100 rounded-[2rem] p-6 md:p-8 shadow-sm">
      <h3 className="text-rose-800 font-bold text-lg mb-4 flex items-center gap-2">
        <ShieldAlert className="w-5 h-5 text-rose-600" />
        Foods to Avoid
      </h3>
      <p className="text-rose-600/80 text-xs font-semibold mb-6">
        To manage PCOD symptoms and prevent Ulcerative Colitis (UC) flare-ups, strictly avoid these foods:
      </p>

      <div className="flex flex-wrap gap-2.5">
        {foods.map((food, idx) => (
          <div
            key={idx}
            className="flex items-center gap-2 bg-white border border-rose-100 rounded-full py-2 px-4 shadow-sm hover:bg-rose-50 transition-colors duration-300"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
            <span className="text-slate-800 font-bold text-xs">{food}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
export default AvoidFoodCard;
