import React, { useState } from 'react';
import { useMasjidStore } from '../lib/store';
import { ReportSignatory } from '../types';
import { Edit3, Plus, Edit2, Trash2, Save, X } from 'lucide-react';

export const ReportSignatoryAdmin: React.FC = () => {
  const store = useMasjidStore();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<Omit<ReportSignatory, 'id'>>({
    role: '',
    name: '',
    title: '',
    orderIdx: 1
  });

  const resetForm = () => {
    setFormData({
      role: '',
      name: '',
      title: '',
      orderIdx: 1
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (sig: ReportSignatory) => {
    setFormData({
      role: sig.role,
      name: sig.name,
      title: sig.title,
      orderIdx: sig.orderIdx
    });
    setEditingId(sig.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Yakin ingin menghapus tanda tangan ini?')) {
      store.deleteReportSignatory(id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      store.updateReportSignatory(editingId, formData);
    } else {
      store.addReportSignatory(formData);
    }
    resetForm();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-blue-900 border border-blue-800 p-5 rounded-2xl">
        <div>
          <h3 className="text-lg font-bold font-serif text-white flex items-center gap-2">
            <Edit3 className="w-5 h-5 text-blue-300" />
            <span>Manajemen Tanda Tangan Laporan</span>
          </h3>
          <p className="text-xs text-blue-400 mt-1">
            Atur nama, jabatan, dan wewenang pejabat yang akan tertera pada *footer* laporan akuntansi / cetak PDF.
          </p>
        </div>

        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-lg shrink-0 border border-blue-400/30"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Pejabat TTD</span>
          </button>
        )}
      </div>

      <div className="bg-blue-900/50 border border-blue-800/50 p-5 rounded-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-semibold text-blue-300 block mb-2">Lokasi Cetak Laporan (Otomatis + Tanggal Cetak)</label>
            <input
              type="text"
              value={store.state.adminSettings?.reportPrintLocation || 'Sentul City, Bogor'}
              onChange={(e) => store.updateAdminSettings({ reportPrintLocation: e.target.value })}
              placeholder="Contoh: Sentul City, Bogor"
              className="w-full bg-blue-950 border border-blue-800 text-white text-sm rounded-xl px-4 py-2 outline-none focus:border-blue-500 transition-colors"
            />
            <p className="text-xs text-blue-400 mt-2">
              Contoh hasil: <strong>{(store.state.adminSettings?.reportPrintLocation || 'Sentul City, Bogor')}, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</strong>
            </p>
          </div>
          <div>
            <label className="text-sm font-semibold text-blue-300 block mb-2">Tembusan Laporan (Opsional)</label>
            <textarea
              value={store.state.adminSettings?.reportTembusan || ''}
              onChange={(e) => store.updateAdminSettings({ reportTembusan: e.target.value })}
              placeholder="Contoh:&#10;1. Ketua Dewan Pembina&#10;2. Arsip"
              rows={3}
              className="w-full bg-blue-950 border border-blue-800 text-white text-sm rounded-xl px-4 py-2 outline-none focus:border-blue-500 transition-colors resize-none"
            />
            <p className="text-xs text-blue-400 mt-2">
              Teks ini akan muncul di pojok kiri bawah laporan. Kosongkan jika tidak ada.
            </p>
          </div>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-blue-900 border-2 border-blue-500/40 p-6 rounded-2xl space-y-5 shadow-2xl animate-fadeIn">
          <div className="flex items-center justify-between border-b border-blue-800 pb-3">
            <h4 className="font-serif font-bold text-amber-300 text-base">
              {editingId ? 'Edit Data Penandatangan' : 'Tambah Penandatangan Laporan'}
            </h4>
            <button type="button" onClick={resetForm} className="text-blue-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-blue-300 block mb-1">Peran dalam Laporan (contoh: Dibuat Oleh):</label>
              <input
                type="text"
                required
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full bg-blue-950 border border-blue-800 text-white text-xs rounded-xl px-3 py-2 outline-none"
              />
            </div>
            
            <div>
              <label className="text-xs font-semibold text-blue-300 block mb-1">Nama Lengkap & Gelar:</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-blue-950 border border-blue-800 text-white text-xs rounded-xl px-3 py-2 outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-blue-300 block mb-1">Jabatan Resmi (contoh: Ketua DKM):</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-blue-950 border border-blue-800 text-white text-xs rounded-xl px-3 py-2 outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-blue-300 block mb-1">Urutan Tampil (kiri ke kanan = 1, 2, ...):</label>
              <input
                type="number"
                required
                value={formData.orderIdx}
                onChange={(e) => setFormData({ ...formData, orderIdx: Number(e.target.value) })}
                className="w-full bg-blue-950 border border-blue-800 text-white text-xs rounded-xl px-3 py-2 outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end pt-3">
            <button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 px-6 rounded-xl flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-900/50">
              <Save className="w-4 h-4" />
              <span>{editingId ? 'Simpan Perubahan' : 'Tambah Penandatangan'}</span>
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {[...(store.state.reportSignatories || [])].sort((a, b) => a.orderIdx - b.orderIdx).map((sig) => (
          <div key={sig.id} className="bg-blue-900 border border-blue-800 rounded-2xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-2 border-b border-blue-800 pb-2">
                <span className="text-[10px] bg-blue-800 text-blue-200 px-2 py-0.5 rounded uppercase font-bold tracking-widest">{sig.role}</span>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => handleEdit(sig)} className="text-blue-400 hover:text-amber-400 p-1"><Edit2 className="w-3.5 h-3.5" /></button>
                  <button onClick={() => handleDelete(sig.id)} className="text-rose-400 hover:text-rose-300 p-1"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
              <h4 className="font-bold text-white text-sm mt-3">{sig.name}</h4>
              <p className="text-xs text-blue-300">{sig.title}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
