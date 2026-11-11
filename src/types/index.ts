export interface QuickServiceItem {
  id: string;
  title: string;
  desc: string;
  link: string;
  isExternal: boolean;
  color: string;
}

export interface DepartmentBranch {
  id: string;
  name: string;
  head: string;
  phone: string;
  staffCount: number;
  description: string;
}

export interface NewsItem {
  id: string;
  title: string;
  category: 'Boshlang\'ich ta\'lim' | 'Olimpiada' | 'Pedagogika' | 'MTT' | 'E\'lon' | 'Tadbirlar' | 'Boshqaruv';
  date: string;
  summary: string;
  content: string;
  imageUrl: string;
  driveFileId?: string;
  author: string;
  views: number;
  isPinned?: boolean;
  sentToTelegram?: boolean;
  sentToFacebook?: boolean;
  sentToInstagram?: boolean;
  telegramMessageId?: string;
  instagramMediaId?: string;
}

export interface Organization {
  id: string;
  type: 'maktab' | 'mtt' | 'ixtisos';
  number: number;
  name: string;
  address: string;
  mahalla: string;
  director: string;
  phone: string;
  email: string;
  studentsCount: number;
  teachersCount: number;
  shifts: number;
  establishedYear: number;
  rating: number;
  photoUrl?: string;
  inn?: string;
  capacity?: number;
}

export interface Leader {
  id: string;
  name: string;
  position: string;
  department: string;
  phone: string;
  email: string;
  receptionDays: string;
  receptionHours: string;
  bio: string;
  photoUrl: string;
  order: number;
}

export interface DocumentItem {
  id: string;
  title: string;
  docNumber: string;
  date: string;
  category: 'Vazirlik buyruqlari' | 'Hokim qarorlari' | 'Bo\'lim buyruqlari' | 'Nizom va qoidalar' | 'O\'quv dasturlari';
  fileUrl: string;
  driveFileId?: string;
  fileSize: string;
  fileType: string;
}

export interface CitizenAppeal {
  id: string;
  trackingCode: string;
  fullName: string;
  phone: string;
  email?: string;
  address: string;
  organizationType: string;
  subject: string;
  message: string;
  date: string;
  status: 'yangi' | 'jarayonda' | 'ijro_etildi' | 'rad_etildi';
  replyMessage?: string;
  replyDate?: string;
  officer?: string;
}

export interface PortalSettings {
  districtName: string;
  departmentPhone: string;
  trustPhone: string;
  email: string;
  address: string;
  workingHours: string;
  telegramChannel: string;
  facebookPage: string;
  youtubeChannel: string;
  schoolsCount: number;
  mttsCount: number;
  studentsTotal: number;
  teachersTotal: number;
  specializedSchoolsCount: number;
  higherCategoryTeachersCount: number;
  marqueeText: string;

  // Asosiy sahifa sozlamalari (Hero & Quick Services)
  heroTitle: string;
  heroSubtitle: string;
  heroBadgeText: string;
  heroImageUrl: string;
  quickServices: QuickServiceItem[];

  // Bo'lim haqida (About Department) ma'lumotlari
  departmentHistory: string;
  departmentMission: string;
  departmentCharter: string;
  tasksList: string[];
  branches: DepartmentBranch[];

  // Telegram & Facebook ijtimoiy tarmoqlariga avtomatik yuborish sozlamalari
  telegramBotToken: string;
  telegramChannelUsername: string;
  telegramAutoPublish: boolean;
  facebookPageId: string;
  facebookPageToken: string;
  facebookAutoPublish: boolean;
  instagramPage: string;
  instagramAccountId: string;
  instagramAccessToken: string;
  instagramAutoPublish: boolean;
}

export interface GoogleSyncStatus {
  isConnected: boolean;
  spreadsheetId: string | null;
  spreadsheetUrl: string | null;
  folderId: string | null;
  folderUrl: string | null;
  lastSyncedAt: string | null;
  syncing: boolean;
  error: string | null;
  unauthorizedDomain?: string | null;
}
