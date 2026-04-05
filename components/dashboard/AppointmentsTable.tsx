'use client';

const appointments = [
  {
    id: '#APT001',
    patient: 'Priya Sharma',
    age: 24,
    type: 'PCOD Consultation',
    time: '10:00 AM',
    date: 'Today',
    amount: '₹799',
    status: 'Confirmed',
  },
  {
    id: '#APT002',
    patient: 'Ananya Patel',
    age: 28,
    type: 'Follow-up',
    time: '11:30 AM',
    date: 'Today',
    amount: '₹499',
    status: 'Completed',
  },
  {
    id: '#APT003',
    patient: 'Riya Verma',
    age: 22,
    type: 'Diet Session',
    time: '2:00 PM',
    date: 'Today',
    amount: '₹699',
    status: 'Pending',
  },
  {
    id: '#APT004',
    patient: 'Kavya Singh',
    age: 26,
    type: 'Hormone Review',
    time: '4:00 PM',
    date: 'Tomorrow',
    amount: '₹999',
    status: 'Confirmed',
  },
];

function getStatusStyle(status: string) {
  switch (status) {
    case 'Confirmed':
      return 'bg-blue-100 text-blue-600';
    case 'Completed':
      return 'bg-green-100 text-green-600';
    case 'Pending':
      return 'bg-yellow-100 text-yellow-600';
    default:
      return 'bg-slate-100 text-slate-600';
  }
}

export default function AppointmentsTable() {
  return (
    <section className="mt-8 bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            Today’s Appointments
          </h2>
          <p className="text-slate-500 mt-1">
            Manage upcoming and completed sessions
          </p>
        </div>

        <button className="px-5 py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-medium">
          View All
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left border-b border-slate-100">
              <th className="pb-4 text-slate-500 font-medium">Patient</th>
              <th className="pb-4 text-slate-500 font-medium">Type</th>
              <th className="pb-4 text-slate-500 font-medium">Time</th>
              <th className="pb-4 text-slate-500 font-medium">Fee</th>
              <th className="pb-4 text-slate-500 font-medium">Status</th>
              <th className="pb-4 text-slate-500 font-medium">Action</th>
            </tr>
          </thead>

          <tbody>
            {appointments.map((appointment) => (
              <tr
                key={appointment.id}
                className="border-b border-slate-50 hover:bg-slate-50 transition"
              >
                <td className="py-5">
                  <div>
                    <p className="font-semibold text-slate-800">
                      {appointment.patient}
                    </p>
                    <p className="text-sm text-slate-500">
                      {appointment.age} years • {appointment.id}
                    </p>
                  </div>
                </td>

                <td className="py-5 text-slate-600">
                  {appointment.type}
                </td>

                <td className="py-5 text-slate-600">
                  {appointment.date} • {appointment.time}
                </td>

                <td className="py-5 font-semibold text-slate-800">
                  {appointment.amount}
                </td>

                <td className="py-5">
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusStyle(
                      appointment.status
                    )}`}
                  >
                    {appointment.status}
                  </span>
                </td>

                <td className="py-5">
                  <button className="px-4 py-2 rounded-xl bg-slate-900 text-white text-sm">
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
