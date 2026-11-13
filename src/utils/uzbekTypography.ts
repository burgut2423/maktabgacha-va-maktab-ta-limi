/**
 * O'zbek tili lotin alifbosi imlo qoidalari va yangilangan alifbo (Ş, Ç, Ö, Ğ) konvertori.
 * Yangilangan alifboda:
 *   sh -> ş, Sh -> Ş
 *   ch -> ç, Ch -> Ç
 *   o‘, o', oʻ -> ö, O‘, O', Oʻ -> Ö
 *   g‘, g', gʻ -> ğ, G‘, G', Gʻ -> Ğ
 */

export const fixUzbekText = (text: string): string => {
  if (!text) return '';

  let res = text;

  // 1. O' va o' harflari
  res = res.replace(/O['`ʻ‘]/g, 'O‘');
  res = res.replace(/o['`ʻ‘]/g, 'o‘');

  // 2. G' va g' harflari
  res = res.replace(/G['`ʻ‘]/g, 'G‘');
  res = res.replace(/g['`ʻ‘]/g, 'g‘');

  // 3. Tutuq belgisi (apostrof): ta'lim -> ta’lim, ma'lumot -> ma’lumot, e'lon -> e’lon
  res = res.replace(/([a-zA-Z])['`ʻ]([a-zA-Z])/g, '$1’$2');

  return res;
};

/**
 * Converts standard Uzbek Latin text to the updated alphabet with Ş, Ç, Ö, Ğ
 */
export const toNewUzbekAlphabet = (text: string): string => {
  if (!text) return '';

  // Protect URLs, email addresses, and known brand/technical tokens
  const preserved: string[] = [];
  let res = text.replace(
    /(https?:\/\/\S+|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}|Google Sheets|Google Drive|YouTube|Facebook|Instagram|Telegram|STEM|eMaktab|AdminLTE|SHA-512|PBKDF2|gov\.uz|my\.gov\.uz|adm\.edu\.uz|pedkadr\.uzedu\.uz|emaktab\.uz|president\.uz|tdi\.uz|xorazm\.uz|PDF|DOCX|XLSX)/g,
    (match) => {
      const idx = preserved.length;
      preserved.push(match);
      return `__PRESERVED_${idx}__`;
    }
  );

  // Replace compound characters first (order matters)
  // Sh / sh
  res = res.replace(/SH/g, 'Ş');
  res = res.replace(/Sh/g, 'Ş');
  res = res.replace(/sh/g, 'ş');

  // Ch / ch
  res = res.replace(/CH/g, 'Ç');
  res = res.replace(/Ch/g, 'Ç');
  res = res.replace(/ch/g, 'ç');

  // O‘ / o‘ (all apostrophe / modifier variants)
  res = res.replace(/O['‘’ʻʼ`´]/g, 'Ö');
  res = res.replace(/o['‘’ʻʼ`´]/g, 'ö');

  // G‘ / g‘ (all apostrophe / modifier variants)
  res = res.replace(/G['‘’ʻʼ`´]/g, 'Ğ');
  res = res.replace(/g['‘’ʻʼ`´]/g, 'ğ');

  // Restore protected tokens
  res = res.replace(/__PRESERVED_(\d+)__/g, (_, i) => preserved[Number(i)] || '');

  return res;
};

/**
 * Normalizes photo URLs from Google Sheets (Column O / Tashkilotlar or News).
 * If a Google Drive link or file ID is provided, automatically transforms it into
 * direct CDN link (https://lh3.googleusercontent.com/d/ID) so that images display
 * seamlessly without permission or iframe issues.
 */
export const normalizePhotoUrl = (rawUrl?: string): string => {
  if (!rawUrl || typeof rawUrl !== 'string') return '';
  const trimmed = rawUrl.trim();
  if (!trimmed || trimmed === '#ERROR!' || trimmed.startsWith('#')) return '';

  // Google Drive URL patterns:
  // 1. https://drive.google.com/file/d/FILE_ID/...
  const driveFileMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (driveFileMatch && driveFileMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${driveFileMatch[1]}`;
  }

  // 2. https://drive.google.com/open?id=FILE_ID or ?id=FILE_ID
  const driveIdMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (driveIdMatch && driveIdMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${driveIdMatch[1]}`;
  }

  // 3. https://drive.google.com/thumbnail?id=FILE_ID
  const driveThumbMatch = trimmed.match(/\/thumbnail\?id=([a-zA-Z0-9_-]+)/);
  if (driveThumbMatch && driveThumbMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${driveThumbMatch[1]}`;
  }

  // 4. Raw Google Drive file ID (25 to 45 alphanumeric chars)
  if (/^[a-zA-Z0-9_-]{25,45}$/.test(trimmed) && !trimmed.startsWith('http') && !trimmed.startsWith('.')) {
    return `https://lh3.googleusercontent.com/d/${trimmed}`;
  }

  return trimmed;
};

/**
 * Common Uzbek special letters for virtual keyboard insertion
 */
export const UZBEK_LETTERS = ['ö', 'ğ', 'ş', 'ç', 'Ö', 'Ğ', 'Ş', 'Ç', '’', 'o‘', 'g‘'];
