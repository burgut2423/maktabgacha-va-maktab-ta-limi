import React, { useState, useEffect } from 'react';
import { PortalProvider, usePortal } from './context/PortalContext';
import { HeaderGov } from './components/common/HeaderGov';
import { BreakingTicker } from './components/common/BreakingTicker';
import { HeroSection } from './components/home/HeroSection';
import { StatsStrip } from './components/home/StatsStrip';
import { AboutSection } from './components/home/AboutSection';
import { OrganizationsDirectory } from './components/home/OrganizationsDirectory';
import { DocumentsSection } from './components/home/DocumentsSection';
import { NewsSection } from './components/home/NewsSection';
import { VirtualReception } from './components/home/VirtualReception';
import { ContactMapSection } from './components/home/ContactMapSection';
import { FooterGov } from './components/common/FooterGov';
import { AdminDashboard, AdminTab } from './components/admin/AdminDashboard';
import { AdminLoginModal } from './components/admin/AdminLoginModal';
import { checkAdminSession } from './services/adminAuth';
import { NewsItem } from './types';
import { Send, School, ShieldCheck, Home } from 'lucide-react';

function PortalMain() {
  const { settings, pendingAdminAuthResult, clearPendingAdminAuthResult, t } = usePortal();
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [adminInitialTab, setAdminInitialTab] = useState<AdminTab>('overview');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginModalExternalError, setLoginModalExternalError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState('asosiy');
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);

  useEffect(() => {
    if (!pendingAdminAuthResult) return;
    if (pendingAdminAuthResult.authorized) {
      setLoginModalExternalError(null);
      setIsLoginModalOpen(false);
      setIsAdminOpen(true);
    } else if (pendingAdminAuthResult.error) {
      setLoginModalExternalError(pendingAdminAuthResult.error);
      setIsLoginModalOpen(true);
    }
    clearPendingAdminAuthResult();
  }, [pendingAdminAuthResult, clearPendingAdminAuthResult]);

  const handleOpenAdmin = (targetTab: AdminTab = 'overview') => {
    setAdminInitialTab(targetTab);
    if (checkAdminSession()) {
      setIsAdminOpen(true);
    } else {
      setLoginModalExternalError(null);
      setIsLoginModalOpen(true);
    }
  };

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    if (sectionId === 'asosiy') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const elem = document.getElementById(sectionId);
    if (elem) {
      const navOffset = 110;
      const elementPosition = elem.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-sky-200 selection:text-sky-900">
      {/* 1. Header */}
      <HeaderGov
        onOpenAdmin={() => handleOpenAdmin('overview')}
        onNavigate={scrollToSection}
        activeSection={activeSection}
      />

      {/* 2. Urgent Breaking News / E'lonlar Ticker */}
      <BreakingTicker onOpenNews={() => scrollToSection('yangiliklar')} />

      {/* 3. Main Content Sections */}
      <main className="flex-1">
        {/* Asosiy */}
        <HeroSection
          onSelectNews={(news) => {
            setSelectedNews(news);
            scrollToSection('yangiliklar');
          }}
          onNavigate={scrollToSection}
        />
        <StatsStrip />

        {/* Tashkilot haqida */}
        <AboutSection onEditAbout={() => handleOpenAdmin('about')} />

        {/* Muassasalar */}
        <OrganizationsDirectory />

        {/* Hujjatlar */}
        <DocumentsSection />

        {/* Yangiliklar */}
        <NewsSection
          selectedNews={selectedNews}
          onSelectNews={setSelectedNews}
        />

        {/* Virtual qabulxona */}
        <VirtualReception />

        {/* Aloqa */}
        <ContactMapSection />
      </main>

      {/* 4. Footer */}
      <FooterGov
        onOpenAdmin={() => handleOpenAdmin('overview')}
        onNavigate={scrollToSection}
      />

      {/* 5. Admin Login Modal */}
      {isLoginModalOpen && (
        <AdminLoginModal
          isOpen={isLoginModalOpen}
          initialError={loginModalExternalError}
          onClose={() => {
            setIsLoginModalOpen(false);
            setLoginModalExternalError(null);
          }}
          onLoginSuccess={() => {
            setLoginModalExternalError(null);
            setIsLoginModalOpen(false);
            setIsAdminOpen(true);
          }}
        />
      )}

      {/* 6. Admin Dashboard */}
      {isAdminOpen && (
        <AdminDashboard
          initialTab={adminInitialTab}
          onClose={() => {
            setIsAdminOpen(false);
          }}
        />
      )}

      {/* 7. Sticky Mobile Navigation Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 z-30 py-1.5 px-3 shadow-lg flex items-center justify-around text-center">
        <button
          onClick={() => scrollToSection('asosiy')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg text-[10px] font-semibold transition-colors ${
            activeSection === 'asosiy' ? 'text-sky-800 font-bold' : 'text-slate-600'
          }`}
        >
          <Home className="w-4 h-4 mb-0.5" />
          <span>{t(settings.navLabels?.home || "Asosiy")}</span>
        </button>

        <button
          onClick={() => scrollToSection('muassasalar')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg text-[10px] font-semibold transition-colors ${
            activeSection === 'muassasalar' ? 'text-sky-800 font-bold' : 'text-slate-600'
          }`}
        >
          <School className="w-4 h-4 mb-0.5" />
          <span>{t(settings.navLabels?.orgs || "Muassasalar")}</span>
        </button>

        <button
          onClick={() => scrollToSection('murojaat')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg text-[10px] font-semibold transition-colors ${
            activeSection === 'murojaat' ? 'text-sky-800 font-bold' : 'text-slate-600'
          }`}
        >
          <Send className="w-4 h-4 mb-0.5" />
          <span>{t(settings.navLabels?.reception || "Murojaat")}</span>
        </button>

        <button
          onClick={() => handleOpenAdmin('overview')}
          className="flex flex-col items-center justify-center py-1 px-2 rounded-lg text-[10px] font-semibold text-sky-800 bg-sky-50 border border-sky-200"
        >
          <ShieldCheck className="w-4 h-4 mb-0.5 text-sky-700" />
          <span>{t("Admin")}</span>
        </button>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <PortalProvider>
      <PortalMain />
    </PortalProvider>
  );
}
