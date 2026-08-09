import * as XLSX from 'xlsx';
import { ERPChartOfAccount, ERPGeneralJournal, ERPJournalEntry } from '../types';

export const exportCoaToExcel = (accounts: ERPChartOfAccount[]) => {
  const ws = XLSX.utils.json_to_sheet(accounts.map(acc => ({
    'Kode Akun': acc.accountCode,
    'Nama Akun': acc.accountName,
    'Tipe Akun': acc.accountType,
    'Saldo Normal': acc.normalBalance,
    'Status Aktif': acc.isActive ? 'Ya' : 'Tidak'
  })));
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Chart of Accounts');
  XLSX.writeFile(wb, 'COA_Masjid_Tazkia.xlsx');
};

export const downloadCoaTemplate = () => {
  const templateData = [{
    'Kode Akun': '1101',
    'Nama Akun': 'Kas Masjid (Contoh)',
    'Tipe Akun': 'Asset',
    'Saldo Normal': 'Debit',
    'Status Aktif': 'Ya'
  }];
  const ws = XLSX.utils.json_to_sheet(templateData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Template COA');
  XLSX.writeFile(wb, 'Template_Import_COA.xlsx');
};

export const exportBukuBesarToExcel = (
  accounts: ERPChartOfAccount[],
  journals: ERPGeneralJournal[],
  entries: ERPJournalEntry[]
) => {
  // Build a summary array for General Ledger
  const ledgerData: any[] = [];
  
  accounts.forEach(acc => {
    let runningBalance = 0;
    const accEntries = entries.filter(e => e.accountId === acc.id);
    if (accEntries.length === 0) return; // skip if no activity
    
    // Add account header
    ledgerData.push({
      'Tanggal': '',
      'No Bukti': '',
      'Keterangan': `Akun: [${acc.accountCode}] ${acc.accountName}`,
      'Debit': '',
      'Kredit': '',
      'Saldo': ''
    });

    // Add entries
    accEntries.forEach(entry => {
      const journal = journals.find(j => j.id === entry.journalId);
      const isDebitIncrease = acc.normalBalance === 'Debit';
      const change = isDebitIncrease 
        ? entry.debit - entry.credit 
        : entry.credit - entry.debit;
      
      runningBalance += change;

      ledgerData.push({
        'Tanggal': journal?.date || '',
        'No Bukti': journal?.journalNo || '',
        'Keterangan': entry.description || journal?.description || '',
        'Debit': entry.debit || 0,
        'Kredit': entry.credit || 0,
        'Saldo': runningBalance
      });
    });
    
    // Empty line separator
    ledgerData.push({ 'Tanggal': '', 'No Bukti': '', 'Keterangan': '', 'Debit': '', 'Kredit': '', 'Saldo': '' });
  });

  const ws = XLSX.utils.json_to_sheet(ledgerData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Buku Besar');
  XLSX.writeFile(wb, 'Buku_Besar_Masjid_Tazkia.xlsx');
};

export const exportJurnalUmumToExcel = (journals: ERPGeneralJournal[], entries: ERPJournalEntry[]) => {
  const data: any[] = [];

  journals.forEach(journal => {
    const journalEntries = entries.filter(e => e.journalId === journal.id);
    journalEntries.forEach((entry, idx) => {
      data.push({
        'Tanggal': idx === 0 ? journal.date : '',
        'No Jurnal': idx === 0 ? journal.journalNo : '',
        'Referensi': idx === 0 ? journal.reference : '',
        'Deskripsi Jurnal': idx === 0 ? journal.description : '',
        'Kode Akun': entry.accountCode || '', // assuming we map this before calling if needed
        'Nama Akun': entry.accountName || '',
        'Deskripsi Baris': entry.description || '',
        'Debit': entry.debit || 0,
        'Kredit': entry.credit || 0,
      });
    });
    data.push({ 'Tanggal': '', 'No Jurnal': '', 'Referensi': '', 'Deskripsi Jurnal': '', 'Kode Akun': '', 'Nama Akun': '', 'Deskripsi Baris': '', 'Debit': '', 'Kredit': '' });
  });

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Jurnal Umum');
  XLSX.writeFile(wb, 'Jurnal_Umum_Masjid_Tazkia.xlsx');
};

export const importCoaFromExcel = async (file: File): Promise<Partial<ERPChartOfAccount>[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        const accounts: Partial<ERPChartOfAccount>[] = jsonData.map((row: any) => ({
          accountCode: row['Kode Akun'],
          accountName: row['Nama Akun'],
          accountType: row['Tipe Akun'] as any,
          normalBalance: row['Saldo Normal'] as any,
          isActive: row['Status Aktif'] === 'Ya'
        }));
        
        resolve(accounts.filter(a => a.accountCode && a.accountName));
      } catch (err) {
        reject(err);
      }
    };
    reader.readAsBinaryString(file);
  });
};
