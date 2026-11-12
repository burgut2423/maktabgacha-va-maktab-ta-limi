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
  ChevronRight
} from 'lucide-react';
import { usePortal } from '../../context/PortalContext';

export const AboutSection: React.FC = () => {
  const { settings, leaders } = usePortal();
  const [activeTab, setActiveTab] = useState<'rahbariyat' | 'tuzilma' | 'vazifalar' | 'tarix'>('rahbariyat');

  return (
    <section id="bolim-haqida" className="py-12 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <span className="text-xs uppercase tracking-wider font-semibold text-sky-800">
            Bölim faoliyati
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
            Qöşköpir tuman ta'lim bölimi haqida
          </h2>
          <p className="text-slate-600 text-sm mt-2 leading-relaxed">
            {settings.departmentMission || "Tumanda ta'lim sifatini oşiriş, barkamol va ma'rifatli yoşlarni tarbiyalaş böyiça taşkiliy tizim"}
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center justify-center gap-2 mb-8 border-b border-slate-200 pb-3 overflow-x-auto">
          {[
            { id: 'rahbariyat', label: `Bölim rahbariyati (${leaders.length})`, icon: Users },
            { id: 'tuzilma', label: `Taşkiliy tuzilma va şöbalar (${settings.branches?.length || 0})`, icon: Building2 },
            { id: 'vazifalar', label: "Asosiy vazifa va funksiyalar", icon: FileCheck2 },
            { id: 'tarix', label: "Bölim tarixi va me'yoriy asos", icon: BookOpen },
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                        alt={lead.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div>
                      <span className="text-[11px] font-semibold text-sky-800 uppercase tracking-wider block">
                        {lead.department}
                      </span>
                      <h3 className="text-base font-bold text-slate-900 leading-snug">
                        {lead.name}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium">
                        {lead.position}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-3 mb-4 leading-relaxed italic">
                    "{lead.bio}"
                  </p>

                  <div className="space-y-2 text-xs text-slate-700 bg-white p-3.5 rounded-xl border border-slate-200 mb-4">
                    <div className="flex items-start gap-2">
                      <Calendar className="w-3.5 h-3.5 text-sky-700 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-slate-900">Qabul kunlari:</strong> {lead.receptionDays}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-sky-700 shrink-0" />
                      <div>
                        <strong className="text-slate-900">Qabul vaqti:</strong> {lead.receptionHours}
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
                    <span className="hidden sm:inline">Poçta</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 2: TASHKILIY TUZILMA VA SHO'BALAR */}
        {activeTab === 'tuzilma' && (
          <div className="space-y-4 max-w-4xl mx-auto">
            <div className="bg-sky-50 border border-sky-200 rounded-xl p-4 text-xs text-sky-900 mb-4">
              <strong>Eslatma:</strong> Bölim tuzilmasi Özbekiston Respublikasi Maktabgaça va maktab ta'limi vazirligi namunaviy ştat jadvaliga asosan tasdiqlangan. Barça şöbalar va ularning mas'ullari admin panel orqali töldirib boriladi.
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(settings.branches || []).map(branch => (
                <div
                  key={branch.id}
                  className="bg-slate-50 p-5 rounded-xl border border-slate-200 hover:border-sky-400 hover:bg-white transition-all shadow-2xs"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-sm font-bold text-slate-900 leading-snug">
                      {branch.name}
                    </h3>
                    <span className="text-[11px] font-semibold bg-sky-100 text-sky-800 px-2 py-0.5 rounded shrink-0">
                      {branch.staffCount} nafar xodim
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                    {branch.description}
                  </p>

                  <div className="pt-2 border-t border-slate-200 text-xs flex flex-wrap items-center justify-between gap-2 text-slate-700">
                    <div>
                      <span className="text-slate-500">Şöba mudiri: </span>
                      <strong className="text-slate-900">{branch.head}</strong>
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
          <div className="max-w-4xl mx-auto bg-slate-50 rounded-2xl border border-slate-200 p-6 sm:p-8">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-sky-700" />
              <span>Bölimning qonunçilik bilan belgilangan asosiy vazifalari</span>
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
                  <span className="leading-relaxed">{task}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: BO'LIM TARIXI */}
        {activeTab === 'tarix' && (
          <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5">
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Tarixiy ma'lumot va rivojlaniş bosqiçlari
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                {settings.departmentHistory}
              </p>
            </div>

            <div className="p-4 bg-sky-50 rounded-xl border border-sky-100 text-xs text-sky-950">
              <strong className="block mb-1">Me'yoriy huquqiy asos:</strong>
              <p>{settings.departmentCharter}</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
