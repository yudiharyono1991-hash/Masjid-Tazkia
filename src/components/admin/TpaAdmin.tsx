import React from 'react';
import { useMasjidStore } from '../../lib/store';
import { TpaRegistration } from '../../types';
import { BookOpen, CheckCircle, Trash2, IndianRupee, DollarSign } from 'lucide-react';
import { formatRupiahFull } from '../../lib/islamicUtils';

export const TpaAdmin: React.FC = () => {
  const { state, updateTpaRegistrationStatus, addErpJournalEntry, addErpJournal } = useMasjidStore();
  const tpaList = state.tpaRegistrations || [];

  const handleVerifyPayment = (tpa: TpaRegistration) => {
    if (confirm(`Verifikasi pembayaran SPP/Pendaftaran untuk ${tpa.namaLengkap} sebesar ${formatRupiahFull(tpa.feeAmount)}? Uang akan masuk ke Laba/Rugi.`)) {
      updateTpaRegistrationStatus(tpa.id, 'verified', 'paid');

      // Create Jurnal Umum
      const ref = `TPA-${Math.floor(1000 + Math.random() * 9000)}`;
      addErpJournal({
        id: `jou-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        journalNo: ref,
        description: `Penerimaan Biaya TPA: ${tpa.namaLengkap} (${tpa.program})`,
        reference: ref,
        status: 'Posted'
      });

      // Debit Kas Operasional (1-10010)
      addErpJournalEntry({
        id: `ent-${Date.now()}-1`,
        journalId: ref, 
        accountId: '1-10010', // Simplified ID
        accountCode: '1-10010',
        debit: tpa.feeAmount,
        credit: 0,
        description: `Terima SPP ${tpa.namaLengkap}`
      });

      // Credit Pendapatan Pendidikan/TPA (4-40010 or similar, assuming 4-40030 for TPA)
      addErpJournalEntry({
        id: `ent-${Date.now()}-2`,
        journalId: ref,
        accountId: '4-40030', // Simplified ID
        accountCode: '4-40030', 
        debit: 0,
        credit: tpa.feeAmount,
        description: `Pendapatan SPP ${tpa.namaLengkap}`
      });

      alert('Berhasil diverifikasi dan dijurnal!');
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b">
        <div className="p-3 bg-blue-100 rounded-lg text-blue-700">
          <BookOpen className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800">Manajemen Santri TPA</h2>
          <p className="text-sm text-slate-500">Kelola pendaftaran dan pembayaran TPA Anak & Dewasa</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-600 font-semibold border-y">
            <tr>
              <th className="py-3 px-4">Tanggal</th>
              <th className="py-3 px-4">Nama Santri</th>
              <th className="py-3 px-4">Program</th>
              <th className="py-3 px-4">Kontak Wali</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {tpaList.map(tpa => (
              <tr key={tpa.id} className="hover:bg-slate-50 transition-colors">
                <td className="py-3 px-4">{new Date(tpa.createdAt).toLocaleDateString('id-ID')}</td>
                <td className="py-3 px-4 font-medium text-slate-800">
                  {tpa.namaLengkap}<br/>
                  <span className="text-xs text-slate-500 font-normal">Usia: {tpa.usia} thn</span>
                </td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${tpa.program === 'Anak' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>
                    {tpa.program}
                  </span>
                </td>
                <td className="py-3 px-4">
                  {tpa.namaWali}<br/>
                  <a href={`https://wa.me/${tpa.whatsapp}`} target="_blank" className="text-blue-600 hover:underline">{tpa.whatsapp}</a>
                </td>
                <td className="py-3 px-4">
                  {tpa.paymentStatus === 'paid' ? (
                    <span className="inline-flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full text-xs font-medium">
                      <CheckCircle className="w-3 h-3" /> Lunas
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-amber-600 bg-amber-50 px-2 py-1 rounded-full text-xs font-medium">
                      Menunggu Pembayaran
                    </span>
                  )}
                </td>
                <td className="py-3 px-4">
                  {tpa.paymentStatus === 'unpaid' && (
                    <button 
                      onClick={() => handleVerifyPayment(tpa)}
                      className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-blue-700 transition"
                    >
                      Terima Uang
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {tpaList.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-8 text-slate-500">
                  Belum ada data pendaftar TPA.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
