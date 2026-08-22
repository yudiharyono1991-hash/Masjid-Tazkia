import React, { useState } from 'react';
import { ProgramCardsSection } from './ProgramCardsSection';
import { 
  ChevronDown, 
  ChevronUp, 
  Wallet, 
  ArrowRight, 
  Heart, 
  Copy, 
  Info,
  Calculator
} from 'lucide-react';

interface ZiswafLandingProps {
  programs: any[];
  adminSettings: any;
  openDonationForProgram: (prog: any) => void;
  onSelectProgramDetail: (prog: any) => void;
  totalCollected: number;
  activeDonors: number;
  totalDisbursed: number;
  efficiencyRate: number;
  openDonationModal: (cat?: string) => void;
  openCalculator: () => void;
  openCatalogPdf: () => void;
  isDark?: boolean;
}

export const ZiswafLandingSection: React.FC<ZiswafLandingProps> = (props) => {
  const [openAccordion, setOpenAccordion] = useState<string | null>('zakat');
  const [calcType, setCalcType] = useState('Zakat Maal (Harta)');
  const [calcAmount, setCalcAmount] = useState('');

  const toggleAccordion = (id: string) => {
    if (openAccordion === id) setOpenAccordion(null);
    else setOpenAccordion(id);
  };

  const handleHitung = (e: React.FormEvent) => {
    e.preventDefault();
    props.openCalculator();
  };

  const accordionItems = [
    {
      id: 'zakat',
      title: 'Zakat',
      icon: <Wallet className="w-6 h-6 text-white" />,
      iconBg: 'bg-blue-600',
      content: 'Zakat adalah harta yang wajib dikeluarkan oleh seorang muslim atau badan usaha untuk diberikan kepada yang berhak menerimanya sesuai dengan syariat Islam.'
    },
    {
      id: 'infaq',
      title: 'Infaq',
      icon: <ArrowRight className="w-6 h-6 text-blue-600" />,
      iconBg: 'bg-blue-100',
      content: 'Infaq berarti mengeluarkan sebagian dari harta atau pendapatan/penghasilan untuk suatu kepentingan yang diperintahkan dalam ajaran Islam.'
    },
    {
      id: 'sedekah',
      title: 'Sedekah',
      icon: <Heart className="w-6 h-6 text-blue-600" />,
      iconBg: 'bg-blue-100',
      content: 'Sedekah maknanya lebih luas dari zakat dan infaq. Sedekah bisa berupa harta, namun bisa juga berupa non-harta (seperti senyum, tenaga, atau ilmu).'
    },
    {
      id: 'wakaf',
      title: 'Wakaf',
      icon: <Copy className="w-6 h-6 text-blue-600" />,
      iconBg: 'bg-blue-100',
      content: 'Wakaf adalah menahan harta yang dapat dimanfaatkan tanpa lenyap bendanya, dengan cara tidak melakukan tindakan hukum terhadap benda tersebut, untuk disalurkan kebaikannya.'
    }
  ];

  return (
    <div className="bg-white min-h-screen pb-0 font-sans">
      
      {/* 1. Hero Section */}
      <div className="relative w-full min-h-[300px] md:min-h-[400px] lg:min-h-[500px] bg-gray-900 overflow-hidden flex items-center justify-center">
        <img 
          src="https://assets.pikiran-rakyat.com/crop/0x0:0x0/1200x675/photo/2024/09/07/4221350838.jpg" 
          alt="Masjid Tazkia" 
          className="absolute inset-0 w-full h-full object-cover opacity-85"
        />
        <div className="absolute inset-0 bg-blue-900/40 mix-blend-multiply" />
        <div className="relative z-10 flex flex-col items-center justify-center text-center text-white px-4 md:px-8 w-full max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold mb-4 drop-shadow-lg tracking-wider break-words">
            ZISWAF CENTER
          </h1>
          <p className="text-base md:text-xl font-medium max-w-2xl drop-shadow-md text-blue-50 leading-relaxed">
            Menghimpun Kebaikan, Memberdayakan Umat melalui Zakat, Infaq, Sedekah, dan Wakaf.
          </p>
        </div>
      </div>

      {/* 2. Tentang ZISWAF */}
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="absolute -inset-4 bg-blue-100 rounded-3xl -z-10 transform -rotate-3"></div>
            <img 
              src="https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?q=80&w=800&auto=format&fit=crop" 
              alt="Kotak Amal" 
              className="rounded-2xl shadow-xl w-full h-auto object-cover aspect-[4/3] relative z-10"
            />
          </div>
          <div>
            <span className="text-blue-600 font-bold tracking-widest text-sm uppercase mb-2 block">
              Tentang Kami
            </span>
            <h2 className="text-3xl font-bold text-slate-900 mb-6 leading-snug">
              Kelola Harta dengan Berkah di Masjid Tazkia
            </h2>
            <p className="text-slate-600 leading-relaxed mb-6 text-[15px]">
              Masjid Tazkia tidak hanya menjadi tempat ibadah, tetapi juga pusat pemberdayaan ekonomi umat. Melalui unit pengumpul ZISWAF, kami berkomitmen menyalurkan dana Anda secara transparan, amanah, dan tepat sasaran.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                <h4 className="font-bold text-blue-900 text-lg mb-1">Terpercaya</h4>
                <p className="text-sm text-blue-700">Laporan keuangan transparan.</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                <h4 className="font-bold text-blue-900 text-lg mb-1">Tepat Sasaran</h4>
                <p className="text-sm text-blue-700">Disalurkan langsung ke mustahik.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Mengenal ZISWAF (Accordion) */}
      <div className="bg-slate-50 py-16 border-y border-slate-200">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-10">Mengenal ZISWAF</h2>
          <div className="space-y-4">
            {accordionItems.map((item) => (
              <div key={item.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm transition-all">
                <button 
                  onClick={() => toggleAccordion(item.id)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50 transition"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${item.iconBg}`}>
                      {item.icon}
                    </div>
                    <span className="font-bold text-lg text-slate-800">{item.title}</span>
                  </div>
                  {openAccordion === item.id ? (
                    <ChevronUp className="text-slate-400 w-6 h-6" />
                  ) : (
                    <ChevronDown className="text-slate-400 w-6 h-6" />
                  )}
                </button>
                {openAccordion === item.id && (
                  <div className="p-5 pt-0 text-slate-600 border-t border-slate-100 bg-blue-50/30 text-[15px] leading-relaxed">
                    {item.content}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Hitung Zakat Anda */}
      <div className="container mx-auto px-4 py-16 max-w-5xl">
        <div className="grid md:grid-cols-2 gap-0 shadow-2xl rounded-3xl overflow-hidden">
          <div className="bg-white p-8 md:p-10 border-r border-slate-100">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Hitung Zakat Anda</h2>
            <form onSubmit={handleHitung} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Jenis Zakat</label>
                <select 
                  value={calcType}
                  onChange={(e) => setCalcType(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-3 text-slate-700 focus:ring-2 focus:ring-blue-600 outline-none"
                >
                  <option value="Zakat Maal (Harta)">Zakat Maal (Harta)</option>
                  <option value="Zakat Penghasilan">Zakat Penghasilan</option>
                  <option value="Zakat Emas/Perak">Zakat Emas/Perak</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Nominal Penghasilan / Harta</label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-slate-500 font-bold">Rp</span>
                  <input 
                    type="number" 
                    value={calcAmount}
                    onChange={(e) => setCalcAmount(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-3 pl-11 text-slate-900 font-bold focus:ring-2 focus:ring-blue-600 outline-none" 
                    placeholder="0" 
                  />
                </div>
                <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
                  <Info className="w-3 h-3" />
                  Nisab Zakat Maal saat ini: Rp 85.000.000 (estimasi Emas 85g)
                </p>
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition shadow-lg active:scale-95">
                Hitung Zakat
              </button>
            </form>
          </div>
          <div className="bg-[#1e3a8a] p-8 md:p-10 text-white flex flex-col justify-center">
            <div className="text-center opacity-80">
              <Calculator className="w-16 h-16 mx-auto mb-6 opacity-50" />
              <p className="text-lg leading-relaxed max-w-sm mx-auto">
                Silakan isi form di samping untuk menghitung kewajiban zakat Anda menggunakan sistem Kalkulator Zakat cerdas kami.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Program Wakaf Unggulan -> We use the dynamic ProgramCardsSection here! */}
      <div className="bg-slate-50 py-16 border-y border-slate-200">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Program Wakaf Unggulan</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Investasi abadi untuk akhirat. Salurkan wakaf dan infaq Anda untuk pembangunan infrastruktur dan fasilitas umat.
            </p>
          </div>
          
          {/* Meng-embed komponen ProgramCardsSection yang sebelumnya terpisah */}
          <div className="mt-[-40px]"> {/* Negatif margin karena komponen ProgramCardsSection punya padding sendiri */}
            <ProgramCardsSection
              programs={props.programs}
              adminSettings={props.adminSettings}
              openDonationForProgram={props.openDonationForProgram}
              onSelectProgramDetail={props.onSelectProgramDetail}
              totalCollected={props.totalCollected}
              activeDonors={props.activeDonors}
              totalDisbursed={props.totalDisbursed}
              efficiencyRate={props.efficiencyRate}
              openDonationModal={props.openDonationModal}
              openCalculator={props.openCalculator}
              openCatalogPdf={props.openCatalogPdf}
              isDark={false} /* Memaksa mode terang agar sesuai benchmark Ziswaf */
              hideHeader={true} /* Custom prop jika ada, atau kita bungkus saja */
            />
          </div>
        </div>
      </div>

      {/* 6. Jejak Kebaikan Anda (Gallery) */}
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <h2 className="text-3xl font-bold text-center text-slate-900 mb-10">Jejak Kebaikan Anda</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((num) => (
            <div key={num} className="aspect-square rounded-xl overflow-hidden shadow-md bg-slate-200 hover:opacity-90 transition cursor-pointer group">
              <img 
                src={`https://placehold.co/400x400?text=Kegiatan+${num}`} 
                alt={`Kegiatan ${num}`} 
                className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
              />
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
