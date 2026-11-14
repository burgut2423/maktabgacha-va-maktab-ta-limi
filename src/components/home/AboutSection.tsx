import React, { useState } from 'react';
import {
  Users,
  Building2,
  FileCheck2,
  Calendar,
  Clock,
  Phone,
  Mail,
  CheckCircle2,
  BookOpen,
  Edit3
} from 'lucide-react';
import { usePortal } from '../../context/PortalContext';
import { checkAdminSession } from '../../services/adminAuth';

interface AboutSectionProps {
  onEditAbout?: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onEditAbout }) => {
  const { settings, leaders, t } = usePortal();
  const [activeTab, setActiveTab] = useState<'rahbariyat' | 'tuzilma' | 'vazifalar' | 'tarix'>('rahbariyat');
  const isAdminLoggedIn = checkAdminSession();

  return (
    <section id="bolim-haqida" className="py-12 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 relative">
          <div className="flex items-center justify-center gap-2">
            <span className="text-xs uppercase tracking-wider font-semibold text-sky-800">
              {t(settings.aboutKicker || "Tashkilot faoliyati")}
            </span>
            {isAdminLoggedIn && onEditAbout && (
              <button
                type="button"
                onClick={onEditAbout}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 text-[11px] font-semibold transition-colors cursor-pointer"
                title={t("Admin panel orqali ushbu bo'limni tahrirlash")}
              >
                <Edit3 className="w-3 h-3" />
                <span>{t("Tahrirlash")}</span>
              </button>
            )}
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
            {t(settings.aboutTitle || settings.districtName)}
          </h2>
          <p className="text-slate-600 text-sm mt-2 leading-relaxed">
            {t(settings.departmentMission)}
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center justify-center gap-2 mb-8 border-b border-slate-200 pb-3 overflow-x-auto">
          {[
            { id: 'rahbariyat', label: `${t(settings.aboutTabLeadersLabel || "Tashkilot rahbariyati")} (${leaders.length})`, icon: Users },
            { id: 'tuzilma', label: `${t(settings.aboutTabStructureLabel || "Tashkiliy tuzilma va bo'linmalar")} (${settings.branches?.length || 0})`, icon: Building2 },
            { id: 'vazifalar', label: t(settings.aboutTabTasksLabel || "Asosiy vazifa va funksiyalar"), icon: FileCheck2 },
            { id: 'tarix', label: t(settings.aboutTabHistoryLabel || "Tashkilot tarixi va me'yoriy asos"), icon: BookOpen },
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'bg-sky-800 text-white shadow-xs'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: RAHBARIYAT */}
        {activeTab === 'rahbariyat' && (
          <div className="w3-animate-bottom grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {leaders.map(lead => (
              <div
                key={lead.id}
                className="bg-slate-50/70 rounded-2xl border border-slate-200 p-6 flex flex-col justify-between hover:border-sky-500 hover:bg-white hover:shadow-md transition-all group"
              >
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-slate-200 border-2 border-sky-700 shrink-0">
                      <img
                        src={lead.photoUrl}
                        alt={t(lead.name)}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div>
                      <span className="text-[11px] font-semibold text-sky-800 uppercase tracking-wider block">
                        {t(lead.department)}
                      </span>
                      <h3 className="text-base font-bold text-slate-900 leading-snug">
                        {t(lead.name)}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium">
                        {t(lead.position)}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-3 mb-4 leading-relaxed italic">
                    "{t(lead.bio)}"
                  </p>

                  <div className="space-y-2 text-xs text-slate-700 bg-white p-3.5 rounded-xl border border-slate-200 mb-4">
                    <div className="flex items-start gap-2">
                      <Calendar className="w-3.5 h-3.5 text-sky-700 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-slate-900">{t("Qabul kunlari")}:</strong> {t(lead.receptionDays)}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-sky-700 shrink-0" />
                      <div>
                        <strong className="text-slate-900">{t("Qabul vaqti")}:</strong> {t(lead.receptionHours)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
                  <a
                    href={`tel:${lead.phone.replace(/\D/g, '')}`}
                    className="flex items-center gap-1.5 text-sky-800 font-semibold hover:underline"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>{lead.phone}</span>
                  </a>
                  <a
                    href={`mailto:${lead.email}`}
                    className="flex items-center gap-1 text-slate-500 hover:text-slate-800"
                    title={lead.email}
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{t("Pochta")}</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 2: TASHKILIY TUZILMA VA BO'LINMALAR */}
        {activeTab === 'tuzilma' && (
          <div className="w3-animate-bottom space-y-4 max-w-4xl mx-auto">
            {settings.aboutStructureNote && (
              <div className="bg-sky-50 border border-sky-200 rounded-xl p-4 text-xs text-sky-900 mb-4">
                <strong>{t("Eslatma")}:</strong> {t(settings.aboutStructureNote)}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(settings.branches || []).map(branch => (
                <div
                  key={branch.id}
                  className="bg-slate-50 p-5 rounded-xl border border-slate-200 hover:border-sky-400 hover:bg-white transition-all shadow-2xs"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-sm font-bold text-slate-900 leading-snug">
                      {t(branch.name)}
                    </h3>
                    <span className="text-[11px] font-semibold bg-sky-100 text-sky-800 px-2 py-0.5 rounded shrink-0">
                      {branch.staffCount} {t("nafar xodim")}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                    {t(branch.description)}
                  </p>

                  <div className="pt-2 border-t border-slate-200 text-xs flex flex-wrap items-center justify-between gap-2 text-slate-700">
                    <div>
                      <span className="text-slate-500">{t(settings.aboutHeadRoleLabel || "Bo'linma rahbari")}: </span>
                      <strong className="text-slate-900">{t(branch.head)}</strong>
                    </div>
                    <a
                      href={`tel:${branch.phone.replace(/\D/g, '')}`}
                      className="text-sky-800 font-semibold hover:underline flex items-center gap-1"
                    >
                      <Phone className="w-3 h-3" />
                      <span>{branch.phone}</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: ASOSIY VAZIFALAR */}
        {activeTab === 'vazifalar' && (
          <div className="w3-animate-bottom max-w-4xl mx-auto bg-slate-50 rounded-2xl border border-slate-200 p-6 sm:p-8">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-sky-700" />
              <span>{t(settings.aboutTasksTitle || "Tashkilotning asosiy vazifa va faoliyat yo'nalishlari")}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(settings.tasksList || []).map((task, idx) => (
                <div
                  key={idx}
                  className="p-3.5 bg-white rounded-xl border border-slate-200 text-xs text-slate-700 flex items-start gap-2.5 shadow-2xs"
                >
                  <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-800 font-bold flex items-center justify-center shrink-0 text-[11px]">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{t(task)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: TASHKILOT TARIXI VA NIZOMI */}
        {activeTab === 'tarix' && (
          <div className="w3-animate-bottom max-w-4xl mx-auto bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5">
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                {t(settings.aboutHistoryTitle || "Tarixiy ma'lumot va rivojlanish bosqichlari")}
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                {t(settings.departmentHistory)}
              </p>
            </div>

            <div className="p-4 bg-sky-50 rounded-xl border border-sky-100 text-xs text-sky-950">
              <strong className="block mb-1">{t(settings.aboutCharterLabel || "Nizom va huquqiy asos")}:</strong>
              <p>{t(settings.departmentCharter)}</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
