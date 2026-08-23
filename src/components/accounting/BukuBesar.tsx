import React, { useState } from 'react';
import { useMasjidStore } from '../../lib/store';
import { Download, Search } from 'lucide-react';
import { exportBukuBesarToExcel } from '../../lib/excelUtils';

export function BukuBesar() {
  const { state } = useMasjidStore();
  const [selectedAccountId, setSelectedAccountId] = useState<string>('');
  const [coaSearch, setCoaSearch] = useState<string>('');

  // Date utils
  const getFirstDayOfMonth = () => { const d = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" })); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-01`; };
  const getToday = () => { const d = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" })); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; };

  const [startDate, setStartDate] = useState(getFirstDayOfMonth());
  const [endDate, setEndDate] = useState(getToday());

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const handleExport = () => {
    // If an account is selected, export only that account's ledger
    const accountsToExport = selectedAccountId 
      ? state.erpCoa.filter(a => a.id === selectedAccountId)
      : state.erpCoa;
    exportBukuBesarToExcel(accountsToExport, state.erpJournals, state.erpJournalEntries);
  };

  const account = state.erpCoa.find(a => a.id === selectedAccountId);
  
  const filteredCoa = state.erpCoa.filter(coa => 
    coa.accountName.toLowerCase().includes(coaSearch.toLowerCase()) ||
    coa.accountCode.includes(coaSearch)
  );

  // Calculate Ledger Entries
  let ledgerEntries = [];
  let runningBalance = 0;
  let totalDebitAll = 0;
  let totalCreditAll = 0;

  if (account) {
    ledgerEntries = state.erpJournalEntries
      .filter(e => {
        const j = state.erpJournals.find(jrn => jrn.id === e.journalId);
        return j && j.date >= startDate && j.date <= endDate;
      })
      .filter(e => e.accountId === account.id)
      .sort((a, b) => {
        const jA = state.erpJournals.find(j => j.id === a.journalId);
        const jB = state.erpJournals.find(j => j.id === b.journalId);
        if (!jA || !jB) return 0;
        return new Date(jA.date).getTime() - new Date(jB.date).getTime();
      })
      .map(entry => {
        const journal = state.erpJournals.find(j => j.id === entry.journalId);
        const isDebitIncrease = account.normalBalance === 'Debit';
        const change = isDebitIncrease ? entry.debit - entry.credit : entry.credit - entry.debit;
        runningBalance += change;
        return {
          ...entry,
          journalDate: journal?.date,
          journalNo: journal?.journalNo,
          journalDesc: journal?.description,
          journalCreatedAt: journal?.createdAt,
          journalCreatedBy: journal?.createdBy,
          runningBalance
        };
      });
  } else {
    // All entries
    ledgerEntries = [...state.erpJournalEntries]
      .filter(e => {
        const j = state.erpJournals.find(jrn => jrn.id === e.journalId);
        return j && j.date >= startDate && j.date <= endDate;
      })
      .sort((a, b) => {
        const jA = state.erpJournals.find(j => j.id === a.journalId);
        const jB = state.erpJournals.find(j => j.id === b.journalId);
        if (!jA || !jB) return 0;
        return new Date(jA.date).getTime() - new Date(jB.date).getTime();
      })
      .map(entry => {
        const journal = state.erpJournals.find(j => j.id === entry.journalId);
        const coa = state.erpCoa.find(c => c.id === entry.accountId);
        totalDebitAll += entry.debit;
        totalCreditAll += entry.credit;
        return {
          ...entry,
          journalDate: journal?.date,
          journalNo: journal?.journalNo,
          journalDesc: journal?.description,
          journalCreatedAt: journal?.createdAt,
          journalCreatedBy: journal?.createdBy,
          accountCode: coa?.accountCode || entry.accountCode,
          accountName: coa?.accountName || entry.accountName,
          runningBalance: 0
        };
      });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm gap-4">
        <h3 className="font-bold text-lg text-blue-900">Buku Besar (General Ledger)</h3>
        
        <div className="flex items-center gap-2">
          <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="border border-gray-300 bg-white text-gray-900 rounded-lg px-2 py-1.5 text-sm font-medium focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
          <span className="text-gray-500 font-bold text-sm">s/d</span>
          <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="border border-gray-300 bg-white text-gray-900 rounded-lg px-2 py-1.5 text-sm font-medium focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
        </div>

        <button onClick={handleExport} className="w-full md:w-auto px-3 py-2 bg-gray-50 border border-gray-200 text-sm font-semibold text-gray-700 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-100">
          <Download className="w-4 h-4" /> Ekspor Buku Besar
        </button>
      </div>

      <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-1 w-full sm:max-w-xs">
            <label className="block text-xs font-semibold text-gray-600 mb-1 flex items-center gap-1">
              <Search className="w-3.5 h-3.5 text-gray-400" /> Cari/Ketik Akun
            </label>
            <input
              type="text"
              placeholder="Ketik kode atau nama..."
              value={coaSearch}
              onChange={e => setCoaSearch(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white"
              style={{ color: '#111827', backgroundColor: '#ffffff' }}
            />
          </div>
          <div className="flex-1 w-full">
            <label className="block text-xs font-semibold text-gray-600 mb-1">Pilih Akun</label>
            <select 
              value={selectedAccountId} 
              onChange={e => setSelectedAccountId(e.target.value)} 
              className="w-full p-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white"
              style={{ color: '#111827', backgroundColor: '#ffffff' }}
            >
              <option value="" style={{ color: '#111827', backgroundColor: '#ffffff' }}>-- Semua Akun (Semua Mutasi Transaksi) --</option>
              {filteredCoa.map(coa => (
                <option key={coa.id} value={coa.id} style={{ color: '#111827', backgroundColor: '#ffffff' }}>[{coa.accountCode}] {coa.accountName}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {account ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
            <div>
              <div className="text-xl font-bold text-blue-900">[{account.accountCode}] {account.accountName}</div>
              <div className="text-sm text-gray-500 mt-1">Saldo Normal: {account.normalBalance} | Tipe: {account.accountType}</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Saldo Akhir</div>
              <div className={`text-2xl font-bold ${runningBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                Rp {runningBalance.toLocaleString()}
              </div>
            </div>
          </div>
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-xs sm:text-sm min-w-[600px]">
            <thead className="bg-gray-100 border-b border-gray-200 text-gray-600">
              <tr>
                <th className="p-4 font-semibold">Tanggal</th>
                <th className="p-4 font-semibold">No Bukti</th>
                <th className="p-4 font-semibold">Keterangan</th>
                <th className="p-4 font-semibold text-right">Debit</th>
                <th className="p-4 font-semibold text-right">Kredit</th>
                <th className="p-4 font-semibold text-right">Saldo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {(() => {
                const totalPages = Math.ceil(ledgerEntries.length / itemsPerPage) || 1;
                const paginatedEntries = ledgerEntries.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
                if (currentPage > totalPages) setCurrentPage(1);
                
                return paginatedEntries.map((e, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 text-slate-800">
                    <td className="p-4">
                      <div className="font-semibold text-gray-800">
                        {e.journalDate ? new Date(e.journalDate).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta', day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) + ' WIB' : '-'}
                      </div>
                      {e.journalCreatedAt && (
                        <div className="text-[10px] text-gray-400 font-medium">
                          {new Date(e.journalCreatedAt).toLocaleTimeString('id-ID')}
                        </div>
                      )}
                      {e.journalCreatedBy && (
                        <div className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded inline-block mt-1">
                          Input: {e.journalCreatedBy}
                        </div>
                      )}
                    </td>
                    <td className="p-4 font-mono text-xs text-blue-600">{e.journalNo}</td>
                    <td className="p-4">{e.description || e.journalDesc}</td>
                    <td className="p-4 text-right font-mono">{e.debit > 0 ? e.debit.toLocaleString() : '-'}</td>
                    <td className="p-4 text-right font-mono">{e.credit > 0 ? e.credit.toLocaleString() : '-'}</td>
                    <td className="p-4 text-right font-mono font-semibold">{e.runningBalance.toLocaleString()}</td>
                  </tr>
                ));
              })()}
              {ledgerEntries.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-400">Belum ada mutasi pada akun ini.</td>
                </tr>
              )}
            </tbody>
          </table>
          {/* Pagination Controls */}
          {(() => {
            const totalPages = Math.ceil(ledgerEntries.length / itemsPerPage) || 1;
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
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
            <div>
              <div className="text-xl font-bold text-blue-900">Jurnal Transaksi (Semua Akun)</div>
              <div className="text-sm text-gray-500 mt-1">Daftar mutasi entri jurnal keuangan komprehensif.</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-500">Total Akumulasi Transaksi</div>
              <div className="text-md font-bold text-gray-700">
                Debit: Rp {totalDebitAll.toLocaleString()} | Kredit: Rp {totalCreditAll.toLocaleString()}
              </div>
            </div>
          </div>
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-xs sm:text-sm min-w-[700px]">
            <thead className="bg-gray-100 border-b border-gray-200 text-gray-600">
              <tr>
                <th className="p-4 font-semibold">Tanggal</th>
                <th className="p-4 font-semibold">No Bukti</th>
                <th className="p-4 font-semibold">Akun</th>
                <th className="p-4 font-semibold">Keterangan</th>
                <th className="p-4 font-semibold text-right">Debit</th>
                <th className="p-4 font-semibold text-right">Kredit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {(() => {
                const totalPages = Math.ceil(ledgerEntries.length / itemsPerPage) || 1;
                const paginatedEntries = ledgerEntries.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
                if (currentPage > totalPages) setCurrentPage(1);

                return paginatedEntries.map((e, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 text-slate-800">
                    <td className="p-4">
                      <div className="font-semibold text-gray-800">
                        {e.journalDate ? new Date(e.journalDate).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta', day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) + ' WIB' : '-'}
                      </div>
                      {e.journalCreatedAt && (
                        <div className="text-[10px] text-gray-400 font-medium">
                          {new Date(e.journalCreatedAt).toLocaleTimeString('id-ID')}
                        </div>
                      )}
                      {e.journalCreatedBy && (
                        <div className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded inline-block mt-1">
                          Input: {e.journalCreatedBy}
                        </div>
                      )}
                    </td>
                    <td className="p-4 font-mono text-xs text-blue-600">{e.journalNo}</td>
                    <td className="p-4">
                      <span className="font-semibold text-xs bg-blue-50 text-blue-800 px-2 py-0.5 rounded mr-1">
                        {e.accountCode}
                      </span>
                      {e.accountName}
                    </td>
                    <td className="p-4">{e.description || e.journalDesc}</td>
                    <td className="p-4 text-right font-mono">{e.debit > 0 ? e.debit.toLocaleString() : '-'}</td>
                    <td className="p-4 text-right font-mono">{e.credit > 0 ? e.credit.toLocaleString() : '-'}</td>
                  </tr>
                ));
              })()}
              {ledgerEntries.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-400">Belum ada data jurnal transaksi.</td>
                </tr>
              )}
            </tbody>
          </table>
          {/* Pagination Controls */}
          {(() => {
            const totalPages = Math.ceil(ledgerEntries.length / itemsPerPage) || 1;
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
      )}
    </div>
  );
}
