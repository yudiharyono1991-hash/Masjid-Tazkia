import React, { useState } from 'react';
import { Wallet, ArrowDownRight, ArrowUpRight, Calendar, ChevronLeft, ChevronRight, FileText, Download, Edit2, Trash2, Sparkles, Plus, X } from 'lucide-react';
import { formatRupiahFull } from '../lib/islamicUtils';
import { useMasjidStore } from '../lib/store';
import { JamaahTransaction } from '../types';

export const LaporanKeuanganPribadi: React.FC = () => {
  const { state, addJamaahTransaction, deleteJamaahTransaction } = useMasjidStore();
  const session = state.session;

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const getToday = () => { const d = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" })); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; }
  const getFirstDayOfMonth = () => {
    const d = new Date();
    d.setDate(1);
    return d.toISOString().split('T')[0];
  };

  const [filterStartDate, setFilterStartDate] = useState(getFirstDayOfMonth());
  const [filterEndDate, setFilterEndDate] = useState(getToday());

  const [isAdding, setIsAdding] = useState(false);
  const [newDate, setNewDate] = useState(getToday());
  const [newDesc, setNewDesc] = useState('');
  const [newType, setNewType] = useState<'kredit'|'debit'>('kredit');
  const [newAmount, setNewAmount] = useState('');

  // 1. Ambil transaksi milik jamaah yang sedang login
  // 2. Sort berdasarkan tanggal ascending untuk hitung saldo berjalan
  const userTransactions = (state.jamaahTransactions || [])
    .filter(t => t.jamaahId === session.email)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // 3. Kalkulasi saldo berjalan untuk tiap transaksi
  let runningBalance = 0;
  const transactionsWithBalance = userTransactions.map(t => {
    if (t.type === 'kredit') {
      runningBalance += t.amount;
    } else {
      runningBalance -= t.amount;
    }
    return { ...t, balance: runningBalance };
  });

  // 4. Reverse urutan agar yang terbaru di atas untuk tabel
  transactionsWithBalance.reverse();

  // 5. Filter berdasarkan range tanggal
  const monthlyTransactions = transactionsWithBalance.filter(t => {
    const tDate = t.date.split('T')[0];
    return tDate >= filterStartDate && tDate <= filterEndDate;
  });

  const totalPages = Math.max(1, Math.ceil(monthlyTransactions.length / itemsPerPage));
  const currentTransactions = monthlyTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const saldoTanggalBerjalan = runningBalance;
  
  // Saldo bulan lalu (hitung dari transaksi sebelum filterStartDate)
  let saldoAkhirBulanLalu = 0;
  userTransactions.forEach(t => {
    if (t.date.split('T')[0] < filterStartDate) {
      if (t.type === 'kredit') saldoAkhirBulanLalu += t.amount;
      else saldoAkhirBulanLalu -= t.amount;
    }
  });

  const totalPemasukan = monthlyTransactions.filter(t => t.type === 'kredit').reduce((acc, curr) => acc + curr.amount, 0);
  const totalPengeluaran = monthlyTransactions.filter(t => t.type === 'debit').reduce((acc, curr) => acc + curr.amount, 0);

  let aiAnalysisText = "";
  if (monthlyTransactions.length === 0) {
    aiAnalysisText = "Belum ada data transaksi untuk bulan ini. Mulailah mencatat pemasukan dan pengeluaran Anda untuk mendapatkan analisis cerdas terkait kondisi keuangan dan saran ibadah maliyah Anda.";
  } else if (totalPengeluaran > totalPemasukan) {
    aiAnalysisText = "Peringatan: Total pengeluaran Anda bulan ini melebihi pemasukan. Pertimbangkan untuk mengevaluasi kembali pos pengeluaran Anda agar kondisi keuangan tetap stabil, namun jangan lupa untuk tetap menyisihkan sedikit harta untuk sedekah penolak bala.";
  } else if (totalPemasukan > totalPengeluaran * 1.5) {
    aiAnalysisText = "Alhamdulillah, kondisi keuangan Anda bulan ini sangat sehat dengan surplus yang baik. Ini adalah waktu yang tepat untuk mempertimbangkan peningkatan partisipasi ZISWAF atau mulai merencanakan tabungan qurban tahun depan.";
  } else {
    aiAnalysisText = "Berdasarkan riwayat transaksi Anda, pengeluaran bulan ini masih dalam batas aman. Pertimbangkan untuk menyisihkan sebagian saldo untuk tabungan masa depan dan target ZISWAF Anda. Anda bisa mulai dengan menambah infaq pekan ini.";
  }

  const getPreviousMonthName = () => {
    const now = new Date();
    now.setMonth(now.getMonth() - 1);
    return now.toLocaleDateString('id-ID', { month: 'long' });
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const [downloadDate, setDownloadDate] = useState<string | null>(null);
  
  const handleDownloadExcel = async () => {
    const now = new Date();
    setDownloadDate(now.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }));
    
    try {
      const XLSX = await import('xlsx');
      
      const excelData = userTransactions.map(t => ({
        'Tanggal': new Date(t.date).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }),
        'Keterangan': t.description,
        'Tipe Transaksi': t.type === 'kredit' ? 'Pemasukan' : 'Pengeluaran',
        'Nominal': t.amount
      }));
      
      const worksheet = XLSX.utils.json_to_sheet(excelData);
      
      worksheet['!cols'] = [
        { wch: 20 },
        { wch: 40 },
        { wch: 15 },
        { wch: 20 }
      ];
      
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Riwayat Keuangan");
      
      XLSX.writeFile(workbook, `Laporan_Keuangan_${session.name.replace(/\s+/g, '_')}_${now.toISOString().split('T')[0]}.xlsx`);
    } catch (error) {
      console.error('Error generating Excel:', error);
      alert('Gagal mengunduh berkas Excel. Silakan coba lagi.');
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDesc || !newAmount) return;
    
    addJamaahTransaction({
      jamaahId: session.email || 'jamaah@tazkia.id',
      date: newDate,
      description: newDesc,
      type: newType,
      amount: Number(newAmount.replace(/\D/g, ''))
    });

    setNewDesc('');
    setNewAmount('');
    setIsAdding(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-blue-600 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-5 text-white shadow-lg relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-xl translate-x-1/2 -translate-y-1/2" />
          <div className="relative z-10 flex flex-col justify-center h-full">
            <h3 className="text-blue-100 text-[11px] font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Wallet className="w-3.5 h-3.5" /> Saldo Berjalan (Total)
            </h3>
            <p className="text-2xl font-bold">{formatRupiahFull(saldoTanggalBerjalan)}</p>
          </div>
        </div>
        
        <div className="bg-emerald-600 bg-gradient-to-r from-emerald-600 to-teal-800 rounded-2xl p-5 text-white shadow-lg relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-xl translate-x-1/2 -translate-y-1/2" />
          <div className="relative z-10 flex flex-col justify-center h-full">
            <h3 className="text-emerald-100 text-[11px] font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" /> Saldo Awal Bulan Ini
            </h3>
            <p className="text-2xl font-bold">{formatRupiahFull(saldoAkhirBulanLalu)}</p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex items-start gap-3">
          <div className="bg-emerald-100 text-emerald-600 p-2 rounded-xl shrink-0">
            <ArrowDownRight className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase">Pemasukan Bulan Ini</p>
            <p className="text-sm font-bold text-gray-800 mt-0.5">{formatRupiahFull(totalPemasukan)}</p>
          </div>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex items-start gap-3">
          <div className="bg-rose-100 text-rose-600 p-2 rounded-xl shrink-0">
            <ArrowUpRight className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase">Pengeluaran Bulan Ini</p>
            <p className="text-sm font-bold text-gray-800 mt-0.5">{formatRupiahFull(totalPengeluaran)}</p>
          </div>
        </div>
      </div>

      {/* AI Analysis Notification */}
      <div className="bg-indigo-50 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-2xl p-4 flex gap-3 shadow-sm">
        <div className="bg-indigo-100 text-indigo-600 p-2 rounded-xl shrink-0 h-min">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-wider mb-1">Analisis Otomatis AI</h4>
          <p className="text-xs text-indigo-800 leading-relaxed">
            {aiAnalysisText}
          </p>
        </div>
      </div>

      {/* Form Tambah Transaksi */}
      {isAdding && (
        <div className="bg-white p-5 rounded-2xl border border-blue-200 shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-sm font-bold text-gray-800">Tambah Transaksi Baru</h4>
            <button onClick={() => setIsAdding(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>
          <form onSubmit={handleAddSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Tanggal</label>
                <input 
                  type="date" 
                  required
                  value={newDate} 
                  onChange={e => setNewDate(e.target.value)}
                  className="w-full text-sm border border-gray-300 rounded-lg p-2 outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Jenis</label>
                <select 
                  value={newType}
                  onChange={e => setNewType(e.target.value as 'kredit'|'debit')}
                  className="w-full text-sm border border-gray-300 rounded-lg p-2 outline-none focus:border-blue-500"
                >
                  <option value="kredit">Kredit (Pemasukan)</option>
                  <option value="debit">Debit (Pengeluaran)</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Keterangan / Deskripsi</label>
              <input 
                type="text" 
                required
                placeholder="Misal: Gaji Bulanan, Belanja Dapur..."
                value={newDesc} 
                onChange={e => setNewDesc(e.target.value)}
                className="w-full text-sm border border-gray-300 rounded-lg p-2 outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Nominal (Rp)</label>
              <input 
                type="text" 
                required
                placeholder="Misal: 5000000"
                value={newAmount} 
                onChange={e => {
                  const val = e.target.value.replace(/\D/g, '');
                  setNewAmount(val ? formatRupiahFull(Number(val)).replace('Rp', '').trim() : '');
                }}
                className="w-full text-sm font-mono border border-gray-300 rounded-lg p-2 outline-none focus:border-blue-500"
              />
            </div>
            <div className="pt-2 flex justify-end gap-2">
              <button type="button" onClick={() => setIsAdding(false)} className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer transition">
                Batal
              </button>
              <button type="submit" className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md cursor-pointer transition">
                Simpan Transaksi
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Transaction History Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-gray-50/50">
          <div>
            <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600" />
              Riwayat Transaksi
            </h3>
            <div className="flex items-center gap-2 text-xs bg-white p-1.5 rounded-lg border border-gray-200 shadow-sm mt-2 sm:mt-0">
              <input 
                type="date" 
                value={filterStartDate}
                onChange={(e) => setFilterStartDate(e.target.value)}
                className="outline-none text-gray-700 bg-transparent font-medium w-[110px] sm:w-auto"
              />
              <span className="text-gray-400 font-bold">s/d</span>
              <input 
                type="date" 
                value={filterEndDate}
                onChange={(e) => setFilterEndDate(e.target.value)}
                className="outline-none text-gray-700 bg-transparent font-medium w-[110px] sm:w-auto"
              />
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-2 w-full sm:w-auto">
            <div className="flex items-center gap-2 w-full">
              <button onClick={handleDownloadExcel} className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors flex-1 sm:flex-none justify-center cursor-pointer">
                <Download className="w-3.5 h-3.5" /> Unduh
              </button>
              <button onClick={() => setIsAdding(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors flex-1 sm:flex-none justify-center cursor-pointer">
                <Plus className="w-3.5 h-3.5" /> Tambah
              </button>
            </div>
            {downloadDate && (
              <span className="text-[9px] text-gray-400 font-mono">Diunduh: {downloadDate}</span>
            )}
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left whitespace-nowrap">
            <thead className="bg-gray-50/80 text-gray-400 font-bold uppercase text-[9px] tracking-wider border-b border-gray-100">
              <tr>
                <th className="px-4 py-3 text-center w-10">No</th>
                <th className="px-4 py-3">Tanggal</th>
                <th className="px-4 py-3">Keterangan</th>
                <th className="px-4 py-3 text-right text-emerald-600">Kredit (In)</th>
                <th className="px-4 py-3 text-right text-rose-600">Debit (Out)</th>
                <th className="px-4 py-3 text-right">Saldo</th>
                <th className="px-4 py-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-[11px]">
              {currentTransactions.map((trx, index) => (
                <tr key={trx.id} className="hover:bg-blue-50/30 transition-colors">
                  <td className="px-4 py-3 text-center text-gray-400 font-mono">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {formatDate(trx.date)}
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-700">
                    {trx.description}
                  </td>
                  <td className="px-4 py-3 text-right font-mono font-medium text-emerald-600">
                    {trx.type === 'kredit' ? `+ ${formatRupiahFull(trx.amount)}` : '-'}
                  </td>
                  <td className="px-4 py-3 text-right font-mono font-medium text-rose-500">
                    {trx.type === 'debit' ? `- ${formatRupiahFull(trx.amount)}` : '-'}
                  </td>
                  <td className="px-4 py-3 text-right font-mono font-bold text-gray-800 bg-gray-50/30">
                    {formatRupiahFull(trx.balance)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button onClick={() => deleteJamaahTransaction(trx.id)} className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-md transition cursor-pointer" title="Hapus">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              
              {currentTransactions.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-gray-400">
                    Belum ada riwayat transaksi pada rentang tanggal ini. Silakan catat transaksi pertama Anda!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-3 border-t border-gray-100 flex justify-between items-center bg-gray-50/50">
            <span className="text-[10px] text-gray-500 font-medium">
              Hal. <strong className="text-gray-700">{currentPage}</strong> dari <strong className="text-gray-700">{totalPages}</strong>
            </span>
            <div className="flex gap-1.5">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-md border border-gray-200 text-gray-500 hover:bg-gray-100 hover:text-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-md border border-gray-200 text-gray-500 hover:bg-gray-100 hover:text-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
