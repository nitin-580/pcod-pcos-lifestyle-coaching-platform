interface Props {
  intake: number;
  target: number;
  onAddWater?: () => void;
}

export default function WaterTracker({
  intake,
  target,
  onAddWater,
}: Props) {
  const percent = Math.min((intake / target) * 100, 100);
  const progress = (percent / 100) * 360;

  return (
    <div className="bg-[#F7FBFF] rounded-3xl p-6 md:p-8 border border-blue-100 shadow-lg w-full">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-slate-900">
          Water Intake
        </h2>

        <div className="w-10 h-6 rounded-full bg-blue-100 flex items-center px-1">
          <div className="w-4 h-4 rounded-full bg-blue-400" />
        </div>
      </div>

      {/* Circular Water Progress */}
      <div className="mt-8 flex justify-center">
        <div className="relative w-56 h-56">
          
          {/* Outer progress ring */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: `conic-gradient(
                #60A5FA 0deg ${progress}deg,
                #E2E8F0 ${progress}deg 360deg
              )`,
            }}
          />

          {/* Inner circle */}
          <div className="absolute inset-3 rounded-full bg-white flex flex-col justify-center items-center shadow-sm">
            <div className="text-6xl">💧</div>

            <h2 className="text-4xl font-bold text-slate-900 mt-2">
              {intake}
            </h2>

            <p className="text-slate-500 text-sm">
              of {target} glasses
            </p>

            <p className="mt-2 text-blue-500 font-medium">
              {Math.round(percent)}%
            </p>
          </div>
        </div>
      </div>

      {/* Glass indicators */}
      <div className="mt-8 grid grid-cols-4 gap-3">
        {Array.from({ length: target }).map((_, index) => (
          <div
            key={index}
            className={`h-14 rounded-2xl flex items-center justify-center text-xl shadow-sm border ${
              index < intake
                ? 'bg-blue-100 border-blue-200'
                : 'bg-white border-slate-100'
            }`}
          >
            💧
          </div>
        ))}
      </div>

      {/* Footer text */}
      <p className="mt-6 text-center text-slate-600">
        {intake}/{target} glasses completed today
      </p>

      {/* CTA */}
      <button 
        onClick={onAddWater}
        className="mt-6 w-full rounded-2xl bg-white py-4 shadow-md text-slate-700 font-medium hover:shadow-lg transition">
        Add Water ＋
      </button>
    </div>
  );
}