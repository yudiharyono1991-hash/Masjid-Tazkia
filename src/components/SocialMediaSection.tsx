import React, { useState } from 'react';
import { Instagram, Facebook, Youtube, ExternalLink } from 'lucide-react';

// Confirmed Masjid Tazkia YouTube videos (add more IDs here as new videos come out)
const YT_FEATURED = [
  { id: 'TiOHkAVZhow', label: 'Video Terbaru' },
  { id: 'UBxFbTbs8i4', label: 'Video Pilihan' },
];
const YT_CHANNEL_ID = 'UC5107eQh328s76H_mZ34Sog';
const YT_UPLOADS_PLAYLIST = `UU${YT_CHANNEL_ID.replace('UC', '')}`;
const YT_CHANNEL_URL = 'https://www.youtube.com/@masjidtazkia';

interface SocialMediaProps {
  isDark?: boolean;
}

export const SocialMediaSection: React.FC<SocialMediaProps> = ({ isDark = false }) => {
  const [activeTab, setActiveTab] = useState<'featured' | 'playlist'>('featured');
  const [activeVideoIdx, setActiveVideoIdx] = useState(0);
  const [fbLoaded, setFbLoaded] = useState(false);
  const [igLoaded, setIgLoaded] = useState(false);

  return (
    <section className={`py-16 border-t relative overflow-hidden transition-colors ${isDark ? 'bg-[#172554] border-blue-900/50' : 'bg-slate-50 border-slate-200'}`}>
      {isDark && (
        <>
          <div
            className="absolute inset-0 z-0 bg-cover bg-center opacity-30"
            style={{ backgroundImage: `url("/hero-1.jpg")` }}
          />
          <div className="absolute inset-0 z-0 bg-[#153476]/90 pointer-events-none" />
        </>
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        <div className="text-center mb-10">
          <p className={`text-[10px] font-mono font-bold tracking-[0.2em] uppercase mb-2 ${isDark ? 'text-amber-400' : 'text-blue-600'}`}>Ikuti Kami</p>
          <h2 className={`text-2xl sm:text-3xl font-serif ${isDark ? 'text-white' : 'text-slate-900'}`}>Media Sosial &amp; Dakwah Digital</h2>
          <p className={`text-sm mt-2 font-sans ${isDark ? 'text-blue-300' : 'text-slate-600'}`}>Ikuti terus pembaruan berita, kajian, dan aktivitas Masjid Tazkia</p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">

          {/* ========== YOUTUBE — Left Column ========== */}
          <div className={`border rounded-2xl overflow-hidden shadow-xl flex flex-col transition-colors ${isDark ? 'bg-black/30 border-red-500/20' : 'bg-white border-slate-200'}`}>
            <div className={`flex items-center gap-3 px-5 py-3 border-b shrink-0 transition-colors ${isDark ? 'bg-red-600/10 border-red-500/20' : 'bg-red-50 border-red-100'}`}>
              <Youtube className="w-5 h-5 text-red-500" />
              <span className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-slate-800'}`}>YouTube Masjid Tazkia</span>
              <a href={YT_CHANNEL_URL} target="_blank" rel="noopener noreferrer"
                className={`ml-auto text-[10px] flex items-center gap-1 transition-colors ${isDark ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-700'}`}>
                Lihat Channel <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Tab bar: Featured videos vs Full channel playlist */}
            <div className={`flex border-b shrink-0 ${isDark ? 'border-white/10' : 'border-slate-100'}`}>
              <button onClick={() => setActiveTab('featured')}
                className={`flex-1 py-2 text-xs font-mono font-bold uppercase tracking-wide transition-colors ${activeTab === 'featured' 
                  ? (isDark ? 'bg-red-600/20 text-red-300 border-b-2 border-red-500' : 'bg-red-50 text-red-600 border-b-2 border-red-500') 
                  : (isDark ? 'text-blue-400 hover:text-white hover:bg-white/5' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50')
                  }`}>
                📌 Video Pilihan
              </button>
              <button onClick={() => setActiveTab('playlist')}
                className={`flex-1 py-2 text-xs font-mono font-bold uppercase tracking-wide transition-colors ${activeTab === 'playlist' 
                  ? (isDark ? 'bg-red-600/20 text-red-300 border-b-2 border-red-500' : 'bg-red-50 text-red-600 border-b-2 border-red-500') 
                  : (isDark ? 'text-blue-400 hover:text-white hover:bg-white/5' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50')
                  }`}>
                🔴 Semua Video Channel
              </button>
            </div>

            {/* Video Player Area */}
            <div className="aspect-video bg-black w-full relative">
              {activeTab === 'featured' ? (
                /* Featured/specific confirmed videos */
                <iframe
                  key={YT_FEATURED[activeVideoIdx].id}
                  src={`https://www.youtube.com/embed/${YT_FEATURED[activeVideoIdx].id}?controls=1&rel=0&modestbranding=1`}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={YT_FEATURED[activeVideoIdx].label}
                />
              ) : (
                /* Full channel playlist fallback (since YouTube blocks some UU playlist embeds) */
                <div className={`w-full h-full flex flex-col items-center justify-center p-6 text-center border ${isDark ? 'bg-blue-950/50 border-white/5' : 'bg-slate-100 border-slate-200'}`}>
                  <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
                    <Youtube className="w-8 h-8 text-red-500" />
                  </div>
                  <h3 className={`font-bold text-lg mb-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>Lihat Semua Video Dakwah</h3>
                  <p className={`text-sm mb-6 max-w-xs ${isDark ? 'text-blue-300' : 'text-slate-600'}`}>
                    Kunjungi channel YouTube resmi Masjid Tazkia untuk melihat ratusan video kajian dan liputan kegiatan lainnya.
                  </p>
                  <a href={YT_CHANNEL_URL} target="_blank" rel="noopener noreferrer"
                    className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white text-sm font-bold rounded-full shadow-lg transition-colors flex items-center gap-2">
                    Buka YouTube Masjid Tazkia <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              )}
            </div>

            {/* Video selector tabs (only for featured mode) */}
            {activeTab === 'featured' && (
              <div className={`flex border-t shrink-0 ${isDark ? 'border-white/10' : 'border-slate-100'}`}>
                {YT_FEATURED.map((v, i) => (
                  <button key={v.id} onClick={() => setActiveVideoIdx(i)}
                    className={`flex-1 py-2 px-3 text-xs transition-colors ${activeVideoIdx === i
                        ? (isDark ? 'bg-red-600/20 text-red-300' : 'bg-red-50 text-red-600')
                        : (isDark ? 'text-blue-400 hover:text-white hover:bg-white/5' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50')
                      }`}>
                    {v.label}
                  </button>
                ))}
              </div>
            )}

            {/* Channel link */}
            <div className={`px-4 py-2 flex items-center justify-between gap-2 shrink-0 ${isDark ? 'bg-black/20' : 'bg-slate-50'}`}>
              <span className={`text-[10px] font-mono ${isDark ? 'text-blue-400' : 'text-slate-500'}`}>
                {activeTab === 'featured' ? '📌 Video pilihan dari Masjid Tazkia' : '🔴 Otomatis update video terbaru'}
              </span>
              <a href={YT_CHANNEL_URL} target="_blank" rel="noopener noreferrer"
                className={`text-[10px] font-mono font-bold uppercase tracking-widest flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-colors shrink-0 ${isDark ? 'text-red-400 bg-red-500/10 hover:bg-red-500/20' : 'text-red-600 bg-red-50 hover:bg-red-100'}`}>
                Semua Video <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* ========== RIGHT: Instagram + Facebook ========== */}
          <div className="flex flex-col gap-5">

            {/* Instagram */}
            <div className={`border rounded-2xl overflow-hidden shadow-xl flex-1 transition-colors ${isDark ? 'bg-black/30 border-pink-500/20' : 'bg-white border-slate-200'}`}>
              <div className={`flex items-center gap-3 px-5 py-3 border-b ${isDark ? 'bg-pink-600 bg-gradient-to-r from-pink-600/10 to-purple-600/10 border-pink-500/20' : 'bg-pink-50 border-pink-100'}`}>
                <Instagram className="w-5 h-5 text-pink-500" />
                <span className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-slate-800'}`}>Instagram @masjidtazkia</span>
                <a href="https://www.instagram.com/masjidtazkia/" target="_blank" rel="noopener noreferrer"
                  className={`ml-auto text-[10px] flex items-center gap-1 transition-colors ${isDark ? 'text-pink-400 hover:text-pink-300' : 'text-pink-600 hover:text-pink-700'}`}>
                  Kunjungi <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              {/* Instagram Embed — auto-loads latest posts */}
              <div className="overflow-hidden" style={{ minHeight: '320px' }}>
                {!igLoaded ? (
                  <div className={`flex flex-col items-center gap-3 py-8 px-4 ${isDark ? '' : 'bg-slate-50 h-full'}`}>
                    <div className="w-14 h-14 rounded-full bg-pink-500 bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
                      <Instagram className="w-7 h-7 text-white" />
                    </div>
                    <p className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-slate-800'}`}>@masjidtazkia</p>
                    <p className={`text-xs text-center text-balance ${isDark ? 'text-blue-200' : 'text-slate-600'}`}>
                      Foto &amp; Reels dakwah terbaru dari Masjid Tazkia Islamic Center
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center mt-1">
                      <button onClick={() => setIgLoaded(true)}
                        className="text-xs font-bold text-white bg-pink-600 bg-gradient-to-r from-pink-600 to-purple-600 px-4 py-2 rounded-full hover:opacity-90 transition-opacity shadow-lg">
                        Tampilkan Postingan
                      </button>
                      <a href="https://www.instagram.com/masjidtazkia/" target="_blank" rel="noopener noreferrer"
                        className={`text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 px-3 py-2 rounded-full transition-colors border ${isDark ? 'text-pink-400 bg-pink-500/10 hover:bg-pink-500/20 border-pink-500/20' : 'text-pink-600 bg-pink-50 hover:bg-pink-100 border-pink-100'}`}>
                        Buka Instagram <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ) : (
                  <iframe
                    src="https://www.instagram.com/masjidtazkia/embed"
                    className="w-full border-0"
                    height="380"
                    scrolling="no"
                    frameBorder="0"
                    allowTransparency={true}
                    title="Instagram Masjid Tazkia"
                  />
                )}
              </div>
            </div>

            {/* Facebook */}
            <div className={`border rounded-2xl overflow-hidden shadow-xl flex-1 transition-colors ${isDark ? 'bg-black/30 border-blue-500/20' : 'bg-white border-slate-200'}`}>
              <div className={`flex items-center gap-3 px-5 py-3 border-b ${isDark ? 'bg-blue-600/10 border-blue-500/20' : 'bg-blue-50 border-blue-100'}`}>
                <Facebook className="w-5 h-5 text-blue-500" />
                <span className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-slate-800'}`}>Facebook Masjid Tazkia</span>
                <a href="https://www.facebook.com/MasjidTazkia/" target="_blank" rel="noopener noreferrer"
                  className={`ml-auto text-[10px] flex items-center gap-1 transition-colors ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}>
                  Kunjungi <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="overflow-hidden" style={{ minHeight: '260px' }}>
                {!fbLoaded ? (
                  <div className={`flex flex-col items-center gap-3 py-8 px-4 ${isDark ? '' : 'bg-slate-50 h-full'}`}>
                    <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center">
                      <Facebook className="w-7 h-7 text-white" />
                    </div>
                    <p className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-slate-800'}`}>Masjid Tazkia Islamic Center</p>
                    <p className={`text-xs text-center text-balance ${isDark ? 'text-blue-200' : 'text-slate-600'}`}>
                      Berita kajian &amp; kegiatan terbaru Masjid Tazkia di Facebook
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center mt-1">
                      <button onClick={() => setFbLoaded(true)}
                        className="text-xs font-bold text-white bg-blue-600 px-4 py-2 rounded-full hover:bg-blue-500 transition-colors shadow-lg">
                        Tampilkan Timeline
                      </button>
                      <a href="https://www.facebook.com/MasjidTazkia/" target="_blank" rel="noopener noreferrer"
                        className={`text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 px-3 py-2 rounded-full transition-colors border ${isDark ? 'text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 border-blue-500/20' : 'text-blue-600 bg-blue-50 hover:bg-blue-100 border-blue-100'}`}>
                        Buka Facebook <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ) : (
                  <iframe
                    src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2FMasjidTazkia%2F&tabs=timeline&width=340&height=280&small_header=true&adapt_container_width=true&hide_cover=false&show_facepile=false&appId"
                    className="w-full border-0"
                    height="280"
                    scrolling="no"
                    frameBorder="0"
                    allowTransparency={true}
                    allow="encrypted-media"
                    title="Facebook Masjid Tazkia"
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA Row */}
        <div className={`flex flex-wrap justify-center gap-4 pt-4 border-t ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
          <a href="https://www.instagram.com/masjidtazkia/" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 bg-pink-600 bg-gradient-to-r from-pink-600 to-purple-600 text-white text-sm font-bold rounded-full shadow-lg hover:opacity-90 transition-opacity">
            <Instagram className="w-4 h-4" /> Follow Instagram
          </a>
          <a href="https://www.facebook.com/MasjidTazkia/" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-full shadow-lg hover:bg-blue-500 transition-colors">
            <Facebook className="w-4 h-4" /> Like Facebook
          </a>
          <a href={YT_CHANNEL_URL} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white text-sm font-bold rounded-full shadow-lg hover:bg-red-500 transition-colors">
            <Youtube className="w-4 h-4" /> Subscribe YouTube
          </a>
        </div>

      </div>
    </section>
  );
};
