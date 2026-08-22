import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Star, 
  BookOpen, 
  Phone, 
  Mail, 
  MapPin 
} from 'lucide-react';
import { useMasjidStore } from '../lib/store';

export const TpaProgramSection: React.FC = () => {
  const { addTpaRegistration } = useMasjidStore();
  const [formData, setFormData] = useState({
    program: 'Anak',
    namaLengkap: '',
    usia: '',
    namaWali: '',
    whatsapp: '',
    email: '',
    alamat: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    addTpaRegistration({
      program: formData.program as 'Anak' | 'Dewasa',
      namaLengkap: formData.namaLengkap,
      usia: formData.usia,
      namaWali: formData.namaWali,
      whatsapp: formData.whatsapp,
      email: formData.email,
      alamat: formData.alamat,
      status: 'pending',
      paymentStatus: 'unpaid',
      feeAmount: formData.program === 'Anak' ? 250000 : 350000 // Contoh biaya
    });

    alert('Terima kasih, formulir pendaftaran TPA Anda telah kami terima. Admin kami akan segera menghubungi Anda untuk konfirmasi jadwal.');
    setFormData({
      program: 'Anak',
      namaLengkap: '',
      usia: '',
      namaWali: '',
      whatsapp: '',
      email: '',
      alamat: ''
    });
  };

  return (
    <div className="bg-white min-h-screen pb-20 font-sans">
      {/* Hero Section */}
      <div className="relative w-full h-[500px] md:h-[600px] bg-gray-900 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1609599006353-e629aaabfeae?q=80&w=2000&auto=format&fit=crop" 
          alt="TPA Masjid Tazkia" 
          className="w-full h-full object-cover opacity-75"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-bold mb-4 uppercase tracking-widest">
            Pendidikan Al-Qur'an
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 drop-shadow-lg leading-tight">
            Mencetak Generasi Qur'ani <br/> Berakhlak Mulia
          </h1>
          <button onClick={() => { const el = document.getElementById('form-tpa'); if(el) el.scrollIntoView({ behavior: 'smooth' }); }} className="bg-white text-blue-900 px-8 py-3 rounded-full font-bold text-lg hover:bg-blue-50 transition shadow-lg transform hover:scale-105">
            Daftar Sekarang
          </button>
        </div>
      </div>

      {/* About Section */}
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-blue-100 rounded-full -z-10"></div>
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-yellow-100 rounded-full -z-10"></div>
            <img 
              src="https://images.unsplash.com/photo-1584663639450-488f5d025407?q=80&w=800&auto=format&fit=crop" 
              alt="Suasana Belajar" 
              className="rounded-3xl shadow-2xl w-full h-auto object-cover aspect-[4/3] relative z-10"
            />
          </div>
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
              Belajar Al-Qur'an Menyenangkan di Masjid Tazkia
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-6">
              TPA Masjid Tazkia hadir sebagai wadah pendidikan Al-Qur'an yang komprehensif. Kami tidak hanya mengajarkan cara membaca, tetapi juga menanamkan nilai-nilai adab, akhlak, dan kecintaan terhadap Islam.
            </p>
            <ul className="space-y-3">
              {[
                "Metode pembelajaran interaktif (Iqro & Tilawati)",
                "Pengajar bersertifikat dan berpengalaman",
                "Fasilitas ruang kelas nyaman & ber-AC",
                "Kurikulum akhlak dan materi dasar Islam"
              ].map((item, idx) => (
                <li key={idx} className="flex items-center gap-3 text-gray-700 font-medium">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Programs Section */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Pilihan Program Pendidikan</h2>
          <div className="grid md:grid-cols-2 gap-8">
            
            {/* TPA Anak */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-2xl transition group flex flex-col">
              <div className="h-64 overflow-hidden relative">
                <img 
                  src="https://images.unsplash.com/photo-1519817650390-64a93db51149?q=80&w=800&auto=format&fit=crop" 
                  alt="TPA Anak" 
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                />
                <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                  Usia 4-12 Tahun
                </div>
              </div>
              <div className="p-8 flex flex-col flex-grow">
                <div className="flex items-center gap-2 mb-3">
                  <Star className="w-6 h-6 text-orange-500 fill-orange-500" />
                  <h3 className="text-2xl font-bold text-gray-900">TPA Anak Ceria</h3>
                </div>
                <p className="text-gray-600 mb-6 flex-grow">
                  Program khusus anak-anak dengan pendekatan bermain sambil belajar. Fokus pada pengenalan huruf hijaiyah, hafalan surat pendek, dan doa harian.
                </p>
                <button onClick={() => { setFormData(p => ({...p, program: 'Anak'})); const el = document.getElementById('form-tpa'); if(el) el.scrollIntoView({ behavior: 'smooth' }); }} className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition">
                  Daftar TPA Anak
                </button>
              </div>
            </div>

            {/* TPA Dewasa */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-2xl transition group flex flex-col">
              <div className="h-64 overflow-hidden relative">
                <img 
                  src="https://images.unsplash.com/photo-1621501103250-99c565a0b734?q=80&w=800&auto=format&fit=crop" 
                  alt="TPA Dewasa" 
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                />
                <div className="absolute top-4 right-4 bg-blue-900 text-white px-3 py-1 rounded-full text-xs font-bold">
                  Usia 13+ / Umum
                </div>
              </div>
              <div className="p-8 flex flex-col flex-grow">
                <div className="flex items-center gap-2 mb-3">
                  <BookOpen className="w-6 h-6 text-blue-900" />
                  <h3 className="text-2xl font-bold text-gray-900">Tahsin & Tahfidz Dewasa</h3>
                </div>
                <p className="text-gray-600 mb-6 flex-grow">
                  Program perbaikan bacaan (Tahsin) dan hafalan (Tahfidz) untuk remaja dan dewasa. Jadwal fleksibel (Ba'da Maghrib/Subuh).
                </p>
                <button onClick={() => { setFormData(p => ({...p, program: 'Dewasa'})); const el = document.getElementById('form-tpa'); if(el) el.scrollIntoView({ behavior: 'smooth' }); }} className="w-full bg-blue-900 text-white font-bold py-3 rounded-xl hover:bg-blue-800 transition">
                  Daftar Program Dewasa
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Form Section */}
      <div id="form-tpa" className="container mx-auto px-4 py-20 max-w-4xl scroll-mt-20">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-gray-100">
          {/* Left Col */}
          <div className="bg-blue-900 p-10 text-white md:w-1/3 flex flex-col justify-center">
            <h3 className="text-2xl font-bold mb-4">Formulir Pendaftaran</h3>
            <p className="text-blue-100 mb-8 text-sm leading-relaxed">
              Silakan isi data diri dengan benar. Admin kami akan menghubungi Anda untuk konfirmasi jadwal.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="bg-blue-800 p-2 rounded">
                  <Phone className="w-4.5 h-4.5" />
                </div>
                <span className="text-sm">+62 812-3456-7890</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-blue-800 p-2 rounded">
                  <Mail className="w-4.5 h-4.5" />
                </div>
                <span className="text-sm">tpa@masjidtazkia.com</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-blue-800 p-2 rounded">
                  <MapPin className="w-4.5 h-4.5" />
                </div>
                <span className="text-sm">Lt. 1 Gedung Pendidikan</span>
              </div>
            </div>
          </div>

          {/* Right Col */}
          <div className="p-10 md:w-2/3">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="bg-blue-50 p-4 rounded-xl mb-4 border border-blue-100">
                <label className="block text-xs font-bold text-blue-800 uppercase mb-3">Pilih Program</label>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      className="w-5 h-5 text-blue-600 accent-blue-600" 
                      name="program" 
                      value="Anak"
                      checked={formData.program === 'Anak'}
                      onChange={handleChange}
                    />
                    <span className="font-bold text-gray-700">TPA Anak</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      className="w-5 h-5 text-blue-600 accent-blue-600" 
                      name="program" 
                      value="Dewasa"
                      checked={formData.program === 'Dewasa'}
                      onChange={handleChange}
                    />
                    <span className="font-bold text-gray-700">Dewasa</span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-bold text-gray-700 mb-1 block">Nama Lengkap</label>
                  <input 
                    name="namaLengkap"
                    value={formData.namaLengkap}
                    onChange={handleChange}
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-shadow" 
                    required 
                  />
                </div>
                <div>
                  <label className="text-sm font-bold text-gray-700 mb-1 block">Usia (Tahun)</label>
                  <input 
                    type="number"
                    name="usia"
                    value={formData.usia}
                    onChange={handleChange}
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-shadow" 
                    required 
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-bold text-gray-700 mb-1 block">Nama Orang Tua / Wali</label>
                <input 
                  name="namaWali"
                  value={formData.namaWali}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-shadow" 
                  required 
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-bold text-gray-700 mb-1 block">No. WhatsApp</label>
                  <input 
                    type="tel"
                    name="whatsapp"
                    value={formData.whatsapp}
                    onChange={handleChange}
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-shadow" 
                    required 
                  />
                </div>
                <div>
                  <label className="text-sm font-bold text-gray-700 mb-1 block">Email (Opsional)</label>
                  <input 
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-shadow" 
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-bold text-gray-700 mb-1 block">Alamat Domisili</label>
                <textarea 
                  name="alamat"
                  value={formData.alamat}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none h-24 transition-shadow resize-none" 
                  required
                ></textarea>
              </div>

              <button type="submit" className="w-full bg-blue-900 text-white font-bold py-3.5 rounded-lg hover:bg-blue-800 transition shadow-lg active:scale-[0.98]">
                Kirim Pendaftaran
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Gallery Section */}
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="flex items-center gap-4 mb-8">
          <div className="h-1 flex-grow bg-gray-200 rounded"></div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center whitespace-nowrap">Galeri Kegiatan TPA</h2>
          <div className="h-1 flex-grow bg-gray-200 rounded"></div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((num) => (
            <div key={num} className="aspect-square rounded-xl overflow-hidden shadow-md bg-gray-200 hover:opacity-90 transition cursor-pointer group">
              <img 
                src={`https://placehold.co/500x500?text=Kegiatan+TPA+${num}`} 
                alt={`Kegiatan TPA ${num}`} 
                className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
              />
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
