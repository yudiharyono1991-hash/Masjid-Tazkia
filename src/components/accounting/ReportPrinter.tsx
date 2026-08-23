import React, { useRef, useState } from 'react';
import { useMasjidStore } from '../../lib/store';
import { Download, Printer } from 'lucide-react';
import * as XLSX from 'xlsx';

export function ReportPrinter() {
  const { state, addErpCoa, updateErpSignature, tutupBuku } = useMasjidStore();
  const printRef = useRef<HTMLDivElement>(null);
  const [reportType, setReportType] = useState('Neraca');
  
  // Helper function to get local YYYY-MM-DD
  const getLocalYMD = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  // Date filter (defaults to 1st of current month until today)
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  const [startDate, setStartDate] = useState(getLocalYMD(firstDay));
  const [endDate, setEndDate] = useState(getLocalYMD(today));
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadExcel = () => {
    let data: any[] = [];
    if (reportType === 'Neraca') {
      data.push({ 'Keterangan': 'ASET', 'Saldo': '' });
      assets.forEach(a => data.push({ 'Keterangan': a.accountName, 'Saldo': a.balance }));
      data.push({ 'Keterangan': 'TOTAL ASET', 'Saldo': totalAsset });
      data.push({ 'Keterangan': '', 'Saldo': '' });
      data.push({ 'Keterangan': 'KEWAJIBAN & EKUITAS', 'Saldo': '' });
      liabilities.forEach(a => data.push({ 'Keterangan': a.accountName, 'Saldo': a.balance }));
      equities.forEach(a => data.push({ 'Keterangan': a.accountName, 'Saldo': a.balance }));
      data.push({ 'Keterangan': 'TOTAL KEWAJIBAN & EKUITAS', 'Saldo': totalLiabEq });
    } else if (reportType === 'LabaRugi') {
      data.push({ 'Keterangan': 'PENDAPATAN', 'Saldo': '' });
      revenues.forEach(r => data.push({ 'Keterangan': r.accountName, 'Saldo': r.balance }));
      data.push({ 'Keterangan': 'TOTAL PENDAPATAN', 'Saldo': totalRevenue });
      data.push({ 'Keterangan': '', 'Saldo': '' });
      data.push({ 'Keterangan': 'BEBAN', 'Saldo': '' });
      expenses.forEach(e => data.push({ 'Keterangan': e.accountName, 'Saldo': e.balance }));
      data.push({ 'Keterangan': 'TOTAL BEBAN', 'Saldo': totalExpense });
      data.push({ 'Keterangan': '', 'Saldo': '' });
      data.push({ 'Keterangan': 'SURPLUS / (DEFISIT)', 'Saldo': totalRevenue - totalExpense });
    } else if (reportType === 'Realisasi') {
      realisasi.forEach(r => {
        data.push({
          'Kode Akun': r.accountCode,
          'Nama Akun': r.accountName,
          'Anggaran': r.amount,
          'Realisasi': r.actual,
          'Sisa (Varians)': r.variance,
          '% Realisasi': r.percentage.toFixed(2) + '%'
        });
      });
    }

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, reportType);
    XLSX.writeFile(wb, `Laporan_${reportType}_${startDate}_sd_${endDate}.xlsx`);
  };

  const getBalances = () => {
    const balances = state.erpCoa.map(coa => {
      let balance = 0;
      state.erpJournalEntries.filter(e => e.accountId === coa.id).forEach(entry => {
        const journal = state.erpJournals.find(j => j.id === entry.journalId);
        if (!journal) return;
        // Filter by date range for all report types except maybe static balances, but we'll use period for all here.
        if (journal.date >= startDate && journal.date <= endDate) {
          const isDebitIncrease = coa.normalBalance === 'Debit';
          balance += isDebitIncrease ? entry.debit - entry.credit : entry.credit - entry.debit;
        }
      });
      return { ...coa, balance };
    });
    return balances;
  };

  const balances = getBalances();
  const assets = balances.filter(b => b.accountType === 'Asset');
  const liabilities = balances.filter(b => b.accountType === 'Liability');
  const equities = balances.filter(b => b.accountType === 'Equity');
  const revenues = balances.filter(b => b.accountType === 'Revenue');
  const expenses = balances.filter(b => b.accountType === 'Expense');

  const totalRevenue = revenues.reduce((s, r) => s + r.balance, 0);
  const totalExpense = expenses.reduce((s, e) => s + e.balance, 0);

  const getRealisasiAnggaran = () => {
    // get budgets for selected year
    const budgets = state.erpBudgets.filter(b => b.year === selectedYear);
    
    return budgets.map(budget => {
      const coa = state.erpCoa.find(c => c.id === budget.accountId);
      let actual = 0;
      // sum actuals based on year (very simplified, usually need date parsing)
      state.erpJournalEntries.filter(e => e.accountId === budget.accountId).forEach(entry => {
        const journal = state.erpJournals.find(j => j.id === entry.journalId);
        if (journal && journal.date.startsWith(selectedYear.toString())) {
          // If Revenue, credit is positive. If Expense, debit is positive.
          if (coa?.accountType === 'Revenue') {
            actual += entry.credit - entry.debit;
          } else {
            actual += entry.debit - entry.credit;
          }
        }
      });
      return {
        ...budget,
        accountCode: coa?.accountCode || '-',
        accountName: coa?.accountName || 'Unknown',
        accountType: coa?.accountType || 'Unknown',
        actual,
        variance: budget.amount - actual,
        percentage: budget.amount > 0 ? (actual / budget.amount) * 100 : 0
      };
    }).sort((a, b) => a.accountType.localeCompare(b.accountType));
  };
  const realisasi = getRealisasiAnggaran();

  const totalAsset = assets.reduce((s, a) => s + a.balance, 0);
  const totalLiabEq = liabilities.reduce((s, a) => s + a.balance, 0) + equities.reduce((s, a) => s + a.balance, 0);

  // Fetch dynamic signatures from global store, sort by order index
  const hierarchy = [...(state.reportSignatories || [])].sort((a,b) => a.orderIdx - b.orderIdx);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm print:hidden gap-4">
        <h3 className="font-bold text-lg text-blue-900 shrink-0">Cetak Laporan Keuangan</h3>
        <div className="flex flex-wrap gap-2">
          <select 
            value={reportType} 
            onChange={e => setReportType(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-gray-50 outline-none w-full sm:w-auto"
          >
            <option value="Neraca">Laporan Posisi Keuangan (Neraca)</option>
            <option value="LabaRugi">Laporan Aktivitas (Surplus/Defisit)</option>
            <option value="Realisasi">Laporan Realisasi Anggaran</option>
          </select>
          {reportType === 'Realisasi' ? (
            <select
              value={selectedYear}
              onChange={e => setSelectedYear(Number(e.target.value))}
              className="p-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-gray-50 outline-none w-full sm:w-auto"
            >
              {[selectedYear - 1, selectedYear, selectedYear + 1].map(y => (
                <option key={y} value={y}>Tahun {y}</option>
              ))}
            </select>
          ) : (
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <input 
                type="date" 
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="p-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-gray-50 outline-none flex-1 sm:flex-none"
              />
              <span className="text-sm font-bold text-gray-500 shrink-0">s/d</span>
              <input 
                type="date" 
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                className="p-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-gray-50 outline-none flex-1 sm:flex-none"
              />
            </div>
          )}
          {reportType === 'LabaRugi' && (
            <div className="flex gap-2">
              <button onClick={() => {
                if(window.confirm('Anda yakin ingin melakukan Tutup Buku Bulanan? Jurnal Surplus/Defisit akan otomatis dibuat.')) {
                  tutupBuku('bulanan');
                  alert('Tutup Buku Bulanan Berhasil!');
                }
              }} className="px-3 py-2 bg-amber-500 text-white text-xs font-semibold rounded-lg hover:bg-amber-600">
                Tutup Buku Bulanan
              </button>
              <button onClick={() => {
                if(window.confirm('Anda yakin ingin melakukan Tutup Buku Tahunan? Saldo Pendapatan & Beban akan direset (dipindah ke Laba Ditahan).')) {
                  tutupBuku('tahunan');
                  alert('Tutup Buku Tahunan Berhasil!');
                }
              }} className="px-3 py-2 bg-red-600 text-white text-xs font-semibold rounded-lg hover:bg-red-700">
                Tutup Buku Tahunan
              </button>
            </div>
          )}
          <button onClick={handlePrint} className="px-3 py-2 bg-gray-50 border border-gray-200 text-sm font-semibold text-gray-700 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-100 flex-1 sm:flex-none">
            <Printer className="w-4 h-4" /> Print
          </button>
          <button onClick={handleDownloadExcel} className="px-3 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-lg flex items-center justify-center gap-2 hover:bg-emerald-500 flex-1 sm:flex-none">
            <Download className="w-4 h-4" /> Excel
          </button>
        </div>
      </div>

      <div className="bg-white p-4 sm:p-8 rounded-xl border border-gray-200 shadow-sm max-w-4xl mx-auto print:border-none print:shadow-none text-gray-900 print-area print:p-0" ref={printRef}>
        <div className="text-center mb-8 border-b-4 border-double border-blue-900 pb-4 relative">
          <img 
            src={state.adminSettings?.masjidLogoUrl || '/logo.png'} 
            alt="Logo Masjid Tazkia" 
            className="h-16 w-16 mx-auto mb-4 sm:mb-0 sm:h-20 sm:w-20 object-contain sm:absolute sm:left-0 sm:top-0 print:absolute print:left-0 print:top-0 print:h-20 print:w-20 print:m-0"
            onError={(e) => {
              e.currentTarget.src = '/logo.png';
            }} 
          />
          <h1 className="text-lg sm:text-xl font-bold text-blue-900 tracking-wider font-serif">MASJID TAZKIA</h1>
          <p className="text-xs sm:text-sm text-gray-600 font-medium">Jl. Ir. H. Djuanda No. 78 Sentul City, Bogor</p>
          <h2 className="text-sm sm:text-base font-bold mt-4 underline">
            {reportType === 'Neraca' && 'Laporan Posisi Keuangan (Neraca)'}
            {reportType === 'LabaRugi' && 'Laporan Aktivitas'}
            {reportType === 'Realisasi' && `Laporan Realisasi Anggaran Tahun ${selectedYear}`}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Periode: {reportType === 'Realisasi' ? `Tahun ${selectedYear}` : `${new Date(startDate).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta', day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) + ' WIB'} s/d ${new Date(endDate).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta', day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) + ' WIB'}`}
          </p>
          <p className="text-xs text-blue-800 font-medium mt-1 italic print:hidden">
            Dicetak pada: {today.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })} M / {new Intl.DateTimeFormat('id-ID-u-ca-islamic-umalqura', { day: 'numeric', month: 'long', year: 'numeric' }).format(today)}
            <br />
            Dicetak oleh: {state.session?.name || state.session?.email || 'Administrator'}
          </p>
        </div>

        {reportType === 'Neraca' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 print:grid-cols-2 gap-6 sm:gap-8 text-xs sm:text-sm">
            <div>
              <h3 className="font-bold border-b border-gray-300 pb-1 mb-2">ASET</h3>
              <div className="space-y-1">
                {assets.map(a => (
                  <div key={a.id} className="flex justify-between">
                    <span>{a.accountName}</span>
                    <span>Rp {a.balance.toLocaleString('id-ID')}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between font-bold mt-4 pt-2 border-t border-gray-300">
                <span>TOTAL ASET</span>
                <span>Rp {totalAsset.toLocaleString('id-ID')}</span>
              </div>
            </div>
            
            <div>
              <h3 className="font-bold border-b border-gray-300 pb-1 mb-2">KEWAJIBAN & EKUITAS</h3>
              <div className="space-y-1">
                {liabilities.map(a => (
                  <div key={a.id} className="flex justify-between">
                    <span>{a.accountName}</span>
                    <span>Rp {a.balance.toLocaleString('id-ID')}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 mb-2 font-bold text-gray-700">Ekuitas / Saldo Dana</div>
              <div className="space-y-1">
                {equities.map(a => (
                  <div key={a.id} className="flex justify-between">
                    <span>{a.accountName}</span>
                    <span>Rp {a.balance.toLocaleString('id-ID')}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between font-bold mt-4 pt-2 border-t border-gray-300">
                <span>TOTAL KEWAJIBAN & EKUITAS</span>
                <span>Rp {totalLiabEq.toLocaleString('id-ID')}</span>
              </div>
            </div>
          </div>
        )}

        {reportType === 'LabaRugi' && (
          <div className="text-xs sm:text-sm">
            <h3 className="font-bold border-b border-gray-300 pb-1 mb-2">PENDAPATAN (PENERIMAAN)</h3>
            <div className="space-y-1 mb-4">
              {revenues.map(r => (
                <div key={r.id} className="flex justify-between">
                  <span>{r.accountName}</span>
                  <span>Rp {r.balance.toLocaleString('id-ID')}</span>
                </div>
              ))}
              {revenues.length === 0 && <div className="text-gray-400 italic">Belum ada pendapatan</div>}
              <div className="flex justify-between font-bold mt-2 pt-2 border-t border-gray-300">
                <span>TOTAL PENDAPATAN</span>
                <span>Rp {totalRevenue.toLocaleString('id-ID')}</span>
              </div>
            </div>

            <h3 className="font-bold border-b border-gray-300 pb-1 mb-2 mt-6">BEBAN (PENGELUARAN)</h3>
            <div className="space-y-1">
              {expenses.map(e => (
                <div key={e.id} className="flex justify-between">
                  <span>{e.accountName}</span>
                  <span>Rp {e.balance.toLocaleString('id-ID')}</span>
                </div>
              ))}
              {expenses.length === 0 && <div className="text-gray-400 italic">Belum ada pengeluaran</div>}
              <div className="flex justify-between font-bold mt-2 pt-2 border-t border-gray-300">
                <span>TOTAL BEBAN</span>
                <span>Rp {totalExpense.toLocaleString('id-ID')}</span>
              </div>
            </div>
            
            <div className="flex justify-between font-bold text-lg mt-8 pt-4 border-t-2 border-gray-400">
              <span>SURPLUS / (DEFISIT) NETO</span>
              <span className={(totalRevenue - totalExpense) < 0 ? 'text-red-600' : ''}>
                Rp {(totalRevenue - totalExpense).toLocaleString('id-ID')}
              </span>
            </div>
          </div>
        )}

        {reportType === 'Realisasi' && (
          <div className="text-xs sm:text-sm overflow-x-auto pb-4 custom-scrollbar">
            <table className="w-full text-left border-collapse border border-gray-300 min-w-[600px]">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-300">
                  <th className="p-2 border-r border-gray-300">Kode Akun</th>
                  <th className="p-2 border-r border-gray-300">Nama Akun</th>
                  <th className="p-2 border-r border-gray-300 text-right">Anggaran</th>
                  <th className="p-2 border-r border-gray-300 text-right">Realisasi</th>
                  <th className="p-2 border-r border-gray-300 text-right">Sisa (Varians)</th>
                  <th className="p-2 text-center">% Realisasi</th>
                </tr>
              </thead>
              <tbody>
                {realisasi.map(r => (
                  <tr key={r.id} className="border-b border-gray-200">
                    <td className="p-2 border-r border-gray-300">{r.accountCode}</td>
                    <td className="p-2 border-r border-gray-300">
                      <div className="font-medium">{r.accountName}</div>
                      <div className="text-xs text-gray-500">{r.accountType === 'Revenue' ? 'Pendapatan' : 'Beban'}</div>
                    </td>
                    <td className="p-2 border-r border-gray-300 text-right font-mono">Rp {r.amount.toLocaleString('id-ID')}</td>
                    <td className="p-2 border-r border-gray-300 text-right font-mono">Rp {r.actual.toLocaleString('id-ID')}</td>
                    <td className={`p-2 border-r border-gray-300 text-right font-mono ${r.variance < 0 && r.accountType === 'Expense' ? 'text-red-600 font-bold' : ''}`}>
                      Rp {r.variance.toLocaleString('id-ID')}
                    </td>
                    <td className={`p-2 text-center font-mono ${r.percentage > 100 && r.accountType === 'Expense' ? 'text-red-600 font-bold' : 'text-emerald-600'}`}>
                      {r.percentage.toFixed(1)}%
                    </td>
                  </tr>
                ))}
                {realisasi.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-4 text-center text-gray-500 italic">Belum ada anggaran di tahun {selectedYear}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-20 pt-8 border-t-2 border-gray-200 avoid-break">
          <div className="flex justify-end items-end mb-8 text-sm">
            <div className="font-medium">
              {state.adminSettings?.reportPrintLocation || 'Sentul City, Bogor'}, {today.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4 text-center text-sm">
            {hierarchy.map((h, i) => (
              <div key={i} className="flex flex-col items-center">
                <span className="mb-20 font-medium text-gray-600">{h.role}</span>
                <span className="font-bold underline uppercase">{h.name}</span>
                <span className="text-xs text-gray-500">{h.title}</span>
              </div>
            ))}
          </div>
          
          <div className="mt-8 flex justify-between items-end text-[10px] sm:text-xs text-gray-600">
            <div className="text-left">
              {state.adminSettings?.reportTembusan && (
                <div className="mb-4 text-xs sm:text-sm">
                  <span className="font-bold underline mb-1 block text-gray-800">Tembusan:</span>
                  <pre className="font-sans whitespace-pre-wrap leading-relaxed">{state.adminSettings.reportTembusan}</pre>
                </div>
              )}
              <span className="italic">
                Dicetak oleh: {state.session?.name || state.session?.email || 'Administrator'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
