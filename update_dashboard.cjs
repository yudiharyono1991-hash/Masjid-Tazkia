const fs = require('fs');
const path = 'd:/PROJECT APP SPS 2026/MasjidTazkia/src/components/PengurusDkmDashboard.tsx';
let content = fs.readFileSync(path, 'utf8');

if (!content.includes('import { ManajemenKeropak }')) {
  content = content.replace(
    "import { VerifikasiZiswaf } from './accounting/VerifikasiZiswaf';",
    "import { VerifikasiZiswaf } from './accounting/VerifikasiZiswaf';\nimport { ManajemenKeropak } from './accounting/ManajemenKeropak';"
  );
}

if (!content.includes("{ id: 'manajemen_keropak', label: 'Manajemen Keropak', icon: Wallet }")) {
  content = content.replace(
    "{ id: 'akuntansi', label: 'Modul Keuangan Terpadu', icon: BookOpen },",
    "{ id: 'akuntansi', label: 'Modul Keuangan Terpadu', icon: BookOpen },\n        { id: 'manajemen_keropak', label: 'Manajemen Keropak', icon: Wallet },"
  );
}

if (!content.includes("dkmTab === 'manajemen_keropak' &&")) {
  const renderBlock = `
        {dkmTab === 'manajemen_keropak' && (
          <div className="space-y-6">
            <ManajemenKeropak />
          </div>
        )}
`;
  content = content.replace(
    "{dkmTab === 'akuntansi' && (",
    renderBlock + "\n        {dkmTab === 'akuntansi' && ("
  );
}

if (!content.includes("dkmTab === 'manajemen_keropak' ? 'Manajemen Keropak Mingguan & Harian' :")) {
  content = content.replace(
    "dkmTab === 'akuntansi' ? 'Modul Akuntansi & Keuangan Terpadu (Jurnal, Buku Besar, Kas Kecil, Neraca)' :",
    "dkmTab === 'akuntansi' ? 'Modul Akuntansi & Keuangan Terpadu (Jurnal, Buku Besar, Kas Kecil, Neraca)' :\n                 dkmTab === 'manajemen_keropak' ? 'Manajemen Keropak Mingguan & Harian' :"
  );
}

fs.writeFileSync(path, content);
console.log('Dashboard updated');
