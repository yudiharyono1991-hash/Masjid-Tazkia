import { useMasjidStore } from '../lib/store';

export const cleanTestData = () => {
  useMasjidStore.setState((prev: any) => ({
    ...prev,
    donations: (prev.donations || []).filter((d: any) => !d.id.includes('-TEST-')),
    gedungBookings: (prev.gedungBookings || []).filter((d: any) => !d.id.includes('-TEST-')),
    kamarBookings: (prev.kamarBookings || []).filter((d: any) => !d.id.includes('-TEST-')),
    erpDisbursements: (prev.erpDisbursements || []).filter((d: any) => !d.id.includes('-TEST-')),
    erpJournals: (prev.erpJournals || []).filter((d: any) => !d.id.includes('-TEST-')),
    erpJournalEntries: (prev.erpJournalEntries || []).filter((d: any) => !d.journalId.includes('-TEST-')),
  }));
  alert("Data Uji Coba Berhasil Dibersihkan!");
};
