/**
 * Qo'shko'pir tumani maktabgacha va maktab ta'limi bo'limi portali konfiguratsiyasi.
 * Ushbu sozlamalar orqali sayt GitHub Pages'da ham, har qanday qurilmada ham
 * Google Sheets'dagi barcha o'zgarishlarni real vaqt rejimida avtomatik yuklab oladi.
 */

export const PORTAL_CONFIG = {
  // Asosiy Google Sheets ID si (barcha brauzerlar va fuqarolar uchun yagona rasmiy baza)
  DEFAULT_SPREADSHEET_ID: "14xTiUicc9FL23qpE2pBljDazsYDlaw57mbR8Ua_QABk",

  // Rasmiy Google Drive rasmlar va fayllar asosiy papkasi
  DEFAULT_DRIVE_FOLDER_ID: "1xBvm3Oz0j4_n8YZB4sYPmA3EqcnqUp8d",
  DEFAULT_DRIVE_FOLDER_URL: "https://drive.google.com/drive/folders/1xBvm3Oz0j4_n8YZB4sYPmA3EqcnqUp8d?usp=sharing",

  // Google Sheets API ommaviy kaliti
  GOOGLE_API_KEY: "AIzaSyBszmlCmVIcCdE4zsGwA4JMbk7Xg_HcTCc",

  // GitHub Pages va portal domeni
  PORTAL_DOMAIN: "burgut2423.github.io",

  // Avtomatik fon yangilanishi (millisekundda: har 30 soniyada bir marta)
  AUTO_REFRESH_INTERVAL_MS: 30000
};
