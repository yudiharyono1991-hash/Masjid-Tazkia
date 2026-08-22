import React from 'react';
import { useMasjidStore } from '../../lib/store';
import { HeartHandshake, CheckCircle } from 'lucide-react';

export const MuallafAdmin: React.FC = () => {
  const { state, updateMuallafRegistrationStatus } = useMasjidStore();
  const muallafList = state.muallafRegistrations || [];

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b">
        <div className="p-3 bg-amber-100 rounded-lg text-amber-700">
          <HeartHandshake className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800">Muallaf Center</h2>
          <p className="text-sm text-slate-500">Data pendaftaran ikrar syahadat dan bimbingan</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-600 font-semibold border-y">
            <tr>
              <th className="py-3 px-4">Tanggal Daftar</th>
              <th className="py-3 px-4">Nama Lengkap / NIK</th>
              <th className="py-3 px-4">Kontak</th>
              <th className="py-3 px-4">Rencana Ikrar</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {muallafList.map(m => (
              <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                <td className="py-3 px-4">{new Date(m.createdAt).toLocaleDateString('id-ID')}</td>
                <td className="py-3 px-4 font-medium text-slate-800">
                  {m.namaLengkap}<br/>
                  <span className="text-xs text-slate-500 font-normal">NIK: {m.nik}</span>
                </td>
                <td className="py-3 px-4">
                  <a href={`https://wa.me/${m.whatsapp}`} target="_blank" className="text-blue-600 hover:underline">{m.whatsapp}</a>
                  {m.email && <div className="text-xs text-slate-500">{m.email}</div>}
                </td>
                <td className="py-3 px-4">{m.tanggalIkrar || '-'}</td>
                <td className="py-3 px-4">
                  {m.status === 'completed' ? (
                    <span className="inline-flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full text-xs font-medium">
                      <CheckCircle className="w-3 h-3" /> Selesai
                    </span>
                  ) : m.status === 'scheduled' ? (
                    <span className="inline-flex items-center gap-1 text-blue-600 bg-blue-50 px-2 py-1 rounded-full text-xs font-medium">
                      Dijadwalkan
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-amber-600 bg-amber-50 px-2 py-1 rounded-full text-xs font-medium">
                      Menunggu
                    </span>
                  )}
                </td>
                <td className="py-3 px-4 space-x-2">
                  {m.status === 'pending' && (
                    <button 
                      onClick={() => updateMuallafRegistrationStatus(m.id, 'scheduled')}
                      className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-blue-700 transition"
                    >
                      Jadwalkan
                    </button>
                  )}
                  {m.status === 'scheduled' && (
                    <button 
                      onClick={() => updateMuallafRegistrationStatus(m.id, 'completed')}
                      className="bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-emerald-700 transition"
                    >
                      Selesai Ikrar
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {muallafList.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-8 text-slate-500">
                  Belum ada data pendaftar Muallaf.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
