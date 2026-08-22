import React, { useState } from 'react';
import { useMasjidStore } from '../../lib/store';
import { CheckCircle2, XCircle, FileText, Search, MessageCircle } from 'lucide-react';
import { formatRupiahFull } from '../../lib/islamicUtils';

export function VerifikasiZiswaf() {
  const { state, updateDonationStatus } = useMasjidStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'menunggu_verifikasi' | 'berhasil' | 'ditolak' | 'all'>('menunggu_verifikasi');
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const [selectedProof, setSelectedProof] = useState<string | null>(null);

  const getProgramTitle = (id: string) => {
    const prog = state.programs.find(p => p.id === id);
    return prog ? prog.title : 'General / Tidak Diketahui';
  };

  const handleApprove = (id: string) => {
    if (window.confirm('Yakin ingin menyetujui transaksi ini? Dana akan otomatis ditambahkan ke total program.')) {
      if (updateDonationStatus) {
        updateDonationStatus(id, 'berhasil');
        // Logic to insert to journal should ideally be handled by store or backend
      } else {
        alert('Fungsi updateDonationStatus belum diimplementasikan di store utama.');
      }
    }
  };

  const handleReject = (id: string) => {
    if (window.confirm('Yakin ingin menolak transaksi ini?')) {
      if (updateDonationStatus) {
        updateDonationStatus(id, 'ditolak');
      }
    }
  };

  const handleSendReceipt = (donation: any) => {
    const text = `Assalamu'alaikum wr. wb.\n\nAlhamdulillah, donasi Anda untuk program *${getProgramTitle(donation.programId)}* sebesar *${formatRupiahFull(donation.totalAmount)}* telah kami terima dan verifikasi pada ${new Date().toLocaleDateString('id-ID')}.\n\nJazakumullah khairan katsiran. Semoga Allah SWT membalas kebaikan Anda dengan pahala yang berlipat ganda, memberkahi rezeki Anda, dan menjadikannya sebagai amal jariyah. Aamiin.\n\nSalam hangat,\n*Pengurus Masjid Tazkia*`;
    const phone = donation.donorPhone ? donation.donorPhone.replace(/^0/, '62').replace(/\D/g, '') : '';
    if (phone) {
      window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, '_blank');
    } else {
      alert('Nomor telepon jamaah tidak tersedia.');
    }
  };

  const filteredDonations = state.donations.filter(d => {
    const matchSearch = d.donorName.toLowerCase().includes(searchQuery.toLowerCase()) || d.transactionRef.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === 'all' ? true : d.status === statusFilter;
    return matchSearch && matchStatus;
  }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm print:hidden">
        <div>
          <h3 className="font-bold text-lg text-blue-900">Verifikasi Transaksi ZISWAF</h3>
          <p className="text-xs text-gray-500">Persetujuan dana masuk jamaah (Manual Transfer).</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Cari nama atau referensi..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 text-sm rounded-lg focus:outline-none focus:border-blue-500 text-gray-800"
            />
          </div>
          <select 
            value={statusFilter} 
            onChange={e => setStatusFilter(e.target.value as any)}
            className="w-full sm:w-auto p-2 bg-gray-50 border border-gray-200 text-sm rounded-lg focus:outline-none focus:border-blue-500 text-gray-800"
          >
            <option value="menunggu_verifikasi">Menunggu Verifikasi</option>
            <option value="berhasil">Disetujui (Berhasil)</option>
            <option value="ditolak">Ditolak</option>
            <option value="all">Semua Status</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-xs sm:text-sm min-w-[800px]">
            <thead className="bg-gray-50 border-b border-gray-100 text-gray-600">
              <tr>
                <th className="p-4 font-semibold">Tgl & Referensi</th>
                <th className="p-4 font-semibold">Donatur</th>
                <th className="p-4 font-semibold">Program Tujuan</th>
                <th className="p-4 font-semibold text-right">Nominal (Rp)</th>
                <th className="p-4 font-semibold text-center">Status</th>
                <th className="p-4 font-semibold text-center">Bukti</th>
                <th className="p-4 font-semibold text-center w-32">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-slate-800">
              {(() => {
                const totalPages = Math.ceil(filteredDonations.length / itemsPerPage) || 1;
                const paginatedDonations = filteredDonations.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
                
                if (currentPage > totalPages) setCurrentPage(1);

                if (paginatedDonations.length > 0) {
                  return paginatedDonations.map(donation => (
                    <tr key={donation.id} className="hover:bg-gray-50">
                      <td className="p-4 align-top w-1/6">
                        <div className="font-semibold">{new Date(donation.createdAt).toLocaleDateString('id-ID')}</div>
                        <div className="font-mono text-xs text-blue-600 mt-1">{donation.transactionRef}</div>
                      </td>
                      <td className="p-4 align-top font-medium text-gray-700 w-1/5">
                        {donation.donorName}
                        <span className="block mt-1 text-[10px] text-gray-400">
                          {donation.donorPhone || 'No Phone'} | {donation.donorEmail || 'No Email'}
                        </span>
                      </td>
                      <td className="p-4 align-top text-gray-600">
                        {getProgramTitle(donation.programId)}
                      </td>
                      <td className="p-4 align-top text-right font-mono font-bold text-emerald-600">
                        {donation.totalAmount.toLocaleString('id-ID')}
                      </td>
                      <td className="p-4 align-top text-center">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                          donation.status === 'berhasil' ? 'bg-emerald-100 text-emerald-700'
                          : donation.status === 'ditolak' ? 'bg-red-100 text-red-700'
                          : 'bg-amber-100 text-amber-700'
                        }`}>
                          {donation.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="p-4 align-middle text-center">
                        {donation.proofUrl ? (
                          <button 
                            onClick={() => setSelectedProof(donation.proofUrl || null)}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-600 rounded text-xs hover:bg-blue-100 font-semibold transition-colors cursor-pointer"
                          >
                            <FileText className="w-3 h-3" /> Cek Bukti
                          </button>
                        ) : (
                          <span className="text-xs text-gray-400 italic">Tanpa Bukti</span>
                        )}
                      </td>
                      <td className="p-4 align-middle text-center">
                        {donation.status === 'menunggu_verifikasi' ? (
                          <div className="flex justify-center gap-2">
                            <button onClick={() => handleApprove(donation.id)} className="p-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white rounded-lg transition" title="Setujui">
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleReject(donation.id)} className="p-1.5 bg-red-50 text-red-600 hover:bg-red-500 hover:text-white rounded-lg transition" title="Tolak">
                              <XCircle className="w-4 h-4" />
                            </button>
                          </div>
                        ) : donation.status === 'berhasil' ? (
                          <button onClick={() => handleSendReceipt(donation)} className="p-1.5 bg-green-50 text-green-600 hover:bg-green-500 hover:text-white rounded-lg transition" title="Kirim Tanda Terima (WA)">
                            <MessageCircle className="w-4 h-4" />
                          </button>
                        ) : (
                          <span className="text-gray-400 text-xs italic">-</span>
                        )}
                      </td>
                    </tr>
                  ));
                } else {
                  return (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-gray-400 font-medium text-sm">
                        Tidak ada data donasi untuk filter yang dipilih.
                      </td>
                    </tr>
                  );
                }
              })()}
            </tbody>
          </table>
          {/* Pagination Controls */}
          {(() => {
            const totalPages = Math.ceil(filteredDonations.length / itemsPerPage) || 1;
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
      {/* Bukti Modal */}
      {selectedProof && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-4 relative shadow-2xl flex flex-col">
            <button
              onClick={() => setSelectedProof(null)}
              className="absolute -top-3 -right-3 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 cursor-pointer"
            >
              <XCircle className="w-5 h-5" />
            </button>
            <h4 className="font-bold text-gray-800 mb-3 text-center border-b pb-2">Bukti Struk Transfer</h4>
            <div className="bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center min-h-[300px]">
              <img src={selectedProof} alt="Bukti Transfer" className="max-w-full max-h-[70vh] object-contain" />
            </div>
            <button
              onClick={() => setSelectedProof(null)}
              className="mt-4 w-full bg-blue-900 text-white py-2 rounded-xl font-semibold hover:bg-blue-800"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
