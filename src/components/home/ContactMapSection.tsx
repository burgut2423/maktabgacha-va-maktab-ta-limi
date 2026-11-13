import React from 'react';
import { MapPin, Phone, Mail, Clock, Send, Globe } from 'lucide-react';
import { usePortal } from '../../context/PortalContext';

export const ContactMapSection: React.FC = () => {
  const { settings, t } = usePortal();

  return (
    <section id="aloqa" className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs uppercase tracking-wider font-semibold text-sky-800">
            {t("Bog'lanish")}
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
            {t("Qo'shko'pir tumani MMTB bilan aloqa")}
          </h2>
          <p className="text-slate-600 text-sm mt-1">
            {t("Manzilimiz, qabulxona telefonlari va ijtimoiy tarmoqlardagi rasmiy sahifalarimiz")}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Contact Details */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-sky-100 text-sky-800 flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-slate-500 uppercase">{t("Bo'lim manzili:")}</h4>
                  <p className="text-sm font-semibold text-slate-900 mt-0.5 leading-snug">
                    {t(settings.address)}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">{t("Mo'ljal: Tuman hokimligi yaqinida")}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-3 border-t border-slate-200">
                <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-slate-500 uppercase">{t("Qabulxona va ishonch telefoni:")}</h4>
                  <div className="mt-1 space-y-1">
                    <div>
                      <span className="text-xs text-slate-600">{t("Umumiy qabulxona")}: </span>
                      <a href={`tel:${settings.departmentPhone.replace(/\D/g, '')}`} className="text-sm font-bold text-sky-800 hover:underline">
                        {settings.departmentPhone}
                      </a>
                    </div>
                    <div>
                      <span className="text-xs text-slate-600">{t("Ishonch telefoni")}: </span>
                      <a href={`tel:${settings.trustPhone.replace(/\D/g, '')}`} className="text-sm font-bold text-amber-700 hover:underline">
                        {settings.trustPhone}
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-3 border-t border-slate-200">
                <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center shrink-0 mt-0.5">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-slate-500 uppercase">{t("Elektron pochta:")}</h4>
                  <a href={`mailto:${settings.email}`} className="text-sm font-semibold text-sky-800 hover:underline">
                    {settings.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-3 border-t border-slate-200">
                <div className="w-9 h-9 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center shrink-0 mt-0.5">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-slate-500 uppercase">{t("Ish tartibi:")}</h4>
                  <p className="text-sm font-semibold text-slate-900 mt-0.5">
                    {t(settings.workingHours)}
                  </p>
                </div>
              </div>
            </div>

            {/* Social channels */}
            <div className="p-4 rounded-xl border border-slate-200 bg-white">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-3">
                {t("Rasmiy ijtimoiy tarmoqlar:")}
              </span>
              <div className="flex flex-wrap gap-2">
                <a
                  href={settings.telegramChannel}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 bg-sky-50 text-sky-800 hover:bg-sky-100 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors border border-sky-200"
                >
                  <Send className="w-3.5 h-3.5 text-sky-600" />
                  <span>{t("Telegram kanal")}</span>
                </a>
                <a
                  href={settings.facebookPage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 bg-blue-50 text-blue-800 hover:bg-blue-100 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors border border-blue-200"
                >
                  <Globe className="w-3.5 h-3.5 text-blue-600" />
                  <span>{t("Facebook sahifa")}</span>
                </a>
              </div>
            </div>
          </div>

          {/* District Visual Map Presentation */}
          <div className="lg:col-span-7 bg-slate-100 rounded-2xl border border-slate-200 overflow-hidden relative min-h-[360px] flex flex-col justify-between p-6">
            <div className="bg-white/95 backdrop-blur-xs p-4 rounded-xl shadow-xs max-w-sm border border-slate-200">
              <span className="text-[11px] font-bold uppercase tracking-wider text-sky-800 block mb-1">
                {t("Qo'shko'pir tumani markazi")}
              </span>
              <p className="text-xs text-slate-700 font-medium">
                {t("Bo'lim binosi Mustaqillik ko'chasida, markaziy istirohat bog'i va tuman tibbiyot birlashmasi ro'parasida joylashgan.")}
              </p>
            </div>

            <div className="bg-white/95 backdrop-blur-xs p-4 rounded-xl shadow-xs border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-900 block">{t("Jamoat transporti:")}</span>
                <span className="text-xs text-slate-600">{t("Urganch — Qo'shko'pir yo'nalishli mikroavtobuslari (\"Markaz\" bekati)")}</span>
              </div>
              <a
                href="https://yandex.uz/maps"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-sky-800 text-white rounded text-xs font-semibold hover:bg-sky-900 shrink-0 ml-3"
              >
                {t("Xaritada ko'rish")}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
