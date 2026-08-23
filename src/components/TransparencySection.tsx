import React, { useState } from 'react';
import { FinancialTransaction, PetugasJadwal, ERPJournalEntry } from '../types';
import { useMasjidStore } from '../lib/store';
import { formatRupiah, formatRupiahFull } from '../lib/islamicUtils';
import {
  TrendingUp,
  TrendingDown,
  PieChart,
  FileText,
  CheckCircle,
  Download,
  Calendar,
  Search,
  UserCheck,
  Wallet
} from 'lucide-react';

interface TransparencySectionProps {
  financials: FinancialTransaction[];
  petugasList: PetugasJadwal[];
  erpJournalEntries?: ERPJournalEntry[];
}

export const TransparencySection: React.FC<TransparencySectionProps> = ({
  financials,
  petugasList,
  erpJournalEntries = []
}) => {
  const { state } = useMasjidStore();
  const settings = state.adminSettings;

  const totalMasuk = financials
    .filter(f => f.type === 'masuk')
    .reduce((sum, f) => sum + f.amount, 0);

  const totalKeluar = financials
    .filter(f => f.type === 'keluar')
    .reduce((sum, f) => sum + f.amount, 0);

  const saldoKas = totalMasuk - totalKeluar;

  const getStartOfWeek = (d: Date) => {
    const date = new Date(d);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(date.setDate(diff)).toISOString().split('T')[0];
  };

  const startOfThisWeek = getStartOfWeek(new Date());
  const keropakTransactions = state.keropakTransactions || [];

  const prevWeekTransactions = keropakTransactions.filter(t => t.date < startOfThisWeek);
  const prevWeekIn = prevWeekTransactions.filter(t => t.type !== 'keluar').reduce((sum, t) => sum + t.amount, 0);
  const prevWeekOut = prevWeekTransactions.filter(t => t.type === 'keluar').reduce((sum, t) => sum + t.amount, 0);
  const saldoMingguLalu = prevWeekIn - prevWeekOut;

  const thisWeekTransactions = keropakTransactions.filter(t => t.date >= startOfThisWeek);
  const thisWeekIn = thisWeekTransactions.filter(t => t.type !== 'keluar').reduce((sum, t) => sum + t.amount, 0);
  const thisWeekOut = thisWeekTransactions.filter(t => t.type === 'keluar').reduce((sum, t) => sum + t.amount, 0);
  const pergerakanMingguIni = thisWeekIn - thisWeekOut;

  const totalSaldoKeropak = saldoMingguLalu + pergerakanMingguIni;
  const penyaluranKeropak = keropakTransactions.filter(t => t.type === 'keluar').sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());



  const nextFriday = petugasList.find(p => p.khatibJumat);

  return (
    <section className="py-16 bg-[#172554] text-blue-100 border-b border-blue-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="bg-blue-500/20 border border-blue-400/40 text-blue-300 text-[9px] font-mono font-bold uppercase tracking-[0.2em] px-3.5 py-1 rounded-full">
            Prinsip Akuntabilitas & Transparansi Realtime
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif text-white">
            Laporan Keuangan & <span className="font-serif italic font-semibold text-amber-300">Audit Transparansi</span>
          </h2>
          <p className="text-blue-100/80 text-xs font-sans">
            Setiap rupiah amanah jamaah tercatat secara terverifikasi dan transparan.
          </p>
        </div>

        {/* Keropak Infaq Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-blue-800/50">
          {settings.showTransKeropakIn !== false && (
            <div className="bg-slate-900/60 border border-blue-900/60 rounded-2xl p-5 shadow-sm relative overflow-hidden">
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-blue-200/60 font-mono font-bold uppercase tracking-[0.15em]">Saldo Keropak Minggu Lalu</span>
                <div className="p-1.5 rounded-md bg-blue-500/10 text-blue-400">
                  <Wallet className="w-4 h-4" />
                </div>
              </div>
              <p className="text-xl sm:text-2xl font-bold font-mono text-blue-400 mt-2">
                {formatRupiahFull(saldoMingguLalu)}
              </p>
              <p className="text-[10px] text-blue-300/50 mt-1 font-mono">Total sisa saldo hingga minggu lalu</p>
            </div>
          )}

          {settings.showTransKeropakOut !== false && (
            <div className="bg-slate-900/60 border border-blue-900/60 rounded-2xl p-5 shadow-sm relative overflow-hidden">
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-blue-200/60 font-mono font-bold uppercase tracking-[0.15em]">Pergerakan Saldo Minggu Ini</span>
                <div className="p-1.5 rounded-md bg-rose-500/10 text-rose-400">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>
              <p className="text-xl sm:text-2xl font-bold font-mono text-rose-400 mt-2">
                {pergerakanMingguIni >= 0 ? '+' : ''}{formatRupiahFull(pergerakanMingguIni)}
              </p>
              <p className="text-[10px] text-blue-300/50 mt-1 font-mono">Pemasukan vs Pengeluaran (Senin - Kini)</p>
            </div>
          )}

          {settings.showTransKeropakSaldo !== false && (
            <div className="bg-slate-800/80 border border-amber-900/30 rounded-2xl p-5 shadow-sm relative overflow-hidden">
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-amber-400/80 font-mono font-bold uppercase tracking-[0.15em]">Total Saldo Keropak Saat Ini</span>
                <div className="p-1.5 rounded-md bg-amber-500/20 text-amber-400">
                  <Wallet className="w-4 h-4" />
                </div>
              </div>
              <p className="text-xl sm:text-2xl font-bold font-mono text-amber-400 mt-2">
                {formatRupiahFull(totalSaldoKeropak)}
              </p>
              <p className="text-[10px] text-amber-200/50 mt-1 font-mono">Saldo Keropak Tersedia Keseluruhan</p>
            </div>
          )}
        </div>

        {/* Tabel Penyaluran Keropak Saja */}
        <div className="space-y-4 pt-6 border-b border-blue-900/30 pb-10">
          <h3 className="text-lg font-serif font-bold text-white mb-2">
            Rincian Penyaluran Keropak Masjid
          </h3>
          <div className="bg-white border border-black/10 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#1A1A1A]">
                <thead className="bg-[#F4F2EA] text-[#1A1A1A]/60 uppercase font-mono text-[10px] font-bold border-b border-black/10">
                  <tr>
                    <th className="p-4">Tanggal</th>
                    <th className="p-4">Uraian Penyaluran</th>
                    <th className="p-4 text-right">Nominal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5">
                  {penyaluranKeropak.map(trx => (
                    <tr key={trx.id} className="hover:bg-stone-50 transition-colors">
                      <td className="p-4 font-mono text-[#1A1A1A]/60 font-medium">{new Date(trx.date).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta', day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) + ' WIB'}</td>
                      <td className="p-4 font-bold text-[#1A1A1A]">{trx.description}</td>
                      <td className="p-4 text-right font-mono font-bold text-sm text-rose-600 whitespace-nowrap">
                        -{formatRupiahFull(trx.amount)}
                      </td>
                    </tr>
                  ))}
                  {penyaluranKeropak.length === 0 && (
                    <tr>
                      <td colSpan={3} className="p-6 text-center text-[#1A1A1A]/50 italic">
                        Belum ada data penyaluran keropak.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Friday Khatib & Imam Highlight Banner */}
        {nextFriday && (
          <div className="bg-[#1e3a8a] bg-gradient-to-r from-[#1e3a8a] via-[#172554] to-[#1e3a8a] text-white border-2 border-amber-400/80 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="space-y-2 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40 text-[10px] font-mono font-bold uppercase tracking-[0.2em]">
                <Calendar className="w-3.5 h-3.5 text-amber-300" /> JADWAL KHATIB & IMAM JUMAT Tazkia SENTUL
              </div>
              <h3 className="text-lg sm:text-xl font-serif text-white">
                "{nextFriday.topikJumat || 'Pentingnya Keberkahan Rezeki dalam ZISWAF'}"
              </h3>
              <p className="text-[10px] text-blue-100/80 font-mono">
                Tanggal: <span className="font-bold text-amber-300">{nextFriday.date} ({nextFriday.dayName})</span>
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 bg-blue-950/90 p-4 rounded-2xl border border-blue-800">
              <div className="text-center sm:text-left">
                <p className="text-[9px] font-mono uppercase tracking-widest text-blue-200/70 font-bold">Khatib Jumat:</p>
                <p className="text-xs font-bold text-amber-300">{nextFriday.khatibJumat}</p>
              </div>
              <div className="text-center sm:text-left sm:border-l border-blue-800 sm:pl-4">
                <p className="text-[9px] font-mono uppercase tracking-widest text-blue-200/70 font-bold">Imam Jumat:</p>
                <p className="text-xs font-bold text-blue-200">{nextFriday.imamJumat}</p>
              </div>
            </div>
          </div>
        )}


      </div>
    </section>
  );
};

