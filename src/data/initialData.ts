import { NewsItem, Organization, Leader, DocumentItem, CitizenAppeal, PortalSettings } from '../types';
import { heroImage, headPortrait, preschoolBuilding, conferenceImage } from '../assets/images';

export const INITIAL_SETTINGS: PortalSettings = {
  districtName: "Qöşköpir tumani maktabgaça va maktab ta'limi bölimi",
  departmentPhone: "+998 (62) 352-14-25",
  trustPhone: "+998 (62) 352-11-02",
  email: "qoshkopir.mmtb@edu.uz",
  address: "Xorazm viloyati, Qöşköpir tumani, Mustaqillik köçasi, 24-uy",
  workingHours: "Duşanba - Juma: 09:00 - 18:00 (Tuşlik: 13:00 - 14:00)",
  telegramChannel: "https://t.me/qoshkopir_mmtb",
  facebookPage: "https://facebook.com/qoshkopir.mmtb",
  youtubeChannel: "https://youtube.com/@qoshkopir_talim",
  schoolsCount: 54,
  mttsCount: 42,
  studentsTotal: 34850,
  teachersTotal: 2840,
  specializedSchoolsCount: 4,
  higherCategoryTeachersCount: 685,
  marqueeText: "E'lon: 2026-yilgi umumta'lim maktablarining 1-sinfiga qabul jarayonlari boşlandi! Barça savollar böyiça Işonç telefoniga murojaat qilişingiz mumkin: +998 (62) 352-11-02.",

  // Asosiy sahifa sozlamalari
  heroTitle: "Ta'lim va tarbiya — kelajak poydevori, ma'rifatli avlod kafolati",
  heroSubtitle: "Qöşköpir tumani maktabgaça va maktab ta'limi bölimi tizimidagi 54 ta umumta'lim maktabi hamda 42 ta davlat va xususiy MTTlar faoliyatini yagona raqamli platforma orqali kuzatib boring.",
  heroBadgeText: "Xorazm viloyati · Qöşköpir tumani",
  heroImageUrl: heroImage,
  quickServices: [
    {
      id: "srv-1",
      title: "1-sinfga qabul",
      desc: "Umumta'lim maktablariga elektron ariza topşiriş",
      link: "https://adm.edu.uz",
      isExternal: true,
      color: "bg-blue-600 text-white"
    },
    {
      id: "srv-2",
      title: "Boğçaga navbat",
      desc: "Davlat MTTlariga navbatga qöyiş va tekşiriş",
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
      desc: "Tuman va viloyat bosqiçlari natijalari",
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
      desc: "Bölim rahbariyatiga töğridan-töğri murojaat",
      link: "#murojaat",
      isExternal: false,
      color: "bg-sky-700 text-white"
    }
  ],

  // Bo'lim haqida (About Department) ma'lumotlari
  departmentHistory: "Qöşköpir tumani xalq ta'limi bölimi 1935-yilda taşkil topgan bölib, ötgan yillar davomida tumanda minglab yetuk mutaxassislar, olimlar va davlat arboblarini tarbiyalab voyaga yetkazdi. Bugungi kunda Özbekiston Respublikasi Prezidentining 2023-yilgi qaroriga muvofiq, maktabgaça ta'lim va maktab ta'limi tizimlari birlaştirilib, zamonaviy Qöşköpir tumani maktabgaça va maktab ta'limi bölimi sifatida faoliyat yuritmoqda.",
  departmentMission: "Tumanda yaşovçi har bir bolaga teng, sifatli va zamonaviy ta'lim-tarbiya oliş imkoniyatini yaratiş, pedagoglarning kasbiy mahoratini oşiriş, zamonaviy axborot texnologiyalari va ilğor xorijiy tajribalarni ta'lim jarayoniga keng tatbiq etiş.",
  departmentCharter: "Bölim Özbekiston Respublikasi Konstitutsiyasi, 'Ta'lim töğrisida'gi Qonun, Maktabgaça va maktab ta'limi vazirligi Nizomi hamda Qöşköpir tumani hokimligi qarorlari asosida iş yuritadi.",
  tasksList: [
    "Maktabgaça ta'lim taşkilotlarida bolalarni sifatli parvarişlaş va maktabga har tomonlama tayyorlaş",
    "Umumiy örta ta'lim muassasalarida davlat ta'lim standartlarini töliq ta'minlaş",
    "Iqtidorli va iste'dodli öquvçilarni aniqlaş, ularni fan olimpiadalariga maqsadli tayyorlaş",
    "Pedagog kadrlar salohiyatini oşiriş, attestatsiya va malaka toifalarini adolatli ötkaziş",
    "Ta'lim muassasalari moddiy-texnik bazasini mustahkamlaş, zamonaviy jihozlar va darsliklar bilan ta'minlaş",
    "Fuqarolar murojaatlari bilan işlaş, ota-onalar va jamoatçilik nazoratini rivojlantiriş"
  ],
  branches: [
    {
      id: "br-1",
      name: "Umumiy örta ta'lim taşkilotlari faoliyatini muvofiqlaştiriş şöbasi",
      head: "Matyoqubov Şuxratbek Qadamoviç",
      phone: "+998 (62) 352-16-40",
      staffCount: 6,
      description: "Tumandagi 54 ta umumta'lim maktablarida öquv-tarbiya jarayoni, darsliklar ta'minoti va monitoringni amalga oşiradi."
    },
    {
      id: "br-2",
      name: "Maktabgaça ta'lim taşkilotlari faoliyatini muvofiqlaştiriş şöbasi",
      head: "Sobirova Gulçehra Karimova",
      phone: "+998 (62) 352-18-12",
      staffCount: 5,
      description: "Davlat va oilaviy nodavlat MTTlar faoliyatini muvofiqlaştiriş, qabul va metodik yordam körsatiş."
    },
    {
      id: "br-3",
      name: "Pedagogik mahorat va xalqaro baholaş böyiça metodika şöbasi",
      head: "Qutlimuratov Anvar Omonovich",
      phone: "+998 (62) 352-15-77",
      staffCount: 8,
      description: "Fan öqituvçilari uçun seminar-treninglar, yangi pedagogik texnologiyalar va PISA/TIMSS tayyorgarligi."
    },
    {
      id: "br-4",
      name: "Moliya-iqtisodiyot va davlat xaridlari bölimi",
      head: "Bekçanov Mansurbek Şokiroviç",
      phone: "+998 (62) 352-12-30",
      staffCount: 4,
      description: "Ta'lim muassasalarini moliyalaştiriş, öqituvçilar oylik maoşlari va moddiy ta'minot masalalari."
    },
    {
      id: "br-5",
      name: "Inson resurslari va kadrlar boşqaruvi şöbasi",
      head: "Rözimov Ilhom Qodiroviç",
      phone: "+998 (62) 352-19-15",
      staffCount: 3,
      description: "Pedagog va rahbar xodimlar hisobi, attestatsiya va böş iş örinlari monitoringi."
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
    name: "Raximov Mansur Davlatoviç",
    position: "Bölim boşliği",
    department: "Qöşköpir tumani maktabgaça va maktab ta'limi bölimi",
    phone: "+998 (62) 352-14-25",
    email: "m.raximov@qoshkopir-edu.uz",
    receptionDays: "Har haftaning çorşanba va juma kunlari",
    receptionHours: "10:00 - 12:00",
    bio: "Pedagogika fanlari böyiça falsafa doktori (PhD). Ta'lim sohasida 22 yildan ortiq tajribaga ega. Tuman umumta'lim tizimini raqamlaştiriş va maktabgaça ta'lim qamrovini 85% ga oşiriş taşabbuskori.",
    photoUrl: headPortrait,
    order: 1
  },
  {
    id: "lead-2",
    name: "Matyoqubov Şuxratbek Qadamoviç",
    position: "Bölim boşliği örinbosari - Maktablar faoliyatini muvofiqlaştiriş şöbasi mudiri",
    department: "Umumiy örta ta'lim şöbasi",
    phone: "+998 (62) 352-16-40",
    email: "sh.matyoqubov@qoshkopir-edu.uz",
    receptionDays: "Har haftaning seşanba va payşanba kunlari",
    receptionHours: "14:00 - 17:00",
    bio: "Oliy toifali matematika fani öqituvçisi. Tuman maktablarida aniq fanlar çuqurlaştirilgan sinflari va olimpiada markazlarini taşkil etiş böyiça mas'ul rahbar.",
    photoUrl: headPortrait,
    order: 2
  },
  {
    id: "lead-3",
    name: "Sobirova Gulçehra Karimova",
    position: "Maktabgaça ta'lim taşkilotlari faoliyatini muvofiqlaştiriş şöbasi mudiri",
    department: "Maktabgaça ta'lim şöbasi",
    phone: "+998 (62) 352-18-12",
    email: "g.sobirova@qoshkopir-edu.uz",
    receptionDays: "Har haftaning duşanba va çorşanba kunlari",
    receptionHours: "09:00 - 12:00",
    bio: "Maktabgaça ta'lim a'loçisi. Davlat va nodavlat MTTlar tarmoğini rivojlantiriş hamda 'Aqlvoy' dasturi joriy etilişi böyiça yetakçi mutaxassis.",
    photoUrl: headPortrait,
    order: 3
  }
];

export const INITIAL_NEWS: NewsItem[] = [
  {
    id: "news-1",
    title: "Qöşköpir tumanida yangi innovatsion maktab binosi foydalanişga topşirildi",
    category: "Boshqaruv",
    date: "2026-11-08",
    summary: "Tumanning Şixmaşhad mahallasida 660 öringa möljallangan zamonaviy 14-sonli umumiy örta ta'lim maktabining yangi binosi tantanali ravişda oçildi.",
    content: "Özbekiston Respublikasi Prezidentining ta'lim sifatini oşiriş va maktab infratuzilmasini yaxşilaşga doir qarorlari ijrosi doirasida Qöşköpir tumanida navbatdagi zamonaviy ta'lim muassasasi qad rostladi. Yangi maktab binosida eng sönggi rusumdagi STEM laboratoriyalari, interaktiv multimedia sinfxonalari, keng sport zali va zamonaviy kutubxona mavjud. Oçiliş marosimida tuman hokimligi, viloyat va tuman maktabgaça va maktab ta'limi bölimi rahbariyati, nuroniylar hamda ota-onalar iştirok etişdi.",
    imageUrl: heroImage,
    author: "Matbuot xizmati",
    views: 1240,
    isPinned: true
  },
  {
    id: "news-2",
    title: "Tumandagi 42 ta davlat va xususiy MTTlarda zamonaviy 'Ilk qadam' dasturi takomillaştirilmoqda",
    category: "MTT",
    date: "2026-11-05",
    summary: "Maktabgaça yoşdagi bolalarni sifatli ta'lim bilan qamrab oliş körsatkiçi Qöşköpirda 85 foizga yetkazildi.",
    content: "Bölimning maktabgaça ta'lim şöbasi taşabbusi bilan tuman markazidagi 5-sonli 'Mitti Qadamlar' davlat maktabgaça ta'lim taşkilotida seminar-trening taşkil etildi. Treningda tarbiyaçilar yangi interaktiv didaktik öyinlar, bolalarni maktabga tayyorlaşning zamonaviy metodikalari hamda sensor rivojlaniş vositalarini amaliyotda qöllaş könikmalarini mustahkamladilar.",
    imageUrl: preschoolBuilding,
    author: "Maktabgaça ta'lim şöbasi",
    views: 890,
    isPinned: true
  },
  {
    id: "news-3",
    title: "Pedagoglar forumi: Xalqaro baholaş PISA va TIMSS mezonlariga tayyorgarlik masalalari muhokama qilindi",
    category: "Pedagogika",
    date: "2026-10-29",
    summary: "Qöşköpir tumanidagi 500 dan ortiq yetakçi fan öqituvçilari iştirokida ilmiy-amaliy anjuman bölib ötdi.",
    content: "Öquvçilarning mantiqiy, tanqidiy fikrlaşini östiriş, fanlararo integratsiyani ta'minlaş va yangi darsliklar bilan işlaş böyiça mahorat darslari ötkazildi. Forum yakunida yuqori natijalarga erişgan 25 nafar fidoiy öqituvçi bölimning faxriy yorliqlari va esdalik sovğalari bilan taqdirlandi.",
    imageUrl: conferenceImage,
    author: "Metodika şöbasi",
    views: 645,
    isPinned: false
  },
  {
    id: "news-4",
    title: "Asosiy fan olimpiadasining tuman bosqiçida 142 nafar iqtidorli öquvçi ğoliblikni qölga kiritdi",
    category: "Olimpiada",
    date: "2026-10-21",
    summary: "Matematika, fizika, kimyo va xorijiy tillar yönalişlarida Qöşköpir yoşlari yuqori bilim saviyasini namoyon qildilar.",
    content: "Ğolib öquvçilar endi viloyat bosqiçida tuman şarafini himoya qiladilar. Eng yuqori natijani 1-sonli ixtisoslaştirilgan maktab-internati hamda 14-sonli umumiy örta ta'lim maktabi öquvçilari qayd etişdi.",
    imageUrl: heroImage,
    author: "Iqtidorli yoşlar şöbasi",
    views: 780,
    isPinned: false
  }
];

export const INITIAL_ORGANIZATIONS: Organization[] = [
  {
    id: "mtt-12",
    type: "mtt",
    number: 12,
    name: "12-sonli 'Kamalak' davlat maktabgaça ta'lim taşkiloti",
    address: "Qöşköpir tumani, Ğazovot qişloği",
    mahalla: "Ğazovot mahallasi",
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
    name: "1-sonli aniq va tabiiy fanlarga ixtisoslaştirilgan maktab-internati",
    address: "Qöşköpir şaharçasi, Al-Xorazmiy köçasi, 12-uy",
    mahalla: "Navröz mahallasi",
    director: "Otaxonov Bobur Karimoviç",
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
    name: "14-sonli umumiy örta ta'lim maktabi",
    address: "Qöşköpir tumani, Şixmaşhad qişloği",
    mahalla: "Şixmaşhad mahallasi",
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
    name: "2-sonli umumiy örta ta'lim maktabi",
    address: "Qöşköpir şaharçasi, Mustaqillik şoh köçasi, 45-uy",
    mahalla: "Markaz mahallasi",
    director: "Qalandarov Umidjon Sultonoviç",
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
    name: "23-sonli umumiy örta ta'lim maktabi",
    address: "Qöşköpir tumani, Xonobod qişloği",
    mahalla: "Xonobod mahallasi",
    director: "Matrasulov Otabek Baxtiyoroviç",
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
    name: "5-sonli 'Mitti Qadamlar' davlat maktabgaça ta'lim taşkiloti",
    address: "Qöşköpir şaharçasi, Yoşlik köçasi, 8-uy",
    mahalla: "Yoşlik mahallasi",
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
    name: "12-sonli 'Kamalak' davlat maktabgaça ta'lim taşkiloti",
    address: "Qöşköpir tumani, Ğazovot qişloği",
    mahalla: "Ğazovot mahallasi",
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
    title: "2026/2027-öquv yilida umumiy örta ta'lim muassasalarida ta'lim-tarbiya jarayonini taşkil etiş töğrisida",
    docNumber: "142-sonli bölim buyruği",
    date: "2026-08-25",
    category: "Bo'lim buyruqlari",
    fileUrl: "https://drive.google.com",
    fileSize: "1.4 MB",
    fileType: "PDF"
  },
  {
    id: "doc-2",
    title: "Maktabgaça ta'lim taşkilotlarida bolalarning soğlom ovqatlanişini ta'minlaş standartlari",
    docNumber: "88-sonli nizom",
    date: "2026-09-10",
    category: "Nizom va qoidalar",
    fileUrl: "https://drive.google.com",
    fileSize: "890 KB",
    fileType: "PDF"
  },
  {
    id: "doc-3",
    title: "Pedagog kadrlarni attestatsiyadan ötkaziş va malaka toifalarini beriş tartibi töğrisida",
    docNumber: "VMR-512 qarori",
    date: "2026-07-15",
    category: "Vazirlik buyruqlari",
    fileUrl: "https://drive.google.com",
    fileSize: "2.1 MB",
    fileType: "PDF"
  },
  {
    id: "doc-4",
    title: "Qöşköpir tumani maktablarida yangi isitiş mavsumiga tayyorgarlik köriş çora-tadbirlari",
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
    address: "Qöşköpir tumani, Şixmaşhad mahallasi",
    organizationType: "14-sonli maktab",
    subject: "1-sinfga qabul böyiça hujjatlar qabuli muddati",
    message: "Assalomu alaykum. Farzandimni 14-sonli maktabga 1-sinfga elektron tizim orqali ariza beriş jarayonida mikrohudud böyiça qanday qöşimça ma'lumotnoma talab etiladi?",
    date: "2026-11-04",
    status: "ijro_etildi",
    replyMessage: "Hurmatli fuqaro! Vazirlik nizomiga muvofiq, mikrohudud böyiça qabulda faqat bolaning tuğilganlik haqidagi guvohnomasi va ota-onaning pasport ma'lumotlari elektron tizim orqali avtomatik tekşiriladi. Ortiqça qoğoz ma'lumotnomalar talab etilmaydi.",
    replyDate: "2026-11-06",
    officer: "Bölim boşliği örinbosari Ş.Matyoqubov"
  },
  {
    id: "app-102",
    trackingCode: "QSP-2026-5893",
    fullName: "Karimova Ziyoda Bahromovna",
    phone: "+998 93 711 34 55",
    address: "Qöşköpir şaharçasi, Yoşlik mahallasi",
    organizationType: "5-sonli MTT",
    subject: "Boğçaga navbat holatini tasdiqlaş",
    message: "Salom, 5-sonli 'Mitti qadamlar' boğçasiga my.gov.uz orqali ariza qoldirgan edim. Qabul vaqti va guruhlar şakllantirilişi haqida ma'lumot bersangiz.",
    date: "2026-11-08",
    status: "jarayonda",
    officer: "Maktabgaça ta'lim şöbasi mudiri G.Sobirova"
  }
];
