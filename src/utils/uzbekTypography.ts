/**
 * O'zbek tili lotin alifbosi imlo qoidalari va to'g'ri harflarga avtomatik o'girish yordamchisi.
 * Matndagi noaniq belgilarni (o', o`, g', g`, ta'lim) rasmiy o‘, g‘, O‘, G‘ va ’ (tutuq belgisi) ga aylantiradi.
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

  // 3. Tutuq belgisi (apostrof): ta'lim -> ta’lim, ma'lumot -> ma’lumot, e'lon -> e’lon, e'tiqod -> e’tiqod, san'at -> san’at, mas'ul -> mas’ul
  res = res.replace(/([a-zA-Z])['`ʻ]([a-zA-Z])/g, '$1’$2');

  return res;
};

/**
 * Common Uzbek special letters for virtual keyboard insertion
 */
export const UZBEK_LETTERS = ['o‘', 'g‘', 'O‘', 'G‘', '’', 'sh', 'ch', 'Sh', 'Ch'];
