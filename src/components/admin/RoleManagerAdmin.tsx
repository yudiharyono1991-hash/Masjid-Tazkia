import React, { useState } from 'react';
import { useMasjidStore } from '../../lib/store';
import { Shield, Plus, X, Edit, Trash2, CheckCircle } from 'lucide-react';
import { AppRole } from '../../types';

export function RoleManagerAdmin() {
  const { state, setAppRoles } = useMasjidStore();
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState<AppRole | null>(null);

  const availablePermissions = [
    { id: 'semua', label: 'Full Access (Semua Akses)' },
    { id: 'keuangan', label: 'Keuangan & Akuntansi' },
    { id: 'approval_bendahara', label: 'Approval Bendahara (Pencairan)' },
    { id: 'approval_direktur', label: 'Approval Direktur (Pencairan)' },
    { id: 'galeri', label: 'Galeri & Media' },
    { id: 'qurban', label: 'Manajemen Qurban' },
    { id: 'sewa', label: 'Penyewaan Gedung' },
    { id: 'agenda', label: 'Kalender & Jadwal Petugas' },
    { id: 'master_data', label: 'Master Data & Pengaturan' },
    { id: 'laporan', label: 'Laporan & Audit Log' },
    { id: 'inventaris', label: 'Manajemen Inventaris' },
    { id: 'program', label: 'Program & Pengumuman' },
    { id: 'ziswaf', label: 'Penerimaan ZISWAF' },
    { id: 'donasi', label: 'Penerimaan Donasi Biasa' },
    { id: 'users', label: 'Manajemen Akun Jamaah' }
  ];

  const handleEdit = (role: AppRole) => {
    setIsEditing(role.id);
    setFormData({ ...role });
  };

  const handleAddNew = () => {
    setIsEditing('new');
    setFormData({
      id: `role_${Date.now()}`,
      name: '',
      type: 'admin_masjid',
      permissions: []
    });
  };

  const handleSave = () => {
    if (!formData || !formData.name) return;

    const isExisting = state.appRoles.some(r => r.id === formData.id);
    if (isExisting) {
      setAppRoles(state.appRoles.map(r => r.id === formData.id ? formData : r));
    } else {
      setAppRoles([...state.appRoles, formData]);
    }

    setIsEditing(null);
    setFormData(null);
  };

  const handleDelete = (id: string) => {
    if (['direktur', 'ketua_dkm', 'bendahara'].includes(id)) {
      alert('Role sistem default tidak dapat dihapus.');
      return;
    }
    if (window.confirm('Hapus role ini?')) {
      setAppRoles(state.appRoles.filter(r => r.id !== id));
    }
  };

  const togglePermission = (permId: string) => {
    if (!formData) return;
    const current = formData.permissions || [];
    if (current.includes(permId)) {
      setFormData({ ...formData, permissions: current.filter(p => p !== permId) });
    } else {
      setFormData({ ...formData, permissions: [...current, permId] });
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm mt-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-lg">Manajemen Peran & Izin (Role Base Access Control)</h3>
            <p className="text-sm text-gray-500">Atur hak akses staf dan pengurus untuk masing-masing modul.</p>
          </div>
        </div>
        {!isEditing && (
          <button 
            onClick={handleAddNew}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors"
          >
            <Plus className="w-4 h-4" /> Tambah Role Baru
          </button>
        )}
      </div>

      {isEditing && formData ? (
        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 mb-6 space-y-6 animate-in fade-in slide-in-from-top-4">
          <div className="flex justify-between items-center border-b border-gray-200 pb-4">
            <h4 className="font-bold text-gray-800">{isEditing === 'new' ? 'Tambah Role Baru' : 'Edit Role & Izin'}</h4>
            <button onClick={() => setIsEditing(null)} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Nama Role</label>
              <input 
                type="text" 
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-900 bg-white"
                placeholder="Misal: Staf Keuangan, Humas, dll"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Tipe Entitas</label>
              <select
                value={formData.type}
                onChange={e => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 bg-white"
              >
                <option value="pengurus_dkm">Pengurus DKM (Level Atas)</option>
                <option value="admin_masjid">Staf / Admin Masjid</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Hak Akses Modul (Izin)</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {availablePermissions.map(perm => {
                const isActive = (formData.permissions || []).includes(perm.id);
                return (
                  <button
                    key={perm.id}
                    onClick={() => togglePermission(perm.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors border text-left
                      ${isActive ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}
                    `}
                  >
                    <div className={`w-4 h-4 rounded flex items-center justify-center border ${isActive ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-300'}`}>
                      {isActive && <CheckCircle className="w-3 h-3" />}
                    </div>
                    {perm.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button 
              onClick={() => setIsEditing(null)}
              className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-50"
            >
              Batal
            </button>
            <button 
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700"
            >
              Simpan Role
            </button>
          </div>
        </div>
      ) : null}

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-gray-50 border-y border-gray-200 text-gray-600">
              <th className="px-4 py-3 font-semibold">Nama Role</th>
              <th className="px-4 py-3 font-semibold">Tipe Entitas</th>
              <th className="px-4 py-3 font-semibold">Izin Akses (Permissions)</th>
              <th className="px-4 py-3 font-semibold text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {state.appRoles.map(role => (
              <tr key={role.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-bold text-gray-900">{role.name}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-md text-xs font-medium ${role.type === 'pengurus_dkm' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                    {role.type === 'pengurus_dkm' ? 'Pengurus' : 'Staf'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {(role.permissions || []).includes('semua') ? (
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] rounded uppercase font-bold tracking-wider">Full Access</span>
                    ) : (
                      (role.permissions || []).slice(0, 3).map(p => (
                        <span key={p} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] rounded uppercase font-medium">{p}</span>
                      ))
                    )}
                    {(role.permissions || []).length > 3 && !(role.permissions || []).includes('semua') && (
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] rounded">+{role.permissions.length - 3} lagi</span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => handleEdit(role)}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    {!['direktur', 'ketua_dkm', 'bendahara'].includes(role.id) && (
                      <button 
                        onClick={() => handleDelete(role.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Hapus"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
