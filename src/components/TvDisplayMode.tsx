import React, { useState, useEffect, useRef } from 'react';
import { CITIES_DATA, CityPrayerTime, SURAHS_LIST } from '../lib/islamicUtils';
import { Announcement, PetugasJadwal, AppAdminSettings } from '../types';
import { Tv, X, Volume2, VolumeX, Play, Pause, Calendar, MapPin, Sparkles, Home } from 'lucide-react';

const QARI_LIST = [
  { id: 'alafasy', name: 'Mishary Rashid Alafasy', baseUrl: 'https://server8.mp3quran.net/afs/' },
  { id: 'abdulbasit', name: 'Abdul Basit', baseUrl: 'https://server7.mp3quran.net/basit/' },
  { id: 'sudais', name: 'Abdurrahman As-Sudais', baseUrl: 'https://server11.mp3quran.net/sds/' }
];

interface TvDisplayModeProps {
  onExit: () => void;
  announcements: Announcement[];
  petugasList: PetugasJadwal[];
  adminSettings?: AppAdminSettings;
}

export const TvDisplayMode: React.FC<TvDisplayModeProps> = ({
  onExit,
  announcements,
  petugasList,
  adminSettings
}) => {
  const [time, setTime] = useState<Date>(new Date());
  const [selectedCity] = useState<CityPrayerTime>(CITIES_DATA[0]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [selectedQari, setSelectedQari] = useState<string>(QARI_LIST[0].baseUrl);
  const [selectedSurah, setSelectedSurah] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(e => {
        console.error("Autoplay blocked by browser", e);
        setIsPlaying(false);
      });
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, selectedQari, selectedSurah]);

  const getActivePrayerIndex = () => {
    const parseTime = (timeStr: string) => {
      const [h, m] = timeStr.split(':').map(Number);
      return h * 60 + m;
    };
    const currentMinutes = time.getHours() * 60 + time.getMinutes();
    
    const fajr = parseTime(selectedCity.fajr);
    const sunrise = parseTime(selectedCity.sunrise);
    const dhuhr = parseTime(selectedCity.dhuhr);
    const asr = parseTime(selectedCity.asr);
    const maghrib = parseTime(selectedCity.maghrib);
    const isha = parseTime(selectedCity.isha);

    if (currentMinutes >= isha || currentMinutes < fajr) return 0; // Subuh
    if (currentMinutes >= fajr && currentMinutes < sunrise) return 1; // Terbit
    if (currentMinutes >= sunrise && currentMinutes < dhuhr) return 2; // Dzuhur
    if (currentMinutes >= dhuhr && currentMinutes < asr) return 3; // Ashar
    if (currentMinutes >= asr && currentMinutes < maghrib) return 4; // Maghrib
    if (currentMinutes >= maghrib && currentMinutes < isha) return 5; // Isya
    return 0;
  };
  const activePrayerIdx = getActivePrayerIndex();

  const getActivePrayerPhase = () => {
    const parseTime = (timeStr: string) => {
      const [h, m] = timeStr.split(':').map(Number);
      return h * 60 + m;
    };
    
    const currentMinutes = time.getHours() * 60 + time.getMinutes();
    const currentSeconds = currentMinutes * 60 + time.getSeconds();
    
    const adzanDur = adminSettings?.adzanDurationMinutes || 4;
    const iqamahDur = adminSettings?.iqamahCountdownMinutes || 10;
    const sholatDur = adminSettings?.sholatDurationMinutes || 15;

    const prayers = [
      { name: 'SUBUH', time: parseTime(selectedCity.fajr) },
      { name: time.getDay() === 5 ? 'JUMAT' : 'DZUHUR', time: parseTime(selectedCity.dhuhr) },
      { name: 'ASHAR', time: parseTime(selectedCity.asr) },
      { name: 'MAGHRIB', time: parseTime(selectedCity.maghrib) },
      { name: 'ISYA', time: parseTime(selectedCity.isha) }
    ];

    for (const prayer of prayers) {
      let prayerMinutes = prayer.time;
      let diffMinutes = currentMinutes - prayerMinutes;
      let diffSeconds = currentSeconds - (prayerMinutes * 60);

      // Simple handling for same day
      if (diffMinutes >= 0) {
        if (diffMinutes < adzanDur) {
           return { phase: 'ADZAN', prayerName: prayer.name };
        } else if (diffMinutes < adzanDur + iqamahDur) {
           const targetSeconds = (prayerMinutes + adzanDur + iqamahDur) * 60;
           return { phase: 'IQAMAH', prayerName: prayer.name, remainingSeconds: targetSeconds - currentSeconds };
        } else if (diffMinutes < adzanDur + iqamahDur + sholatDur) {
           return { phase: 'SHOLAT', prayerName: prayer.name };
        }
      }
    }
    
    return { phase: 'NORMAL', prayerName: '', remainingSeconds: 0 };
  };

  const prayerPhase = getActivePrayerPhase();
  const formatCountdown = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Auto rotate slides every 8 seconds
  useEffect(() => {
    const slideTimer = setInterval(() => {
      setCurrentSlideIndex(prev => (prev + 1) % 3);
    }, 8000);
    return () => clearInterval(slideTimer);
  }, []);

  const timeStr = time.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).replace(/\./g, ':');
  const dateStr = time.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  
  let hijriDateStr = '';
  try {
    const hijriFormatter = new Intl.DateTimeFormat('id-ID-u-ca-islamic', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    // Adjust by -1 day for Indonesian local sighting (MABIMS)
    const hijriDateObj = new Date(time.getTime() - 24 * 60 * 60 * 1000);
    hijriDateStr = hijriFormatter.format(hijriDateObj).replace(' AH', ' H').replace(' H', ' H');
  } catch (e) {
    hijriDateStr = '... H'; // Fallback
  }

  const audioUrl = `${selectedQari}${String(selectedSurah).padStart(3, '0')}.mp3`;

  const nextFriday = petugasList.find(p => p.khatibJumat);

  if (prayerPhase.phase === 'SHOLAT') {
    return (
      <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center cursor-none select-none">
         <p className="text-[#111] text-xs font-bold uppercase tracking-widest">{adminSettings?.sholatRunningText || 'SHALAT BERJAMAAH SEDANG BERLANGSUNG'}</p>
         {/* Hidden exit button so admin can still escape if stuck */}
         <button onClick={onExit} className="absolute bottom-4 right-4 w-10 h-10 opacity-0 cursor-pointer" title="Keluar" />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#070c1b] text-white flex flex-col justify-between p-2 sm:p-6 font-sans overflow-y-auto sm:overflow-hidden select-none">
      {/* Top Header Bar */}
      <div className="flex flex-col lg:flex-row items-center justify-between border-b border-amber-500/30 pb-4 bg-blue-900/60 p-4 rounded-2xl gap-4 lg:gap-0">
        <div className="flex items-center justify-between w-full lg:w-auto gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 rounded-2xl bg-amber-500/20 border border-amber-400 text-amber-400 flex items-center justify-center shadow-lg">
              <Tv className="w-6 h-6 sm:w-8 sm:h-8" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-white tracking-wide leading-tight">
                Masjid Tazkia
              </h1>
              <p className="text-[10px] sm:text-xs text-amber-400 font-medium flex items-center gap-1 sm:gap-2 mt-0.5">
                <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                <span className="truncate max-w-[160px] sm:max-w-none">Sentul City, Bogor • {selectedCity.name}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Audio Player & Digital Clock */}
        <div className="flex flex-col sm:flex-row items-center gap-4 lg:gap-6 w-full lg:w-auto justify-between lg:justify-end">
          
          <div className="flex flex-col gap-2 w-full sm:w-auto">
            <div className="flex items-center gap-2 bg-blue-950/80 p-2 sm:p-3 rounded-xl border border-blue-800 w-full justify-between sm:justify-start overflow-hidden">
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-8 h-8 sm:w-10 sm:h-10 shrink-0 rounded-lg bg-blue-800 hover:bg-blue-700 flex items-center justify-center text-amber-400 transition-colors"
              >
                {isPlaying ? <Pause className="w-4 h-4 sm:w-5 sm:h-5" /> : <Play className="w-4 h-4 sm:w-5 sm:h-5 ml-1" />}
              </button>
              <div className="flex flex-col text-left min-w-0 flex-1 px-1">
                <span className="text-[8px] sm:text-[9px] font-mono text-blue-400 uppercase tracking-widest truncate">Murottal Al-Quran</span>
                <div className="flex gap-1 sm:gap-2 mt-0.5">
                  <select 
                    value={selectedQari}
                    onChange={(e) => setSelectedQari(e.target.value)}
                    className="bg-transparent text-amber-300 text-[10px] sm:text-xs font-bold outline-none cursor-pointer w-20 sm:w-28 truncate appearance-none"
                  >
                    {QARI_LIST.map(q => (
                      <option key={q.id} value={q.baseUrl} className="bg-blue-900">{q.name}</option>
                    ))}
                  </select>
                  <select 
                    value={selectedSurah}
                    onChange={(e) => setSelectedSurah(Number(e.target.value))}
                    className="bg-transparent text-amber-300 text-[10px] sm:text-xs font-bold outline-none cursor-pointer w-16 sm:w-24 truncate appearance-none border-l border-blue-800 pl-1 sm:pl-2"
                  >
                    {SURAHS_LIST.map(s => (
                      <option key={s.number} value={s.number} className="bg-blue-900">{s.number}. {s.englishName}</option>
                    ))}
                  </select>
                </div>
              </div>
              <audio 
                ref={audioRef}
                src={audioUrl} 
                onEnded={() => {
                  if (selectedSurah < 114) {
                    setSelectedSurah(prev => prev + 1);
                  } else {
                    setSelectedSurah(1); // loop back to Al-Fatihah
                  }
                }}
                style={{ display: 'none' }}
                id="murottal-player"
              />
            </div>
            {/* Mobile Exit Button moved here */}
            <button
              onClick={onExit}
              className="lg:hidden w-full flex items-center justify-center gap-2 p-2.5 bg-blue-800 hover:bg-blue-700 text-blue-200 rounded-xl border border-blue-700 cursor-pointer transition-colors shadow-sm"
              title="Kembali ke Beranda"
            >
              <Home className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-wider">Kembali ke Beranda</span>
            </button>
          </div>

          <div className="text-center lg:text-right hidden sm:block">
            <div className="text-3xl lg:text-5xl font-mono font-extrabold text-amber-400 tracking-wider">
              {timeStr}
            </div>
            <p className="text-[10px] lg:text-xs text-blue-300 mt-1 font-medium">
              {dateStr} • <span className="text-amber-300 font-serif">{hijriDateStr}</span>
            </p>
          </div>

          {/* Desktop Exit Button */}
          <button
            onClick={onExit}
            className="hidden lg:flex items-center gap-2 p-3 px-5 bg-blue-800 hover:bg-blue-700 text-blue-200 rounded-2xl border border-blue-700 cursor-pointer shrink-0 transition-colors shadow-lg"
            title="Kembali ke Beranda"
          >
            <Home className="w-5 h-5" />
            <span className="text-sm font-bold uppercase tracking-widest">Beranda</span>
          </button>
        </div>
      </div>

      {/* Center Dynamic Content */}
      <div className="my-auto py-8">
        {prayerPhase.phase === 'NORMAL' ? (
          <>
            {currentSlideIndex === 0 && (
              <div className="bg-gradient-to-r from-blue-900 via-[#0f1d3a] to-blue-900 border-2 border-amber-500/40 rounded-3xl p-4 sm:p-8 max-w-5xl mx-auto shadow-2xl text-center space-y-4 animate-fade-in">
                <div className="flex items-center justify-center gap-2">
                  <span className="bg-amber-500 text-blue-950 font-bold font-mono text-xs px-3 py-1 rounded-full uppercase tracking-widest inline-block">
                    INFORMASI KHUTBAH JUMAT
                  </span>
                  {adminSettings?.jumatTimeInfo && (
                    <span className="bg-blue-800 text-amber-300 font-mono text-xs px-3 py-1 rounded-full border border-amber-500/30">
                      {adminSettings.jumatTimeInfo}
                    </span>
                  )}
                </div>
                <h2 className="text-lg sm:text-4xl font-serif font-bold text-amber-300 leading-snug">
                  "{adminSettings?.jumatTopicTitle || nextFriday?.topikJumat || 'Optimalisasi ZISWAF untuk Kesejahteraan Umat'}"
                </h2>
                <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-2 sm:gap-6 text-sm sm:text-lg pt-2 text-blue-200 font-sans">
                  <p>Khatib: <strong className="text-white font-serif">{adminSettings?.jumatKhatibName || nextFriday?.khatibJumat || 'Prof. Dr. KH. Nasaruddin Umar, MA'}</strong></p>
                  <p>Imam: <strong className="text-white font-serif">{adminSettings?.jumatImamName || nextFriday?.imamJumat || 'Ustadz H. M. Zainuddin, Sq'}</strong></p>
                  {adminSettings?.jumatMuadzinName && (
                    <p>Muadzin: <strong className="text-white font-serif">{adminSettings.jumatMuadzinName}</strong></p>
                  )}
                </div>
              </div>
            )}

            {currentSlideIndex === 1 && (
              <div className="bg-gradient-to-r from-blue-900 via-[#0f1d3a] to-blue-900 border-2 border-amber-500/40 rounded-3xl p-4 sm:p-8 max-w-5xl mx-auto shadow-2xl text-center space-y-4 animate-fade-in">
                <span className="bg-blue-500 text-blue-950 font-bold font-mono text-xs px-3 py-1 rounded-full uppercase tracking-widest inline-block">
                  HADIS SHAHIH HARI INI
                </span>
                <p className="text-2xl sm:text-4xl font-serif text-amber-300 leading-relaxed font-arabic" dir="rtl">
                  مَا نَقَصَتْ صَدَقَةٌ مِنْ مَالٍ
                </p>
                <p className="text-sm sm:text-xl text-blue-200 max-w-3xl mx-auto font-serif italic">
                  "Sedekah itu tidak akan pernah mengurangi harta sedikit pun, melainkan Allah akan menambah kemuliaan."
                </p>
                <p className="text-xs text-amber-400 font-mono">(HR. Muslim no. 2588)</p>
              </div>
            )}

            {currentSlideIndex === 2 && (
              <div className="bg-gradient-to-r from-blue-900 via-[#0f1d3a] to-blue-900 border-2 border-amber-500/40 rounded-3xl p-4 sm:p-8 max-w-5xl mx-auto shadow-2xl text-center space-y-4 animate-fade-in">
                <span className="bg-amber-500 text-blue-950 font-bold font-mono text-xs px-3 py-1 rounded-full uppercase tracking-widest inline-block">
                  PROGRAM WAKAF UTAMA
                </span>
                <h2 className="text-xl sm:text-4xl font-serif font-bold text-white">
                  Wakaf Tunai Sound System & Akustik Ruang Shalat Utama
                </h2>
                <p className="text-sm sm:text-base text-blue-300 max-w-2xl mx-auto">
                  Dukung pengadaan tata suara jernih kristal untuk kekhusyu'an ibadah jamaah Masjid Tazkia.
                </p>
                <p className="text-sm sm:text-xl text-amber-400 font-mono font-bold">
                  Terkumpul: Rp 8.25M / Target: Rp 15M
                </p>
              </div>
            )}
          </>
        ) : prayerPhase.phase === 'ADZAN' ? (
          <div className="bg-red-900/40 border-4 border-red-500/80 rounded-3xl p-8 sm:p-16 max-w-5xl mx-auto shadow-2xl text-center space-y-6 animate-pulse">
            <h2 className="text-4xl sm:text-7xl font-bold text-white tracking-widest uppercase">WAKTU ADZAN</h2>
            <p className="text-2xl sm:text-5xl font-mono font-bold text-red-200">{prayerPhase.prayerName}</p>
          </div>
        ) : prayerPhase.phase === 'IQAMAH' ? (
          <div className="bg-[#0f1d3a]/80 border-4 border-amber-500/50 rounded-3xl p-8 sm:p-16 max-w-5xl mx-auto shadow-2xl text-center space-y-6">
            <h2 className="text-2xl sm:text-4xl font-bold text-amber-400 tracking-widest uppercase">MENUJU IQAMAH</h2>
            <div className="text-6xl sm:text-9xl font-mono font-extrabold text-white animate-pulse">
              {formatCountdown(prayerPhase.remainingSeconds)}
            </div>
            <p className="text-xl sm:text-3xl font-mono font-bold text-blue-300">{prayerPhase.prayerName}</p>
          </div>
        ) : null}
      </div>

      {/* Bottom Prayer Times Bar */}
      <div className="space-y-4">
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-3">
          {[
            { name: 'SUBUH', time: selectedCity.fajr },
            { name: 'TERBIT', time: selectedCity.sunrise },
            { name: 'DZUHUR', time: selectedCity.dhuhr },
            { name: 'ASHAR', time: selectedCity.asr },
            { name: 'MAGHRIB', time: selectedCity.maghrib },
            { name: 'ISYA', time: selectedCity.isha }
          ].map((item, idx) => {
            const isActive = idx === activePrayerIdx;
            return (
              <div
              key={idx}
              className={`p-2 sm:p-4 rounded-2xl border text-center transition-all ${
                isActive
                  ? 'bg-amber-500 text-blue-950 border-amber-300 shadow-2xl scale-105'
                  : 'bg-blue-900/90 border-blue-800 text-blue-200'
              }`}
            >
              <p className={`text-[10px] sm:text-xs font-bold font-mono ${isActive ? 'text-blue-950' : 'text-blue-400'}`}>
                {item.name}
              </p>
              <p className={`text-lg sm:text-3xl font-extrabold font-mono mt-1 ${isActive ? 'text-blue-950' : 'text-amber-400'}`}>
                {item.time}
              </p>
            </div>
          )})}
        </div>

        {/* Running Text Announcement Footer */}
        <div className="bg-amber-500/20 border border-amber-500/30 rounded-xl px-4 py-2 overflow-hidden whitespace-nowrap">
          <div className="inline-block animate-marquee font-medium space-x-8">
            {prayerPhase.phase === 'ADZAN' ? (
              <span className="text-lg sm:text-2xl font-bold text-red-400 uppercase">{adminSettings?.adzanRunningText || 'SAAT INI WAKTU ADZAN. HARAP TENANG DAN LURUSKAN SHAF.'}</span>
            ) : prayerPhase.phase === 'IQAMAH' ? (
              <span className="text-lg sm:text-2xl font-bold text-amber-400 uppercase">{adminSettings?.iqamahRunningText || 'WAKTU SHOLAT BERJAMAAH AKAN SEGERA DIMULAI. HARAP NONAKTIFKAN PONSEL ANDA.'}</span>
            ) : (
              <div className="text-xs text-amber-300">
                <span>• Harap mematikan atau mengheningkan nada dering ponsel saat berada di ruang shalat utama. </span>
                <span>• Kajian Subuh Berkah setiap hari Sabtu bersama KH. Ridwan Kamil, Lc. </span>
                <span>• Salurkan ZISWAF Anda melalui Portal Digital Masjid Tazkia atau Sekertariat DKM.</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

