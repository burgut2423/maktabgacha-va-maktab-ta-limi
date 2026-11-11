import React, { useState } from 'react';
import { FileText, Download, Search, ExternalLink, Calendar, ShieldCheck } from 'lucide-react';
import { usePortal } from '../../context/PortalContext';
import { DocumentItem } from '../../types';

export const DocumentsSection: React.FC = () => {
  const { documents } = usePortal();
  const [selectedCategory, setSelectedCategory] = useState<string>('Barchasi');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    'Barchasi',
    'Bo\'lim buyruqlari',
    'Vazirlik buyruqlari',
    'Hokim qarorlari',
    'Nizom va qoidalar'
  ];

  const filteredDocs = documents.filter(doc => {
    const matchesCategory = selectedCategory === 'Barchasi' || doc.category === selectedCategory;
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.docNumber.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="hujjatlar" className="py-12 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-sky-800">
              Qonunchilik bazasi
            </span>
            <h2 className="text-2xl font-bold text-slate-900 mt-1">
              Me'yoriy-huquqiy hujjatlar va buyruqlar
            </h2>
            <p className="text-slate-600 text-sm mt-1">
              Vazirlik qarorlari, tuman hokimi qarorlari hamda bo'limning rasmiy buyruqlari
            </p>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-sky-800 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Search */}
        <div className="mb-6 max-w-md">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Hujjat nomi yoki raqami bo'yicha qidiruv..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-sky-600"
            />
          </div>
        </div>

        {/* Documents Table/List */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="divide-y divide-slate-200">
            {filteredDocs.map(doc => (
              <div
                key={doc.id}
                className="p-4 sm:p-5 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-lg bg-sky-50 text-sky-700 border border-sky-100 flex items-center justify-center shrink-0 mt-0.5">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-xs text-sky-800 font-semibold mb-1">
                      <span>{doc.category}</span>
                      <span>·</span>
                      <span className="font-mono text-slate-500">{doc.docNumber}</span>
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug mb-1">
                      {doc.title}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{doc.date}</span>
                      </span>
                      <span>·</span>
                      <span>Hajmi: {doc.fileSize}</span>
                      <span>·</span>
                      <span className="uppercase font-semibold text-slate-600">{doc.fileType}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 sm:self-center">
                  <a
                    href={doc.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-4 py-2 bg-sky-800 hover:bg-sky-900 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Yuklab olish</span>
                  </a>
                </div>
              </div>
            ))}
          </div>

          {filteredDocs.length === 0 && (
            <div className="text-center py-12 text-slate-500 text-sm">
              Qidiruv bo'yicha hech qanday me'yoriy hujjat topilmadi.
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
