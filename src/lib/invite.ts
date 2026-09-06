export const NIKAH_ISO = "2026-10-24T20:00:00+05:30";

export const couple = {
  bride: {
    name: "Nemat Aafreen",
    honorific: "Dr.",
    urdu: "نعمت آفریں",
    parents: ["Mr. Rizwan Ahmad", "Mrs. Shabnam Nigar"],
    line: "Granddaughter of Mr. Gayasuddin Ahmad",
    place: "Samanpura, Raja Bazar, Patna",
  },
  groom: {
    name: "Bakhtiyar Alam",
    honorific: "Er.",
    urdu: "بختیار عالم",
    parents: ["Late Md. Mansoor Alam", "Mrs. Najbun Nisa"],
    line: "",
    place: "Katar, Hasan Bazar, Bhojpur, Bihar",
  },
} as const;

export type Rasm = {
  key: string;
  title: string;
  urdu: string;
  date: string;
  time: string;
  iso: string;
  note: string;
  atVenue: boolean;
};

export const rasms: Rasm[] = [
  {
    key: "manjha",
    title: "Manjha & Haldi",
    urdu: "مانجھا و ہلدی",
    date: "Thursday, 22 October 2026",
    time: "7:00 PM",
    iso: "2026-10-22T19:00:00+05:30",
    note: "The turmeric rasm at the family residence — dholak, colour, and the first laughter of the week.",
    atVenue: false,
  },
  {
    key: "milad",
    title: "Milad & Mehandi",
    urdu: "میلاد و مہندی",
    date: "Friday, 23 October 2026",
    time: "7:00 PM",
    iso: "2026-10-23T19:00:00+05:30",
    note: "Milad-e-Sharif, and then henna until midnight.",
    atVenue: false,
  },
  {
    key: "barat",
    title: "Arrival of Barat",
    urdu: "آمدِ بارات",
    date: "Saturday, 24 October 2026",
    time: "7:00 PM",
    iso: "2026-10-24T19:00:00+05:30",
    note: "The groom's procession is welcomed at the gates.",
    atVenue: true,
  },
  {
    key: "nikah",
    title: "Nikah & Dinner",
    urdu: "نکاح و طعام",
    date: "Saturday, 24 October 2026",
    time: "8:00 PM",
    iso: NIKAH_ISO,
    note: "The nikah, and the walima dinner that follows. This is the moment we most want you present for.",
    atVenue: true,
  },
  {
    key: "rukhsati",
    title: "Rukhsati",
    urdu: "رخصتی",
    date: "Sunday, 25 October 2026",
    time: "6:00 AM",
    iso: "2026-10-25T06:00:00+05:30",
    note: "The farewell at first light. Please keep them in your duas.",
    atVenue: true,
  },
];

export const venue = {
  name: "Kishan Palace",
  lines: [
    "RPS More, near Metro Pillar No. 134, Kalikat",
    "Bailey Road, Patna, Bihar — 801503",
  ],
  mapsQuery: "Kishan Palace Bailey Road Patna",
};

export const hosts = {
  invitedBy: "Mr. & Mrs. Rizwan Ahmad",
  address: ["Flat No. 304, Madeena Tower", "Samanpura, Raja Bazar, Patna — 800014"],
  phones: [
    { label: "94312 19453", tel: "+919431219453" },
    { label: "76898 00407", tel: "+917689800407" },
  ],
  rsvpBy: "10 October 2026",
};

export const scripture = {
  bismillah: "بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ",
  dua: "بَارَكَ اللّٰهُ لَكُمَا وَبَارَكَ عَلَيْكُمَا وَجَمَعَ بَيْنَكُمَا فِيْ خَيْرٍ",
  duaTranslation:
    "May Allah bless you both, and shower His blessings upon you, and unite you in goodness.",
  ayah:
    "And among His signs is that He created for you mates from among yourselves, that you may find tranquillity in them — and He placed between you affection and mercy.",
  ayahRef: "Ar-Rum 30:21",
};
