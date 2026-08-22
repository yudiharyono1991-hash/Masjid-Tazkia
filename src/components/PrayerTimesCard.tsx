import React, { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import { CITIES_DATA, CityPrayerTime } from '../lib/islamicUtils';

// Accurate Hijri date converter
function toHijri(date: Date): { day: number; month: number; year: number; monthName: string } {
  const hijriMonths = [
    'Muharram', 'Safar', "Rabi'ul Awal", "Rabi'ul Akhir",
    'Jumadil Awal', 'Jumadil Akhir', 'Rajab', "Sya'ban",
    'Ramadhan', 'Syawal', "Dzulqa'dah", 'Dzulhijjah'
  ];

  // Julian Day Number
  const Y = date.getFullYear();
  const M = date.getMonth() + 1;
  const D = date.getDate();
  const JD = Math.floor((1461 * (Y + 4800 + Math.floor((M - 14) / 12))) / 4)
    + Math.floor((367 * (M - 2 - 12 * Math.floor((M - 14) / 12))) / 12)
    - Math.floor((3 * Math.floor((Y + 4900 + Math.floor((M - 14) / 12)) / 100)) / 4)
    + D - 32075;

  // Convert JD to Hijri
  const l = JD - 1948440 + 10632;
  const n = Math.floor((l - 1) / 10631);
  const lAdj = l - 10631 * n + 354;
  const j = Math.floor((10985 - lAdj) / 5316) * Math.floor((50 * lAdj) / 17719)
    + Math.floor(lAdj / 5670) * Math.floor((43 * lAdj) / 15238);
  const lAdj2 = lAdj - Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50)
    - Math.floor(j / 16) * Math.floor((15238 * j) / 43) + 29;
  const monthH = Math.floor((24 * lAdj2) / 709);
  const dayH = lAdj2 - Math.floor((709 * monthH) / 24);
  const yearH = 30 * n + j - 30;

  return {
    day: dayH,
    month: monthH,
    year: yearH,
    monthName: hijriMonths[monthH - 1] || ''
  };
}

export const PrayerTimesCard: React.FC = () => {
  const city: CityPrayerTime = CITIES_DATA[0]; // Sentul / Bogor (Masjid Tazkia)
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Update every 30 seconds
    const timer = setInterval(() => setCurrentTime(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

  const prayers = [
    { key: 'SUBUH',   time: city.fajr },
    { key: 'DZUHUR',  time: city.dhuhr },
    { key: 'ASHAR',   time: city.asr },
    { key: 'MAGHRIB', time: city.maghrib },
    { key: 'ISYA',    time: city.isha }
  ];

  // Next upcoming prayer detection using Indonesia (WIB) time
  const nowWIB = new Date(currentTime.toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }));
  const nowMinutes = nowWIB.getHours() * 60 + nowWIB.getMinutes();
  
  const toMinutes = (t: string) => {
    const [h, m] = t.split(':').map(Number);
    return h * 60 + m;
  };
  
  // Highlight the NEXT upcoming prayer (waiting for the next one)
  let activeIdx = 0; // default: waiting for Subuh
  let found = false;
  for (let i = 0; i < prayers.length; i++) {
    if (nowMinutes < toMinutes(prayers[i].time)) {
      activeIdx = i; // This prayer is coming next
      found = true;
      break;
    }
  }
  // Jika semua jadwal shalat hari ini sudah lewat (contoh: sudah jam 8 malam),
  // maka otomatis kembali menunggu sholat Subuh esok harinya (index 0).
  if (!found) activeIdx = 0;

  // Format date in Bahasa Indonesia
  const dateStr = currentTime.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Jakarta'
  });

  // Accurate Hijri date
  const hijri = toHijri(currentTime);
  const hijriStr = `${hijri.day} ${hijri.monthName} ${hijri.year} H`;

  return (
    <section className="w-full bg-white flex justify-center px-4 py-5">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-md border border-slate-100 px-5 py-4">
        
        {/* Header */}
        <div className="mb-3">
          <div className="flex items-center gap-1.5 text-slate-800 font-bold text-sm">
            <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
            <span>Sentul City, Bogor</span>
          </div>
          <p className="text-slate-400 text-[11px] mt-0.5">{dateStr} &bull; {hijriStr}</p>
        </div>

        {/* Prayer Times Row */}
        <div className="grid grid-cols-5 gap-1 sm:gap-3">
          {prayers.map((p, idx) => {
            const isActive = idx === activeIdx;
            return (
              <div key={p.key} className="text-center">
                <p className={`text-[9px] sm:text-[11px] font-bold uppercase tracking-wider mb-1 ${
                  isActive ? 'text-blue-600' : 'text-slate-400'
                }`}>
                  {p.key}
                </p>
                <p className={`text-sm sm:text-lg font-bold font-mono ${
                  isActive ? 'text-blue-600' : 'text-slate-800'
                }`}>
                  {p.time}
                </p>
                {isActive && (
                  <div className="mt-1 h-0.5 w-5 bg-blue-600 rounded-full mx-auto" />
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
