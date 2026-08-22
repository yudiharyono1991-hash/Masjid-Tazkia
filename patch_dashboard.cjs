const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'components', 'PengurusDkmDashboard.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Import the new components
if (!content.includes('TpaAdmin')) {
  content = content.replace(
    /import \{ RoleManagerAdmin \}.*?;/g,
    "import { RoleManagerAdmin } from './admin/RoleManagerAdmin';\nimport { TpaAdmin } from './admin/TpaAdmin';\nimport { MuallafAdmin } from './admin/MuallafAdmin';"
  );
}

// Ensure the imports are definitely added if the above regex fails
if (!content.includes('TpaAdmin')) {
  content = content.replace(
    /import React, \{ useState.*?\} from 'react';/,
    "import React, { useState, useEffect, useRef, useMemo } from 'react';\nimport { TpaAdmin } from './admin/TpaAdmin';\nimport { MuallafAdmin } from './admin/MuallafAdmin';"
  );
}

// Add the tabs to the navigation if possible
// The tabs in PengurusDkmDashboard are usually defined as an array or rendered manually.
// Let's look for "Manajemen Jamaah" or "Program"
if (content.includes("value: 'jamaah'")) {
  content = content.replace(
    /value: 'jamaah', label: 'Database Jamaah' \},/g,
    "value: 'jamaah', label: 'Database Jamaah' },\n      { value: 'tpa', label: 'Pendaftar TPA' },\n      { value: 'muallaf', label: 'Muallaf Center' },"
  );
}

// If it's using activeTab in a switch statement:
if (content.includes("switch (activeTab)")) {
  if (!content.includes("case 'tpa':")) {
    content = content.replace(
      /case 'jamaah':\n\s*return <JamaahManagerAdmin \/>;/g,
      "case 'jamaah':\n        return <JamaahManagerAdmin />;\n      case 'tpa':\n        return <TpaAdmin />;\n      case 'muallaf':\n        return <MuallafAdmin />;"
    );
  }
} else if (content.includes("activeTab === 'jamaah'")) {
    content = content.replace(
      /activeTab === 'jamaah' && \(\s*<JamaahManagerAdmin \/>\s*\)/g,
      "activeTab === 'jamaah' && (<JamaahManagerAdmin />)}\n        {activeTab === 'tpa' && (<TpaAdmin />)}\n        {activeTab === 'muallaf' && (<MuallafAdmin />)"
    );
}

fs.writeFileSync(filePath, content);
console.log('Successfully updated PengurusDkmDashboard.tsx');
