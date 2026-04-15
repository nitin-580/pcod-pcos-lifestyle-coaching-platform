interface Props {
  time: string;
}

export default function Appointment({ time }: Props) {
  return (
    <div className="bg-white rounded-3xl p-6 border border-purple-100 shadow-lg">
      <p className="text-sm text-slate-500 uppercase tracking-wide">
        Upcoming Appointment
      </p>

      <h2 className="text-2xl font-semibold text-slate-900 mt-3">
        {time}
      </h2>

      <p className="text-sm text-slate-500 mt-2">
        Coach consultation scheduled
      </p>
    </div>
  );
}