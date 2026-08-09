import { getStoredState, saveStoredState } from '../lib/store';

export const cleanTestData = () => {
  const state = getStoredState();
  const newState = {
    ...state,
    donations: (state.donations || []).filter((d: any) => !d.id.includes('-TEST-')),
    gedungBookings: (state.gedungBookings || []).filter((d: any) => !d.id.includes('-TEST-')),
    kamarBookings: (state.kamarBookings || []).filter((d: any) => !d.id.includes('-TEST-')),
    erpDisbursements: (state.erpDisbursements || []).filter((d: any) => !d.id.includes('-TEST-')),
    erpJournals: (state.erpJournals || []).filter((d: any) => !d.id.includes('-TEST-')),
    erpJournalEntries: (state.erpJournalEntries || []).filter((d: any) => !d.journalId.includes('-TEST-')),
  };
  saveStoredState(newState);
  alert("Data Uji Coba Berhasil Dibersihkan!");
  window.location.reload();
};
