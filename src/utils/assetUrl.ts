import { stateEmblem, heroImage, headPortrait, preschoolBuilding, conferenceImage } from '../assets/images';

// Built-in images, keyed by the base name (without Vite hash / extension).
const LOCAL_IMAGES: Record<string, string> = {
  state_emblem_uzb_1794303518799: stateEmblem,
  hero_education_district_1794303548345: heroImage,
  department_head_portrait_1794303519848: headPortrait,
  preschool_mtt_building_1794303520561: preschoolBuilding,
  teachers_conference_1794303520010: conferenceImage,
};

/**
 * Google Sheets'dagi rasm havolalari boshqa domenga (masalan, eski
 * *.github.io manziliga) yoki mavjud bo'lmagan './assets/images/...' yo'liga
 * ishora qilishi mumkin. Agar havola saytning o'z rasmlaridan biriga tegishli
 * bo'lsa, uni joriy build'dagi haqiqiy faylga almashtiramiz.
 */
export const resolveAssetUrl = (url?: string): string | undefined => {
  if (!url) return url;
  const trimmed = url.trim();
  for (const [base, local] of Object.entries(LOCAL_IMAGES)) {
    if (trimmed.includes(base)) return local;
  }
  return trimmed;
};
