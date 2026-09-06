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

  leaveMessage: { en: "Leave a message", ur: "پیغام لکھیے" },
  messageCaption: {
    en: "A line for Nemat and Bakhtiyar. The family reads every one.",
    ur: "نعمت اور بختیار کے نام دو حرف۔ اہلِ خانہ ہر پیغام پڑھتے ہیں۔",
  },
  yourMessage: { en: "Your message", ur: "آپ کا پیغام" },
  messagePlaceholder: {
    en: "A dua, a memory, a blessing…",
    ur: "دعا، کوئی یاد، یا مبارکباد…",
  },
  yourName: { en: "Your name", ur: "آپ کا نام" },
  optional: { en: "optional", ur: "اختیاری" },
  namePlaceholder: { en: "So they know who wrote it", ur: "تاکہ وہ جان سکیں" },
  sending: { en: "Sending…", ur: "بھیجا جا رہا ہے…" },
  sendMessage: { en: "Send message", ur: "پیغام بھیجیں" },
  needMessage: { en: "Please write a message first.", ur: "پہلے پیغام لکھیے۔" },
  recorded: { en: "Your message has been sent.", ur: "آپ کا پیغام بھیج دیا گیا" },
  recordedBody: {
    en: "Thank you — the family will read it. We hope to see you in October.",
    ur: "شکریہ — اہلِ خانہ اسے ضرور پڑھیں گے۔ اکتوبر میں ملاقات ہو۔",
  },
  sendAnother: { en: "Write another", ur: "ایک اور لکھیں" },

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
