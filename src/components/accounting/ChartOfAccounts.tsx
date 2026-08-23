import React, { useState } from 'react';
import { useMasjidStore } from '../../lib/store';
import { ERPChartOfAccount } from '../../types';
import { Download, Upload, Plus, Edit2, Trash2 } from 'lucide-react';
import { exportCoaToExcel, importCoaFromExcel, downloadCoaTemplate } from '../../lib/excelUtils';

export function ChartOfAccounts() {
  const { state, addErpCoa, setErpCoa, updateErpCoa, deleteErpCoa, deleteErpCoaBulk } = useMasjidStore();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;
  
  const [formData, setFormData] = useState<Partial<ERPChartOfAccount>>({
    accountCode: '',
    accountName: '',
    accountType: 'Asset',
    normalBalance: 'Debit',
    isActive: true
  });

  const handleSave = () => {
    if (!formData.accountCode || !formData.accountName) return;
    
    if (editingId) {
      updateErpCoa(editingId, {
        accountCode: formData.accountCode,
        accountName: formData.accountName,
        accountType: formData.accountType as any,
        normalBalance: formData.normalBalance as any,
        groupName: formData.groupName || 'Uncategorized',
        isActive: formData.isActive ?? true
      });
      alert('Alhamdulillah, Akun CoA berhasil diperbarui!');
    } else {
      const newAccount: ERPChartOfAccount = {
        id: `COA-${Math.floor(1000 + Math.random() * 9000)}`,
        accountCode: formData.accountCode,
        accountName: formData.accountName,
        accountType: formData.accountType as any,
        normalBalance: formData.normalBalance as any,
        groupName: formData.groupName || 'Uncategorized',
        isActive: formData.isActive ?? true,
        createdAt: new Date().toISOString()
      };
      addErpCoa(newAccount);
      alert('Alhamdulillah, Akun CoA berhasil disimpan!');
    }
    
    setIsAdding(false);
    setEditingId(null);
    setFormData({ accountCode: '', accountName: '', accountType: 'Asset', normalBalance: 'Debit', groupName: '', isActive: true });
  };

  const handleEdit = (acc: ERPChartOfAccount) => {
    setFormData(acc);
    setEditingId(acc.id);
    setIsAdding(true);
  };

  const handleDelete = (acc: ERPChartOfAccount) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus akun ${acc.accountCode} - ${acc.accountName}?`)) {
      deleteErpCoa(acc.id);
      setSelectedIds(prev => prev.filter(id => id !== acc.id));
    }
  };

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;
    if (window.confirm(`Apakah Anda yakin ingin menghapus ${selectedIds.length} akun yang dipilih?`)) {
      deleteErpCoaBulk(selectedIds);
      setSelectedIds([]);
      alert(`Berhasil menghapus ${selectedIds.length} akun.`);
    }
  };

  const toggleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(paginatedCoa.map(acc => acc.id));
    } else {
      setSelectedIds([]);
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleExport = () => {
    exportCoaToExcel(state.erpCoa);
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        const imported = await importCoaFromExcel(e.target.files[0]);
        const newCoas = imported.map(acc => ({
          ...acc,
          id: `COA-${Math.floor(1000 + Math.random() * 9000)}`,
          createdAt: new Date().toISOString()
        })) as ERPChartOfAccount[];
        
        setErpCoa([...state.erpCoa, ...newCoas]);
        alert('Alhamdulillah, data CoA berhasil diimpor!');
      } catch (err) {
        console.error('Failed to import', err);
        alert('Gagal mengimpor file Excel. Pastikan format sesuai.');
      }
    }
  };

  const filteredCoa = state.erpCoa.filter(acc => {
    const matchesSearch = acc.accountName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          acc.accountCode.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'All' || acc.accountType === filterType;
    return matchesSearch && matchesType;
  });

  const totalPages = Math.ceil(filteredCoa.length / itemsPerPage);
  const paginatedCoa = filteredCoa.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm gap-4">
        <h3 className="font-bold text-lg text-blue-900">Bagan Akun (Chart of Accounts)</h3>
        
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Filters */}
          <input 
            type="text" 
            placeholder="Cari nama/kode..." 
            value={searchQuery}
            onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            className="px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none min-w-[150px]"
            style={{ color: '#111827', backgroundColor: '#ffffff' }}
          />
          <select 
            value={filterType}
            onChange={e => { setFilterType(e.target.value); setCurrentPage(1); }}
            className="px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none"
            style={{ color: '#111827', backgroundColor: '#ffffff' }}
          >
            <option value="All" style={{ color: '#111827', backgroundColor: '#ffffff' }}>Semua Klasifikasi</option>
            <option value="Asset" style={{ color: '#111827', backgroundColor: '#ffffff' }}>Asset</option>
            <option value="Liability" style={{ color: '#111827', backgroundColor: '#ffffff' }}>Liability</option>
            <option value="Equity" style={{ color: '#111827', backgroundColor: '#ffffff' }}>Equity</option>
            <option value="Revenue" style={{ color: '#111827', backgroundColor: '#ffffff' }}>Revenue</option>
            <option value="Expense" style={{ color: '#111827', backgroundColor: '#ffffff' }}>Expense</option>
          </select>

          <div className="h-6 w-px bg-gray-200 hidden md:block mx-1"></div>
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {selectedIds.length > 0 && (
              <button 
                onClick={handleBulkDelete} 
                className="px-3 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg flex items-center gap-2 hover:bg-red-700 transition"
              >
                <Trash2 className="w-4 h-4" /> Hapus Terpilih ({selectedIds.length})
              </button>
            )}
            <button onClick={handleExport} className="px-3 py-2 bg-gray-50 border border-gray-200 text-sm font-semibold text-gray-700 rounded-lg flex items-center gap-2 hover:bg-gray-100">
              <Download className="w-4 h-4" /> Ekspor
            </button>
            <button onClick={downloadCoaTemplate} className="px-3 py-2 bg-gray-50 border border-gray-200 text-sm font-semibold text-gray-700 rounded-lg flex items-center gap-2 hover:bg-gray-100" title="Unduh Template Excel">
              Template
            </button>
            <label className="px-3 py-2 bg-gray-50 border border-gray-200 text-sm font-semibold text-gray-700 rounded-lg flex items-center gap-2 hover:bg-gray-100 cursor-pointer">
              <Upload className="w-4 h-4" /> Impor
              <input type="file" accept=".xlsx, .xls" className="hidden" onChange={handleImport} />
            </label>
            <button onClick={() => setIsAdding(true)} className="px-3 py-2 bg-tazkia-primary text-white text-sm font-semibold rounded-lg flex items-center gap-2 hover:bg-tazkia-light">
              <Plus className="w-4 h-4" /> Tambah Akun
            </button>
          </div>
        </div>
      </div>

      {isAdding && (
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Kode Akun</label>
            <input 
              value={formData.accountCode} 
              onChange={e => setFormData({ ...formData, accountCode: e.target.value })} 
              className="w-full p-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white" 
              placeholder="e.g. 1101" 
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Nama Akun</label>
            <input 
              value={formData.accountName} 
              onChange={e => setFormData({ ...formData, accountName: e.target.value })} 
              className="w-full p-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white" 
              placeholder="e.g. Kas Masjid" 
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Tipe & Saldo</label>
            <div className="flex gap-2">
              <select 
                value={formData.accountType} 
                onChange={e => setFormData({ ...formData, accountType: e.target.value as any })} 
                className="w-1/2 p-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white"
              >
                <option value="Asset">Asset</option>
                <option value="Liability">Liability</option>
                <option value="Equity">Equity</option>
                <option value="Revenue">Revenue</option>
                <option value="Expense">Expense</option>
              </select>
              <select 
                value={formData.normalBalance} 
                onChange={e => setFormData({ ...formData, normalBalance: e.target.value as any })} 
                className="w-1/2 p-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white"
              >
                <option value="Debit">Debit</option>
                <option value="Credit">Credit</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Kategori / Kelompok</label>
            <input 
              value={formData.groupName || ''} 
              onChange={e => setFormData({ ...formData, groupName: e.target.value })} 
              className="w-full p-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white" 
              placeholder="e.g. Aset Lancar" 
            />
          </div>
          <div className="flex items-center">
            <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-gray-600">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-4 h-4 text-blue-600"
              />
              Akun Aktif
            </label>
          </div>
          <div className="flex items-end gap-2 col-span-2 md:col-span-4">
            <button onClick={handleSave} className="flex-1 p-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700">Simpan</button>
            <button onClick={() => setIsAdding(false)} className="flex-1 p-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-semibold hover:bg-gray-200">Batal</button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto custom-scrollbar">
        <table className="w-full text-left text-xs sm:text-sm min-w-[500px]">
          <thead className="bg-gray-50 border-b border-gray-100 text-gray-600">
            <tr>
              <th className="p-4 w-12 text-center">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 accent-blue-600 cursor-pointer rounded"
                  checked={paginatedCoa.length > 0 && selectedIds.length === paginatedCoa.length}
                  onChange={toggleSelectAll}
                />
              </th>
              <th className="p-4 font-semibold">Kode Akun</th>
              <th className="p-4 font-semibold">Nama Akun</th>
              <th className="p-4 font-semibold">Tipe Akun</th>
              <th className="p-4 font-semibold">Saldo Normal</th>
              <th className="p-4 font-semibold text-center">Status</th>
              <th className="p-4 font-semibold text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paginatedCoa.map(acc => (
              <tr key={acc.id} className={`hover:bg-gray-50 text-slate-800 ${selectedIds.includes(acc.id) ? 'bg-blue-50/50' : ''}`}>
                <td className="p-4 text-center">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 accent-blue-600 cursor-pointer rounded"
                    checked={selectedIds.includes(acc.id)}
                    onChange={() => toggleSelectOne(acc.id)}
                  />
                </td>
                <td className="p-4 font-mono text-blue-600">{acc.accountCode}</td>
                <td className="p-4 font-medium text-gray-800">{acc.accountName}</td>
                <td className="p-4 text-gray-600">{acc.accountType}</td>
                <td className="p-4 text-gray-600">{acc.normalBalance}</td>
                <td className="p-4 text-center">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${acc.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {acc.isActive ? 'Aktif' : 'Non-Aktif'}
                  </span>
                </td>
                <td className="p-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button onClick={() => handleEdit(acc)} className="p-1 text-blue-600 hover:bg-blue-50 rounded" title="Edit">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(acc)} className="p-1 text-red-600 hover:bg-red-50 rounded" title="Hapus">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredCoa.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-400">
                  {state.erpCoa.length === 0 ? 'Belum ada data Chart of Accounts.' : 'Tidak ada akun yang sesuai dengan pencarian/filter.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
        
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t border-gray-100 bg-gray-50">
            <span className="text-xs sm:text-sm text-gray-600 text-center">
              Menampilkan {((currentPage - 1) * itemsPerPage) + 1} hingga {Math.min(currentPage * itemsPerPage, filteredCoa.length)} dari {filteredCoa.length} akun
            </span>
            <div className="flex gap-2 w-full sm:w-auto justify-center">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="flex-1 sm:flex-none px-3 py-2 bg-white border border-gray-300 rounded text-xs sm:text-sm font-semibold text-blue-700 hover:bg-blue-50 disabled:opacity-60 disabled:text-gray-400 disabled:bg-gray-100 disabled:border-gray-200 transition-colors"
              >
                Sebelumnya
              </button>
              <span className="px-4 py-2 bg-blue-100 text-blue-800 font-bold rounded text-xs sm:text-sm flex items-center justify-center">
                {currentPage} / {totalPages}
              </span>
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="flex-1 sm:flex-none px-3 py-2 bg-white border border-gray-300 rounded text-xs sm:text-sm font-semibold text-blue-700 hover:bg-blue-50 disabled:opacity-60 disabled:text-gray-400 disabled:bg-gray-100 disabled:border-gray-200 transition-colors"
              >
                Selanjutnya
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
