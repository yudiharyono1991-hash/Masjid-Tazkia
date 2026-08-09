import React from 'react';
import { Building2, Banknote, CalendarDays, HeartHandshake, BookOpen, Mail } from 'lucide-react';

export const LayananKamiSection: React.FC = () => {
  return (
    <section className="container mx-auto py-12 md:py-16 px-4 font-sans bg-white">
      <div className="text-center mb-8 md:mb-12">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">Layanan Kami</h2>
        <p className="text-sm md:text-base text-slate-500">Akses mudah untuk kebutuhan jamaah</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6 max-w-5xl mx-auto">
        
        <a className="group bg-white border border-slate-100 rounded-xl md:rounded-2xl p-4 md:p-8 text-center shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer" onClick={(e) => { e.preventDefault(); window.location.hash = 'booking'; }}>
          <div className="bg-amber-100 w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4 text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition">
            <Building2 className="w-6 h-6 md:w-8 md:h-8" />
          </div>
          <h3 className="text-sm md:text-xl font-bold mb-1 md:mb-2 text-slate-900">Sewa Gedung</h3>
          <p className="text-[10px] md:text-sm text-slate-500">Booking Al-Hambra Hall untuk acara.</p>
        </a>

        <a className="group bg-white border border-slate-100 rounded-xl md:rounded-2xl p-4 md:p-8 text-center shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer" onClick={(e) => { e.preventDefault(); window.location.hash = 'program'; }}>
          <div className="bg-blue-100 w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition">
            <Banknote className="w-6 h-6 md:w-8 md:h-8" />
          </div>
          <h3 className="text-sm md:text-xl font-bold mb-1 md:mb-2 text-slate-900">ZISWAF</h3>
          <p className="text-[10px] md:text-sm text-slate-500">Zakat, Infaq & Shodaqoh online.</p>
        </a>

        <a className="group bg-white border border-slate-100 rounded-xl md:rounded-2xl p-4 md:p-8 text-center shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer" onClick={(e) => { e.preventDefault(); window.location.hash = 'jadwal_khatib'; }}>
          <div className="bg-emerald-100 w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition">
            <CalendarDays className="w-6 h-6 md:w-8 md:h-8" />
          </div>
          <h3 className="text-sm md:text-xl font-bold mb-1 md:mb-2 text-slate-900">Agenda</h3>
          <p className="text-[10px] md:text-sm text-slate-500">Kajian & kegiatan masjid.</p>
        </a>

        <a className="group bg-white border border-slate-100 rounded-xl md:rounded-2xl p-4 md:p-8 text-center shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer" onClick={(e) => { e.preventDefault(); window.location.hash = 'muallaf'; }}>
          <div className="bg-purple-100 w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition">
            <HeartHandshake className="w-6 h-6 md:w-8 md:h-8" />
          </div>
          <h3 className="text-sm md:text-xl font-bold mb-1 md:mb-2 text-slate-900">Muallaf Center</h3>
          <p className="text-[10px] md:text-sm text-slate-500">Bimbingan syahadat & iman.</p>
        </a>

        <a className="group bg-white border border-slate-100 rounded-xl md:rounded-2xl p-4 md:p-8 text-center shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer" onClick={(e) => { e.preventDefault(); window.location.hash = 'tpa'; }}>
          <div className="bg-orange-100 w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4 text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition">
            <BookOpen className="w-6 h-6 md:w-8 md:h-8" />
          </div>
          <h3 className="text-sm md:text-xl font-bold mb-1 md:mb-2 text-slate-900">TPA Anak</h3>
          <p className="text-[10px] md:text-sm text-slate-500">Pendaftaran santri baru.</p>
        </a>

        <a className="group bg-white border border-slate-100 rounded-xl md:rounded-2xl p-4 md:p-8 text-center shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer" onClick={(e) => { e.preventDefault(); window.location.hash = 'kontak'; }}>
          <div className="bg-teal-100 w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4 text-teal-600 group-hover:bg-teal-600 group-hover:text-white transition">
            <Mail className="w-6 h-6 md:w-8 md:h-8" />
          </div>
          <h3 className="text-sm md:text-xl font-bold mb-1 md:mb-2 text-slate-900">Hubungi Kami</h3>
          <p className="text-[10px] md:text-sm text-slate-500">Informasi & kotak saran.</p>
        </a>

      </div>
    </section>
  );
};
