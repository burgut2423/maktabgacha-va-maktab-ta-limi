/**
 * qoshkopir-mmtb.uz saytidan avtomatik yig'ilgan ma'lumotlar (public/data/mmtb-sync.json)
 * bilan portal ma'lumotlarini birlaştiriş.
 *
 * JSON fayl GitHub Actions'da `scripts/sync-mmtb.mjs` orqali muntazam yangilanadi.
 */
import { NewsItem, Organization, Leader } from '../types';

export interface MmtbSyncData {
  source: string;
  syncedAt: string;
  news: NewsItem[];
  organizations: Organization[];
  leaders: Leader[];
}

const HIDDEN_KEY = 'qoshkopir_mmtb_hidden_ids';

// Boşlanğiç (namuna) ma'lumotlar: haqiqiy ma'lumot kelganda ular körsatilmaydi
const PLACEHOLDER_NEWS = new Set(['news-1', 'news-2', 'news-3', 'news-4']);
const PLACEHOLDER_LEADERS = new Set(['lead-1', 'lead-2', 'lead-3']);
const PLACEHOLDER_ORGS = new Set(['mtt-12', 'org-1', 'sch-1', 'sch-14', 'sch-2', 'sch-23', 'mtt-5']);

export const isMmtbId = (id: string) => id.startsWith('mmtb-');

export const loadMmtbSync = async (): Promise<MmtbSyncData | null> => {
  try {
    const base = import.meta.env.BASE_URL || './';
    const res = await fetch(`${base}data/mmtb-sync.json?t=${Math.floor(Date.now() / 600000)}`, { cache: 'no-cache' });
    if (!res.ok) return null;
    const data = (await res.json()) as MmtbSyncData;
    if (!data || !Array.isArray(data.news)) return null;
    return data;
  } catch {
    return null;
  }
};

export const getHiddenMmtbIds = (): Set<string> => {
  try {
    return new Set(JSON.parse(localStorage.getItem(HIDDEN_KEY) || '[]'));
  } catch {
    return new Set();
  }
};

export const hideMmtbId = (id: string): Set<string> => {
  const set = getHiddenMmtbIds();
  set.add(id);
  try {
    localStorage.setItem(HIDDEN_KEY, JSON.stringify([...set]));
  } catch {}
  return set;
};

export const mergeNews = (local: NewsItem[], data: MmtbSyncData | null, hidden: Set<string>): NewsItem[] => {
  if (!data || data.news.length === 0) return local;
  const localIds = new Set(local.map(n => n.id));
  const own = local.filter(n => !PLACEHOLDER_NEWS.has(n.id) && !hidden.has(n.id));
  const synced = data.news.filter(n => !localIds.has(n.id) && !hidden.has(n.id));
  return [...own, ...synced].sort((a, b) => {
    if (!!b.isPinned !== !!a.isPinned) return b.isPinned ? 1 : -1;
    return (b.date || '').localeCompare(a.date || '');
  });
};

export const mergeOrganizations = (local: Organization[], data: MmtbSyncData | null, hidden: Set<string>): Organization[] => {
  if (!data || data.organizations.length === 0) return local;
  const localById = new Map(local.map(o => [o.id, o]));
  const used = new Set<string>();
  const merged: Organization[] = [];

  for (const src of data.organizations) {
    if (hidden.has(src.id)) continue;
    const edited = localById.get(src.id);
    if (edited) {
      merged.push(edited);
      used.add(edited.id);
      continue;
    }
    // Namuna yozuv bilan (tur + raqam) moslaştiriş: statistikani saqlab, rasmiy ma'lumotni olamiz
    const match = local.find(o => !used.has(o.id) && PLACEHOLDER_ORGS.has(o.id) && o.type === src.type && o.number === src.number);
    if (match) {
      used.add(match.id);
      merged.push({ ...match, id: src.id, address: src.address || match.address, mahalla: src.mahalla || match.mahalla, director: src.director || match.director, phone: src.phone || match.phone, mapUrl: src.mapUrl });
    } else {
      merged.push(src);
    }
  }

  const rest = local.filter(o => !used.has(o.id) && !PLACEHOLDER_ORGS.has(o.id) && !hidden.has(o.id) && !merged.some(m => m.id === o.id));
  return [...merged, ...rest];
};

export const mergeLeaders = (local: Leader[], data: MmtbSyncData | null, hidden: Set<string>): Leader[] => {
  if (!data || data.leaders.length === 0) return local;
  const localById = new Map(local.map(l => [l.id, l]));
  const synced = data.leaders.filter(l => !hidden.has(l.id)).map(l => localById.get(l.id) || l);
  const own = local.filter(l => !PLACEHOLDER_LEADERS.has(l.id) && !isMmtbId(l.id) && !hidden.has(l.id));
  return [...synced, ...own].sort((a, b) => a.order - b.order);
};
