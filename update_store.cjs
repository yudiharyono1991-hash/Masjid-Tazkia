const fs = require('fs');
const path = 'd:/PROJECT APP SPS 2026/MasjidTazkia/src/lib/store.ts';
let content = fs.readFileSync(path, 'utf8');

if (!content.includes('KeropakTransaction')) {
  content = content.replace('KamarBooking,', 'KamarBooking,\n  KeropakTransaction,');
}

if (!content.includes('keropakTransactions: KeropakTransaction[]')) {
  content = content.replace('erpJournalEntries: ERPJournalEntry[];', 'erpJournalEntries: ERPJournalEntry[];\n  keropakTransactions: KeropakTransaction[];');
}

if (!content.includes('keropakTransactions: [],')) {
  content = content.replace('erpJournalEntries: [],', 'erpJournalEntries: [],\n  keropakTransactions: [],');
}

if (!content.includes('addKeropakTransaction')) {
  content = content.replace('deleteKamarBooking: (id: string) => void;', 'deleteKamarBooking: (id: string) => void;\n  addKeropakTransaction: (keropak: Omit<KeropakTransaction, \'id\' | \'createdAt\'>) => void;\n  deleteKeropakTransaction: (id: string) => void;');
}

if (!content.includes('const addKeropakTransaction =')) {
  const crudFunctions = `
  const addKeropakTransaction = (keropak: Omit<KeropakTransaction, 'id' | 'createdAt'>) => {
    const newKeropak: KeropakTransaction = {
      ...keropak,
      id: 'keropak-' + Date.now(),
      createdAt: new Date().toISOString()
    };
    setState(prev => ({ ...prev, keropakTransactions: [...(prev.keropakTransactions || []), newKeropak] }));
  };

  const deleteKeropakTransaction = (id: string) => {
    setState(prev => ({ ...prev, keropakTransactions: (prev.keropakTransactions || []).filter(k => k.id !== id) }));
  };
`;
  content = content.replace('const addKamarBooking = (booking:', crudFunctions + '\n  const addKamarBooking = (booking:');
}

if (!content.includes('addKeropakTransaction,')) {
  content = content.replace('addKamarBooking,', 'addKeropakTransaction,\n    deleteKeropakTransaction,\n    addKamarBooking,');
}

fs.writeFileSync(path, content);
console.log('store.ts updated');
