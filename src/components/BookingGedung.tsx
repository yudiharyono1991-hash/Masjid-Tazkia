import React, { useState, useEffect, useMemo } from 'react';
import { CheckCircle2, ArrowRight, FileText, Calendar as CalendarIcon, User, Phone, Mail, ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';
import { getSupabaseClient } from '../lib/supabase';
import { useMasjidStore } from '../lib/store';

interface BookingGedungProps {
  isDark?: boolean;
}

const DEFAULT_BALLROOM_IMAGES = [
  'https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=800&q=80',
];

const FEATURES = [
  'Panggung Pelaminan',
  'Panggung Musik',
  'AC 10 Unit 5PK',
  'Kursi futura 150 pcs',
  'Ruang Rias',
  'Area Parkir Luas',
  'Akad di Masjid',
  'VIP Parking'
];

export const BookingGedung: React.FC<BookingGedungProps> = ({ isDark = false }) => {
  const { state, addGedungBooking } = useMasjidStore();
  const gedungBookings = state.gedungBookings || [];
  
  const [activeImage, setActiveImage] = useState(0);
  const [images, setImages] = useState<string[]>([]);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    whatsapp: '',
    email: '',
    notes: ''
  });
  
  // Calendar State
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    const fetchAssets = async () => {
      const supabase = getSupabaseClient();
      if (!supabase) return;
      
      try {
        const { data, error } = await supabase.storage.from('tazkia-media').list('booking');
        if (error) {
          const cachedPdf = state.adminSettings?.bookingPdfDraft;
          if (cachedPdf) setPdfUrl(cachedPdf);
          setImages(DEFAULT_BALLROOM_IMAGES);
          return;
        }
        
        if (data && data.length > 0) {
          const deletedImages = state.adminSettings?.bookingImagesDeleted || [];
          const imageFiles = data.filter(file => file.name.match(/\.(jpg|jpeg|png|webp|avif)$/i) && !deletedImages.includes(file.name));
          if (imageFiles.length > 0) {
            const urls = imageFiles.map(file => supabase.storage.from('tazkia-media').getPublicUrl(`booking/${file.name}`).data.publicUrl);
            setImages(urls);
          } else {
            setImages(DEFAULT_BALLROOM_IMAGES);
          }
          
          const pdfFile = data.find(file => file.name.match(/\.pdf$/i) && !deletedImages.includes(file.name));
          if (pdfFile) {
            setPdfUrl(supabase.storage.from('tazkia-media').getPublicUrl(`booking/${pdfFile.name}`).data.publicUrl);
          } else {
            const cachedPdf = state.adminSettings?.bookingPdfDraft;
            if (cachedPdf) setPdfUrl(cachedPdf);
          }
        } else {
          setImages(DEFAULT_BALLROOM_IMAGES);
          const cachedPdf = state.adminSettings?.bookingPdfDraft;
          if (cachedPdf) setPdfUrl(cachedPdf);
        }
      } catch (err) {
        console.error('Failed to load booking assets', err);
        setImages(DEFAULT_BALLROOM_IMAGES);
      }
    };
    fetchAssets();
  }, []);

  const handleCekInfo = () => {
    if (pdfUrl) {
      window.open(pdfUrl, '_blank');
    } else {
      window.open('https://wa.me/6285810008899?text=Assalamu%27alaikum%2C%20saya%20ingin%20bertanya%20tentang%20sewa%20Alhambra%20Ballroom%20Masjid%20Tazkia', '_blank');
    }
  };

  return (
    <div className={`min-h-screen py-16 transition-colors ${isDark ? 'bg-[#0a1128] text-white' : 'bg-white text-slate-800'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          
          {/* Left Column - Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-800 relative group">
              <img 
                src={images[activeImage] || images[0]} 
                alt="Alhambra Ballroom" 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            
            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {images.map((img, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`aspect-[4/3] rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                      activeImage === idx 
                        ? 'border-blue-600 shadow-md' 
                        : 'border-transparent hover:opacity-80'
                    }`}
                  >
                    <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column - Info */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className={`text-3xl sm:text-4xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-[#1e3a8a]'}`}>
                Alhambra Ballroom
              </h1>
              
              <div className={`space-y-4 text-sm sm:text-base leading-relaxed text-justify ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                <p>
                  Alhambra Hall menawarkan suasana elegan dengan sentuhan arsitektur Islam modern. Dirancang khusus untuk mengakomodasi berbagai acara mulai dari resepsi pernikahan, seminar nasional, hingga kajian akbar.
                </p>
                <p>
                  Dengan luas area lebih dari 500m², ruangan ini mampu menampung hingga 800 tamu undangan. Dilengkapi dengan sistem pencahayaan yang hangat dan akustik ruangan yang telah disempurnakan untuk kenyamanan acara Anda.
                </p>
              </div>
            </div>

            {/* Features Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6">
              {FEATURES.map((feat, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="bg-blue-100 dark:bg-blue-900/40 p-1 rounded-full shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className={`text-sm font-medium ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                    {feat}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-4 flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleCekInfo}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg w-full sm:w-auto cursor-pointer"
              >
                <FileText className="w-4 h-4" />
                <span>Cek Info & Katalog PDF</span>
              </button>
              
              <button
                onClick={() => window.open('https://wa.me/6285810008899?text=Assalamu%27alaikum%2C%20saya%20ingin%20bertanya%20tentang%20sewa%20Alhambra%20Ballroom%20Masjid%20Tazkia', '_blank')}
                className="bg-green-500/10 hover:bg-green-500/20 text-green-600 border border-green-500/30 px-8 py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-sm w-full sm:w-auto cursor-pointer"
              >
                <span>Tanya via WhatsApp</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            
          </div>
          
        </div>

        {/* Cek Ketersediaan & Booking Section */}
        <div className="mt-24">
          <div className="text-center mb-10">
            <h2 className={`text-2xl sm:text-3xl font-bold tracking-tight mb-3 ${isDark ? 'text-white' : 'text-[#1e3a8a]'}`}>
              Cek Ketersediaan & Booking
            </h2>
            <p className={isDark ? 'text-slate-400' : 'text-slate-500'}>
              Silakan pilih tanggal di kalender dan lengkapi data diri Anda
            </p>
          </div>

          <div className="grid md:grid-cols-12 gap-8 max-w-5xl mx-auto">
            {/* Calendar Widget */}
            <div className={`md:col-span-5 rounded-2xl p-6 shadow-xl border ${isDark ? 'bg-[#0b1329] border-slate-800' : 'bg-white border-slate-100'}`}>
              <div className="flex items-center justify-between mb-6">
                <h3 className={`font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                  {currentDate.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
                </h3>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}
                    className={`p-1.5 rounded-lg ${isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-600'}`}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}
                    className={`p-1.5 rounded-lg ${isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-600'}`}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-1 text-center mb-2">
                {['MG', 'SN', 'SL', 'RB', 'KM', 'JM', 'SB'].map(day => (
                  <div key={day} className={`text-[10px] font-bold ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{day}</div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1 text-center">
                {Array.from({ length: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay() }).map((_, i) => (
                  <div key={`empty-${i}`} className="p-2" />
                ))}
                
                {Array.from({ length: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate() }).map((_, i) => {
                  const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), i + 1);
                  const dateStr = date.toISOString().split('T')[0];
                  const today = new Date();
                  today.setHours(0,0,0,0);
                  
                  const isPast = date < today;
                  const booking = gedungBookings.find(b => b.date === dateStr && b.status === 'approved');
                  const isBooked = !!booking;
                  const isSelected = selectedDate?.toISOString().split('T')[0] === dateStr;

                  let cellClass = `p-2 rounded-lg text-sm transition-all `;
                  
                  if (isPast) {
                    cellClass += isDark ? 'text-slate-700' : 'text-slate-300';
                  } else if (isBooked) {
                    cellClass += 'bg-[#1e3a8a] text-white font-bold cursor-not-allowed';
                  } else if (isSelected) {
                    cellClass += 'bg-amber-400 text-blue-950 font-bold';
                  } else {
                    cellClass += `cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/40 ${isDark ? 'text-slate-300' : 'text-slate-700'}`;
                  }

                  return (
                    <button
                      key={i}
                      disabled={isPast || isBooked}
                      onClick={() => setSelectedDate(date)}
                      className={cellClass}
                    >
                      {i + 1}
                    </button>
                  );
                })}
              </div>

              <div className="mt-8 flex justify-center gap-4 text-xs">
                <div className="flex items-center gap-1.5">
                  <div className={`w-3 h-3 rounded-sm border ${isDark ? 'border-slate-600 bg-[#0b1329]' : 'border-slate-200 bg-white'}`} />
                  <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Tersedia</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-sm bg-[#1e3a8a]" />
                  <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Penuh</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-sm bg-amber-400" />
                  <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Dipilih</span>
                </div>
              </div>
            </div>

            {/* Booking Form */}
            <div className={`md:col-span-7 rounded-2xl shadow-xl overflow-hidden ${isDark ? 'bg-[#0b1329]' : 'bg-white'}`}>
              <div className="bg-blue-600 px-6 py-4">
                <h3 className="font-bold text-white flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5 text-amber-300" /> Lengkapi Data Pemesan
                </h3>
              </div>
              
              <div className="p-6 sm:p-8">
                {submitSuccess ? (
                  <div className="flex flex-col items-center justify-center text-center py-10 space-y-4">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                      Permintaan Booking Terkirim!
                    </h3>
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      Alhamdulillah, data pemesanan Anda untuk tanggal <strong className={isDark ? 'text-amber-400' : 'text-blue-600'}>{selectedDate?.toLocaleDateString('id-ID', { dateStyle: 'long' })}</strong> telah kami terima. Tim DKM akan segera menghubungi Anda melalui WhatsApp.
                    </p>
                    <button
                      onClick={() => {
                        setSubmitSuccess(false);
                        setSelectedDate(null);
                        setFormData({ name: '', whatsapp: '', email: '', notes: '' });
                      }}
                      className="mt-4 bg-blue-100 hover:bg-blue-200 text-blue-700 px-6 py-2 rounded-xl font-bold text-sm transition-colors"
                    >
                      Pesan Tanggal Lain
                    </button>
                  </div>
                ) : (
                  <form 
                    className="space-y-5"
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!selectedDate) {
                        alert('Silakan pilih tanggal yang tersedia di kalender terlebih dahulu.');
                        return;
                      }
                      setIsSubmitting(true);
                      setTimeout(() => {
                        addGedungBooking({
                          ...formData,
                          date: selectedDate.toISOString().split('T')[0],
                          status: 'pending'
                        });
                        setIsSubmitting(false);
                        setSubmitSuccess(true);
                      }, 1000);
                    }}
                  >
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <label className={`text-xs font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Nama Lengkap</label>
                        <div className="relative">
                          <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input 
                            type="text" 
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            placeholder="Nama Anda"
                            className={`w-full pl-9 pr-4 py-2.5 rounded-xl text-sm border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
                              isDark ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-200 text-slate-800'
                            }`}
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className={`text-xs font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>No. WhatsApp</label>
                        <div className="relative">
                          <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input 
                            type="tel" 
                            required
                            value={formData.whatsapp}
                            onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
                            placeholder="0812..."
                            className={`w-full pl-9 pr-4 py-2.5 rounded-xl text-sm border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
                              isDark ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-200 text-slate-800'
                            }`}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className={`text-xs font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Alamat Email</label>
                      <div className="relative">
                        <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                          type="email" 
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          placeholder="contoh@email.com"
                          className={`w-full pl-9 pr-4 py-2.5 rounded-xl text-sm border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
                            isDark ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-200 text-slate-800'
                          }`}
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className={`text-xs font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Tanggal Dipilih</label>
                      <input 
                        type="text" 
                        readOnly
                        value={selectedDate ? selectedDate.toLocaleDateString('id-ID', { dateStyle: 'long' }) : 'Silakan pilih tanggal di kalender samping'}
                        className={`w-full px-4 py-2.5 rounded-xl text-sm border outline-none font-medium ${
                          isDark 
                            ? 'bg-slate-800/50 border-slate-700 text-amber-400' 
                            : 'bg-slate-100 border-slate-200 text-blue-700'
                        }`}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className={`text-xs font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Catatan Tambahan</label>
                      <textarea 
                        rows={3}
                        value={formData.notes}
                        onChange={(e) => setFormData({...formData, notes: e.target.value})}
                        placeholder="Jenis acara, estimasi tamu, atau request khusus..."
                        className={`w-full px-4 py-3 rounded-xl text-sm border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none ${
                          isDark ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-200 text-slate-800'
                        }`}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting || !selectedDate}
                      className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-bold transition-all shadow-md mt-2"
                    >
                      {isSubmitting ? 'Mengirim Data...' : 'Ajukan Booking Sekarang'}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
