import { useMasjidStore } from '../lib/store';

export const seedTestData = async () => {
  const store = useMasjidStore.getState();
  
  // 1. Seed 5 ZISWAF Donations (Some anonymous, some registered)
  for (let i = 1; i <= 5; i++) {
    const isAnon = i % 2 === 0;
    const cat = ['zakat', 'infaq', 'wakaf', 'shadaqah', 'infaq'][i-1] as any;
    store.addDonation({
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
  for (let i = 1; i <= 5; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i + 10);
    // In case addGedungBooking is missing, we use a manual setState injection
    const booking = {
      id: `GED-TEST-${Date.now()}-${i}`,
      date: date.toISOString(),
      name: `Penyewa Gedung ${i}`,
      whatsapp: '08123456789' + i,
      email: `penyewa${i}@test.com`,
      notes: `Acara pernikahan ${i}`,
      status: 'pending' as const,
      createdAt: new Date().toISOString()
    };
    useMasjidStore.setState((prev: any) => ({
      ...prev,
      gedungBookings: [booking, ...(prev.gedungBookings || [])]
    }));
  }

  // 3. Seed 5 Booking Kamar
  for (let i = 1; i <= 5; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i + 5);
    const checkout = new Date(date);
    checkout.setDate(checkout.getDate() + 2);
    
    if (store.addKamarBooking) {
      store.addKamarBooking({
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
  }

  // 4. Seed ERP COA and Budgets if not exists
  const existingBudgets = store.erpBudgets || [];
  if (!existingBudgets.find(b => b.id === 'BDG-001')) {
    useMasjidStore.setState((prev: any) => {
      // Add missing COA if needed
      const hasCoa = prev.erpCoa.find((c: any) => c.id === 'coa-5100');
      const newCoa = hasCoa ? [] : [{
        id: 'coa-5100',
        accountCode: '5100',
        accountName: 'Beban Operasional',
        category: 'Beban',
        normalBalance: 'Debit',
        isActive: true,
        createdAt: new Date().toISOString()
      }];

      const newBudget = {
        id: 'BDG-001',
        period: `${new Date().getFullYear()}`,
        accountId: 'coa-5100',
        amount: 5000000,
        realized: 0,
        notes: 'Anggaran Operasional (E2E Test)',
        createdAt: new Date().toISOString()
      };

      return {
        ...prev,
        erpCoa: [...prev.erpCoa, ...newCoa],
        erpBudgets: [...prev.erpBudgets, newBudget]
      };
    });
  }

  // 5. Seed 5 Pengajuan Pencairan (Disbursement)
  for (let i = 1; i <= 5; i++) {
    if (store.addErpDisbursement) {
      store.addErpDisbursement({
        id: `DIS-TEST-${Date.now()}-${i}`,
        budgetId: 'BDG-001',
        amount: 50000 * i,
        purpose: `Pembelian keperluan operasional ${i}`,
        requestDate: new Date().toISOString(),
        requestedBy: `Staff Operasional ${i}`,
        status: 'Pending'
      });
    }
  }

  // Done!
  console.log("End-to-end Test Data Seeded!");
  return true;
};
