import React, { useState } from 'react';
import { School, Baby, Search, Phone, MapPin, Users, Award, ExternalLink, X, Building2, RefreshCw, Database } from 'lucide-react';
import { usePortal } from '../../context/PortalContext';
import { Organization } from '../../types';

export const OrganizationsDirectory: React.FC = () => {
  const { organizations, googleSyncStatus, refreshDataFromSheets } = usePortal();
  const [filterType, setFilterType] = useState<'all' | 'maktab' | 'mtt' | 'ixtisos'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const filteredOrgs = organizations.filter(org => {
    const matchesType = filterType === 'all' || org.type === filterType;
    const matchesSearch =
      org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      org.number.toString().includes(searchQuery) ||
      org.mahalla.toLowerCase().includes(searchQuery.toLowerCase()) ||
      org.director.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <section id="muassasalar" className="py-12 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-sky-800">
              Ta'lim muassasalari tarmog'i
            </span>
            <h2 className="text-2xl font-bold text-slate-900 mt-1">
              Maktablar va Maktabgacha ta'lim tashkilotlari (MTT)
            </h2>
            <p className="text-slate-600 text-sm mt-1">
              Qo'shko'pir tumanidagi barcha ta'lim maskanlari ma'lumotlari, manzillari va rahbarlari
            </p>
          </div>

          {/* Type Filter Buttons */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                filterType === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Barchasi ({organizations.length})
            </button>
            <button
              onClick={() => setFilterType('maktab')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                filterType === 'maktab' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Maktablar ({organizations.filter(o => o.type === 'maktab').length})
            </button>
            <button
              onClick={() => setFilterType('mtt')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                filterType === 'mtt' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Bog'chalar - MTT ({organizations.filter(o => o.type === 'mtt').length})
            </button>
            <button
              onClick={() => setFilterType('ixtisos')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                filterType === 'ixtisos' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Ixtisoslashgan ({organizations.filter(o => o.type === 'ixtisos').length})
            </button>
          </div>
        </div>

        {/* Search Bar & Live Sheets Sync Button */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative w-full max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Raqam, mahalla yoki direktor bo'yicha qidirish..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-sky-600 focus:bg-white"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
              >
                Tozalash
              </button>
            )}
          </div>

          {/* Live Sync with Google Sheets indicator & button */}
          <div className="flex items-center gap-2 shrink-0">
            {googleSyncStatus.lastSyncedAt && (
              <span className="hidden lg:inline text-[11px] text-slate-500 font-medium">
                Sinxronlangan: {googleSyncStatus.lastSyncedAt}
              </span>
            )}
            <button
              onClick={async () => {
                setIsRefreshing(true);
                try {
                  await refreshDataFromSheets();
                } finally {
                  setTimeout(() => setIsRefreshing(false), 600);
                }
              }}
              disabled={isRefreshing || googleSyncStatus.syncing}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold border border-emerald-200 transition-colors shadow-2xs cursor-pointer"
              title="Google Sheets bazasidagi o'zgarishlarni yuklab olish"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-emerald-600 ${isRefreshing || googleSyncStatus.syncing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing || googleSyncStatus.syncing ? "Yuklanmoqda..." : "Baza bilan yangilash"}</span>
            </button>
          </div>
        </div>

        {/* Organizations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOrgs.map(org => {
            const isSchool = org.type === 'maktab' || org.type === 'ixtisos';
            return (
              <div
                key={org.id}
                onClick={() => setSelectedOrg(org)}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-sky-500 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                      {isSchool ? <School className="w-4 h-4 text-blue-600" /> : <Baby className="w-4 h-4 text-emerald-600" />}
                      <span>{org.type === 'mtt' ? 'Maktabgacha tashkilot' : org.type === 'ixtisos' ? 'Ixtisoslashgan maktab' : 'Umumta\'lim maktabi'}</span>
                    </span>

                    <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded flex items-center gap-1">
                      <Award className="w-3 h-3" />
                      <span>{org.rating}</span>
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 group-hover:text-sky-700 transition-colors mb-2 leading-snug">
                    {org.name}
                  </h3>

                  <div className="space-y-1.5 text-xs text-slate-600 mb-4">
                    <div className="flex items-start gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span className="line-clamp-1">{org.address} ({org.mahalla})</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>Direktor: <strong className="font-semibold text-slate-800">{org.director}</strong></span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{org.phone}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="text-slate-500 font-medium">
                    {org.studentsCount} {isSchool ? "o'quvchi" : "tarbiyalanuvchi"} · {org.teachersCount} pedagog
                  </div>
                  <span className="text-sky-700 font-semibold group-hover:underline">
                    Batafsil
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {filteredOrgs.length === 0 && (
          <div className="text-center py-12 bg-slate-50 rounded-xl border border-slate-200">
            <p className="text-sm text-slate-500">So'rovingizga mos muassasa topilmadi.</p>
          </div>
        )}
      </div>

      {/* Modal details */}
      {selectedOrg && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setSelectedOrg(null)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-xs font-semibold text-sky-800 mb-2">
              <Building2 className="w-4 h-4" />
              <span>{selectedOrg.type === 'mtt' ? 'Maktabgacha ta\'lim tashkiloti' : 'Umumta\'lim muassasasi'}</span>
            </div>

            <h2 className="text-lg font-bold text-slate-900 mb-4 leading-snug">
              {selectedOrg.name}
            </h2>

            <div className="space-y-3 text-sm text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-200 mb-5">
              <div>
                <span className="text-xs text-slate-500 block">Rahbar (Direktor):</span>
                <span className="font-semibold text-slate-900">{selectedOrg.director}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-xs text-slate-500 block">Telefon:</span>
                  <a href={`tel:${selectedOrg.phone.replace(/\D/g, '')}`} className="text-sky-700 font-medium hover:underline">
                    {selectedOrg.phone}
                  </a>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block">Elektron pochta:</span>
                  <span className="text-slate-800 text-xs">{selectedOrg.email}</span>
                </div>
              </div>
              <div>
                <span className="text-xs text-slate-500 block">Manzil:</span>
                <span>{selectedOrg.address}, {selectedOrg.mahalla}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200 text-center">
                <div>
                  <span className="text-xs text-slate-500 block">Sig'im:</span>
                  <span className="font-bold text-slate-900">{selectedOrg.studentsCount} nafar</span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block">O'qituvchilar:</span>
                  <span className="font-bold text-slate-900">{selectedOrg.teachersCount} nafar</span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block">Smena:</span>
                  <span className="font-bold text-slate-900">{selectedOrg.shifts}-smena</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setSelectedOrg(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg"
              >
                Yopish
              </button>
              <a
                href={`tel:${selectedOrg.phone.replace(/\D/g, '')}`}
                className="px-4 py-2 text-xs font-semibold text-white bg-sky-800 hover:bg-sky-900 rounded-lg flex items-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Qo'ng'iroq qilish</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
