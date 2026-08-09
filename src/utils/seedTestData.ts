import { getStoredState, saveStoredState } from '../lib/store';
import { ERPChartOfAccount } from '../types';

export const seedTestData = async () => {
  const state = getStoredState();
  
  // 1. Seed 5 ZISWAF Donations (Some anonymous, some registered)
  const newDonations = [];
  for (let i = 1; i <= 5; i++) {
    const isAnon = i % 2 === 0;
    const cat = ['zakat', 'infaq', 'wakaf', 'shadaqah', 'infaq'][i-1] as any;
    newDonations.push({
      id: `DON-TEST-${Date.now()}-${i}`,
      programId: `PROG-${i}`,
      programTitle: `Program Kebaikan ${i}`,
      category: cat,
      amount: 100000 * i,
      uniqueCode: 100 + i,
      totalAmount: (100000 * i) + 100 + i,
      donorName: isAnon ? 'Hamba Allah' : `Jamaah ${i}`,
      donorPhone: '08123456789' + i,
      donorEmail: isAnon ? undefined : `jamaah${i}@test.com`,
      paymentMethod: 'BSI Transfer',
      isAnonymous: isAnon,
      status: 'menunggu_verifikasi',
      createdAt: new Date().toISOString(),
      transactionRef: `TRX-TEST-${Date.now()}-${i}`,
      proofUrl: 'https://via.placeholder.com/150'
    });
  }

  // 2. Seed 5 Booking Gedung
  const newGedungBookings = [];
  for (let i = 1; i <= 5; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i + 10);
    newGedungBookings.push({
      id: `GED-TEST-${Date.now()}-${i}`,
      date: date.toISOString(),
      name: `Penyewa Gedung ${i}`,
      whatsapp: '08123456789' + i,
      email: `penyewa${i}@test.com`,
      notes: `Acara pernikahan ${i}`,
      status: 'pending' as const,
      createdAt: new Date().toISOString()
    });
  }

  // 3. Seed 5 Booking Kamar
  const newKamarBookings = [];
  for (let i = 1; i <= 5; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i + 5);
    const checkout = new Date(date);
    checkout.setDate(checkout.getDate() + 2);
    
    newKamarBookings.push({
      id: `KAM-TEST-${Date.now()}-${i}`,
      date: date.toISOString(),
      checkoutDate: checkout.toISOString(),
      name: `Tamu Kamar ${i}`,
      whatsapp: '0898765432' + i,
      email: `tamu${i}@test.com`,
      roomType: ['Standar', 'VIP', 'Keluarga', 'Standar', 'VIP'][i-1] as any,
      notes: `Kunjungan rombongan ${i}`,
      status: 'pending',
      createdAt: new Date().toISOString()
    });
  }

  // 4. Seed ERP COA and Budgets if not exists
  const existingBudgets = state.erpBudgets || [];
  let newCoa: ERPChartOfAccount[] = [];
  let newBudgets = [...existingBudgets];
  if (!existingBudgets.find(b => b.id === 'BDG-001')) {
    const hasCoa = state.erpCoa.find((c: any) => c.id === 'coa-5100');
    if (!hasCoa) {
      newCoa.push({
        id: 'coa-5100',
        accountCode: '5100',
        accountName: 'Beban Operasional',
        accountType: 'Expense',
        normalBalance: 'Debit',
        isActive: true,
        createdAt: new Date().toISOString()
      });
    }

    newBudgets.push({
      id: 'BDG-001',
      year: new Date().getFullYear(),
      accountId: 'coa-5100',
      amount: 5000000,
      description: 'Anggaran Operasional (E2E Test)',
      createdAt: new Date().toISOString()
    });
  }

  // 5. Seed 5 Pengajuan Pencairan (Disbursement)
  const newDisbursements = [];
  for (let i = 1; i <= 5; i++) {
    newDisbursements.push({
      id: `DIS-TEST-${Date.now()}-${i}`,
      budgetId: 'BDG-001',
      amount: 50000 * i,
      purpose: `Pembelian keperluan operasional ${i}`,
      requestDate: new Date().toISOString(),
      requestedBy: `Staff Operasional ${i}`,
      status: 'Pending'
    });
  }

  saveStoredState({
    ...state,
    donations: [...newDonations, ...(state.donations || [])],
    gedungBookings: [...newGedungBookings, ...(state.gedungBookings || [])],
    kamarBookings: [...newKamarBookings, ...(state.kamarBookings || [])],
    erpCoa: [...state.erpCoa, ...newCoa],
    erpBudgets: newBudgets,
    erpDisbursements: [...newDisbursements, ...(state.erpDisbursements || [])]
  });

  // Done!
  console.log("End-to-end Test Data Seeded!");
  return true;
};
