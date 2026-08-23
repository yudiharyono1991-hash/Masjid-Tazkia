import React, { useState } from 'react';
import { useMasjidStore } from '../../lib/store';
import { ERPGeneralJournal, ERPJournalEntry } from '../../types';
import { Download, Plus, Save, Edit2, Trash2 } from 'lucide-react';
import { exportJurnalUmumToExcel } from '../../lib/excelUtils';
import { AccountCombobox } from '../AccountCombobox';

export function JurnalUmum() {
  const { state, addErpJournal, deleteErpJournal, updateErpJournal, addErpJournalEntry } = useMasjidStore();
  const [isAdding, setIsAdding] = useState(false);
  const [editingJournalId, setEditingJournalId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const generateUniqueId = (prefix: string) => {
    const d = new Date();
    const dateStr = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
    const timeStr = d.getTime().toString().slice(-4);
    const randomStr = Math.floor(10 + Math.random() * 90).toString();
    return `${prefix}-${dateStr}-${timeStr}${randomStr}`;
  };

  const [toastMsg, setToastMsg] = useState<{ text: string; type: 'success' | 'error' | 'warn' } | null>(null);
  const showToast = (text: string, type: 'success' | 'error' | 'warn' = 'success') => {
    setToastMsg({ text, type });
    setTimeout(() => setToastMsg(null), 3500);
  };
  
  // Date utils
  const getFirstDayOfMonth = () => { const d = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" })); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-01`; };
  const getToday = () => { const d = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" })); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; };

  const [startDate, setStartDate] = useState(getFirstDayOfMonth());
  const [endDate, setEndDate] = useState(getToday());

  const [journalData, setJournalData] = useState<Partial<ERPGeneralJournal>>({
    journalNo: generateUniqueId('JU'),
    date: new Date().toISOString().split('T')[0],
    description: '',
    reference: '',
  });

  const [entries, setEntries] = useState<Partial<ERPJournalEntry>[]>([
    { accountId: '', debit: 0, credit: 0, description: '' },
    { accountId: '', debit: 0, credit: 0, description: '' }
  ]);

  const handleExport = () => {
    exportJurnalUmumToExcel(state.erpJournals, state.erpJournalEntries);
  };

  const handleSave = () => {
    if (!journalData.description) {
      showToast('Deskripsi jurnal harus diisi terlebih dahulu.', 'error');
      return;
    }
    
    const totalDebit = entries.reduce((sum, e) => sum + (Number(e.debit) || 0), 0);
    const totalCredit = entries.reduce((sum, e) => sum + (Number(e.credit) || 0), 0);
    
    if (totalDebit !== totalCredit) {
      showToast('Total Debit dan Kredit harus seimbang (Balance)!', 'error');
      return;
    }
    if (totalDebit === 0) {
      showToast('Nilai Debit/Kredit tidak boleh 0!', 'error');
      return;
    }

    const journalId = editingJournalId || `JRN-${Math.floor(1000 + Math.random() * 9000)}`;
    const newJournal: ERPGeneralJournal = {
      id: journalId,
      journalNo: journalData.journalNo || '',
      date: journalData.date || '',
      description: journalData.description || '',
      reference: journalData.reference || '',
      status: 'Posted',
      createdBy: state.session?.name || 'Sistem',
      createdAt: new Date().toISOString()
    };

    const newEntries: ERPJournalEntry[] = entries
      .filter(entry => entry.accountId)
      .map(entry => {
        const account = state.erpCoa.find(a => a.id === entry.accountId);
        return {
          id: entry.id || `JE-${Math.floor(1000 + Math.random() * 9000)}`,
          journalId,
          accountId: entry.accountId!,
          accountCode: account?.accountCode,
          accountName: account?.accountName,
          debit: Number(entry.debit) || 0,
          credit: Number(entry.credit) || 0,
          description: entry.description || ''
        };
      });

    if (editingJournalId) {
      updateErpJournal(editingJournalId, newJournal, newEntries);
      showToast('Alhamdulillah, koreksi Jurnal Umum berhasil disimpan! ✓');
    } else {
      addErpJournal(newJournal);
      newEntries.forEach(ne => {
        addErpJournalEntry(ne);
      });
      showToast('Alhamdulillah, Jurnal Umum berhasil disimpan! ✓');
    }

    setIsAdding(false);
    setEditingJournalId(null);
    setEntries([{ accountId: '', debit: 0, credit: 0, description: '' }, { accountId: '', debit: 0, credit: 0, description: '' }]);
    setJournalData({
      journalNo: generateUniqueId('JU'),
      date: new Date().toISOString().split('T')[0],
      description: '',
      reference: '',
    });
  };

  const handleEdit = (journal: ERPGeneralJournal) => {
    const journalEntries = state.erpJournalEntries.filter(e => e.journalId === journal.id);
    setEditingJournalId(journal.id);
    setJournalData(journal);
    setEntries(journalEntries.map(e => ({
      id: e.id,
      accountId: e.accountId,
      debit: e.debit,
      credit: e.credit,
      description: e.description
    })));
    setIsAdding(true);
  };

  const handleDelete = (journalId: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus jurnal ini? Tindakan ini akan menghapus jurnal dan seluruh entri terkait secara permanen.')) {
      deleteErpJournal(journalId);
      showToast('Jurnal berhasil dihapus.');
    }
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingJournalId(null);
    setEntries([{ accountId: '', debit: 0, credit: 0, description: '' }, { accountId: '', debit: 0, credit: 0, description: '' }]);
    setJournalData({
      journalNo: generateUniqueId('JU'),
      date: new Date().toISOString().split('T')[0],
      description: '',
      reference: '',
    });
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMsg && (
        <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl border text-sm font-bold animate-fadeIn ${
          toastMsg.type === 'success' ? 'bg-emerald-900 border-emerald-500/40 text-emerald-200'
          : toastMsg.type === 'error' ? 'bg-red-900 border-red-500/40 text-red-200'
          : 'bg-amber-900 border-amber-500/40 text-amber-200'
        }`}>
          <span>{toastMsg.type === 'success' ? '✅' : toastMsg.type === 'error' ? '❌' : '⚠️'}</span>
          <span>{toastMsg.text}</span>
        </div>
      )}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <h3 className="font-bold text-lg text-blue-900">Jurnal Umum</h3>
        
        <div className="flex items-center gap-2">
          <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="border border-gray-300 bg-white text-gray-900 rounded-lg px-2 py-1.5 text-sm font-medium focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
          <span className="text-gray-500 font-bold text-sm">s/d</span>
          <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="border border-gray-300 bg-white text-gray-900 rounded-lg px-2 py-1.5 text-sm font-medium focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          <button onClick={handleExport} className="flex-1 md:flex-none px-3 py-2 bg-gray-50 border border-gray-200 text-sm font-semibold text-gray-700 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-100">
            <Download className="w-4 h-4" /> Ekspor
          </button>
          <button onClick={() => { setEditingJournalId(null); setIsAdding(true); }} className="px-3 py-2 bg-tazkia-primary text-white text-sm font-semibold rounded-lg flex items-center gap-2 hover:bg-tazkia-light">
            <Plus className="w-4 h-4" /> Buat Jurnal Baru
          </button>
        </div>
      </div>

      {isAdding && (
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
          <h4 className="font-bold text-sm text-blue-900 border-b pb-2">
            {editingJournalId ? 'Koreksi / Edit Jurnal Umum' : 'Buat Jurnal Baru'}
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">No Jurnal</label>
              <input value={journalData.journalNo} onChange={e => setJournalData({ ...journalData, journalNo: e.target.value })} className="w-full p-2 border border-gray-300 rounded-lg text-sm bg-gray-50 text-gray-900" readOnly />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Tanggal</label>
              <input type="date" value={journalData.date} onChange={e => setJournalData({ ...journalData, date: e.target.value })} className="w-full p-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-900" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Referensi</label>
              <input value={journalData.reference} onChange={e => setJournalData({ ...journalData, reference: e.target.value })} className="w-full p-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-900" placeholder="Ref Bukti" />
            </div>
            <div className="md:col-span-4">
              <label className="block text-xs font-semibold text-gray-600 mb-1">Keterangan Jurnal</label>
              <input value={journalData.description} onChange={e => setJournalData({ ...journalData, description: e.target.value })} className="w-full p-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-900" placeholder="Keterangan Transaksi" />
            </div>
          </div>

          <div className="mt-4 border-t pt-4">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="text-gray-500 font-semibold">
                  <th className="pb-2 w-1/3">Akun</th>
                  <th className="pb-2">Keterangan Baris</th>
                  <th className="pb-2 w-32">Debit (Rp)</th>
                  <th className="pb-2 w-32">Kredit (Rp)</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry, idx) => {
                  const coaOptions = state.erpCoa.filter(c => c.isActive).map(c => ({
                    id: c.id,
                    label: `[${c.accountCode}] ${c.accountName}`
                  }));

                  return (
                    <tr key={idx}>
                      <td className="py-1 pr-2 align-top">
                        <AccountCombobox
                          value={entry.accountId}
                          onChange={(newId) => {
                            const newEntries = [...entries];
                            newEntries[idx].accountId = newId;
                            setEntries(newEntries);
                          }}
                          options={coaOptions}
                        />
                      </td>
                      <td className="py-1 pr-2">
                        <input value={entry.description} onChange={e => {
                          const newEntries = [...entries];
                          newEntries[idx].description = e.target.value;
                          setEntries(newEntries);
                        }} className="w-full p-2 border border-gray-300 rounded-lg text-gray-900 bg-white" placeholder="Keterangan..." />
                      </td>
                      <td className="py-1 pr-2">
                        <input type="number" value={entry.debit || ''} onChange={e => {
                          const newEntries = [...entries];
                          newEntries[idx].debit = Number(e.target.value);
                          newEntries[idx].credit = 0;
                          setEntries(newEntries);
                        }} className="w-full p-2 border border-gray-300 rounded-lg text-gray-900 bg-white" placeholder="0" />
                      </td>
                      <td className="py-1">
                        <input type="number" value={entry.credit || ''} onChange={e => {
                          const newEntries = [...entries];
                          newEntries[idx].credit = Number(e.target.value);
                          newEntries[idx].debit = 0;
                          setEntries(newEntries);
                        }} className="w-full p-2 border border-gray-300 rounded-lg text-gray-900 bg-white" placeholder="0" />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <button onClick={() => {
              setEntries([...entries, { accountId: '', debit: 0, credit: 0, description: '' }]);
            }} className="text-sm text-blue-600 font-semibold mt-2 hover:underline">
              + Tambah Baris
            </button>
          </div>
          
          <div className="flex justify-end gap-2 pt-4 border-t">
            <button onClick={handleCancel} className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg font-semibold hover:bg-gray-200">Batal</button>
            <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 flex items-center gap-2">
              <Save className="w-4 h-4" /> {editingJournalId ? 'Simpan Koreksi' : 'Simpan Jurnal'}
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto custom-scrollbar">
        <table className="w-full text-left text-xs sm:text-sm min-w-[700px]">
          <thead className="bg-gray-50 border-b border-gray-100 text-gray-600">
            <tr>
              <th className="p-4 font-semibold">Tanggal & No</th>
              <th className="p-4 font-semibold">Keterangan</th>
              <th className="p-4 font-semibold text-right">Debit</th>
              <th className="p-4 font-semibold text-right">Kredit</th>
              <th className="p-4 font-semibold text-center w-24">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {(() => {
              const filteredJournals = state.erpJournals.filter(j => j.date >= startDate && j.date <= endDate);
              const totalPages = Math.ceil(filteredJournals.length / itemsPerPage) || 1;
              const paginatedJournals = filteredJournals.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
              
              if (currentPage > totalPages) setCurrentPage(1); // Auto reset if out of bounds
              
              return (
                <>
                  {paginatedJournals.map(journal => {
              const journalEntries = state.erpJournalEntries.filter(e => e.journalId === journal.id);
              const totalDebit = journalEntries.reduce((s, e) => s + e.debit, 0);
              
              return (
                <React.Fragment key={journal.id}>
                  <tr className="bg-gray-50/50 text-slate-900">
                    <td className="p-4 align-top w-1/4">
                      <div className="font-semibold text-gray-800">
                        {new Date(journal.date).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta', day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) + ' WIB'}
                      </div>
                      {journal.createdAt && (
                        <div className="text-[10px] text-gray-400 font-medium">
                          {new Date(journal.createdAt).toLocaleTimeString('id-ID')}
                        </div>
                      )}
                      <div className="font-mono text-xs text-blue-600 mt-1">{journal.journalNo}</div>
                      <div className="text-xs text-gray-400 mt-0.5">Ref: {journal.reference || '-'}</div>
                      <div className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded inline-block mt-1">
                        Input: {journal.createdBy || '-'}
                      </div>
                    </td>
                    <td className="p-4 align-top font-medium text-gray-700">
                      {journal.description}
                      <div className="mt-2 text-xs space-y-1">
                        {journalEntries.map(e => (
                          <div key={e.id} className="flex justify-between">
                            <span className={e.credit > 0 ? 'pl-4 text-gray-500' : 'text-gray-600'}>
                              [{e.accountCode}] {e.accountName}
                            </span>
                            <div className="flex gap-4 w-48 justify-end font-mono">
                              <span className="w-20 text-right">{e.debit > 0 ? e.debit.toLocaleString() : ''}</span>
                              <span className="w-20 text-right">{e.credit > 0 ? e.credit.toLocaleString() : ''}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="p-4 align-bottom text-right font-bold text-gray-800">
                      Rp {totalDebit.toLocaleString()}
                    </td>
                    <td className="p-4 align-bottom text-right font-bold text-gray-800">
                      Rp {totalDebit.toLocaleString()}
                    </td>
                    <td className="p-4 align-middle text-center">
                      <div className="flex justify-center gap-1.5">
                        <button 
                          onClick={() => handleEdit(journal)} 
                          title="Edit / Koreksi"
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(journal.id)} 
                          title="Hapus"
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                </React.Fragment>
              );
            })}
            {state.erpJournals.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-400">Belum ada transaksi Jurnal Umum.</td>
              </tr>
            )}
            {/* PAGINATION LOGIC UI */}
            {(() => {
              const filteredJournals = state.erpJournals.filter(j => j.date >= startDate && j.date <= endDate);
              const totalPages = Math.ceil(filteredJournals.length / itemsPerPage) || 1;
              if (totalPages <= 1) return null;
              
              return (
                <tr className="bg-white">
                  <td colSpan={5} className="p-4 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        Halaman {currentPage} dari {totalPages}
                      </span>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                          disabled={currentPage === 1}
                          className="px-3 py-1 text-sm border border-gray-200 rounded text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                        >
                          Sebelumnya
                        </button>
                        <button 
                          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                          disabled={currentPage === totalPages}
                          className="px-3 py-1 text-sm border border-gray-200 rounded text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                        >
                          Selanjutnya
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })()}
                </>
              );
            })()}
          </tbody>
        </table>
      </div>
    </div>
  );
}
