'use client';

import Link from 'next/link';
import { usePathname, useParams, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  CalendarDays,
  Wallet,
  History,
  Users,
  Clock3,
  UserCircle2,
  LogOut,
  Stethoscope,
} from 'lucide-react';

export default function DoctorSidebar({ doctorName, profilePicture }: { doctorName?: string, profilePicture?: string }) {
  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();

  const doctorId = params?.id as string;

  const handleLogout = () => {
    localStorage.removeItem('doctorToken');
    localStorage.removeItem('doctorData');
    router.push('/login');
  };

  const menuItems = [
    {
      title: 'Dashboard',
      href: `/doctor/${doctorId}/dashboard`,
      icon: LayoutDashboard,
    },
    {
      title: 'Appointments',
      href: `/doctor/${doctorId}/appointments`,
      icon: CalendarDays,
    },
    {
      title: 'Earnings',
      href: `/doctor/${doctorId}/earnings`,
      icon: Wallet,
    },
    {
      title: 'Sessions',
      href: `/doctor/${doctorId}/sessions`,
      icon: Clock3,
    },
    {
      title: 'Patients',
      href: `/doctor/${doctorId}/patients`,
      icon: Users,
    },
    {
      title: 'History',
      href: `/doctor/${doctorId}/history`,
      icon: History,
    },
    {
      title: 'Profile',
      href: `/doctor/${doctorId}/profile`,
      icon: UserCircle2,
    },
  ];

  return (
    <aside className="w-72 min-h-screen bg-white border-r border-slate-100 flex flex-col justify-between px-6 py-8">
      {/* Logo */}
      <div>
        <div className="flex items-center gap-3 mb-10">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center text-white">
            <Stethoscope size={22} />
          </div>

          <div>
            <h2 className="font-bold text-xl text-slate-800">
              WombCare
            </h2>
            <p className="text-sm text-slate-500">
              Doctor Panel
            </p>
          </div>
        </div>

        {/* Menu */}
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.title}
                href={item.href}
                className={`flex items-center gap-4 px-4 py-4 rounded-2xl transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">
                  {item.title}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Doctor Profile */}
      <div className="bg-slate-50 rounded-3xl p-5 border border-slate-100">
        <div className="flex items-center gap-3">
          {profilePicture ? (
            <img src={profilePicture} className="w-12 h-12 rounded-full object-cover" alt="Profile" />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white flex items-center justify-center font-bold">
              {doctorName?.[0] || 'D'}
            </div>
          )}

          <div className="overflow-hidden">
            <h3 className="font-semibold text-slate-800 truncate">
              {doctorName || 'Dr. Sarah'}
            </h3>
            <p className="text-xs text-slate-500 truncate">
              Doctor Account
            </p>
          </div>
        </div>

        <button 
          onClick={handleLogout}
          className="mt-5 w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 transition shadow-sm"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}

