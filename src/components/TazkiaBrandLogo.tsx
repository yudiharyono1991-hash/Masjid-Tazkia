import React, { useState, useEffect } from 'react';
import { useMasjidStore } from '../lib/store';

interface TazkiaBrandLogoProps {
  variant?: 'navbar' | 'hero' | 'footer' | 'large';
  isDark?: boolean;
  className?: string;
}

export const TazkiaBrandLogo: React.FC<TazkiaBrandLogoProps> = ({
  variant = 'navbar',
  isDark = true,
  className = ''
}) => {
  const { state } = useMasjidStore();
  const storedLogoUrl = state.adminSettings?.masjidLogoUrl;
  const [logoUrl, setLogoUrl] = useState<string>(storedLogoUrl || '/logo.png');

  // Coba load dari IndexedDB jika store tidak punya logo custom
  useEffect(() => {
    const loadLogo = async () => {
      try {
        const { getImageFromStorage } = await import('../lib/imageStorage');
        const saved = await getImageFromStorage('tazkia_logo_masjid');
        if (saved) {
          setLogoUrl(saved);
        }
      } catch (e) {
        // Fallback ke logo default
      }
    };
    if (!storedLogoUrl || storedLogoUrl === '/logo.png') {
      loadLogo();
    } else {
      setLogoUrl(storedLogoUrl);
    }
  }, [storedLogoUrl]);

  if (variant === 'large' || variant === 'hero') {
    return (
      <div className={`flex flex-col items-center text-center space-y-2 ${className}`}>
        {/* Emblem Dome Graphic */}
        <div className="relative flex items-center justify-center">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-blue-900 bg-gradient-to-b from-blue-900 to-blue-950 border-2 border-amber-400/60 p-2 shadow-2xl flex items-center justify-center relative overflow-hidden">
            <img
              src={logoUrl}
              alt="Logo Masjid Tazkia"
              className="w-full h-full object-contain drop-shadow-md z-10 relative"
              onError={(e) => { 
                e.currentTarget.onerror = null;
                e.currentTarget.src = '/logo.png'; 
              }}
            />
            <div className="absolute inset-0 bg-amber-500 bg-gradient-to-tr from-amber-500/10 via-transparent to-blue-500/10 z-0" />
          </div>
        </div>

        {/* 3D Facade Style Tazkia Logo Text */}
        <div className="space-y-0.5 flex flex-col items-center">
          <h1
            className="text-2xl sm:text-4xl font-serif font-black tracking-wider text-amber-300 cursor-default"
            style={{ textShadow: '0 2px 12px rgba(217,119,6,0.6), 0 0 30px rgba(217,119,6,0.3)' }}
          >
            Tazkia
          </h1>
          <p
            className="font-serif text-sm sm:text-sm text-amber-200 tracking-[0.1em] mt-[-2px] pb-1 font-normal"
            style={{ textShadow: '0 1px 6px rgba(0,0,0,0.8)' }}
          >Islamic Center</p>
          <p
            className="font-mono text-xs font-bold text-blue-300 uppercase tracking-[0.3em]"
            style={{ textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}
          >
            SENTUL &bull; BOGOR
          </p>
        </div>
      </div>
    );
  }

  // Default Navbar / Footer Logo
  return (
    <div className={`flex items-center gap-2 sm:gap-3 ${className}`}>
      {/* Mini Mosque Emblem */}
      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[#1e3a8a] bg-gradient-to-br from-[#1e3a8a] to-[#172554] border border-amber-400/50 flex items-center justify-center shadow-lg relative shrink-0">
        <img 
          src={logoUrl} 
          alt="Logo Masjid Tazkia" 
          className="w-6 h-6 sm:w-8 sm:h-8 object-contain drop-shadow-md relative z-10" 
          onError={(e) => { 
            e.currentTarget.onerror = null;
            e.currentTarget.src = '/logo.png'; 
          }}
        />
      </div>

      <div className="flex flex-col justify-center">
        <p className="text-[8px] sm:text-[10px] uppercase tracking-[0.25em] opacity-90 font-mono font-bold text-amber-600 dark:text-amber-400 whitespace-nowrap mb-0.5">
          Masjid
        </p>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className={`whitespace-nowrap leading-none text-base sm:text-xl font-serif font-extrabold tracking-wider ${isDark ? 'text-white hover:text-amber-300' : 'text-blue-900 hover:text-blue-600'} drop-shadow-sm transition-all duration-300 hover:scale-[1.03] hover:-translate-y-0.5 cursor-default`}>
            Tazkia
          </span>
          <span className="text-[8px] sm:text-[9px] font-mono font-bold uppercase tracking-widest bg-blue-800/20 text-blue-600 dark:text-blue-300 px-1.5 sm:px-2 py-0.5 rounded border border-blue-500/30">
            SENTUL
          </span>
        </div>
        <p className={`text-[9px] sm:text-[10.5px] font-serif tracking-wider mt-0.5 ${isDark ? 'text-amber-300' : 'text-amber-600'} whitespace-nowrap font-normal`}>
          Islamic Center
        </p>
      </div>
    </div>
  );
};

