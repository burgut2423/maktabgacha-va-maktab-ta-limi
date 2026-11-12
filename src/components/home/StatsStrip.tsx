import React from 'react';
import { School, Baby, Users, Award, BookCheck, GraduationCap } from 'lucide-react';
import { usePortal } from '../../context/PortalContext';

export const StatsStrip: React.FC = () => {
  const { settings } = usePortal();

  const stats = [
    {
      label: "Umumta'lim maktablari",
      value: settings.schoolsCount,
      suffix: " ta",
      sub: "Barça mahallalarda",
      icon: School,
      color: "text-blue-600 bg-blue-50"
    },
    {
      label: "Maktabgaça taşkilotlar (MTT)",
      value: settings.mttsCount,
      suffix: " ta",
      sub: "Davlat va xususiy boğçalar",
      icon: Baby,
      color: "text-emerald-600 bg-emerald-50"
    },
    {
      label: "Öquvçi yoşlar",
      value: settings.studentsTotal.toLocaleString(),
      suffix: "+",
      sub: "1-11-sinf öquvçilari",
      icon: GraduationCap,
      color: "text-purple-600 bg-purple-50"
    },
    {
      label: "Pedagog xodimlar",
      value: settings.teachersTotal.toLocaleString(),
      suffix: "+",
      sub: "Fidoiy ustozlar jamoasi",
      icon: Users,
      color: "text-amber-600 bg-amber-50"
    },
    {
      label: "Oliy toifali öqituvçilar",
      value: settings.higherCategoryTeachersCount.toLocaleString(),
      suffix: "+",
      sub: "Attestatsiya natijalari",
      icon: BookCheck,
      color: "text-teal-600 bg-teal-50"
    },
    {
      label: "Olimpiada sovrindorlari",
      value: 142,
      suffix: "+",
      sub: "2026-yilgi fan bellaşuvlari",
      icon: Award,
      color: "text-rose-600 bg-rose-50"
    }
  ];

  return (
    <section className="bg-white py-10 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-xs uppercase tracking-wider font-semibold text-sky-800">
            Raqamlarda tuman ta'limi
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
            Qöşköpir tumani ta'lim tizimining asosiy körsatkiçlari
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {stats.map((st, idx) => {
            const Icon = st.icon;
            return (
              <div
                key={idx}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:shadow-sm transition-all"
              >
                <div className={`w-8 h-8 rounded-lg ${st.color} flex items-center justify-center mb-2.5`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="text-2xl font-extrabold text-slate-900 tabular-nums">
                  {st.value}{st.suffix}
                </div>
                <div className="text-xs font-semibold text-slate-800 mt-1 line-clamp-1">
                  {st.label}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  {st.sub}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
