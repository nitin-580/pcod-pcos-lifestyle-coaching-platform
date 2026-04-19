'use client';

function getStatusStyle(status: string) {
  switch (status.toLowerCase()) {
    case 'confirmed':
    case 'scheduled':
    case 'approved':
      return 'bg-blue-100 text-blue-600';
    case 'completed':
      return 'bg-green-100 text-green-600';
    case 'pending':
      return 'bg-yellow-100 text-yellow-600';
    case 'cancelled':
    case 'rejected':
      return 'bg-red-100 text-red-600';
    default:
      return 'bg-slate-100 text-slate-600';
  }
}

export default function AppointmentsTable({ appointments = [] }: { appointments?: any[] }) {
  return (
    <section className="mt-8 bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            Appointments
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
              <th className="pb-4 text-slate-500 font-medium">Date</th>
              <th className="pb-4 text-slate-500 font-medium">Status</th>
              <th className="pb-4 text-slate-500 font-medium">Action</th>
            </tr>
          </thead>

          <tbody>
            {appointments.length > 0 ? appointments.map((appointment) => (
              <tr
                key={appointment.id}
                className="border-b border-slate-50 hover:bg-slate-50 transition"
              >
                <td className="py-5">
                  <div>
                    <p className="font-semibold text-slate-800">
                      {appointment.patientName || 'Anonymous'}
                    </p>
                    <p className="text-sm text-slate-500">
                      {appointment.patientEmail || appointment.id}
                    </p>
                  </div>
                </td>

                <td className="py-5 text-slate-600">
                  {new Date(appointment.appointmentDate).toLocaleDateString()} • {new Date(appointment.appointmentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
            )) : (
              <tr>
                <td colSpan={4} className="py-10 text-center text-slate-400">
                  No appointments found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
