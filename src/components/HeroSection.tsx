import React, { useState, useEffect, useCallback, useRef } from 'react';
import { TazkiaBrandLogo } from './TazkiaBrandLogo';
import { useMasjidStore } from '../lib/store';
import { ChevronLeft, ChevronRight, BookOpen, Calendar, Layers } from 'lucide-react';

interface HeroSectionProps {
  openDigitalIbadah: (tab?: 'quran' | 'salat' | 'kiblat') => void;
  openDonationModal?: () => void;
  isDark?: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  openDigitalIbadah,
  openDonationModal,
  isDark = false
}) => {
  const { state } = useMasjidStore();
  const [currentBgIndex, setCurrentBgIndex] = useState(0);

  // Dynamic typography from adminSettings
  const fontSizeMap: Record<string, string> = {
    sm: 'text-xl sm:text-2xl lg:text-3xl',
    md: 'text-2xl sm:text-3xl lg:text-4xl',
    lg: 'text-3xl sm:text-4xl lg:text-5xl',
    xl: 'text-4xl sm:text-5xl lg:text-6xl'
  };
  const fontFamilyMap: Record<string, string> = {
    serif: 'font-serif',
    sans: 'font-sans',
    mono: 'font-mono'
  };
  const titleFontSize = fontSizeMap[state.adminSettings?.heroTitleFontSize || 'lg'];
  const titleFontFamily = fontFamilyMap[state.adminSettings?.heroTitleFontFamily || 'serif'];
  const textAlign = state.adminSettings?.heroTextAlign === 'center' ? 'items-center text-center' : 'items-start text-left';

  // Fallback default slides
  const defaultSlides = [
    {
      imageUrl: '/hero-1.jpg',
      title: 'Wakaf Pembangunan Masjid',
      subtitle: 'MASJID TAZKIA SENTUL',
      description: 'Amal Jariyah Tak Terputus — "Barangsiapa membangun masjid karena Allah, Allah akan membangunkan untuknya rumah di surga." (HR. Bukhari & Muslim)',
      buttonText: 'Salurkan Wakaf ❯'
    },
    {
      imageUrl: '/hero-2.jpg',
      title: 'Pusat Peradaban Islam',
      subtitle: 'EKOSISTEM DIGITAL MASJID TAZKIA',
      description: 'Menjadi oase spiritual dan intelektual Islam yang memberikan pencerahan, kesejukan, dan pemberdayaan bagi umat.',
      buttonText: 'Lihat Program ❯'
    }
  ];

  // Use custom uploaded hero images if available, otherwise fallback to featured programs or default
  const featuredPrograms = state.programs?.filter(p => p.featured) || [];
  
  // Priority 1: Global state carousel URLs
  // Priority 2: localStorage cache
  // Priority 3: Featured programs
  // Priority 4: Default placeholder slides
  const stateCarouselUrls = state.adminSettings?.masjidHeroCarouselUrls || [];
  const localStorageImages: {name: string, url: string}[] = React.useMemo(() => {
    try {
      const saved = localStorage.getItem('tazkia_hero_images');
      if (saved) return JSON.parse(saved);
    } catch(e) {}
    return [];
  }, []);
  
  const customHeroUrls = stateCarouselUrls.length > 0 
    ? stateCarouselUrls 
    : localStorageImages.filter(img => !img.url.startsWith('/hero-')).map(img => img.url);
  
  const slides = customHeroUrls.length > 0 
    ? customHeroUrls.map((url, idx) => {
        const config = state.adminSettings.masjidHeroSlidesConfig?.find(c => c.url === url);
        return {
          imageUrl: url,
          title: config?.title || state.adminSettings.heroPromoTitle || defaultSlides[idx % defaultSlides.length]?.title || defaultSlides[0].title,
          subtitle: config?.subtitle || state.adminSettings.heroPromoSubtitle || defaultSlides[idx % defaultSlides.length]?.subtitle || defaultSlides[0].subtitle,
          description: config?.description || state.adminSettings.heroPromoDescription || defaultSlides[idx % defaultSlides.length]?.description || defaultSlides[0].description,
          buttonText: 'Salurkan Wakaf ❯'
        };
      })
    : featuredPrograms.length > 0 
      ? featuredPrograms.map(p => ({
          imageUrl: p.imageUrl || '/hero-1.jpg',
          title: p.title,
          subtitle: p.category.toUpperCase(),
          description: p.description.length > 150 ? p.description.substring(0, 150) + '...' : p.description,
          buttonText: 'Donasi Sekarang ❯'
        })) 
      : defaultSlides;

  // Auto slide
  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentBgIndex((prev) => (prev + 1) % slides.length);
    }, 6000); 
    return () => clearInterval(interval);
  }, [slides.length]);

  const nextSlide = useCallback(() => {
    setCurrentBgIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentBgIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  // Touch swipe support for mobile
  const touchStartX = useRef<number | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) nextSlide(); else prevSlide();
    }
    touchStartX.current = null;
  };

  return (
    <section
      className="relative overflow-hidden bg-[#172554] text-white min-h-[60vh] md:min-h-[85vh] flex flex-col justify-center"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      
      {/* Dynamic Carousel Slides */}
      {slides.map((slide, index) => {
        const isActive = index === currentBgIndex;
        return (
          <div
            key={index}
            className={`absolute inset-0 z-0 transition-all duration-1000 ease-in-out ${
              isActive ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            {/* Background Image with slight zoom animation */}
            <div
              className={`w-full h-full bg-cover bg-center transition-transform duration-[8000ms] ease-out ${
                isActive ? 'scale-105' : 'scale-100'
              }`}
              style={{ backgroundImage: `url("${slide.imageUrl}")` }}
            />
            {/* Gradient Overlays for text readability */}
            <div className={`absolute inset-0 bg-gradient-to-r ${isDark ? 'from-slate-900/90 via-slate-900/50' : 'from-slate-900/70 via-slate-900/30'} to-transparent`}></div>
            <div className={`absolute inset-0 bg-gradient-to-t ${isDark ? 'from-slate-900/80' : 'from-slate-900/50'} via-transparent to-transparent`}></div>
            
            {/* Slide Text Content */}
            <div className={`absolute inset-0 z-10 flex flex-col justify-end pb-14 md:justify-center md:pb-0 max-w-7xl mx-auto px-5 sm:px-12 lg:px-16 transition-all duration-1000 delay-300 ${isActive ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'} ${textAlign}`}>
              <div className="max-w-2xl">
                {slide.subtitle && (
                  <div className="flex items-center gap-3 mb-2 sm:mb-3">
                    <div className="w-6 h-0.5 bg-amber-400 shrink-0"></div>
                    <p className="text-amber-400 font-bold tracking-widest text-[10px] sm:text-xs uppercase">
                      {slide.subtitle}
                    </p>
                  </div>
                )}
                
                <h1 className={`${titleFontSize} ${titleFontFamily} font-bold text-white mb-3 leading-[1.2] drop-shadow-lg`}>
                  {slide.title}
                </h1>
                
                <p className="text-xs sm:text-sm text-slate-200 mb-5 max-w-lg leading-relaxed drop-shadow-md">
                  {slide.description}
                </p>
                
                {/* Two CTA Buttons */}
                <div className="flex flex-row gap-2 sm:gap-3">
                  <button 
                    onClick={() => { if (openDonationModal) openDonationModal(); }}
                    className="bg-amber-400 hover:bg-amber-500 text-blue-950 font-bold py-2.5 px-5 sm:py-3 sm:px-7 rounded-full transition-all hover:scale-105 shadow-lg shadow-amber-400/30 text-xs sm:text-sm whitespace-nowrap"
                  >
                    Salurkan Wakaf ›
                  </button>
                  <button 
                    onClick={() => { window.location.hash = 'program'; window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="bg-blue-900/80 hover:bg-blue-800 backdrop-blur-sm border border-amber-400/40 text-amber-300 hover:text-amber-200 font-bold py-2.5 px-5 sm:py-3 sm:px-7 rounded-full transition-all hover:scale-105 text-xs sm:text-sm whitespace-nowrap"
                  >
                    Lihat Program ›
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Official Brand Logo Banner (Top) aligned with content */}
      <div className={`absolute top-6 left-0 right-0 z-20 max-w-7xl mx-auto px-5 sm:px-12 lg:px-16 flex ${state.adminSettings?.heroTextAlign === 'center' ? 'justify-center' : 'justify-start'}`}>
        <TazkiaBrandLogo variant="large" isDark={true} />
      </div>

      {/* Navigation Chevrons */}
      {slides.length > 1 && (
        <>
          <button 
            onClick={prevSlide}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-30 w-8 h-8 sm:w-11 sm:h-11 rounded-full border border-white/20 bg-black/30 hover:bg-black/60 backdrop-blur-md flex items-center justify-center text-white transition-all"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <button 
            onClick={nextSlide}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-30 w-8 h-8 sm:w-11 sm:h-11 rounded-full border border-white/20 bg-black/30 hover:bg-black/60 backdrop-blur-md flex items-center justify-center text-white transition-all"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </>
      )}

      {/* Quick Shortcut Pills (Bottom Right — desktop only) */}
      <div className="absolute bottom-8 right-5 sm:right-10 z-20 hidden md:flex flex-col items-end gap-2 font-sans text-xs font-medium">
        <button
          onClick={() => openDigitalIbadah('quran')}
          className="px-3 py-2 rounded-full transition-all shadow-lg cursor-pointer flex items-center gap-2 border bg-black/40 backdrop-blur-md hover:bg-emerald-700 text-white border-white/20 hover:scale-105"
        >
          <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
          <span>Al-Qur'an Digital</span>
        </button>
        <button
          onClick={() => openDigitalIbadah('salat')}
          className="px-3 py-2 rounded-full transition-all shadow-lg cursor-pointer flex items-center gap-2 border bg-black/40 backdrop-blur-md hover:bg-emerald-700 text-white border-white/20 hover:scale-105"
        >
          <Calendar className="w-3.5 h-3.5 text-emerald-400" />
          <span>Jadwal Shalat & Adzan</span>
        </button>
        <button
          onClick={() => openDigitalIbadah('kiblat')}
          className="px-3 py-2 rounded-full transition-all shadow-lg cursor-pointer flex items-center gap-2 border bg-black/40 backdrop-blur-md hover:bg-emerald-700 text-white border-white/20 hover:scale-105"
        >
          <Layers className="w-3.5 h-3.5 text-emerald-400" />
          <span>Arah Kiblat</span>
        </button>
      </div>

      {/* Carousel Indicators (Bottom Center) */}
      {slides.length > 1 && (
        <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-1.5 z-20">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentBgIndex(idx)}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                idx === currentBgIndex
                  ? 'w-8 bg-amber-400'
                  : 'w-2.5 bg-white/40 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
};
