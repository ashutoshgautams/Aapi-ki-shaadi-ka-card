/**
 * The printed card is bilingual, so the page is too. Urdu strings follow the
 * wording on the physical invitation wherever it has an equivalent.
 */

export type Lang = "en" | "ur";

export const dict = {
  tapToOpen: { en: "Tap to open", ur: "کھولنے کے لیے چھوئیں" },
  scroll: { en: "Scroll", ur: "نیچے دیکھیں" },
  musicOn: { en: "Music on", ur: "موسیقی جاری" },
  musicOff: { en: "Music off", ur: "موسیقی بند" },

  togetherWithFamilies: { en: "Together with their families", ur: "اپنے اہلِ خانہ کے ہمراہ" },
  atPatna: { en: "24 October 2026 · Patna", ur: "۲۴ اکتوبر ۲۰۲۶ء · پٹنہ" },

  theBride: { en: "The bride", ur: "دلہن" },
  theGroom: { en: "The groom", ur: "دولہا" },
  daughterOf: { en: "Daughter of", ur: "بنت" },
  sonOf: { en: "Son of", ur: "ابن" },
  grandDaughterOf: { en: "Granddaughter of", ur: "پوتی" },
  andSo: { en: "And so", ur: "اور یوں" },
  twoFamilies: { en: "two families become one", ur: "دو خاندان ایک ہو رہے ہیں" },

  saveTheDate: { en: "Save the date", ur: "تاریخ محفوظ رکھیں" },
  untilNikah: { en: "Until the Nikah", ur: "نکاح میں باقی" },
  next: { en: "Next", ur: "اگلی تقریب" },
  celebrationsBegun: { en: "The celebrations have begun.", ur: "تقریبات کا آغاز ہو چکا ہے۔" },
  days: { en: "Days", ur: "دن" },
  hours: { en: "Hours", ur: "گھنٹے" },
  minutes: { en: "Minutes", ur: "منٹ" },
  seconds: { en: "Seconds", ur: "سیکنڈ" },
  alhamdulillah: { en: "Alhamdulillah", ur: "الحمد للہ" },
  marriedOn: { en: "They were married on", ur: "نکاح ہوا" },
  yearsTogether: { en: "together, and counting.", ur: "سے ایک ساتھ" },
  year: { en: "year", ur: "سال" },
  years: { en: "years", ur: "سال" },
  day: { en: "day", ur: "دن" },
  daysWord: { en: "days", ur: "دن" },

  celebrations: { en: "The celebrations", ur: "تقریبات" },
  fiveGatherings: {
    en: "Five gatherings across four days.",
    ur: "چار دنوں میں پانچ تقریبات۔",
  },
  atVenueLine: { en: "At Kishan Palace, Bailey Road, Patna.", ur: "کسان پیلیس، بیلی روڈ، پٹنہ" },

  whereToFindUs: { en: "Where to find us", ur: "مقامِ تقریب" },
  openInMaps: { en: "Open in Maps", ur: "نقشے پر دیکھیں" },
  addToCalendar: { en: "Add the Nikah to calendar", ur: "کیلنڈر میں محفوظ کریں" },

  willYouJoin: { en: "Will you join us?", ur: "کیا آپ تشریف لائیں گے؟" },
  rsvpCaption: {
    en: "Fill this in here — it goes straight to the family's list. Nothing else to open.",
    ur: "یہیں مکمل کریں — یہ سیدھا اہلِ خانہ تک پہنچے گا۔",
  },
  yourName: { en: "Your name", ur: "آپ کا نام" },
  namePlaceholder: { en: "Who is writing?", ur: "آپ کا اسمِ گرامی" },
  phone: { en: "Phone (optional)", ur: "فون (اختیاری)" },
  phonePlaceholder: { en: "So we can reach you", ur: "رابطے کے لیے" },
  willYouBeThere: { en: "Will you be there?", ur: "کیا آپ شریک ہوں گے؟" },
  yesWithJoy: { en: "Yes, with joy", ur: "جی ہاں، ضرور" },
  sadlyNo: { en: "Sadly, no", ur: "معذرت، نہیں" },
  howMany: { en: "How many of you?", ur: "کتنے افراد؟" },
  whichRasms: { en: "Which rasms will you join?", ur: "کن رسومات میں شرکت کریں گے؟" },
  messageFor: {
    en: "A message for Nemat & Bakhtiyar",
    ur: "دولہا دلہن کے نام پیغام",
  },
  messagePlaceholder: {
    en: "A dua, a memory, a line of advice…",
    ur: "دعا، کوئی یاد، یا نصیحت…",
  },
  sending: { en: "Sending…", ur: "ارسال ہو رہا ہے…" },
  sendToFamily: { en: "Send to the family", ur: "ارسال کریں" },
  replyBy: { en: "Kindly reply by", ur: "براہِ کرم اطلاع دیں" },
  recorded: { en: "Thank you — it's recorded.", ur: "شکریہ — آپ کا پیغام موصول ہو گیا" },
  willBeMissed: {
    en: "You will be missed. Your message has been passed to the family.",
    ur: "آپ کی کمی محسوس ہوگی۔ آپ کا پیغام اہلِ خانہ تک پہنچا دیا گیا ہے۔",
  },
  waitingForYou: {
    en: "The family will be waiting for you at Kishan Palace.",
    ur: "اہلِ خانہ کسان پیلیس میں آپ کے منتظر رہیں گے۔",
  },

  invitedBy: { en: "Invited by", ur: "دعوت دہندگان" },
  questions: { en: "Questions? Call", ur: "رابطہ" },
} as const;

export type Key = keyof typeof dict;

export function translate(key: Key, lang: Lang): string {
  return dict[key][lang];
}

/** Western digits → Urdu-Indic, for numerals shown inside Urdu text. */
export function digits(value: string | number, lang: Lang): string {
  const s = String(value);
  if (lang !== "ur") return s;
  const ur = "۰۱۲۳۴۵۶۷۸۹";
  return s.replace(/\d/g, (d) => ur[Number(d)]);
}
