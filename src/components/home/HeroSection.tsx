import React from 'react';
import {
  GraduationCap,
  Baby,
  FileCheck2,
  Trophy,
  Send,
  BookOpen,
  ArrowRight,
  ExternalLink,
  MapPin
} from 'lucide-react';
import { usePortal } from '../../context/PortalContext';
import { NewsItem } from '../../types';
import { heroImage } from '../../assets/images';

interface HeroSectionProps {
  onSelectNews: (news: NewsItem) => void;
  onNavigate: (section: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onSelectNews, onNavigate }) => {
  const { news, settings, t } = usePortal();

  // Find pinned or most recent news
  const featuredNews = news.find(n => n.isPinned) || news[0];

  const quickServicesList = settings.quickServices && settings.quickServices.length > 0
    ? settings.quickServices
    : [
        {
          id: "srv-1",
          title: "1-sinfga qabul",
          desc: "Umumta'lim maktablariga elektron ariza topshirish",
          link: "https://adm.edu.uz",
          isExternal: true,
          color: "bg-blue-600 text-white"
        },
        {
          id: "srv-2",
          title: "Bog'chaga navbat",
          desc: "Davlat MTTlariga navbatga qo'yish va tekshirish",
          link: "https://my.gov.uz",
          isExternal: true,
          color: "bg-emerald-600 text-white"
        },
        {
          id: "srv-3",
          title: "Pedagoglar attestatsiyasi",
          desc: "Malaka toifasi sinovlari va natijalari",
          link: "https://pedkadr.uzedu.uz",
          isExternal: true,
          color: "bg-amber-600 text-white"
        },
        {
          id: "srv-4",
          title: "Fan olimpiadalari",
          desc: "Tuman va viloyat bosqichlari natijalari",
          link: "#yangiliklar",
          isExternal: false,
          color: "bg-indigo-600 text-white"
        },
        {
          id: "srv-5",
          title: "Elektron kundalik",
          desc: "eMaktab yagona ta'lim axborot tizimi",
          link: "https://emaktab.uz",
          isExternal: true,
          color: "bg-rose-600 text-white"
        },
        {
          id: "srv-6",
          title: "Virtual qabulxona",
          desc: "Bo'lim rahbariyatiga to'g'ridan-to'g'ri murojaat",
          link: "#murojaat",
          isExternal: false,
          color: "bg-sky-700 text-white"
        }
      ];

  const getServiceIcon = (title: string) => {
    if (title.toLowerCase().includes('maktab') || title.includes('1-sinf')) return GraduationCap;
    if (title.toLowerCase().includes('bog\'cha') || title.toLowerCase().includes('mtt')) return Baby;
    if (title.toLowerCase().includes('attestatsiya') || title.toLowerCase().includes('pedkadr')) return FileCheck2;
    if (title.toLowerCase().includes('olimpiada') || title.toLowerCase().includes('tanlov')) return Trophy;
    if (title.toLowerCase().includes('kundalik') || title.toLowerCase().includes('kitob')) return BookOpen;
    return Send;
  };

  return (
    <section className="bg-gradient-to-b from-sky-50/60 to-white pt-6 pb-12 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Main Grid: Featured Hero Story + Image */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-10">
          {/* Left Column: District Mission and Featured Story */}
          <div className="lg:col-span-7 flex flex-col justify-between w3-animate-left">
            <div>
              {/* Region Tag */}
              <div className="flex items-center gap-2 text-xs font-semibold text-sky-800 uppercase tracking-widest mb-3">
                <MapPin className="w-3.5 h-3.5" />
                <span>{t(settings.heroBadgeText || "Xorazm viloyati · Qo'shko'pir tumani")}</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4 text-balance">
                {t(settings.heroTitle || "Ta'lim va tarbiya — kelajak poydevori, ma'rifatli avlod kafolati")}
              </h1>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6 max-w-2xl">
                {t(settings.heroSubtitle || "Qo'shko'pir tumani maktabgacha va maktab ta'limi bo'limi tizimidagi 54 ta umumta'lim maktabi hamda 42 ta davlat va xususiy MTTlar faoliyatini yagona raqamli platforma orqali kuzatib boring.")}
              </p>

              {/* Featured News Card */}
              {featuredNews && (
                <div
                  onClick={() => onSelectNews(featuredNews)}
                  className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-2 text-xs text-sky-700 font-semibold mb-1.5">
                    <span>{t(featuredNews.category)}</span>
                    <span>·</span>
                    <span className="text-slate-500 font-normal">{featuredNews.date}</span>
                    <span>·</span>
                    <span className="text-slate-500 font-normal">{featuredNews.views} {t("ko'rildi")}</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-sky-700 transition-colors line-clamp-2 mb-2">
                    {t(featuredNews.title)}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed mb-3">
                    {t(featuredNews.summary)}
                  </p>
                  <div className="flex items-center text-xs font-semibold text-sky-700 group-hover:translate-x-1 transition-transform">
                    <span>{t("Batafsil o'qish")}</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </div>
                </div>
              )}
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 mt-6">
              <button
                onClick={() => onNavigate('murojaat')}
                className="px-5 py-2.5 bg-sky-800 hover:bg-sky-900 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>{t("Murojaat yo'llash")}</span>
              </button>

              <button
                onClick={() => onNavigate('muassasalar')}
                className="px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-800 text-sm font-semibold rounded-lg border border-slate-300 transition-colors flex items-center gap-2"
              >
                <GraduationCap className="w-4 h-4 text-sky-700" />
                <span>{t("Maktablar katalogi")}</span>
              </button>
            </div>
          </div>

          {/* Right Column: Hero District School Showcase Image */}
          <div className="lg:col-span-5 relative w3-animate-right">
            <div className="w-full h-full min-h-[320px] lg:min-h-[420px] rounded-2xl overflow-hidden shadow-lg border border-slate-200 relative group">
              <img
                src={settings.heroImageUrl || heroImage}
                alt={t("Qo'shko'pir tumani zamonaviy maktab binosi")}
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent" />
              
              <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-300 block mb-1">
                  {t("Yangi o'quv majmuasi")}
                </span>
                <p className="text-sm font-bold leading-snug">
                  {t("14-sonli umumiy o'rta ta'lim maktabining zamonaviy o'quv korpusi")}
                </p>
                <p className="text-xs text-slate-300 mt-1">
                  {t("STEM laboratoriyalari va sport inshootlariga ega zamonaviy ta'lim maskani")}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Electronic Government Services Bar */}
        <div className="mt-8 pt-8 border-t border-slate-200 w3-animate-bottom">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">
              {t("Elektron ta'lim xizmatlari va havolalar")}
            </h2>
            <span className="text-xs text-slate-500">{t("Yagona davlat axborot tizimlari")}</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {quickServicesList.map((srv, idx) => {
              const Icon = getServiceIcon(srv.title);
              if (srv.isExternal && srv.link) {
                return (
                  <a
                    key={idx}
                    href={srv.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white p-3.5 rounded-xl border border-slate-200 hover:border-sky-400 hover:shadow-sm transition-all group flex flex-col justify-between"
                  >
                    <div>
                      <div className={`w-9 h-9 rounded-lg ${srv.color || 'bg-sky-700 text-white'} flex items-center justify-center mb-2.5 shadow-xs`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex items-center gap-1 font-semibold text-xs sm:text-sm text-slate-900 group-hover:text-sky-700 transition-colors">
                        <span>{t(srv.title)}</span>
                        <ExternalLink className="w-3 h-3 text-slate-400 shrink-0" />
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                        {t(srv.desc)}
                      </p>
                    </div>
                  </a>
                );
              }

              return (
                <button
                  key={idx}
                  onClick={() => {
                    if (srv.link?.startsWith('#')) {
                      onNavigate(srv.link.replace('#', ''));
                    } else if (srv.link) {
                      window.open(srv.link, '_blank');
                    } else {
                      onNavigate('yangiliklar');
                    }
                  }}
                  className="bg-white p-3.5 rounded-xl border border-slate-200 hover:border-sky-400 hover:shadow-sm transition-all group flex flex-col justify-between text-left"
                >
                  <div>
                    <div className={`w-9 h-9 rounded-lg ${srv.color || 'bg-sky-700 text-white'} flex items-center justify-center mb-2.5 shadow-xs`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="font-semibold text-xs sm:text-sm text-slate-900 group-hover:text-sky-700 transition-colors">
                      {t(srv.title)}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                      {t(srv.desc)}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
