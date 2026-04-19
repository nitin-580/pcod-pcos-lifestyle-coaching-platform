'use client';

export default function EarningsAnalytics({ earnings = [], stats }: { earnings?: any[], stats?: any }) {
  const maxValue = earnings.length > 0 ? Math.max(...earnings.map((d) => d.amount), 5000) : 5000;

  return (
    <section className="mt-8 grid grid-cols-3 gap-6">
      {/* Left Earnings Chart */}
      <div className="col-span-2 bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              Earnings Analytics
            </h2>
            <p className="text-slate-500 mt-1">
              Monthly revenue overview
            </p>
          </div>

          <button className="text-purple-600 font-medium">
            View Report
          </button>
        </div>

        {/* Top cards */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="bg-[#fdf2f8] rounded-2xl p-5">
            <p className="text-sm text-slate-500">Total Earnings</p>
            <h3 className="text-3xl font-bold text-slate-800 mt-2">
              ₹{stats?.totalEarnings || 0}
            </h3>
          </div>

          <div className="bg-[#f5f3ff] rounded-2xl p-5">
            <p className="text-sm text-slate-500">Overall Transactions</p>
            <h3 className="text-3xl font-bold text-slate-800 mt-2">
              {earnings.length}
            </h3>
          </div>

          <div className="bg-[#eef2ff] rounded-2xl p-5">
            <p className="text-sm text-slate-500">Status</p>
            <h3 className="text-3xl font-bold text-slate-800 mt-2">
              Active
            </h3>
          </div>
        </div>

        {/* Chart (Simplified for dynamic) */}
        <div className="mt-10 h-72 flex items-end gap-5">
          {earnings.slice(0, 6).map((item, index) => {
            const height = (item.amount / maxValue) * 220;

            return (
              <div
                key={index}
                className="flex-1 flex flex-col items-center gap-3"
              >
                <div
                  className="w-full rounded-t-2xl bg-gradient-to-t from-pink-500 to-purple-500"
                  style={{ height }}
                />
                <p className="text-sm text-slate-500">
                  {new Date(item.date).toLocaleDateString([], { month: 'short' })}
                </p>
              </div>
            );
          })}
          {earnings.length === 0 && (
            <div className="w-full h-full flex items-center justify-center text-slate-300">
              No data points available yet
            </div>
          )}
        </div>
      </div>

      {/* Right Recent Transactions */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-800">
          Recent Transactions
        </h2>

        <div className="space-y-4 mt-6 overflow-y-auto max-h-[500px]">
          {earnings.map((transaction, index) => (
            <div
              key={index}
              className="p-4 rounded-2xl bg-slate-50"
            >
              <h3 className="font-semibold text-slate-800">
                {transaction.description || 'Consultation Fee'}
              </h3>

              <div className="flex justify-between mt-3">
                <span className="font-semibold text-purple-600">
                  ₹{transaction.amount}
                </span>

                <span className="text-sm text-slate-400">
                  {new Date(transaction.date).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
          {earnings.length === 0 && (
             <div className="py-10 text-center text-slate-400">
               No transactions yet
             </div>
          )}
        </div>

        <button className="w-full mt-6 py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-medium">
          Withdraw Earnings
        </button>
      </div>
    </section>
  );
}
