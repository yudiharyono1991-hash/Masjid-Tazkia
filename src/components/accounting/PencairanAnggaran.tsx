import React, { useState } from 'react';
import { useMasjidStore } from '../../lib/store';
import { CheckCircle, XCircle, FileText, Send, AlertCircle, Clock } from 'lucide-react';
import { ERPDisbursementRequest } from '../../types';

export function PencairanAnggaran() {
  const { state, addErpDisbursement, updateErpDisbursementStatus, updateErpDisbursementRequest, deleteErpDisbursementRequest } = useMasjidStore();
  const [activeTab, setActiveTab] = useState<'ajukan' | 'approval'>('ajukan');

  // Date utils
  const getFirstDayOfMonth = () => { const d = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" })); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-01`; };
  const getToday = () => { const d = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" })); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; };

  const [startDate, setStartDate] = useState(getFirstDayOfMonth());
  const [endDate, setEndDate] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() + 1);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  });

  // Staf Form State
  const [selectedBudgetId, setSelectedBudgetId] = useState('');
  const [amount, setAmount] = useState<number | ''>('');
  const [purpose, setPurpose] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  // Director Approval State
  const [rejectionReason, setRejectionReason] = useState('');
  const [rejectingId, setRejectingId] = useState<string | null>(null);

  const currentRole = state.appRoles.find(r => r.id === state.session?.role);
  const permissions = currentRole?.permissions || [];
  
  const canApproveBendahara = permissions.includes('approval_bendahara');
  const canApproveKetuaDKM = permissions.includes('approval_ketua');
  const canApproveDirektur = permissions.includes('approval_direktur');
  const canApprove = canApproveBendahara || canApproveKetuaDKM || canApproveDirektur;

  // Calculate budget utilization
  const getBudgetBalance = (budgetId: string) => {
    const budget = state.erpBudgets.find(b => b.id === budgetId);
    if (!budget) return 0;
    const approvedDisbursements = state.erpDisbursements
      .filter(d => d.budgetId === budgetId && d.status === 'Approved')
      .reduce((sum, d) => sum + d.amount, 0);
    return budget.amount - approvedDisbursements;
  };

  const handleAjukan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBudgetId || !amount || amount <= 0 || !purpose) return;

    const balance = getBudgetBalance(selectedBudgetId);
    if (amount > balance) {
      alert(`Nominal pengajuan (Rp ${amount.toLocaleString('id-ID')}) melebihi sisa anggaran yang tersedia (Rp ${balance.toLocaleString('id-ID')}).`);
      return;
    }

    if (editingId) {
      updateErpDisbursementRequest(editingId, {
        budgetId: selectedBudgetId,
        amount: Number(amount),
        purpose,
        status: 'Pending'
      });
      alert('Pengajuan berhasil diperbarui dan status kembali menjadi Pending untuk diverifikasi ulang.');
      setEditingId(null);
    } else {
      addErpDisbursement({
        id: `REQ-${Date.now()}`,
        budgetId: selectedBudgetId,
        amount: Number(amount),
        purpose,
        requestDate: new Date().toISOString(),
        requestedBy: state.session?.name || 'Staf / Admin',
        status: 'Pending'
      });
      alert('Pengajuan pencairan berhasil dikirim dan menunggu persetujuan.');
    }

    setSelectedBudgetId('');
    setAmount('');
    setPurpose('');
  };

  const handleEditClick = (d: ERPDisbursementRequest) => {
    setEditingId(d.id);
    setSelectedBudgetId(d.budgetId);
    setAmount(d.amount);
    setPurpose(d.purpose);
    setActiveTab('ajukan');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setSelectedBudgetId('');
    setAmount('');
    setPurpose('');
  };

  const handleDeleteClick = (id: string) => {
    if (window.confirm('Yakin ingin menghapus pengajuan ini secara permanen?')) {
      deleteErpDisbursementRequest(id);
    }
  };

  const handleApprove = (id: string, currentStatus: string) => {
    if (canApproveBendahara && !canApproveKetuaDKM && !canApproveDirektur && currentStatus !== 'Pending') {
      alert('Sebagai Bendahara, Anda hanya dapat memverifikasi pengajuan yang berstatus Pending.');
      return;
    }
    if (canApproveKetuaDKM && !canApproveDirektur && currentStatus !== 'Verified') {
      alert('Sebagai Ketua DKM, Anda hanya dapat menyetujui pengajuan yang sudah diverifikasi Bendahara.');
      return;
    }
    if (canApproveDirektur && currentStatus !== 'ApprovedKetua') {
      alert('Sebagai Direktur, Anda hanya dapat menyetujui pengajuan yang sudah diverifikasi Bendahara (status: Menunggu Direktur).');
      return;
    }
    const actionLabel = (canApproveBendahara && !canApproveKetuaDKM && !canApproveDirektur) ? 'verifikasi' : 'setujui';
    const note = window.prompt(`Masukkan catatan/keterangan untuk ${actionLabel} (Wajib):`);
    if (note === null) return;
    if (note.trim() === '') {
      alert('Catatan/Keterangan wajib diisi!');
      return;
    }
    
    if (window.confirm(`Yakin ingin ${actionLabel} pengajuan ini?`)) {
      let nextStatus: 'Pending' | 'Verified' | 'ApprovedKetua' | 'Approved' | 'Rejected' = 'Approved';
      if (canApproveBendahara && !canApproveKetuaDKM && !canApproveDirektur) nextStatus = 'Verified';
      else if (canApproveKetuaDKM && !canApproveDirektur) nextStatus = 'ApprovedKetua';
      else nextStatus = 'Approved';
      updateErpDisbursementStatus(id, nextStatus, state.session?.name || 'Approver', note);
    }
  };

  const submitReject = (id: string) => {
    if (!rejectionReason) {
      alert('Alasan penolakan wajib diisi.');
      return;
    }
    updateErpDisbursementStatus(id, 'Rejected', state.session?.name || 'Approver', rejectionReason);
    setRejectingId(null);
    setRejectionReason('');
  };

  // Only show budgets that have a positive balance
  const activeBudgets = state.erpBudgets.map(b => ({
    ...b,
    balance: getBudgetBalance(b.id),
    account: state.erpCoa.find(c => c.id === b.accountId)
  })).filter(b => b.balance > 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="flex bg-white rounded-xl border border-gray-200 overflow-hidden text-sm font-semibold w-full sm:w-max shadow-sm">
          <button
          onClick={() => setActiveTab('ajukan')}
          className={`px-6 py-3 transition-colors ${activeTab === 'ajukan' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
        >
          Form Pengajuan
        </button>
        {canApprove && (
          <button
            onClick={() => setActiveTab('approval')}
            className={`px-6 py-3 transition-colors flex items-center gap-2 ${activeTab === 'approval' ? 'bg-emerald-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            Persetujuan (Approval)
            {state.erpDisbursements.filter(d => (d.status === 'Pending' && canApproveBendahara) || (d.status === 'Verified' && canApproveKetuaDKM) || (d.status === 'ApprovedKetua' && canApproveDirektur)).length > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                {state.erpDisbursements.filter(d => (d.status === 'Pending' && canApproveBendahara) || (d.status === 'Verified' && canApproveKetuaDKM) || (d.status === 'ApprovedKetua' && canApproveDirektur)).length}
              </span>
            )}
          </button>
        )}
      </div>

        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm">
          <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="border border-gray-300 bg-white text-gray-900 rounded-lg px-2 py-1.5 text-sm font-medium focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
          <span className="text-gray-500 font-bold text-sm">s/d</span>
          <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="border border-gray-300 bg-white text-gray-900 rounded-lg px-2 py-1.5 text-sm font-medium focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
        </div>
      </div>

      {activeTab === 'ajukan' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-blue-100 shadow-sm">
            <h3 className="font-bold text-lg text-blue-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              {editingId ? 'Edit Pengajuan (Koreksi)' : 'Buat Pengajuan Baru'}
            </h3>
            {editingId && (
              <div className="mb-4 bg-amber-50 border border-amber-200 text-amber-800 p-3 rounded-lg text-xs">
                <strong>Mode Edit:</strong> Menyimpan perubahan akan mereset status pengajuan kembali menjadi <b>Pending</b> untuk diverifikasi ulang oleh Bendahara.
              </div>
            )}
            <form onSubmit={handleAjukan} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase">Pilih Pos Anggaran</label>
                <select
                  required
                  value={selectedBudgetId}
                  onChange={e => setSelectedBudgetId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl bg-gray-50 text-gray-900 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                >
                  <option value="">-- Pilih Anggaran --</option>
                  {activeBudgets.map(b => (
                    <option key={b.id} value={b.id}>
                      Tahun {b.year} | {b.account?.accountName} (Sisa: Rp {b.balance.toLocaleString('id-ID')})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase">Nominal Pencairan (Rp)</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={amount}
                  onChange={e => setAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl bg-gray-50 text-gray-900 text-sm font-medium outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  placeholder="Contoh: 5000000"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase">Tujuan / Rincian Penggunaan</label>
                <textarea
                  required
                  rows={3}
                  value={purpose}
                  onChange={e => setPurpose(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl bg-gray-50 text-gray-900 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 resize-none"
                  placeholder="Jelaskan untuk apa dana ini akan digunakan..."
                ></textarea>
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-md shadow-blue-500/20"
                >
                  <Send className="w-4 h-4" /> {editingId ? 'Simpan Perubahan' : 'Kirim Pengajuan'}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-bold transition-colors"
                  >
                    Batal
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
            <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
              <h3 className="font-bold text-gray-800">Riwayat Pengajuan Saya</h3>
            </div>
            <div className="overflow-x-auto flex-1 custom-scrollbar">
              <table className="w-full text-left border-collapse text-xs sm:text-sm min-w-[600px]">
                <thead>
                  <tr className="bg-white border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500">
                    <th className="p-4 font-bold">Tgl Pengajuan</th>
                    <th className="p-4 font-bold">Pos Anggaran</th>
                    <th className="p-4 font-bold text-right">Nominal (Rp)</th>
                    <th className="p-4 font-bold">Tujuan & Catatan</th>
                    <th className="p-4 font-bold text-center">Status</th>
                    <th className="p-4 font-bold text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {state.erpDisbursements.filter(d => d.requestDate.split('T')[0] >= startDate && d.requestDate.split('T')[0] <= endDate).length > 0 ? (
                    state.erpDisbursements.filter(d => d.requestDate.split('T')[0] >= startDate && d.requestDate.split('T')[0] <= endDate).map(d => {
                      const budget = state.erpBudgets.find(b => b.id === d.budgetId);
                      const coa = state.erpCoa.find(c => c.id === budget?.accountId);
                      return (
                        <tr key={d.id} className="hover:bg-gray-50">
                          <td className="p-4 text-gray-600">{new Date(d.requestDate).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta', day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) + ' WIB'}</td>
                          <td className="p-4 font-medium text-gray-800">{coa?.accountName || 'Anggaran Dihapus'}</td>
                          <td className="p-4 text-right font-mono font-bold text-gray-900">{d.amount.toLocaleString('id-ID')}</td>
                          <td className="p-4 text-gray-600 max-w-[200px]">
                            <div className="truncate font-medium" title={d.purpose}>{d.purpose}</div>
                            {d.approvalNote && (
                              <div className="mt-1 text-[10px] bg-blue-50 text-blue-700 p-1.5 rounded border border-blue-100">
                                <strong>Catatan:</strong> {d.approvalNote}
                              </div>
                            )}
                            {d.rejectionReason && (
                              <div className="mt-1 text-[10px] bg-red-50 text-red-700 p-1.5 rounded border border-red-100">
                                <strong>Alasan Tolak:</strong> {d.rejectionReason}
                              </div>
                            )}
                          </td>
                          <td className="p-4 text-center">
                            {d.status === 'Pending' && <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full text-xs font-bold"><Clock className="w-3 h-3" /> Pending Review Bendahara</span>}
                            {d.status === 'Verified' && <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full text-xs font-bold"><CheckCircle className="w-3 h-3" /> Menunggu Direktur</span>}
                            {d.status === 'Approved' && <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full text-xs font-bold"><CheckCircle className="w-3 h-3" /> Disetujui</span>}
                            {d.status === 'Rejected' && <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 px-2.5 py-1 rounded-full text-xs font-bold"><XCircle className="w-3 h-3" /> Ditolak</span>}
                          </td>
                          <td className="p-4 text-center">
                            {d.status !== 'Approved' && (
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={() => handleEditClick(d)}
                                  className="text-[10px] bg-blue-100 hover:bg-blue-200 text-blue-700 px-2 py-1 rounded font-bold transition-colors"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteClick(d.id)}
                                  className="text-[10px] bg-red-100 hover:bg-red-200 text-red-700 px-2 py-1 rounded font-bold transition-colors"
                                >
                                  Hapus
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-gray-500">Belum ada riwayat pengajuan.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'approval' && canApprove && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-200 bg-emerald-50">
            <h3 className="font-bold text-lg text-emerald-900 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              Persetujuan Pencairan Anggaran
            </h3>
            <p className="text-sm text-emerald-700 mt-1">Review dan berikan persetujuan untuk dana yang akan dikeluarkan.</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500">
                  <th className="p-4 font-bold">Pemohon & Tgl</th>
                  <th className="p-4 font-bold">Pos Anggaran</th>
                  <th className="p-4 font-bold text-right">Nominal (Rp)</th>
                  <th className="p-4 font-bold">Tujuan & Catatan Sebelumnya</th>
                  <th className="p-4 font-bold text-center">Status</th>
                  <th className="p-4 font-bold text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {state.erpDisbursements.filter(d => d.requestDate.split('T')[0] >= startDate && d.requestDate.split('T')[0] <= endDate).filter(d => (d.status === 'Pending' && canApproveBendahara) || (d.status === 'Verified' && canApproveKetuaDKM) || (d.status === 'ApprovedKetua' && canApproveDirektur)).length > 0 ? (
                  state.erpDisbursements.filter(d => d.requestDate.split('T')[0] >= startDate && d.requestDate.split('T')[0] <= endDate).filter(d => (d.status === 'Pending' && canApproveBendahara) || (d.status === 'Verified' && canApproveKetuaDKM) || (d.status === 'ApprovedKetua' && canApproveDirektur)).map(d => {
                    const budget = state.erpBudgets.find(b => b.id === d.budgetId);
                    const coa = state.erpCoa.find(c => c.id === budget?.accountId);
                    const canActOnThis =
                      (canApproveBendahara && !canApproveKetuaDKM && !canApproveDirektur && d.status === 'Pending') ||
                      (canApproveKetuaDKM && !canApproveDirektur && d.status === 'Verified') ||
                      (canApproveDirektur && d.status === 'ApprovedKetua') ||
                      (canApproveDirektur && canApproveKetuaDKM && canApproveBendahara && (d.status === 'Pending' || d.status === 'Verified' || d.status === 'ApprovedKetua'));

                    return (
                      <tr key={d.id} className="hover:bg-blue-50/50">
                        <td className="p-4">
                          <div className="font-bold text-gray-800">{d.requestedBy}</div>
                          <div className="text-xs text-gray-500">{new Date(d.requestDate).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta', day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) + ' WIB'}</div>
                        </td>
                        <td className="p-4">
                          <div className="font-medium text-blue-900">{coa?.accountName}</div>
                          <div className="text-xs text-gray-500">Sisa Pagu: Rp {getBudgetBalance(d.budgetId).toLocaleString('id-ID')}</div>
                        </td>
                        <td className="p-4 text-right font-mono font-bold text-red-600">
                          Rp {d.amount.toLocaleString('id-ID')}
                        </td>
                        <td className="p-4 text-gray-700">
                          <div className="font-medium">{d.purpose}</div>
                          {d.approvalNote && (
                            <div className="mt-1 text-[10px] bg-blue-50 text-blue-700 p-1.5 rounded border border-blue-100">
                              <strong>Catatan (Tahap 1):</strong> {d.approvalNote}
                            </div>
                          )}
                        </td>
                        <td className="p-4 text-center">
                          {d.status === 'Pending' && <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full text-xs font-bold"><Clock className="w-3 h-3" /> Menunggu Bendahara</span>}
                          {d.status === 'Verified' && <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full text-xs font-bold"><AlertCircle className="w-3 h-3" /> Menunggu Ketua DKM</span>}
                          {d.status === 'ApprovedKetua' && <span className="inline-flex items-center gap-1 bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded-full text-xs font-bold"><AlertCircle className="w-3 h-3" /> Menunggu Direktur</span>}
                        </td>
                        <td className="p-4">
                          {rejectingId === d.id ? (
                            <div className="flex flex-col gap-2 min-w-[200px]">
                              <input 
                                type="text" 
                                value={rejectionReason}
                                onChange={e => setRejectionReason(e.target.value)}
                                placeholder="Alasan penolakan..." 
                                className="px-2 py-1.5 text-xs border border-gray-300 rounded outline-none text-gray-900 bg-white"
                              />
                              <div className="flex gap-2">
                                <button onClick={() => submitReject(d.id)} className="flex-1 bg-red-600 text-white text-xs font-bold py-1.5 rounded">Tolak</button>
                                <button onClick={() => setRejectingId(null)} className="flex-1 bg-gray-200 text-gray-700 text-xs font-bold py-1.5 rounded">Batal</button>
                              </div>
                            </div>
                          ) : canActOnThis ? (
                            <div className="flex justify-center gap-2">
                              <button
                                onClick={() => handleApprove(d.id, d.status)}
                                className="px-3 py-1.5 bg-emerald-100 text-emerald-700 hover:bg-emerald-600 hover:text-white rounded-lg font-bold text-xs transition-colors flex items-center gap-1"
                              >
                                <CheckCircle className="w-3 h-3" />
                                {canApproveDirektur && d.status === 'Verified' ? 'Setujui (Direktur)' : canApproveDirektur ? 'Approve Direktur' : 'Verifikasi'}
                              </button>
                              <button
                                onClick={() => setRejectingId(d.id)}
                                className="px-3 py-1.5 bg-red-100 text-red-700 hover:bg-red-600 hover:text-white rounded-lg font-bold text-xs transition-colors flex items-center gap-1"
                              >
                                <XCircle className="w-3 h-3" /> Tolak
                              </button>
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400 italic">
                              {d.status === 'Pending' ? 'Menunggu Bendahara' : 'Menunggu Direktur'}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="p-12 text-center">
                      <div className="flex flex-col items-center text-gray-400">
                        <CheckCircle className="w-12 h-12 mb-3 text-gray-300" />
                        <p className="text-lg font-medium text-gray-500">Tidak ada pengajuan pending</p>
                        <p className="text-sm mt-1">Semua pengajuan pencairan telah direview.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
