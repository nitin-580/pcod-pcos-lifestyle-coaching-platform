interface Props {
  cycleDay: number;
  nextDate: string;
  onLogPeriod?: () => void;
  onUndoPeriod?: () => void;
}

export default function PeriodTracker({
  cycleDay,
  nextDate,
  onLogPeriod,
  onUndoPeriod,
}: Props) {
  const getPhase = (day: number) => {
    if (day <= 5) return 'Period Phase';
    if (day <= 14) return 'Fertile Window';
    return 'Luteal Phase';
  };

  const phase = getPhase(cycleDay);

  return (
    <div className="bg-[#F6FAF1] rounded-3xl p-6 md:p-8 border border-[#E3EDD9] shadow-lg w-full max-w-md mx-auto">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-slate-900">
          Period Tracker
        </h2>

        <div className="w-10 h-6 rounded-full bg-[#DDEFD4] flex items-center px-1">
          <div className="w-4 h-4 rounded-full bg-[#A7D08C]" />
        </div>
      </div>

      {/* Ring UI */}
      <div className="mt-8 flex justify-center">
        <div className="relative w-64 h-64">
          
          {/* Outer Gradient Ring */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: `conic-gradient(
                #ff7b93 0deg 70deg,
                #f6d86b 70deg 220deg,
                #9ddcff 220deg 290deg,
                #cfe8c5 290deg 360deg
              )`,
            }}
          />

          {/* Inner Circle */}
          <div className="absolute inset-3 rounded-full bg-white flex flex-col justify-center items-center shadow-sm">
            <h1 className="text-5xl font-bold text-slate-900">
              Day {cycleDay}
            </h1>

            <p className="mt-2 text-lg text-slate-600">
              {phase}
            </p>

            {/* Mood shape */}
            <div className="absolute bottom-6 w-24 h-14 rounded-t-full bg-[#DDEFD4] flex flex-col items-center justify-center">
              <div className="flex gap-4">
                <span className="w-3 h-1 bg-black rounded-full rotate-[-10deg]" />
                <span className="w-3 h-1 bg-black rounded-full rotate-[10deg]" />
              </div>
              <span className="w-4 h-1 border-b-2 border-black rounded-full mt-2" />
            </div>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="mt-8 space-y-3">
        <p className="text-slate-600">
          Current Cycle Day:{' '}
          <span className="font-semibold text-slate-900">
            {cycleDay}
          </span>
        </p>

        <p className="text-slate-600">
          Next expected period:{' '}
          <span className="font-semibold text-slate-900">
            {nextDate}
          </span>
        </p>
      </div>

      {/* Legend */}
      <div className="mt-6 flex gap-6 text-sm text-slate-600">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-pink-400" />
          Period
        </div>

        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-sky-300" />
          Fertile
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-8 flex gap-4">
        <button 
          onClick={onLogPeriod}
          className="flex-1 bg-white rounded-2xl py-4 shadow-md text-slate-700 font-medium hover:shadow-lg transition">
          Log Period <span className="text-pink-400 text-lg">＋</span>
        </button>

        {cycleDay > 1 && (
          <button 
            onClick={() => onUndoPeriod && onUndoPeriod()}
            className="px-6 rounded-2xl bg-[#F0F7EA] border border-[#E3EDD9] text-slate-400 hover:text-slate-600 transition">
            Undo
          </button>
        )}
      </div>
    </div>
  );
}