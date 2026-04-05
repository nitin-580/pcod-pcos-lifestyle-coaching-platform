'use client';

const patientRecords = [
  {
    name: 'Priya Sharma',
    age: 24,
    condition: 'PCOD Consultation',
    lastVisit: '02 Apr 2026',
    status: 'Follow-up Due',
  },
  {
    name: 'Riya Verma',
    age: 22,
    condition: 'Diet Review',
    lastVisit: '30 Mar 2026',
    status: 'Stable',
  },
  {
    name: 'Ananya Patel',
    age: 28,
    condition: 'Hormonal Imbalance',
    lastVisit: '28 Mar 2026',
    status: 'Under Treatment',
  },
  {
    name: 'Kavya Singh',
    age: 26,
    condition: 'Fertility Consultation',
    lastVisit: '25 Mar 2026',
    status: 'Improving',
  },
];

function getStatusColor(status: string) {
  switch (status) {
    case 'Stable':
      return 'bg-green-100 text-green-600';
    case 'Follow-up Due':
      return 'bg-yellow-100 text-yellow-600';
    case 'Under Treatment':
      return 'bg-pink-100 text-pink-600';
    case 'Improving':
      return 'bg-purple-100 text-purple-600';
    default:
      return 'bg-slate-100 text-slate-600';
  }
}

export default function PatientHistory({ patients }: { patients?: any[] }) {
  // Use real patients from backend if available, otherwise fallback to template data
  const displayPatients = patients && patients.length > 0 ? patients.map(p => ({
    name: p.name,
    age: p.age || 24, // Fallback age
    condition: p.condition || 'General Consultation',
    lastVisit: p.lastVisit ? new Date(p.lastVisit).toLocaleDateString() : 'N/A',
    status: p.status || 'Active'
  })) : patientRecords;

  return (
    <section className="mt-8 bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
             Patients from Referrals
          </h2>
          <p className="text-slate-500 mt-1">
            Referred patients using your unique doctor code
          </p>
        </div>

        <button className="text-purple-600 font-medium hover:underline">
          View All Records
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100 text-left">
              <th className="pb-4 text-slate-500 font-medium">Patient</th>
              <th className="pb-4 text-slate-500 font-medium">Condition</th>
              <th className="pb-4 text-slate-500 font-medium">Last Visit</th>
              <th className="pb-4 text-slate-500 font-medium">Status</th>
              <th className="pb-4 text-slate-500 font-medium">Action</th>
            </tr>
          </thead>

          <tbody>
            {displayPatients.map((patient, index) => (
              <tr
                key={index}
                className="border-b border-slate-50 hover:bg-slate-50 transition"
              >
                <td className="py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center font-bold">
                      {patient.name[0]}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">
                        {patient.name}
                      </p>
                      <p className="text-sm text-slate-500">
                        {patient.age} years
                      </p>
                    </div>
                  </div>
                </td>

                <td className="py-5 text-slate-600">
                  {patient.condition}
                </td>

                <td className="py-5 text-slate-600">
                  {patient.lastVisit}
                </td>

                <td className="py-5">
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(
                      patient.status
                    )}`}
                  >
                    {patient.status}
                  </span>
                </td>

                <td className="py-5">
                  <button className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-sm hover:bg-slate-900 hover:text-white transition-colors">
                    View Profile
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {displayPatients.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-slate-400">No patients found via referral code yet.</p>
          </div>
        )}
      </div>
    </section>
  );
}
