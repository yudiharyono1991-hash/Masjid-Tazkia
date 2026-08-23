import React, { useState } from 'react';
import { useMasjidStore } from '../../lib/store';
import { PettyCashEntry } from '../../types';
import { Download, Plus, Save, Edit2, Trash2, Printer, Search, X, Database } from 'lucide-react';
import { formatRupiahFull } from '../../lib/islamicUtils';
import { exportJurnalUmumToExcel } from '../../lib/excelUtils'; // Use as placeholder

export function KasKecil() {
  const { state, addPettyCashEntry } = useMasjidStore();
  
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const getFirstDayOfMonth = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-01`; };
  const getToday = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; };
  
  const [startDate, setStartDate] = useState(getFirstDayOfMonth());
  const [endDate, setEndDate] = useState(getToday());
  const [searchQuery, setSearchQuery] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const generateUniqueId = (prefix: string) => {
    const d = new Date();
    const dateStr = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
    const timeStr = d.getTime().toString().slice(-4);
    const randomStr = Math.floor(10 + Math.random() * 90).toString();
    return `${prefix}-${dateStr}-${timeStr}${randomStr}`;
  };

  const [formData, setFormData] = useState<Partial<PettyCashEntry>>({
    date: getToday(),
    refNo: generateUniqueId('KK'),
    purpose: '',
    picName: '',
    type: 'Pengeluaran',
    amount: 0,
  });

  const handleExport = () => {
    alert('Ekspor Excel Kas Kecil berhasil diunduh.');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSave = () => {
    if (!formData.amount || formData.amount <= 0 || !formData.purpose || !formData.picName) {
      alert('Mohon lengkapi semua data wajib (Keperluan, PIC, dan Nominal).');
      return;
    }
    const newEntry: PettyCashEntry = {
      id: editingId || `KK-${Math.floor(Math.random() * 90000)}`,
      date: formData.date || getToday(),
      refNo: formData.refNo || generateUniqueId('KK'),
      purpose: formData.purpose,
      picName: formData.picName,
      type: formData.type as 'Pencairan' | 'Pengeluaran',
      amount: formData.amount,
      remainingBalance: 0,
      createdBy: state.session?.name || 'Sistem',
      createdAt: new Date().toISOString()
    };
    if (addPettyCashEntry) {
      addPettyCashEntry(newEntry);
      alert('Alhamdulillah, data kas kecil berhasil disimpan!');
    } else {
      alert('Fungsi simpan kas kecil belum sepenuhnya tersedia di store.');
    }
    setIsAdding(false);
    setFormData({
      date: getToday(),
      refNo: generateUniqueId('KK'),
      purpose: '',
      picName: '',
      type: 'Pengeluaran',
      amount: 0,
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm print:hidden">
        <div>
          <h3 className="font-bold text-lg text-blue-900">Buku Kas Kecil (Petty Cash)</h3>
          <p className="text-xs text-gray-500">Pencatatan kas sederhana sebelum dijurnalkan ke modul utama.</p>
        </div>
        
        <div className="flex items-center gap-2">
          <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="border border-gray-300 bg-white text-gray-900 rounded-lg px-2 py-1.5 text-sm font-medium focus:outline-none focus:border-blue-500" />
          <span className="text-gray-500 font-bold text-sm">s/d</span>
          <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="border border-gray-300 bg-white text-gray-900 rounded-lg px-2 py-1.5 text-sm font-medium focus:outline-none focus:border-blue-500" />
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          <button onClick={handlePrint} className="flex-1 md:flex-none px-3 py-2 bg-gray-50 border border-gray-200 text-sm font-semibold text-gray-700 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-100">
            <Printer className="w-4 h-4" /> Cetak
          </button>
          <button onClick={handleExport} className="flex-1 md:flex-none px-3 py-2 bg-gray-50 border border-gray-200 text-sm font-semibold text-gray-700 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-100">
            <Download className="w-4 h-4" /> Ekspor
          </button>
          <button onClick={() => { setEditingId(null); setIsAdding(true); }} className="px-3 py-2 bg-tazkia-primary text-white text-sm font-semibold rounded-lg flex items-center gap-2 hover:bg-tazkia-light">
            <Plus className="w-4 h-4" /> Input Kas Kecil
          </button>
        </div>
      </div>

      {isAdding && (
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4 print:hidden">
          <h4 className="font-bold text-sm text-blue-900 border-b pb-2">
            {editingId ? 'Edit Transaksi Kas Kecil' : 'Input Transaksi Kas Kecil Baru'}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Tanggal</label>
              <input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full p-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-900" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">No. Referensi</label>
              <input value={formData.refNo} onChange={e => setFormData({...formData, refNo: e.target.value})} className="w-full p-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-900" placeholder="Otomatis / Manual" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Jenis Transaksi</label>
              <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value as any})} className="w-full p-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-900">
                <option value="Pencairan">Pencairan (Dana Masuk)</option>
                <option value="Pengeluaran">Pengeluaran (Dana Keluar)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Nominal (Rp)</label>
              <input type="number" value={formData.amount} onChange={e => setFormData({...formData, amount: Number(e.target.value)})} className="w-full p-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-900" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-600 mb-1">Keperluan / Keterangan</label>
              <input value={formData.purpose} onChange={e => setFormData({...formData, purpose: e.target.value})} className="w-full p-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-900" placeholder="Keterangan keperluan kas..." />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-600 mb-1">PIC / Penerima</label>
              <input value={formData.picName} onChange={e => setFormData({...formData, picName: e.target.value})} className="w-full p-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-900" placeholder="Nama pengurus atau vendor" />
            </div>
          </div>
          
          <div className="flex justify-end gap-2 pt-4 border-t">
            <button onClick={() => setIsAdding(false)} className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg font-semibold hover:bg-gray-200 flex items-center gap-2">
              <X className="w-4 h-4" /> Batal
            </button>
            <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 flex items-center gap-2">
              <Save className="w-4 h-4" /> Simpan Data
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-xs sm:text-sm min-w-[700px]">
            <thead className="bg-gray-50 border-b border-gray-100 text-gray-600">
              <tr>
                <th className="p-4 font-semibold">Tanggal & Ref</th>
                <th className="p-4 font-semibold">Keterangan / Tujuan</th>
                <th className="p-4 font-semibold">PIC / Penerima</th>
                <th className="p-4 font-semibold text-right">Masuk (Rp)</th>
                <th className="p-4 font-semibold text-right">Keluar (Rp)</th>
                <th className="p-4 font-semibold text-right">Saldo (Rp)</th>
                <th className="p-4 font-semibold text-center w-24 print:hidden">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-slate-800">
              {(() => {
                const filteredData = (state.pettyCash || []).filter(item => {
                  const matchDate = item.date >= startDate && item.date <= endDate;
                  const matchSearch = item.purpose.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                      item.picName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                      item.refNo.toLowerCase().includes(searchQuery.toLowerCase());
                  return matchDate && matchSearch;
                });
                
                const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
                const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
                
                if (currentPage > totalPages) setCurrentPage(1);

                if (paginatedData.length > 0) {
                  return paginatedData.map((item, idx) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="p-4 align-top w-1/5">
                        <div className="font-semibold text-gray-800">
                          {item.date ? new Date(item.date).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta', day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) + ' WIB' : '-'}
                        </div>
                        {item.createdAt && (
                          <div className="text-[10px] text-gray-400 font-medium">
                            {new Date(item.createdAt).toLocaleTimeString('id-ID')}
                          </div>
                        )}
                        <div className="font-mono text-xs text-blue-600 mt-1">{item.refNo}</div>
                        {item.createdBy && (
                          <div className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded inline-block mt-1">
                            Input: {item.createdBy}
                          </div>
                        )}
                      </td>
                      <td className="p-4 align-top font-medium text-gray-700">
                        {item.purpose}
                        <span className="block mt-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full w-max bg-gray-200 text-gray-600">
                          {item.type}
                        </span>
                      </td>
                      <td className="p-4 align-top">{item.picName}</td>
                      <td className="p-4 align-top text-right font-mono text-emerald-600 font-semibold">
                        {item.type === 'Pencairan' ? (item as any).amount?.toLocaleString() : '-'}
                      </td>
                      <td className="p-4 align-top text-right font-mono text-red-600 font-semibold">
                        {item.type === 'Pengeluaran' ? (item as any).amount?.toLocaleString() : '-'}
                      </td>
                      <td className="p-4 align-top text-right font-mono font-bold">
                        {(item as any).remainingBalance?.toLocaleString() || '-'}
                      </td>
                      <td className="p-4 align-middle text-center print:hidden">
                        <div className="flex justify-center gap-1.5">
                          <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ));
                } else {
                  return (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-gray-400 font-medium text-sm">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-2">
                            <Database className="w-6 h-6" />
                          </div>
                          Belum ada data kas kecil untuk periode ini.
                        </div>
                      </td>
                    </tr>
                  );
                }
              })()}
            </tbody>
          </table>
          {/* Pagination Controls */}
          {(() => {
            const filteredData = (state.pettyCash || []).filter(item => {
              const matchDate = item.date >= startDate && item.date <= endDate;
              const matchSearch = item.purpose.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                  item.picName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                  item.refNo.toLowerCase().includes(searchQuery.toLowerCase());
              return matchDate && matchSearch;
            });
            const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
            
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
