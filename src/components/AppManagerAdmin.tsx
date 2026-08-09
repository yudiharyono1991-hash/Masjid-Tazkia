import React, { useState, useEffect } from 'react';
import { Settings, Upload, Image as ImageIcon, QrCode, Store, Trash2, Plus, Link as LinkIcon, Download, Shield, Bot, Save, CheckCircle2, XCircle } from 'lucide-react';
import { uploadMedia, deleteMediaFromSupabase } from '../lib/mediaUpload';
import { getSupabaseClient } from '../lib/supabase';
import { useMasjidStore } from '../lib/store';
import { RoleManagerAdmin } from './admin/RoleManagerAdmin';

interface Sponsor {
  id: string;
  name: string;
  imageUrl: string;
  link: string;
}

export const AppManagerAdmin: React.FC = () => {
  const { state, updateAdminSettings } = useMasjidStore();
  const [activeSubTab, setActiveSubTab] = useState<'hero' | 'qr' | 'sponsor' | 'profil' | 'role' | 'ai'>('hero');
  const [heroImages, setHeroImages] = useState<{name: string, url: string}[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

  const showToast = (type: 'success' | 'error', msg: string) => {
    setSaveStatus(type);
    const toast = document.createElement('div');
    toast.className = `fixed bottom-4 right-4 z-[9999] flex items-center gap-2 px-5 py-3 rounded-xl shadow-xl text-sm font-bold text-white transition-all ${type === 'success' ? 'bg-emerald-600' : 'bg-red-600'}`;
    toast.innerHTML = `${type === 'success' ? '✅' : '❌'} ${msg}`;
    document.body.appendChild(toast);
    setTimeout(() => { toast.remove(); setSaveStatus('idle'); }, 4000);
  };

  const saveTextSettings = async () => {
    setSaveStatus('saving');
    try {
      // updateAdminSettings already persists to Supabase if connected
      await updateAdminSettings({
        heroPromoTitle: state.adminSettings.heroPromoTitle,
        heroPromoSubtitle: state.adminSettings.heroPromoSubtitle,
        heroPromoDescription: state.adminSettings.heroPromoDescription,
        heroTitleFontSize: state.adminSettings.heroTitleFontSize,
        heroTitleFontFamily: state.adminSettings.heroTitleFontFamily,
        heroTextAlign: state.adminSettings.heroTextAlign,
        showPrayerTimesOnHome: state.adminSettings.showPrayerTimesOnHome,
        showLayananKamiOnHome: state.adminSettings.showLayananKamiOnHome,
        showProgramCardsOnHome: state.adminSettings.showProgramCardsOnHome,
        showFridayInfoOnHome: state.adminSettings.showFridayInfoOnHome,
        showSocialMediaOnHome: state.adminSettings.showSocialMediaOnHome,
      });
      showToast('success', 'Pengaturan Beranda berhasil disimpan!');
    } catch (err) {
      showToast('error', 'Gagal menyimpan. Coba lagi.');
    }
  };

  // Sponsor State
  const [sponsors, setSponsors] = useState<Sponsor[]>(() => {
    try {
      const saved = localStorage.getItem('tazkia_sponsors');
      if (saved) return JSON.parse(saved);
    } catch(e) {}
    return [{ id: '1', name: 'Tazkia Mart', imageUrl: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=200&q=80', link: '#' }];
  });

  const [profilData, setProfilData] = useState(() => {
    try {
      const saved = localStorage.getItem('tazkia_profil_data');
      if (saved) return JSON.parse(saved);
    } catch(e) {}
    return {
      youtubeUrl: 'https://youtu.be/-oT4ZYK2ZjI?si=-pEBAAicepgcMVPj',
      sejarah: `Andalusia Islamic Center hadir karena kepedulian akan masalah besar bangsa dan ummat Islam Indonesia yang didominasi oleh kemiskinan, keterbelakangan Pendidikan serta rendahnya moralitas baik di tingkat birokrasi maupun swasta. Besar harapan kami dengan segala kekurangan, Andalusia Islamic Center dapat menjadi Oase Spiritual, Intelektual dan Pemberdayaan finansial ummat yang berlandaskan nilai-nilai luhur spiritual Islam.\n\nSejak pendiriannya tahun 2006 oleh Prof. Dr. Syafii Antonio, M.Ec. Andalusia Islamic Center telah berkiprah dalam bidang sosial, dakwah dan pemberdayaan ekonomi yang meliputi:`,
      visi: 'Menjadi Oase Spiritual dan Intelektual Islam yang memberikan pencerahan, kesejukan dan pemberdayaan serta wawasan Rahmatan Lil Alamin.',
      misi: [
        'Menyelenggarakan pelatihan dan konseling keumatan.',
        'Mengembangkan ekonomi kerakyatan berbasis syariah.',
        'Membina para muallaf agar istiqomah.'
      ]
    };
  });

  useEffect(() => {
    localStorage.setItem('tazkia_sponsors', JSON.stringify(sponsors));
  }, [sponsors]);

  useEffect(() => {
    localStorage.setItem('tazkia_profil_data', JSON.stringify(profilData));
  }, [profilData]);

  useEffect(() => {
    fetchHeroImages();
  }, []);

  const fetchHeroImages = async () => {
    let supabaseImages: any[] = [];
    let deletedList: string[] = [];
    try {
      const savedDeleted = localStorage.getItem('tazkia_hero_deleted');
      if (savedDeleted) deletedList = JSON.parse(savedDeleted);
    } catch(e) {}

    try {
      const supabase = getSupabaseClient();
      if (supabase) {
        const { data, error } = await supabase.storage.from('tazkia-media').list('hero');
        if (!error && data && data.length > 0) {
          const imageFiles = data.filter(file => file.name.match(/\.(jpg|jpeg|png|webp|avif)$/i) && !deletedList.includes(file.name));
          
          supabaseImages = imageFiles.map(file => {
            const { data: { publicUrl } } = supabase.storage.from('tazkia-media').getPublicUrl(`hero/${file.name}`);
            return { name: file.name, url: publicUrl };
          });
        }
      }
    } catch(e) {
      console.warn("Supabase fetch failed, falling back to local storage", e);
    }

    // Merge in configured URLs from state
    const configuredUrls = state.adminSettings.masjidHeroCarouselUrls && state.adminSettings.masjidHeroCarouselUrls.length > 0
      ? state.adminSettings.masjidHeroCarouselUrls
      : (state.adminSettings.masjidHeroPhotoUrl ? [state.adminSettings.masjidHeroPhotoUrl] : []);

    configuredUrls.forEach((url, i) => {
      const expectedName = `system-config-${i+1}`;
      if (!supabaseImages.find(img => img.url === url) && !deletedList.includes(expectedName)) {
        supabaseImages.push({ name: expectedName, url });
      }
    });

    if (supabaseImages.length > 0) {
      setHeroImages(supabaseImages);
      localStorage.setItem('tazkia_hero_images', JSON.stringify(supabaseImages));
      // Sync to global state so HeroSection carousel always reflects current images
      updateAdminSettings({ masjidHeroCarouselUrls: supabaseImages.map(img => img.url) });
    } else {
      const defaultImages = [
        { name: 'default-masjid-1.jpg', url: '/hero-1.jpg' },
        { name: 'default-masjid-2.jpg', url: '/hero-2.jpg' }
      ];
      
      const initialized = localStorage.getItem('tazkia_hero_images_init_v4');
      if (!initialized) {
        setHeroImages(defaultImages);
        localStorage.setItem('tazkia_hero_images', JSON.stringify(defaultImages));
        localStorage.setItem('tazkia_hero_images_init_v4', 'true');
      } else {
        const saved = localStorage.getItem('tazkia_hero_images');
        if (saved) {
          setHeroImages(JSON.parse(saved));
        }
      }
    }
  };




  const handleHeroUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(20);
    
    const result = await uploadMedia(file, 'hero', (p) => setUploadProgress(p));
    const newImage = { name: `${Date.now()}-${file.name}`, url: result.url };
    const updated = [...heroImages, newImage];
    setHeroImages(updated);
    localStorage.setItem('tazkia_hero_images', JSON.stringify(updated));
    
    // ✅ CRITICAL: Update global state so HeroSection carousel picks up the new photo
    const newCarouselUrls = updated.map(img => img.url);
    updateAdminSettings({ masjidHeroCarouselUrls: newCarouselUrls });
    
    const msg = document.createElement('div');
    msg.className = 'fixed bottom-4 right-4 text-white px-6 py-3 rounded-xl shadow-lg z-50 text-sm font-bold';
    if (result.isLocal) {
      msg.className += ' bg-orange-600';
      msg.innerText = '⚠️ Tersimpan lokal. Buat bucket masjid-media di Supabase untuk akses semua perangkat!';
    } else {
      msg.className += ' bg-green-600';
      msg.innerText = '✅ Foto berhasil diunggah! Buka Beranda untuk melihat foto baru di slider.';
    }
    document.body.appendChild(msg);
    setTimeout(() => msg.remove(), 4000);
    
    setIsUploading(false);
    setUploadProgress(0);
  };

  const handleDeleteHero = async (fileName: string, fileUrl?: string) => {
    if (!window.confirm("Hapus gambar ini?")) return;
    
    // Add to local blocklist so it never comes back even if Supabase delete fails
    try {
      const savedDeleted = localStorage.getItem('tazkia_hero_deleted');
      const deletedList = savedDeleted ? JSON.parse(savedDeleted) : [];
      if (!deletedList.includes(fileName)) {
        deletedList.push(fileName);
        localStorage.setItem('tazkia_hero_deleted', JSON.stringify(deletedList));
      }
    } catch(e) {}

    if (fileUrl && !fileUrl.startsWith('data:')) {
      await deleteMediaFromSupabase(fileUrl);
    }
    
    const updated = heroImages.filter(img => img.name !== fileName);
    setHeroImages(updated);
    localStorage.setItem('tazkia_hero_images', JSON.stringify(updated));

    // Also remove from global store if it was a system-configured image
    if (fileUrl) {
      const currentCarousel = state.adminSettings.masjidHeroCarouselUrls || [];
      const newCarousel = currentCarousel.filter(url => url !== fileUrl);
      
      const newPhotoUrl = state.adminSettings.masjidHeroPhotoUrl === fileUrl 
        ? '' 
        : state.adminSettings.masjidHeroPhotoUrl;
        
      updateAdminSettings({
        masjidHeroCarouselUrls: newCarousel,
        masjidHeroPhotoUrl: newPhotoUrl
      });
    }
    
    const msg = document.createElement('div');
    msg.className = 'fixed bottom-4 right-4 bg-gray-800 text-white px-6 py-3 rounded-xl shadow-lg z-50';
    msg.innerText = '🗑️ Gambar berhasil dihapus dari sistem.';
    document.body.appendChild(msg);
    setTimeout(() => msg.remove(), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex bg-blue-900 border border-blue-800 p-1.5 rounded-2xl gap-1 sm:gap-2 overflow-x-auto text-[10px] sm:text-xs font-mono">
        {[
          { id: 'hero', label: 'Foto Animasi Beranda', icon: ImageIcon },
          { id: 'qr', label: 'Cetak QR Aplikasi', icon: QrCode },
          { id: 'sponsor', label: 'Sponsor & Mitra', icon: Store },
          { id: 'profil', label: 'Profil & Sejarah Masjid', icon: Settings },
          { id: 'role', label: 'Manajemen Peran & Izin', icon: Shield }

        ].map(sub => {
          const SubIcon = sub.icon;
          return (
            <button
              key={sub.id}
              onClick={() => setActiveSubTab(sub.id as any)}
              className={`px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl cursor-pointer font-bold transition-all flex items-center gap-1.5 sm:gap-2 whitespace-nowrap ${
                activeSubTab === sub.id
                  ? 'bg-amber-400 text-blue-950 shadow'
                  : 'text-blue-400 hover:text-white hover:bg-blue-800'
              }`}
            >
              <SubIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              {sub.label}
            </button>
          );
        })}
      </div>

      <div className="bg-white/5 p-6 rounded-2xl border border-blue-800 space-y-6 text-white">
        
        {/* HERO TAB */}
        {activeSubTab === 'hero' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg sm:text-xl font-bold font-serif mb-1 sm:mb-2">Manajemen Foto Animasi Beranda (Hero Slider)</h3>
              <p className="text-[11px] sm:text-sm text-blue-300 leading-relaxed">Unggah beberapa foto lebar (resolusi tinggi) untuk ditampilkan berputar secara otomatis di bagian paling atas halaman Beranda Aplikasi.</p>
            </div>

            <div className="p-6 border-2 border-dashed border-blue-600/50 rounded-2xl text-center bg-blue-900/30">
              <Upload className="w-10 h-10 text-blue-400 mx-auto mb-3" />
              <p className="text-sm font-bold text-white mb-4">Unggah Foto Baru</p>
              <label className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold text-sm cursor-pointer inline-block transition-colors">
                Pilih Media (Foto/Video)
                <input type="file" accept="image/*,video/mp4,video/webm,video/ogg" className="hidden" onChange={handleHeroUpload} disabled={isUploading} />
              </label>
              {isUploading && (
                <div className="mt-4 max-w-xs mx-auto">
                  <div className="h-2 bg-blue-950 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-400 transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                  </div>
                  <p className="text-xs text-blue-300 mt-2">Mengunggah... {uploadProgress}%</p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {heroImages.map((img, idx) => {
                const isVideo = img.url.match(/\.(mp4|webm|ogg)$/i) || img.name.match(/\.(mp4|webm|ogg)$/i);
                
                return (
                  <div key={idx} className="relative group rounded-xl overflow-hidden border border-black/10 aspect-video bg-gray-100">
                    {isVideo ? (
                      <video src={img.url} className="w-full h-full object-cover" controls muted />
                    ) : (
                      <img src={img.url} alt={`Hero ${idx + 1}`} className="w-full h-full object-cover" />
                    )}
                    <div className="absolute inset-0 bg-black/40 sm:bg-black/60 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 pointer-events-none sm:pointer-events-auto">
                      <button 
                        onClick={() => handleDeleteHero(img.name, img.url)}
                        className="p-2.5 sm:p-2 bg-red-600/90 sm:bg-red-600 text-white rounded-lg hover:bg-red-500 transition-colors pointer-events-auto shadow-lg"
                      >
                        <Trash2 className="w-6 h-6 sm:w-5 sm:h-5" />
                      </button>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/80 text-white text-[10px] font-mono truncate">
                      {img.name}
                    </div>
                  </div>
                );
              })}
              {heroImages.length === 0 && (
                <div className="col-span-full py-8 text-center text-blue-400 text-sm">
                  Belum ada foto yang diunggah. Foto bawaan (default) akan ditampilkan.
                </div>
              )}
            </div>

            {/* ====== Pengaturan Teks, Font & Tombol Hero ====== */}
            <div className="bg-blue-950/60 p-5 rounded-2xl border border-blue-700 space-y-4 mt-2">
              <h4 className="font-bold text-white text-sm flex items-center gap-2">
                <span className="text-xl">✍️</span> Pengaturan Teks &amp; Tampilan Beranda
              </h4>
              <p className="text-[11px] text-blue-300">Teks &amp; gaya font di bawah ini akan muncul di atas setiap foto animasi. Tombol sudah otomatis terintegrasi.</p>

              {/* Teks */}
              <div>
                <label className="text-amber-300 font-bold block mb-1.5 text-xs">📌 Judul Utama (baris besar):</label>
                <input
                  type="text"
                  value={state.adminSettings?.heroPromoTitle || ''}
                  onChange={(e) => updateAdminSettings({ heroPromoTitle: e.target.value })}
                  className="w-full bg-blue-900 border border-blue-700 rounded-xl px-4 py-3 text-white font-serif text-sm outline-none focus:border-amber-400 transition"
                  placeholder="Contoh: Wakaf Pembangunan Masjid"
                />
              </div>

              <div>
                <label className="text-amber-300 font-bold block mb-1.5 text-xs">🏷️ Sub-judul (tulisan kecil di atas judul):</label>
                <input
                  type="text"
                  value={state.adminSettings?.heroPromoSubtitle || ''}
                  onChange={(e) => updateAdminSettings({ heroPromoSubtitle: e.target.value })}
                  className="w-full bg-blue-900 border border-blue-700 rounded-xl px-4 py-3 text-emerald-300 font-mono text-xs outline-none focus:border-amber-400 transition uppercase"
                  placeholder="Contoh: MASJID TAZKIA SENTUL"
                />
              </div>

              <div>
                <label className="text-amber-300 font-bold block mb-1.5 text-xs">📝 Deskripsi / Keterangan:</label>
                <textarea
                  rows={3}
                  value={state.adminSettings?.heroPromoDescription || ''}
                  onChange={(e) => updateAdminSettings({ heroPromoDescription: e.target.value })}
                  className="w-full bg-blue-900 border border-blue-700 rounded-xl px-4 py-3 text-slate-200 text-xs outline-none focus:border-amber-400 transition leading-relaxed resize-none"
                  placeholder="Contoh: Amal Jariyah Tak Terputus — salurkan wakaf Anda..."
                />
              </div>

              {/* Typography Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-blue-800">
                <div>
                  <label className="text-blue-300 font-bold block mb-1.5 text-xs">🔡 Ukuran Font Judul:</label>
                  <select
                    value={state.adminSettings?.heroTitleFontSize || 'lg'}
                    onChange={(e) => updateAdminSettings({ heroTitleFontSize: e.target.value as any })}
                    className="w-full bg-blue-900 border border-blue-700 rounded-lg px-3 py-2 text-white text-xs outline-none focus:border-amber-400"
                  >
                    <option value="sm">Kecil (S)</option>
                    <option value="md">Sedang (M)</option>
                    <option value="lg">Besar (L) — Default</option>
                    <option value="xl">Sangat Besar (XL)</option>
                  </select>
                </div>
                <div>
                  <label className="text-blue-300 font-bold block mb-1.5 text-xs">🖋️ Jenis Font Judul:</label>
                  <select
                    value={state.adminSettings?.heroTitleFontFamily || 'serif'}
                    onChange={(e) => updateAdminSettings({ heroTitleFontFamily: e.target.value as any })}
                    className="w-full bg-blue-900 border border-blue-700 rounded-lg px-3 py-2 text-white text-xs outline-none focus:border-amber-400"
                  >
                    <option value="serif">Serif (Klasik/Elegan)</option>
                    <option value="sans">Sans-Serif (Modern)</option>
                    <option value="mono">Monospace (Digital)</option>
                  </select>
                </div>
                <div>
                  <label className="text-blue-300 font-bold block mb-1.5 text-xs">↔️ Posisi Teks:</label>
                  <select
                    value={state.adminSettings?.heroTextAlign || 'left'}
                    onChange={(e) => updateAdminSettings({ heroTextAlign: e.target.value as any })}
                    className="w-full bg-blue-900 border border-blue-700 rounded-lg px-3 py-2 text-white text-xs outline-none focus:border-amber-400"
                  >
                    <option value="left">Rata Kiri</option>
                    <option value="center">Tengah</option>
                  </select>
                </div>
              </div>

              {/* Tombol Info */}
              <div className="flex flex-wrap gap-3 items-center pt-1">
                <div className="flex items-center gap-2 bg-emerald-700/40 border border-emerald-600/50 text-emerald-300 px-4 py-2 rounded-full text-xs font-bold">
                  ✅ Tombol "Salurkan Wakaf" → membuka form donasi
                </div>
                <div className="flex items-center gap-2 bg-blue-700/40 border border-blue-600/50 text-blue-300 px-4 py-2 rounded-full text-xs font-bold">
                  ✅ Tombol "Lihat Program" → ke halaman ZISWAF
                </div>
              </div>
            </div>

            {/* ====== Pengaturan Visibilitas Bagian Beranda ====== */}
            <div className="bg-blue-950/60 p-5 rounded-2xl border border-blue-700 space-y-3 mt-2">
              <h4 className="font-bold text-white text-sm flex items-center gap-2">
                <span className="text-xl">☑️</span> Tampilkan / Sembunyikan Bagian di Beranda
              </h4>
              <p className="text-[11px] text-blue-300">Centang bagian yang ingin ditampilkan kepada jamaah. Hapus centang untuk menyembunyikan sementara.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {[
                  { key: 'showPrayerTimesOnHome', label: '🕌 Jadwal Waktu Shalat' },
                  { key: 'showLayananKamiOnHome', label: '🔗 Grid Layanan Kami' },
                  { key: 'showProgramCardsOnHome', label: '💰 Kartu Program ZISWAF' },
                  { key: 'showFridayInfoOnHome', label: '📢 Info Jumat & Pengumuman' },
                  { key: 'showSocialMediaOnHome', label: '📱 Media Sosial & Dakwah Digital' },
                ].map(item => (
                  <label key={item.key} className="flex items-center gap-3 bg-blue-900/60 px-4 py-3 rounded-xl cursor-pointer hover:bg-blue-800/60 transition">
                    <input
                      type="checkbox"
                      checked={(state.adminSettings as any)[item.key] !== false}
                      onChange={(e) => updateAdminSettings({ [item.key]: e.target.checked } as any)}
                      className="w-4 h-4 accent-amber-400 cursor-pointer"
                    />
                    <span className="text-white text-xs font-semibold">{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-4">
              <button
                onClick={saveTextSettings}
                disabled={saveStatus === 'saving'}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-8 rounded-xl shadow-lg hover:shadow-emerald-500/30 transition-all flex items-center gap-2"
              >
                {saveStatus === 'saving' ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : saveStatus === 'success' ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : saveStatus === 'error' ? (
                  <XCircle className="w-5 h-5" />
                ) : (
                  <Save className="w-5 h-5" />
                )}
                {saveStatus === 'saving' ? 'Menyimpan...' : 'Simpan Pengaturan'}
              </button>
            </div>
          </div>
        )}

        {/* QR CODE TAB */}
        {activeSubTab === 'qr' && (
          <div className="space-y-6 text-center max-w-xl mx-auto">
            <div>
              <h3 className="text-xl font-bold font-serif mb-2">Cetak QR Code Aplikasi</h3>
              <p className="text-sm text-blue-300">QR Code ini dapat Anda cetak dan tempel di area masjid (mading, tiang, dll) agar jamaah bisa langsung membuka aplikasi ini di HP mereka.</p>
            </div>
            
            <div className="bg-white p-8 rounded-3xl inline-block shadow-2xl relative print:shadow-none">
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(window.location.origin)}`}
                alt="QR Code Aplikasi" 
                className="w-48 h-48 sm:w-64 sm:h-64 mx-auto"
              />
              <div className="mt-6 border-t border-slate-200 pt-4">
                <p className="text-slate-800 font-bold text-sm sm:text-base uppercase tracking-wider mb-1">Scan Untuk Buka</p>
                <p className="text-blue-600 font-bold text-lg sm:text-xl font-serif">Aplikasi Masjid Tazkia</p>
                <p className="text-xs text-slate-500 mt-2 break-all">{window.location.origin}</p>
              </div>
            </div>

            <div className="print:hidden">
              <button onClick={() => window.print()} className="bg-amber-500 hover:bg-amber-600 text-blue-950 px-8 py-3 rounded-xl font-bold shadow-md cursor-pointer inline-flex items-center gap-2">
                <Download className="w-5 h-5" />
                Cetak Halaman (Print)
              </button>
            </div>
          </div>
        )}

        {/* SPONSOR TAB */}
        {activeSubTab === 'sponsor' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold font-serif mb-2">Sponsor & Mitra (Tazkia Mart)</h3>
                <p className="text-sm text-blue-300">Kelola logo sponsor atau unit usaha (seperti Tazkia Mart, Travel) yang akan ditampilkan di aplikasi.</p>
              </div>
              <button 
                onClick={() => {
                  const name = prompt("Nama Mitra/Sponsor:");
                  if (!name) return;
                  const imageUrl = prompt("URL Gambar Logo:");
                  if (!imageUrl) return;
                  setSponsors([...sponsors, { id: Date.now().toString(), name, imageUrl, link: '#' }]);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm cursor-pointer inline-flex items-center gap-2 whitespace-nowrap"
              >
                <Plus className="w-4 h-4" /> Tambah Mitra
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {sponsors.map((sp, idx) => (
                <div key={sp.id} className="bg-blue-900/50 p-4 rounded-xl border border-blue-800 flex items-center gap-4">
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-white shrink-0 p-1">
                    <img src={sp.imageUrl} alt={sp.name} className="w-full h-full object-contain" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-sm">{sp.name}</h4>
                    <p className="text-xs text-blue-400 mt-1 flex items-center gap-1">
                      <LinkIcon className="w-3 h-3" /> Aktif
                    </p>
                  </div>
                  <button 
                    onClick={() => {
                      if(window.confirm("Hapus mitra ini?")) {
                        setSponsors(sponsors.filter(s => s.id !== sp.id));
                      }
                    }}
                    className="text-red-400 hover:bg-red-500/20 p-2 rounded-lg cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            
            <div className="bg-blue-900/30 border border-blue-800 p-4 rounded-xl">
              <p className="text-xs text-amber-400 leading-relaxed font-mono">
                <strong className="text-sm">Info:</strong> Menambah logo di sini secara otomatis akan memasukkan banner/ikon mitra ke area Footer dan Beranda (jika diaktifkan) sebagai tanda "Sponsored By".
              </p>
            </div>
          </div>
        )}

        {/* PROFIL MASJID TAB */}
        {activeSubTab === 'profil' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold font-serif mb-2">Profil & Sejarah Masjid Tazkia</h3>
                <p className="text-sm text-blue-300">Ubah data sejarah, Visi, Misi, dan link YouTube Profil Masjid. Perubahan akan langsung tampil di menu "Tentang Kami".</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-blue-200 mb-1">Link YouTube Video Profil</label>
                <input 
                  type="text" 
                  value={profilData.youtubeUrl}
                  onChange={(e) => setProfilData({...profilData, youtubeUrl: e.target.value})}
                  className="w-full bg-blue-950/50 border border-blue-800 rounded-xl px-4 py-2.5 text-white"
                  placeholder="https://youtu.be/..."
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-blue-200 mb-1">Visi Masjid</label>
                <textarea 
                  value={profilData.visi}
                  onChange={(e) => setProfilData({...profilData, visi: e.target.value})}
                  className="w-full bg-blue-950/50 border border-blue-800 rounded-xl px-4 py-2.5 text-white h-24"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-blue-200 mb-1">Misi Masjid (pisahkan dengan baris baru)</label>
                <textarea 
                  value={profilData.misi.join('\n')}
                  onChange={(e) => setProfilData({...profilData, misi: e.target.value.split('\n')})}
                  className="w-full bg-blue-950/50 border border-blue-800 rounded-xl px-4 py-2.5 text-white h-32"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-blue-200 mb-1">Sejarah & Latar Belakang</label>
                <textarea 
                  value={profilData.sejarah}
                  onChange={(e) => setProfilData({...profilData, sejarah: e.target.value})}
                  className="w-full bg-blue-950/50 border border-blue-800 rounded-xl px-4 py-2.5 text-white h-48"
                />
              </div>
            </div>
          </div>
        )}

        {/* ROLE MANAGER TAB */}
        {activeSubTab === 'role' && (
          <RoleManagerAdmin />
        )}


      </div>
    </div>
  );
};
