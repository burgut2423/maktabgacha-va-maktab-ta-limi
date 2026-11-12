import React from 'react';
import { ShieldCheck, ExternalLink, Phone, Mail, MapPin } from 'lucide-react';
import { usePortal } from '../../context/PortalContext';
import { stateEmblem } from '../../assets/images';

export const FooterGov: React.FC<{ onOpenAdmin: () => void; onNavigate: (s: string) => void }> = ({
  onOpenAdmin,
  onNavigate
}) => {
  const { settings } = usePortal();

  const governmentLinks = [
    { title: "Özbekiston Respublikasi Prezidenti", url: "https://president.uz" },
    { title: "Hukumat portali (gov.uz)", url: "https://gov.uz" },
    { title: "Maktabgaça va maktab ta'limi vazirligi", url: "https://gov.uz/oz/edu" },
    { title: "Yagona interaktiv davlat xizmatlari (my.gov.uz)", url: "https://my.gov.uz" },
    { title: "Ta'lim sifatini nazorat qiliş inspeksiyasi", url: "https://tdi.uz" },
    { title: "Xorazm viloyati hokimligi", url: "https://xorazm.uz" },
  ];

  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Top Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 pb-10 border-b border-slate-800">
          {/* Col 1: Identity */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src={stateEmblem}
                alt="Davlat Gerbi"
                className="w-10 h-10 object-contain"
                referrerPolicy="no-referrer"
              />
              <div>
                <span className="text-xs uppercase text-slate-400 font-semibold block">
                  Xorazm viloyati
                </span>
                <span className="text-sm font-bold text-white block">
                  Qöşköpir tuman ta'lim bölimi
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Saytdan olingan barça axborotlardan foydalanilganda Qöşköpir tuman ta'lim bölimi rasmiy veb-saytiga havola berilişi şart.
            </p>

            <div className="pt-2 text-xs text-slate-400 space-y-1">
              <div>Manzil: {settings.address}</div>
              <div>Işonç telefoni: <strong className="text-amber-400">{settings.trustPhone}</strong></div>
              <div>Elektron poçta: {settings.email}</div>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="lg:col-span-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Portal bölimlari
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('asosiy')} className="hover:text-white transition-colors">
                  Asosiy sahifa
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('bolim-haqida')} className="hover:text-white transition-colors">
                  Bölim rahbariyati va tuzilma
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('muassasalar')} className="hover:text-white transition-colors">
                  Maktablar va MTTlar röyxati
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('hujjatlar')} className="hover:text-white transition-colors">
                  Me'yoriy hujjatlar va buyruqlar
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('yangiliklar')} className="hover:text-white transition-colors">
                  Sönggi yangiliklar va e'lonlar
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('murojaat')} className="hover:text-white transition-colors">
                  Virtual qabulxona (Murojaat holati)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('aloqa')} className="hover:text-white transition-colors">
                  Boğlaniş va manzil
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Government portals */}
          <div className="lg:col-span-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Davlat organlari rasmiy saytlari
            </h4>
            <ul className="space-y-2 text-xs">
              {governmentLinks.map((item, idx) => (
                <li key={idx}>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 hover:text-white transition-colors group"
                  >
                    <span>{item.title}</span>
                    <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-slate-300 shrink-0" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom copyright and admin login trigger */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            © {new Date().getFullYear()} Qöşköpir tuman ta'lim bölimi. Barça huquqlar himoyalangan.
          </p>

          <div className="flex items-center gap-4">
            <button
              onClick={onOpenAdmin}
              className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors font-medium"
            >
              <ShieldCheck className="w-4 h-4 text-sky-400" />
              <span>Admin tizimiga kiriş</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
