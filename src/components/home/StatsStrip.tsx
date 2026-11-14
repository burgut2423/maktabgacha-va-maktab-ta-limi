import React from 'react';
import { School, Baby, Users, Award, BookCheck, GraduationCap, Building2, Star } from 'lucide-react';
import { usePortal } from '../../context/PortalContext';
import { StatCardItem } from '../../types';

const STAT_ICON_MAP: Record<StatCardItem['icon'], React.ComponentType<{ className?: string }>> = {
  school: School,
  baby: Baby,
  graduation: GraduationCap,
  users: Users,
  book: BookCheck,
  award: Award,
  building: Building2,
  star: Star
};

export const StatsStrip: React.FC = () => {
  const { settings, t } = usePortal();

  const stats = settings.statsItems || [];
  if (stats.length === 0) return null;

  return (
    <section className="bg-white py-10 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-xs uppercase tracking-wider font-semibold text-sky-800">
            {t(settings.statsKicker || "Asosiy ko'rsatkichlar")}
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
            {t(settings.statsTitle || settings.districtName)}
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {stats.map((st, idx) => {
            const Icon = STAT_ICON_MAP[st.icon] || School;
            return (
              <div
                key={st.id || idx}
                style={{ animationDelay: `${idx * 50}ms` }}
                className="w3-animate-bottom p-4 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:shadow-sm hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className={`w-8 h-8 rounded-lg ${st.color || 'text-sky-700 bg-sky-50'} flex items-center justify-center mb-2.5`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="text-2xl font-extrabold text-slate-900 tabular-nums">
                  {st.value}{st.suffix}
                </div>
                <div className="text-xs font-semibold text-slate-800 mt-1 line-clamp-1">
                  {t(st.label)}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  {t(st.sub)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
