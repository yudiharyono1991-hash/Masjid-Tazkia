import React, { useState } from 'react';
import { 
  Facebook, 
  Instagram, 
  Youtube, 
  Copy,
  Check,
  Twitter,
  Globe,
  Linkedin,
  MessageCircle
} from 'lucide-react';
import { useMasjidStore } from '../lib/store';

interface FooterProps {
  // Keeping props just in case they are passed, but we won't use them for the new static layout
  openDonationModal?: () => void;
  openCalculator?: () => void;
  openDigitalIbadah?: (tab?: 'quran' | 'salat' | 'kiblat') => void;
  openTvMode?: () => void;
  session?: any;
  isDark?: boolean;
}

export const Footer: React.FC<FooterProps> = () => {
  const [copied, setCopied] = useState(false);
  const store = useMasjidStore();
  const adminSettings = store.state.adminSettings;
  const socialLinks = adminSettings?.socialMediaLinks || [];

  const getIcon = (platform: string) => {
    const p = platform.toLowerCase();
    if (p.includes('facebook')) return <Facebook className="w-5 h-5" />;
    if (p.includes('instagram')) return <Instagram className="w-5 h-5" />;
    if (p.includes('youtube')) return <Youtube className="w-5 h-5" />;
    if (p.includes('twitter') || p.includes('x')) return <Twitter className="w-5 h-5" />;
    if (p.includes('linkedin')) return <Linkedin className="w-5 h-5" />;
    if (p.includes('whatsapp') || p.includes('telegram')) return <MessageCircle className="w-5 h-5" />;
    return <Globe className="w-5 h-5" />;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText('7075678899');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <footer className="bg-slate-900 text-slate-300 pt-14 pb-6 font-sans">
      <div className="mx-auto max-w-6xl px-6 grid grid-cols-1 md:grid-cols-3 gap-10">
        
        {/* Kolom 1: Tentang Kami */}
        <div>
          <h3 className="text-white text-lg font-bold mb-4 border-b-2 border-amber-500 inline-block pb-1">
            TENTANG KAMI
          </h3>
          <p className="text-sm leading-relaxed mb-6 text-slate-400">
            Masjid Tazkia Islamic Center hadir sebagai pusat peradaban dan ibadah, mengedepankan nilai spiritualitas dan pendidikan Al-Qur'an.
          </p>
          <div className="flex gap-4 flex-wrap">
            {socialLinks.map((link) => (
              <a 
                key={link.id} 
                href={link.url} 
                target="_blank" 
                rel="noopener noreferrer"
                title={link.platform}
                className="bg-slate-800 p-2.5 rounded-lg hover:bg-slate-700 transition text-slate-300 hover:text-white border border-slate-700 hover:border-slate-500"
              >
                {getIcon(link.platform)}
              </a>
            ))}
            {socialLinks.length === 0 && (
              <span className="text-xs text-slate-500 italic">Belum ada tautan media sosial.</span>
            )}
          </div>
        </div>

        {/* Kolom 2: Tautan Cepat */}
        <div>
          <h3 className="text-white text-lg font-bold mb-4 border-b-2 border-amber-500 inline-block pb-1">
            TAUTAN CEPAT
          </h3>
          <ul className="space-y-3 text-sm text-slate-400 font-medium">
            <li>
              <button onClick={() => { window.location.hash = 'booking'; window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-amber-500 transition flex items-center gap-2">
                <span className="text-amber-500/50">»</span> Cek Ketersediaan Gedung
              </button>
            </li>
            <li>
              <button onClick={() => { window.location.hash = 'muallaf'; window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-amber-500 transition flex items-center gap-2">
                <span className="text-amber-500/50">»</span> Muallaf Center
              </button>
            </li>
            <li>
              <button onClick={() => { window.location.hash = 'tpa'; window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-amber-500 transition flex items-center gap-2">
                <span className="text-amber-500/50">»</span> Program TPA
              </button>
            </li>
            <li>
              <button onClick={() => { window.location.hash = 'program'; window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-amber-500 transition flex items-center gap-2">
                <span className="text-amber-500/50">»</span> Salurkan Infaq
              </button>
            </li>
          </ul>
        </div>

        {/* Kolom 3: Salurkan Infaq */}
        <div>
          <h3 className="text-white text-lg font-bold mb-4 border-b-2 border-amber-500 inline-block pb-1">
            SALURKAN INFAQ
          </h3>
          <div className="bg-slate-800 p-5 rounded-xl border-l-4 border-amber-500 space-y-3 shadow-lg">
            <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Bank Syariah Indonesia (BSI)</p>
            <p className="text-2xl font-bold text-white tracking-widest font-mono">707 567 8899</p>
            <p className="text-[11px] text-slate-400 font-medium">A.N MASJID TAZKIA / YYS PUSAT ISLAM ANDALUSIA</p>
            <button 
              onClick={copyToClipboard}
              className={`w-full flex items-center justify-center gap-2 text-sm font-bold py-2.5 rounded-lg transition-all mt-2
                ${copied ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-slate-700 hover:bg-slate-600 text-white'}`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Berhasil Disalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Salin Nomor Rekening</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
      
      {/* Footer Bottom */}
      <div className="border-t border-slate-800 mt-12 pt-6">
        <div className="mx-auto max-w-6xl px-6 flex flex-col items-center justify-center text-xs text-slate-500 space-y-2">
          <p className="font-semibold text-slate-400 text-[11px] sm:text-xs">
            &copy; 2026 Masjid Tazkia Islamic Center. All Rights Reserved.
          </p>
          <p className="text-[10px] text-slate-600">
            Jl. Ir. H. Djuanda No. 78 Sentul City, Bogor Indonesia
          </p>
        </div>
      </div>
    </footer>
  );
};
