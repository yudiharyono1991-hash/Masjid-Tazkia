import React, { useState, useRef } from 'react';
import {
  Video,
  Image as ImageIcon,
  FileText,
  Search,
  Calendar,
  User,
  Heart,
  Eye,
  Share2,
  X,
  Play,
  Sparkles,
  Tag,
  PlusCircle,
  Clock,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { GalleryItem } from '../types';

interface GallerySectionProps {
  galleryItems: GalleryItem[];
  onLikeItem: (id: string) => void;
  onIncrementViews: (id: string) => void;
  onOpenDkmUpload?: () => void;
  isDark?: boolean;
}

export const GallerySection: React.FC<GallerySectionProps> = ({
  galleryItems = [],
  onLikeItem,
  onIncrementViews,
  onOpenDkmUpload,
  isDark = false
}) => {
  const [activeType, setActiveType] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeModalItem, setActiveModalItem] = useState<GalleryItem | null>(null);
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});
  const categoryScrollRef = useRef<HTMLDivElement>(null);

  const scrollCategory = (direction: 'left' | 'right') => {
    if (categoryScrollRef.current) {
      const scrollAmount = 150;
      categoryScrollRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  // Filter items
  const filteredItems = galleryItems.filter(item => {
    // Type filter
    if (activeType !== 'all' && item.mediaType !== activeType) return false;
    // Category filter
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchSummary = item.summary.toLowerCase().includes(q);
      const matchContent = item.articleContent.toLowerCase().includes(q);
      const matchUstadz = item.ustadzName?.toLowerCase().includes(q) || false;
      const matchTags = item.tags?.some(t => t.toLowerCase().includes(q)) || false;
      return matchTitle || matchSummary || matchContent || matchUstadz || matchTags;
    }
    return true;
  });

  const openItemModal = (item: GalleryItem) => {
    setActiveModalItem(item);
    onIncrementViews(item.id);
  };

  const handleLike = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!likedMap[id]) {
      onLikeItem(id);
      setLikedMap(prev => ({ ...prev, [id]: true }));
    }
  };

  const handleShare = (e: React.MouseEvent, item: GalleryItem) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: item.title,
        text: item.summary,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${item.title}\n\n${item.summary}\n${window.location.href}`);
      alert('Tautan artikel & galeri berhasil disalin ke clipboard!');
    }
  };

  const categories = [
    'all',
    'Kajian Rutin',
    'Tabligh Akbar',
    'Bakti Sosial',
    'Program Ramadhan',
    'Pendidikan & TPA',
    'Lainnya'
  ];

  return (
    <section className={`py-12 sm:py-16 transition-colors duration-300 ${
      isDark ? 'bg-[#080E1A] text-blue-100' : 'bg-blue-50 text-blue-900'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-[10px] font-mono font-bold uppercase tracking-[0.2em] shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            Galeri Media & Artikel Kajian Digital
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-black tracking-tight">
            Dokumentasi Kegiatan & <span className="italic font-semibold text-blue-300">Arsip Kajian Umat</span>
          </h2>
          <p className="text-sm sm:text-base opacity-80 leading-relaxed font-sans">
            Saksikan rekaman video kajian, dokumentasi foto aksi sosial, serta artikel ilmu pengetahuan Islam terlengkap dari Masjid Tazkia.
          </p>
          
          {onOpenDkmUpload && (
            <div className="pt-2">
              <button
                onClick={onOpenDkmUpload}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-mono font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl shadow-md transition-all cursor-pointer border border-blue-400/30"
              >
                <PlusCircle className="w-4 h-4 text-amber-300" />
                <span>Kelola / Tambah Artikel & Galeri (Pengurus DKM)</span>
              </button>
            </div>
          )}
        </div>

        {/* Filter Controls Bar */}
        <div className={`p-4 sm:p-6 rounded-2xl border backdrop-blur-md shadow-lg space-y-5 ${
          isDark ? 'bg-blue-900/90 border-blue-800' : 'bg-white border-blue-200'
        }`}>
          {/* Top Row: Type Pills & Search Box */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Media Type Pills */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <button
                onClick={() => setActiveType('all')}
                className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  activeType === 'all'
                    ? 'bg-blue-600 text-white shadow-md'
                    : isDark ? 'bg-blue-800 text-blue-300 hover:bg-blue-700' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                }`}
              >
                Semua Media
              </button>
              <button
                onClick={() => setActiveType('video')}
                className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeType === 'video'
                    ? 'bg-blue-600 text-white shadow-md'
                    : isDark ? 'bg-blue-800 text-blue-300 hover:bg-blue-700' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                }`}
              >
                <Video className="w-3.5 h-3.5 text-amber-400" />
                <span>Video Kajian</span>
              </button>
              <button
                onClick={() => setActiveType('photo')}
                className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeType === 'photo'
                    ? 'bg-blue-600 text-white shadow-md'
                    : isDark ? 'bg-blue-800 text-blue-300 hover:bg-blue-700' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5 text-blue-300" />
                <span>Foto Kegiatan</span>
              </button>
              <button
                onClick={() => setActiveType('artikel')}
                className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeType === 'artikel'
                    ? 'bg-blue-600 text-white shadow-md'
                    : isDark ? 'bg-blue-800 text-blue-300 hover:bg-blue-700' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                }`}
              >
                <FileText className="w-3.5 h-3.5 text-blue-400" />
                <span>Artikel & Berita</span>
              </button>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-blue-400" />
              <input
                type="text"
                placeholder="Cari judul, ustadz, atau kata kunci..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-xs outline-none transition-colors border ${
                  isDark
                    ? 'bg-blue-950 border-blue-700 text-white placeholder-slate-500 focus:border-blue-400'
                    : 'bg-blue-50 border-blue-300 text-blue-900 placeholder-slate-400 focus:border-blue-600'
                }`}
              />
            </div>
          </div>

          {/* Bottom Row: Category Horizontal Chips with Scroll Arrows */}
          <div className="flex items-center gap-1.5 w-full">
            <span className="font-mono text-[9px] sm:text-[10px] font-bold uppercase tracking-wider opacity-60 shrink-0 mr-1 hidden sm:block">
              Kategori:
            </span>
            <button
              onClick={() => scrollCategory('left')}
              className="p-1 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 shadow-sm shrink-0 md:hidden"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div 
              ref={categoryScrollRef}
              className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs flex-1 scroll-smooth"
            >
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full whitespace-nowrap transition-all font-medium cursor-pointer text-[10px] sm:text-xs ${
                    selectedCategory === cat
                      ? 'bg-amber-500 text-blue-950 font-bold shadow-sm'
                      : isDark ? 'bg-blue-800/80 text-blue-300 hover:bg-blue-700' : 'bg-blue-200/80 text-blue-700 hover:bg-blue-300'
                  }`}
                >
                  {cat === 'all' ? 'Semua Kategori' : cat}
                </button>
              ))}
            </div>
            <button
              onClick={() => scrollCategory('right')}
              className="p-1 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 shadow-sm shrink-0 md:hidden"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Gallery Cards Grid */}
        {filteredItems.length === 0 ? (
          <div className={`text-center py-16 rounded-2xl border ${
            isDark ? 'bg-blue-900/50 border-blue-800' : 'bg-white border-blue-200'
          }`}>
            <ImageIcon className="w-12 h-12 mx-auto text-blue-400 mb-3 opacity-60" />
            <h3 className="text-lg font-serif font-bold">Tidak Ada Dokumentasi Ditemukan</h3>
            <p className="text-xs text-blue-400 mt-1 max-w-sm mx-auto">
              Coba sesuaikan kata kunci pencarian atau ubah filter kategori media yang Anda pilih.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map(item => {
              const isLiked = likedMap[item.id];
              return (
                <div
                  key={item.id}
                  onClick={() => openItemModal(item)}
                  className={`group rounded-2xl overflow-hidden border transition-all duration-300 flex flex-col cursor-pointer shadow-md hover:-translate-y-1 hover:shadow-xl ${
                    isDark
                      ? 'bg-blue-900/90 border-blue-800 hover:border-blue-400/60'
                      : 'bg-white border-blue-200 hover:border-blue-600'
                  }`}
                >
                  {/* Media Thumbnail Container */}
                  <div className="relative h-52 overflow-hidden bg-blue-950">
                    <img
                      src={item.mediaUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-blue-950 bg-gradient-to-t from-blue-950/90 via-blue-950/20 to-transparent" />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                      <span className="bg-blue-600 text-white font-mono font-bold text-[9px] uppercase tracking-widest px-2.5 py-1 rounded shadow-sm">
                        {item.category}
                      </span>
                      
                      {/* Media Type Icon Badge */}
                      <span className={`px-2.5 py-1 rounded-full font-mono text-[9px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-md ${
                        item.mediaType === 'video'
                          ? 'bg-rose-600 text-white'
                          : item.mediaType === 'photo'
                          ? 'bg-amber-500 text-blue-950'
                          : 'bg-blue-600 text-white'
                      }`}>
                        {item.mediaType === 'video' && <Video className="w-3 h-3" />}
                        {item.mediaType === 'photo' && <ImageIcon className="w-3 h-3" />}
                        {item.mediaType === 'artikel' && <FileText className="w-3 h-3" />}
                        <span>{item.mediaType}</span>
                      </span>
                    </div>

                    {/* Overlay Play Button if Video */}
                    {item.mediaType === 'video' && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-rose-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                          <Play className="w-5 h-5 fill-current ml-0.5" />
                        </div>
                      </div>
                    )}

                    {/* Bottom Metadata overlay */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-[11px] font-mono">
                      <span className="flex items-center gap-1 opacity-90">
                        <Calendar className="w-3 h-3 text-amber-400" />
                        {item.date}
                      </span>
                      {item.ustadzName && (
                        <span className="flex items-center gap-1 truncate max-w-[150px] font-medium text-blue-300">
                          <User className="w-3 h-3" />
                          {item.ustadzName}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Body Info */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      {item.subtitle && (
                        <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-500 mb-1">
                          {item.subtitle}
                        </p>
                      )}
                      <h3 className={`text-base font-serif font-bold line-clamp-2 leading-snug transition-colors ${
                        isDark ? 'group-hover:text-blue-300' : 'group-hover:text-blue-600'
                      }`}>
                        {item.title}
                      </h3>
                      <p className="text-xs text-blue-400 mt-2 line-clamp-3 leading-relaxed font-sans">
                        {item.summary}
                      </p>
                    </div>

                    {/* Tags & Action Bar */}
                    <div className="space-y-3 pt-3 border-t border-blue-800/60">
                      {item.tags && item.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {item.tags.map(t => (
                            <span key={t} className="text-[9px] font-mono bg-blue-500/10 text-blue-300 px-2 py-0.5 rounded border border-blue-500/20">
                              #{t}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center justify-between text-xs text-blue-400 pt-1 font-mono">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <Eye className="w-3.5 h-3.5 text-blue-300" />
                            {item.viewsCount}
                          </span>
                          <button
                            onClick={(e) => handleLike(e, item.id)}
                            className={`flex items-center gap-1 cursor-pointer transition-colors ${
                              isLiked ? 'text-rose-500 font-bold' : 'hover:text-rose-400'
                            }`}
                          >
                            <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current text-rose-500' : ''}`} />
                            {item.likesCount + (isLiked ? 1 : 0)}
                          </button>
                        </div>

                        <button
                          onClick={(e) => handleShare(e, item)}
                          className="hover:text-amber-400 cursor-pointer flex items-center gap-1 transition-colors"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                          <span>Bagikan</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Full Detail & Video Reader Modal */}
      {activeModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className={`relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl border shadow-2xl space-y-6 p-6 sm:p-8 ${
            isDark ? 'bg-[#172554] border-blue-900 text-white' : 'bg-white border-blue-200 text-blue-900'
          }`}>
            {/* Close Button */}
            <button
              onClick={() => setActiveModalItem(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-blue-800 text-blue-300 hover:bg-rose-600 hover:text-white flex items-center justify-center transition-all cursor-pointer z-10"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header Metadata */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-blue-600 text-white font-mono font-bold text-[10px] uppercase tracking-widest px-3 py-1 rounded-full">
                  {activeModalItem.category}
                </span>
                <span className="bg-amber-500/20 text-amber-300 font-mono font-bold text-[10px] uppercase tracking-widest px-3 py-1 rounded-full border border-amber-500/30">
                  {activeModalItem.mediaType}
                </span>
                <span className="text-xs font-mono text-blue-400 flex items-center gap-1 ml-auto">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  {activeModalItem.date}
                </span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-serif font-bold leading-tight">
                {activeModalItem.title}
              </h2>

              {activeModalItem.ustadzName && (
                <p className="text-sm font-mono text-blue-300 flex items-center gap-1.5 font-bold">
                  <User className="w-4 h-4" />
                  Narasumber / Penceramah: {activeModalItem.ustadzName}
                </p>
              )}
            </div>

            {/* Video Player or Image Display */}
            {activeModalItem.mediaType === 'video' && activeModalItem.videoEmbedUrl ? (
              <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black shadow-lg border border-blue-800">
                <iframe
                  src={activeModalItem.videoEmbedUrl}
                  title={activeModalItem.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <div className="relative w-full max-h-[400px] rounded-xl overflow-hidden bg-blue-950 border border-blue-800">
                <img
                  src={activeModalItem.mediaUrl}
                  alt={activeModalItem.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            )}

            {/* Summary Highlight Box */}
            <div className={`p-4 rounded-xl border font-sans text-sm leading-relaxed italic ${
              isDark ? 'bg-blue-900 border-blue-800 text-blue-200' : 'bg-blue-100 border-blue-200 text-blue-800'
            }`}>
              "{activeModalItem.summary}"
            </div>

            {/* Unlimited Article Content Body */}
            <div className="space-y-4 text-sm sm:text-base leading-relaxed font-sans opacity-95 text-justify">
              <h3 className="text-lg font-serif font-bold text-amber-400 flex items-center gap-2 border-b border-blue-800 pb-2">
                <FileText className="w-5 h-5 text-blue-300" />
                Ulasan & Rangkuman Artikel Lengkap
              </h3>
              
              {activeModalItem.articleContent.split('\n\n').map((paragraph, idx) => (
                <p key={idx} className="whitespace-pre-line text-blue-300">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Modal Footer Actions */}
            <div className="pt-6 border-t border-blue-800 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4 text-xs font-mono text-blue-400">
                <span className="flex items-center gap-1">
                  <Eye className="w-4 h-4 text-blue-300" />
                  {activeModalItem.viewsCount} x Dibaca / Dilihat
                </span>
                <span className="flex items-center gap-1">
                  <Heart className="w-4 h-4 text-rose-500 fill-current" />
                  {activeModalItem.likesCount} Menyukai
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={(e) => handleShare(e, activeModalItem)}
                  className="bg-blue-500/15 hover:bg-blue-500/25 text-blue-300 border border-blue-400/30 px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Bagikan Ke Jamaah</span>
                </button>
                <button
                  onClick={() => setActiveModalItem(null)}
                  className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider cursor-pointer shadow-md"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

