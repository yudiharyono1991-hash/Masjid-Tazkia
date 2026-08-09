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
  const [filterType, setFilterType] = useState<'semua' | 'masuk' | 'keluar'>('semua');
  const [search, setSearch] = useState<string>('');

  const totalMasuk = financials
    .filter(f => f.type === 'masuk')
    .reduce((sum, f) => sum + f.amount, 0);

  const totalKeluar = financials
    .filter(f => f.type === 'keluar')
    .reduce((sum, f) => sum + f.amount, 0);

  const saldoKas = totalMasuk - totalKeluar;

  const keropakMasuk = erpJournalEntries
    .filter(e => e.accountId === 'coa-4106' && e.type === 'Credit')
    .reduce((sum, e) => sum + e.amount, 0);

  const keropakKeluar = erpJournalEntries
    .filter(e => e.accountId === 'coa-5105' && e.type === 'Debit')
    .reduce((sum, e) => sum + e.amount, 0);

  const saldoKeropak = keropakMasuk - keropakKeluar;

  const filteredFinancials = financials.filter(f => {
    const matchesType = filterType === 'semua' || f.type === filterType;
    const matchesSearch = f.title.toLowerCase().includes(search.toLowerCase()) ||
                          f.category.toLowerCase().includes(search.toLowerCase());
    return matchesType && matchesSearch;
  });

  const nextFriday = petugasList.find(p => p.khatibJumat);

  return (
    <section className="py-16 bg-[#172554] text-blue-100 border-b border-blue-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="bg-blue-500/20 border border-blue-400/40 text-blue-300 text-[10px] font-mono font-bold uppercase tracking-[0.2em] px-3.5 py-1 rounded-full">
            Prinsip Akuntabilitas & Transparansi Realtime
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif text-white">
            Laporan Keuangan & <span className="font-serif italic font-semibold text-amber-300">Audit Transparansi</span>
          </h2>
          <p className="text-blue-100/80 text-xs sm:text-sm font-sans">
            Setiap rupiah amanah ZISWAF tercatat secara terverifikasi dan transparan untuk pertanggungjawaban publik umat.
          </p>
        </div>

        {/* Financial Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {settings.showTransZiswaf !== false && (
            <div className="bg-blue-950/80 border border-blue-800 rounded-2xl p-6 shadow-md relative overflow-hidden">
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-blue-200/70 font-mono font-bold uppercase tracking-[0.2em]">Pemasukan ZISWAF</span>
                <div className="p-2 rounded-lg bg-blue-500/20 text-blue-300">
                  <TrendingUp className="w-5 h-5" />
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-bold font-mono text-blue-300 mt-3">
                {formatRupiahFull(totalMasuk)}
              </p>
              <p className="text-[11px] text-blue-200/60 mt-1 font-mono">Zakat, Infaq, Shadaqah & Wakaf</p>
            </div>
          )}

          {settings.showTransPengeluaran !== false && (
            <div className="bg-blue-950/80 border border-blue-800 rounded-2xl p-6 shadow-md relative overflow-hidden">
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-blue-200/70 font-mono font-bold uppercase tracking-[0.2em]">Pengeluaran & Penyaluran</span>
                <div className="p-2 rounded-lg bg-rose-500/20 text-rose-300">
                  <TrendingDown className="w-5 h-5" />
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-bold font-mono text-rose-300 mt-3">
                {formatRupiahFull(totalKeluar)}
              </p>
              <p className="text-[11px] text-blue-200/60 mt-1 font-mono">Program Sosial & Operasional</p>
            </div>
          )}

          {settings.showTransSaldoBersih !== false && (
            <div className="bg-gradient-to-br from-[#1e3a8a] to-[#172554] text-white rounded-2xl p-6 shadow-lg relative overflow-hidden border-2 border-amber-400">
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-amber-300 font-mono font-bold uppercase tracking-[0.2em]">Saldo Kas Bersih</span>
                <div className="p-2 rounded-lg bg-amber-500/20 text-amber-300">
                  <FileText className="w-5 h-5" />
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-bold font-mono text-amber-300 mt-3">
                {formatRupiahFull(saldoKas)}
              </p>
              <p className="text-[11px] text-blue-100 mt-1 font-mono flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5 text-amber-400" /> Terverifikasi Audit DKM
              </p>
            </div>
          )}
        </div>

        {/* Keropak Infaq Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-blue-800/50">
          {settings.showTransKeropakIn !== false && (
            <div className="bg-slate-900/60 border border-blue-900/60 rounded-2xl p-5 shadow-sm relative overflow-hidden">
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-blue-200/60 font-mono font-bold uppercase tracking-[0.15em]">Pemasukan Keropak Masjid</span>
                <div className="p-1.5 rounded-md bg-blue-500/10 text-blue-400">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>
              <p className="text-xl sm:text-2xl font-bold font-mono text-blue-400 mt-2">
                {formatRupiahFull(keropakMasuk)}
              </p>
              <p className="text-[10px] text-blue-300/50 mt-1 font-mono">Dari Kotak Amal Harian/Jumat</p>
            </div>
          )}

          {settings.showTransKeropakOut !== false && (
            <div className="bg-slate-900/60 border border-blue-900/60 rounded-2xl p-5 shadow-sm relative overflow-hidden">
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-blue-200/60 font-mono font-bold uppercase tracking-[0.15em]">Penyaluran Keropak</span>
                <div className="p-1.5 rounded-md bg-rose-500/10 text-rose-400">
                  <TrendingDown className="w-4 h-4" />
                </div>
              </div>
              <p className="text-xl sm:text-2xl font-bold font-mono text-rose-400 mt-2">
                {formatRupiahFull(keropakKeluar)}
              </p>
              <p className="text-[10px] text-blue-300/50 mt-1 font-mono">Untuk Operasional Masjid</p>
            </div>
          )}

          {settings.showTransKeropakSaldo !== false && (
            <div className="bg-slate-800/80 border border-amber-900/30 rounded-2xl p-5 shadow-sm relative overflow-hidden">
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-amber-400/80 font-mono font-bold uppercase tracking-[0.15em]">Saldo Keropak Tersedia</span>
                <div className="p-1.5 rounded-md bg-amber-500/20 text-amber-400">
                  <Wallet className="w-4 h-4" />
                </div>
              </div>
              <p className="text-xl sm:text-2xl font-bold font-mono text-amber-400 mt-2">
                {formatRupiahFull(saldoKeropak)}
              </p>
              <p className="text-[10px] text-amber-200/50 mt-1 font-mono">Akumulasi Bersih Keropak</p>
            </div>
          )}
        </div>

        {/* Friday Khatib & Imam Highlight Banner */}
        {nextFriday && (
          <div className="bg-gradient-to-r from-[#1e3a8a] via-[#172554] to-[#1e3a8a] text-white border-2 border-amber-400/80 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="space-y-2 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40 text-[10px] font-mono font-bold uppercase tracking-[0.2em]">
                <Calendar className="w-3.5 h-3.5 text-amber-300" /> JADWAL KHATIB & IMAM JUMAT Tazkia SENTUL
              </div>
              <h3 className="text-xl sm:text-3xl font-serif text-white">
                "{nextFriday.topikJumat || 'Pentingnya Keberkahan Rezeki dalam ZISWAF'}"
              </h3>
              <p className="text-xs text-blue-100/80 font-mono">
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

        {/* Live Verified Cashflow Stream Table */}
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h3 className="text-xl font-serif font-bold text-white">
              Catatan Arus Kas Transaksi Realtime
            </h3>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-blue-400" />
                <input
                  type="text"
                  placeholder="Cari transaksi..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-white border border-black/15 focus:border-[#1e3a8a] rounded-xl pl-9 pr-3 py-2 text-xs text-[#1A1A1A] outline-none shadow-sm font-sans"
                />
              </div>

              <div className="flex gap-1 bg-white p-1 rounded-xl border border-black/15 font-mono text-[10px] uppercase font-bold">
                {(['semua', 'masuk', 'keluar'] as const).map(t => (
                  <button
                    key={t}
                    onClick={() => setFilterType(t)}
                    className={`px-3 py-1 rounded-lg capitalize transition-all cursor-pointer ${
                      filterType === t
                        ? 'bg-[#1e3a8a] text-white'
                        : 'text-[#1A1A1A]/60 hover:text-[#1A1A1A]'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white border border-black/10 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#1A1A1A]">
                <thead className="bg-[#F4F2EA] text-[#1A1A1A]/60 uppercase font-mono text-[10px] font-bold border-b border-black/10">
                  <tr>
                    <th className="p-4">Tanggal</th>
                    <th className="p-4">Jenis</th>
                    <th className="p-4">Uraian Transaksi</th>
                    <th className="p-4">Kategori</th>
                    <th className="p-4 text-right">Nominal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5">
                  {filteredFinancials.map(trx => (
                    <tr key={trx.id} className="hover:bg-stone-50 transition-colors">
                      <td className="p-4 font-mono text-[#1A1A1A]/60 font-medium">{trx.date}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wider ${
                          trx.type === 'masuk'
                            ? 'bg-[#1e3a8a]/10 text-[#1e3a8a] border border-[#1e3a8a]/20'
                            : 'bg-rose-50 text-rose-600 border border-rose-200'
                        }`}>
                          {trx.type}
                        </span>
                      </td>
                      <td className="p-4">
                        <p className="font-bold text-[#1A1A1A]">{trx.title}</p>
                        <p className="text-[11px] text-[#1A1A1A]/60">{trx.description}</p>
                      </td>
                      <td className="p-4 font-mono text-[11px] font-bold text-[#1e3a8a]">{trx.category}</td>
                      <td className={`p-4 text-right font-mono font-bold text-sm whitespace-nowrap ${
                        trx.type === 'masuk' ? 'text-[#1e3a8a]' : 'text-rose-600'
                      }`}>
                        {trx.type === 'masuk' ? '+' : '-'}{formatRupiahFull(trx.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

