#!/usr/bin/env node
/**
 * qoshkopir-mmtb.uz -> public/data/mmtb-sync.json
 * Ishga tuşiriş: node scripts/sync-mmtb.mjs
 * GitHub Actions'da har deploy oldidan va jadval böyiça avtomatik ishlaydi.
 */
import { DOMParser } from 'linkedom';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { scrapeAll } from './mmtb-parser.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = resolve(ROOT, 'public/data/mmtb-sync.json');

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function getDoc(url, attempt = 1) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 30000);
  try {
    const res = await fetch(url, {
      signal: ctrl.signal,
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; qoshkopirtalim-sync/1.0; +https://qoshkopirtalim.uz)', 'Accept-Language': 'uz,ru;q=0.8,en;q=0.5' },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const html = await res.text();
    return new DOMParser().parseFromString(html, 'text/html');
  } catch (e) {
    if (attempt < 3) { await sleep(1500 * attempt); return getDoc(url, attempt + 1); }
    throw e;
  } finally {
    clearTimeout(timer);
  }
}

const data = await scrapeAll(getDoc, { log: (m) => console.log('•', m) });
if (data.errors.length) console.warn(`Ogohlantirişlar (${data.errors.length}):\n  ` + data.errors.slice(0, 20).join('\n  '));

if (data.news.length === 0 && data.organizations.length === 0) {
  console.warn('Manba saytdan ma\'lumot olinmadi — mavjud fayl özgartirilmadi.');
  process.exit(0);
}

// Avvalgi faylda bor, lekin bu safar olinmagan bölimlarni saqlab qolamiz
try {
  const prev = JSON.parse(await readFile(OUT, 'utf8'));
  for (const key of ['news', 'organizations', 'leaders']) {
    if (data[key].length === 0 && Array.isArray(prev[key])) data[key] = prev[key];
  }
} catch {}

delete data.errors;
await mkdir(dirname(OUT), { recursive: true });
await writeFile(OUT, JSON.stringify(data, null, 1) + '\n');
console.log(`Saqlandi: ${OUT} (yangiliklar: ${data.news.length}, muassasalar: ${data.organizations.length}, rahbariyat: ${data.leaders.length})`);
