import React, { useState } from 'react';
import { 
  HeartHandshake, 
  FileText, 
  UserCheck, 
  PhoneCall, 
  Award, 
  CheckCircle2,
  UploadCloud
} from 'lucide-react';

export const MuallafCenterSection: React.FC = () => {
  const [formData, setFormData] = useState({
    namaLengkap: '',
    nik: '',
    whatsapp: '',
    email: '',
    tanggal: '',
    namaIslam: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Terima kasih, formulir pendaftaran syahadat Anda telah kami terima. Tim Muallaf Center akan segera menghubungi Anda.');
    setFormData({
      namaLengkap: '',
      nik: '',
      whatsapp: '',
      email: '',
      tanggal: '',
      namaIslam: '',
    });
  };

  return (
    <section className="bg-slate-50 min-h-screen font-sans pb-24">
      {/* Header Blue */}
      <div className="bg-[#1e3a8a] text-white pt-20 pb-32 px-4 text-center relative">
        <div className="w-16 h-16 bg-blue-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
          <HeartHandshake className="w-8 h-8 text-amber-400" />
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold mb-6 font-serif">Muallaf Center</h1>
        <p className="text-sm sm:text-base text-blue-100 max-w-3xl mx-auto text-balance leading-relaxed">
          Lembaga khusus untuk memberikan bantuan, bimbingan syahadat, dan dukungan pembinaan bagi saudara-saudari yang baru memeluk Islam.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
        
        {/* Floating Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
          {[
            {
              icon: <FileText className="w-6 h-6 text-blue-600" />,
              title: "Gratis Tanpa Biaya",
              desc: "Seluruh proses bimbingan dan administrasi tidak dipungut biaya apapun."
            },
            {
              icon: <UserCheck className="w-6 h-6 text-green-600" />,
              title: "Berkah & Terbimbing",
              desc: "InsyaAllah didampingi langsung oleh Ustadz dan Guru bersanad."
            },
            {
              icon: <PhoneCall className="w-6 h-6 text-amber-500" />,
              title: "Layanan Responsif",
              desc: "Tim kami siap membantu menjadwalkan prosesi syahadat Anda."
            },
            {
              icon: <Award className="w-6 h-6 text-purple-600" />,
              title: "Sertifikat Resmi",
              desc: "Mendapatkan sertifikat tanda keislaman untuk dokumen administrasi negara."
            }
          ].map((card, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-6 shadow-xl border border-slate-100 text-center flex flex-col items-center hover:-translate-y-1 transition-transform duration-300">
              <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mb-4 border border-slate-100">
                {card.icon}
              </div>
              <h3 className="font-bold text-slate-800 mb-3 text-[15px]">{card.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed text-balance">
                {card.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Content Section */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          
          {/* Left Column: Info & Persyaratan */}
          <div className="flex-1 lg:w-5/12">
            <h2 className="text-3xl font-bold font-serif text-slate-800 mb-6 leading-snug">Daftar Bimbingan<br/>Syahadat</h2>
            <p className="text-slate-600 text-[15px] leading-relaxed mb-8 text-justify">
              Bagi Anda yang ingin memeluk agama Islam (Bersyahadat), silakan mengisi formulir di samping dengan data yang sebenar-benarnya sesuai KTP.
            </p>

            <div className="bg-blue-50/70 border border-blue-100 rounded-2xl p-6 sm:p-8 mb-10">
              <h4 className="font-bold text-blue-900 mb-5">Persyaratan Administrasi:</h4>
              <ul className="space-y-4">
                {[
                  "Foto Copy KTP / KK / Paspor",
                  "Pas Foto Ukuran 3x4 (2 Lembar)",
                  "Materai Rp 10.000 (2 Lembar)",
                  "Membawa 2 Orang Saksi (Jika ada)"
                ].map((req, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-700">{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-xs font-bold text-slate-400 tracking-wider mb-2 uppercase">Kontak Darurat</p>
              <p className="text-2xl font-bold text-slate-800 mb-1">+62 821-1771-9548</p>
              <p className="text-sm text-slate-500">Tim Muallaf Center</p>
            </div>
          </div>

          {/* Right Column: Registration Form */}
          <div className="flex-1 lg:w-7/12">
            <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 p-8 sm:p-10">
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Nama & NIK */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-2">Nama Lengkap (Sesuai KTP)</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <UserCheck className="h-4 w-4 text-slate-400" />
                      </div>
                      <input 
                        type="text"
                        name="namaLengkap"
                        value={formData.namaLengkap}
                        onChange={handleChange}
                        required
                        placeholder="Masukkan nama lengkap"
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-2">NIK (Nomor Induk Kependudukan)</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <FileText className="h-4 w-4 text-slate-400" />
                      </div>
                      <input 
                        type="text"
                        name="nik"
                        value={formData.nik}
                        onChange={handleChange}
                        required
                        placeholder="16 Digit NIK"
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* Kontak */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-2">No. WhatsApp</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <PhoneCall className="h-4 w-4 text-slate-400" />
                      </div>
                      <input 
                        type="tel"
                        name="whatsapp"
                        value={formData.whatsapp}
                        onChange={handleChange}
                        required
                        placeholder="0812..."
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-2">Email</label>
                    <input 
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="nama@email.com"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
                    />
                  </div>
                </div>

                {/* Rencana Tanggal */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">Rencana Tanggal Prosesi</label>
                  <input 
                    type="date"
                    name="tanggal"
                    value={formData.tanggal}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
                  />
                </div>

                {/* Nama Islam */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">Nama Islam <span className="text-slate-400 font-normal">(Opsional)</span></label>
                  <input 
                    type="text"
                    name="namaIslam"
                    value={formData.namaIslam}
                    onChange={handleChange}
                    placeholder="Jika ingin disiapkan nama baru"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
                  />
                </div>

                {/* Upload Foto */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">Upload Pas Foto 3x4</label>
                  <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:border-blue-400 hover:bg-blue-50 transition-colors cursor-pointer group">
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3 group-hover:bg-white transition-colors">
                      <UploadCloud className="w-6 h-6 text-slate-400 group-hover:text-blue-500" />
                    </div>
                    <p className="text-sm font-semibold text-slate-600 mb-1">Klik untuk Upload Foto</p>
                    <p className="text-xs text-slate-400">Format JPG/PNG. Max 2MB.</p>
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-[#1e3a8a] hover:bg-blue-800 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-[0.98] mt-4"
                >
                  Kirim Pendaftaran
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
