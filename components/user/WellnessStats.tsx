interface Props {
  bmi: number;
  score: number;
  symptoms?: string[];
}

export default function WellnessStats({
  bmi,
  score,
  symptoms = [],
}: Props) {
  const getGrade = (s: number) => {
    if (s >= 90) return 'AA';
    if (s >= 82) return 'AB';
    if (s >= 75) return 'BB';
    if (s >= 65) return 'BC';
    if (s >= 55) return 'CC';
    return 'F';
  };

  return (
    <div className="bg-white rounded-3xl p-8 border border-purple-100">
      <h2 className="text-2xl font-semibold text-slate-900">
        Wellness Stats
      </h2>

      <div className="mt-6 grid grid-cols-2 gap-6 pb-6 border-b border-slate-50">
        <div>
          <p className="text-sm text-slate-500 uppercase tracking-tight font-medium">BMI</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">
            {bmi || '--'}
          </p>
        </div>

        <div>
          <p className="text-sm text-slate-500 uppercase tracking-tight font-medium">
            Grade
          </p>
          <p className="text-3xl font-bold text-pink-600 mt-2">
            {getGrade(score)}
          </p>
        </div>
      </div>

      {/* Symptoms */}
      <div className="mt-6">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Current Symptoms
        </p>

        {symptoms.length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {symptoms.map((s) => (
              <span
                key={s}
                className="px-3 py-1 rounded-full bg-purple-50 text-purple-600 text-xs font-medium border border-purple-100 shadow-sm"
              >
                {s}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-400 mt-3 italic">
            No symptoms logged today.
          </p>
        )}
      </div>
    </div>
  );
}