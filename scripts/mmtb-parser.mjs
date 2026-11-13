/**
 * qoshkopir-mmtb.uz (DataLife Engine) sahifalarini tahlil qiluvchi parser.
 * Faqat standart DOM API ishlatiladi: brauzerda (DOMParser) ham,
 * Node.js'da (linkedom) ham bir xil ishlaydi.
 */

export const SOURCE_ORIGIN = 'https://qoshkopir-mmtb.uz';

/** Matnni saytdagi yangi alifboga (ö, ğ, ş, ç, ’) moslaydi. */
export function toNewAlphabet(input) {
  if (!input) return '';
  let s = String(input);
  s = s.replace(/Õ/g, 'Ö').replace(/õ/g, 'ö');
  s = s.replace(/O['`ʻ‘’]/g, 'Ö').replace(/o['`ʻ‘’]/g, 'ö');
  s = s.replace(/G['`ʻ‘’]/g, 'Ğ').replace(/g['`ʻ‘’]/g, 'ğ');
  s = s.replace(/SH/g, 'Ş').replace(/Sh/g, 'Ş').replace(/sh/g, 'ş');
  s = s.replace(/CH/g, 'Ç').replace(/Ch/g, 'Ç').replace(/ch/g, 'ç');
  s = s.replace(/([A-Za-zÖöĞğŞşÇç])['`ʻ]([A-Za-zÖöĞğŞşÇç])/g, '$1’$2');
  return s;
}

const clean = (s) => (s || '').replace(/ /g, ' ').replace(/[ \t]+/g, ' ').trim();

export function absUrl(src) {
  if (!src) return '';
  try { return new URL(src, SOURCE_ORIGIN + '/').href; } catch { return src; }
}

/** "25-09-2026, 10:03" -> "2026-09-25" */
export function parseDate(text) {
  const m = /(\d{1,2})-(\d{1,2})-(\d{4})/.exec(text || '');
  if (!m) return '';
  return `${m[3]}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}`;
}

const BLOCK = new Set(['P', 'DIV', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'LI', 'TR', 'TABLE', 'UL', 'OL', 'BLOCKQUOTE', 'SECTION', 'DETAILS', 'SUMMARY', 'HR']);

/** Element ichidagi matnni paragraflarni saqlagan holda oladi. */
export function blockText(el) {
  let out = '';
  const walk = (node) => {
    if (node.nodeType === 3) { out += node.nodeValue; return; }
    if (node.nodeType !== 1) return;
    const tag = node.tagName;
    if (tag === 'SCRIPT' || tag === 'STYLE') return;
    if (tag === 'BR') { out += '\n'; return; }
    const isBlock = BLOCK.has(tag);
    if (isBlock) out += '\n';
    for (const c of node.childNodes) walk(c);
    if (tag === 'TD' || tag === 'TH') out += ' ';
    if (isBlock) out += '\n';
  };
  walk(el);
  return out
    .split('\n')
    .map(clean)
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/** Ro'yxat sahifasidan yangilik havolalarini oladi. */
export function parseNewsLinks(doc) {
  const links = [];
  for (const a of doc.querySelectorAll('a[href]')) {
    const href = absUrl(a.getAttribute('href'));
    if (/qoshkopir-mmtb\.uz\/.*\/?\d+-[^/]*\.html$/.test(href) && !links.includes(href)) links.push(href);
  }
  return links;
}

/** Ro'yxat sahifasidagi oxirgi sahifa raqami. */
export function parseLastPage(doc) {
  let max = 1;
  for (const a of doc.querySelectorAll('a[href]')) {
    const m = /\/page\/(\d+)\/?$/.exec(a.getAttribute('href') || '');
    if (m) max = Math.max(max, Number(m[1]));
  }
  return max;
}

function guessCategory(title, body) {
  const t = toNewAlphabet(title).toLowerCase();
  const all = `${t} ${toNewAlphabet(body).toLowerCase()}`;
  if (/e’lon|e'lon/.test(t)) return "E'lon";
  if (/olimpiada/.test(all)) return 'Olimpiada';
  if (/\bmtt\b|boğça|maktabgaça|tarbiyalanuvçi/.test(all)) return 'MTT';
  if (/öqituvçi|pedagog|ustoz|metodik/.test(t)) return 'Pedagogika';
  if (/boşlanğiç/.test(all)) return "Boshlang'ich ta'lim";
  return 'Tadbirlar';
}

/** To'liq yangilik sahifasini NewsItem ko'rinishiga keltiradi. */
export function parseNewsArticle(doc, url) {
  const art = doc.querySelector('article.blog-block') || doc.querySelector('article');
  if (!art) return null;
  const content = art.querySelector('.blog-content') || art;
  const info = content.querySelector('.blog-info');
  const title = clean((info?.querySelector('h1, h2') || content.querySelector('h1, h2'))?.textContent);
  if (!title) return null;

  const metaTexts = info ? [...info.querySelectorAll('.meta li')].map((li) => clean(li.textContent)) : [];
  const dateText = metaTexts.find((t) => /\d{1,2}-\d{1,2}-\d{4}/.test(t)) || '';
  const sourceCategory = metaTexts.find((t) => t && !/\d{1,2}-\d{1,2}-\d{4}/.test(t)) || '';

  const images = [];
  for (const img of content.querySelectorAll('img')) {
    const src = absUrl(img.getAttribute('data-src') || img.getAttribute('src'));
    if (src && !/\/templates\/|emoji|smiles/.test(src) && !images.includes(src)) images.push(src);
  }

  const body = content.cloneNode(true);
  body.querySelector('.blog-info')?.remove();
  for (const s of body.querySelectorAll('script, style, .share, .social')) s.remove();
  const text = toNewAlphabet(blockText(body));

  const idMatch = /\/(\d+)-[^/]*\.html$/.exec(url);
  const id = `mmtb-${idMatch ? idMatch[1] : Math.abs(hash(url))}`;
  const firstPara = text.split('\n').find((l) => l.length > 30) || text;
  const summary = firstPara.length > 260 ? firstPara.slice(0, 257).replace(/\s+\S*$/, '') + '...' : firstPara;
  const tTitle = toNewAlphabet(title.replace(/\.\.\.$/, ''));

  return {
    id,
    title: tTitle,
    category: guessCategory(title, `${sourceCategory} ${text.slice(0, 400)}`),
    date: parseDate(dateText),
    summary,
    content: text,
    imageUrl: images[0] || '',
    images,
    author: "Qöşköpir tuman MMTB",
    views: 0,
    isPinned: false,
    sourceUrl: url,
  };
}

function hash(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return h;
}

/** "Taraqqiyot MFY, Mustaqillik ko'chasi" -> "Taraqqiyot MFY" */
function extractMahalla(address) {
  const m = /([A-Za-zÀ-žÖöĞğŞşÇç'‘’ʻ`.\- ]+?)\s+(MFY|mahallasi|mahalla|qishlog['‘’ʻ`]i|ovuli)\b/i.exec(address || '');
  return m ? clean(`${m[1]} ${m[2]}`) : '';
}

function formatPhone(raw) {
  const digits = (raw || '').replace(/\D/g, '');
  if (digits.length === 9) return `+998 (${digits.slice(0, 2)}) ${digits.slice(2, 5)}-${digits.slice(5, 7)}-${digits.slice(7)}`;
  if (digits.length === 12 && digits.startsWith('998')) return formatPhone(digits.slice(3));
  return clean(raw);
}

/** Maktablar / MTT ro'yxati sahifasi (<details> bloklari). */
export function parseOrganizations(doc, type) {
  const out = [];
  const content = doc.querySelector('article .blog-content') || doc.querySelector('article') || doc;
  for (const det of content.querySelectorAll('details')) {
    const summary = det.querySelector('summary');
    if (!summary) continue;
    const span = summary.querySelector('span');
    const rawName = clean(summary.textContent.replace(span ? span.textContent : '', ''));
    const fields = {};
    for (const tr of det.querySelectorAll('tr')) {
      const th = clean(tr.querySelector('th')?.textContent).toLowerCase();
      const td = tr.querySelector('td');
      if (!td) continue;
      const val = clean(td.textContent);
      if (/manzil/.test(th)) fields.address = val;
      else if (/direktor|rahbar|mudir/.test(th)) fields.director = val;
      else if (/telefon/.test(th)) fields.phone = formatPhone(td.querySelector('a[href^="tel:"]')?.getAttribute('href') || val);
    }
    const name = rawName || clean(span?.textContent);
    const numMatch = /(\d+)/.exec(name);
    const number = numMatch ? Number(numMatch[1]) : out.length + 1;
    const isIxtisos = type === 'maktab' && /ixtisos|internat|prezident|ijod/i.test(name);
    const finalType = isIxtisos ? 'ixtisos' : type;
    out.push({
      id: out.some((o) => o.id === `mmtb-${finalType}-${number}`) ? `mmtb-${finalType}-${number}-${out.length + 1}` : `mmtb-${finalType}-${number}`,
      type: finalType,
      number,
      name: toNewAlphabet(type === 'maktab' && /^\d+-maktab$/i.test(name) ? `${number}-sonli umumiy örta ta'lim maktabi` : name),
      address: toNewAlphabet(fields.address || ''),
      mahalla: toNewAlphabet(extractMahalla(fields.address)),
      director: toNewAlphabet(fields.director || ''),
      phone: fields.phone || '',
      email: '',
      studentsCount: 0,
      teachersCount: 0,
      shifts: type === 'mtt' ? 1 : 2,
      establishedYear: 0,
      rating: 0,
      sourceName: name,
    });
  }
  return out;
}

/** "Manzil va telefonlar" sahifasidan Google Map havolalari: { "1-maktab": url } */
export function parseMapLinks(doc) {
  const map = {};
  for (const tr of doc.querySelectorAll('article table tbody tr')) {
    const tds = tr.querySelectorAll('td');
    if (tds.length < 3) continue;
    const name = clean(tds[1].textContent);
    const href = tds[2].querySelector('a')?.getAttribute('href');
    if (name && href) map[name.toLowerCase()] = href;
  }
  return map;
}

/** "Rahbariyat" sahifasi. */
export function parseLeaders(doc) {
  const out = [];
  const content = doc.querySelector('article .blog-content') || doc.querySelector('article') || doc;
  for (const card of content.querySelectorAll('td')) {
    const nameEl = card.querySelector('h2, h3');
    if (!nameEl) continue;
    const name = clean(nameEl.textContent);
    if (!name) continue;
    const ps = [...card.querySelectorAll('p')].map((p) => clean(p.textContent)).filter(Boolean);
    const place = ps.find((p) => p.includes('📍')) || '';
    const position = ps.find((p) => !p.includes('📍')) || '';
    const telText = [...card.querySelectorAll('div')].map((d) => clean(d.textContent)).find((t) => /^tel\s*:/i.test(t)) || '';
    const img = card.querySelector('img');
    const position2 = toNewAlphabet(position);
    out.push({
      id: `mmtb-lead-${out.length + 1}`,
      name: toNewAlphabet(name),
      position: position2,
      department: toNewAlphabet(place.replace('📍', '').trim() || "Qo'shko'pir tumani"),
      phone: clean(telText.replace(/^tel\s*:/i, '')),
      email: '',
      receptionDays: '',
      receptionHours: '',
      bio: '',
      photoUrl: img ? absUrl(img.getAttribute('src')) : '',
      order: out.length + 1,
    });
  }
  return out;
}

const PATHS = {
  news: '/bosh-saxifa/yangiliklar/',
  schools: '/muassasa/maktablar-royxati/',
  mtt: '/muassasa/mtt/',
  maps: '/muassasa/manzillar/',
  leaders: '/bolim-haqida/bolim-jamoasi/',
};

/**
 * Butun saytni yig'adi. getDoc(url) -> Promise<Document> (yoki xato bo'lsa null).
 * opts.maxPages — yangiliklar ro'yxatidagi maksimal sahifalar soni.
 */
export async function scrapeAll(getDoc, opts = {}) {
  const log = opts.log || (() => {});
  const maxPages = opts.maxPages || 60;
  const result = { source: SOURCE_ORIGIN, syncedAt: new Date().toISOString(), news: [], organizations: [], leaders: [], errors: [] };
  const safe = async (url) => {
    try { return await getDoc(url); } catch (e) { result.errors.push(`${url}: ${e.message || e}`); return null; }
  };

  // 1. Yangiliklar havolalari
  const links = [];
  const home = await safe(SOURCE_ORIGIN + '/');
  if (home) parseNewsLinks(home).forEach((l) => links.includes(l) || links.push(l));
  const first = await safe(SOURCE_ORIGIN + PATHS.news);
  if (first) {
    parseNewsLinks(first).forEach((l) => links.includes(l) || links.push(l));
    const last = Math.min(parseLastPage(first), maxPages);
    for (let p = 2; p <= last; p++) {
      const d = await safe(`${SOURCE_ORIGIN}${PATHS.news}page/${p}/`);
      if (d) parseNewsLinks(d).forEach((l) => links.includes(l) || links.push(l));
    }
  }
  log(`Yangiliklar havolalari: ${links.length}`);

  // 2. Har bir yangilik
  const seen = new Set();
  for (const url of links) {
    const d = await safe(url);
    const item = d && parseNewsArticle(d, url);
    if (item && !seen.has(item.id)) { seen.add(item.id); result.news.push(item); }
  }
  result.news.sort((a, b) => (b.date || '').localeCompare(a.date || '') || Number(b.id.slice(5)) - Number(a.id.slice(5)));
  log(`Yangiliklar: ${result.news.length}`);

  // 3. Muassasalar + xarita havolalari
  const maps = await safe(SOURCE_ORIGIN + PATHS.maps);
  const mapLinks = maps ? parseMapLinks(maps) : {};
  const schools = await safe(SOURCE_ORIGIN + PATHS.schools);
  const mtt = await safe(SOURCE_ORIGIN + PATHS.mtt);
  const orgs = [...(schools ? parseOrganizations(schools, 'maktab') : []), ...(mtt ? parseOrganizations(mtt, 'mtt') : [])];
  for (const o of orgs) {
    const key = (o.sourceName || '').toLowerCase();
    if (mapLinks[key]) o.mapUrl = mapLinks[key];
  }
  result.organizations = orgs;
  log(`Muassasalar: ${orgs.length}`);

  // 4. Rahbariyat
  const leaders = await safe(SOURCE_ORIGIN + PATHS.leaders);
  result.leaders = leaders ? parseLeaders(leaders) : [];
  log(`Rahbariyat: ${result.leaders.length}`);

  return result;
}
