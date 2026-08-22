const fs = require('fs');
const path = require('path');

const storePath = path.join(__dirname, 'src', 'lib', 'store.ts');
let content = fs.readFileSync(storePath, 'utf8');

// 1. Add to imports
if (!content.includes('TpaRegistration')) {
  content = content.replace(
    /JamaahTransaction\n\} from '\.\.\/types';/,
    "JamaahTransaction,\n  TpaRegistration,\n  MuallafRegistration\n} from '../types';"
  );
}

// 2. Add to AppState
if (!content.includes('tpaRegistrations: TpaRegistration[]')) {
  content = content.replace(
    /JamaahTransaction\[\];/,
    "JamaahTransaction[];\n  tpaRegistrations: TpaRegistration[];\n  muallafRegistrations: MuallafRegistration[];"
  );
}

// 3. Add to defaultState
if (!content.includes('tpaRegistrations: [],')) {
  content = content.replace(
    /jamaahTransactions: \[\]/,
    "jamaahTransactions: [],\n  tpaRegistrations: [],\n  muallafRegistrations: []"
  );
}

// 4. Add to getStoredState
if (!content.includes('parsed.tpaRegistrations')) {
  content = content.replace(
    /jamaahTransactions: parsed\.jamaahTransactions \|\| \[\]/,
    "jamaahTransactions: parsed.jamaahTransactions || [],\n        tpaRegistrations: parsed.tpaRegistrations || [],\n        muallafRegistrations: parsed.muallafRegistrations || []"
  );
}

// 5. Add actions
const actionsCode = `
  const addTpaRegistration = (reg: Omit<TpaRegistration, 'id' | 'createdAt'>) => {
    setState(prev => ({
      ...prev,
      tpaRegistrations: [{
        ...reg,
        id: \`tpa-\${Math.floor(1000 + Math.random() * 9000)}\`,
        createdAt: new Date().toISOString()
      }, ...(prev.tpaRegistrations || [])]
    }));
  };

  const updateTpaRegistrationStatus = (id: string, status: TpaRegistration['status'], paymentStatus?: TpaRegistration['paymentStatus']) => {
    setState(prev => ({
      ...prev,
      tpaRegistrations: (prev.tpaRegistrations || []).map(t => {
        if (t.id === id) {
          const updated = { ...t, status };
          if (paymentStatus) updated.paymentStatus = paymentStatus;
          return updated;
        }
        return t;
      })
    }));
  };

  const addMuallafRegistration = (reg: Omit<MuallafRegistration, 'id' | 'createdAt'>) => {
    setState(prev => ({
      ...prev,
      muallafRegistrations: [{
        ...reg,
        id: \`mual-\${Math.floor(1000 + Math.random() * 9000)}\`,
        createdAt: new Date().toISOString()
      }, ...(prev.muallafRegistrations || [])]
    }));
  };

  const updateMuallafRegistrationStatus = (id: string, status: MuallafRegistration['status']) => {
    setState(prev => ({
      ...prev,
      muallafRegistrations: (prev.muallafRegistrations || []).map(m => m.id === id ? { ...m, status } : m)
    }));
  };
`;

if (!content.includes('addTpaRegistration')) {
  content = content.replace(
    /const addAgenda =/,
    actionsCode + '\n  const addAgenda ='
  );
}

// 6. Add to return statement
if (!content.includes('addTpaRegistration,')) {
  content = content.replace(
    /addAgenda,/,
    "addTpaRegistration,\n    updateTpaRegistrationStatus,\n    addMuallafRegistration,\n    updateMuallafRegistrationStatus,\n    addAgenda,"
  );
}

fs.writeFileSync(storePath, content);
console.log('Successfully updated store.ts for TPA and Muallaf');
