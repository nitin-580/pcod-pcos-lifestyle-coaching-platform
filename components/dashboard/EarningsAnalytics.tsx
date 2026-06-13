'use client';

export default function EarningsAnalytics({ earnings = [], stats, doctorData }: { earnings?: any[], stats?: any, doctorData?: any }) {
  const maxValue = earnings.length > 0 ? Math.max(...earnings.map((d) => d.amount), 5000) : 5000;

  let bankDetails: any = null;
  if (doctorData?.credentials) {
    try {
      const parsed = JSON.parse(doctorData.credentials);
      if (parsed && typeof parsed === 'object' && parsed.bankName) {
        bankDetails = parsed;
      }
    } catch (e) {
      // Not JSON or doesn't have bank details
    }
  }

  return (
    <section className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Earnings Chart */}
      <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              Earnings Analytics
            </h2>
            <p className="text-slate-500 mt-1">
              Monthly revenue overview (Transferred to Account)
            </p>
          </div>

          <button className="text-purple-600 font-medium">
            View Report
          </button>
        </div>

        {/* Top cards */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="bg-[#fdf2f8] rounded-2xl p-5">
            <p className="text-sm text-slate-500">Total Transferred</p>
            <h3 className="text-3xl font-bold text-slate-800 mt-2">
              ₹{stats?.totalEarnings || 0}
            </h3>
          </div>

          <div className="bg-[#f5f3ff] rounded-2xl p-5">
            <p className="text-sm text-slate-500">Transfers Count</p>
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
              No transfers received yet
            </div>
          )}
        </div>
      </div>

      {/* Right Recent Transactions */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            Transferred Payouts
          </h2>

          <div className="space-y-4 mt-6 overflow-y-auto max-h-[350px]">
            {earnings.map((transaction, index) => (
              <div
                key={index}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-100"
              >
                <h3 className="font-semibold text-slate-800">
                  {transaction.description || 'Payout Transfer'}
                </h3>

                <div className="flex justify-between mt-3">
                  <span className="font-semibold text-emerald-600">
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
                 No payout transfers yet
               </div>
            )}
          </div>
        </div>

        {/* Transferred Bank Account Details Section */}
        <div className="mt-6">
          {bankDetails ? (
            <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl text-xs space-y-1.5 text-slate-700">
              <p className="text-[10px] text-emerald-800 font-bold uppercase tracking-wider mb-1">
                Verified Bank Account Details
              </p>
              <p>Bank Name: <span className="font-bold text-slate-900">{bankDetails.bankName}</span></p>
              <p>Account Number: <span className="font-bold text-slate-900">{bankDetails.accountNumber}</span></p>
              <p>IFSC Code: <span className="font-bold text-slate-900">{bankDetails.ifscCode}</span></p>
            </div>
          ) : (
            <div className="p-4 bg-amber-50/50 border border-amber-100 rounded-2xl text-xs text-center text-amber-800 font-semibold italic">
              Bank account details not configured yet. Payouts will be processed once added by the admin.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
