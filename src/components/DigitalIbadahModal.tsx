import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  BookOpen,
  Calendar,
  Compass,
  Volume2,
  Search,
  Play,
  Pause,
  Check,
  Bell,
  MapPin,
  Sparkles,
  Share2,
  SkipForward,
  SkipBack,
  RotateCcw,
  CheckCircle2
} from 'lucide-react';
import {
  SURAHS_LIST,
  SAMPLE_AYAHS_ALFATIHAH,
  CITIES_DATA,
  calculateQiblaDirection,
  getHijriDate,
  CityPrayerTime
} from '../lib/islamicUtils';
import { INITIAL_DOA, INITIAL_HADIS } from '../lib/initialData';
import { useMasjidStore } from '../lib/store';

interface DigitalIbadahModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'quran' | 'salat' | 'kiblat' | 'doa';
}

export const DigitalIbadahModal: React.FC<DigitalIbadahModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'quran'
}) => {
  const { state, fetchOnlinePrayerTimes } = useMasjidStore();
  const [activeSubTab, setActiveSubTab] = useState<'quran' | 'salat' | 'kiblat' | 'doa'>(initialTab);

  // Quran State
  const [selectedSurahNumber, setSelectedSurahNumber] = useState<number>(1);
  const [quranSearch, setQuranSearch] = useState<string>('');
  
  // Audio Playback Engine State
  const [activeAyahIndex, setActiveAyahIndex] = useState<number>(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [audioSpeed, setAudioSpeed] = useState<number>(1.0);
  const [autoScrollEnabled, setAutoScrollEnabled] = useState<boolean>(true);

  // Prayer Time State
  const [selectedCity, setSelectedCity] = useState<CityPrayerTime>(CITIES_DATA[0]);

  useEffect(() => {
    if (isOpen && fetchOnlinePrayerTimes && !state.onlinePrayerData) {
      fetchOnlinePrayerTimes();
    }
  }, [isOpen, fetchOnlinePrayerTimes, state.onlinePrayerData]);

  const prayerTimesSrc = state.onlinePrayerData ? {
    fajr: state.onlinePrayerData.timings.Fajr,
    sunrise: state.onlinePrayerData.timings.Sunrise,
    dhuhr: state.onlinePrayerData.timings.Dhuhr,
    asr: state.onlinePrayerData.timings.Asr,
    maghrib: state.onlinePrayerData.timings.Maghrib,
    isha: state.onlinePrayerData.timings.Isha
  } : selectedCity;

  let displayHijriDate = getHijriDate(new Date(), state.adminSettings?.hijriOffsetDays);
  if (state.onlinePrayerData && state.onlinePrayerData.date && state.onlinePrayerData.date.hijri) {
    const h = state.onlinePrayerData.date.hijri;
    displayHijriDate = `${h.day} ${h.month.en} ${h.year} H`;
  }

  const [alarmEnabled, setAlarmEnabled] = useState<boolean>(true);

  // Qibla Compass State
  const [userCompassHeading, setUserCompassHeading] = useState<number>(45);

  // Doa State
  const [doaSearch, setDoaSearch] = useState<string>('');
  const [doaCategory, setDoaCategory] = useState<string>('Semua');

  // Quran Ayah State
  const [currentAyahs, setCurrentAyahs] = useState<any[]>([]);
  const [isLoadingAyahs, setIsLoadingAyahs] = useState<boolean>(true);

  // Audio HTML5 Ref
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ayahRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  useEffect(() => {
    setActiveSubTab(initialTab);
  }, [initialTab, isOpen]);

  // Handle Surah change or audio end
  const currentSurah = SURAHS_LIST.find(s => s.number === selectedSurahNumber) || SURAHS_LIST[0];
  
  // Fetch real ayahs for selected surah
  useEffect(() => {
    let isMounted = true;
    const fetchAyahs = async () => {
      setIsLoadingAyahs(true);
      try {
        const response = await fetch(`https://api.alquran.cloud/v1/surah/${selectedSurahNumber}/editions/quran-uthmani,id.indonesian,en.transliteration`);
        const result = await response.json();
        
        if (result.code === 200 && isMounted) {
          const ar = result.data[0].ayahs;
          const id = result.data[1].ayahs;
          const lat = result.data[2].ayahs;
          
          const formattedAyahs = ar.map((ayah: any, index: number) => {
            let text = ayah.text;
            if (selectedSurahNumber !== 1 && selectedSurahNumber !== 9 && ayah.numberInSurah === 1) {
              text = text.replace('بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ ', '');
            }
            return {
              numberInSurah: ayah.numberInSurah,
              text: text,
              translation: id[index].text,
              latin: lat[index].text
            };
          });
          
          setCurrentAyahs(formattedAyahs);
        }
      } catch (error) {
        console.error("Failed to fetch surah data", error);
      } finally {
        if (isMounted) setIsLoadingAyahs(false);
      }
    };
    
    fetchAyahs();
    
    return () => { isMounted = false; };
  }, [selectedSurahNumber]);

  // Auto Scroll active ayah into view
  useEffect(() => {
    if (autoScrollEnabled && isPlayingAudio && ayahRefs.current[activeAyahIndex]) {
      ayahRefs.current[activeAyahIndex]?.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }, [activeAyahIndex, autoScrollEnabled, isPlayingAudio]);

  // Audio Playback logic
  useEffect(() => {
    if (!isPlayingAudio) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      return;
    }

    // Alafasy Audio URL generator
    // Global verse calculation for Alafasy Audio (1 to 6236)
    let globalVerse = activeAyahIndex + 1;
    if (selectedSurahNumber > 1) {
      let previousAyahsTotal = 0;
      for (let i = 0; i < selectedSurahNumber - 1; i++) {
        previousAyahsTotal += SURAHS_LIST[i].ayahsCount;
      }
      globalVerse = previousAyahsTotal + activeAyahIndex + 1;
    }

    const primaryAudioUrl = `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${globalVerse}.mp3`;

    if (!audioRef.current) {
      audioRef.current = new Audio(primaryAudioUrl);
    } else {
      audioRef.current.src = primaryAudioUrl;
    }

    audioRef.current.playbackRate = audioSpeed;

    // Adzan Audio Setup
    const adzanAudioUrl = 'https://media.blubrry.com/muslim_central_adhan/content.blubrry.com/muslim_central_adhan/Adhan_Makkah.mp3';
    let adzanAudio: HTMLAudioElement;
    if (typeof window !== 'undefined') {
      adzanAudio = new Audio(adzanAudioUrl);
    }

    const checkAdzan = () => {
      if (!alarmEnabled || !isOpen) return;
      const now = new Date();
      const currentHours = now.getHours().toString().padStart(2, '0');
      const currentMinutes = now.getMinutes().toString().padStart(2, '0');
      const currentTimeString = `${currentHours}:${currentMinutes}`;
      
      const prayerTimes = [
        prayerTimesSrc.fajr,
        prayerTimesSrc.dhuhr,
        prayerTimesSrc.asr,
        prayerTimesSrc.maghrib,
        prayerTimesSrc.isha
      ];

      // If the current time matches any prayer time exactly and seconds are close to 0, play adzan
      if (prayerTimes.includes(currentTimeString) && now.getSeconds() < 10) {
        if (adzanAudio && adzanAudio.paused) {
          adzanAudio.play().catch(e => console.log('Adzan playback blocked:', e));
        }
      }
    };

    const interval = setInterval(checkAdzan, 5000); // Check every 5 seconds

    const handleEnded = () => {
      if (activeAyahIndex < currentAyahs.length - 1) {
        setActiveAyahIndex(prev => prev + 1);
      } else {
        setIsPlayingAudio(false);
        setActiveAyahIndex(0);
      }
    };

    const handleError = () => {
      // Fallback synthetic audio tone to ensure audio never silently fails
      try {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440 + activeAyahIndex * 20, ctx.currentTime);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 1.2);
      } catch (err) {
        console.log('Audio synth playback fallback', err);
      }

      setTimeout(() => {
        if (activeAyahIndex < currentAyahs.length - 1) {
          setActiveAyahIndex(prev => prev + 1);
        } else {
          setIsPlayingAudio(false);
          setActiveAyahIndex(0);
        }
      }, 2000);
    };

    audioRef.current.addEventListener('ended', handleEnded);
    audioRef.current.addEventListener('error', handleError);

    audioRef.current.play().catch(e => {
      console.log('Audio autoplay prevented:', e);
      // Auto-advance after simulated duration
      const timer = setTimeout(() => {
        if (activeAyahIndex < currentAyahs.length - 1) {
          setActiveAyahIndex(prev => prev + 1);
        } else {
          setIsPlayingAudio(false);
        }
      }, 3000);
      return () => clearTimeout(timer);
    });

    return () => {
      clearInterval(interval);
      if (audioRef.current) {
        audioRef.current.removeEventListener('ended', handleEnded);
        audioRef.current.removeEventListener('error', handleError);
      }
    };
  }, [activeAyahIndex, isPlayingAudio, selectedSurahNumber, audioSpeed, alarmEnabled, selectedCity, isOpen]);

  if (!isOpen) return null;

  const qiblaAngle = calculateQiblaDirection(selectedCity.lat, selectedCity.lng);

  const filteredSurahs = SURAHS_LIST.filter(s =>
    s.englishName.toLowerCase().includes(quranSearch.toLowerCase()) ||
    s.translation.toLowerCase().includes(quranSearch.toLowerCase()) ||
    s.number.toString() === quranSearch
  );

  const filteredDoa = INITIAL_DOA.filter(d => {
    const matchesCat = doaCategory === 'Semua' || d.category === doaCategory;
    const matchesSearch = d.title.toLowerCase().includes(doaSearch.toLowerCase()) ||
                          d.translation.toLowerCase().includes(doaSearch.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const toggleAudioPlayer = () => {
    if (isPlayingAudio) {
      setIsPlayingAudio(false);
    } else {
      setIsPlayingAudio(true);
    }
  };

  const handlePlaySpecificAyah = (index: number) => {
    setActiveAyahIndex(index);
    setIsPlayingAudio(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-blue-950/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-[#0b1329] border border-amber-500/30 rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl relative text-blue-100 my-6">
        {/* Header Bar */}
        <div className="bg-blue-900 px-6 py-4 border-b border-blue-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold font-serif text-white">
                Fasilitas Ibadah Digital Masjid Tazkia
              </h3>
              <p className="text-xs text-blue-400">
                Al-Qur'an Digital, Jadwal Shalat &amp; Arah Kiblat
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setIsPlayingAudio(false);
              onClose();
            }}
            className="p-2 text-blue-400 hover:text-white rounded-xl hover:bg-blue-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sub Tabs Navigation */}
        <div className="flex border-b border-blue-800 bg-blue-950 p-2 gap-2 overflow-x-auto">
          {[
            { id: 'quran', label: "Al-Qur'an Tazkia", icon: BookOpen },
            { id: 'salat', label: 'Jadwal Shalat & Adzan', icon: Calendar },
            { id: 'kiblat', label: 'Penunjuk Arah Kiblat', icon: Compass }
          ].map(tab => {
            const IconComp = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`flex-1 min-w-[140px] py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  activeSubTab === tab.id
                    ? 'bg-amber-500 text-blue-950 shadow-md shadow-amber-500/20'
                    : 'text-blue-400 hover:text-blue-200 hover:bg-blue-900'
                }`}
              >
                <IconComp className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto">
          {/* 1. AL-QUR'AN DIGITAL WITH AUDIO ENGINE */}
          {activeSubTab === 'quran' && (
            <div className="bg-slate-50 text-slate-800 rounded-3xl overflow-hidden shadow-2xl border border-slate-200 h-[75vh]">
              <iframe 
                src="https://quran.tazkia.ac.id/" 
                className="w-full h-full" 
                style={{ border: 0 }} 
                title="Al-Quran Tazkia" 
              />
            </div>
          )}

          {/* 2. JADWAL SHALAT & ADZAN */}
          {activeSubTab === 'salat' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-blue-900 p-4 rounded-2xl border border-blue-800">
                <div>
                  <div className="flex items-center gap-2 text-amber-400 text-xs font-bold">
                    <MapPin className="w-4 h-4" />
                    <span>Lokasi Wilayah Shalat:</span>
                  </div>
                  <select
                    value={selectedCity.name}
                    onChange={(e) => {
                      const found = CITIES_DATA.find(c => c.name === e.target.value);
                      if (found) setSelectedCity(found);
                    }}
                    className="bg-blue-950 text-white font-bold text-sm border border-blue-800 rounded-xl px-3 py-1.5 mt-1 outline-none cursor-pointer"
                  >
                    {CITIES_DATA.map(c => (
                      <option key={c.name} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-4 text-right">
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest font-bold">
                      Notifikasi Adzan
                    </span>
                    <button
                      onClick={() => setAlarmEnabled(!alarmEnabled)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${alarmEnabled ? 'bg-amber-500' : 'bg-blue-800'}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${alarmEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </div>
                  <div className="text-right border-l border-blue-800 pl-4">
                    <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest font-bold">
                      Kalender Hijriah
                    </span>
                    <p className="text-sm font-bold text-white font-serif">{displayHijriDate}</p>
                  </div>
                </div>
              </div>

              {/* Prayer Grid Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                {[
                  { name: 'Subuh', time: prayerTimesSrc.fajr, icon: '🌅' },
                  { name: 'Terbit', time: prayerTimesSrc.sunrise, icon: '☀️' },
                  { name: 'Dzuhur', time: prayerTimesSrc.dhuhr, icon: '🌤️' },
                  { name: 'Ashar', time: prayerTimesSrc.asr, icon: '🌇' },
                  { name: 'Maghrib', time: prayerTimesSrc.maghrib, icon: '🌆' },
                  { name: 'Isya', time: prayerTimesSrc.isha, icon: '🌙' }
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-blue-900 border border-blue-800 text-center space-y-2 hover:border-amber-400/40 transition-colors"
                  >
                    <span className="text-2xl">{item.icon}</span>
                    <p className="text-xs text-blue-400 font-bold uppercase tracking-wider">{item.name}</p>
                    <p className="text-lg font-mono font-bold text-amber-400">{item.time}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. ARAN KIBLAT */}
          {activeSubTab === 'kiblat' && (
            <div className="text-center space-y-6 py-6 max-w-md mx-auto">
              <div>
                <h4 className="text-lg font-serif font-bold text-white">Penunjuk Arah Kiblat Digital</h4>
                <p className="text-xs text-blue-400 mt-1">
                  Derajat sudut Kiblat dari lokasi {selectedCity.name}: <strong className="text-amber-400">{qiblaAngle.toFixed(1)}Â° SE</strong>
                </p>
              </div>

              <div className="relative w-56 h-56 mx-auto rounded-full border-4 border-amber-500/30 bg-blue-900 flex items-center justify-center shadow-2xl">
                <div
                  className="w-full h-full rounded-full border-2 border-blue-500/40 absolute transition-transform duration-500 flex items-center justify-center"
                  style={{ transform: `rotate(${qiblaAngle}deg)` }}
                >
                  <div className="w-3 h-16 bg-blue-500 bg-gradient-to-t from-blue-500 to-amber-400 rounded-full mb-20 shadow-lg"></div>
                </div>
                <div className="w-12 h-12 rounded-full bg-amber-500 text-blue-950 flex items-center justify-center font-bold text-xl font-mono shadow-md z-10">
                  🕋
                </div>
              </div>

              <p className="text-xs text-blue-300 leading-relaxed bg-blue-900/80 p-3 rounded-xl border border-blue-800">
                Posisikan smartphone Anda mendatar di atas meja agar sensor kompas menentukan koordinat Kiblat dengan presisi.
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

