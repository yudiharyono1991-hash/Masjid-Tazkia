const fs = require('fs');
const path = 'd:/PROJECT APP SPS 2026/MasjidTazkia/src/components/TransparencySection.tsx';
let content = fs.readFileSync(path, 'utf8');

const newCalc = `  const keropakTxs = state.keropakTransactions || [];
  const jumatPekanLalu = keropakTxs.filter(k => k.type === 'jumat').reduce((s, k) => s + k.amount, 0);
  const harianTotal = keropakTxs.filter(k => k.type === 'harian').reduce((s, k) => s + k.amount, 0);
  const keluarTotal = keropakTxs.filter(k => k.type === 'keluar').reduce((s, k) => s + k.amount, 0);
  const totalMasukMingguIni = jumatPekanLalu + harianTotal;
  const saldoTotalKeropak = totalMasukMingguIni - keluarTotal;
`;

const oldCalc = `  const keropakMasuk = erpJournalEntries
    .filter(e => e.accountId === 'coa-4106' && e.type === 'Credit')
    .reduce((sum, e) => sum + e.amount, 0);

  const keropakKeluar = erpJournalEntries
    .filter(e => e.accountId === 'coa-5105' && e.type === 'Debit')
    .reduce((sum, e) => sum + e.amount, 0);

  const saldoKeropak = keropakMasuk - keropakKeluar;`;

content = content.replace(oldCalc, newCalc);

const oldLayout = `        {/* Keropak Infaq Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {settings.showTransKeropakIn !== false && (
            <div className="bg-slate-900/80 border border-blue-900 rounded-2xl p-5 shadow-sm relative overflow-hidden">
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-blue-200/60 font-mono font-bold uppercase tracking-[0.15em]">Pemasukan Keropak Masjid</span>
                <div className="p-1.5 rounded-md bg-blue-500/10 text-blue-400">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>
              <p className="text-xl sm:text-2xl font-bold font-mono text-blue-400 mt-2">
                {formatRupiahFull(keropakMasuk)}
              </p>
              <p className="text-[10px] text-blue-300/50 mt-1 font-mono">Dari Kotak Amal Harian/Jumat</p>
            </div>
          )}

          {settings.showTransKeropakOut !== false && (
            <div className="bg-slate-900/60 border border-blue-900/60 rounded-2xl p-5 shadow-sm relative overflow-hidden">
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-blue-200/60 font-mono font-bold uppercase tracking-[0.15em]">Penyaluran Keropak</span>
                <div className="p-1.5 rounded-md bg-rose-500/10 text-rose-400">
                  <TrendingDown className="w-4 h-4" />
                </div>
              </div>
              <p className="text-xl sm:text-2xl font-bold font-mono text-rose-400 mt-2">
                {formatRupiahFull(keropakKeluar)}
              </p>
              <p className="text-[10px] text-blue-300/50 mt-1 font-mono">Untuk Operasional Masjid</p>
            </div>
          )}

          {settings.showTransKeropakSaldo !== false && (
            <div className="bg-slate-800/80 border border-amber-900/30 rounded-2xl p-5 shadow-sm relative overflow-hidden">
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-amber-400/80 font-mono font-bold uppercase tracking-[0.15em]">Saldo Keropak Tersedia</span>
                <div className="p-1.5 rounded-md bg-amber-500/20 text-amber-400">
                  <Wallet className="w-4 h-4" />
                </div>
              </div>
              <p className="text-xl sm:text-2xl font-bold font-mono text-amber-400 mt-2">
                {formatRupiahFull(saldoKeropak)}
              </p>
              <p className="text-[10px] text-amber-200/50 mt-1 font-mono">Akumulasi Bersih Keropak</p>
            </div>
          )}
        </div>`;

const newLayout = `        {/* Detailed Keropak Infaq Cards */}
        <div className="bg-slate-900/80 border border-blue-900 rounded-3xl p-6 md:p-8 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <Wallet className="w-6 h-6 text-amber-400" />
            <h3 className="text-xl font-serif text-white font-bold">Laporan Keropak Mingguan & Harian</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-blue-950/50 border border-blue-800/50 rounded-2xl p-5">
              <span className="text-[10px] text-blue-200/70 font-mono font-bold uppercase tracking-[0.15em]">Saldo Jumat Pekan Lalu</span>
              <p className="text-xl font-bold font-mono text-blue-300 mt-2">{formatRupiahFull(jumatPekanLalu)}</p>
            </div>
            
            <div className="bg-blue-950/50 border border-blue-800/50 rounded-2xl p-5">
              <span className="text-[10px] text-blue-200/70 font-mono font-bold uppercase tracking-[0.15em]">Keropak Harian</span>
              <p className="text-xl font-bold font-mono text-blue-300 mt-2">{formatRupiahFull(harianTotal)}</p>
            </div>

            <div className="bg-rose-950/30 border border-rose-900/50 rounded-2xl p-5">
              <span className="text-[10px] text-rose-200/70 font-mono font-bold uppercase tracking-[0.15em]">Penyaluran Keropak</span>
              <p className="text-xl font-bold font-mono text-rose-400 mt-2">{formatRupiahFull(keluarTotal)}</p>
            </div>

            <div className="bg-amber-950/30 border border-amber-900/50 rounded-2xl p-5 shadow-inner">
              <span className="text-[10px] text-amber-300/80 font-mono font-bold uppercase tracking-[0.15em]">Saldo Keropak Saat Ini</span>
              <p className="text-xl font-bold font-mono text-amber-400 mt-2">{formatRupiahFull(saldoTotalKeropak)}</p>
            </div>
          </div>
          
          <div className="mt-6 border-t border-blue-800/50 pt-6">
             <div className="flex flex-col md:flex-row justify-between items-center bg-blue-900/30 p-4 rounded-xl border border-blue-800/30">
                <div>
                  <span className="text-[10px] text-blue-200/70 font-mono font-bold uppercase tracking-[0.15em]">Total Keropak Minggu Ini</span>
                  <p className="text-xs text-blue-300/50 mt-1 font-sans italic">Gabungan saldo Jumat pekan lalu & keropak harian</p>
                </div>
                <div className="text-right mt-3 md:mt-0">
                  <p className="text-2xl font-bold font-mono text-white">{formatRupiahFull(totalMasukMingguIni)}</p>
                </div>
             </div>
          </div>
        </div>`;

content = content.replace(oldLayout, newLayout);

fs.writeFileSync(path, content);
console.log('TransparencySection updated');
