
import React, { useState } from 'react';
import { KeropakTransaction } from '../../types';
import { useMasjidStore } from '../../lib/store';
import { Plus, Trash2, Calendar, Download } from 'lucide-react';
import { formatRupiahFull } from '../../lib/islamicUtils';

export function ManajemenKeropak() {
  const { state, addKeropakTransaction, deleteKeropakTransaction } = useMasjidStore();
  const transactions = state.keropakTransactions || [];

  const [type, setType] = useState<'jumat' | 'harian' | 'keluar'>('jumat');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) return alert('Nominal harus lebih dari 0');
    
    addKeropakTransaction({
      type,
      amount: Number(amount),
      date,
      description: description || (type === 'jumat' ? 'Keropak Jumat' : type === 'harian' ? 'Keropak Harian' : 'Penyaluran Keropak')
    });

    setAmount('');
    setDescription('');
    alert('Data Keropak berhasil disimpan!');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h3 className="font-bold text-lg text-blue-900 mb-4">Input Data Keropak</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Jenis Keropak</label>
            <select value={type} onChange={(e) => setType(e.target.value as any)} className="w-full border border-gray-300 rounded-lg p-2 text-sm text-gray-900 bg-white">
              <option value="jumat">Keropak Jumat</option>
              <option value="harian">Keropak Harian</option>
              <option value="keluar">Penyaluran Keropak</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Tanggal</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full border border-gray-300 rounded-lg p-2 text-sm text-gray-900 bg-white" required />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Nominal (Rp)</label>
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full border border-gray-300 rounded-lg p-2 text-sm text-gray-900 bg-white placeholder-gray-400" required placeholder="Misal: 500000" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Keterangan (Opsional)</label>
            <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full border border-gray-300 rounded-lg p-2 text-sm text-gray-900 bg-white placeholder-gray-400" placeholder="Catatan tambahan..." />
          </div>
          <div className="md:col-span-2">
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg flex items-center gap-2 transition">
              <Plus className="w-4 h-4" /> Simpan Data Keropak
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 bg-gray-50 border-b border-gray-100">
          <h3 className="font-bold text-gray-800">Riwayat Keropak</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-700 text-xs uppercase">
                <th className="p-4 font-semibold border-b border-gray-200">Tanggal</th>
                <th className="p-4 font-semibold border-b border-gray-200">Jenis</th>
                <th className="p-4 font-semibold border-b border-gray-200">Keterangan</th>
                <th className="p-4 font-semibold text-right border-b border-gray-200">Nominal (Rp)</th>
                <th className="p-4 font-semibold text-center border-b border-gray-200">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {(() => {
                const sorted = [...transactions].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                const totalPages = Math.ceil(sorted.length / itemsPerPage) || 1;
                const paginated = sorted.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
                if (currentPage > totalPages && totalPages > 0) setCurrentPage(1);

                return paginated.map(t => (
                  <tr key={t.id} className="hover:bg-gray-50 text-gray-900">
                    <td className="p-4 text-sm font-medium">{new Date(t.date).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta', day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) + ' WIB'}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${t.type === 'keluar' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                        {t.type}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-gray-700">{t.description}</td>
                    <td className={`p-4 text-sm font-bold text-right ${t.type === 'keluar' ? 'text-red-600' : 'text-emerald-600'}`}>
                      {formatRupiahFull(t.amount)}
                    </td>
                    <td className="p-4 text-center">
                      <button onClick={() => { if(window.confirm('Hapus riwayat ini?')) deleteKeropakTransaction(t.id); }} className="text-red-500 hover:bg-red-50 p-1.5 rounded">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ));
              })()}
              {transactions.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-600 font-medium bg-gray-50/50">Belum ada data keropak.</td>
                </tr>
              )}
            </tbody>
          </table>
          {/* Pagination Controls */}
          {(() => {
            const totalPages = Math.ceil(transactions.length / itemsPerPage) || 1;
            if (totalPages <= 1) return null;
            return (
              <div className="flex items-center justify-between p-4 border-t border-gray-100 bg-white">
                <span className="text-sm text-gray-500">Halaman {currentPage} dari {totalPages}</span>
                <div className="flex gap-2">
                  <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-3 py-1 text-sm border border-gray-200 rounded text-gray-600 hover:bg-gray-50 disabled:opacity-50">Sebelumnya</button>
                  <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-3 py-1 text-sm border border-gray-200 rounded text-gray-600 hover:bg-gray-50 disabled:opacity-50">Selanjutnya</button>
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
}

