export function formatRupiah(amount: number): string {
  if (amount >= 1000000000) {
    const bill = amount / 1000000000;
    return `Rp ${bill % 1 === 0 ? bill : bill.toFixed(1)}M`;
  } else if (amount >= 1000000) {
    const jt = amount / 1000000;
    return `Rp ${jt % 1 === 0 ? jt : jt.toFixed(1)}Jt`;
  } else if (amount >= 1000) {
    const rb = amount / 1000;
    return `Rp ${rb % 1 === 0 ? rb : rb.toFixed(1)}rb`;
  }
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(amount);
}

export function formatRupiahFull(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(amount);
}

export interface CityPrayerTime {
  name: string;
  lat: number;
  lng: number;
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
}

export const CITIES_DATA: CityPrayerTime[] = [
  {
    name: 'Sentul / Bogor (Masjid Tazkia)',
    lat: -6.5815,
    lng: 106.8710,
    fajr: '04:44',
    sunrise: '06:01',
    dhuhr: '12:03',
    asr: '15:25',
    maghrib: '18:01',
    isha: '19:13'
  },
  {
    name: 'Jakarta & Depok',
    lat: -6.2088,
    lng: 106.8456,
    fajr: '04:43',
    sunrise: '06:00',
    dhuhr: '12:02',
    asr: '15:24',
    maghrib: '18:00',
    isha: '19:12'
  },
  {
    name: 'Bandung',
    lat: -6.9175,
    lng: 107.6191,
    fajr: '04:41',
    sunrise: '05:58',
    dhuhr: '12:00',
    asr: '15:22',
    maghrib: '17:58',
    isha: '19:10'
  },
  {
    name: 'Surabaya',
    lat: -7.2575,
    lng: 112.7521,
    fajr: '04:22',
    sunrise: '05:39',
    dhuhr: '11:41',
    asr: '15:02',
    maghrib: '17:39',
    isha: '18:51'
  },
  {
    name: 'Medan',
    lat: 3.5952,
    lng: 98.6722,
    fajr: '05:01',
    sunrise: '06:21',
    dhuhr: '12:30',
    asr: '15:53',
    maghrib: '18:35',
    isha: '19:48'
  },
  {
    name: 'Makassar',
    lat: -5.1477,
    lng: 119.4327,
    fajr: '04:47',
    sunrise: '06:04',
    dhuhr: '12:08',
    asr: '15:30',
    maghrib: '18:06',
    isha: '19:18'
  }
];

// Calculate Qibla angle from user lat/lng to Mecca (21.4225, 39.8262)
export function calculateQiblaDirection(userLat: number, userLng: number): number {
  const meccaLat = 21.4225 * (Math.PI / 180);
  const meccaLng = 39.8262 * (Math.PI / 180);
  const phi = userLat * (Math.PI / 180);
  const lambda = userLng * (Math.PI / 180);

  const deltaLambda = meccaLng - lambda;

  const y = Math.sin(deltaLambda);
  const x = Math.cos(phi) * Math.tan(meccaLat) - Math.sin(phi) * Math.cos(deltaLambda);

  let qiblaRad = Math.atan2(y, x);
  let qiblaDeg = qiblaRad * (180 / Math.PI);

  if (qiblaDeg < 0) {
    qiblaDeg += 360;
  }

  return Math.round(qiblaDeg);
}

export function getHijriDate(date: Date = new Date(), offsetDays: number = 0): string {
  const offsetDate = new Date(date.getTime() + (offsetDays * 24 * 60 * 60 * 1000));
  const formatted = new Intl.DateTimeFormat('id-u-ca-islamic', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(offsetDate);
  return formatted.replace(/ AH| H/gi, '') + ' H';
}

export const SURAHS_LIST = [
  {
    "number": 1,
    "name": "+�+�+�+�+�+�+� +�+�+�+�+�+�+�+�+�+�+�+�",
    "englishName": "Al-Faatiha",
    "translation": "The Opening",
    "ayahsCount": 7,
    "type": "Makkiyah"
  },
  {
    "number": 2,
    "name": "+�+�+�+�+�+�+� +�+�+�+�+�+�+�+�+�+�",
    "englishName": "Al-Baqara",
    "translation": "The Cow",
    "ayahsCount": 286,
    "type": "Madaniyah"
  },
  {
    "number": 3,
    "name": "+�+�+�+�+�+�+� +�+�+�+� +�+�+��+�+�+�+�+�",
    "englishName": "Aal-i-Imraan",
    "translation": "The Family of Imraan",
    "ayahsCount": 200,
    "type": "Madaniyah"
  },
  {
    "number": 4,
    "name": "+�+�+�+�+�+�+� +�+�+�+�+�+�+�+�+�+�",
    "englishName": "An-Nisaa",
    "translation": "The Women",
    "ayahsCount": 176,
    "type": "Madaniyah"
  },
  {
    "number": 5,
    "name": "+�+�+�+�+�+�+� +�+�+�+�+�+�+�+�+�+�+�+�",
    "englishName": "Al-Maaida",
    "translation": "The Table",
    "ayahsCount": 120,
    "type": "Madaniyah"
  },
  {
    "number": 6,
    "name": "+�+�+�+�+�+�+� +�+�+�+�+��+�+�+�+�+�",
    "englishName": "Al-An'aam",
    "translation": "The Cattle",
    "ayahsCount": 165,
    "type": "Makkiyah"
  },
  {
    "number": 7,
    "name": "+�+�+�+�+�+�+� +�+�+�+�+���+�+�+�+�+�",
    "englishName": "Al-A'raaf",
    "translation": "The Heights",
    "ayahsCount": 206,
    "type": "Makkiyah"
  },
  {
    "number": 8,
    "name": "+�+�+�+�+�+�+� +�+�+�+�+�+�+�+�+�+�",
    "englishName": "Al-Anfaal",
    "translation": "The Spoils of War",
    "ayahsCount": 75,
    "type": "Madaniyah"
  },
  {
    "number": 9,
    "name": "+�+�+�+�+�+�+� +�+�+�+�+�+��+�+�+�+�",
    "englishName": "At-Tawba",
    "translation": "The Repentance",
    "ayahsCount": 129,
    "type": "Madaniyah"
  },
  {
    "number": 10,
    "name": "+�+�+�+�+�+�+� +�+�+�+�+�+�+�",
    "englishName": "Yunus",
    "translation": "Jonas",
    "ayahsCount": 109,
    "type": "Makkiyah"
  },
  {
    "number": 11,
    "name": "+�+�+�+�+�+�+� +�+�+�+�+�",
    "englishName": "Hud",
    "translation": "Hud",
    "ayahsCount": 123,
    "type": "Makkiyah"
  },
  {
    "number": 12,
    "name": "+�+�+�+�+�+�+� +�+�+�+�+�+�+�",
    "englishName": "Yusuf",
    "translation": "Joseph",
    "ayahsCount": 111,
    "type": "Makkiyah"
  },
  {
    "number": 13,
    "name": "+�+�+�+�+�+�+� +�+�+�+�+�+���+�+�",
    "englishName": "Ar-Ra'd",
    "translation": "The Thunder",
    "ayahsCount": 43,
    "type": "Madaniyah"
  },
  {
    "number": 14,
    "name": "+�+�+�+�+�+�+� +�+�+���+�+�+�+�+�+�+�+�",
    "englishName": "Ibrahim",
    "translation": "Abraham",
    "ayahsCount": 52,
    "type": "Makkiyah"
  },
  {
    "number": 15,
    "name": "+�+�+�+�+�+�+� +�+�+�+�+���+�+�",
    "englishName": "Al-Hijr",
    "translation": "The Rock",
    "ayahsCount": 99,
    "type": "Makkiyah"
  },
  {
    "number": 16,
    "name": "+�+�+�+�+�+�+� +�+�+�+�+�+���+�+�",
    "englishName": "An-Nahl",
    "translation": "The Bee",
    "ayahsCount": 128,
    "type": "Makkiyah"
  },
  {
    "number": 17,
    "name": "+�+�+�+�+�+�+� +�+�+�+�+���+�+�+�+�+�",
    "englishName": "Al-Israa",
    "translation": "The Night Journey",
    "ayahsCount": 111,
    "type": "Makkiyah"
  },
  {
    "number": 18,
    "name": "+�+�+�+�+�+�+� +�+�+�+�+��+�+�",
    "englishName": "Al-Kahf",
    "translation": "The Cave",
    "ayahsCount": 110,
    "type": "Makkiyah"
  },
  {
    "number": 19,
    "name": "+�+�+�+�+�+�+� +�+�+���+�+�+�+�",
    "englishName": "Maryam",
    "translation": "Mary",
    "ayahsCount": 98,
    "type": "Makkiyah"
  },
  {
    "number": 20,
    "name": "+�+�+�+�+�+�+� +++�",
    "englishName": "Taa-Haa",
    "translation": "Taa-Haa",
    "ayahsCount": 135,
    "type": "Makkiyah"
  },
  {
    "number": 21,
    "name": "+�+�+�+�+�+�+� +�+�+�+�+�+�+�+�+�+�+�+�",
    "englishName": "Al-Anbiyaa",
    "translation": "The Prophets",
    "ayahsCount": 112,
    "type": "Makkiyah"
  },
  {
    "number": 22,
    "name": "+�+�+�+�+�+�+� +�+�+�+�+�+�+�",
    "englishName": "Al-Hajj",
    "translation": "The Pilgrimage",
    "ayahsCount": 78,
    "type": "Madaniyah"
  },
  {
    "number": 23,
    "name": "+�+�+�+�+�+�+� +�+�+�+�+��+�+�+�+�+�+�+�",
    "englishName": "Al-Muminoon",
    "translation": "The Believers",
    "ayahsCount": 118,
    "type": "Makkiyah"
  },
  {
    "number": 24,
    "name": "+�+�+�+�+�+�+� +�+�+�+�+�+�+�+�",
    "englishName": "An-Noor",
    "translation": "The Light",
    "ayahsCount": 64,
    "type": "Madaniyah"
  },
  {
    "number": 25,
    "name": "+�+�+�+�+�+�+� +�+�+�+�+���+�+�+�+�+�",
    "englishName": "Al-Furqaan",
    "translation": "The Criterion",
    "ayahsCount": 77,
    "type": "Makkiyah"
  },
  {
    "number": 26,
    "name": "+�+�+�+�+�+�+� +�+�+�+�+�+�+�+�+�+�+�+�",
    "englishName": "Ash-Shu'araa",
    "translation": "The Poets",
    "ayahsCount": 227,
    "type": "Makkiyah"
  },
  {
    "number": 27,
    "name": "+�+�+�+�+�+�+� +�+�+�+�+�+��+�+�",
    "englishName": "An-Naml",
    "translation": "The Ant",
    "ayahsCount": 93,
    "type": "Makkiyah"
  },
  {
    "number": 28,
    "name": "+�+�+�+�+�+�+� +�+�+�+�+�+�+�+�",
    "englishName": "Al-Qasas",
    "translation": "The Stories",
    "ayahsCount": 88,
    "type": "Makkiyah"
  },
  {
    "number": 29,
    "name": "+�+�+�+�+�+�+� +�+�+�+�+�+�+�+�+�+�+�+�",
    "englishName": "Al-Ankaboot",
    "translation": "The Spider",
    "ayahsCount": 69,
    "type": "Makkiyah"
  },
  {
    "number": 30,
    "name": "+�+�+�+�+�+�+� +�+�+�+�+�+�+�+�",
    "englishName": "Ar-Room",
    "translation": "The Romans",
    "ayahsCount": 60,
    "type": "Makkiyah"
  },
  {
    "number": 31,
    "name": "+�+�+�+�+�+�+� +�+�+��+�+�+�+�+�",
    "englishName": "Luqman",
    "translation": "Luqman",
    "ayahsCount": 34,
    "type": "Makkiyah"
  },
  {
    "number": 32,
    "name": "+�+�+�+�+�+�+� +�+�+�+�+�+���+�+�+�+�",
    "englishName": "As-Sajda",
    "translation": "The Prostration",
    "ayahsCount": 30,
    "type": "Makkiyah"
  },
  {
    "number": 33,
    "name": "+�+�+�+�+�+�+� +�+�+�+�+���+�+�+�+�+�",
    "englishName": "Al-Ahzaab",
    "translation": "The Clans",
    "ayahsCount": 73,
    "type": "Madaniyah"
  },
  {
    "number": 34,
    "name": "+�+�+�+�+�+�+� +�+�+�+�+�+�",
    "englishName": "Saba",
    "translation": "Sheba",
    "ayahsCount": 54,
    "type": "Makkiyah"
  },
  {
    "number": 35,
    "name": "+�+�+�+�+�+�+� +�+�+�+++�+�+�",
    "englishName": "Faatir",
    "translation": "The Originator",
    "ayahsCount": 45,
    "type": "Makkiyah"
  },
  {
    "number": 36,
    "name": "+�+�+�+�+�+�+� +�+�+�",
    "englishName": "Yaseen",
    "translation": "Yaseen",
    "ayahsCount": 83,
    "type": "Makkiyah"
  },
  {
    "number": 37,
    "name": "+�+�+�+�+�+�+� +�+�+�+�+�+�+�+�+�+�+�+�",
    "englishName": "As-Saaffaat",
    "translation": "Those drawn up in Ranks",
    "ayahsCount": 182,
    "type": "Makkiyah"
  },
  {
    "number": 38,
    "name": "+�+�+�+�+�+�+� +�+�",
    "englishName": "Saad",
    "translation": "The letter Saad",
    "ayahsCount": 88,
    "type": "Makkiyah"
  },
  {
    "number": 39,
    "name": "+�+�+�+�+�+�+� +�+�+�+�+�+�+�+�+�",
    "englishName": "Az-Zumar",
    "translation": "The Groups",
    "ayahsCount": 75,
    "type": "Makkiyah"
  },
  {
    "number": 40,
    "name": "+�+�+�+�+�+�+� +�+�+�+�+�+�+�",
    "englishName": "Ghafir",
    "translation": "The Forgiver",
    "ayahsCount": 85,
    "type": "Makkiyah"
  },
  {
    "number": 41,
    "name": "+�+�+�+�+�+�+� +�+�+�+�+�+�+�+���",
    "englishName": "Fussilat",
    "translation": "Explained in detail",
    "ayahsCount": 54,
    "type": "Makkiyah"
  },
  {
    "number": 42,
    "name": "+�+�+�+�+�+�+� +�+�+�+�+�+�+�+�+�+�",
    "englishName": "Ash-Shura",
    "translation": "Consultation",
    "ayahsCount": 53,
    "type": "Makkiyah"
  },
  {
    "number": 43,
    "name": "+�+�+�+�+�+�+� +�+�+�+�+�+���+�+�+�+�",
    "englishName": "Az-Zukhruf",
    "translation": "Ornaments of gold",
    "ayahsCount": 89,
    "type": "Makkiyah"
  },
  {
    "number": 44,
    "name": "+�+�+�+�+�+�+� +�+�+�+�+�+�+�+�+�+�",
    "englishName": "Ad-Dukhaan",
    "translation": "The Smoke",
    "ayahsCount": 59,
    "type": "Makkiyah"
  },
  {
    "number": 45,
    "name": "+�+�+�+�+�+�+� +�+�+�+�+�+�+�+�+�+�+�",
    "englishName": "Al-Jaathiya",
    "translation": "Crouching",
    "ayahsCount": 37,
    "type": "Makkiyah"
  },
  {
    "number": 46,
    "name": "+�+�+�+�+�+�+� +�+�+�+�+���+�+�+�+�+�",
    "englishName": "Al-Ahqaf",
    "translation": "The Dunes",
    "ayahsCount": 35,
    "type": "Makkiyah"
  },
  {
    "number": 47,
    "name": "+�+�+�+�+�+�+� +�+�+�+�+�+�+�+�+�",
    "englishName": "Muhammad",
    "translation": "Muhammad",
    "ayahsCount": 38,
    "type": "Madaniyah"
  },
  {
    "number": 48,
    "name": "+�+�+�+�+�+�+� +�+�+�+�+���+�+�",
    "englishName": "Al-Fath",
    "translation": "The Victory",
    "ayahsCount": 29,
    "type": "Madaniyah"
  },
  {
    "number": 49,
    "name": "+�+�+�+�+�+�+� +�+�+�+�+�+�+�+�+�+�+�",
    "englishName": "Al-Hujuraat",
    "translation": "The Inner Apartments",
    "ayahsCount": 18,
    "type": "Madaniyah"
  },
  {
    "number": 50,
    "name": "+�+�+�+�+�+�+� +�+�",
    "englishName": "Qaaf",
    "translation": "The letter Qaaf",
    "ayahsCount": 45,
    "type": "Makkiyah"
  },
  {
    "number": 51,
    "name": "+�+�+�+�+�+�+� +�+�+�+�+�+�+�+�+�+�+�+�+�",
    "englishName": "Adh-Dhaariyat",
    "translation": "The Winnowing Winds",
    "ayahsCount": 60,
    "type": "Makkiyah"
  },
  {
    "number": 52,
    "name": "+�+�+�+�+�+�+� +�+�+++�+�+�+�+�",
    "englishName": "At-Tur",
    "translation": "The Mount",
    "ayahsCount": 49,
    "type": "Makkiyah"
  },
  {
    "number": 53,
    "name": "+�+�+�+�+�+�+� +�+�+�+�+�+���+�+�",
    "englishName": "An-Najm",
    "translation": "The Star",
    "ayahsCount": 62,
    "type": "Makkiyah"
  },
  {
    "number": 54,
    "name": "+�+�+�+�+�+�+� +�+�+�+�+�+�+�+�",
    "englishName": "Al-Qamar",
    "translation": "The Moon",
    "ayahsCount": 55,
    "type": "Makkiyah"
  },
  {
    "number": 55,
    "name": "+�+�+�+�+�+�+� +�+�+�+�+�+���+�+�+�+�",
    "englishName": "Ar-Rahmaan",
    "translation": "The Beneficent",
    "ayahsCount": 78,
    "type": "Madaniyah"
  },
  {
    "number": 56,
    "name": "+�+�+�+�+�+�+� +�+�+�+�+�+�+�+�+�+�+�",
    "englishName": "Al-Waaqia",
    "translation": "The Inevitable",
    "ayahsCount": 96,
    "type": "Makkiyah"
  },
  {
    "number": 57,
    "name": "+�+�+�+�+�+�+� +�+�+�+�+�+�+�+�+�",
    "englishName": "Al-Hadid",
    "translation": "The Iron",
    "ayahsCount": 29,
    "type": "Madaniyah"
  },
  {
    "number": 58,
    "name": "+�+�+�+�+�+�+� +�+�+�+�+�+�+�+�+�+�+�+�",
    "englishName": "Al-Mujaadila",
    "translation": "The Pleading Woman",
    "ayahsCount": 22,
    "type": "Madaniyah"
  },
  {
    "number": 59,
    "name": "+�+�+�+�+�+�+� +�+�+�+�+���+�+�",
    "englishName": "Al-Hashr",
    "translation": "The Exile",
    "ayahsCount": 24,
    "type": "Madaniyah"
  },
  {
    "number": 60,
    "name": "+�+�+�+�+�+�+� +�+�+�+�+��+�+�+�+�+�+�+�",
    "englishName": "Al-Mumtahana",
    "translation": "She that is to be examined",
    "ayahsCount": 13,
    "type": "Madaniyah"
  },
  {
    "number": 61,
    "name": "+�+�+�+�+�+�+� +�+�+�+�+�+�+�+�",
    "englishName": "As-Saff",
    "translation": "The Ranks",
    "ayahsCount": 14,
    "type": "Madaniyah"
  },
  {
    "number": 62,
    "name": "+�+�+�+�+�+�+� +�+�+�+�+�+�+�+�+�+�",
    "englishName": "Al-Jumu'a",
    "translation": "Friday",
    "ayahsCount": 11,
    "type": "Madaniyah"
  },
  {
    "number": 63,
    "name": "+�+�+�+�+�+�+� +�+�+�+�+�+�+�+�+�+�+�+�+�+�",
    "englishName": "Al-Munaafiqoon",
    "translation": "The Hypocrites",
    "ayahsCount": 11,
    "type": "Madaniyah"
  },
  {
    "number": 64,
    "name": "+�+�+�+�+�+�+� +�+�+�+�+�+�+�+�+�+�+�+�",
    "englishName": "At-Taghaabun",
    "translation": "Mutual Disillusion",
    "ayahsCount": 18,
    "type": "Madaniyah"
  },
  {
    "number": 65,
    "name": "+�+�+�+�+�+�+� +�+�+++�+�+�+�+�+�+�",
    "englishName": "At-Talaaq",
    "translation": "Divorce",
    "ayahsCount": 12,
    "type": "Madaniyah"
  },
  {
    "number": 66,
    "name": "+�+�+�+�+�+�+� +�+�+�+�+�+���+�+�+�+�+�",
    "englishName": "At-Tahrim",
    "translation": "The Prohibition",
    "ayahsCount": 12,
    "type": "Madaniyah"
  },
  {
    "number": 67,
    "name": "+�+�+�+�+�+�+� +�+�+�+�+��+�+�",
    "englishName": "Al-Mulk",
    "translation": "The Sovereignty",
    "ayahsCount": 30,
    "type": "Makkiyah"
  },
  {
    "number": 68,
    "name": "+�+�+�+�+�+�+� +�+�+�+�+�+�+�+�",
    "englishName": "Al-Qalam",
    "translation": "The Pen",
    "ayahsCount": 52,
    "type": "Makkiyah"
  },
  {
    "number": 69,
    "name": "+�+�+�+�+�+�+� +�+�+�+�+�+�+�+�+�+�",
    "englishName": "Al-Haaqqa",
    "translation": "The Reality",
    "ayahsCount": 52,
    "type": "Makkiyah"
  },
  {
    "number": 70,
    "name": "+�+�+�+�+�+�+� +�+�+�+�+�+�+�+�+�+�+�",
    "englishName": "Al-Ma'aarij",
    "translation": "The Ascending Stairways",
    "ayahsCount": 44,
    "type": "Makkiyah"
  },
  {
    "number": 71,
    "name": "+�+�+�+�+�+�+� +�+�+�+�+�",
    "englishName": "Nooh",
    "translation": "Noah",
    "ayahsCount": 28,
    "type": "Makkiyah"
  },
  {
    "number": 72,
    "name": "+�+�+�+�+�+�+� +�+�+�+�+�+�+�",
    "englishName": "Al-Jinn",
    "translation": "The Jinn",
    "ayahsCount": 28,
    "type": "Makkiyah"
  },
  {
    "number": 73,
    "name": "+�+�+�+�+�+�+� +�+�+�+�+�+�+�+�+�+�+�+�",
    "englishName": "Al-Muzzammil",
    "translation": "The Enshrouded One",
    "ayahsCount": 20,
    "type": "Makkiyah"
  },
  {
    "number": 74,
    "name": "+�+�+�+�+�+�+� +�+�+�+�+�+�+�+�+�+�+�+�",
    "englishName": "Al-Muddaththir",
    "translation": "The Cloaked One",
    "ayahsCount": 56,
    "type": "Makkiyah"
  },
  {
    "number": 75,
    "name": "+�+�+�+�+�+�+� +�+�+�+�+�+�+�+�+�+�+�",
    "englishName": "Al-Qiyaama",
    "translation": "The Resurrection",
    "ayahsCount": 40,
    "type": "Makkiyah"
  },
  {
    "number": 76,
    "name": "+�+�+�+�+�+�+� +�+�+�+�+�+�+�+�+�+�",
    "englishName": "Al-Insaan",
    "translation": "Man",
    "ayahsCount": 31,
    "type": "Madaniyah"
  },
  {
    "number": 77,
    "name": "+�+�+�+�+�+�+� +�+�+�+�+���+�+�+�+�+�+�+�",
    "englishName": "Al-Mursalaat",
    "translation": "The Emissaries",
    "ayahsCount": 50,
    "type": "Makkiyah"
  },
  {
    "number": 78,
    "name": "+�+�+�+�+�+�+� +�+�+�+�+�+�+�+�+�",
    "englishName": "An-Naba",
    "translation": "The Announcement",
    "ayahsCount": 40,
    "type": "Makkiyah"
  },
  {
    "number": 79,
    "name": "+�+�+�+�+�+�+� +�+�+�+�+�+�+�+�+�+�+�+�+�",
    "englishName": "An-Naazi'aat",
    "translation": "Those who drag forth",
    "ayahsCount": 46,
    "type": "Makkiyah"
  },
  {
    "number": 80,
    "name": "+�+�+�+�+�+�+� +�+�+�+�+�+�",
    "englishName": "Abasa",
    "translation": "He frowned",
    "ayahsCount": 42,
    "type": "Makkiyah"
  },
  {
    "number": 81,
    "name": "+�+�+�+�+�+�+� +�+�+�+�+�+��+�+�+�+�+�",
    "englishName": "At-Takwir",
    "translation": "The Overthrowing",
    "ayahsCount": 29,
    "type": "Makkiyah"
  },
  {
    "number": 82,
    "name": "+�+�+�+�+�+�+� +�+�+�+�+�+�+++�+�+�+�",
    "englishName": "Al-Infitaar",
    "translation": "The Cleaving",
    "ayahsCount": 19,
    "type": "Makkiyah"
  },
  {
    "number": 83,
    "name": "+�+�+�+�+�+�+� +�+�+�+�+++�+�+�+�+�+�+�+�+�",
    "englishName": "Al-Mutaffifin",
    "translation": "Defrauding",
    "ayahsCount": 36,
    "type": "Makkiyah"
  },
  {
    "number": 84,
    "name": "+�+�+�+�+�+�+� +�+�+�+�+�+�+�+�+�+�+�",
    "englishName": "Al-Inshiqaaq",
    "translation": "The Splitting Open",
    "ayahsCount": 25,
    "type": "Makkiyah"
  },
  {
    "number": 85,
    "name": "+�+�+�+�+�+�+� +�+�+�+�+�+�+�+�+�",
    "englishName": "Al-Burooj",
    "translation": "The Constellations",
    "ayahsCount": 22,
    "type": "Makkiyah"
  },
  {
    "number": 86,
    "name": "+�+�+�+�+�+�+� +�+�+++�+�+�+�+�+�+�",
    "englishName": "At-Taariq",
    "translation": "The Morning Star",
    "ayahsCount": 17,
    "type": "Makkiyah"
  },
  {
    "number": 87,
    "name": "+�+�+�+�+�+�+� +�+�+�+�+���+�+�+�+�",
    "englishName": "Al-A'laa",
    "translation": "The Most High",
    "ayahsCount": 19,
    "type": "Makkiyah"
  },
  {
    "number": 88,
    "name": "+�+�+�+�+�+�+� +�+�+�+�+�+�+�+�+�+�+�",
    "englishName": "Al-Ghaashiya",
    "translation": "The Overwhelming",
    "ayahsCount": 26,
    "type": "Makkiyah"
  },
  {
    "number": 89,
    "name": "+�+�+�+�+�+�+� +�+�+�+�+���+�+�",
    "englishName": "Al-Fajr",
    "translation": "The Dawn",
    "ayahsCount": 30,
    "type": "Makkiyah"
  },
  {
    "number": 90,
    "name": "+�+�+�+�+�+�+� +�+�+�+�+�+�+�+�",
    "englishName": "Al-Balad",
    "translation": "The City",
    "ayahsCount": 20,
    "type": "Makkiyah"
  },
  {
    "number": 91,
    "name": "+�+�+�+�+�+�+� +�+�+�+�+�+��+�+�",
    "englishName": "Ash-Shams",
    "translation": "The Sun",
    "ayahsCount": 15,
    "type": "Makkiyah"
  },
  {
    "number": 92,
    "name": "+�+�+�+�+�+�+� +�+�+�+�+�+��+�+�",
    "englishName": "Al-Lail",
    "translation": "The Night",
    "ayahsCount": 21,
    "type": "Makkiyah"
  },
  {
    "number": 93,
    "name": "+�+�+�+�+�+�+� +�+�+�+�+�+�+�+�+�",
    "englishName": "Ad-Dhuhaa",
    "translation": "The Morning Hours",
    "ayahsCount": 11,
    "type": "Makkiyah"
  },
  {
    "number": 94,
    "name": "+�+�+�+�+�+�+� +�+�+�+�+�+���+�+�",
    "englishName": "Ash-Sharh",
    "translation": "The Consolation",
    "ayahsCount": 8,
    "type": "Makkiyah"
  },
  {
    "number": 95,
    "name": "+�+�+�+�+�+�+� +�+�+�+�+�+�+�+�",
    "englishName": "At-Tin",
    "translation": "The Fig",
    "ayahsCount": 8,
    "type": "Makkiyah"
  },
  {
    "number": 96,
    "name": "+�+�+�+�+�+�+� +�+�+�+�+�+�+�+�",
    "englishName": "Al-Alaq",
    "translation": "The Clot",
    "ayahsCount": 19,
    "type": "Makkiyah"
  },
  {
    "number": 97,
    "name": "+�+�+�+�+�+�+� +�+�+�+�+���+�+�",
    "englishName": "Al-Qadr",
    "translation": "The Power, Fate",
    "ayahsCount": 5,
    "type": "Makkiyah"
  },
  {
    "number": 98,
    "name": "+�+�+�+�+�+�+� +�+�+�+�+�+�+�+�+�+�+�",
    "englishName": "Al-Bayyina",
    "translation": "The Evidence",
    "ayahsCount": 8,
    "type": "Madaniyah"
  },
  {
    "number": 99,
    "name": "+�+�+�+�+�+�+� +�+�+�+�+�+��+�+�+�+�+�+�",
    "englishName": "Az-Zalzala",
    "translation": "The Earthquake",
    "ayahsCount": 8,
    "type": "Madaniyah"
  },
  {
    "number": 100,
    "name": "+�+�+�+�+�+�+� +�+�+�+�+�+�+�+�+�+�+�+�",
    "englishName": "Al-Aadiyaat",
    "translation": "The Chargers",
    "ayahsCount": 11,
    "type": "Makkiyah"
  },
  {
    "number": 101,
    "name": "+�+�+�+�+�+�+� +�+�+�+�+�+�+�+�+�+�+�",
    "englishName": "Al-Qaari'a",
    "translation": "The Calamity",
    "ayahsCount": 11,
    "type": "Makkiyah"
  },
  {
    "number": 102,
    "name": "+�+�+�+�+�+�+� +�+�+�+�+�+�+�+�+�+�+�+�",
    "englishName": "At-Takaathur",
    "translation": "Competition",
    "ayahsCount": 8,
    "type": "Makkiyah"
  },
  {
    "number": 103,
    "name": "+�+�+�+�+�+�+� +�+�+�+�+���+�+�",
    "englishName": "Al-Asr",
    "translation": "The Declining Day, Epoch",
    "ayahsCount": 3,
    "type": "Makkiyah"
  },
  {
    "number": 104,
    "name": "+�+�+�+�+�+�+� +�+�+�+�+�+�+�+�+�+�",
    "englishName": "Al-Humaza",
    "translation": "The Traducer",
    "ayahsCount": 9,
    "type": "Makkiyah"
  },
  {
    "number": 105,
    "name": "+�+�+�+�+�+�+� +�+�+�+�+�+�+�",
    "englishName": "Al-Fil",
    "translation": "The Elephant",
    "ayahsCount": 5,
    "type": "Makkiyah"
  },
  {
    "number": 106,
    "name": "+�+�+�+�+�+�+� +�+�+�+�+��+�+�",
    "englishName": "Quraish",
    "translation": "Quraysh",
    "ayahsCount": 4,
    "type": "Makkiyah"
  },
  {
    "number": 107,
    "name": "+�+�+�+�+�+�+� +�+�+�+�+�+�+�+�+�+�",
    "englishName": "Al-Maa'un",
    "translation": "Almsgiving",
    "ayahsCount": 7,
    "type": "Makkiyah"
  },
  {
    "number": 108,
    "name": "+�+�+�+�+�+�+� +�+�+�+�+��+�+�+�+�",
    "englishName": "Al-Kawthar",
    "translation": "Abundance",
    "ayahsCount": 3,
    "type": "Makkiyah"
  },
  {
    "number": 109,
    "name": "+�+�+�+�+�+�+� +�+�+�+�+�+�+�+�+�+�+�+�",
    "englishName": "Al-Kaafiroon",
    "translation": "The Disbelievers",
    "ayahsCount": 6,
    "type": "Makkiyah"
  },
  {
    "number": 110,
    "name": "+�+�+�+�+�+�+� +�+�+�+�+�+���+�+�",
    "englishName": "An-Nasr",
    "translation": "Divine Support",
    "ayahsCount": 3,
    "type": "Madaniyah"
  },
  {
    "number": 111,
    "name": "+�+�+�+�+�+�+� +�+�+�+�+�+�+�+�",
    "englishName": "Al-Masad",
    "translation": "The Palm Fibre",
    "ayahsCount": 5,
    "type": "Makkiyah"
  },
  {
    "number": 112,
    "name": "+�+�+�+�+�+�+� +�+�+�+�+���+�+�+�+�+�",
    "englishName": "Al-Ikhlaas",
    "translation": "Sincerity",
    "ayahsCount": 4,
    "type": "Makkiyah"
  },
  {
    "number": 113,
    "name": "+�+�+�+�+�+�+� +�+�+�+�+�+�+�+�",
    "englishName": "Al-Falaq",
    "translation": "The Dawn",
    "ayahsCount": 5,
    "type": "Makkiyah"
  },
  {
    "number": 114,
    "name": "+�+�+�+�+�+�+� +�+�+�+�+�+�+�+�",
    "englishName": "An-Naas",
    "translation": "Mankind",
    "ayahsCount": 6,
    "type": "Makkiyah"
  }
];

export const SAMPLE_AYAHS_ALFATIHAH = [
  {
    "numberInSurah": 1,
    "text": "?????? ??????? ???????????? ??????????",
    "translation": "Dengan menyebut nama Allah Yang Maha Pemurah lagi Maha Penyayang."
  },
  {
    "numberInSurah": 2,
    "text": "????????? ??????? ????? ?????????????",
    "translation": "Segala puji bagi Allah, Tuhan semesta alam."
  },
  {
    "numberInSurah": 3,
    "text": "???????????? ??????????",
    "translation": "Maha Pemurah lagi Maha Penyayang."
  },
  {
    "numberInSurah": 4,
    "text": "??????? ?????? ????????",
    "translation": "Yang menguasai di Hari Pembalasan."
  },
  {
    "numberInSurah": 5,
    "text": "???????? ???????? ?????????? ???????????",
    "translation": "Hanya Engkaulah yang kami sembah, dan hanya kepada Engkaulah kami meminta pertolongan."
  },
  {
    "numberInSurah": 6,
    "text": "???????? ?????????? ??????????????",
    "translation": "Tunjukilah kami jalan yang lurus,"
  },
  {
    "numberInSurah": 7,
    "text": "??????? ????????? ?????????? ?????????? ?????? ???????????? ?????????? ????? ?????????????",
    "translation": "(yaitu) jalan orang-orang yang telah Engkau beri nikmat kepada mereka; bukan (jalan) mereka yang dimurkai dan bukan (pula jalan) mereka yang sesat."
  }
];
