interface Props {
  target: number;
  proteinTarget: number;
}

export default function NutritionPlan({
  target,
  proteinTarget,
}: Props) {
  return (
    <div className="w-full max-w-sm bg-white rounded-3xl border border-pink-100 shadow-md p-5">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold tracking-[0.18em] uppercase text-pink-500">
            Doctor Plan
          </p>

          <h2 className="text-lg font-semibold text-slate-900 mt-1">
            Nutrition Goals
          </h2>
        </div>

        <div className="w-10 h-10 rounded-2xl bg-pink-50 flex items-center justify-center text-lg">
          🥗
        </div>
      </div>

      {/* Targets */}
      <div className="mt-5 space-y-3">
        
        <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
          <p className="text-xs text-slate-500">
            Daily Calories
          </p>

          <h3 className="text-2xl font-bold text-slate-900 mt-1">
            {target > 0 ? target : 'NA'}
            {target > 0 && <span className="text-sm font-medium text-slate-500 ml-1">kcal</span>}
          </h3>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
          <p className="text-xs text-slate-500">
            Daily Protein
          </p>

          <h3 className="text-2xl font-bold text-slate-900 mt-1">
            {proteinTarget > 0 ? proteinTarget : 'NA'}
            {proteinTarget > 0 && <span className="text-sm font-medium text-slate-500 ml-1">g</span>}
          </h3>
        </div>
      </div>

      {/* Footer note */}
      <p className="mt-4 text-xs leading-5 text-slate-400">
        Updated by your doctor based on your active wellness plan.
      </p>
    </div>
  );
}