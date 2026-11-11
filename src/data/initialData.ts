import { NewsItem, Organization, Leader, DocumentItem, CitizenAppeal, PortalSettings } from '../types';
import { heroImage, headPortrait, preschoolBuilding, conferenceImage } from '../assets/images';

export const INITIAL_SETTINGS: PortalSettings = {
  districtName: "Qo'shko'pir tumani maktabgacha va maktab ta'limi bo'limi",
  departmentPhone: "+998 (62) 352-14-25",
  trustPhone: "+998 (62) 352-11-02",
  email: "qoshkopir.mmtb@edu.uz",
  address: "Xorazm viloyati, Qo'shko'pir tumani, Mustaqillik ko'chasi, 24-uy",
  workingHours: "Dushanba - Juma: 09:00 - 18:00 (Tushlik: 13:00 - 14:00)",
  telegramChannel: "https://t.me/qoshkopir_mmtb",
  facebookPage: "https://facebook.com/qoshkopir.mmtb",
  youtubeChannel: "https://youtube.com/@qoshkopir_talim",
  schoolsCount: 54,
  mttsCount: 42,
  studentsTotal: 34850,
  teachersTotal: 2840,
  specializedSchoolsCount: 4,
  higherCategoryTeachersCount: 685,
  marqueeText: "E'lon: 2026-yilgi umumta'lim maktablarining 1-sinfiga qabul jarayonlari boshlandi! Barcha savollar bo'yicha Ishonch telefoniga murojaat qilishingiz mumkin: +998 (62) 352-11-02.",

  // Asosiy sahifa sozlamalari
  heroTitle: "Ta'lim va tarbiya — kelajak poydevori, ma'rifatli avlod kafolati",
  heroSubtitle: "Qo'shko'pir tumani maktabgacha va maktab ta'limi bo'limi tizimidagi 54 ta umumta'lim maktabi hamda 42 ta davlat va xususiy MTTlar faoliyatini yagona raqamli platforma orqali kuzatib boring.",
  heroBadgeText: "Xorazm viloyati · Qo'shko'pir tumani",
  heroImageUrl: heroImage,
  quickServices: [
    {
      id: "srv-1",
      title: "1-sinfga qabul",
      desc: "Umumta'lim maktablariga elektron ariza topshirish",
      link: "https://adm.edu.uz",
      isExternal: true,
      color: "bg-blue-600 text-white"
    },
    {
      id: "srv-2",
      title: "Bog'chaga navbat",
      desc: "Davlat MTTlariga navbatga qo'yish va tekshirish",
      link: "https://my.gov.uz",
      isExternal: true,
      color: "bg-emerald-600 text-white"
    },
    {
      id: "srv-3",
      title: "Pedagoglar attestatsiyasi",
      desc: "Malaka toifasi sinovlari va natijalari",
      link: "https://pedkadr.uzedu.uz",
      isExternal: true,
      color: "bg-amber-600 text-white"
    },
    {
      id: "srv-4",
      title: "Fan olimpiadalari",
      desc: "Tuman va viloyat bosqichlari natijalari",
      link: "#yangiliklar",
      isExternal: false,
      color: "bg-indigo-600 text-white"
    },
    {
      id: "srv-5",
      title: "Elektron kundalik",
      desc: "eMaktab yagona ta'lim axborot tizimi",
      link: "https://emaktab.uz",
      isExternal: true,
      color: "bg-rose-600 text-white"
    },
    {
      id: "srv-6",
      title: "Virtual qabulxona",
      desc: "Bo'lim rahbariyatiga to'g'ridan-to'g'ri murojaat",
      link: "#murojaat",
      isExternal: false,
      color: "bg-sky-700 text-white"
    }
  ],

  // Bo'lim haqida (About Department) ma'lumotlari
  departmentHistory: "Qo'shko'pir tumani xalq ta'limi bo'limi 1935-yilda tashkil topgan bo'lib, o'tgan yillar davomida tumanda minglab yetuk mutaxassislar, olimlar va davlat arboblarini tarbiyalab voyaga yetkazdi. Bugungi kunda O'zbekiston Respublikasi Prezidentining 2023-yilgi qaroriga muvofiq, maktabgacha ta'lim va maktab ta'limi tizimlari birlashtirilib, zamonaviy Qo'shko'pir tumani maktabgacha va maktab ta'limi bo'limi sifatida faoliyat yuritmoqda.",
  departmentMission: "Tumanda yashovchi har bir bolaga teng, sifatli va zamonaviy ta'lim-tarbiya olish imkoniyatini yaratish, pedagoglarning kasbiy mahoratini oshirish, zamonaviy axborot texnologiyalari va ilg'or xorijiy tajribalarni ta'lim jarayoniga keng tatbiq etish.",
  departmentCharter: "Bo'lim O'zbekiston Respublikasi Konstitutsiyasi, 'Ta'lim to'g'risida'gi Qonun, Maktabgacha va maktab ta'limi vazirligi Nizomi hamda Qo'shko'pir tumani hokimligi qarorlari asosida ish yuritadi.",
  tasksList: [
    "Maktabgacha ta'lim tashkilotlarida bolalarni sifatli parvarishlash va maktabga har tomonlama tayyorlash",
    "Umumiy o'rta ta'lim muassasalarida davlat ta'lim standartlarini to'liq ta'minlash",
    "Iqtidorli va iste'dodli o'quvchilarni aniqlash, ularni fan olimpiadalariga maqsadli tayyorlash",
    "Pedagog kadrlar salohiyatini oshirish, attestatsiya va malaka toifalarini adolatli o'tkazish",
    "Ta'lim muassasalari moddiy-texnik bazasini mustahkamlash, zamonaviy jihozlar va darsliklar bilan ta'minlash",
    "Fuqarolar murojaatlari bilan ishlash, ota-onalar va jamoatchilik nazoratini rivojlantirish"
  ],
  branches: [
    {
      id: "br-1",
      name: "Umumiy o'rta ta'lim tashkilotlari faoliyatini muvofiqlashtirish sho'basi",
      head: "Matyoqubov Shuxratbek Qadamovich",
      phone: "+998 (62) 352-16-40",
      staffCount: 6,
      description: "Tumandagi 54 ta umumta'lim maktablarida o'quv-tarbiya jarayoni, darsliklar ta'minoti va monitoringni amalga oshiradi."
    },
    {
      id: "br-2",
      name: "Maktabgacha ta'lim tashkilotlari faoliyatini muvofiqlashtirish sho'basi",
      head: "Sobirova Gulchehra Karimova",
      phone: "+998 (62) 352-18-12",
      staffCount: 5,
      description: "Davlat va oilaviy nodavlat MTTlar faoliyatini muvofiqlashtirish, qabul va metodik yordam ko'rsatish."
    },
    {
      id: "br-3",
      name: "Pedagogik mahorat va xalqaro baholash bo'yicha metodika sho'basi",
      head: "Qutlimuratov Anvar Omonovich",
      phone: "+998 (62) 352-15-77",
      staffCount: 8,
      description: "Fan o'qituvchilari uchun seminar-treninglar, yangi pedagogik texnologiyalar va PISA/TIMSS tayyorgarligi."
    },
    {
      id: "br-4",
      name: "Moliya-iqtisodiyot va davlat xaridlari bo'limi",
      head: "Bekchanov Mansurbek Shokirovich",
      phone: "+998 (62) 352-12-30",
      staffCount: 4,
      description: "Ta'lim muassasalarini moliyalashtirish, o'qituvchilar oylik maoshlari va moddiy ta'minot masalalari."
    },
    {
      id: "br-5",
      name: "Inson resurslari va kadrlar boshqaruvi sho'basi",
      head: "Ro'zimov Ilhom Qodirovich",
      phone: "+998 (62) 352-19-15",
      staffCount: 3,
      description: "Pedagog va rahbar xodimlar hisobi, attestatsiya va bo'sh ish o'rinlari monitoringi."
    }
  ],

  // Telegram, Facebook va Instagram ijtimoiy tarmoqlariga avtomatik yuborish sozlamalari
  telegramBotToken: "",
  telegramChannelUsername: "@qoshkopir_mmtb",
  telegramAutoPublish: true,
  facebookPageId: "",
  facebookPageToken: "",
  facebookAutoPublish: false,
  instagramPage: "https://instagram.com/qoshkopir_mmtb",
  instagramAccountId: "",
  instagramAccessToken: "",
  instagramAutoPublish: false
};

export const INITIAL_LEADERS: Leader[] = [
  {
    id: "lead-1",
    name: "Raximov Mansur Davlatovich",
    position: "Bo'lim boshlig'i",
    department: "Qo'shko'pir tumani maktabgacha va maktab ta'limi bo'limi",
    phone: "+998 (62) 352-14-25",
    email: "m.raximov@qoshkopir-edu.uz",
    receptionDays: "Har haftaning chorshanba va juma kunlari",
    receptionHours: "10:00 - 12:00",
    bio: "Pedagogika fanlari bo'yicha falsafa doktori (PhD). Ta'lim sohasida 22 yildan ortiq tajribaga ega. Tuman umumta'lim tizimini raqamlashtirish va maktabgacha ta'lim qamrovini 85% ga oshirish tashabbuskori.",
    photoUrl: headPortrait,
    order: 1
  },
  {
    id: "lead-2",
    name: "Matyoqubov Shuxratbek Qadamovich",
    position: "Bo'lim boshlig'i o'rinbosari - Maktablar faoliyatini muvofiqlashtirish sho'basi mudiri",
    department: "Umumiy o'rta ta'lim sho'basi",
    phone: "+998 (62) 352-16-40",
    email: "sh.matyoqubov@qoshkopir-edu.uz",
    receptionDays: "Har haftaning seshanba va payshanba kunlari",
    receptionHours: "14:00 - 17:00",
    bio: "Oliy toifali matematika fani o'qituvchisi. Tuman maktablarida aniq fanlar chuqurlashtirilgan sinflari va olimpiada markazlarini tashkil etish bo'yicha mas'ul rahbar.",
    photoUrl: headPortrait,
    order: 2
  },
  {
    id: "lead-3",
    name: "Sobirova Gulchehra Karimova",
    position: "Maktabgacha ta'lim tashkilotlari faoliyatini muvofiqlashtirish sho'basi mudiri",
    department: "Maktabgacha ta'lim sho'basi",
    phone: "+998 (62) 352-18-12",
    email: "g.sobirova@qoshkopir-edu.uz",
    receptionDays: "Har haftaning dushanba va chorshanba kunlari",
    receptionHours: "09:00 - 12:00",
    bio: "Maktabgacha ta'lim a'lochisi. Davlat va nodavlat MTTlar tarmog'ini rivojlantirish hamda 'Aqlvoy' dasturi joriy etilishi bo'yicha yetakchi mutaxassis.",
    photoUrl: headPortrait,
    order: 3
  }
];

export const INITIAL_NEWS: NewsItem[] = [
  {
    id: "news-1",
    title: "Qo'shko'pir tumanida yangi innovatsion maktab binosi foydalanishga topshirildi",
    category: "Boshqaruv",
    date: "2026-11-08",
    summary: "Tumanning Shixmashhad mahallasida 660 o'ringa mo'ljallangan zamonaviy 14-sonli umumiy o'rta ta'lim maktabining yangi binosi tantanali ravishda ochildi.",
    content: "O'zbekiston Respublikasi Prezidentining ta'lim sifatini oshirish va maktab infratuzilmasini yaxshilashga doir qarorlari ijrosi doirasida Qo'shko'pir tumanida navbatdagi zamonaviy ta'lim muassasasi qad rostladi. Yangi maktab binosida eng so'nggi rusumdagi STEM laboratoriyalari, interaktiv multimedia sinfxonalari, keng sport zali va zamonaviy kutubxona mavjud. Ochilish marosimida tuman hokimligi, viloyat va tuman maktabgacha va maktab ta'limi bo'limi rahbariyati, nuroniylar hamda ota-onalar ishtirok etishdi.",
    imageUrl: heroImage,
    author: "Matbuot xizmati",
    views: 1240,
    isPinned: true
  },
  {
    id: "news-2",
    title: "Tumandagi 42 ta davlat va xususiy MTTlarda zamonaviy 'Ilk qadam' dasturi takomillashtirilmoqda",
    category: "MTT",
    date: "2026-11-05",
    summary: "Maktabgacha yoshdagi bolalarni sifatli ta'lim bilan qamrab olish ko'rsatkichi Qo'shko'pirda 85 foizga yetkazildi.",
    content: "Bo'limning maktabgacha ta'lim sho'basi tashabbusi bilan tuman markazidagi 5-sonli 'Mitti Qadamlar' davlat maktabgacha ta'lim tashkilotida seminar-trening tashkil etildi. Treningda tarbiyachilar yangi interaktiv didaktik o'yinlar, bolalarni maktabga tayyorlashning zamonaviy metodikalari hamda sensor rivojlanish vositalarini amaliyotda qo'llash ko'nikmalarini mustahkamladilar.",
    imageUrl: preschoolBuilding,
    author: "Maktabgacha ta'lim sho'basi",
    views: 890,
    isPinned: true
  },
  {
    id: "news-3",
    title: "Pedagoglar forumi: Xalqaro baholash PISA va TIMSS mezonlariga tayyorgarlik masalalari muhokama qilindi",
    category: "Pedagogika",
    date: "2026-10-29",
    summary: "Qo'shko'pir tumanidagi 500 dan ortiq yetakchi fan o'qituvchilari ishtirokida ilmiy-amaliy anjuman bo'lib o'tdi.",
    content: "O'quvchilarning mantiqiy, tanqidiy fikrlashini o'stirish, fanlararo integratsiyani ta'minlash va yangi darsliklar bilan ishlash bo'yicha mahorat darslari o'tkazildi. Forum yakunida yuqori natijalarga erishgan 25 nafar fidoiy o'qituvchi bo'limning faxriy yorliqlari va esdalik sovg'alari bilan taqdirlandi.",
    imageUrl: conferenceImage,
    author: "Metodika sho'basi",
    views: 645,
    isPinned: false
  },
  {
    id: "news-4",
    title: "Asosiy fan olimpiadasining tuman bosqichida 142 nafar iqtidorli o'quvchi g'oliblikni qo'lga kiritdi",
    category: "Olimpiada",
    date: "2026-10-21",
    summary: "Matematika, fizika, kimyo va xorijiy tillar yo'nalishlarida Qo'shko'pir yoshlari yuqori bilim saviyasini namoyon qildilar.",
    content: "G'olib o'quvchilar endi viloyat bosqichida tuman sharafini himoya qiladilar. Eng yuqori natijani 1-sonli ixtisoslashtirilgan maktab-internati hamda 14-sonli umumiy o'rta ta'lim maktabi o'quvchilari qayd etishdi.",
    imageUrl: heroImage,
    author: "Iqtidorli yoshlar sho'basi",
    views: 780,
    isPinned: false
  }
];

export const INITIAL_ORGANIZATIONS: Organization[] = [
  {
    id: "mtt-12",
    type: "mtt",
    number: 12,
    name: "12-sonli 'Kamalak' davlat maktabgacha ta'lim tashkiloti",
    address: "Qo'shko'pir tumani, G'azovot qishlog'i",
    mahalla: "G'azovot mahallasi",
    director: "Ibragimova Nodira Qodirovna",
    phone: "+998 (62) 352-18-12",
    email: "mtt12.qoshkopir@edu.uz",
    studentsCount: 190,
    teachersCount: 22,
    shifts: 1,
    establishedYear: 2020,
    rating: 4.7,
    photoUrl: preschoolBuilding
  },
  {
    id: "org-1",
    type: "maktab",
    number: 1,
    name: "1-son maktab",
    address: "Shaxarda",
    mahalla: "Markaz",
    director: "Avezov Furqatbek",
    phone: "+998 (62) 352-19-02",
    email: "maktab1.qoshkopir@edu.uz",
    studentsCount: 350,
    teachersCount: 45,
    shifts: 1,
    establishedYear: 1990,
    rating: 4.5,
    photoUrl: heroImage
  },
  {
    id: "sch-1",
    type: "ixtisos",
    number: 1,
    name: "1-sonli aniq va tabiiy fanlarga ixtisoslashtirilgan maktab-internati",
    address: "Qo'shko'pir shaharchasi, Al-Xorazmiy ko'chasi, 12-uy",
    mahalla: "Navro'z mahallasi",
    director: "Otaxonov Bobur Karimovich",
    phone: "+998 (62) 352-21-14",
    email: "maktab1.qoshkopir@edu.uz",
    studentsCount: 780,
    teachersCount: 74,
    shifts: 1,
    establishedYear: 1998,
    rating: 4.9,
    photoUrl: heroImage
  },
  {
    id: "sch-14",
    type: "maktab",
    number: 14,
    name: "14-sonli umumiy o'rta ta'lim maktabi",
    address: "Qo'shko'pir tumani, Shixmashhad qishlog'i",
    mahalla: "Shixmashhad mahallasi",
    director: "Yusupova Dilnoza Anvarovna",
    phone: "+998 (62) 352-33-88",
    email: "maktab14.qoshkopir@edu.uz",
    studentsCount: 940,
    teachersCount: 68,
    shifts: 2,
    establishedYear: 1982,
    rating: 4.8,
    photoUrl: heroImage
  },
  {
    id: "sch-2",
    type: "maktab",
    number: 2,
    name: "2-sonli umumiy o'rta ta'lim maktabi",
    address: "Qo'shko'pir shaharchasi, Mustaqillik shoh ko'chasi, 45-uy",
    mahalla: "Markaz mahallasi",
    director: "Qalandarov Umidjon Sultonovich",
    phone: "+998 (62) 352-19-02",
    email: "maktab2.qoshkopir@edu.uz",
    studentsCount: 1120,
    teachersCount: 85,
    shifts: 2,
    establishedYear: 1975,
    rating: 4.7,
    photoUrl: heroImage
  },
  {
    id: "sch-23",
    type: "maktab",
    number: 23,
    name: "23-sonli umumiy o'rta ta'lim maktabi",
    address: "Qo'shko'pir tumani, Xonobod qishlog'i",
    mahalla: "Xonobod mahallasi",
    director: "Matrasulov Otabek Baxtiyorovich",
    phone: "+998 (62) 352-44-12",
    email: "maktab23.qoshkopir@edu.uz",
    studentsCount: 620,
    teachersCount: 48,
    shifts: 2,
    establishedYear: 1990,
    rating: 4.6,
    photoUrl: heroImage
  },
  {
    id: "mtt-5",
    type: "mtt",
    number: 5,
    name: "5-sonli 'Mitti Qadamlar' davlat maktabgacha ta'lim tashkiloti",
    address: "Qo'shko'pir shaharchasi, Yoshlik ko'chasi, 8-uy",
    mahalla: "Yoshlik mahallasi",
    director: "Bobojonova Sayyora Rustamovna",
    phone: "+998 (62) 352-51-09",
    email: "mtt5.qoshkopir@edu.uz",
    studentsCount: 280,
    teachersCount: 32,
    shifts: 1,
    establishedYear: 2018,
    rating: 4.9,
    photoUrl: preschoolBuilding
  },
  {
    id: "mtt-12",
    type: "mtt",
    number: 12,
    name: "12-sonli 'Kamalak' davlat maktabgacha ta'lim tashkiloti",
    address: "Qo'shko'pir tumani, G'azovot qishlog'i",
    mahalla: "G'azovot mahallasi",
    director: "Ibragimova Nodira Qodirovna",
    phone: "+998 (62) 352-55-40",
    email: "mtt12.qoshkopir@edu.uz",
    studentsCount: 190,
    teachersCount: 22,
    shifts: 1,
    establishedYear: 2020,
    rating: 4.7,
    photoUrl: preschoolBuilding
  }
];

export const INITIAL_DOCUMENTS: DocumentItem[] = [
  {
    id: "doc-1",
    title: "2026/2027-o'quv yilida umumiy o'rta ta'lim muassasalarida ta'lim-tarbiya jarayonini tashkil etish to'g'risida",
    docNumber: "142-sonli bo'lim buyrug'i",
    date: "2026-08-25",
    category: "Bo'lim buyruqlari",
    fileUrl: "https://drive.google.com",
    fileSize: "1.4 MB",
    fileType: "PDF"
  },
  {
    id: "doc-2",
    title: "Maktabgacha ta'lim tashkilotlarida bolalarning sog'lom ovqatlanishini ta'minlash standartlari",
    docNumber: "88-sonli nizom",
    date: "2026-09-10",
    category: "Nizom va qoidalar",
    fileUrl: "https://drive.google.com",
    fileSize: "890 KB",
    fileType: "PDF"
  },
  {
    id: "doc-3",
    title: "Pedagog kadrlarni attestatsiyadan o'tkazish va malaka toifalarini berish tartibi to'g'risida",
    docNumber: "VMR-512 qarori",
    date: "2026-07-15",
    category: "Vazirlik buyruqlari",
    fileUrl: "https://drive.google.com",
    fileSize: "2.1 MB",
    fileType: "PDF"
  },
  {
    id: "doc-4",
    title: "Qo'shko'pir tumani maktablarida yangi isitish mavsumiga tayyorgarlik ko'rish chora-tadbirlari",
    docNumber: "Tuman hokimi 319-K qarori",
    date: "2026-10-02",
    category: "Hokim qarorlari",
    fileUrl: "https://drive.google.com",
    fileSize: "1.1 MB",
    fileType: "DOCX"
  }
];

export const INITIAL_APPEALS: CitizenAppeal[] = [
  {
    id: "app-101",
    trackingCode: "QSP-2026-4412",
    fullName: "Davlatov Anvar Ilhomovich",
    phone: "+998 91 422 10 20",
    email: "anvar.d@mail.uz",
    address: "Qo'shko'pir tumani, Shixmashhad mahallasi",
    organizationType: "14-sonli maktab",
    subject: "1-sinfga qabul bo'yicha hujjatlar qabuli muddati",
    message: "Assalomu alaykum. Farzandimni 14-sonli maktabga 1-sinfga elektron tizim orqali ariza berish jarayonida mikrohudud bo'yicha qanday qo'shimcha ma'lumotnoma talab etiladi?",
    date: "2026-11-04",
    status: "ijro_etildi",
    replyMessage: "Hurmatli fuqaro! Vazirlik nizomiga muvofiq, mikrohudud bo'yicha qabulda faqat bolaning tug'ilganlik haqidagi guvohnomasi va ota-onaning pasport ma'lumotlari elektron tizim orqali avtomatik tekshiriladi. Ortiqcha qog'oz ma'lumotnomalar talab etilmaydi.",
    replyDate: "2026-11-06",
    officer: "Bo'lim boshlig'i o'rinbosari Sh.Matyoqubov"
  },
  {
    id: "app-102",
    trackingCode: "QSP-2026-5893",
    fullName: "Karimova Ziyoda Bahromovna",
    phone: "+998 93 711 34 55",
    address: "Qo'shko'pir shaharchasi, Yoshlik mahallasi",
    organizationType: "5-sonli MTT",
    subject: "Bog'chaga navbat holatini tasdiqlash",
    message: "Salom, 5-sonli 'Mitti qadamlar' bog'chasiga my.gov.uz orqali ariza qoldirgan edim. Qabul vaqti va guruhlar shakllantirilishi haqida ma'lumot bersangiz.",
    date: "2026-11-08",
    status: "jarayonda",
    officer: "Maktabgacha ta'lim sho'basi mudiri G.Sobirova"
  }
];
