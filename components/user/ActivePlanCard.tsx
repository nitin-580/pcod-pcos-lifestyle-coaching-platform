interface Props {
  plan: string;
}

export default function ActivePlanCard({ plan }: Props) {
  return (
    <div className="bg-white rounded-3xl p-6 border border-pink-100 shadow-lg">
      <p className="text-sm text-slate-500 uppercase tracking-wide">
        Active Plan
      </p>

      <h2 className="text-2xl font-semibold text-slate-900 mt-3">
        {plan}
      </h2>

      <p className="text-sm text-slate-500 mt-2">
        Your personalized wellness roadmap is active
      </p>
    </div>
  );
}