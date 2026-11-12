import React from 'react';
import { Phone, Mail, Clock, Calendar, UserCheck } from 'lucide-react';
import { usePortal } from '../../context/PortalContext';

export const LeadershipSection: React.FC = () => {
  const { leaders } = usePortal();

  return (
    <section id="bolim-haqida" className="py-12 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs uppercase tracking-wider font-semibold text-sky-800">
            Bölim tuzilmasi
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
            Bölim rahbariyati va fuqarolarni qabul qiliş jadvali
          </h2>
          <p className="text-slate-600 text-sm mt-2">
            Qöşköpir tumani maktabgaça va maktab ta'limi bölimi mas'ul rahbarlari
          </p>
        </div>

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
      </div>
    </section>
  );
};
