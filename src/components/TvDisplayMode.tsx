import React, { useState, useEffect, useRef, useMemo } from 'react';
import { CITIES_DATA, CityPrayerTime, SURAHS_LIST } from '../lib/islamicUtils';
import { Announcement, PetugasJadwal, AppAdminSettings } from '../types';
import { Tv, X, Volume2, VolumeX, Play, Pause, Calendar, MapPin, Sparkles, Home, Maximize } from 'lucide-react';
import { getImageFromStorage } from '../lib/imageStorage';

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
  const [logoUrl, setLogoUrl] = useState<string>('');
  const [selectedQari, setSelectedQari] = useState<string>(QARI_LIST[0].baseUrl);
  const [selectedSurah, setSelectedSurah] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [murottalVolume, setMurottalVolume] = useState<number>(70);
  const [isMurottalMuted, setIsMurottalMuted] = useState<boolean>(false);
  const [mediaVolume, setMediaVolume] = useState<number>(70);
  const [isMediaMuted, setIsMediaMuted] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const loadLogo = async () => {
      try {
        const storedLogo = adminSettings?.masjidLogoUrl;
        const saved = await getImageFromStorage('tazkia_logo_masjid');
        if (storedLogo && storedLogo !== '/logo.png') {
          setLogoUrl(storedLogo);
        } else if (saved) {
          setLogoUrl(saved);
        } else {
          setLogoUrl('/logo.png');
        }
      } catch (e) {
        setLogoUrl(adminSettings?.masjidLogoUrl || '/logo.png');
      }
    };
    loadLogo();
  }, [adminSettings?.masjidLogoUrl]);

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

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMurottalMuted ? 0 : murottalVolume / 100;
    }
  }, [murottalVolume, isMurottalMuted]);

  useEffect(() => {
    syncYouTubeVolume();
  }, [mediaVolume, isMediaMuted]);

  const syncYouTubeVolume = () => {
    const iframes = document.querySelectorAll<HTMLIFrameElement>('iframe[src*="youtube.com/embed"]');
    iframes.forEach(iframe => {
      if (iframe.contentWindow) {
        if (isMediaMuted) {
          iframe.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'mute', args: [] }), '*');
        } else {
          iframe.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'unMute', args: [] }), '*');
          iframe.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'setVolume', args: [mediaVolume] }), '*');
        }
      }
    });
  };

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
    
    // Khutbah settings
    const jumatMode = adminSettings?.enableJumatMode ?? true;
    const khutbahDur = adminSettings?.jumatKhutbahDurationMinutes || 40;
    
    // Iftar
    const iftarDur = adminSettings?.iftarNotificationDurationMinutes || 10;

    const prayers = [
      { name: 'SUBUH', time: parseTime(selectedCity.fajr) },
      { name: time.getDay() === 5 ? (jumatMode ? 'JUMAT' : 'DZUHUR') : 'DZUHUR', time: parseTime(selectedCity.dhuhr) },
      { name: 'ASHAR', time: parseTime(selectedCity.asr) },
      { name: 'MAGHRIB', time: parseTime(selectedCity.maghrib) },
      { name: 'ISYA', time: parseTime(selectedCity.isha) }
    ];

    // Check Eid first because it has priority if enabled
    if (adminSettings?.enableIdulFitriMode || adminSettings?.enableIdulAdhaMode) {
      const eidTime = parseTime(adminSettings?.eidPrayerTime || '07:00');
      const diffEid = currentMinutes - eidTime;
      const eidName = adminSettings?.enableIdulFitriMode ? 'SHALAT IDUL FITRI' : 'SHALAT IDUL ADHA';
      
      if (diffEid >= -5 && diffEid < 0) {
         // 5 minutes countdown to Eid
         const targetSeconds = eidTime * 60;
         return { phase: 'IQAMAH', prayerName: eidName, remainingSeconds: targetSeconds - currentSeconds };
      } else if (diffEid >= 0 && diffEid < sholatDur) {
         return { phase: 'SHOLAT', prayerName: eidName };
      } else if (diffEid >= sholatDur && diffEid < sholatDur + khutbahDur) {
         return { phase: 'KHUTBAH', prayerName: eidName + ' (KHUTBAH)' };
      }
    }

    for (const prayer of prayers) {
      let prayerMinutes = prayer.time;
      let diffMinutes = currentMinutes - prayerMinutes;

      // Handle Imsak pre-notification (Before Subuh)
      const imsakDur = adminSettings?.enableImsakMode ? (adminSettings?.imsakNotificationDurationMinutes || 10) : 0;
      if (prayer.name === 'SUBUH' && diffMinutes >= -imsakDur && diffMinutes < 0) {
        return { phase: 'IMSAK_WAIT', prayerName: 'SUBUH' };
      }

      // Handle Iftar pre-notification (Before Maghrib)
      if (prayer.name === 'MAGHRIB' && diffMinutes >= -iftarDur && diffMinutes < 0) {
        return { phase: 'IFTAR_WAIT', prayerName: 'MAGHRIB' }; // Custom state just for displaying iftar text in normal mode
      }

      if (diffMinutes >= 0) {
        if (prayer.name === 'JUMAT') {
          // Jumat sequence: Adzan -> Khutbah -> Iqamah -> Sholat
          if (diffMinutes < adzanDur) {
            return { phase: 'ADZAN', prayerName: prayer.name };
          } else if (diffMinutes < adzanDur + khutbahDur) {
            return { phase: 'KHUTBAH', prayerName: prayer.name };
          } else if (diffMinutes < adzanDur + khutbahDur + iqamahDur) {
            const targetSeconds = (prayerMinutes + adzanDur + khutbahDur + iqamahDur) * 60;
            return { phase: 'IQAMAH', prayerName: prayer.name, remainingSeconds: targetSeconds - currentSeconds };
          } else if (diffMinutes < adzanDur + khutbahDur + iqamahDur + sholatDur) {
            return { phase: 'SHOLAT', prayerName: prayer.name };
          }
        } else {
          // Normal sequence: Adzan -> Iqamah -> Sholat
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
    }
    
    return { phase: 'NORMAL', prayerName: '', remainingSeconds: 0 };
  };

  const prayerPhase = getActivePrayerPhase();
  const formatCountdown = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const getSmartVideoUrl = (url: string | undefined) => {
    if (!url) return '';
    // Convert standard YouTube links to embed format automatically
    const ytRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=|live\/)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(ytRegex);
    if (match && match[1]) {
      // mute=1 is REQUIRED for autoplay on mobile (iOS Safari & Android Chrome policy)
      // playsinline=1 prevents fullscreen on iOS
      // enablejsapi=1 allows postMessage volume control
      return `https://www.youtube.com/embed/${match[1]}?autoplay=1&mute=1&controls=1&enablejsapi=1&playsinline=1&rel=0`;
    }
    return url;
  };

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Auto rotate slides every 8 seconds based on active configuration
  const activeSlides = useMemo(() => {
    const slides: number[] = [];
    if (adminSettings?.tvEnableSlideJumat !== false) slides.push(0);
    if (adminSettings?.tvEnableSlideHadis !== false) slides.push(1);
    if (adminSettings?.tvEnableSlideWakaf !== false) slides.push(2);
    if (adminSettings?.tvEnableVideoSlide && (adminSettings?.tvVideoSourceType === 'camera' || adminSettings?.tvVideoUrl)) slides.push(3);
    if (adminSettings?.tvCustomSlide1Enabled && adminSettings?.tvCustomSlide1Url) slides.push(4);
    if (adminSettings?.tvCustomSlide2Enabled && adminSettings?.tvCustomSlide2Url) slides.push(5);
    return slides.length > 0 ? slides : [0]; // fallback to slide 0 if all disabled
  }, [adminSettings]);

  useEffect(() => {
    // If current slide is disabled, jump to the first active slide
    if (!activeSlides.includes(currentSlideIndex)) {
      setCurrentSlideIndex(activeSlides[0]);
    }

    const slideTimer = setInterval(() => {
      setCurrentSlideIndex(prev => {
        const currentIndexInArray = activeSlides.indexOf(prev);
        if (currentIndexInArray === -1) return activeSlides[0];
        const nextIndexInArray = (currentIndexInArray + 1) % activeSlides.length;
        return activeSlides[nextIndexInArray];
      });
    }, 8000);
    return () => clearInterval(slideTimer);
  }, [activeSlides, currentSlideIndex]);

  // Handle Physical CCTV (Capture Card / Webcam)
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    let stream: MediaStream | null = null;
    if (adminSettings?.tvEnableVideoSlide && adminSettings?.tvVideoSourceType === 'camera' && currentSlideIndex === 3) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then(mediaStream => {
          stream = mediaStream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch(err => {
          console.error("Gagal mengakses kamera/CCTV fisik:", err);
        });
    }
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [adminSettings?.tvEnableVideoSlide, adminSettings?.tvVideoSourceType, currentSlideIndex]);

  const timeStr = time.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).replace(/\./g, ':');
  const dateStr = time.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  
  let hijriDateStr = '';
  try {
    const hijriFormatter = new Intl.DateTimeFormat('id-ID-u-ca-islamic', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    // Adjust based on user calibration settings (default to 0 if not set)
    const offsetDays = adminSettings?.hijriOffsetDays || 0;
    const hijriDateObj = new Date(time.getTime() + (offsetDays * 24 * 60 * 60 * 1000));
    hijriDateStr = hijriFormatter.format(hijriDateObj).replace(' AH', ' H').replace(' H', ' H');
  } catch (e) {
    hijriDateStr = '... H'; // Fallback
  }

  const audioUrl = `${selectedQari}${String(selectedSurah).padStart(3, '0')}.mp3`;

  const nextFriday = petugasList.find(p => p.khatibJumat);

  if (prayerPhase.phase === 'SHOLAT' || prayerPhase.phase === 'KHUTBAH') {
    return (
      <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center cursor-none select-none">
         <div className="flex flex-col items-center justify-center space-y-4">
           <p className="text-gray-500 text-3xl sm:text-5xl font-bold uppercase tracking-widest text-center animate-pulse">
             {prayerPhase.phase === 'SHOLAT' 
               ? (adminSettings?.sholatRunningText || 'SHALAT BERJAMAAH SEDANG BERLANGSUNG') 
               : 'KHUTBAH SEDANG BERLANGSUNG'}
           </p>
           {prayerPhase.phase === 'KHUTBAH' && (
             <p className="text-gray-600 text-xl sm:text-2xl font-medium tracking-wide">HARAP TENANG DAN FOKUS PADA KHATIB</p>
           )}
         </div>
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
            {logoUrl ? (
              <img 
                src={logoUrl} 
                alt="Logo Masjid" 
                className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 object-contain drop-shadow-md" 
                onError={(e) => { 
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = '/logo.png'; 
                }}
              />
            ) : (
              <div className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 rounded-2xl bg-amber-500/20 border border-amber-400 text-amber-400 flex items-center justify-center shadow-lg">
                <Tv className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
            )}
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
              {/* Volume Control */}
              <div className="flex items-center gap-1 border-l border-blue-800 pl-2">
                <button
                  onClick={() => setIsMurottalMuted(!isMurottalMuted)}
                  className="text-blue-400 hover:text-amber-400 transition-colors shrink-0"
                  title={isMurottalMuted ? 'Aktifkan Suara' : 'Matikan Suara'}
                >
                  {isMurottalMuted || murottalVolume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={isMurottalMuted ? 0 : murottalVolume}
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    setMurottalVolume(v);
                    if (v > 0) setIsMurottalMuted(false);
                  }}
                  className="w-14 sm:w-20 h-1.5 accent-amber-400 cursor-pointer"
                  title={`Volume: ${isMurottalMuted ? 0 : murottalVolume}%`}
                />
                <span className="text-[9px] text-blue-400 font-mono w-6 text-right shrink-0">{isMurottalMuted ? 0 : murottalVolume}%</span>
              </div>
            </div>

            {/* Media/YouTube Volume Panel */}
            <div className="flex items-center justify-between gap-2 bg-blue-950/80 p-2 sm:p-2.5 rounded-xl border border-blue-800 w-full shadow-inner">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 shrink-0 rounded bg-red-500/20 text-red-400 flex items-center justify-center">
                  <Play className="w-3 h-3" />
                </div>
                <span className="text-[9px] font-mono text-blue-400 uppercase tracking-widest hidden sm:inline">Volume Media (YouTube)</span>
                <span className="text-[9px] font-mono text-blue-400 uppercase tracking-widest sm:hidden">Vol Video</span>
              </div>
              <div className="flex items-center gap-1 border-l border-blue-800 pl-2">
                <button
                  onClick={() => setIsMediaMuted(!isMediaMuted)}
                  className="text-red-400 hover:text-red-300 transition-colors shrink-0"
                  title={isMediaMuted ? 'Aktifkan Suara Video' : 'Matikan Suara Video'}
                >
                  {isMediaMuted || mediaVolume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={isMediaMuted ? 0 : mediaVolume}
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    setMediaVolume(v);
                    if (v > 0) setIsMediaMuted(false);
                  }}
                  className="w-14 sm:w-20 h-1.5 accent-red-400 cursor-pointer"
                  title={`Volume Media: ${isMediaMuted ? 0 : mediaVolume}%`}
                />
                <span className="text-[9px] text-red-400 font-mono w-6 text-right shrink-0">{isMediaMuted ? 0 : mediaVolume}%</span>
              </div>
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

          {/* Desktop Controls */}
          <div className="hidden lg:flex items-center gap-2">
            <button
              onClick={() => {
                if (!document.fullscreenElement) {
                  document.documentElement.requestFullscreen().catch(err => {
                    console.error("Error attempting to enable full-screen mode:", err.message);
                  });
                } else {
                  if (document.exitFullscreen) {
                    document.exitFullscreen();
                  }
                }
              }}
              className="flex items-center justify-center p-3 w-12 h-12 bg-blue-800 hover:bg-blue-700 text-blue-200 rounded-2xl border border-blue-700 cursor-pointer shrink-0 transition-colors shadow-lg"
              title="Layar Penuh (Fullscreen)"
            >
              <Maximize className="w-5 h-5" />
            </button>
            <button
              onClick={onExit}
              className="flex items-center gap-2 p-3 px-5 bg-blue-800 hover:bg-blue-700 text-blue-200 rounded-2xl border border-blue-700 cursor-pointer shrink-0 transition-colors shadow-lg"
              title="Kembali ke Beranda"
            >
              <Home className="w-5 h-5" />
              <span className="text-sm font-bold uppercase tracking-widest">Beranda</span>
            </button>
          </div>
        </div>
      </div>

      {/* Center Dynamic Content */}
      <div className="my-auto py-8">
        {prayerPhase.phase === 'NORMAL' || prayerPhase.phase === 'IFTAR_WAIT' || prayerPhase.phase === 'IMSAK_WAIT' ? (
          <>
            {currentSlideIndex === 0 && (
              <div className="bg-blue-900 bg-gradient-to-r from-blue-900 via-[#0f1d3a] to-blue-900 border-2 border-amber-500/40 rounded-3xl p-4 sm:p-8 max-w-5xl mx-auto shadow-2xl text-center space-y-4 animate-fade-in">
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
              <div className="bg-blue-900 bg-gradient-to-r from-blue-900 via-[#0f1d3a] to-blue-900 border-2 border-amber-500/40 rounded-3xl p-4 sm:p-8 max-w-5xl mx-auto shadow-2xl text-center space-y-4 animate-fade-in">
                <span className="bg-blue-500 text-blue-950 font-bold font-mono text-xs px-3 py-1 rounded-full uppercase tracking-widest inline-block">
                  {adminSettings?.tvSlide1Title || 'HADIS SHAHIH HARI INI'}
                </span>
                <p className="text-2xl sm:text-4xl font-serif text-amber-300 leading-relaxed font-arabic" dir="rtl">
                  {adminSettings?.tvSlide1Arabic || 'مَا نَقَصَتْ صَدَقَةٌ مِنْ مَالٍ'}
                </p>
                <p className="text-sm sm:text-xl text-blue-200 max-w-3xl mx-auto font-serif italic">
                  {adminSettings?.tvSlide1Indo || '"Sedekah itu tidak akan pernah mengurangi harta sedikit pun, melainkan Allah akan menambah kemuliaan."'}
                </p>
                <p className="text-xs text-amber-400 font-mono">{adminSettings?.tvSlide1Source || '(HR. Muslim no. 2588)'}</p>
              </div>
            )}

            {currentSlideIndex === 2 && (
              <div className="bg-blue-900 bg-gradient-to-r from-blue-900 via-[#0f1d3a] to-blue-900 border-2 border-amber-500/40 rounded-3xl p-4 sm:p-8 max-w-5xl mx-auto shadow-2xl text-center space-y-4 animate-fade-in">
                <span className="bg-amber-500 text-blue-950 font-bold font-mono text-xs px-3 py-1 rounded-full uppercase tracking-widest inline-block">
                  {adminSettings?.tvSlide2Title || 'PROGRAM WAKAF UTAMA'}
                </span>
                <h2 className="text-xl sm:text-4xl font-serif font-bold text-white">
                  {adminSettings?.tvSlide2Heading || 'Wakaf Tunai Sound System & Akustik Ruang Shalat Utama'}
                </h2>
                <p className="text-sm sm:text-base text-blue-300 max-w-2xl mx-auto">
                  {adminSettings?.tvSlide2Desc || "Dukung pengadaan tata suara jernih kristal untuk kekhusyu'an ibadah jamaah Masjid Tazkia."}
                </p>
                <p className="text-sm sm:text-xl text-amber-400 font-mono font-bold">
                  {adminSettings?.tvSlide2Target || 'Terkumpul: Rp 8.25M / Target: Rp 15M'}
                </p>
              </div>
            )}

            {currentSlideIndex === 3 && adminSettings?.tvEnableVideoSlide && (
              <div className="w-full max-w-5xl mx-auto h-[40vh] sm:h-[50vh] bg-black border-2 border-amber-500/40 rounded-3xl overflow-hidden shadow-2xl animate-fade-in relative group">
                {adminSettings?.tvVideoSourceType === 'camera' ? (
                  <video 
                    ref={videoRef}
                    autoPlay 
                    playsInline 
                    muted
                    className="w-full h-full object-cover pointer-events-none"
                  />
                ) : adminSettings?.tvVideoUrl ? (
                  <iframe 
                    src={getSmartVideoUrl(adminSettings.tvVideoUrl)} 
                    title="Live View"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    onLoad={syncYouTubeVolume}
                    className="w-full h-full"
                    style={{ border: 'none' }}
                  ></iframe>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-blue-500">
                    <Tv className="w-16 h-16 mb-4 opacity-50" />
                    <p className="font-mono text-sm">Sinyal Video Belum Dikonfigurasi</p>
                  </div>
                )}
                
                <div className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-2 animate-pulse shadow-lg">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  {adminSettings?.tvVideoSourceType === 'camera' ? 'CCTV LANGSUNG' : 'LIVE'}
                </div>
              </div>
            )}
            
            {currentSlideIndex === 4 && adminSettings?.tvCustomSlide1Enabled && adminSettings?.tvCustomSlide1Url && (
              <div className="w-full max-w-5xl mx-auto rounded-3xl overflow-hidden shadow-2xl border border-amber-500/20 bg-black animate-fade-in aspect-video relative">
                {adminSettings?.tvCustomSlide1Type === 'image' ? (
                  <img src={adminSettings.tvCustomSlide1Url} alt="Poster" className="w-full h-full object-contain" />
                ) : (
                  <iframe 
                    src={getSmartVideoUrl(adminSettings.tvCustomSlide1Url)} 
                    title="Video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    onLoad={syncYouTubeVolume}
                    className="w-full h-full"
                    style={{ border: 'none' }}
                  ></iframe>
                )}
              </div>
            )}

            {currentSlideIndex === 5 && adminSettings?.tvCustomSlide2Enabled && adminSettings?.tvCustomSlide2Url && (
              <div className="w-full max-w-5xl mx-auto rounded-3xl overflow-hidden shadow-2xl border border-amber-500/20 bg-black animate-fade-in aspect-video relative">
                {adminSettings?.tvCustomSlide2Type === 'image' ? (
                  <img src={adminSettings.tvCustomSlide2Url} alt="Poster" className="w-full h-full object-contain" />
                ) : (
                  <iframe 
                    src={getSmartVideoUrl(adminSettings.tvCustomSlide2Url)} 
                    title="Video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    onLoad={syncYouTubeVolume}
                    className="w-full h-full"
                    style={{ border: 'none' }}
                  ></iframe>
                )}
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
            ) : prayerPhase.phase === 'IFTAR_WAIT' ? (
              <span className="text-lg sm:text-2xl font-bold text-amber-400 uppercase">{adminSettings?.iftarRunningText || 'SELAMAT BERBUKA PUASA UNTUK WILAYAH SENTUL DAN SEKITARNYA.'}</span>
            ) : prayerPhase.phase === 'IMSAK_WAIT' ? (
              <span className="text-lg sm:text-2xl font-bold text-amber-400 uppercase">{adminSettings?.imsakRunningText || 'WAKTU IMSYAK TELAH TIBA. SELAMAT MENUNAIKAN IBADAH PUASA.'}</span>
            ) : adminSettings?.enableIdulFitriMode ? (
              <span className="text-lg sm:text-2xl font-bold text-amber-400 uppercase">{adminSettings?.idulFitriRunningText || 'SELAMAT HARI RAYA IDUL FITRI 1 SYAWAL. MOHON MAAF LAHIR DAN BATIN.'}</span>
            ) : adminSettings?.enableIdulAdhaMode ? (
              <span className="text-lg sm:text-2xl font-bold text-amber-400 uppercase">{adminSettings?.idulAdhaRunningText || 'SELAMAT HARI RAYA IDUL ADHA. SEMOGA AMAL IBADAH QURBAN KITA DITERIMA ALLAH SWT.'}</span>
            ) : (
              <div className="text-lg sm:text-2xl font-bold text-white uppercase tracking-wide">
                <span>{adminSettings?.defaultRunningText || '• HARAP MEMATIKAN ATAU MENGHENINGKAN NADA DERING PONSEL SAAT BERADA DI RUANG SHALAT UTAMA. • KAJIAN SUBUH BERKAH SETIAP HARI SABTU BERSAMA KH. RIDWAN KAMIL, LC. • SALURKAN ZISWAF ANDA MELALUI PORTAL DIGITAL MASJID TAZKIA ATAU SEKRETARIAT DKM.'}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

