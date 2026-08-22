import React from 'react';
import { Program } from '../types';
import { formatRupiahFull } from '../lib/islamicUtils';
import { X, Heart, Users, Target, ShieldCheck, CheckCircle2, Sparkles, MapPin, Calendar, Share2 } from 'lucide-react';

interface ProgramDetailModalProps {
  program: Program;
  onClose: () => void;
  onDonate: (program: Program) => void;
}

export const ProgramDetailModal: React.FC<ProgramDetailModalProps> = ({
  program,
  onClose,
  onDonate
}) => {
  const percentage = Math.min(100, Math.round((program.collectedAmount / program.targetAmount) * 100));

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: program.title,
        text: `${program.title} - ${program.subtitle}. Mari berwakaf & berinfaq melalui DKM Masjid Tazkia.`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Tautan program berhasil disalin ke papan klip!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-blue-950/80 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[#172554] border border-blue-800 rounded-3xl shadow-2xl overflow-hidden my-8 text-blue-100">
        
        {/* Header Image with Overlay */}
        <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-blue-950">
          <img
            src={program.imageUrl}
            alt={program.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[#172554] bg-gradient-to-t from-[#172554] via-[#172554]/50 to-transparent" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-blue-950/80 hover:bg-blue-950 text-white p-2.5 rounded-full border border-blue-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Share Button */}
          <button
            onClick={handleShare}
            className="absolute top-4 left-4 bg-blue-950/80 hover:bg-blue-950 text-amber-300 p-2.5 rounded-full border border-blue-700 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-bold px-3.5"
          >
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline">Bagikan</span>
          </button>

          {/* Badges */}
          <div className="absolute bottom-4 left-6 right-6 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="bg-blue-600 text-white font-mono text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full shadow-lg border border-blue-400/40">
                {program.category}
              </span>
              {program.isUrgent && (
                <span className="bg-rose-600 text-white font-mono text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full shadow-lg animate-pulse">
                  Urgent / Prioritas
                </span>
              )}
            </div>
            <span className="text-xs font-mono text-blue-300 bg-blue-950/90 px-3 py-1 rounded-full border border-blue-500/40 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
              100% Diawasi DKM
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[60vh] overflow-y-auto">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold font-serif text-white leading-tight">
              {program.title}
            </h2>
            <p className="text-amber-300 font-mono text-xs sm:text-sm mt-1">
              {program.subtitle}
            </p>
          </div>

          {/* Progress Card */}
          <div className="bg-blue-950 border border-blue-800 p-5 rounded-2xl space-y-3">
            <div className="flex justify-between items-baseline">
              <div>
                <span className="text-xs text-blue-200/70 block font-mono uppercase">Terkumpul:</span>
                <span className="text-lg sm:text-xl font-bold font-mono text-blue-300">
                  {formatRupiahFull(program.collectedAmount)}
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs text-blue-200/70 block font-mono uppercase">Target DKM:</span>
                <span className="text-sm font-bold font-mono text-blue-100">
                  {formatRupiahFull(program.targetAmount)}
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-blue-900 h-3 rounded-full overflow-hidden p-0.5 border border-blue-700">
              <div
                className="bg-amber-400 bg-gradient-to-r from-amber-400 to-blue-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${percentage}%` }}
              />
            </div>

            <div className="flex justify-between items-center text-xs text-blue-200/80 font-mono pt-1">
              <span className="flex items-center gap-1.5 text-blue-300 font-bold">
                <Target className="w-4 h-4 text-amber-300" />
                Capaian: {percentage}%
              </span>
              <span className="flex items-center gap-1.5 text-amber-300 font-bold">
                <Users className="w-4 h-4" />
                {program.donorsCount} Muwakif / Donatur
              </span>
            </div>
          </div>

          {/* Rich Description */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold font-mono uppercase tracking-widest text-blue-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Deskripsi & Rencana Alokasi Program</span>
            </h3>
            
            <p className="text-blue-100/90 text-sm leading-relaxed whitespace-pre-line font-sans">
              {program.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="bg-blue-950 p-3.5 rounded-xl border border-blue-800 flex items-start gap-3">
                <MapPin className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs text-blue-200/70 block font-mono uppercase">Lokasi Pelaksanaan:</span>
                  <span className="text-xs font-bold text-white">Kompleks Masjid Tazkia</span>
                </div>
              </div>

              <div className="bg-blue-950 p-3.5 rounded-xl border border-blue-800 flex items-start gap-3">
                <Calendar className="w-5 h-5 text-blue-300 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs text-blue-200/70 block font-mono uppercase">Penyaluran ZISWAF:</span>
                  <span className="text-xs font-bold text-white">Berkala & Dilaporkan di Portal DKM</span>
                </div>
              </div>
            </div>
          </div>

          {/* Guarantees */}
          <div className="bg-blue-950 border border-blue-700/60 p-4 rounded-xl space-y-2">
            <h4 className="text-xs font-bold text-amber-300 font-mono uppercase flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-blue-300" />
              <span>Jaminan Pengelolaan Syariah & Transparansi:</span>
            </h4>
            <ul className="text-xs text-blue-100/90 space-y-1 list-disc list-inside">
              <li>100% dana disalurkan langsung sesuai akad {program.category.toUpperCase()}.</li>
              <li>Laporan keuangan auditable dapat diakses publik di menu Buku Besar PSAK 409.</li>
              <li>Setiap donasi terbit kwitansi digital resmi ber-QR Code transaksi.</li>
            </ul>
          </div>
        </div>

        {/* Modal Footer CTA */}
        <div className="p-6 bg-blue-950 border-t border-blue-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <span className="text-[11px] text-blue-200/70 block font-mono">Pahala Mengalir Tiada Putus</span>
            <span className="text-xs font-bold text-amber-300">Mari Berpartisipasi Sekarang</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="px-5 py-3 rounded-2xl text-xs font-bold text-blue-200 hover:text-white transition-colors cursor-pointer"
            >
              Tutup
            </button>
            <button
              onClick={() => {
                onClose();
                onDonate(program);
              }}
              className="flex-1 sm:flex-none bg-amber-400 bg-gradient-to-r from-amber-400 to-blue-500 hover:from-amber-300 hover:to-blue-400 text-blue-950 font-extrabold px-6 py-3 rounded-2xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg transition-transform active:scale-95 border border-amber-300/40"
            >
              <Heart className="w-4 h-4 fill-blue-950" />
              <span>Bantu Donasi / Salurkan Sekarang</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

