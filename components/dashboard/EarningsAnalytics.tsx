
'use client';

const monthlyData = [
  { month: 'Jan', amount: 22000 },
  { month: 'Feb', amount: 28000 },
  { month: 'Mar', amount: 32000 },
  { month: 'Apr', amount: 27000 },
  { month: 'May', amount: 38000 },
  { month: 'Jun', amount: 42000 },
];

const transactions = [
  {
    patient: 'Priya Sharma',
    type: 'PCOD Consultation',
    amount: '₹799',
    date: 'Today',
  },
  {
    patient: 'Riya Verma',
    type: 'Diet Session',
    amount: '₹699',
    date: 'Yesterday',
  },
  {
    patient: 'Ananya Patel',
    type: 'Follow-up',
    amount: '₹499',
    date: '2 days ago',
  },
];

export default function EarningsAnalytics() {
  const maxValue = Math.max(...monthlyData.map((d) => d.amount));

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
              ₹48,500
            </h3>
          </div>

          <div className="bg-[#f5f3ff] rounded-2xl p-5">
            <p className="text-sm text-slate-500">Today</p>
            <h3 className="text-3xl font-bold text-slate-800 mt-2">
              ₹1,998
            </h3>
          </div>

          <div className="bg-[#eef2ff] rounded-2xl p-5">
            <p className="text-sm text-slate-500">Pending</p>
            <h3 className="text-3xl font-bold text-slate-800 mt-2">
              ₹3,200
            </h3>
          </div>
        </div>

        {/* Chart */}
        <div className="mt-10 h-72 flex items-end gap-5">
          {monthlyData.map((item) => {
            const height = (item.amount / maxValue) * 220;

            return (
              <div
                key={item.month}
                className="flex-1 flex flex-col items-center gap-3"
              >
                <div
                  className="w-full rounded-t-2xl bg-gradient-to-t from-pink-500 to-purple-500"
                  style={{ height }}
                />
                <p className="text-sm text-slate-500">
                  {item.month}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Recent Transactions */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-800">
          Transactions
        </h2>

        <div className="space-y-4 mt-6">
          {transactions.map((transaction, index) => (
            <div
              key={index}
              className="p-4 rounded-2xl bg-slate-50"
            >
              <h3 className="font-semibold text-slate-800">
                {transaction.patient}
              </h3>

              <p className="text-sm text-slate-500 mt-1">
                {transaction.type}
              </p>

              <div className="flex justify-between mt-3">
                <span className="font-semibold text-purple-600">
                  {transaction.amount}
                </span>

                <span className="text-sm text-slate-400">
                  {transaction.date}
                </span>
              </div>
            </div>
          ))}
        </div>

        <button className="w-full mt-6 py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-medium">
          Withdraw Earnings
        </button>
      </div>
    </section>
  );
}
