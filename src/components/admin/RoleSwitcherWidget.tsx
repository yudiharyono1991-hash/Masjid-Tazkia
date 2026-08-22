import React, { useState } from 'react';
import { useMasjidStore } from '../../lib/store';
import { Users, X, Check, ChevronDown, ChevronUp } from 'lucide-react';

// ============================================================
// WIDGET UJI COBA PERAN
// Hanya untuk keperluan pengujian internal DKM.
// Set VITE_SHOW_TEST_WIDGET=false di .env untuk menonaktifkan.
// ============================================================
const SHOW_TEST_WIDGET = import.meta.env.VITE_SHOW_TEST_WIDGET === 'true';

export function RoleSwitcherWidget() {
  const { state, login } = useMasjidStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  if (!SHOW_TEST_WIDGET || !isVisible) return null;

  const currentRole = state.appRoles?.find(r => r.id === state.session?.role);
  const isLoggedIn = !!state.session?.isLoggedIn;
  const currentName = state.session?.name || 'Tamu';
  const currentRoleName = currentRole?.name || state.session?.role || 'Tidak diketahui';

  const getRoleBadgeColor = (roleId: string | undefined) => {
    switch (roleId) {
      case 'direktur':
      case 'ketua_dkm':
      case 'ketua_dewan_pembina': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'bendahara':
      case 'keuangan': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'jamaah': return 'bg-gray-100 text-gray-600 border-gray-200';
      default: return 'bg-blue-100 text-blue-700 border-blue-200';
    }
  };

  const handleRoleChange = (roleId: string, roleName: string) => {
    login(`test_${roleId}@tazkia.ac.id`, `[Uji] ${roleName}`, roleId);
    setIsOpen(false);
  };

  const handleHide = () => {
    if (window.confirm('Sembunyikan widget uji coba? Refresh halaman untuk memunculkannya kembali.')) {
      setIsVisible(false);
    }
  };

  const testRoles = [
    { id: 'jamaah',              name: 'Staf / Jamaah Biasa',   icon: '👤', desc: 'Hanya bisa mengajukan' },
    { id: 'bendahara',           name: 'Bendahara',              icon: '💼', desc: 'Verifikasi tahap 1' },
    { id: 'direktur',            name: 'Direktur / Ketua DKM',  icon: '🏛️', desc: 'Persetujuan akhir' },
    { id: 'ketua_dewan_pembina', name: 'Super Admin',            icon: '⚡', desc: 'Akses penuh semua fitur' },
  ];

  return (
    <div className="fixed bottom-24 right-4 sm:bottom-6 sm:right-6 z-[9998] font-sans flex flex-col items-end">
      {isOpen && (
        <div className="mb-3 w-64 bg-white rounded-2xl shadow-2xl border border-blue-100 overflow-hidden">
          {/* Header */}
          <div className="bg-blue-900 bg-gradient-to-r from-blue-900 to-blue-800 p-3 text-white flex justify-between items-center">
            <h4 className="text-sm font-bold flex items-center gap-2">
              <Users className="w-4 h-4" />
              Uji Coba Peran
            </h4>
            <button onClick={handleHide} className="text-blue-300 hover:text-white transition-colors" title="Sembunyikan Widget">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Sesi Aktif */}
          <div className="px-3 py-2.5 bg-blue-50 border-b border-blue-100">
            <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-1.5">Sesi Aktif Sekarang</p>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                {currentName.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-gray-900 truncate">{currentName}</p>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getRoleBadgeColor(state.session?.role)}`}>
                  {currentRoleName}
                </span>
              </div>
              {isLoggedIn && (
                <span className="ml-auto flex items-center gap-1 text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
                  Aktif
                </span>
              )}
            </div>
          </div>

          {/* Role List */}
          <div className="p-2 space-y-1 bg-gray-50">
            <p className="text-[10px] text-gray-500 px-2 pt-1 pb-0.5 font-bold uppercase tracking-wider">Ganti Peran:</p>
            {testRoles.map(r => (
              <button
                key={r.id}
                onClick={() => handleRoleChange(r.id, r.name)}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2.5 ${
                  state.session?.role === r.id
                    ? 'bg-blue-100 text-blue-700 border border-blue-300 shadow-sm'
                    : 'bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-700 border border-transparent hover:border-blue-200'
                }`}
              >
                <span className="text-base shrink-0">{r.icon}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="truncate">{r.name}</span>
                    {state.session?.role === r.id && <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
                  </div>
                  <p className="text-[10px] text-gray-500 font-normal truncate">{r.desc}</p>
                </div>
              </button>
            ))}
          </div>

          <div className="px-3 py-2 border-t border-gray-200 bg-white">
            <p className="text-[10px] text-gray-400 text-center leading-tight">
              🔒 Widget ini hanya aktif dalam mode testing.
            </p>
          </div>
        </div>
      )}

      {/* FAB Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-blue-700 bg-gradient-to-r from-blue-700 to-blue-600 text-white rounded-2xl px-3 py-2 shadow-lg shadow-blue-900/30 hover:shadow-xl hover:scale-105 transition-all relative"
        title="Uji Coba Peran"
      >
        <Users className="w-4 h-4 shrink-0" />
        <div className="text-left max-w-[110px]">
          <p className="text-[9px] text-blue-300 leading-none">Sesi Aktif</p>
          <p className="text-[11px] font-bold truncate leading-tight">
            {currentName.replace('[Uji] ', '').replace('Uji Coba: ', '')}
          </p>
        </div>
        {isOpen ? <ChevronDown className="w-3.5 h-3.5 text-blue-300" /> : <ChevronUp className="w-3.5 h-3.5 text-blue-300" />}
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500 border border-white"></span>
        </span>
      </button>
    </div>
  );
}
