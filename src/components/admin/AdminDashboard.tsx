import React, { useState, useRef } from 'react';
import {
  ShieldCheck,
  LogOut,
  RefreshCw,
  ExternalLink,
  Plus,
  Trash2,
  Edit2,
  Save,
  X,
  Upload,
  FileText,
  School,
  Baby,
  Users,
  Send,
  Settings as SettingsIcon,
  AlertTriangle,
  CheckCircle2,
  Database,
  HardDrive,
  FileCheck,
  Share2,
  MessageCircle,
  Building2,
  LayoutTemplate,
  PhoneCall,
  Info,
  Check,
  Search,
  Menu,
  ChevronRight,
  Instagram,
  Facebook,
  Copy,
  Sparkles,
  Clock,
  Eye,
  MapPin,
  Mail,
  Phone,
  Award,
  TrendingUp,
  BarChart3,
  HelpCircle,
  Sliders,
  ChevronDown
} from 'lucide-react';
import { usePortal } from '../../context/PortalContext';
import {
  NewsItem,
  Organization,
  Leader,
  DocumentItem,
  CitizenAppeal,
  DepartmentBranch,
  QuickServiceItem,
  PortalSettings
} from '../../types';
import { uploadFileToDrive, deleteFileFromDrive } from '../../services/googleDrive';
import {
  postToTelegram,
  postToFacebook,
  postToInstagram,
  testTelegramConnection,
  testInstagramConnection,
  getTelegramShareUrl,
  getFacebookShareUrl,
  formatTelegramMessage,
  formatInstagramCaption
} from '../../services/socialBroadcast';
import { fixUzbekText } from '../../utils/uzbekTypography';
import { UzbekLetterHelper } from './UzbekLetterHelper';
import { destroyAdminSession } from '../../services/adminAuth';

type AdminTab =
  | 'overview'
  | 'hero'
  | 'about'
  | 'orgs'
  | 'leaders'
  | 'docs'
  | 'news'
  | 'appeals'
  | 'social'
  | 'contacts'
  | 'sheets';

export const AdminDashboard: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const {
    news,
    organizations,
    leaders,
    documents,
    appeals,
    settings,
    user,
    googleSyncStatus,
    loginWithGoogle,
    logoutGoogle,
    syncNow,
    addNews,
    updateNews,
    deleteNews,
    addOrganization,
    updateOrganization,
    deleteOrganization,
    addLeader,
    updateLeader,
    deleteLeader,
    addDocument,
    updateDocument,
    deleteDocument,
    updateAppeal,
    deleteAppeal,
    updateSettings
  } = usePortal();

  // Navigation tab
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [menuSearch, setMenuSearch] = useState('');

  // Confirmation modal state for destructive operations
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    onConfirm: () => Promise<void>;
  }>({
    isOpen: false,
    title: '',
    description: '',
    onConfirm: async () => {}
  });

  // Local settings state
  const [localSettings, setLocalSettings] = useState<PortalSettings>(settings);

  // News Modal State (with Telegram, Facebook & Instagram broadcast options)
  const [newsModal, setNewsModal] = useState<{
    isOpen: boolean;
    item: Partial<NewsItem>;
    isEdit: boolean;
    broadcastToTelegram: boolean;
    broadcastToFacebook: boolean;
    broadcastToInstagram: boolean;
  }>({
    isOpen: false,
    item: {},
    isEdit: false,
    broadcastToTelegram: localSettings.telegramAutoPublish ?? true,
    broadcastToFacebook: localSettings.facebookAutoPublish ?? false,
    broadcastToInstagram: localSettings.instagramAutoPublish ?? false
  });

  // Org Modal State
  const [orgModal, setOrgModal] = useState<{
    isOpen: boolean;
    item: Partial<Organization>;
    isEdit: boolean;
  }>({
    isOpen: false,
    item: {},
    isEdit: false
  });

  // Leader Modal State
  const [leaderModal, setLeaderModal] = useState<{
    isOpen: boolean;
    item: Partial<Leader>;
    isEdit: boolean;
  }>({
    isOpen: false,
    item: {},
    isEdit: false
  });

  // Branch Modal State
  const [branchModal, setBranchModal] = useState<{
    isOpen: boolean;
    item: Partial<DepartmentBranch>;
    isEdit: boolean;
    index?: number;
  }>({
    isOpen: false,
    item: {},
    isEdit: false
  });

  // Document Modal State
  const [docModal, setDocModal] = useState<{
    isOpen: boolean;
    item: Partial<DocumentItem>;
    isEdit: boolean;
  }>({
    isOpen: false,
    item: {},
    isEdit: false
  });

  // Appeal Reply Modal State
  const [appealModal, setAppealModal] = useState<{
    isOpen: boolean;
    item: CitizenAppeal | null;
    replyText: string;
    officer: string;
    status: CitizenAppeal['status'];
  }>({
    isOpen: false,
    item: null,
    replyText: '',
    officer: '',
    status: 'jarayonda'
  });

  // Quick Service Modal
  const [serviceModal, setServiceModal] = useState<{
    isOpen: boolean;
    item: Partial<QuickServiceItem>;
    isEdit: boolean;
    index?: number;
  }>({
    isOpen: false,
    item: {},
    isEdit: false
  });

  // Uploading state for Drive
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [copiedCaption, setCopiedCaption] = useState(false);

  // Social Broadcast Testing Status
  const [telegramTestStatus, setTelegramTestStatus] = useState<{
    loading: boolean;
    message: string | null;
    isError: boolean;
  }>({
    loading: false,
    message: null,
    isError: false
  });

  const [instagramTestStatus, setInstagramTestStatus] = useState<{
    loading: boolean;
    message: string | null;
    isError: boolean;
  }>({
    loading: false,
    message: null,
    isError: false
  });

  // Active input ref for letter helper
  const activeInputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

  // Helper to insert letter at cursor in active input
  const handleInsertLetter = (
    letter: string,
    currentValue: string,
    setValue: (val: string) => void
  ) => {
    setValue(currentValue + letter);
  };

  // Safe delete with confirmation
  const requestDelete = (title: string, description: string, onConfirm: () => Promise<void>) => {
    setConfirmModal({
      isOpen: true,
      title,
      description,
      onConfirm: async () => {
        await onConfirm();
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  // File upload to Drive handler
  const handleDriveFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    onSuccess: (url: string, driveId?: string, size?: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!googleSyncStatus.isConnected) {
      alert("Faylni Google Drive'ga yuklash uchun avval yuqoridagi 'Google bilan kirish' tugmasi orqali hisobingizga kiring.");
      return;
    }

    setIsUploading(true);
    setUploadSuccess(null);
    try {
      const uploaded = await uploadFileToDrive(file);
      const fileUrl = uploaded.webViewLink || uploaded.webContentLink || URL.createObjectURL(file);
      onSuccess(fileUrl, uploaded.id, uploaded.size);
      setUploadSuccess(`"${file.name}" Google Drive'ga muvaffaqiyatli yuklandi!`);
      setTimeout(() => setUploadSuccess(null), 4000);
    } catch (err: any) {
      alert("Google Drive'ga yuklashda xatolik: " + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  // Test Telegram Bot Connection
  const handleTestTelegram = async () => {
    if (!localSettings.telegramBotToken) {
      alert("Iltimos, Telegram Bot Tokenini kiriting.");
      return;
    }

    setTelegramTestStatus({ loading: true, message: null, isError: false });
    const result = await testTelegramConnection(
      localSettings.telegramBotToken,
      localSettings.telegramChannelUsername
    );

    if (result.success) {
      setTelegramTestStatus({
        loading: false,
        message: `Muvaffaqiyatli! Bot: ${result.botName}. Test xabari kanalga yuborildi.`,
        isError: false
      });
    } else {
      setTelegramTestStatus({
        loading: false,
        message: result.error || "Telegramga ulanishda xatolik yuz berdi.",
        isError: true
      });
    }
  };

  // Test Instagram Connection
  const handleTestInstagram = async () => {
    if (!localSettings.instagramAccountId || !localSettings.instagramAccessToken) {
      alert("Iltimos, Instagram Professional Account ID va Access Tokenni kiriting.");
      return;
    }

    setInstagramTestStatus({ loading: true, message: null, isError: false });
    const result = await testInstagramConnection(
      localSettings.instagramAccountId,
      localSettings.instagramAccessToken
    );

    if (result.success) {
      setInstagramTestStatus({
        loading: false,
        message: `Aloqa tasdiqlandi! Instagram akkaunt: @${result.username}`,
        isError: false
      });
    } else {
      setInstagramTestStatus({
        loading: false,
        message: result.error || "Instagram akkauntiga ulanib bo‘lmadi.",
        isError: true
      });
    }
  };

  // Menu items list matching AdminLTE standard
  const menuItems = [
    {
      id: 'overview',
      label: 'Dashboard (Bosh sahifa)',
      icon: BarChart3,
      badge: 'AdminLTE',
      badgeClass: 'bg-primary text-white'
    },
    {
      id: 'hero',
      label: '1. Asosiy Banner & Xizmatlar',
      icon: LayoutTemplate,
      badge: `${localSettings.quickServices?.length || 0}`,
      badgeClass: 'bg-info text-white'
    },
    {
      id: 'about',
      label: '2. Bo‘lim haqida (Sho‘balar)',
      icon: Building2,
      badge: `${localSettings.branches?.length || 0}`,
      badgeClass: 'bg-secondary text-white'
    },
    {
      id: 'orgs',
      label: '3. Maktab va MTTlar',
      icon: School,
      badge: `${organizations.length}`,
      badgeClass: 'bg-success text-white'
    },
    {
      id: 'leaders',
      label: '4. Rahbariyat tarkibi',
      icon: Users,
      badge: `${leaders.length}`,
      badgeClass: 'bg-info text-white'
    },
    {
      id: 'docs',
      label: '5. Me’yoriy Hujjatlar',
      icon: FileCheck,
      badge: `${documents.length}`,
      badgeClass: 'bg-warning text-dark'
    },
    {
      id: 'news',
      label: '6. Yangiliklar & E’lonlar',
      icon: FileText,
      badge: `${news.length}`,
      badgeClass: 'bg-danger text-white'
    },
    {
      id: 'appeals',
      label: '7. Virtual qabulxona',
      icon: Send,
      badge: `${appeals.filter(a => a.status === 'yangi' || a.status === 'jarayonda').length} yangi`,
      badgeClass: 'bg-danger text-white'
    },
    {
      id: 'social',
      label: '8. Ijtimoiy tarmoqlar (TG, IG, FB)',
      icon: Share2,
      badge: '3 tarmoq',
      badgeClass: 'bg-primary text-white'
    },
    {
      id: 'contacts',
      label: '9. Aloqa & Ish tartibi',
      icon: PhoneCall,
      badge: 'Manzil',
      badgeClass: 'bg-secondary text-white'
    },
    {
      id: 'sheets',
      label: '10. Google Sheets & Drive',
      icon: Database,
      badge: googleSyncStatus.isConnected ? 'Ulangan' : 'Lokal',
      badgeClass: googleSyncStatus.isConnected ? 'bg-success text-white' : 'bg-warning text-dark'
    }
  ];

  const filteredMenuItems = menuItems.filter(m =>
    m.label.toLowerCase().includes(menuSearch.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/90 backdrop-blur-xs flex flex-col font-sans text-slate-800 antialiased overflow-hidden">
      {/* ============================================================== */}
      {/* ADMINLTE TOP NAVBAR (MAIN HEADER)                             */}
      {/* ============================================================== */}
      <header className="h-14 bg-white border-b border-slate-300 px-3 sm:px-4 flex items-center justify-between shrink-0 shadow-xs z-20">
        <div className="flex items-center gap-3">
          {/* Hamburger toggle */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded hover:bg-slate-100 text-slate-600 transition-colors"
            title="Menyuni yashirish / ko‘rsatish"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* AdminLTE Brand Logo */}
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-base tracking-tight text-slate-800 flex items-center gap-1.5">
              <span className="bg-sky-700 text-white px-2 py-0.5 rounded font-black text-xs tracking-wider">
                AdminLTE
              </span>
              <span className="hidden sm:inline font-bold text-slate-700">Qo‘shko‘pir MMTB</span>
            </span>
          </div>

          {/* Quick link to website */}
          <a
            href="/"
            onClick={(e) => { e.preventDefault(); onClose(); }}
            className="hidden md:inline-flex items-center gap-1 text-xs text-sky-700 hover:text-sky-900 font-medium ml-2 px-2 py-1 rounded hover:bg-sky-50"
          >
            <span>Portalga qaytish</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Right side controls & user profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Google Sheets / Drive Sync Status */}
          <button
            onClick={syncNow}
            disabled={googleSyncStatus.syncing}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 transition-colors"
            title="Google Sheets bilan hoziroq sinxronlash"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-sky-600 ${googleSyncStatus.syncing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">
              {googleSyncStatus.syncing ? 'Sinxronlanmoqda...' : 'Sinxronlash'}
            </span>
          </button>

          {/* Google Drive Status Link */}
          {googleSyncStatus.folderId && (
            <a
              href={googleSyncStatus.folderUrl || `https://drive.google.com/drive/folders/${googleSyncStatus.folderId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100"
              title="Google Drive fayllar jildini ochish"
            >
              <HardDrive className="w-3.5 h-3.5 text-amber-600" />
              <span>Drive Jildi ↗</span>
            </a>
          )}

          {/* Google Sheets Status Link */}
          {googleSyncStatus.spreadsheetId && (
            <a
              href={googleSyncStatus.spreadsheetUrl || `https://docs.google.com/spreadsheets/d/${googleSyncStatus.spreadsheetId}/edit`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100"
              title="Google Sheets jadvalini ochish"
            >
              <Database className="w-3.5 h-3.5 text-emerald-600" />
              <span>Sheets Baza ↗</span>
            </a>
          )}

          {/* User authentication pill */}
          {user ? (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="w-7 h-7 rounded-full bg-sky-700 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                {user.displayName?.charAt(0) || user.email?.charAt(0).toUpperCase()}
              </div>
              <div className="hidden xl:block text-left text-xs leading-none">
                <span className="font-semibold block text-slate-800">{user.displayName || 'Admin'}</span>
                <span className="text-[10px] text-slate-500">{user.email}</span>
              </div>
              <button
                onClick={logoutGoogle}
                className="p-1.5 rounded hover:bg-slate-100 text-slate-500 hover:text-red-600 transition-colors"
                title="Chiqish"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={loginWithGoogle}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-sky-700 hover:bg-sky-800 text-white text-xs font-bold transition-colors shadow-xs"
            >
              <Database className="w-3.5 h-3.5" />
              <span>Google bilan ulanish</span>
            </button>
          )}

          {/* Logout & Close modal button */}
          <button
            onClick={() => {
              destroyAdminSession();
              onClose();
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors shadow-2xs ml-1"
            title="Admin seansini yakunlash va chiqish"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Chiqish</span>
          </button>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 border border-slate-200 transition-colors"
            title="Panelni yashirish"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* ============================================================== */}
      {/* BODY WITH ADMINLTE DARK SIDEBAR & CONTENT AREA                 */}
      {/* ============================================================== */}
      <div className="flex-1 flex overflow-hidden">
        {/* ============================================================ */}
        {/* ADMINLTE CLASSIC DARK SIDEBAR (#343a40)                      */}
        {/* ============================================================ */}
        <aside
          className={`${
            sidebarOpen ? 'w-64 sm:w-72' : 'w-0 -translate-x-full'
          } transition-all duration-200 bg-[#343a40] text-slate-200 flex flex-col shrink-0 overflow-y-auto border-r border-[#4f5962] select-none`}
        >
          {/* User Panel */}
          <div className="p-4 border-b border-[#4f5962] flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-sky-600 border-2 border-sky-400 flex items-center justify-center text-white font-bold shadow-md">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#343a40]" title="Tizimda faol" />
            </div>
            <div className="leading-tight">
              <div className="font-semibold text-sm text-white">Administrator</div>
              <div className="text-[11px] text-emerald-400 flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
                <span>Onlayn rejim</span>
              </div>
            </div>
          </div>

          {/* Sidebar Search Bar */}
          <div className="p-3 border-b border-[#4f5962]">
            <div className="relative">
              <input
                type="text"
                placeholder="Bo‘limlarni qidirish..."
                value={menuSearch}
                onChange={e => setMenuSearch(e.target.value)}
                className="w-full bg-[#3f474e] text-xs text-white placeholder-slate-400 rounded px-2.5 py-1.5 pr-8 border border-transparent focus:border-sky-500 focus:outline-hidden"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
            </div>
          </div>

          {/* Sidebar Menu - AdminLTE Treeview */}
          <nav className="flex-1 p-2 space-y-1">
            <div className="px-3 py-1.5 text-[10px] uppercase font-bold tracking-wider text-slate-400">
              Asosiy boshqaruv
            </div>
            {filteredMenuItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as AdminTab)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded text-xs font-medium transition-colors text-left ${
                    isActive
                      ? 'bg-sky-600 text-white shadow-xs font-semibold'
                      : 'text-slate-300 hover:bg-[#4f5962]/50 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold shrink-0 ${
                        isActive ? 'bg-white/20 text-white' : 'bg-slate-700 text-slate-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Sidebar Footer info */}
          <div className="p-3 border-t border-[#4f5962] text-[11px] text-slate-400 text-center">
            <div>Qo‘shko‘pir tumani MMTB</div>
            <div className="text-[10px] text-slate-500 mt-0.5">AdminLTE v3.2.0 &bull; 2026</div>
          </div>
        </aside>

        {/* ============================================================ */}
        {/* MAIN CONTENT WRAPPER                                         */}
        {/* ============================================================ */}
        <main className="flex-1 bg-[#f4f6f9] overflow-y-auto flex flex-col">
          {/* Breadcrumb Header */}
          <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 shrink-0">
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-slate-900 leading-tight">
                {menuItems.find(m => m.id === activeTab)?.label}
              </h1>
              <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                <span className="hover:text-slate-700 cursor-pointer" onClick={() => setActiveTab('overview')}>
                  Boshqaruv
                </span>
                <ChevronRight className="w-3 h-3 text-slate-400" />
                <span className="text-slate-700 font-medium">
                  {menuItems.find(m => m.id === activeTab)?.label}
                </span>
              </div>
            </div>

            {/* Quick Actions at Top of Content */}
            <div className="flex items-center gap-2">
              {activeTab === 'news' && (
                <button
                  onClick={() =>
                    setNewsModal({
                      isOpen: true,
                      item: {
                        date: new Date().toISOString().split('T')[0],
                        category: "Boshlang'ich ta'lim",
                        author: "Qo‘shko‘pir MMTB Matbuot xizmati",
                        views: 120
                      },
                      isEdit: false,
                      broadcastToTelegram: localSettings.telegramAutoPublish ?? true,
                      broadcastToFacebook: localSettings.facebookAutoPublish ?? false,
                      broadcastToInstagram: localSettings.instagramAutoPublish ?? false
                    })
                  }
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-sky-700 hover:bg-sky-800 text-white font-semibold text-xs shadow-xs transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Yangi yangilik qo‘shish</span>
                </button>
              )}

              {activeTab === 'orgs' && (
                <button
                  onClick={() =>
                    setOrgModal({
                      isOpen: true,
                      item: { type: 'maktab' },
                      isEdit: false
                    })
                  }
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs shadow-xs transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Yangi maktab/MTT qo‘shish</span>
                </button>
              )}

              {activeTab === 'docs' && (
                <button
                  onClick={() =>
                    setDocModal({
                      isOpen: true,
                      item: {
                        date: new Date().toISOString().split('T')[0],
                        category: 'Bo\'lim buyruqlari',
                        fileType: 'PDF'
                      },
                      isEdit: false
                    })
                  }
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-amber-700 hover:bg-amber-800 text-white font-semibold text-xs shadow-xs transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Yangi me’yoriy hujjat</span>
                </button>
              )}
            </div>
          </div>

          {/* Flash notifications */}
          {uploadSuccess && (
            <div className="bg-emerald-100 border-b border-emerald-300 text-emerald-900 px-6 py-2 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{uploadSuccess}</span>
            </div>
          )}

          {/* Inner Content Area */}
          <div className="p-4 sm:p-6 space-y-6 flex-1">
            {/* ======================================================== */}
            {/* TAB 1: ADMINLTE DASHBOARD (OVERVIEW)                     */}
            {/* ======================================================== */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* AdminLTE Signature Small Boxes (4 Columns) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Small Box 1: Info (Cyan) */}
                  <div className="bg-sky-600 rounded shadow-sm text-white overflow-hidden relative group">
                    <div className="p-4">
                      <div className="text-3xl font-extrabold">{news.length}</div>
                      <div className="text-xs uppercase font-semibold text-sky-100 tracking-wider mt-1">
                        Yangiliklar & E’lonlar
                      </div>
                    </div>
                    <FileText className="w-16 h-16 text-black/15 absolute right-2 top-2 pointer-events-none transition-transform group-hover:scale-110" />
                    <button
                      onClick={() => setActiveTab('news')}
                      className="w-full bg-black/15 hover:bg-black/25 text-white py-1 px-4 text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                    >
                      <span>Batafsil boshqarish</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Small Box 2: Success (Green) */}
                  <div className="bg-emerald-600 rounded shadow-sm text-white overflow-hidden relative group">
                    <div className="p-4">
                      <div className="text-3xl font-extrabold">{organizations.length}</div>
                      <div className="text-xs uppercase font-semibold text-emerald-100 tracking-wider mt-1">
                        Maktablar & MTTlar
                      </div>
                    </div>
                    <School className="w-16 h-16 text-black/15 absolute right-2 top-2 pointer-events-none transition-transform group-hover:scale-110" />
                    <button
                      onClick={() => setActiveTab('orgs')}
                      className="w-full bg-black/15 hover:bg-black/25 text-white py-1 px-4 text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                    >
                      <span>Ro‘yxatni ko‘rish</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Small Box 3: Warning (Yellow/Amber) */}
                  <div className="bg-amber-500 rounded shadow-sm text-slate-900 overflow-hidden relative group">
                    <div className="p-4">
                      <div className="text-3xl font-extrabold">{documents.length}</div>
                      <div className="text-xs uppercase font-bold text-amber-950 tracking-wider mt-1">
                        Me’yoriy Hujjatlar
                      </div>
                    </div>
                    <FileCheck className="w-16 h-16 text-black/15 absolute right-2 top-2 pointer-events-none transition-transform group-hover:scale-110" />
                    <button
                      onClick={() => setActiveTab('docs')}
                      className="w-full bg-black/15 hover:bg-black/25 text-slate-900 font-bold py-1 px-4 text-xs flex items-center justify-center gap-1 transition-colors"
                    >
                      <span>Hujjatlar ombori</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Small Box 4: Danger (Red) */}
                  <div className="bg-red-600 rounded shadow-sm text-white overflow-hidden relative group">
                    <div className="p-4">
                      <div className="text-3xl font-extrabold">{appeals.length}</div>
                      <div className="text-xs uppercase font-semibold text-red-100 tracking-wider mt-1">
                        Fuqaro Murojaatlari
                      </div>
                    </div>
                    <Send className="w-16 h-16 text-black/15 absolute right-2 top-2 pointer-events-none transition-transform group-hover:scale-110" />
                    <button
                      onClick={() => setActiveTab('appeals')}
                      className="w-full bg-black/15 hover:bg-black/25 text-white py-1 px-4 text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                    >
                      <span>Arizalarga javob berish</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Secondary Info Boxes: District Statistics & Social Health */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white p-4 rounded border-t-2 border-sky-600 shadow-xs flex items-center gap-3">
                    <div className="w-12 h-12 rounded bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
                      <School className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-slate-500 uppercase block">O‘quvchilar soni</span>
                      <span className="text-xl font-bold text-slate-900">{localSettings.studentsTotal?.toLocaleString()} nafar</span>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded border-t-2 border-emerald-600 shadow-xs flex items-center gap-3">
                    <div className="w-12 h-12 rounded bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                      <Award className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-slate-500 uppercase block">Pedagoglar tarkibi</span>
                      <span className="text-xl font-bold text-slate-900">{localSettings.teachersTotal?.toLocaleString()} nafar</span>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded border-t-2 border-sky-500 shadow-xs flex items-center gap-3">
                    <div className="w-12 h-12 rounded bg-sky-100 text-sky-600 flex items-center justify-center shrink-0">
                      <Send className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-slate-500 uppercase block">Telegram Kanali</span>
                      <span className="text-sm font-bold text-slate-900">@{localSettings.telegramChannelUsername || 'qoshkopir_mmtb'}</span>
                      <span className="text-[10px] text-emerald-600 block font-semibold">Avto-yuborish faol</span>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded border-t-2 border-pink-500 shadow-xs flex items-center gap-3">
                    <div className="w-12 h-12 rounded bg-pink-100 text-pink-600 flex items-center justify-center shrink-0">
                      <Instagram className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-slate-500 uppercase block">Instagram Sahifasi</span>
                      <span className="text-sm font-bold text-slate-900">{localSettings.instagramPage ? '@' + localSettings.instagramPage.split('/').filter(Boolean).pop() : 'Sozlangan'}</span>
                      <span className="text-[10px] text-pink-600 block font-semibold">Graph API & Share</span>
                    </div>
                  </div>
                </div>

                {/* AdminLTE Card: Database & Storage Status */}
                <div className="bg-white rounded border border-slate-200 border-t-4 border-t-sky-600 shadow-xs">
                  <div className="p-4 border-b border-slate-200 flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                      <Database className="w-4 h-4 text-sky-600" />
                      <span>Google Sheets Ma’lumotlar Bazasi va Google Drive Ombori Holati</span>
                    </h3>
                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">
                      Qo‘shko‘pir MMTB
                    </span>
                  </div>
                  <div className="p-4 sm:p-6 space-y-4 text-xs">
                    <p className="text-slate-600 leading-relaxed">
                      Saytning barcha bo‘limlari (maktablar, MTTlar, me’yoriy hujjatlar, yangiliklar, murojaatlar va sozlamalar) Google Sheets jadvali bilan integratsiya qilingan. Barcha fayllar avtomatik tarzda Google Drive xizmatiga yuklanadi.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 rounded bg-slate-50 border border-slate-200 space-y-2">
                        <strong className="text-slate-800 block text-sm flex items-center gap-1.5">
                          <Database className="w-4 h-4 text-emerald-600" />
                          <span>Google Sheets Jadvali:</span>
                        </strong>
                        <div>Nomi: <code className="bg-white px-1.5 py-0.5 rounded border border-slate-300 font-mono text-slate-800">Qo'shko'pir_MMTB_Rasmiy_Baza</code></div>
                        <div>
                          Jadval ID: <span className="font-mono text-slate-700">{googleSyncStatus.spreadsheetId || "Avtomatik bog‘langan"}</span>
                        </div>
                        {googleSyncStatus.spreadsheetId && (
                          <a
                            href={googleSyncStatus.spreadsheetUrl || `https://docs.google.com/spreadsheets/d/${googleSyncStatus.spreadsheetId}/edit`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-900 font-semibold"
                          >
                            <span>Jadvalni to‘g‘ridan-to‘g‘ri Google Sheets da ochish</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>

                      <div className="p-4 rounded bg-slate-50 border border-slate-200 space-y-2">
                        <strong className="text-slate-800 block text-sm flex items-center gap-1.5">
                          <HardDrive className="w-4 h-4 text-amber-600" />
                          <span>Google Drive Ombori:</span>
                        </strong>
                        <div>Jild nomi: <code className="bg-white px-1.5 py-0.5 rounded border border-slate-300 font-mono text-slate-800">Qo'shko'pir_MMTB_Fayllar</code></div>
                        <div>
                          Jild ID: <span className="font-mono text-slate-700">{googleSyncStatus.folderId || "Avtomatik bog‘langan"}</span>
                        </div>
                        {googleSyncStatus.folderId && (
                          <a
                            href={googleSyncStatus.folderUrl || `https://drive.google.com/drive/folders/${googleSyncStatus.folderId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-amber-700 hover:text-amber-900 font-semibold"
                          >
                            <span>Fayllar jildini Google Drive da ochish</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* TAB 2: HERO BANNER & QUICK SERVICES                      */}
            {/* ======================================================== */}
            {activeTab === 'hero' && (
              <div className="space-y-6">
                <div className="bg-white rounded border border-slate-200 border-t-4 border-t-sky-600 shadow-xs p-6 space-y-4">
                  <div className="flex items-center justify-between border-b pb-3">
                    <h3 className="font-bold text-slate-800 text-sm">
                      1. Asosiy Sahifa Banneri va Sarlavhalari
                    </h3>
                    <UzbekLetterHelper
                      compact
                      onInsertLetter={(letter) => {
                        setLocalSettings(prev => ({
                          ...prev,
                          heroTitle: prev.heroTitle + letter
                        }));
                      }}
                      onAutoFix={() => {
                        setLocalSettings(prev => ({
                          ...prev,
                          heroTitle: fixUzbekText(prev.heroTitle),
                          heroSubtitle: fixUzbekText(prev.heroSubtitle),
                          heroBadgeText: fixUzbekText(prev.heroBadgeText)
                        }));
                      }}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">
                        Asosiy Sarlavha (Katta matn)
                      </label>
                      <input
                        type="text"
                        value={localSettings.heroTitle}
                        onChange={e => setLocalSettings({ ...localSettings, heroTitle: e.target.value })}
                        className="w-full px-3 py-2 rounded border border-slate-300 focus:border-sky-500 focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">
                        Kichik Sarlavha (Badge matni)
                      </label>
                      <input
                        type="text"
                        value={localSettings.heroBadgeText}
                        onChange={e => setLocalSettings({ ...localSettings, heroBadgeText: e.target.value })}
                        className="w-full px-3 py-2 rounded border border-slate-300 focus:border-sky-500 focus:outline-hidden"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="font-bold text-slate-700 block mb-1">
                        Izoh / Ta’rif matni
                      </label>
                      <textarea
                        rows={3}
                        value={localSettings.heroSubtitle}
                        onChange={e => setLocalSettings({ ...localSettings, heroSubtitle: e.target.value })}
                        className="w-full px-3 py-2 rounded border border-slate-300 focus:border-sky-500 focus:outline-hidden"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="font-bold text-slate-700 block mb-1">
                        Banner Rasmi (URL yoki Drive)
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={localSettings.heroImageUrl}
                          onChange={e => setLocalSettings({ ...localSettings, heroImageUrl: e.target.value })}
                          className="flex-1 px-3 py-2 rounded border border-slate-300 focus:border-sky-500 focus:outline-hidden text-xs"
                        />
                        <label className="cursor-pointer px-3 py-2 rounded bg-slate-100 hover:bg-slate-200 border border-slate-300 font-semibold text-slate-700 flex items-center gap-1 shrink-0">
                          <Upload className="w-3.5 h-3.5 text-sky-600" />
                          <span>Yuklash</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={e => handleDriveFileUpload(e, url => setLocalSettings({ ...localSettings, heroImageUrl: url }))}
                          />
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-3 border-t">
                    <button
                      onClick={async () => {
                        await updateSettings(localSettings);
                        alert("Asosiy sahifa sozlamalari saqlandi!");
                      }}
                      className="px-4 py-2 rounded bg-sky-700 hover:bg-sky-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs"
                    >
                      <Save className="w-4 h-4" />
                      <span>O‘zgarishlarni Saqlash</span>
                    </button>
                  </div>
                </div>

                {/* Quick Services Management */}
                <div className="bg-white rounded border border-slate-200 border-t-4 border-t-emerald-600 shadow-xs p-6 space-y-4">
                  <div className="flex items-center justify-between border-b pb-3">
                    <div>
                      <h3 className="font-bold text-slate-800 text-sm">
                        Asosiy Sahifadagi Tezkor Xizmatlar Kartalari
                      </h3>
                      <p className="text-xs text-slate-500">
                        Fuqarolar va o‘qituvchilar uchun qulay navigatsiya tugmalari
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        setServiceModal({
                          isOpen: true,
                          item: {
                            color: 'bg-sky-700',
                            isExternal: false
                          },
                          isEdit: false
                        })
                      }
                      className="px-3 py-1.5 rounded bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs flex items-center gap-1 shadow-xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Xizmat qo‘shish</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {localSettings.quickServices?.map((srv, idx) => (
                      <div key={srv.id || idx} className="p-3 rounded border border-slate-200 bg-slate-50 flex items-start justify-between gap-2">
                        <div className="space-y-1">
                          <span className="font-bold text-slate-800 text-xs block">{srv.title}</span>
                          <span className="text-[11px] text-slate-500 block leading-tight">{srv.desc}</span>
                          <span className="text-[10px] font-mono text-sky-700 block truncate max-w-[200px]">{srv.link}</span>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() =>
                              setServiceModal({
                                isOpen: true,
                                item: srv,
                                isEdit: true,
                                index: idx
                              })
                            }
                            className="p-1 rounded hover:bg-slate-200 text-slate-600"
                            title="Tahrirlash"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              requestDelete(
                                "Xizmatni o‘chirish",
                                `Haqiqatan ham "${srv.title}" xizmatini o‘chirmoqchimisiz?`,
                                async () => {
                                  const updated = localSettings.quickServices.filter((_, i) => i !== idx);
                                  const newSettings = { ...localSettings, quickServices: updated };
                                  setLocalSettings(newSettings);
                                  await updateSettings(newSettings);
                                }
                              );
                            }}
                            className="p-1 rounded hover:bg-red-50 text-red-600"
                            title="O‘chirish"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* TAB 3: ABOUT DEPARTMENT (BRANCHES & TASKS)                */}
            {/* ======================================================== */}
            {activeTab === 'about' && (
              <div className="space-y-6">
                <div className="bg-white rounded border border-slate-200 border-t-4 border-t-sky-600 shadow-xs p-6 space-y-4">
                  <div className="flex items-center justify-between border-b pb-3">
                    <h3 className="font-bold text-slate-800 text-sm">
                      2. Bo‘lim Haqida Asosiy Ma’lumotlar
                    </h3>
                    <UzbekLetterHelper
                      compact
                      onInsertLetter={(letter) => {
                        setLocalSettings(prev => ({
                          ...prev,
                          departmentMission: prev.departmentMission + letter
                        }));
                      }}
                      onAutoFix={() => {
                        setLocalSettings(prev => ({
                          ...prev,
                          departmentMission: fixUzbekText(prev.departmentMission),
                          departmentHistory: fixUzbekText(prev.departmentHistory),
                          departmentCharter: fixUzbekText(prev.departmentCharter)
                        }));
                      }}
                    />
                  </div>

                  <div className="space-y-4 text-xs">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">
                        Bo‘limning Maqsadi va Missiyasi
                      </label>
                      <textarea
                        rows={3}
                        value={localSettings.departmentMission}
                        onChange={e => setLocalSettings({ ...localSettings, departmentMission: e.target.value })}
                        className="w-full px-3 py-2 rounded border border-slate-300 focus:border-sky-500 focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">
                        Bo‘lim Tarixi va Tashkil Topishi
                      </label>
                      <textarea
                        rows={3}
                        value={localSettings.departmentHistory}
                        onChange={e => setLocalSettings({ ...localSettings, departmentHistory: e.target.value })}
                        className="w-full px-3 py-2 rounded border border-slate-300 focus:border-sky-500 focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">
                        Nizom va Qoidalar
                      </label>
                      <textarea
                        rows={3}
                        value={localSettings.departmentCharter}
                        onChange={e => setLocalSettings({ ...localSettings, departmentCharter: e.target.value })}
                        className="w-full px-3 py-2 rounded border border-slate-300 focus:border-sky-500 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-3 border-t">
                    <button
                      onClick={async () => {
                        await updateSettings(localSettings);
                        alert("Bo‘lim ma’lumotlari muvaffaqiyatli saqlandi!");
                      }}
                      className="px-4 py-2 rounded bg-sky-700 hover:bg-sky-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs"
                    >
                      <Save className="w-4 h-4" />
                      <span>Saqlash</span>
                    </button>
                  </div>
                </div>

                {/* Branches (Sho'balar) Management */}
                <div className="bg-white rounded border border-slate-200 border-t-4 border-t-emerald-600 shadow-xs p-6 space-y-4">
                  <div className="flex items-center justify-between border-b pb-3">
                    <div>
                      <h3 className="font-bold text-slate-800 text-sm">
                        Bo‘lim Sho‘balari va Tarkibiy Tuzilmasi
                      </h3>
                      <p className="text-xs text-slate-500">
                        Metodika, kadrlash, moliya va axborot texnologiyalari sho‘balari
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        setBranchModal({
                          isOpen: true,
                          item: { staffCount: 3 },
                          isEdit: false
                        })
                      }
                      className="px-3 py-1.5 rounded bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs flex items-center gap-1 shadow-xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Sho‘ba qo‘shish</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {localSettings.branches?.map((branch, idx) => (
                      <div key={branch.id || idx} className="p-3.5 rounded border border-slate-200 bg-slate-50 space-y-1.5 text-xs">
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-bold text-slate-900 text-sm">{branch.name}</span>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() =>
                                setBranchModal({
                                  isOpen: true,
                                  item: branch,
                                  isEdit: true,
                                  index: idx
                                })
                              }
                              className="p-1 rounded hover:bg-slate-200 text-slate-600"
                              title="Tahrirlash"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                requestDelete(
                                  "Sho‘bani o‘chirish",
                                  `"${branch.name}" sho‘basini o‘chirmoqchimisiz?`,
                                  async () => {
                                    const updated = localSettings.branches.filter((_, i) => i !== idx);
                                    const newSettings = { ...localSettings, branches: updated };
                                    setLocalSettings(newSettings);
                                    await updateSettings(newSettings);
                                  }
                                );
                              }}
                              className="p-1 rounded hover:bg-red-50 text-red-600"
                              title="O‘chirish"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                        <div className="text-slate-600">Rahbar: <strong className="text-slate-800">{branch.head}</strong></div>
                        <div className="text-slate-500">Telefon: {branch.phone} &bull; Xodimlar: {branch.staffCount} nafar</div>
                        <p className="text-[11px] text-slate-600 leading-tight">{branch.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* TAB 4: SCHOOLS & MTTS (MAKTAB VA BOG'CHALAR)              */}
            {/* ======================================================== */}
            {activeTab === 'orgs' && (
              <div className="bg-white rounded border border-slate-200 border-t-4 border-t-emerald-600 shadow-xs p-6 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4">
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm">
                      3. Ta’lim Muassasalari (Maktab va Bog‘chalar Boshqaruvi)
                    </h3>
                    <p className="text-xs text-slate-500">
                      Qo‘shko‘pir tumanidagi barcha 54 ta umumta’lim maktabi va 38 ta MTT ro‘yxati
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      setOrgModal({
                        isOpen: true,
                        item: { type: 'maktab' },
                        isEdit: false
                      })
                    }
                    className="px-3 py-1.5 rounded bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs flex items-center gap-1 shadow-xs"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Yangi Muassasa Qo‘shish</span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border border-slate-200">
                    <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase text-[11px]">
                      <tr>
                        <th className="p-2.5">Nomi</th>
                        <th className="p-2.5">Turi</th>
                        <th className="p-2.5">Direktor</th>
                        <th className="p-2.5">Manzil</th>
                        <th className="p-2.5">Telefon</th>
                        <th className="p-2.5">O‘quvchi/Tarbiyalanuvchi</th>
                        <th className="p-2.5 text-right">Amallar</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {organizations.map(org => (
                        <tr key={org.id} className="hover:bg-slate-50 transition-colors">
                          <td className="p-2.5 font-bold text-slate-900">{org.name}</td>
                          <td className="p-2.5">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              org.type === 'maktab' ? 'bg-sky-100 text-sky-800' : 'bg-pink-100 text-pink-800'
                            }`}>
                              {org.type === 'maktab' ? 'Maktab' : 'MTT'}
                            </span>
                          </td>
                          <td className="p-2.5 text-slate-700">{org.director}</td>
                          <td className="p-2.5 text-slate-600 truncate max-w-[150px]">{org.address}</td>
                          <td className="p-2.5 font-mono text-slate-600">{org.phone}</td>
                          <td className="p-2.5 text-slate-800 font-semibold">{org.studentsCount || 0} nafar</td>
                          <td className="p-2.5 text-right whitespace-nowrap">
                            <button
                              onClick={() => setOrgModal({ isOpen: true, item: org, isEdit: true })}
                              className="p-1 rounded text-slate-600 hover:text-sky-700 hover:bg-slate-100 mr-1"
                              title="Tahrirlash"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                requestDelete(
                                  "Muassasani o‘chirish",
                                  `Haqiqatan ham "${org.name}" muassasasini bazadan o‘chirmoqchimisiz?`,
                                  async () => {
                                    await deleteOrganization(org.id);
                                  }
                                );
                              }}
                              className="p-1 rounded text-red-500 hover:text-red-700 hover:bg-red-50"
                              title="O‘chirish"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* TAB 5: LEADERS (RAHBARIYAT TARKIBI)                       */}
            {/* ======================================================== */}
            {activeTab === 'leaders' && (
              <div className="bg-white rounded border border-slate-200 border-t-4 border-t-sky-600 shadow-xs p-6 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4">
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm">
                      4. Bo‘lim Rahbariyati Tarkibi
                    </h3>
                    <p className="text-xs text-slate-500">
                      Bo‘lim mudiri, o‘rinbosarlari va fuqarolarni qabul qilish kunlari
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      setLeaderModal({
                        isOpen: true,
                        item: {},
                        isEdit: false
                      })
                    }
                    className="px-3 py-1.5 rounded bg-sky-700 hover:bg-sky-800 text-white font-semibold text-xs flex items-center gap-1 shadow-xs"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Yangi Rahbar Qo‘shish</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {leaders.map(ldr => (
                    <div key={ldr.id} className="p-4 rounded border border-slate-200 bg-slate-50 flex gap-3 text-xs">
                      <img
                        src={ldr.photoUrl || '/assets/aistudio/image_0a3ac00b.png'}
                        alt={ldr.name}
                        className="w-16 h-20 object-cover rounded border border-slate-300 shrink-0"
                      />
                      <div className="flex-1 space-y-1">
                        <span className="font-bold text-slate-900 block text-sm">{ldr.name}</span>
                        <span className="text-[11px] font-semibold text-sky-700 block">{ldr.position}</span>
                        <span className="text-slate-600 block">Qabul: {ldr.receptionHours}</span>
                        <span className="text-slate-600 block">Tel: {ldr.phone}</span>

                        <div className="flex gap-2 pt-2">
                          <button
                            onClick={() => setLeaderModal({ isOpen: true, item: ldr, isEdit: true })}
                            className="text-xs font-semibold text-sky-700 hover:underline"
                          >
                            Tahrirlash
                          </button>
                          <button
                            onClick={() => {
                              requestDelete(
                                "Rahbarni o‘chirish",
                                `"${ldr.name}"ni ro‘yxatdan o‘chirmoqchimisiz?`,
                                async () => {
                                  await deleteLeader(ldr.id);
                                }
                              );
                            }}
                            className="text-xs font-semibold text-red-600 hover:underline"
                          >
                            O‘chirish
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* TAB 6: DOCUMENTS (ME'YORIY HUJJATLAR)                     */}
            {/* ======================================================== */}
            {activeTab === 'docs' && (
              <div className="bg-white rounded border border-slate-200 border-t-4 border-t-amber-500 shadow-xs p-6 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4">
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm">
                      5. Me’yoriy-Huquqiy Hujjatlar Ombori
                    </h3>
                    <p className="text-xs text-slate-500">
                      Qarorlar, buyruqlar, nizomlar va Google Drive’ga yuklangan PDF fayllar
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      setDocModal({
                        isOpen: true,
                        item: {
                          date: new Date().toISOString().split('T')[0],
                          category: 'Bo\'lim buyruqlari',
                          fileType: 'PDF'
                        },
                        isEdit: false
                      })
                    }
                    className="px-3 py-1.5 rounded bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs flex items-center gap-1 shadow-xs"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Yangi Hujjat Qo‘shish</span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border border-slate-200">
                    <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase text-[11px]">
                      <tr>
                        <th className="p-2.5">Hujjat Sarlavhasi</th>
                        <th className="p-2.5">Raqami</th>
                        <th className="p-2.5">Sanasi</th>
                        <th className="p-2.5">Kategoriya</th>
                        <th className="p-2.5">Fayl / Drive</th>
                        <th className="p-2.5 text-right">Amallar</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {documents.map(doc => (
                        <tr key={doc.id} className="hover:bg-slate-50">
                          <td className="p-2.5 font-bold text-slate-900">{doc.title}</td>
                          <td className="p-2.5 font-mono text-slate-600">{doc.docNumber}</td>
                          <td className="p-2.5 text-slate-600">{doc.date}</td>
                          <td className="p-2.5">
                            <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold">
                              {doc.category}
                            </span>
                          </td>
                          <td className="p-2.5">
                            {doc.fileUrl ? (
                              <a
                                href={doc.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-sky-700 hover:underline font-semibold"
                              >
                                <HardDrive className="w-3.5 h-3.5 text-amber-600" />
                                <span>{doc.fileType || 'Fayl'} ({doc.fileSize || 'Drive'})</span>
                              </a>
                            ) : (
                              <span className="text-slate-400">Fayl biriktirilmagan</span>
                            )}
                          </td>
                          <td className="p-2.5 text-right whitespace-nowrap">
                            <button
                              onClick={() => setDocModal({ isOpen: true, item: doc, isEdit: true })}
                              className="p-1 rounded text-slate-600 hover:text-sky-700 hover:bg-slate-100 mr-1"
                              title="Tahrirlash"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                requestDelete(
                                  "Hujjatni o‘chirish",
                                  `Haqiqatan ham "${doc.title}" hujjatini o‘chirmoqchimisiz?`,
                                  async () => {
                                    if (doc.driveFileId) {
                                      await deleteFileFromDrive(doc.driveFileId);
                                    }
                                    await deleteDocument(doc.id);
                                  }
                                );
                              }}
                              className="p-1 rounded text-red-500 hover:text-red-700 hover:bg-red-50"
                              title="O‘chirish"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* TAB 7: NEWS & BROADCAST (TG, IG, FB)                     */}
            {/* ======================================================== */}
            {activeTab === 'news' && (
              <div className="bg-white rounded border border-slate-200 border-t-4 border-t-sky-600 shadow-xs p-6 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4">
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                      <FileText className="w-4 h-4 text-sky-600" />
                      <span>6. Yangiliklar va Ijtimoiy Tarmoqlarga Tarqatish (Telegram, Instagram, Facebook)</span>
                    </h3>
                    <p className="text-xs text-slate-500">
                      Yangilik kiritilganda bir vaqtning o‘zida Telegram kanal, Instagram va Facebook sahifasiga yuboriladi
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      setNewsModal({
                        isOpen: true,
                        item: {
                          date: new Date().toISOString().split('T')[0],
                          category: "Boshlang'ich ta'lim",
                          author: "Qo‘shko‘pir MMTB Matbuot xizmati",
                          views: 100
                        },
                        isEdit: false,
                        broadcastToTelegram: localSettings.telegramAutoPublish ?? true,
                        broadcastToFacebook: localSettings.facebookAutoPublish ?? false,
                        broadcastToInstagram: localSettings.instagramAutoPublish ?? false
                      })
                    }
                    className="px-3 py-1.5 rounded bg-sky-700 hover:bg-sky-800 text-white font-semibold text-xs flex items-center gap-1 shadow-xs"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Yangi Yangilik Kiritish</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {news.map(item => (
                    <div
                      key={item.id}
                      className="p-4 rounded border border-slate-200 bg-slate-50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs"
                    >
                      <div className="flex items-start gap-3 flex-1">
                        <img
                          src={item.imageUrl || '/assets/aistudio/image_0a3ac00b.png'}
                          alt=""
                          className="w-16 h-16 rounded object-cover border border-slate-300 shrink-0"
                        />
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded bg-sky-100 text-sky-800 font-bold text-[10px]">
                              {item.category}
                            </span>
                            <span className="text-slate-500 text-[11px]">{item.date}</span>
                            {item.isPinned && (
                              <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold">
                                Asosiy
                              </span>
                            )}
                          </div>
                          <h4 className="font-bold text-slate-900 text-sm leading-snug">{item.title}</h4>
                          <p className="text-slate-600 line-clamp-1">{item.summary}</p>

                          {/* Social broadcast badges */}
                          <div className="flex items-center gap-2 pt-1 text-[11px]">
                            <span className="flex items-center gap-1 text-slate-500">
                              <Eye className="w-3.5 h-3.5" />
                              <span>{item.views || 0}</span>
                            </span>

                            {item.sentToTelegram && (
                              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-sky-100 text-sky-700 font-semibold text-[10px]">
                                <Send className="w-3 h-3" />
                                <span>Telegramda ulashildi</span>
                              </span>
                            )}

                            {item.sentToInstagram && (
                              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-pink-100 text-pink-700 font-semibold text-[10px]">
                                <Instagram className="w-3 h-3" />
                                <span>Instagramda ulashildi</span>
                              </span>
                            )}

                            {item.sentToFacebook && (
                              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 font-semibold text-[10px]">
                                <Facebook className="w-3 h-3" />
                                <span>Facebookda ulashildi</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-1.5 shrink-0 self-end md:self-center">
                        {/* 1-click share to Instagram helper */}
                        <button
                          onClick={() => {
                            const caption = formatInstagramCaption(item);
                            navigator.clipboard.writeText(caption);
                            alert("Instagram uchun post matni va hashtaglari nusxalandi! Endi Instagram sahifangizga rasm bilan joylashingiz mumkin.");
                            window.open(localSettings.instagramPage || 'https://instagram.com', '_blank');
                          }}
                          className="px-2 py-1 rounded bg-pink-50 hover:bg-pink-100 text-pink-700 font-semibold border border-pink-200 flex items-center gap-1"
                          title="Instagramda ulashish (Matnni nusxalash)"
                        >
                          <Instagram className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Instagram</span>
                        </button>

                        {/* 1-click share to Telegram */}
                        <a
                          href={getTelegramShareUrl(item)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2 py-1 rounded bg-sky-50 hover:bg-sky-100 text-sky-700 font-semibold border border-sky-200 flex items-center gap-1"
                          title="Telegramda qo‘lda ulashish"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Telegram</span>
                        </a>

                        <button
                          onClick={() =>
                            setNewsModal({
                              isOpen: true,
                              item,
                              isEdit: true,
                              broadcastToTelegram: false,
                              broadcastToFacebook: false,
                              broadcastToInstagram: false
                            })
                          }
                          className="p-1.5 rounded hover:bg-slate-200 text-slate-600"
                          title="Tahrirlash"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => {
                            requestDelete(
                              "Yangilikni o‘chirish",
                              `Haqiqatan ham "${item.title}" xabarini o‘chirmoqchimisiz?`,
                              async () => {
                                await deleteNews(item.id);
                              }
                            );
                          }}
                          className="p-1.5 rounded hover:bg-red-50 text-red-600"
                          title="O‘chirish"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* TAB 8: VIRTUAL RECEPTION (FUQAROLAR MUROJAATLARI)         */}
            {/* ======================================================== */}
            {activeTab === 'appeals' && (
              <div className="bg-white rounded border border-slate-200 border-t-4 border-t-red-600 shadow-xs p-6 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4">
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm">
                      7. Virtual Qabulxona (Fuqarolar va Ota-onalar Murojaatlari)
                    </h3>
                    <p className="text-xs text-slate-500">
                      Kelib tushgan arizalar, holatlar, ko‘rib chiqish muddati va rasmiy javob xatlari
                    </p>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border border-slate-200">
                    <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase text-[11px]">
                      <tr>
                        <th className="p-2.5">Kodi</th>
                        <th className="p-2.5">Fuqaro F.I.O</th>
                        <th className="p-2.5">Telefon</th>
                        <th className="p-2.5">Mavzu</th>
                        <th className="p-2.5">Sanasi</th>
                        <th className="p-2.5">Holat</th>
                        <th className="p-2.5 text-right">Amallar</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {appeals.map(apl => (
                        <tr key={apl.id} className="hover:bg-slate-50">
                          <td className="p-2.5 font-mono font-bold text-sky-700">{apl.trackingCode}</td>
                          <td className="p-2.5 font-bold text-slate-900">{apl.fullName}</td>
                          <td className="p-2.5 font-mono text-slate-600">{apl.phone}</td>
                          <td className="p-2.5 text-slate-700 max-w-[200px] truncate">{apl.subject}</td>
                          <td className="p-2.5 text-slate-500">{apl.date}</td>
                          <td className="p-2.5">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                apl.status === 'yangi'
                                  ? 'bg-blue-100 text-blue-800'
                                  : apl.status === 'jarayonda'
                                  ? 'bg-amber-100 text-amber-800'
                                  : apl.status === 'ijro_etildi'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {apl.status === 'yangi'
                                ? 'Yangi'
                                : apl.status === 'jarayonda'
                                ? 'Jarayonda'
                                : apl.status === 'ijro_etildi'
                                ? 'Ijro etildi'
                                : 'Rad etildi'}
                            </span>
                          </td>
                          <td className="p-2.5 text-right whitespace-nowrap">
                            <button
                              onClick={() =>
                                setAppealModal({
                                  isOpen: true,
                                  item: apl,
                                  replyText: apl.replyMessage || '',
                                  officer: apl.officer || 'Qo‘shko‘pir tumani MMTB ijrochisi',
                                  status: apl.status
                                })
                              }
                              className="px-2.5 py-1 rounded bg-sky-700 hover:bg-sky-800 text-white font-semibold text-[11px] mr-1"
                            >
                              Ko‘rib chiqish
                            </button>
                            <button
                              onClick={() => {
                                requestDelete(
                                  "Murojaatni o‘chirish",
                                  `Haqiqatan ham ushbu murojaatni o‘chirmoqchimisiz?`,
                                  async () => {
                                    await deleteAppeal(apl.id);
                                  }
                                );
                              }}
                              className="p-1 rounded text-red-500 hover:text-red-700 hover:bg-red-50"
                              title="O‘chirish"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* TAB 9: SOCIAL BROADCAST SETTINGS (TG, IG, FB)            */}
            {/* ======================================================== */}
            {activeTab === 'social' && (
              <div className="space-y-6">
                {/* Telegram Bot Settings */}
                <div className="bg-white rounded border border-slate-200 border-t-4 border-t-sky-500 shadow-xs p-6 space-y-4 text-xs">
                  <div className="flex items-center justify-between border-b pb-3">
                    <div className="flex items-center gap-2">
                      <Send className="w-5 h-5 text-sky-600" />
                      <h3 className="font-bold text-slate-800 text-sm">
                        Telegram Kanal va Bot Integratsiyasi
                      </h3>
                    </div>
                    <label className="flex items-center gap-2 font-semibold text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={localSettings.telegramAutoPublish}
                        onChange={e =>
                          setLocalSettings({ ...localSettings, telegramAutoPublish: e.target.checked })
                        }
                        className="rounded text-sky-600 focus:ring-sky-500"
                      />
                      <span>Yangiliklarni avtomatik Telegramga yuborish</span>
                    </label>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">
                        Telegram Bot Tokeni (@BotFather dan olingan)
                      </label>
                      <input
                        type="password"
                        placeholder="masalan: 123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ"
                        value={localSettings.telegramBotToken}
                        onChange={e =>
                          setLocalSettings({ ...localSettings, telegramBotToken: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded border border-slate-300 focus:border-sky-500 font-mono"
                      />
                      <span className="text-[11px] text-slate-500 block mt-1">
                        Botni o‘z kanalingizga qo‘shib, unga <strong>"Administrator"</strong> (Post xabarlarini yuborish) huquqini bering.
                      </span>
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">
                        Telegram Kanal Usernamesi yoki ID si
                      </label>
                      <input
                        type="text"
                        placeholder="masalan: @qoshkopir_mmtb yoki -1001234567890"
                        value={localSettings.telegramChannelUsername}
                        onChange={e =>
                          setLocalSettings({ ...localSettings, telegramChannelUsername: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded border border-slate-300 focus:border-sky-500 font-mono"
                      />
                      <span className="text-[11px] text-slate-500 block mt-1">
                        Ommaviy kanal bo‘lsa <code>@kanal_nomi</code>, yopiq bo‘lsa ID kiriting.
                      </span>
                    </div>
                  </div>

                  {telegramTestStatus.message && (
                    <div
                      className={`p-3 rounded text-xs font-semibold ${
                        telegramTestStatus.isError
                          ? 'bg-red-50 text-red-800 border border-red-200'
                          : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      }`}
                    >
                      {telegramTestStatus.message}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2">
                    <button
                      onClick={handleTestTelegram}
                      disabled={telegramTestStatus.loading}
                      className="px-3.5 py-1.5 rounded bg-sky-100 hover:bg-sky-200 text-sky-800 font-bold border border-sky-300 transition-colors"
                    >
                      {telegramTestStatus.loading ? "Tekshirilmoqda..." : "Telegram Aloqasini Tekshirish"}
                    </button>

                    <button
                      onClick={async () => {
                        await updateSettings(localSettings);
                        alert("Telegram sozlamalari saqlandi!");
                      }}
                      className="px-4 py-1.5 rounded bg-sky-700 hover:bg-sky-800 text-white font-bold"
                    >
                      Saqlash
                    </button>
                  </div>
                </div>

                {/* Instagram Settings Card */}
                <div className="bg-white rounded border border-slate-200 border-t-4 border-t-pink-500 shadow-xs p-6 space-y-4 text-xs">
                  <div className="flex items-center justify-between border-b pb-3">
                    <div className="flex items-center gap-2">
                      <Instagram className="w-5 h-5 text-pink-600" />
                      <h3 className="font-bold text-slate-800 text-sm">
                        Instagram Akkaunt va Tarqatish Sozlamalari
                      </h3>
                    </div>
                    <label className="flex items-center gap-2 font-semibold text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={localSettings.instagramAutoPublish}
                        onChange={e =>
                          setLocalSettings({ ...localSettings, instagramAutoPublish: e.target.checked })
                        }
                        className="rounded text-pink-600 focus:ring-pink-500"
                      />
                      <span>Instagramga avtomatik yuborish (Graph API)</span>
                    </label>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">
                        Instagram Sahifasi Havolasi (Veb saytda ko‘rsatiladigan link)
                      </label>
                      <input
                        type="text"
                        placeholder="masalan: https://instagram.com/qoshkopir_mmtb"
                        value={localSettings.instagramPage}
                        onChange={e =>
                          setLocalSettings({ ...localSettings, instagramPage: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded border border-slate-300 focus:border-pink-500"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">
                        Instagram Professional Account ID (Facebook Graph API)
                      </label>
                      <input
                        type="text"
                        placeholder="masalan: 17841400000000000"
                        value={localSettings.instagramAccountId}
                        onChange={e =>
                          setLocalSettings({ ...localSettings, instagramAccountId: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded border border-slate-300 focus:border-pink-500 font-mono"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="font-bold text-slate-700 block mb-1">
                        Instagram Graph API Access Token
                      </label>
                      <input
                        type="password"
                        placeholder="EAA..."
                        value={localSettings.instagramAccessToken}
                        onChange={e =>
                          setLocalSettings({ ...localSettings, instagramAccessToken: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded border border-slate-300 focus:border-pink-500 font-mono"
                      />
                      <span className="text-[11px] text-slate-500 block mt-1">
                        Facebook Developer portali orqali Instagram Business akkauntiga ulangan uzoq muddatli Access Token.
                        Agar API mavjud bo‘lmasa, yangilik kiritishda <strong>1-click "Instagram matnini nusxalash"</strong> orqali tayyor post va hashtaglarni to‘g‘ridan-to‘g‘ri joylashingiz mumkin!
                      </span>
                    </div>
                  </div>

                  {instagramTestStatus.message && (
                    <div
                      className={`p-3 rounded text-xs font-semibold ${
                        instagramTestStatus.isError
                          ? 'bg-red-50 text-red-800 border border-red-200'
                          : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      }`}
                    >
                      {instagramTestStatus.message}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2">
                    <button
                      onClick={handleTestInstagram}
                      disabled={instagramTestStatus.loading}
                      className="px-3.5 py-1.5 rounded bg-pink-100 hover:bg-pink-200 text-pink-800 font-bold border border-pink-300 transition-colors"
                    >
                      {instagramTestStatus.loading ? "Tekshirilmoqda..." : "Instagram Aloqasini Tekshirish"}
                    </button>

                    <button
                      onClick={async () => {
                        await updateSettings(localSettings);
                        alert("Instagram sozlamalari saqlandi!");
                      }}
                      className="px-4 py-1.5 rounded bg-pink-700 hover:bg-pink-800 text-white font-bold"
                    >
                      Saqlash
                    </button>
                  </div>
                </div>

                {/* Facebook Page Settings */}
                <div className="bg-white rounded border border-slate-200 border-t-4 border-t-blue-600 shadow-xs p-6 space-y-4 text-xs">
                  <div className="flex items-center justify-between border-b pb-3">
                    <div className="flex items-center gap-2">
                      <Facebook className="w-5 h-5 text-blue-600" />
                      <h3 className="font-bold text-slate-800 text-sm">
                        Facebook Sahifasi Sozlamalari
                      </h3>
                    </div>
                    <label className="flex items-center gap-2 font-semibold text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={localSettings.facebookAutoPublish}
                        onChange={e =>
                          setLocalSettings({ ...localSettings, facebookAutoPublish: e.target.checked })
                        }
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                      <span>Facebook sahifasiga avtomatik yuborish</span>
                    </label>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">
                        Facebook Sahifasi ID si
                      </label>
                      <input
                        type="text"
                        placeholder="masalan: 10928374659"
                        value={localSettings.facebookPageId}
                        onChange={e =>
                          setLocalSettings({ ...localSettings, facebookPageId: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded border border-slate-300 focus:border-blue-500 font-mono"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">
                        Facebook Page Access Token
                      </label>
                      <input
                        type="password"
                        placeholder="EAA..."
                        value={localSettings.facebookPageToken}
                        onChange={e =>
                          setLocalSettings({ ...localSettings, facebookPageToken: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded border border-slate-300 focus:border-blue-500 font-mono"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      onClick={async () => {
                        await updateSettings(localSettings);
                        alert("Facebook sozlamalari saqlandi!");
                      }}
                      className="px-4 py-1.5 rounded bg-blue-700 hover:bg-blue-800 text-white font-bold"
                    >
                      Saqlash
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* TAB 10: CONTACT & DISTRICT SETTINGS                      */}
            {/* ======================================================== */}
            {activeTab === 'contacts' && (
              <div className="bg-white rounded border border-slate-200 border-t-4 border-t-sky-600 shadow-xs p-6 space-y-4 text-xs">
                <div className="flex items-center justify-between border-b pb-3">
                  <h3 className="font-bold text-slate-800 text-sm">
                    9. Aloqa Ma’lumotlari, Ish Tartibi va Tuman Statistikasi
                  </h3>
                  <UzbekLetterHelper
                    compact
                    onInsertLetter={(letter) => {
                      setLocalSettings(prev => ({
                        ...prev,
                        address: prev.address + letter
                      }));
                    }}
                    onAutoFix={() => {
                      setLocalSettings(prev => ({
                        ...prev,
                        address: fixUzbekText(prev.address),
                        workingHours: fixUzbekText(prev.workingHours),
                        marqueeText: fixUzbekText(prev.marqueeText)
                      }));
                    }}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Tuman Nomi</label>
                    <input
                      type="text"
                      value={localSettings.districtName}
                      onChange={e => setLocalSettings({ ...localSettings, districtName: e.target.value })}
                      className="w-full px-3 py-2 rounded border border-slate-300"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Bo‘lim Telefon Raqami</label>
                    <input
                      type="text"
                      value={localSettings.departmentPhone}
                      onChange={e => setLocalSettings({ ...localSettings, departmentPhone: e.target.value })}
                      className="w-full px-3 py-2 rounded border border-slate-300"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Ishonch Telefoni</label>
                    <input
                      type="text"
                      value={localSettings.trustPhone}
                      onChange={e => setLocalSettings({ ...localSettings, trustPhone: e.target.value })}
                      className="w-full px-3 py-2 rounded border border-slate-300"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Rasmiy Elektron Pochta</label>
                    <input
                      type="email"
                      value={localSettings.email}
                      onChange={e => setLocalSettings({ ...localSettings, email: e.target.value })}
                      className="w-full px-3 py-2 rounded border border-slate-300"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Ish Tartibi (Ish vaqti)</label>
                    <input
                      type="text"
                      value={localSettings.workingHours}
                      onChange={e => setLocalSettings({ ...localSettings, workingHours: e.target.value })}
                      className="w-full px-3 py-2 rounded border border-slate-300"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Pochta Manzili</label>
                    <input
                      type="text"
                      value={localSettings.address}
                      onChange={e => setLocalSettings({ ...localSettings, address: e.target.value })}
                      className="w-full px-3 py-2 rounded border border-slate-300"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Jami O‘quvchilar Soni</label>
                    <input
                      type="number"
                      value={localSettings.studentsTotal}
                      onChange={e => setLocalSettings({ ...localSettings, studentsTotal: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 rounded border border-slate-300"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Jami O‘qituvchilar Soni</label>
                    <input
                      type="number"
                      value={localSettings.teachersTotal}
                      onChange={e => setLocalSettings({ ...localSettings, teachersTotal: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 rounded border border-slate-300"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Oliy Toifali O‘qituvchilar Soni</label>
                    <input
                      type="number"
                      value={localSettings.higherCategoryTeachersCount}
                      onChange={e => setLocalSettings({ ...localSettings, higherCategoryTeachersCount: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 rounded border border-slate-300"
                    />
                  </div>

                  <div className="md:col-span-2 lg:col-span-3">
                    <label className="font-bold text-slate-700 block mb-1">
                      Sayt Yuqorisidagi Yuguruvchi Satr Matni (Marquee)
                    </label>
                    <input
                      type="text"
                      value={localSettings.marqueeText}
                      onChange={e => setLocalSettings({ ...localSettings, marqueeText: e.target.value })}
                      className="w-full px-3 py-2 rounded border border-slate-300"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-3 border-t">
                  <button
                    onClick={async () => {
                      await updateSettings(localSettings);
                      alert("Aloqa va statistika sozlamalari muvaffaqiyatli saqlandi!");
                    }}
                    className="px-4 py-2 rounded bg-sky-700 hover:bg-sky-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs"
                  >
                    <Save className="w-4 h-4" />
                    <span>Saqlash</span>
                  </button>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* TAB 11: GOOGLE SHEETS & DRIVE DETAILS                     */}
            {/* ======================================================== */}
            {activeTab === 'sheets' && (
              <div className="bg-white rounded border border-slate-200 border-t-4 border-t-emerald-600 shadow-xs p-6 space-y-4 text-xs">
                <div className="border-b pb-3">
                  <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                    <Database className="w-5 h-5 text-emerald-600" />
                    <span>Google Sheets va Google Drive Bilan To‘liq Integratsiya</span>
                  </h3>
                  <p className="text-slate-500 mt-0.5">
                    Saytdagi ma’lumotlar bazasi Google Sheets hisobingizda doimiy va xavfsiz saqlanadi
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800 text-sm">Google Hisobiga Ulanish Holati:</span>
                      <span className={`px-2.5 py-1 rounded text-xs font-bold ${
                        googleSyncStatus.isConnected ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {googleSyncStatus.isConnected ? 'Ulangan' : 'Ulanmagan'}
                      </span>
                    </div>

                    {user && (
                      <div className="text-slate-600">
                        Ulangan hisob: <strong className="text-slate-900">{user.email}</strong> ({user.displayName || 'Admin'})
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2 pt-2">
                      <button
                        onClick={syncNow}
                        disabled={googleSyncStatus.syncing}
                        className="px-3 py-1.5 rounded bg-sky-700 hover:bg-sky-800 text-white font-semibold flex items-center gap-1.5"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${googleSyncStatus.syncing ? 'animate-spin' : ''}`} />
                        <span>{googleSyncStatus.syncing ? "Sinxronlanmoqda..." : "Hoziroq Sinxronlash"}</span>
                      </button>

                      {user ? (
                        <button
                          onClick={logoutGoogle}
                          className="px-3 py-1.5 rounded bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold"
                        >
                          Google Hisobidan Chiqish
                        </button>
                      ) : (
                        <button
                          onClick={loginWithGoogle}
                          className="px-3 py-1.5 rounded bg-emerald-700 hover:bg-emerald-800 text-white font-semibold flex items-center gap-1.5"
                        >
                          <Database className="w-3.5 h-3.5" />
                          <span>Google Bilan Kirish (Sheets & Drive ruxsati)</span>
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded border border-slate-200 space-y-2">
                      <span className="font-bold text-slate-800 block text-sm">Google Sheets Varaqlari (Tabs):</span>
                      <ul className="list-disc list-inside space-y-1 text-slate-600">
                        <li><code>Yangiliklar</code> - Barcha matbuot xabarlari</li>
                        <li><code>Tashkilotlar</code> - 54 maktab va 38 MTT ro‘yxati</li>
                        <li><code>Rahbariyat</code> - Bo‘lim mudiri va o‘rinbosarlari</li>
                        <li><code>Hujjatlar</code> - Buyruqlar va qarorlar</li>
                        <li><code>Arizalar</code> - Fuqaro murojaatlari</li>
                        <li><code>Sozlamalar</code> - Aloqa, ijtimoiy tarmoqlar va banner</li>
                      </ul>
                    </div>

                    <div className="p-4 rounded border border-slate-200 space-y-2">
                      <span className="font-bold text-slate-800 block text-sm">Google Drive Ombori:</span>
                      <p className="text-slate-600 leading-relaxed">
                        Hujjatlar bo‘limiga yuklangan barcha PDF fayllar hamda yangiliklar rasmlari avtomatik ravishda Drive’dagi maxsus <code>Qo'shko'pir_MMTB_Fayllar</code> papkasiga saqlanadi.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* ============================================================== */}
      {/* MODAL 1: NEWS CREATE / EDIT (WITH TG, IG, FB BROADCAST)        */}
      {/* ============================================================== */}
      {newsModal.isOpen && (
        <div className="fixed inset-0 z-60 bg-black/70 backdrop-blur-2xs flex items-center justify-center p-3 overflow-y-auto">
          <div className="bg-white rounded-lg w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl border border-slate-300 overflow-hidden my-auto">
            {/* Modal Header */}
            <div className="bg-slate-800 text-white px-5 py-3.5 flex items-center justify-between border-b border-slate-700">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <FileText className="w-4 h-4 text-sky-400" />
                <span>{newsModal.isEdit ? "Yangilikni Tahrirlash" : "Yangi Yangilik Kiritish va Ijtimoiy Tarmoqlarga Tarqatish"}</span>
              </h3>
              <button
                onClick={() => setNewsModal({ ...newsModal, isOpen: false })}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto space-y-4 text-xs flex-1">
              {/* Uzbek letter helper toolbar */}
              <UzbekLetterHelper
                onInsertLetter={(letter) => {
                  setNewsModal(prev => ({
                    ...prev,
                    item: {
                      ...prev.item,
                      title: (prev.item.title || '') + letter
                    }
                  }));
                }}
                onAutoFix={() => {
                  setNewsModal(prev => ({
                    ...prev,
                    item: {
                      ...prev.item,
                      title: fixUzbekText(prev.item.title || ''),
                      summary: fixUzbekText(prev.item.summary || ''),
                      content: fixUzbekText(prev.item.content || ''),
                      author: fixUzbekText(prev.item.author || '')
                    }
                  }));
                }}
              />

              <div>
                <label className="font-bold text-slate-800 block mb-1">Yangilik Sarlavhasi</label>
                <input
                  type="text"
                  placeholder="masalan: Qo‘shko‘pir tumanida yangi innovatsion maktab binosi foydalanishga topshirildi"
                  value={newsModal.item.title || ''}
                  onChange={e =>
                    setNewsModal({
                      ...newsModal,
                      item: { ...newsModal.item, title: e.target.value }
                    })
                  }
                  className="w-full px-3 py-2 rounded border border-slate-300 focus:border-sky-500 font-semibold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Kategoriya</label>
                  <select
                    value={newsModal.item.category || "Boshlang'ich ta'lim"}
                    onChange={e =>
                      setNewsModal({
                        ...newsModal,
                        item: { ...newsModal.item, category: e.target.value as any }
                      })
                    }
                    className="w-full px-3 py-2 rounded border border-slate-300"
                  >
                    <option value="Boshlang'ich ta'lim">Boshlang‘ich ta’lim</option>
                    <option value="Olimpiada">Olimpiada va fan tanlovlari</option>
                    <option value="Pedagogika">Pedagogika va metodika</option>
                    <option value="MTT">Maktabgacha ta’lim (MTT)</option>
                    <option value="E'lon">Rasmiy e’lon</option>
                    <option value="Tadbirlar">Tadbirlar va bayramlar</option>
                    <option value="Boshqaruv">Bo‘lim boshqaruvi</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Sanasi</label>
                  <input
                    type="date"
                    value={newsModal.item.date || ''}
                    onChange={e =>
                      setNewsModal({
                        ...newsModal,
                        item: { ...newsModal.item, date: e.target.value }
                      })
                    }
                    className="w-full px-3 py-2 rounded border border-slate-300"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Muallif / Manba</label>
                  <input
                    type="text"
                    value={newsModal.item.author || "Qo‘shko‘pir MMTB Matbuot xizmati"}
                    onChange={e =>
                      setNewsModal({
                        ...newsModal,
                        item: { ...newsModal.item, author: e.target.value }
                      })
                    }
                    className="w-full px-3 py-2 rounded border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Qisqacha mazmun (Lenta va Ijtimoiy tarmoqlar anonsi)
                </label>
                <textarea
                  rows={2}
                  value={newsModal.item.summary || ''}
                  onChange={e =>
                    setNewsModal({
                      ...newsModal,
                      item: { ...newsModal.item, summary: e.target.value }
                    })
                  }
                  className="w-full px-3 py-2 rounded border border-slate-300 focus:border-sky-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">To‘liq Matn</label>
                <textarea
                  rows={6}
                  value={newsModal.item.content || ''}
                  onChange={e =>
                    setNewsModal({
                      ...newsModal,
                      item: { ...newsModal.item, content: e.target.value }
                    })
                  }
                  className="w-full px-3 py-2 rounded border border-slate-300 focus:border-sky-500 font-sans"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Yangilik Rasmi (URL yoki Drive)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="https://... yoki fayl tanlang"
                    value={newsModal.item.imageUrl || ''}
                    onChange={e =>
                      setNewsModal({
                        ...newsModal,
                        item: { ...newsModal.item, imageUrl: e.target.value }
                      })
                    }
                    className="flex-1 px-3 py-2 rounded border border-slate-300"
                  />
                  <label className="cursor-pointer px-3 py-2 rounded bg-slate-100 hover:bg-slate-200 border border-slate-300 font-semibold text-slate-700 flex items-center gap-1 shrink-0">
                    <Upload className="w-3.5 h-3.5 text-sky-600" />
                    <span>Yuklash</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={e =>
                        handleDriveFileUpload(e, (url, driveId) => {
                          setNewsModal(prev => ({
                            ...prev,
                            item: { ...prev.item, imageUrl: url, driveFileId: driveId }
                          }));
                        })
                      }
                    />
                  </label>
                </div>
              </div>

              {/* Social Media Broadcast Options (Telegram, Instagram, Facebook) */}
              <div className="p-4 rounded-lg bg-sky-50/70 border border-sky-200 space-y-3">
                <span className="font-bold text-slate-900 block text-xs">
                  Ijtimoiy Tarmoqlarga Avtomatik Yuborish Sozlamalari:
                </span>

                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center gap-2 cursor-pointer font-semibold text-sky-900">
                    <input
                      type="checkbox"
                      checked={newsModal.broadcastToTelegram}
                      onChange={e =>
                        setNewsModal({ ...newsModal, broadcastToTelegram: e.target.checked })
                      }
                      className="rounded text-sky-600"
                    />
                    <Send className="w-3.5 h-3.5 text-sky-600" />
                    <span>Telegram Kanaliga (@{localSettings.telegramChannelUsername || 'qoshkopir_mmtb'})</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer font-semibold text-pink-900">
                    <input
                      type="checkbox"
                      checked={newsModal.broadcastToInstagram}
                      onChange={e =>
                        setNewsModal({ ...newsModal, broadcastToInstagram: e.target.checked })
                      }
                      className="rounded text-pink-600"
                    />
                    <Instagram className="w-3.5 h-3.5 text-pink-600" />
                    <span>Instagram Sahifasiga</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer font-semibold text-blue-900">
                    <input
                      type="checkbox"
                      checked={newsModal.broadcastToFacebook}
                      onChange={e =>
                        setNewsModal({ ...newsModal, broadcastToFacebook: e.target.checked })
                      }
                      className="rounded text-blue-600"
                    />
                    <Facebook className="w-3.5 h-3.5 text-blue-600" />
                    <span>Facebook Sahifasiga</span>
                  </label>
                </div>

                {/* Instagram Quick Copy Helper */}
                <div className="pt-2 border-t border-sky-200/60 flex items-center justify-between">
                  <span className="text-[11px] text-slate-600">
                    Instagram uchun tayyor post matni va hashtaglarini nusxalash:
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const tempNews = {
                        title: newsModal.item.title || '',
                        summary: newsModal.item.summary || '',
                        date: newsModal.item.date || '',
                        category: newsModal.item.category || "Boshlang'ich ta'lim",
                        author: newsModal.item.author || '',
                        id: '',
                        views: 0,
                        imageUrl: '',
                        content: ''
                      } as NewsItem;
                      const caption = formatInstagramCaption(tempNews);
                      navigator.clipboard.writeText(caption);
                      setCopiedCaption(true);
                      setTimeout(() => setCopiedCaption(false), 3000);
                    }}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-white hover:bg-pink-50 border border-pink-300 text-pink-700 font-semibold text-[11px]"
                  >
                    {copiedCaption ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCaption ? "Nusxalandi!" : "Instagram matnini nusxalash"}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-100 px-5 py-3 border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={() => setNewsModal({ ...newsModal, isOpen: false })}
                className="px-4 py-1.5 rounded bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold text-xs"
              >
                Bekor qilish
              </button>

              <button
                onClick={async () => {
                  if (!newsModal.item.title) {
                    alert("Iltimos, yangilik sarlavhasini kiriting.");
                    return;
                  }

                  const finalItem: NewsItem = {
                    id: newsModal.item.id || `news-${Date.now()}`,
                    title: fixUzbekText(newsModal.item.title),
                    category: newsModal.item.category || "Boshlang'ich ta'lim",
                    date: newsModal.item.date || new Date().toISOString().split('T')[0],
                    summary: fixUzbekText(newsModal.item.summary || ''),
                    content: fixUzbekText(newsModal.item.content || ''),
                    imageUrl: newsModal.item.imageUrl || '/assets/aistudio/image_0a3ac00b.png',
                    driveFileId: newsModal.item.driveFileId,
                    author: fixUzbekText(newsModal.item.author || "Qo‘shko‘pir MMTB Matbuot xizmati"),
                    views: newsModal.item.views || 100,
                    isPinned: newsModal.item.isPinned,
                    sentToTelegram: newsModal.item.sentToTelegram,
                    sentToFacebook: newsModal.item.sentToFacebook,
                    sentToInstagram: newsModal.item.sentToInstagram
                  };

                  // 1. Broadcast to Telegram if requested
                  if (newsModal.broadcastToTelegram && localSettings.telegramBotToken) {
                    const tgRes = await postToTelegram(
                      localSettings.telegramBotToken,
                      localSettings.telegramChannelUsername,
                      finalItem,
                      localSettings
                    );
                    if (tgRes.success) {
                      finalItem.sentToTelegram = true;
                      finalItem.telegramMessageId = tgRes.messageId;
                    }
                  }

                  // 2. Broadcast to Instagram if requested
                  if (newsModal.broadcastToInstagram && localSettings.instagramAccountId && localSettings.instagramAccessToken) {
                    const igRes = await postToInstagram(
                      localSettings.instagramAccountId,
                      localSettings.instagramAccessToken,
                      finalItem
                    );
                    if (igRes.success) {
                      finalItem.sentToInstagram = true;
                      finalItem.instagramMediaId = igRes.mediaId;
                    }
                  }

                  // 3. Broadcast to Facebook if requested
                  if (newsModal.broadcastToFacebook && localSettings.facebookPageId && localSettings.facebookPageToken) {
                    const fbRes = await postToFacebook(
                      localSettings.facebookPageId,
                      localSettings.facebookPageToken,
                      finalItem
                    );
                    if (fbRes.success) {
                      finalItem.sentToFacebook = true;
                    }
                  }

                  if (newsModal.isEdit) {
                    await updateNews(finalItem);
                  } else {
                    await addNews(finalItem);
                  }

                  setNewsModal({ ...newsModal, isOpen: false });
                }}
                className="px-5 py-1.5 rounded bg-sky-700 hover:bg-sky-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs"
              >
                <Save className="w-4 h-4" />
                <span>{newsModal.isEdit ? "O‘zgarishlarni Saqlash" : "Yangilikni Joylash & Tarqatish"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 2: ORGANIZATION CREATE / EDIT                            */}
      {/* ============================================================== */}
      {orgModal.isOpen && (
        <div className="fixed inset-0 z-60 bg-black/70 backdrop-blur-2xs flex items-center justify-center p-3 overflow-y-auto">
          <div className="bg-white rounded-lg w-full max-w-2xl flex flex-col shadow-2xl border border-slate-300 overflow-hidden my-auto">
            <div className="bg-slate-800 text-white px-5 py-3.5 flex items-center justify-between border-b border-slate-700">
              <h3 className="font-bold text-sm">
                {orgModal.isEdit ? "Muassasani Tahrirlash" : "Yangi Maktab yoki MTT Qo‘shish"}
              </h3>
              <button onClick={() => setOrgModal({ ...orgModal, isOpen: false })} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs overflow-y-auto max-h-[80vh]">
              <UzbekLetterHelper
                onInsertLetter={(letter) => {
                  setOrgModal(prev => ({
                    ...prev,
                    item: { ...prev.item, name: (prev.item.name || '') + letter }
                  }));
                }}
                onAutoFix={() => {
                  setOrgModal(prev => ({
                    ...prev,
                    item: {
                      ...prev.item,
                      name: fixUzbekText(prev.item.name || ''),
                      director: fixUzbekText(prev.item.director || ''),
                      address: fixUzbekText(prev.item.address || '')
                    }
                  }));
                }}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Muassasa Nomi</label>
                  <input
                    type="text"
                    placeholder="masalan: 1-son umumta’lim maktabi"
                    value={orgModal.item.name || ''}
                    onChange={e => setOrgModal({ ...orgModal, item: { ...orgModal.item, name: e.target.value } })}
                    className="w-full px-3 py-2 rounded border border-slate-300 font-semibold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Turi</label>
                  <select
                    value={orgModal.item.type || 'maktab'}
                    onChange={e => setOrgModal({ ...orgModal, item: { ...orgModal.item, type: e.target.value as any } })}
                    className="w-full px-3 py-2 rounded border border-slate-300"
                  >
                    <option value="maktab">Umumta’lim Maktabi</option>
                    <option value="mtt">Maktabgacha Ta’lim Tashkiloti (MTT)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Direktor / Mudir F.I.O</label>
                  <input
                    type="text"
                    value={orgModal.item.director || ''}
                    onChange={e => setOrgModal({ ...orgModal, item: { ...orgModal.item, director: e.target.value } })}
                    className="w-full px-3 py-2 rounded border border-slate-300"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Telefon Raqami</label>
                  <input
                    type="text"
                    value={orgModal.item.phone || '+998 62 '}
                    onChange={e => setOrgModal({ ...orgModal, item: { ...orgModal.item, phone: e.target.value } })}
                    className="w-full px-3 py-2 rounded border border-slate-300 font-mono"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">O‘quvchilar / Tarbiyalanuvchilar soni</label>
                  <input
                    type="number"
                    value={orgModal.item.studentsCount || 0}
                    onChange={e => setOrgModal({ ...orgModal, item: { ...orgModal.item, studentsCount: parseInt(e.target.value) || 0 } })}
                    className="w-full px-3 py-2 rounded border border-slate-300"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">O‘qituvchilar / Tarbiyachilar soni</label>
                  <input
                    type="number"
                    value={orgModal.item.teachersCount || 0}
                    onChange={e => setOrgModal({ ...orgModal, item: { ...orgModal.item, teachersCount: parseInt(e.target.value) || 0 } })}
                    className="w-full px-3 py-2 rounded border border-slate-300"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-700 block mb-1">Manzil (Mahalla, ko‘cha)</label>
                  <input
                    type="text"
                    value={orgModal.item.address || ''}
                    onChange={e => setOrgModal({ ...orgModal, item: { ...orgModal.item, address: e.target.value } })}
                    className="w-full px-3 py-2 rounded border border-slate-300"
                  />
                </div>
              </div>
            </div>

            <div className="bg-slate-100 px-5 py-3 border-t border-slate-200 flex justify-end gap-2">
              <button
                onClick={() => setOrgModal({ ...orgModal, isOpen: false })}
                className="px-4 py-1.5 rounded bg-slate-200 text-slate-700 font-semibold"
              >
                Bekor qilish
              </button>
              <button
                onClick={async () => {
                  if (!orgModal.item.name) {
                    alert("Muassasa nomini kiriting!");
                    return;
                  }
                  const finalOrg: Organization = {
                    id: orgModal.item.id || `org-${Date.now()}`,
                    number: orgModal.item.number || 1,
                    name: fixUzbekText(orgModal.item.name),
                    type: orgModal.item.type || 'maktab',
                    director: fixUzbekText(orgModal.item.director || ''),
                    address: fixUzbekText(orgModal.item.address || ''),
                    mahalla: orgModal.item.mahalla || 'Markaz',
                    phone: orgModal.item.phone || '',
                    email: orgModal.item.email || '',
                    studentsCount: orgModal.item.studentsCount || 0,
                    teachersCount: orgModal.item.teachersCount || 0,
                    shifts: orgModal.item.shifts || 1,
                    establishedYear: orgModal.item.establishedYear || 1990,
                    rating: orgModal.item.rating || 4.5,
                    inn: orgModal.item.inn || '',
                    photoUrl: orgModal.item.photoUrl || ''
                  };
                  if (orgModal.isEdit) {
                    await updateOrganization(finalOrg);
                  } else {
                    await addOrganization(finalOrg);
                  }
                  setOrgModal({ ...orgModal, isOpen: false });
                }}
                className="px-4 py-1.5 rounded bg-emerald-700 hover:bg-emerald-800 text-white font-bold"
              >
                Saqlash
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 3: DOCUMENT CREATE / EDIT                                */}
      {/* ============================================================== */}
      {docModal.isOpen && (
        <div className="fixed inset-0 z-60 bg-black/70 backdrop-blur-2xs flex items-center justify-center p-3 overflow-y-auto">
          <div className="bg-white rounded-lg w-full max-w-xl flex flex-col shadow-2xl border border-slate-300 overflow-hidden my-auto">
            <div className="bg-slate-800 text-white px-5 py-3.5 flex items-center justify-between border-b border-slate-700">
              <h3 className="font-bold text-sm">
                {docModal.isEdit ? "Hujjatni Tahrirlash" : "Yangi Me’yoriy Hujjat Joylash"}
              </h3>
              <button onClick={() => setDocModal({ ...docModal, isOpen: false })} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs overflow-y-auto max-h-[80vh]">
              <UzbekLetterHelper
                onInsertLetter={(letter) => {
                  setDocModal(prev => ({
                    ...prev,
                    item: { ...prev.item, title: (prev.item.title || '') + letter }
                  }));
                }}
                onAutoFix={() => {
                  setDocModal(prev => ({
                    ...prev,
                    item: {
                      ...prev.item,
                      title: fixUzbekText(prev.item.title || '')
                    }
                  }));
                }}
              />

              <div>
                <label className="font-bold text-slate-700 block mb-1">Hujjat Sarlavhasi</label>
                <input
                  type="text"
                  placeholder="masalan: 2026/2027 o‘quv yiliga tayyorgarlik to‘g‘risida bo‘lim buyrug‘i"
                  value={docModal.item.title || ''}
                  onChange={e => setDocModal({ ...docModal, item: { ...docModal.item, title: e.target.value } })}
                  className="w-full px-3 py-2 rounded border border-slate-300 font-semibold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Hujjat Raqami</label>
                  <input
                    type="text"
                    placeholder="№ 14-son"
                    value={docModal.item.docNumber || ''}
                    onChange={e => setDocModal({ ...docModal, item: { ...docModal.item, docNumber: e.target.value } })}
                    className="w-full px-3 py-2 rounded border border-slate-300 font-mono"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Sanasi</label>
                  <input
                    type="date"
                    value={docModal.item.date || ''}
                    onChange={e => setDocModal({ ...docModal, item: { ...docModal.item, date: e.target.value } })}
                    className="w-full px-3 py-2 rounded border border-slate-300"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-700 block mb-1">Kategoriya</label>
                  <select
                    value={docModal.item.category || 'Bo\'lim buyruqlari'}
                    onChange={e => setDocModal({ ...docModal, item: { ...docModal.item, category: e.target.value as any } })}
                    className="w-full px-3 py-2 rounded border border-slate-300"
                  >
                    <option value="Bo'lim buyruqlari">Bo‘lim buyruqlari</option>
                    <option value="Vazirlik buyruqlari">Vazirlik buyruqlari</option>
                    <option value="Hokim qarorlari">Hokim qarorlari</option>
                    <option value="Nizom va qoidalar">Nizom va qoidalar</option>
                    <option value="O'quv dasturlari">O‘quv dasturlari</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-700 block mb-1">Fayl (PDF yoki Hujjat)</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Fayl havolasi"
                      value={docModal.item.fileUrl || ''}
                      onChange={e => setDocModal({ ...docModal, item: { ...docModal.item, fileUrl: e.target.value } })}
                      className="flex-1 px-3 py-2 rounded border border-slate-300"
                    />
                    <label className="cursor-pointer px-3 py-2 rounded bg-amber-50 hover:bg-amber-100 border border-amber-300 font-semibold text-amber-800 flex items-center gap-1 shrink-0">
                      <Upload className="w-3.5 h-3.5 text-amber-600" />
                      <span>Drive’ga yuklash</span>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,.xls,.xlsx"
                        className="hidden"
                        onChange={e =>
                          handleDriveFileUpload(e, (url, driveId, size) => {
                            setDocModal(prev => ({
                              ...prev,
                              item: {
                                ...prev.item,
                                fileUrl: url,
                                driveFileId: driveId,
                                fileSize: size || '1.2 MB'
                              }
                            }));
                          })
                        }
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-100 px-5 py-3 border-t border-slate-200 flex justify-end gap-2">
              <button
                onClick={() => setDocModal({ ...docModal, isOpen: false })}
                className="px-4 py-1.5 rounded bg-slate-200 text-slate-700 font-semibold"
              >
                Bekor qilish
              </button>
              <button
                onClick={async () => {
                  if (!docModal.item.title) {
                    alert("Hujjat sarlavhasini kiriting!");
                    return;
                  }
                  const finalDoc: DocumentItem = {
                    id: docModal.item.id || `doc-${Date.now()}`,
                    title: fixUzbekText(docModal.item.title),
                    docNumber: docModal.item.docNumber || '№ 1',
                    date: docModal.item.date || new Date().toISOString().split('T')[0],
                    category: docModal.item.category || 'Bo\'lim buyruqlari',
                    fileUrl: docModal.item.fileUrl || '',
                    driveFileId: docModal.item.driveFileId,
                    fileSize: docModal.item.fileSize || 'PDF',
                    fileType: docModal.item.fileType || 'PDF'
                  };
                  if (docModal.isEdit) {
                    await updateDocument(finalDoc);
                  } else {
                    await addDocument(finalDoc);
                  }
                  setDocModal({ ...docModal, isOpen: false });
                }}
                className="px-4 py-1.5 rounded bg-amber-600 hover:bg-amber-700 text-white font-bold"
              >
                Saqlash
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 4: APPEAL REPLY MODAL                                    */}
      {/* ============================================================== */}
      {appealModal.isOpen && appealModal.item && (
        <div className="fixed inset-0 z-60 bg-black/70 backdrop-blur-2xs flex items-center justify-center p-3 overflow-y-auto">
          <div className="bg-white rounded-lg w-full max-w-xl flex flex-col shadow-2xl border border-slate-300 overflow-hidden my-auto">
            <div className="bg-slate-800 text-white px-5 py-3.5 flex items-center justify-between border-b border-slate-700">
              <h3 className="font-bold text-sm">
                Fuqaro Murojaatini Ko‘rib Chiqish (№ {appealModal.item.trackingCode})
              </h3>
              <button onClick={() => setAppealModal({ ...appealModal, isOpen: false })} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs overflow-y-auto max-h-[80vh]">
              <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-1">
                <div>Fuqaro: <strong className="text-slate-900">{appealModal.item.fullName}</strong></div>
                <div>Telefon: <span className="font-mono">{appealModal.item.phone}</span></div>
                <div>Manzil: <span>{appealModal.item.address}</span></div>
                <div className="font-semibold text-slate-800 pt-1">Mavzu: {appealModal.item.subject}</div>
                <p className="p-2 rounded bg-white border border-slate-200 text-slate-700 mt-1 italic">
                  "{appealModal.item.message}"
                </p>
              </div>

              <UzbekLetterHelper
                onInsertLetter={(letter) => {
                  setAppealModal(prev => ({
                    ...prev,
                    replyText: prev.replyText + letter
                  }));
                }}
                onAutoFix={() => {
                  setAppealModal(prev => ({
                    ...prev,
                    replyText: fixUzbekText(prev.replyText),
                    officer: fixUzbekText(prev.officer)
                  }));
                }}
              />

              <div>
                <label className="font-bold text-slate-700 block mb-1">Murojaat Holati</label>
                <select
                  value={appealModal.status}
                  onChange={e => setAppealModal({ ...appealModal, status: e.target.value as any })}
                  className="w-full px-3 py-2 rounded border border-slate-300 font-semibold"
                >
                  <option value="yangi">Yangi (Qabul qilindi)</option>
                  <option value="jarayonda">Jarayonda (O‘rganilmoqda)</option>
                  <option value="ijro_etildi">Ijro etildi (Javob berildi)</option>
                  <option value="rad_etildi">Rad etildi (Asossiz deb topildi)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Mas’ul Ijrochi / Lavozimi</label>
                <input
                  type="text"
                  value={appealModal.officer}
                  onChange={e => setAppealModal({ ...appealModal, officer: e.target.value })}
                  className="w-full px-3 py-2 rounded border border-slate-300"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Rasmiy Javob Xati Matni</label>
                <textarea
                  rows={4}
                  value={appealModal.replyText}
                  onChange={e => setAppealModal({ ...appealModal, replyText: e.target.value })}
                  placeholder="Fuqaroga taqdim etiladigan rasmiy javob..."
                  className="w-full px-3 py-2 rounded border border-slate-300 focus:border-sky-500"
                />
              </div>
            </div>

            <div className="bg-slate-100 px-5 py-3 border-t border-slate-200 flex justify-end gap-2">
              <button
                onClick={() => setAppealModal({ ...appealModal, isOpen: false })}
                className="px-4 py-1.5 rounded bg-slate-200 text-slate-700 font-semibold"
              >
                Bekor qilish
              </button>
              <button
                onClick={async () => {
                  const updated: CitizenAppeal = {
                    ...appealModal.item!,
                    status: appealModal.status,
                    replyMessage: fixUzbekText(appealModal.replyText),
                    officer: fixUzbekText(appealModal.officer),
                    replyDate: new Date().toISOString().split('T')[0]
                  };
                  await updateAppeal(updated);
                  setAppealModal({ ...appealModal, isOpen: false });
                }}
                className="px-4 py-1.5 rounded bg-sky-700 hover:bg-sky-800 text-white font-bold"
              >
                Javobni Saqlash
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 5: LEADER CREATE / EDIT                                  */}
      {/* ============================================================== */}
      {leaderModal.isOpen && (
        <div className="fixed inset-0 z-60 bg-black/70 backdrop-blur-2xs flex items-center justify-center p-3 overflow-y-auto">
          <div className="bg-white rounded-lg w-full max-w-xl flex flex-col shadow-2xl border border-slate-300 overflow-hidden my-auto">
            <div className="bg-slate-800 text-white px-5 py-3.5 flex items-center justify-between border-b border-slate-700">
              <h3 className="font-bold text-sm">
                {leaderModal.isEdit ? "Rahbar Ma’lumotini Tahrirlash" : "Yangi Rahbar Qo‘shish"}
              </h3>
              <button onClick={() => setLeaderModal({ ...leaderModal, isOpen: false })} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs overflow-y-auto max-h-[80vh]">
              <UzbekLetterHelper
                onInsertLetter={(letter) => {
                  setLeaderModal(prev => ({
                    ...prev,
                    item: { ...prev.item, name: (prev.item.name || '') + letter }
                  }));
                }}
                onAutoFix={() => {
                  setLeaderModal(prev => ({
                    ...prev,
                    item: {
                      ...prev.item,
                      name: fixUzbekText(prev.item.name || ''),
                      position: fixUzbekText(prev.item.position || ''),
                      receptionDays: fixUzbekText(prev.item.receptionDays || ''),
                      bio: fixUzbekText(prev.item.bio || '')
                    }
                  }));
                }}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-700 block mb-1">F.I.O (Ism, familiya, sharifi)</label>
                  <input
                    type="text"
                    value={leaderModal.item.name || ''}
                    onChange={e => setLeaderModal({ ...leaderModal, item: { ...leaderModal.item, name: e.target.value } })}
                    className="w-full px-3 py-2 rounded border border-slate-300 font-semibold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Lavozimi</label>
                  <input
                    type="text"
                    value={leaderModal.item.position || ''}
                    onChange={e => setLeaderModal({ ...leaderModal, item: { ...leaderModal.item, position: e.target.value } })}
                    className="w-full px-3 py-2 rounded border border-slate-300"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Telefon</label>
                  <input
                    type="text"
                    value={leaderModal.item.phone || '+998 62 '}
                    onChange={e => setLeaderModal({ ...leaderModal, item: { ...leaderModal.item, phone: e.target.value } })}
                    className="w-full px-3 py-2 rounded border border-slate-300 font-mono"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Qabul Kunlari</label>
                  <input
                    type="text"
                    value={leaderModal.item.receptionDays || 'Dushanba - Juma'}
                    onChange={e => setLeaderModal({ ...leaderModal, item: { ...leaderModal.item, receptionDays: e.target.value } })}
                    className="w-full px-3 py-2 rounded border border-slate-300"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Qabul Soatlari</label>
                  <input
                    type="text"
                    value={leaderModal.item.receptionHours || '09:00 - 12:00'}
                    onChange={e => setLeaderModal({ ...leaderModal, item: { ...leaderModal.item, receptionHours: e.target.value } })}
                    className="w-full px-3 py-2 rounded border border-slate-300"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-700 block mb-1">Fotosurat (URL yoki Drive)</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={leaderModal.item.photoUrl || ''}
                      onChange={e => setLeaderModal({ ...leaderModal, item: { ...leaderModal.item, photoUrl: e.target.value } })}
                      className="flex-1 px-3 py-2 rounded border border-slate-300"
                    />
                    <label className="cursor-pointer px-3 py-2 rounded bg-slate-100 hover:bg-slate-200 border border-slate-300 font-semibold text-slate-700 flex items-center gap-1 shrink-0">
                      <Upload className="w-3.5 h-3.5 text-sky-600" />
                      <span>Yuklash</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={e =>
                          handleDriveFileUpload(e, url => {
                            setLeaderModal(prev => ({
                              ...prev,
                              item: { ...prev.item, photoUrl: url }
                            }));
                          })
                        }
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-100 px-5 py-3 border-t border-slate-200 flex justify-end gap-2">
              <button
                onClick={() => setLeaderModal({ ...leaderModal, isOpen: false })}
                className="px-4 py-1.5 rounded bg-slate-200 text-slate-700 font-semibold"
              >
                Bekor qilish
              </button>
              <button
                onClick={async () => {
                  if (!leaderModal.item.name) {
                    alert("F.I.O ni kiriting!");
                    return;
                  }
                  const finalLeader: Leader = {
                    id: leaderModal.item.id || `ldr-${Date.now()}`,
                    name: fixUzbekText(leaderModal.item.name),
                    position: fixUzbekText(leaderModal.item.position || ''),
                    department: leaderModal.item.department || "Rahbariyat",
                    phone: leaderModal.item.phone || '',
                    email: leaderModal.item.email || '',
                    receptionDays: fixUzbekText(leaderModal.item.receptionDays || 'Har kuni'),
                    receptionHours: leaderModal.item.receptionHours || '09:00 - 12:00',
                    bio: fixUzbekText(leaderModal.item.bio || ''),
                    photoUrl: leaderModal.item.photoUrl || '/assets/aistudio/image_0a3ac00b.png',
                    order: leaderModal.item.order || leaders.length + 1
                  };
                  if (leaderModal.isEdit) {
                    await updateLeader(finalLeader);
                  } else {
                    await addLeader(finalLeader);
                  }
                  setLeaderModal({ ...leaderModal, isOpen: false });
                }}
                className="px-4 py-1.5 rounded bg-sky-700 hover:bg-sky-800 text-white font-bold"
              >
                Saqlash
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 6: BRANCH CREATE / EDIT                                  */}
      {/* ============================================================== */}
      {branchModal.isOpen && (
        <div className="fixed inset-0 z-60 bg-black/70 backdrop-blur-2xs flex items-center justify-center p-3 overflow-y-auto">
          <div className="bg-white rounded-lg w-full max-w-xl flex flex-col shadow-2xl border border-slate-300 overflow-hidden my-auto">
            <div className="bg-slate-800 text-white px-5 py-3.5 flex items-center justify-between border-b border-slate-700">
              <h3 className="font-bold text-sm">
                {branchModal.isEdit ? "Sho‘bani Tahrirlash" : "Yangi Bo‘lim Sho‘basi Qo‘shish"}
              </h3>
              <button onClick={() => setBranchModal({ ...branchModal, isOpen: false })} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs overflow-y-auto max-h-[80vh]">
              <UzbekLetterHelper
                onInsertLetter={(letter) => {
                  setBranchModal(prev => ({
                    ...prev,
                    item: { ...prev.item, name: (prev.item.name || '') + letter }
                  }));
                }}
                onAutoFix={() => {
                  setBranchModal(prev => ({
                    ...prev,
                    item: {
                      ...prev.item,
                      name: fixUzbekText(prev.item.name || ''),
                      head: fixUzbekText(prev.item.head || ''),
                      description: fixUzbekText(prev.item.description || '')
                    }
                  }));
                }}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-700 block mb-1">Sho‘ba Nomi</label>
                  <input
                    type="text"
                    value={branchModal.item.name || ''}
                    onChange={e => setBranchModal({ ...branchModal, item: { ...branchModal.item, name: e.target.value } })}
                    className="w-full px-3 py-2 rounded border border-slate-300 font-semibold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Sho‘ba Rahbari</label>
                  <input
                    type="text"
                    value={branchModal.item.head || ''}
                    onChange={e => setBranchModal({ ...branchModal, item: { ...branchModal.item, head: e.target.value } })}
                    className="w-full px-3 py-2 rounded border border-slate-300"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Telefon</label>
                  <input
                    type="text"
                    value={branchModal.item.phone || ''}
                    onChange={e => setBranchModal({ ...branchModal, item: { ...branchModal.item, phone: e.target.value } })}
                    className="w-full px-3 py-2 rounded border border-slate-300"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Xodimlar Soni</label>
                  <input
                    type="number"
                    value={branchModal.item.staffCount || 3}
                    onChange={e => setBranchModal({ ...branchModal, item: { ...branchModal.item, staffCount: parseInt(e.target.value) || 1 } })}
                    className="w-full px-3 py-2 rounded border border-slate-300"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-700 block mb-1">Qisqacha Vazifasi</label>
                  <textarea
                    rows={3}
                    value={branchModal.item.description || ''}
                    onChange={e => setBranchModal({ ...branchModal, item: { ...branchModal.item, description: e.target.value } })}
                    className="w-full px-3 py-2 rounded border border-slate-300"
                  />
                </div>
              </div>
            </div>

            <div className="bg-slate-100 px-5 py-3 border-t border-slate-200 flex justify-end gap-2">
              <button
                onClick={() => setBranchModal({ ...branchModal, isOpen: false })}
                className="px-4 py-1.5 rounded bg-slate-200 text-slate-700 font-semibold"
              >
                Bekor qilish
              </button>
              <button
                onClick={async () => {
                  if (!branchModal.item.name) {
                    alert("Sho‘ba nomini kiriting!");
                    return;
                  }
                  const finalBranch: DepartmentBranch = {
                    id: branchModal.item.id || `br-${Date.now()}`,
                    name: fixUzbekText(branchModal.item.name),
                    head: fixUzbekText(branchModal.item.head || ''),
                    phone: branchModal.item.phone || '',
                    staffCount: branchModal.item.staffCount || 1,
                    description: fixUzbekText(branchModal.item.description || '')
                  };

                  let currentBranches = [...(localSettings.branches || [])];
                  if (branchModal.isEdit && branchModal.index !== undefined) {
                    currentBranches[branchModal.index] = finalBranch;
                  } else {
                    currentBranches.push(finalBranch);
                  }

                  const newSettings = { ...localSettings, branches: currentBranches };
                  setLocalSettings(newSettings);
                  await updateSettings(newSettings);
                  setBranchModal({ ...branchModal, isOpen: false });
                }}
                className="px-4 py-1.5 rounded bg-emerald-700 hover:bg-emerald-800 text-white font-bold"
              >
                Saqlash
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 7: QUICK SERVICE CREATE / EDIT                           */}
      {/* ============================================================== */}
      {serviceModal.isOpen && (
        <div className="fixed inset-0 z-60 bg-black/70 backdrop-blur-2xs flex items-center justify-center p-3 overflow-y-auto">
          <div className="bg-white rounded-lg w-full max-w-lg flex flex-col shadow-2xl border border-slate-300 overflow-hidden my-auto">
            <div className="bg-slate-800 text-white px-5 py-3.5 flex items-center justify-between border-b border-slate-700">
              <h3 className="font-bold text-sm">
                {serviceModal.isEdit ? "Xizmatni Tahrirlash" : "Yangi Tezkor Xizmat Qo‘shish"}
              </h3>
              <button onClick={() => setServiceModal({ ...serviceModal, isOpen: false })} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs overflow-y-auto max-h-[80vh]">
              <UzbekLetterHelper
                onInsertLetter={(letter) => {
                  setServiceModal(prev => ({
                    ...prev,
                    item: { ...prev.item, title: (prev.item.title || '') + letter }
                  }));
                }}
                onAutoFix={() => {
                  setServiceModal(prev => ({
                    ...prev,
                    item: {
                      ...prev.item,
                      title: fixUzbekText(prev.item.title || ''),
                      desc: fixUzbekText(prev.item.desc || '')
                    }
                  }));
                }}
              />

              <div>
                <label className="font-bold text-slate-700 block mb-1">Xizmat Nomi</label>
                <input
                  type="text"
                  value={serviceModal.item.title || ''}
                  onChange={e => setServiceModal({ ...serviceModal, item: { ...serviceModal.item, title: e.target.value } })}
                  className="w-full px-3 py-2 rounded border border-slate-300 font-semibold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Qisqacha Ta’rif</label>
                <input
                  type="text"
                  value={serviceModal.item.desc || ''}
                  onChange={e => setServiceModal({ ...serviceModal, item: { ...serviceModal.item, desc: e.target.value } })}
                  className="w-full px-3 py-2 rounded border border-slate-300"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Havola (Link)</label>
                <input
                  type="text"
                  placeholder="#virtual-reception yoki https://..."
                  value={serviceModal.item.link || ''}
                  onChange={e => setServiceModal({ ...serviceModal, item: { ...serviceModal.item, link: e.target.value } })}
                  className="w-full px-3 py-2 rounded border border-slate-300 font-mono"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="srvExternal"
                  checked={serviceModal.item.isExternal || false}
                  onChange={e => setServiceModal({ ...serviceModal, item: { ...serviceModal.item, isExternal: e.target.checked } })}
                  className="rounded text-sky-600"
                />
                <label htmlFor="srvExternal" className="text-slate-700 font-medium">Tashqi portal havolasi (yangi oynada ochiladi)</label>
              </div>
            </div>

            <div className="bg-slate-100 px-5 py-3 border-t border-slate-200 flex justify-end gap-2">
              <button
                onClick={() => setServiceModal({ ...serviceModal, isOpen: false })}
                className="px-4 py-1.5 rounded bg-slate-200 text-slate-700 font-semibold"
              >
                Bekor qilish
              </button>
              <button
                onClick={async () => {
                  if (!serviceModal.item.title) {
                    alert("Xizmat nomini kiriting!");
                    return;
                  }
                  const finalService: QuickServiceItem = {
                    id: serviceModal.item.id || `srv-${Date.now()}`,
                    title: fixUzbekText(serviceModal.item.title),
                    desc: fixUzbekText(serviceModal.item.desc || ''),
                    link: serviceModal.item.link || '#',
                    isExternal: !!serviceModal.item.isExternal,
                    color: serviceModal.item.color || 'bg-sky-700'
                  };

                  let currentServices = [...(localSettings.quickServices || [])];
                  if (serviceModal.isEdit && serviceModal.index !== undefined) {
                    currentServices[serviceModal.index] = finalService;
                  } else {
                    currentServices.push(finalService);
                  }

                  const newSettings = { ...localSettings, quickServices: currentServices };
                  setLocalSettings(newSettings);
                  await updateSettings(newSettings);
                  setServiceModal({ ...serviceModal, isOpen: false });
                }}
                className="px-4 py-1.5 rounded bg-sky-700 hover:bg-sky-800 text-white font-bold"
              >
                Saqlash
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* CONFIRMATION MODAL FOR DESTRUCTIVE ACTIONS                     */}
      {/* ============================================================== */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-70 bg-black/80 backdrop-blur-2xs flex items-center justify-center p-3">
          <div className="bg-white rounded-lg w-full max-w-md p-6 shadow-2xl border border-slate-300 space-y-4 text-xs">
            <div className="flex items-center gap-3 text-red-600">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h4 className="text-base font-bold text-slate-900">{confirmModal.title}</h4>
            </div>
            <p className="text-slate-600 leading-relaxed text-sm">
              {confirmModal.description}
            </p>
            <div className="flex justify-end gap-2 pt-3 border-t">
              <button
                onClick={() => setConfirmModal({ ...confirmModal, isOpen: false })}
                className="px-4 py-2 rounded bg-slate-200 text-slate-700 font-semibold"
              >
                Bekor qilish
              </button>
              <button
                onClick={confirmModal.onConfirm}
                className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white font-bold"
              >
                Ha, o‘chirilsin
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
