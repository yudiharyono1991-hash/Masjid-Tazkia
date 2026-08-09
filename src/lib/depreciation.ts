import { InventoryItem, ERPJournalEntry, ERPGeneralJournal } from '../types';

/**
 * Menghitung penyusutan menggunakan metode Garis Lurus (Straight-Line)
 * Asumsi: Nilai sisa (salvage value) = 0 untuk kemudahan.
 */
export function calculateStraightLineDepreciation(item: InventoryItem): number {
  if (!item.purchasePrice || !item.usefulLifeMonths || item.usefulLifeMonths <= 0) {
    return 0;
  }
  return item.purchasePrice / item.usefulLifeMonths;
}

/**
 * Menghitung total akumulasi penyusutan hingga tanggal tertentu
 */
export function calculateAccumulatedDepreciation(
  item: InventoryItem, 
  targetDateStr: string = new Date().toISOString()
): number {
  if (!item.purchaseDate || !item.purchasePrice || !item.usefulLifeMonths) {
    return item.accumulatedDepreciation || 0;
  }

  const purchase = new Date(item.purchaseDate);
  const target = new Date(targetDateStr);
  
  if (target < purchase) return 0;

  // Hitung selisih bulan
  let months = (target.getFullYear() - purchase.getFullYear()) * 12;
  months -= purchase.getMonth();
  months += target.getMonth();
  
  // Jika belum lewat masa manfaat, gunakan jumlah bulan berjalan
  const applicableMonths = Math.min(months, item.usefulLifeMonths);
  
  if (applicableMonths <= 0) return 0;

  const monthlyDepreciation = calculateStraightLineDepreciation(item);
  let accumulated = applicableMonths * monthlyDepreciation;
  
  // Pastikan tidak melebihi harga beli
  if (accumulated > item.purchasePrice) {
    accumulated = item.purchasePrice;
  }

  // Tambahkan akumulasi sebelumnya jika ada penyesuaian manual
  return accumulated + (item.accumulatedDepreciation || 0);
}

/**
 * Menghitung nilai buku saat ini (Book Value)
 */
export function calculateBookValue(item: InventoryItem, targetDateStr?: string): number {
  if (!item.purchasePrice) return 0;
  const accumulated = calculateAccumulatedDepreciation(item, targetDateStr);
  return Math.max(0, item.purchasePrice - accumulated);
}

/**
 * Membuat entri jurnal untuk penyusutan bulanan sebuah aset.
 * Memerlukan Account ID untuk Beban Penyusutan dan Akumulasi Penyusutan.
 */
export function generateDepreciationJournalEntry(
  item: InventoryItem, 
  expenseAccountId: string, 
  accumulatedAccountId: string
): { journal: ERPGeneralJournal, entries: ERPJournalEntry[] } | null {
  const amount = calculateStraightLineDepreciation(item);
  
  if (amount <= 0) return null;

  const journalId = `DEP-${item.id}-${new Date().getTime()}`;
  
  const journal: ERPGeneralJournal = {
    id: journalId,
    journalNo: `JV-DEP-${Date.now().toString().slice(-6)}`,
    date: new Date().toISOString(),
    description: `Penyusutan Bulanan Aset: ${item.name} (${item.code})`,
    reference: item.code,
    status: 'Draft',
    createdBy: 'System'
  };

  const entries: ERPJournalEntry[] = [
    {
      id: `${journalId}-DR`,
      journalId,
      accountId: expenseAccountId,
      debit: amount,
      credit: 0,
      description: `Beban Penyusutan - ${item.name}`
    },
    {
      id: `${journalId}-CR`,
      journalId,
      accountId: accumulatedAccountId,
      debit: 0,
      credit: amount,
      description: `Akumulasi Penyusutan - ${item.name}`
    }
  ];

  return { journal, entries };
}
