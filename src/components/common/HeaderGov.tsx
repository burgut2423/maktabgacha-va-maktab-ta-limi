import React, { useState } from 'react';
import {
  Phone,
  Volume2,
  VolumeX,
  Eye,
  Search,
  Menu,
  X,
  ShieldCheck,
  ExternalLink,
  ChevronRight,
  Database
} from 'lucide-react';
import { usePortal } from '../../context/PortalContext';
import { stateEmblem } from '../../assets/images';

interface HeaderGovProps {
  onOpenAdmin: () => void;
  onNavigate: (sectionId: string) => void;
  activeSection: string;
}

export const HeaderGov: React.FC<HeaderGovProps> = ({ onOpenAdmin, onNavigate, activeSection }) => {
  const {
    settings,
    fontSize,
    setFontSize,
    contrastMode,
    setContrastMode,
    speakText,
    stopSpeaking,
    isSpeaking,
    user,
    googleSyncStatus,
    loginWithGoogle
  } = usePortal();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accessibilityOpen, setAccessibilityOpen] = useState(false);

  const navItems = [
    { id: 'asosiy', label: 'Asosiy' },
    { id: 'bolim-haqida', label: "Bölim haqida" },
    { id: 'muassasalar', label: 'Maktab va MTTlar' },
    { id: 'hujjatlar', label: 'Hujjatlar' },
    { id: 'yangiliklar', label: 'Yangiliklar' },
    { id: 'murojaat', label: 'Virtual qabulxona' },
    { id: 'aloqa', label: 'Aloqa' },
  ];

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  const handleSpeechToggle = () => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      speakText(`${settings.districtName}. Rasmiy davlat portali. Işonç telefoni: ${settings.trustPhone}`);
    }
  };

  return (
    <header className="w-full bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      {/* 1. Top Accessibility and State Ribbon (Gov.uz standard) */}
      <div className="bg-slate-900 text-slate-200 text-xs py-1.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Left: State Portal Indicator */}
          <div className="flex items-center gap-2 truncate">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" title="Rasmiy portal faol" />
            <span className="truncate font-medium text-slate-300">
              Özbekiston Respublikasi Maktabgaça va maktab ta'limi vazirligi
            </span>
            <span className="hidden md:inline text-slate-500">|</span>
            <span className="hidden md:inline text-slate-400 truncate">
              Xorazm viloyati Qöşköpir tumani bölimi
            </span>
          </div>

          {/* Right: Accessibility & Hotline Tools */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Ishonch telefoni */}
            <a
              href={`tel:${settings.trustPhone.replace(/\D/g, '')}`}
              className="hidden sm:flex items-center gap-1.5 text-amber-300 hover:text-amber-200 font-medium"
              title="Işonç telefoni"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Işonç telefoni: {settings.trustPhone}</span>
            </a>

            {/* Accessibility dropdown trigger */}
            <div className="relative">
              <button
                onClick={() => setAccessibilityOpen(!accessibilityOpen)}
                className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                title="Maxsus imkoniyatlar"
                aria-label="Maxsus imkoniyatlar paneli"
              >
                <Eye className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Maxsus imkoniyatlar</span>
              </button>

              {/* Accessibility popover */}
              {accessibilityOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-64 bg-white text-slate-900 rounded-lg shadow-xl border border-slate-200 p-3 z-50 text-xs">
                  <div className="font-semibold text-slate-800 mb-2 border-b border-slate-100 pb-1">
                    Köriş imkoniyati çeklanganlar uçun
                  </div>

                  {/* Font Size */}
                  <div className="mb-3">
                    <span className="text-slate-500 block mb-1">Şrift ölçami:</span>
                    <div className="grid grid-cols-3 gap-1">
                      <button
                        onClick={() => setFontSize('normal')}
                        className={`px-2 py-1 rounded border text-center font-medium ${fontSize === 'normal' ? 'bg-sky-50 border-sky-600 text-sky-700' : 'border-slate-200 hover:bg-slate-50'}`}
                      >
                        A (Standart)
                      </button>
                      <button
                        onClick={() => setFontSize('large')}
                        className={`px-2 py-1 rounded border text-center font-semibold ${fontSize === 'large' ? 'bg-sky-50 border-sky-600 text-sky-700' : 'border-slate-200 hover:bg-slate-50'}`}
                      >
                        A+
                      </button>
                      <button
                        onClick={() => setFontSize('xlarge')}
                        className={`px-2 py-1 rounded border text-center font-bold ${fontSize === 'xlarge' ? 'bg-sky-50 border-sky-600 text-sky-700' : 'border-slate-200 hover:bg-slate-50'}`}
                      >
                        A++
                      </button>
                    </div>
                  </div>

                  {/* Contrast */}
                  <div className="mb-3">
                    <span className="text-slate-500 block mb-1">Ranglar kontrasti:</span>
                    <div className="grid grid-cols-3 gap-1">
                      <button
                        onClick={() => setContrastMode('normal')}
                        className={`px-2 py-1 rounded border text-center ${contrastMode === 'normal' ? 'bg-sky-50 border-sky-600 text-sky-700 font-medium' : 'border-slate-200 hover:bg-slate-50'}`}
                      >
                        Oddiy
                      </button>
                      <button
                        onClick={() => setContrastMode('high')}
                        className={`px-2 py-1 rounded border text-center ${contrastMode === 'high' ? 'bg-black text-yellow-300 border-yellow-400 font-bold' : 'border-slate-200 hover:bg-slate-50'}`}
                      >
                        Kontrast
                      </button>
                      <button
                        onClick={() => setContrastMode('grayscale')}
                        className={`px-2 py-1 rounded border text-center ${contrastMode === 'grayscale' ? 'bg-slate-300 font-medium' : 'border-slate-200 hover:bg-slate-50'}`}
                      >
                        Oq-qora
                      </button>
                    </div>
                  </div>

                  {/* Voice assistant */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-slate-600">Ovozli öqiş:</span>
                    <button
                      onClick={handleSpeechToggle}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition-colors ${isSpeaking ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                    >
                      {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                      <span>{isSpeaking ? 'To\'xtatish' : 'O\'qish'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Google Sheets / Admin quick status */}
            <button
              onClick={onOpenAdmin}
              className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-medium transition-colors ${
                googleSyncStatus.isConnected
                  ? 'bg-emerald-800 text-emerald-200 hover:bg-emerald-700'
                  : 'bg-sky-900 text-sky-200 hover:bg-sky-800'
              }`}
              title={googleSyncStatus.isConnected ? "Google Sheets boğlangan" : "Admin boşqaruv tizimi"}
            >
              <Database className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {googleSyncStatus.isConnected ? 'Baza ulangan' : 'Admin'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main Brand Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
        {/* Emblem & Portal Identity */}
        <div
          onClick={() => handleNavClick('asosiy')}
          className="flex items-center gap-3.5 cursor-pointer group shrink-0"
        >
          <img
            src={stateEmblem}
            alt="Özbekiston Davlat Gerbi"
            className="w-12 h-12 object-contain drop-shadow-xs group-hover:scale-105 transition-transform"
            referrerPolicy="no-referrer"
          />
          <div className="flex flex-col">
            <span className="text-xs uppercase tracking-wider font-semibold text-sky-800">
              Xorazm viloyati
            </span>
            <span className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-snug">
              Qöşköpir Tumani Maktabgaça va Maktab Ta'limi Bölimi
            </span>
            <span className="text-xs text-slate-500 hidden sm:block">
              Rasmiy axborot va xizmatlar portali
            </span>
          </div>
        </div>

        {/* Desktop Quick Contacts & Admin Button */}
        <div className="hidden lg:flex items-center gap-4 shrink-0">
          <div className="text-right">
            <span className="text-xs text-slate-500 block">Qabulxona:</span>
            <a
              href={`tel:${settings.departmentPhone.replace(/\D/g, '')}`}
              className="text-sm font-semibold text-slate-800 hover:text-sky-700"
            >
              {settings.departmentPhone}
            </a>
          </div>

          <button
            onClick={() => onNavigate('murojaat')}
            className="px-4 py-2 text-xs font-semibold text-white bg-sky-700 hover:bg-sky-800 rounded-md transition-colors shadow-xs"
          >
            Virtual qabulxona
          </button>

          <button
            onClick={onOpenAdmin}
            className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-md transition-colors"
          >
            {user?.photoURL ? (
              <img src={user.photoURL} alt="" className="w-4 h-4 rounded-full" />
            ) : (
              <ShieldCheck className="w-4 h-4 text-sky-700" />
            )}
            <span>Admin panel</span>
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            onClick={onOpenAdmin}
            className="p-2 text-slate-700 hover:bg-slate-100 rounded-md"
            aria-label="Admin panel"
            title="Admin panel"
          >
            <ShieldCheck className="w-5 h-5 text-sky-700" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-700 hover:bg-slate-100 rounded-md"
            aria-label="Menyu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* 3. Primary Desktop Navigation Menu (gov.uz style) */}
      <nav className="hidden lg:block bg-sky-900 border-t border-sky-800">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <ul className="flex items-center space-x-1 text-sm font-medium text-white">
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => handleNavClick(item.id)}
                  className={`px-4 py-2.5 transition-colors whitespace-nowrap block ${
                    activeSection === item.id
                      ? 'bg-sky-950 text-white font-semibold border-b-2 border-amber-400'
                      : 'hover:bg-sky-800 text-sky-100 hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3 text-xs text-sky-200">
            <span className="hidden xl:inline">Iş vaqti: Duş-Juma 09:00 - 18:00</span>
          </div>
        </div>
      </nav>

      {/* 4. Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 shadow-xl px-4 py-4">
          <div className="flex flex-col space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center justify-between w-full text-left px-3 py-2.5 rounded-md text-sm font-medium ${
                  activeSection === item.id
                    ? 'bg-sky-50 text-sky-900 font-semibold'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>{item.label}</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            ))}
          </div>

          <div className="pt-4 mt-3 border-t border-slate-200 flex flex-col gap-2">
            <button
              onClick={() => {
                handleNavClick('murojaat');
              }}
              className="w-full py-2.5 text-center text-sm font-semibold text-white bg-sky-800 rounded-md"
            >
              Virtual qabulxona (Murojaat yuboriş)
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="w-full py-2.5 text-center text-sm font-medium text-slate-700 bg-slate-100 border border-slate-300 rounded-md"
            >
              Admin panel (Boşqaruv)
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
