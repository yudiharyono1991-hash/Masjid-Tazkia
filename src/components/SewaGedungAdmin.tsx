import React, { useState, useEffect } from 'react';
import { Upload, FileText, Image as ImageIcon, Trash2, CheckCircle2, Building, CalendarCheck, Clock, XCircle } from 'lucide-react';
import { uploadMedia, deleteMediaFromSupabase } from '../lib/mediaUpload';
import { useMasjidStore } from '../lib/store';

export const SewaGedungAdmin: React.FC = () => {
  const { state, updateGedungBookingStatus, updateKamarBookingStatus, updateAdminSettings } = useMasjidStore();
  const gedungBookings = state.gedungBookings || [];
  const kamarBookings = state.kamarBookings || [];
  const [activeTab, setActiveTab] = useState<'assets' | 'bookings' | 'kamar'>('bookings');
  
  // Date utils
  const getFirstDayOfMonth = () => { const d = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" })); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-01`; };
  const getToday = () => { const d = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" })); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; };

  const [startDate, setStartDate] = useState(getFirstDayOfMonth());
  const [endDate, setEndDate] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() + 1);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  });

  const [images, setImages] = useState<{name: string, url: string}[]>([]);
  const [pdf, setPdf] = useState<{name: string, url: string} | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const fetchAssets = async () => {
    try {
      const { getSupabaseClient } = await import('../lib/supabase');
      const supabase = getSupabaseClient();
      
      if (supabase) {
        const { data, error } = await supabase.storage.from('tazkia-media').list('booking');
        if (!error && data) {
          const deletedImages = state.adminSettings.bookingImagesDeleted || [];
          const imageFiles = data.filter(file => file.name.match(/\.(jpg|jpeg|png|webp|avif|mp4|webm|ogg)$/i) && file.name !== '.emptyFolderPlaceholder' && !deletedImages.includes(file.name));
          const newImages = imageFiles.map(file => ({
            name: file.name,
            url: supabase.storage.from('tazkia-media').getPublicUrl(`booking/${file.name}`).data.publicUrl
          }));
          setImages(newImages);

          const pdfFile = data.find(file => file.name.match(/\.pdf$/i) && !deletedImages.includes(file.name));
          if (pdfFile) {
            setPdf({
              name: pdfFile.name,
              url: supabase.storage.from('tazkia-media').getPublicUrl(`booking/${pdfFile.name}`).data.publicUrl
            });
          } else {
            setPdf(null);
          }
        }
      } else {
        const savedPdf = state.adminSettings.bookingPdfDraft;
        if (savedPdf) setPdf({ name: 'draft.pdf', url: savedPdf });
      }
    } catch (err) {
      console.error('Error fetching assets', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrintInvoice = (booking: any) => {
    const invoiceWindow = window.open('', '_blank');
    if (!invoiceWindow) return alert('Izinkan pop-up untuk mencetak invoice.');

    const invoiceDate = new Date().toLocaleDateString('id-ID', { dateStyle: 'long' });
    const bookingDate = new Date(booking.date).toLocaleDateString('id-ID', { dateStyle: 'long' });

    const html = `
      <html>
        <head>
          <title>Invoice Booking - ${booking.name}</title>
          <style>
            body { font-family: 'Arial', sans-serif; padding: 40px; color: #333; line-height: 1.6; }
            .header { text-align: center; border-bottom: 2px solid #2563eb; padding-bottom: 20px; margin-bottom: 30px; }
            .title { font-size: 24px; font-weight: bold; color: #1e3a8a; }
            .subtitle { color: #64748b; }
            .invoice-details { display: flex; justify-content: space-between; margin-bottom: 40px; }
            .invoice-details > div { width: 48%; }
            table { w-full; width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            th, td { border: 1px solid #cbd5e1; padding: 12px; text-align: left; }
            th { background-color: #f1f5f9; color: #1e293b; }
            .total { text-align: right; font-weight: bold; font-size: 18px; }
            .footer { margin-top: 50px; text-align: center; font-size: 14px; color: #64748b; border-top: 1px solid #cbd5e1; padding-top: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="title">MASJID TAZKIA ISLAMIC CENTER</div>
            <div class="subtitle">Jl. Ir. H. Djuanda No. 78, Sentul City, Bogor</div>
            <h2>INVOICE PENYEWAAN GEDUNG</h2>
          </div>
          <div class="invoice-details">
            <div>
              <strong>Kepada Yth:</strong><br/>
              ${booking.name}<br/>
              WA: ${booking.whatsapp}<br/>
              Email: ${booking.email || '-'}
            </div>
            <div style="text-align: right;">
              <strong>No. Invoice:</strong> INV-GB-${booking.id.split('-')[1] || Math.floor(Math.random() * 10000)}<br/>
              <strong>Tanggal Cetak:</strong> ${invoiceDate}
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Deskripsi Layanan</th>
                <th>Tanggal Acara</th>
                <th>Harga</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Penyewaan Alhambra Ballroom (Gedung Masjid Tazkia)<br/><small>Catatan: ${booking.notes || '-'}</small></td>
                <td>${bookingDate}</td>
                <td>Sesuai Kesepakatan</td>
              </tr>
            </tbody>
          </table>
          <div class="total">
            Total Tagihan: Silakan hubungi admin untuk konfirmasi pembayaran.
          </div>
          <div class="footer">
            Terima kasih telah mempercayakan acara Anda di Masjid Tazkia.<br/>
            Pembayaran dapat ditransfer ke Bank BSI 7130-2498-17 a.n. DKM Masjid Tazkia.
          </div>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `;
    invoiceWindow.document.write(html);
    invoiceWindow.document.close();
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setMessage('');
    
    const fileExt = file.name.split('.').pop()?.toLowerCase();
    const folder = fileExt === 'pdf' ? 'booking' : 'booking';

    // Upload ke Supabase Storage
    const result = await uploadMedia(file, 'booking');
    
    const isPdf = fileExt === 'pdf';
    if (isPdf) {
      const newPdf = { name: file.name, url: result.url };
      setPdf(newPdf);
      updateAdminSettings({ bookingPdfDraft: result.url });
    } else {
      // Just re-fetch from supabase to get the correct list
      await fetchAssets();
    }
    
    if (result.isLocal) {
      setMessage(`⚠️ ${file.name} tersimpan lokal. Buat bucket 'masjid-media' di Supabase agar bisa diakses semua orang.`);
    } else {
      setMessage(`✅ ${file.name} berhasil diunggah ke server!`);
    }
    setUploading(false);
  };

  const handleDelete = async (fileName: string, fileUrl?: string, isPdfItem = false) => {
    const confirmMessage = isPdfItem 
      ? 'Apakah Anda yakin akan menghapus file PDF Syarat & Ketentuan ini?' 
      : 'Apakah Anda yakin akan menghapus foto ini?';
      
    if (!window.confirm(confirmMessage)) return;

    // Hapus dari Supabase Storage jika URL adalah dari Supabase
    if (fileUrl && (fileUrl.includes('supabase') || fileUrl.includes('supabase.co'))) {
      const success = await deleteMediaFromSupabase(fileUrl);
      if (!success) {
        alert("Peringatan: Gagal menghapus file dari Supabase (Cek RLS Policy 'DELETE'). Namun, file akan disembunyikan dari tampilan Anda.");
      }
    }

    const deletedImages = state.adminSettings.bookingImagesDeleted || [];
    const newDeletedImages = [...deletedImages, fileName];

    if (pdf && pdf.name === fileName) {
      setPdf(null);
      updateAdminSettings({ bookingPdfDraft: '', bookingImagesDeleted: newDeletedImages });
    } else {
      // Hapus dari state images lokal
      const newImages = images.filter(img => img.name !== fileName);
      setImages(newImages);
      // Simpan override ke store untuk fallback jika fetch gagal / supabase tidak bisa hapus
      updateAdminSettings({ bookingImagesDeleted: newDeletedImages });
      await fetchAssets();
    }
    
    setMessage(`Berhasil menghapus ${fileName}`);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Tabs */}
      <div className="flex border-b border-blue-800/50">
        <button
          onClick={() => setActiveTab('bookings')}
          className={`px-6 py-3 font-bold text-sm transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'bookings' 
              ? 'border-amber-400 text-amber-400 bg-blue-900/50' 
              : 'border-transparent text-blue-300 hover:text-white hover:bg-blue-900/30'
          }`}
        >
          <CalendarCheck className="w-4 h-4" /> Manajemen Reservasi
        </button>
        <button
          onClick={() => setActiveTab('assets')}
          className={`px-6 py-3 font-bold text-sm transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'assets' 
              ? 'border-amber-400 text-amber-400 bg-blue-900/50' 
              : 'border-transparent text-blue-300 hover:text-white hover:bg-blue-900/30'
          }`}
        >
          <Building className="w-4 h-4" /> Aset & Galeri Gedung
        </button>
        <button
          onClick={() => setActiveTab('kamar')}
          className={`px-6 py-3 font-bold text-sm transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'kamar' 
              ? 'border-amber-400 text-amber-400 bg-blue-900/50' 
              : 'border-transparent text-blue-300 hover:text-white hover:bg-blue-900/30'
          }`}
        >
          <CalendarCheck className="w-4 h-4" /> Reservasi Kamar
        </button>
      </div>

      {activeTab === 'bookings' && (
        <div className="bg-blue-900 border border-blue-800 rounded-2xl p-6 shadow-lg">
          <h3 className="font-serif text-xl font-bold text-white mb-2 flex items-center gap-2">
            <CalendarCheck className="w-5 h-5 text-amber-400" />
            Daftar Pesanan Gedung
          </h3>
          <p className="text-sm text-blue-200 mb-6">
            Kelola permintaan pemesanan Alhambra Ballroom. Setujui permintaan untuk menandai tanggal sebagai "Penuh" di kalender pengunjung.
          </p>

          <div className="flex items-center gap-2 mb-6">
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="bg-blue-950 border border-blue-700 text-white text-sm rounded-lg px-3 py-1.5 outline-none focus:border-amber-500" />
            <span className="text-blue-400 font-bold text-sm">s/d</span>
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="bg-blue-950 border border-blue-700 text-white text-sm rounded-lg px-3 py-1.5 outline-none focus:border-amber-500" />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-blue-800 text-blue-300 text-xs uppercase tracking-wider">
                  <th className="p-4 font-semibold">TANGGAL</th>
                  <th className="p-4 font-semibold">PEMESAN</th>
                  <th className="p-4 font-semibold">KONTAK</th>
                  <th className="p-4 font-semibold">CATATAN</th>
                  <th className="p-4 font-semibold text-center">STATUS</th>
                  <th className="p-4 font-semibold text-right">AKSI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-800/50 text-sm">
                {gedungBookings.filter(b => b.date >= startDate && b.date <= endDate).length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-blue-400 italic">
                      Belum ada permintaan booking pada rentang tanggal ini.
                    </td>
                  </tr>
                ) : (
                  gedungBookings.filter(b => b.date >= startDate && b.date <= endDate).map(booking => (
                    <tr key={booking.id} className="hover:bg-blue-800/20 transition-colors">
                      <td className="p-4 font-medium text-white whitespace-nowrap">
                        {new Date(booking.date).toLocaleDateString('id-ID', { dateStyle: 'medium' })}
                      </td>
                      <td className="p-4 text-blue-100">
                        {booking.name}
                      </td>
                      <td className="p-4 text-blue-100">
                        <div className="flex flex-col gap-1">
                          <a href={`https://wa.me/${booking.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="text-amber-300 hover:underline">{booking.whatsapp}</a>
                          <span className="text-xs text-blue-300">{booking.email}</span>
                        </div>
                      </td>
                      <td className="p-4 text-blue-200 max-w-xs truncate" title={booking.notes}>
                        {booking.notes || '-'}
                      </td>
                      <td className="p-4 text-center">
                        {booking.status === 'pending' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                            <Clock className="w-3.5 h-3.5" /> Menunggu
                          </span>
                        )}
                        {booking.status === 'approved' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-green-500/20 text-green-400 border border-green-500/30">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Disetujui
                          </span>
                        )}
                        {booking.status === 'rejected' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                            <XCircle className="w-3.5 h-3.5" /> Ditolak
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right whitespace-nowrap">
                        {booking.status === 'pending' && (
                          <div className="flex justify-end gap-2">
                            <button 
                              onClick={() => updateGedungBookingStatus(booking.id, 'approved')}
                              className="p-1.5 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500 hover:text-white transition-colors cursor-pointer"
                              title="Setujui (Tandai Penuh)"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => updateGedungBookingStatus(booking.id, 'rejected')}
                              className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white transition-colors cursor-pointer"
                              title="Tolak"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                        {booking.status !== 'pending' && (
                          <div className="flex flex-col gap-2 items-end">
                            <button 
                              onClick={() => updateGedungBookingStatus(booking.id, 'pending')}
                              className="text-xs text-blue-400 hover:text-amber-300 underline underline-offset-2 transition-colors cursor-pointer"
                            >
                              Batalkan Status
                            </button>
                            {booking.status === 'approved' && (
                              <button
                                onClick={() => handlePrintInvoice(booking)}
                                className="text-xs text-amber-400 hover:text-amber-300 font-bold border border-amber-500/30 px-2 py-1 rounded-md bg-amber-500/10 cursor-pointer flex items-center gap-1"
                              >
                                <FileText className="w-3 h-3" /> Cetak Invoice
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'assets' && (
        <div className="bg-blue-900 border border-blue-800 rounded-2xl p-6 shadow-lg">
          <h3 className="font-serif text-xl font-bold text-white mb-2 flex items-center gap-2">
            <Building className="w-5 h-5 text-amber-400" />
            Kelola Aset Booking Gedung
        </h3>
        <p className="text-sm text-blue-200 mb-6">
          Unggah foto galeri Alhambra Ballroom dan file PDF Syarat & Ketentuan. Foto-foto ini akan otomatis ditampilkan pada halaman Booking Gedung di sisi pengguna.
        </p>

        {message && (
          <div className="bg-green-500/20 text-green-300 border border-green-500/30 p-3 rounded-xl text-sm mb-6 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            {message}
          </div>
        )}

        <div className="flex items-center gap-4 mb-8">
          <label className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl font-bold text-sm cursor-pointer transition-colors shadow-md flex items-center gap-2">
            <Upload className="w-4 h-4" />
            <span>{uploading ? 'Mengunggah...' : 'Unggah File (Foto / PDF)'}</span>
            <input type="file" className="hidden" accept="image/*,video/mp4,video/webm,video/ogg,.pdf" onChange={handleUpload} disabled={uploading} />
          </label>
        </div>

        {loading ? (
          <div className="text-blue-300 text-sm animate-pulse">Memuat data dari server...</div>
        ) : (
          <div className="space-y-8">
            
            {/* PDF Section */}
            <div>
              <h4 className="font-bold text-amber-400 text-sm mb-3 font-mono uppercase tracking-widest flex items-center gap-2">
                <FileText className="w-4 h-4" /> Katalog / Syarat PDF
              </h4>
              {pdf ? (
                <div className="flex items-center justify-between bg-blue-950/50 border border-blue-800 p-4 rounded-xl">
                  <a href={pdf.url} target="_blank" rel="noreferrer" className="text-blue-300 hover:text-white font-medium flex items-center gap-2 text-sm transition-colors">
                    <FileText className="w-4 h-4 text-rose-400" />
                    {pdf.name}
                  </a>
                  <button onClick={() => handleDelete(pdf.name, pdf.url, true)} className="text-rose-400 hover:bg-rose-500/20 p-2 rounded-lg transition-colors cursor-pointer" title="Hapus PDF">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="text-sm text-blue-400 italic">Belum ada file PDF yang diunggah.</div>
              )}
            </div>

            {/* Images Section */}
            <div>
              <h4 className="font-bold text-amber-400 text-sm mb-3 font-mono uppercase tracking-widest flex items-center gap-2">
                <ImageIcon className="w-4 h-4" /> Foto Galeri ({images.length})
              </h4>
              {images.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {images.map(img => {
                    const isVideo = img.name.match(/\.(mp4|webm|ogg)$/i) || img.url.match(/\.(mp4|webm|ogg)$/i);
                    return (
                      <div key={img.name} className="relative group rounded-xl overflow-hidden border border-blue-800 bg-blue-950 aspect-[4/3]">
                        {isVideo ? (
                          <video src={img.url} className="w-full h-full object-cover" controls muted />
                        ) : (
                          <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 sm:bg-black/60 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2 pointer-events-none">
                          <span className="text-[10px] text-white truncate drop-shadow-md">{img.name}</span>
                          <button onClick={() => handleDelete(img.name, img.url, false)} className="self-end bg-rose-500/90 sm:bg-rose-500 text-white p-2 sm:p-1.5 rounded-lg hover:bg-rose-600 cursor-pointer shadow-md pointer-events-auto">
                            <Trash2 className="w-5 h-5 sm:w-4 sm:h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-sm text-blue-400 italic">Belum ada foto yang diunggah. (Akan menggunakan foto default saat ini).</div>
              )}
            </div>

          </div>
        )}
      </div>
      )}

      {activeTab === 'kamar' && (
        <div className="bg-blue-900 border border-blue-800 rounded-2xl p-6 shadow-lg">
          <h3 className="font-serif text-xl font-bold text-white mb-2 flex items-center gap-2">
            <CalendarCheck className="w-5 h-5 text-amber-400" />
            Daftar Pesanan Kamar Penginapan Jamaah
          </h3>
          <p className="text-sm text-blue-200 mb-6">
            Kelola permintaan pemesanan kamar/guest house masjid.
          </p>

          <div className="flex items-center gap-2 mb-6">
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="bg-blue-950 border border-blue-700 text-white text-sm rounded-lg px-3 py-1.5 outline-none focus:border-amber-500" />
            <span className="text-blue-400 font-bold text-sm">s/d</span>
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="bg-blue-950 border border-blue-700 text-white text-sm rounded-lg px-3 py-1.5 outline-none focus:border-amber-500" />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-blue-800 text-blue-300 text-xs uppercase tracking-wider">
                  <th className="p-4 font-semibold">TANGGAL (IN - OUT)</th>
                  <th className="p-4 font-semibold">PEMESAN</th>
                  <th className="p-4 font-semibold">TIPE KAMAR</th>
                  <th className="p-4 font-semibold text-center">STATUS</th>
                  <th className="p-4 font-semibold text-right">AKSI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-800/50 text-sm">
                {kamarBookings.filter(b => b.date >= startDate && b.date <= endDate).length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-blue-400 italic">
                      Belum ada permintaan booking kamar pada rentang tanggal ini.
                    </td>
                  </tr>
                ) : (
                  kamarBookings.filter(b => b.date >= startDate && b.date <= endDate).map(booking => (
                    <tr key={booking.id} className="hover:bg-blue-800/20 transition-colors">
                      <td className="p-4 font-medium text-white whitespace-nowrap">
                        In: {new Date(booking.date).toLocaleDateString('id-ID')}<br/>
                        Out: {new Date(booking.checkoutDate).toLocaleDateString('id-ID')}
                      </td>
                      <td className="p-4 text-blue-100">
                        <div className="flex flex-col gap-1">
                          <span>{booking.name}</span>
                          <a href={`https://wa.me/${booking.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="text-amber-300 hover:underline">{booking.whatsapp}</a>
                        </div>
                      </td>
                      <td className="p-4 text-blue-200">
                        <span className="font-bold text-amber-300 bg-amber-500/20 px-2 py-1 rounded">{booking.roomType}</span>
                        <div className="mt-1 text-xs">{booking.notes}</div>
                      </td>
                      <td className="p-4 text-center">
                        {booking.status === 'pending' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                            <Clock className="w-3.5 h-3.5" /> Menunggu
                          </span>
                        )}
                        {booking.status === 'approved' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-green-500/20 text-green-400 border border-green-500/30">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Disetujui
                          </span>
                        )}
                        {booking.status === 'rejected' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                            <XCircle className="w-3.5 h-3.5" /> Ditolak
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right whitespace-nowrap">
                        {booking.status === 'pending' && (
                          <div className="flex justify-end gap-2">
                            <button 
                              onClick={() => updateKamarBookingStatus(booking.id, 'approved')}
                              className="p-1.5 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500 hover:text-white transition-colors cursor-pointer"
                              title="Setujui"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => updateKamarBookingStatus(booking.id, 'rejected')}
                              className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white transition-colors cursor-pointer"
                              title="Tolak"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                        {booking.status !== 'pending' && (
                          <button 
                            onClick={() => updateKamarBookingStatus(booking.id, 'pending')}
                            className="text-xs text-blue-400 hover:text-amber-300 underline underline-offset-2 transition-colors cursor-pointer"
                          >
                            Batalkan Status
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
