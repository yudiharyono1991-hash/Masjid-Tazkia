import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Info, CheckCircle2, Quote } from 'lucide-react';

export const ProfilTazkiaSection: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    if (openFaq === index) setOpenFaq(null);
    else setOpenFaq(index);
  };

  const faqs = [
    {
      q: 'Dimana lokasi Masjid Tazkia?',
      a: 'Masjid Tazkia berlokasi di Jl. Ir. H. Djuanda No. 78, Sentul City, Citaringgul, Kec. Babakan Madang, Kabupaten Bogor, Jawa Barat 16810. Berlokasi di komplek Tazkia bersama dengan Kampus Universitas Tazkia, sangat strategis dan mudah diakses dari pintu tol Sentul Selatan dan pintu tol Bogor.'
    },
    {
      q: 'Apa saja fasilitasnya?',
      a: 'Masjid Tazkia merupakan masjid berkhidmat dengan fasilitas yang lengkap dan modern untuk mendukung ibadah, edukasi, dan pelayanan umat. Dilengkapi ruang utama ibadah yang nyaman, aula serbaguna, area parkir luas, ruang dan area bermain anak, fasilitas wudhu dan toilet modern, perpustakaan, klinik masjid, hingga guest house syariah. Masjid Tazkia juga menyediakan pusat informasi (ATIC Room), minimarket dan book store, studio masjid, ruang DKM, ruang imam, serta berbagai ikon edukatif seperti miniatur Ka\'bah dan kaligrafi Al-Qur\'an. Seluruh fasilitas dirancang untuk menciptakan lingkungan masjid yang bersih, ramah keluarga, dan memberdayakan umat.'
    },
    {
      q: 'Apakah Ramah Disabilitas?',
      a: 'Masjid Tazkia dirancang dengan konsep inklusif. Kami menyediakan jalur kursi roda (ramp), lift khusus difabel dan lansia, toilet khusus difabel, dan area sholat yang mudah diakses bagi jamaah berkebutuhan khusus.'
    },
    {
      q: 'Apa saja kegiatan rutin yang diselenggarakan?',
      a: 'Masjid Tazkia menyelenggarakan berbagai kegiatan rutin sepanjang pekan yang terbuka untuk umum, meliputi kajian keislaman, kelas tahsin Al-Quran, TPA, olahraga, hingga kegiatan sosial. Kegiatan dilaksanakan dari Senin hingga Ahad dengan jadwal teratur, seperti kajian muslimah, kajian rutin KOPI MANTUL, buka puasa sunnah, shalat Jumat berjamaah, distribusi Jumat Berkah, serta kajian bulanan bersama para asatidz dan tokoh nasional. Seluruh program dirancang untuk membina keimanan, pendidikan, kebersamaan, dan kesehatan jamaah.'
    },
    {
      q: 'Bagaimana cara menyalurkan donasi?',
      a: 'Anda dapat menyalurkan Zakat, Infaq, dan Wakaf melalui transfer ke rekening BSI 7075678899 a.n. Yayasan Pusat Islam Andalusia, atau datang langsung ke kantor layanan kami. Untuk info selengkapnya, silakan hubungi admin masjid melalui WhatsApp di +62 858 1000 8899 | +62 821 1771 9548.'
    }
  ];

  return (
    <div className="bg-white min-h-screen pb-20 font-sans">
      
      {/* 1. Hero Section */}
      <div className="bg-blue-900 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')]"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <span className="text-blue-300 font-bold tracking-widest uppercase text-sm mb-2 block">Tentang Kami</span>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 font-serif">Mengenal Masjid Tazkia</h1>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto leading-relaxed">
            Menjadi Oase Spiritual, Intelektual dan Pemberdayaan finansial umat yang berdasarkan nilai-nilai luhur Islam.
          </p>
        </div>
      </div>

      {/* 2. Sejarah & Latar Belakang */}
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-slate-800">Sejarah & Latar Belakang</h2>
            <p className="text-slate-600 leading-relaxed text-lg text-justify">
              Andalusia Islamic Center hadir karena kepedulian akan masalah besar bangsa dan ummat Islam Indonesia yang didominasi oleh kemiskinan, keterbelakangan Pendidikan serta rendahnya moralitas baik di tingkat birokrasi maupun swasta. Besar harapan kami dengan segala kekurangan, Andalusia Islamic Center dapat menjadi Oase Spiritual, Intelektual dan Pemberdayaan finansial ummat yang berlandaskan nilai-nilai luhur spiritual Islam.
            </p>
            <p className="text-slate-600 leading-relaxed text-lg text-justify">
              Sejak pendiriannya tahun 2008 oleh Prof. Dr. Syafii Antonio, M.Ec. Andalusia Islamic Center telah berkiprah dalam bidang sosial, dakwah dan pemberdayaan ekonomi yang meliputi:
            </p>
            <div className="bg-blue-50 border-l-4 border-blue-600 p-4 italic text-slate-700 space-y-1">
              <p>1. Sarana Ibadah</p>
              <p>2. Kajian Ke-Islaman harian, mingguan, dan bulanan</p>
              <p>3. Program Tahfidz untuk berbagai umur</p>
              <p>4. Pemberdayaan ekonomi mikro</p>
              <p>5. Santunan Yatim dan dhuafa</p>
              <p>6. Pembinaan muallaf</p>
              <p>7. Peringatan hari besar Islam</p>
            </div>
          </div>
          <div className="w-full aspect-video bg-slate-200 rounded-2xl overflow-hidden shadow-xl">
            <iframe 
              className="w-full h-full" 
              src="https://www.youtube.com/embed/-oT4ZYK2ZjI?si=bSBAo_OW7rpSJw9O" 
              title="Profil Masjid Tazkia" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen 
            />
          </div>
        </div>
      </div>

      {/* 3. Visi & Misi */}
      <div className="bg-slate-50 py-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-10">
            {/* Visi */}
            <div className="bg-white p-10 rounded-3xl shadow-lg border-t-8 border-blue-600">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6 text-blue-600">
                <Info className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-4">Visi</h3>
              <p className="text-slate-600 text-lg leading-relaxed">
                Menjadi Oase Spiritual dan Intelektual Islam yang memberikan pencerahan, kesejukan dan pemberdayaan serta wawasan Rahmatan Lil Alamin.
              </p>
            </div>
            {/* Misi */}
            <div className="bg-white p-10 rounded-3xl shadow-lg border-t-8 border-amber-500">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-6 text-amber-600">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-4">Misi</h3>
              <ul className="space-y-4 text-slate-600 leading-relaxed text-lg">
                <li className="flex gap-3">
                  <span className="mt-1 text-amber-500">❖</span>
                  <span>Menyelenggarakan pelatihan dan konseling keumatan.</span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-1 text-amber-500">❖</span>
                  <span>Mengembangkan ekonomi kerakyatan berbasis syariah.</span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-1 text-amber-500">❖</span>
                  <span>Membina para muallaf agar istiqomah.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Tokoh: Dewan Pembina Yayasan */}
      <div className="container mx-auto px-4 py-20 max-w-5xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-blue-900">Dewan Pembina Yayasan</h2>
          <div className="w-20 h-1 bg-blue-600 mx-auto mt-4 rounded-full"></div>
        </div>
        <div className="flex flex-col md:flex-row gap-10 bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-100">
          <div className="md:w-1/3 min-h-[420px] relative overflow-hidden bg-slate-200">
            <img 
              src="https://www.masjidtazkia.com/msa.png" 
              alt="Prof. Dr. M. Syafii Antonio" 
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
            <div className="absolute bottom-0 left-0 w-full bg-blue-900 bg-gradient-to-t from-blue-900 via-blue-900/70 to-transparent p-6 pt-24">
              <h3 className="text-white text-xl font-bold">Prof. Dr. M. Syafii Antonio</h3>
              <p className="text-blue-200 text-sm">Ketua Dewan Pembina</p>
            </div>
          </div>
          <div className="md:w-2/3 p-8 md:p-12 flex flex-col justify-center">
            <Quote className="text-blue-100 w-10 h-10 mb-4" />
            <div className="text-slate-600 leading-relaxed space-y-4 text-justify text-lg">
              <p>Lahir di Sukabumi, 12 Mei 1965. Beliau adalah tokoh ekonomi syariah Indonesia yang memiliki latar belakang perjalanan spiritual yang unik dan inspiratif.</p>
              <p>Tumbuh di lingkungan keluarga yang majemuk, beliau mengenal ajaran Islam melalui interaksi sosial sejak kecil. Ketertarikannya pada cara ibadah umat Islam membawanya pada pencarian kebenaran, hingga akhirnya memutuskan untuk bersyahadat.</p>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Tokoh: Direktur Masjid */}
      <div className="container mx-auto px-4 py-20 max-w-5xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-blue-900">Direktur Masjid Tazkia Islamic Center</h2>
          <div className="w-20 h-1 bg-blue-600 mx-auto mt-4 rounded-full"></div>
        </div>
        <div className="flex flex-col md:flex-row gap-10 bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-100">
          <div className="md:w-1/3 min-h-[420px] relative overflow-hidden bg-slate-200">
            <img 
              src="https://www.masjidtazkia.com/syarif.png" 
              alt="Syaripudin Kusin" 
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
            <div className="absolute bottom-0 left-0 w-full bg-blue-900 bg-gradient-to-t from-blue-900 via-blue-900/70 to-transparent p-6 pt-24">
              <h3 className="text-white text-xl font-bold">Syaripudin Kusin</h3>
              <p className="text-blue-200 text-sm">Direktur</p>
            </div>
          </div>
          <div className="md:w-2/3 p-8 md:p-12 flex flex-col justify-center">
            <Quote className="text-blue-100 w-10 h-10 mb-4" />
            <div className="text-slate-600 leading-relaxed space-y-4 text-justify text-lg">
              <p>Direktur Operasional Masjid Tazkia adalah sosok profesional yang amanah dan berpengalaman luas dalam pengelolaan keuangan, audit, dan tata kelola organisasi. Dengan pengalaman lebih dari dua dekade di berbagai perusahaan dan lembaga, beliau berperan memastikan operasional masjid berjalan secara efektif, transparan, dan sesuai prinsip syariah.</p>
              <p>Berkomitmen menjadikan masjid sebagai pusat ibadah, pendidikan, dan pemberdayaan umat, beliau mengedepankan nilai keikhlasan, profesionalisme, serta pelayanan terbaik bagi jamaah.</p>
            </div>
          </div>
        </div>
      </div>

      {/* 6. Tokoh: Ketua DKM */}
      <div className="container mx-auto px-4 py-20 max-w-5xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-blue-900">Ketua DKM Masjid Tazkia Islamic Center</h2>
          <div className="w-20 h-1 bg-blue-600 mx-auto mt-4 rounded-full"></div>
        </div>
        <div className="flex flex-col md:flex-row gap-10 bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-100">
          <div className="md:w-1/3 min-h-[420px] relative overflow-hidden bg-slate-200">
            <img 
              src="https://www.masjidtazkia.com/mughni.png" 
              alt="Abdul Mughni" 
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
            <div className="absolute bottom-0 left-0 w-full bg-blue-900 bg-gradient-to-t from-blue-900 via-blue-900/70 to-transparent p-6 pt-24">
              <h3 className="text-white text-xl font-bold">Abdul Mughni</h3>
              <p className="text-blue-200 text-sm">Ketua DKM Masjid Tazkia Islamic Center</p>
            </div>
          </div>
          <div className="md:w-2/3 p-8 md:p-12 flex flex-col justify-center">
            <Quote className="text-blue-100 w-10 h-10 mb-4" />
            <div className="text-slate-600 leading-relaxed space-y-4 text-justify text-lg">
              <p>Ketua DKM Masjid Tazkia adalah pemimpin yang amanah dan berkomitmen dalam memakmurkan masjid sebagai pusat ibadah, dakwah, dan pemberdayaan umat.</p>
              <p>Dengan mengedepankan nilai keikhlasan, kebersamaan, dan profesionalisme, beliau membina pengelolaan masjid yang transparan, inklusif, serta berlandaskan Al-Quran dan Sunnah, demi menghadirkan pelayanan terbaik bagi jamaah dan masyarakat luas.</p>
            </div>
          </div>
        </div>
      </div>

      {/* 7. Lokasi & FAQ */}
      <div className="bg-slate-50 py-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            
            {/* Lokasi Maps */}
            <div>
              <h2 className="text-3xl font-bold text-slate-800 mb-6">Lokasi Kami</h2>
              <div className="bg-white p-2 rounded-2xl shadow-lg">
                <div className="w-full h-[400px] rounded-xl overflow-hidden relative bg-slate-200">
                  <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d990.9069227701355!2d106.84652572440532!3d-6.568586077026603!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69c5c7454f73ad%3A0xe97be09b6d59fa08!2sMasjid%20Tazkia%20Islamic%20Center%20(d%2Fh%20Andalusia)!5e0!3m2!1sid!2sid!4v1767541100157!5m2!1sid!2sid" 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }} 
                    allowFullScreen 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade" 
                    title="Lokasi Masjid Tazkia"
                  />
                </div>
              </div>
            </div>

            {/* FAQ */}
            <div>
              <h2 className="text-3xl font-bold text-slate-800 mb-6">Pertanyaan yang sering diajukan</h2>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div key={index} className="bg-white rounded-xl transition-all duration-300 border shadow-sm border-slate-100">
                    <button 
                      className="w-full flex justify-between items-center p-5 text-left focus:outline-none"
                      onClick={() => toggleFaq(index)}
                    >
                      <span className="font-bold text-lg text-slate-700">{faq.q}</span>
                      {openFaq === index ? (
                        <ChevronUp className="text-slate-400 w-6 h-6 shrink-0" />
                      ) : (
                        <ChevronDown className="text-slate-400 w-6 h-6 shrink-0" />
                      )}
                    </button>
                    {openFaq === index && (
                      <div className="px-5 pb-5 text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
                        <p>{faq.a}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
};
