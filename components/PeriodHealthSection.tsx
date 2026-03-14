import { Activity, HeartPulse, Moon, CalendarDays } from "lucide-react";

export default function PeriodHealthSection() {
  return (
    <section className="w-full py-24 bg-white">
        <h1>H</h1>
      <div className="max-w-7xl mx-auto grid grid-cols-3 items-center gap-12">

        {/* Left Side */}
        <div className="space-y-8">

          <div className="group bg-white/80 backdrop-blur p-6 rounded-2xl border border-pink-100 shadow-md hover:shadow-xl transition">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-pink-100 text-pink-600">
                <CalendarDays size={22} />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-gray-800">
                  Cycle Tracking
                </h3>
                <p className="text-gray-600 text-sm mt-1">
                  Understand your menstrual rhythm and predict upcoming cycles
                  with better accuracy.
                </p>
              </div>
            </div>
          </div>

          <div className="group bg-white/80 backdrop-blur p-6 rounded-2xl border border-pink-100 shadow-md hover:shadow-xl transition">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-pink-100 text-pink-600">
                <HeartPulse size={22} />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-gray-800">
                  Hormonal Balance
                </h3>
                <p className="text-gray-600 text-sm mt-1">
                  Track hormonal changes that affect mood, energy levels and
                  reproductive health.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Center Image */}
        <div className="flex justify-center relative">
          <img
            src="/woman-health.png"
            alt="Women's health"
            className="w-[380px] drop-shadow-2xl"
          />

          {/* Soft Glow */}
          <div className="absolute -z-10 w-[420px] h-[420px] bg-pink-200 rounded-full blur-3xl opacity-30"></div>
        </div>

        {/* Right Side */}
        <div className="space-y-8">

          <div className="group bg-white/80 backdrop-blur p-6 rounded-2xl border border-pink-100 shadow-md hover:shadow-xl transition">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-pink-100 text-pink-600">
                <Activity size={22} />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-gray-800">
                  Health Monitoring
                </h3>
                <p className="text-gray-600 text-sm mt-1">
                  Monitor symptoms like cramps, fatigue, and irregular cycles
                  to detect early health changes.
                </p>
              </div>
            </div>
          </div>

          <div className="group bg-white/80 backdrop-blur p-6 rounded-2xl border border-pink-100 shadow-md hover:shadow-xl transition">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-pink-100 text-pink-600">
                <Moon size={22} />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-gray-800">
                  Lifestyle Impact
                </h3>
                <p className="text-gray-600 text-sm mt-1">
                  Sleep, nutrition and stress directly influence menstrual
                  health and hormonal balance.
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}