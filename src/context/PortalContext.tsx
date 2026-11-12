import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User } from 'firebase/auth';
import { NewsItem, Organization, Leader, DocumentItem, CitizenAppeal, PortalSettings, GoogleSyncStatus } from '../types';
import {
  INITIAL_NEWS,
  INITIAL_ORGANIZATIONS,
  INITIAL_LEADERS,
  INITIAL_DOCUMENTS,
  INITIAL_APPEALS,
  INITIAL_SETTINGS
} from '../data/initialData';
import { initAuth, googleSignIn, googleSignInRedirect, logout, getCurrentUser } from '../services/googleAuth';
import {
  getOrCreateSpreadsheet,
  fetchAllPortalDataFromSheets,
  syncAllDataToGoogleSheets,
  getStoredSpreadsheetId,
  setStoredSpreadsheetId,
  extractSpreadsheetId
} from '../services/googleSheets';
import { getOrCreatePortalFolder } from '../services/googleDrive';
import { PORTAL_CONFIG } from '../config/portalConfig';

interface PortalContextType {
  // State
  news: NewsItem[];
  organizations: Organization[];
  leaders: Leader[];
  documents: DocumentItem[];
  appeals: CitizenAppeal[];
  settings: PortalSettings;

  // Google Integration
  user: User | null;
  googleSyncStatus: GoogleSyncStatus;
  loginWithGoogle: () => Promise<void>;
  loginWithGoogleRedirect: () => Promise<void>;
  connectSpreadsheetById: (sheetId: string) => Promise<boolean>;
  refreshDataFromSheets: (targetId?: string) => Promise<void>;
  logoutGoogle: () => Promise<void>;
  syncNow: () => Promise<void>;

  // CRUD actions
  addNews: (item: Omit<NewsItem, 'id' | 'views'>) => Promise<void>;
  updateNews: (item: NewsItem) => Promise<void>;
  deleteNews: (id: string) => Promise<void>;

  addOrganization: (item: Omit<Organization, 'id'>) => Promise<void>;
  updateOrganization: (item: Organization) => Promise<void>;
  deleteOrganization: (id: string) => Promise<void>;

  addLeader: (item: Omit<Leader, 'id'>) => Promise<void>;
  updateLeader: (item: Leader) => Promise<void>;
  deleteLeader: (id: string) => Promise<void>;

  addDocument: (item: Omit<DocumentItem, 'id'>) => Promise<void>;
  updateDocument: (item: DocumentItem) => Promise<void>;
  deleteDocument: (id: string) => Promise<void>;

  submitCitizenAppeal: (data: Omit<CitizenAppeal, 'id' | 'trackingCode' | 'date' | 'status'>) => Promise<string>;
  updateAppeal: (item: CitizenAppeal) => Promise<void>;
  deleteAppeal: (id: string) => Promise<void>;

  updateSettings: (newSettings: Partial<PortalSettings>) => Promise<void>;

  // Accessibility
  fontSize: 'normal' | 'large' | 'xlarge';
  setFontSize: (size: 'normal' | 'large' | 'xlarge') => void;
  contrastMode: 'normal' | 'high' | 'grayscale';
  setContrastMode: (mode: 'normal' | 'high' | 'grayscale') => void;
  speakText: (text: string) => void;
  stopSpeaking: () => void;
  isSpeaking: boolean;
}

const PortalContext = createContext<PortalContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'qoshkopir_portal_data_v1';

export const PortalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial local data if cached
  const [news, setNews] = useState<NewsItem[]>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_news`);
      return saved ? JSON.parse(saved) : INITIAL_NEWS;
    } catch {
      return INITIAL_NEWS;
    }
  });

  const [organizations, setOrganizations] = useState<Organization[]>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_orgs`);
      return saved ? JSON.parse(saved) : INITIAL_ORGANIZATIONS;
    } catch {
      return INITIAL_ORGANIZATIONS;
    }
  });

  const [leaders, setLeaders] = useState<Leader[]>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_leaders`);
      return saved ? JSON.parse(saved) : INITIAL_LEADERS;
    } catch {
      return INITIAL_LEADERS;
    }
  });

  const [documents, setDocuments] = useState<DocumentItem[]>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_docs`);
      return saved ? JSON.parse(saved) : INITIAL_DOCUMENTS;
    } catch {
      return INITIAL_DOCUMENTS;
    }
  });

  const [appeals, setAppeals] = useState<CitizenAppeal[]>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_appeals`);
      return saved ? JSON.parse(saved) : INITIAL_APPEALS;
    } catch {
      return INITIAL_APPEALS;
    }
  });

  const [settings, setSettings] = useState<PortalSettings>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_settings`);
      return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
    } catch {
      return INITIAL_SETTINGS;
    }
  });

  // Google State
  const [user, setUser] = useState<User | null>(null);
  const [googleSyncStatus, setGoogleSyncStatus] = useState<GoogleSyncStatus>({
    isConnected: false,
    spreadsheetId: getStoredSpreadsheetId(),
    spreadsheetUrl: null,
    folderId: null,
    folderUrl: null,
    lastSyncedAt: null,
    syncing: false,
    error: null
  });

  // Accessibility State
  const [fontSize, setFontSizeState] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [contrastMode, setContrastModeState] = useState<'normal' | 'high' | 'grayscale'>('normal');
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_news`, JSON.stringify(news));
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_orgs`, JSON.stringify(organizations));
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_leaders`, JSON.stringify(leaders));
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_docs`, JSON.stringify(documents));
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_appeals`, JSON.stringify(appeals));
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_settings`, JSON.stringify(settings));
    } catch (e) {
      console.warn("Mahalliy xotiraga yozişda çeklov:", e);
    }
  }, [news, organizations, leaders, documents, appeals, settings]);

  // Synchronize with Google Sheets
  const triggerGoogleSheetsSync = useCallback(async (
    targetSpreadsheetId?: string,
    stateOverride?: {
      news?: NewsItem[];
      organizations?: Organization[];
      leaders?: Leader[];
      documents?: DocumentItem[];
      appeals?: CitizenAppeal[];
      settings?: PortalSettings;
    }
  ) => {
    const sheetId = targetSpreadsheetId || googleSyncStatus.spreadsheetId || getStoredSpreadsheetId();
    if (!sheetId) return;

    try {
      setGoogleSyncStatus(prev => ({ ...prev, syncing: true, error: null }));
      await syncAllDataToGoogleSheets(sheetId, {
        news: stateOverride?.news || news,
        organizations: stateOverride?.organizations || organizations,
        leaders: stateOverride?.leaders || leaders,
        documents: stateOverride?.documents || documents,
        appeals: stateOverride?.appeals || appeals,
        settings: stateOverride?.settings || settings
      });

      setGoogleSyncStatus(prev => ({
        ...prev,
        syncing: false,
        lastSyncedAt: new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' }),
        error: null
      }));
    } catch (err: any) {
      console.error("Google Sheets sinxronlaşda xatolik:", err);
      setGoogleSyncStatus(prev => ({
        ...prev,
        syncing: false,
        error: err.message || "Google Sheets bilan boğlanişda xatolik"
      }));
    }
  }, [news, organizations, leaders, documents, appeals, settings, googleSyncStatus.spreadsheetId]);

  // Initialize Auth
  useEffect(() => {
    const unsubscribe = initAuth(
      async (authUser, token) => {
        setUser(authUser);
        if (token) {
          // Connected with valid token - check or create spreadsheet
          try {
            setGoogleSyncStatus(prev => ({ ...prev, syncing: true, isConnected: true }));
            const sheetInfo = await getOrCreateSpreadsheet();
            const folderId = await getOrCreatePortalFolder();

            setGoogleSyncStatus(prev => ({
              ...prev,
              isConnected: true,
              spreadsheetId: sheetInfo.id,
              spreadsheetUrl: sheetInfo.url,
              folderId: folderId,
              folderUrl: `https://drive.google.com/drive/folders/${folderId}`,
              syncing: false,
              error: null
            }));

            // If existing spreadsheet, load data from it
            if (!sheetInfo.isNew) {
              const loaded = await fetchAllPortalDataFromSheets(sheetInfo.id);
              setNews(loaded.news);
              setOrganizations(loaded.organizations);
              setLeaders(loaded.leaders);
              setDocuments(loaded.documents);
              setAppeals(loaded.appeals);
              setSettings(loaded.settings);
            }
          } catch (err: any) {
            console.warn("Google Sheets dastlabki tekşiruvida xatolik:", err);
            setGoogleSyncStatus(prev => ({
              ...prev,
              isConnected: true,
              syncing: false,
              error: err.message
            }));
          }
        }
      },
      () => {
        setUser(null);
        setGoogleSyncStatus(prev => ({ ...prev, isConnected: false, syncing: false }));
      }
    );

    return () => unsubscribe();
  }, []);

  // Universal Public/Auth Sheets Synchronization
  const refreshDataFromSheets = useCallback(async (targetId?: string) => {
    const rawId = targetId || googleSyncStatus.spreadsheetId || getStoredSpreadsheetId() || settings.googleSpreadsheetId;
    if (!rawId) return;
    const cleanId = extractSpreadsheetId(rawId);
    if (!cleanId) return;

    try {
      setGoogleSyncStatus(prev => ({ ...prev, syncing: true, error: null }));
      const loaded = await fetchAllPortalDataFromSheets(cleanId);
      if (loaded) {
        if (loaded.organizations && loaded.organizations.length > 0) {
          setOrganizations(loaded.organizations);
          try {
            localStorage.setItem(`${LOCAL_STORAGE_KEY}_orgs`, JSON.stringify(loaded.organizations));
          } catch {}
        }
        if (loaded.news && loaded.news.length > 0) {
          setNews(loaded.news);
          try {
            localStorage.setItem(`${LOCAL_STORAGE_KEY}_news`, JSON.stringify(loaded.news));
          } catch {}
        }
        if (loaded.leaders && loaded.leaders.length > 0) {
          setLeaders(loaded.leaders);
          try {
            localStorage.setItem(`${LOCAL_STORAGE_KEY}_leaders`, JSON.stringify(loaded.leaders));
          } catch {}
        }
        if (loaded.documents && loaded.documents.length > 0) {
          setDocuments(loaded.documents);
          try {
            localStorage.setItem(`${LOCAL_STORAGE_KEY}_docs`, JSON.stringify(loaded.documents));
          } catch {}
        }
        if (loaded.appeals && loaded.appeals.length > 0) {
          setAppeals(loaded.appeals);
          try {
            localStorage.setItem(`${LOCAL_STORAGE_KEY}_appeals`, JSON.stringify(loaded.appeals));
          } catch {}
        }
        if (loaded.settings) {
          setSettings(prev => ({ ...prev, ...loaded.settings, googleSpreadsheetId: cleanId }));
        }
      }
      setGoogleSyncStatus(prev => ({
        ...prev,
        spreadsheetId: cleanId,
        spreadsheetUrl: `https://docs.google.com/spreadsheets/d/${cleanId}/edit`,
        syncing: false,
        lastSyncedAt: new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' }),
        error: null
      }));
    } catch (err: any) {
      console.warn("Google Sheets yangilanişida ogohlantiriş:", err);
      setGoogleSyncStatus(prev => ({
        ...prev,
        syncing: false
      }));
    }
  }, [googleSyncStatus.spreadsheetId, settings.googleSpreadsheetId]);

  // Initial auto-sync and periodic background poll from Google Sheets
  useEffect(() => {
    // 1. Detect spreadsheet ID from URL query ?sheet=... or ?spreadsheetId=...
    try {
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        const urlSheet = params.get('sheet') || params.get('spreadsheetId');
        if (urlSheet) {
          const clean = extractSpreadsheetId(urlSheet);
          setStoredSpreadsheetId(clean);
          setGoogleSyncStatus(prev => ({
            ...prev,
            spreadsheetId: clean,
            spreadsheetUrl: `https://docs.google.com/spreadsheets/d/${clean}/edit`
          }));
          refreshDataFromSheets(clean);
          // Clean param from address bar without reloading
          const cleanUrl = window.location.pathname + window.location.hash;
          window.history.replaceState({}, '', cleanUrl);
          return;
        }
      }
    } catch {}

    // 2. Initial fetch if ID already configured
    const initialId = getStoredSpreadsheetId() || settings.googleSpreadsheetId;
    if (initialId) {
      refreshDataFromSheets(initialId);
    }

    // 3. Periodic background poll (every 30 seconds)
    const interval = setInterval(() => {
      const activeId = getStoredSpreadsheetId() || settings.googleSpreadsheetId;
      if (activeId) {
        refreshDataFromSheets(activeId);
      }
    }, PORTAL_CONFIG.AUTO_REFRESH_INTERVAL_MS || 30000);

    // 4. Instant synchronization when user switches back to website tab
    const handleTabFocus = () => {
      const activeId = getStoredSpreadsheetId() || settings.googleSpreadsheetId;
      if (activeId) {
        refreshDataFromSheets(activeId);
      }
    };

    window.addEventListener('focus', handleTabFocus);
    const handleVisibility = () => {
      if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
        handleTabFocus();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleTabFocus);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [refreshDataFromSheets, settings.googleSpreadsheetId]);

  const loginWithGoogle = async () => {
    try {
      setGoogleSyncStatus(prev => ({ ...prev, syncing: true, error: null }));
      const result = await googleSignIn();
      if (result) {
        setUser(result.user);
        const sheetInfo = await getOrCreateSpreadsheet();
        let folderId: string | null = null;
        try {
          folderId = await getOrCreatePortalFolder();
        } catch (e) {
          console.warn("Drive jild yaratişda ogohlantiriş:", e);
        }

        setGoogleSyncStatus(prev => ({
          ...prev,
          isConnected: true,
          spreadsheetId: sheetInfo.id,
          spreadsheetUrl: sheetInfo.url,
          folderId,
          folderUrl: folderId ? `https://drive.google.com/drive/folders/${folderId}` : null,
          syncing: false,
          error: null
        }));

        if (!sheetInfo.isNew) {
          const loaded = await fetchAllPortalDataFromSheets(sheetInfo.id);
          setNews(loaded.news);
          setOrganizations(loaded.organizations);
          setLeaders(loaded.leaders);
          setDocuments(loaded.documents);
          setAppeals(loaded.appeals);
          setSettings(loaded.settings);
        }
      }
    } catch (err: any) {
      console.error("Login xatoligi:", err);
      const isDomainError = err.code === 'auth/unauthorized-domain';
      setGoogleSyncStatus(prev => ({
        ...prev,
        syncing: false,
        error: err.customExplanation || err.message,
        unauthorizedDomain: isDomainError ? (err.domainToAdd || window.location.hostname) : null
      }));
      throw err;
    }
  };

  const loginWithGoogleRedirect = async () => {
    try {
      setGoogleSyncStatus(prev => ({ ...prev, syncing: true, error: null }));
      await googleSignInRedirect();
    } catch (err: any) {
      console.error("Redirect login xatoligi:", err);
      const isDomainError = err.code === 'auth/unauthorized-domain';
      setGoogleSyncStatus(prev => ({
        ...prev,
        syncing: false,
        error: err.customExplanation || err.message,
        unauthorizedDomain: isDomainError ? (err.domainToAdd || window.location.hostname) : null
      }));
    }
  };

  const connectSpreadsheetById = async (sheetId: string): Promise<boolean> => {
    try {
      const clean = extractSpreadsheetId(sheetId);
      if (!clean) return false;

      setGoogleSyncStatus(prev => ({ ...prev, syncing: true, error: null }));
      setStoredSpreadsheetId(clean);

      const loaded = await fetchAllPortalDataFromSheets(clean);
      if (loaded) {
        if (loaded.organizations && loaded.organizations.length > 0) {
          setOrganizations(loaded.organizations);
          try {
            localStorage.setItem(`${LOCAL_STORAGE_KEY}_orgs`, JSON.stringify(loaded.organizations));
          } catch {}
        }
        if (loaded.news && loaded.news.length > 0) {
          setNews(loaded.news);
          try {
            localStorage.setItem(`${LOCAL_STORAGE_KEY}_news`, JSON.stringify(loaded.news));
          } catch {}
        }
        if (loaded.leaders && loaded.leaders.length > 0) {
          setLeaders(loaded.leaders);
          try {
            localStorage.setItem(`${LOCAL_STORAGE_KEY}_leaders`, JSON.stringify(loaded.leaders));
          } catch {}
        }
        if (loaded.documents && loaded.documents.length > 0) {
          setDocuments(loaded.documents);
          try {
            localStorage.setItem(`${LOCAL_STORAGE_KEY}_docs`, JSON.stringify(loaded.documents));
          } catch {}
        }
        if (loaded.appeals && loaded.appeals.length > 0) {
          setAppeals(loaded.appeals);
          try {
            localStorage.setItem(`${LOCAL_STORAGE_KEY}_appeals`, JSON.stringify(loaded.appeals));
          } catch {}
        }
        if (loaded.settings) {
          setSettings(prev => ({ ...prev, ...loaded.settings, googleSpreadsheetId: clean }));
        } else {
          setSettings(prev => ({ ...prev, googleSpreadsheetId: clean }));
        }
      }

      setGoogleSyncStatus(prev => ({
        ...prev,
        isConnected: true,
        spreadsheetId: clean,
        spreadsheetUrl: `https://docs.google.com/spreadsheets/d/${clean}/edit`,
        syncing: false,
        lastSyncedAt: new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' }),
        error: null
      }));
      return true;
    } catch (err: any) {
      setGoogleSyncStatus(prev => ({
        ...prev,
        syncing: false,
        error: "Google Sheets jadvaliga ulanişda xatolik: " + err.message
      }));
      return false;
    }
  };

  const logoutGoogle = async () => {
    await logout();
    setUser(null);
    setGoogleSyncStatus(prev => ({
      ...prev,
      isConnected: false,
      syncing: false,
      error: null,
      unauthorizedDomain: null
    }));
  };

  const syncNow = async () => {
    if (!googleSyncStatus.spreadsheetId) {
      if (user) {
        const sheetInfo = await getOrCreateSpreadsheet();
        await triggerGoogleSheetsSync(sheetInfo.id);
      } else {
        await loginWithGoogle();
      }
    } else {
      await triggerGoogleSheetsSync();
    }
  };

  // CRUD Implementations
  const addNews = async (item: Omit<NewsItem, 'id' | 'views'>) => {
    const newItem: NewsItem = {
      ...item,
      id: `news-${Date.now()}`,
      views: 0
    };
    const updated = [newItem, ...news];
    setNews(updated);
    if (googleSyncStatus.spreadsheetId) {
      await triggerGoogleSheetsSync(undefined, { news: updated });
    }
  };

  const updateNews = async (item: NewsItem) => {
    const updated = news.map(n => n.id === item.id ? item : n);
    setNews(updated);
    if (googleSyncStatus.spreadsheetId) {
      await triggerGoogleSheetsSync(undefined, { news: updated });
    }
  };

  const deleteNews = async (id: string) => {
    const updated = news.filter(n => n.id !== id);
    setNews(updated);
    if (googleSyncStatus.spreadsheetId) {
      await triggerGoogleSheetsSync(undefined, { news: updated });
    }
  };

  const addOrganization = async (item: Omit<Organization, 'id'>) => {
    const newOrg: Organization = {
      ...item,
      id: `org-${Date.now()}`
    };
    const updated = [...organizations, newOrg];
    setOrganizations(updated);
    if (googleSyncStatus.spreadsheetId) {
      await triggerGoogleSheetsSync(undefined, { organizations: updated });
    }
  };

  const updateOrganization = async (item: Organization) => {
    const updated = organizations.map(o => o.id === item.id ? item : o);
    setOrganizations(updated);
    if (googleSyncStatus.spreadsheetId) {
      await triggerGoogleSheetsSync(undefined, { organizations: updated });
    }
  };

  const deleteOrganization = async (id: string) => {
    const updated = organizations.filter(o => o.id !== id);
    setOrganizations(updated);
    if (googleSyncStatus.spreadsheetId) {
      await triggerGoogleSheetsSync(undefined, { organizations: updated });
    }
  };

  const addLeader = async (item: Omit<Leader, 'id'>) => {
    const newLeader: Leader = {
      ...item,
      id: `lead-${Date.now()}`
    };
    const updated = [...leaders, newLeader].sort((a, b) => a.order - b.order);
    setLeaders(updated);
    if (googleSyncStatus.spreadsheetId) {
      await triggerGoogleSheetsSync(undefined, { leaders: updated });
    }
  };

  const updateLeader = async (item: Leader) => {
    const updated = leaders.map(l => l.id === item.id ? item : l).sort((a, b) => a.order - b.order);
    setLeaders(updated);
    if (googleSyncStatus.spreadsheetId) {
      await triggerGoogleSheetsSync(undefined, { leaders: updated });
    }
  };

  const deleteLeader = async (id: string) => {
    const updated = leaders.filter(l => l.id !== id);
    setLeaders(updated);
    if (googleSyncStatus.spreadsheetId) {
      await triggerGoogleSheetsSync(undefined, { leaders: updated });
    }
  };

  const addDocument = async (item: Omit<DocumentItem, 'id'>) => {
    const newDoc: DocumentItem = {
      ...item,
      id: `doc-${Date.now()}`
    };
    const updated = [newDoc, ...documents];
    setDocuments(updated);
    if (googleSyncStatus.spreadsheetId) {
      await triggerGoogleSheetsSync(undefined, { documents: updated });
    }
  };

  const updateDocument = async (item: DocumentItem) => {
    const updated = documents.map(d => d.id === item.id ? item : d);
    setDocuments(updated);
    if (googleSyncStatus.spreadsheetId) {
      await triggerGoogleSheetsSync(undefined, { documents: updated });
    }
  };

  const deleteDocument = async (id: string) => {
    const updated = documents.filter(d => d.id !== id);
    setDocuments(updated);
    if (googleSyncStatus.spreadsheetId) {
      await triggerGoogleSheetsSync(undefined, { documents: updated });
    }
  };

  const submitCitizenAppeal = async (data: Omit<CitizenAppeal, 'id' | 'trackingCode' | 'date' | 'status'>): Promise<string> => {
    const randomCode = `QSP-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newAppeal: CitizenAppeal = {
      ...data,
      id: `app-${Date.now()}`,
      trackingCode: randomCode,
      date: new Date().toISOString().split('T')[0],
      status: 'yangi'
    };
    const updated = [newAppeal, ...appeals];
    setAppeals(updated);
    if (googleSyncStatus.spreadsheetId) {
      await triggerGoogleSheetsSync(undefined, { appeals: updated });
    }
    return randomCode;
  };

  const updateAppeal = async (item: CitizenAppeal) => {
    const updated = appeals.map(a => a.id === item.id ? item : a);
    setAppeals(updated);
    if (googleSyncStatus.spreadsheetId) {
      await triggerGoogleSheetsSync(undefined, { appeals: updated });
    }
  };

  const deleteAppeal = async (id: string) => {
    const updated = appeals.filter(a => a.id !== id);
    setAppeals(updated);
    if (googleSyncStatus.spreadsheetId) {
      await triggerGoogleSheetsSync(undefined, { appeals: updated });
    }
  };

  const updateSettings = async (newSettings: Partial<PortalSettings>) => {
    const updated: PortalSettings = { ...settings, ...newSettings };
    setSettings(updated);
    if (googleSyncStatus.spreadsheetId) {
      await triggerGoogleSheetsSync(undefined, { settings: updated });
    }
  };

  // Accessibility Handlers
  const setFontSize = (size: 'normal' | 'large' | 'xlarge') => {
    setFontSizeState(size);
    const root = document.documentElement;
    root.classList.remove('text-sm', 'text-base', 'text-lg', 'text-xl');
    if (size === 'large') {
      root.style.fontSize = '18px';
    } else if (size === 'xlarge') {
      root.style.fontSize = '20px';
    } else {
      root.style.fontSize = '16px';
    }
  };

  const setContrastMode = (mode: 'normal' | 'high' | 'grayscale') => {
    setContrastModeState(mode);
    const root = document.documentElement;
    root.classList.remove('high-contrast', 'grayscale-mode');
    if (mode === 'high') {
      root.classList.add('high-contrast');
    } else if (mode === 'grayscale') {
      root.classList.add('grayscale-mode');
    }
  };

  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'uz-UZ';
    utterance.rate = 0.95;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  return (
    <PortalContext.Provider
      value={{
        news,
        organizations,
        leaders,
        documents,
        appeals,
        settings,
        user,
        googleSyncStatus,
        loginWithGoogle,
        loginWithGoogleRedirect,
        connectSpreadsheetById,
        refreshDataFromSheets,
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
        submitCitizenAppeal,
        updateAppeal,
        deleteAppeal,
        updateSettings,
        fontSize,
        setFontSize,
        contrastMode,
        setContrastMode,
        speakText,
        stopSpeaking,
        isSpeaking
      }}
    >
      {children}
    </PortalContext.Provider>
  );
};

export const usePortal = () => {
  const context = useContext(PortalContext);
  if (!context) {
    throw new Error('usePortal must be used within a PortalProvider');
  }
  return context;
};
