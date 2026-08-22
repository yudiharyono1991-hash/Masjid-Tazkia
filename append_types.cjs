
const fs = require('fs');
const path = 'd:/PROJECT APP SPS 2026/MasjidTazkia/src/types.ts';
let content = fs.readFileSync(path, 'utf8');
content += '\nexport interface KeropakTransaction {\n  id: string;\n  type: \'jumat\' | \'harian\' | \'keluar\';\n  amount: number;\n  date: string;\n  description: string;\n  createdAt: string;\n}\n';
fs.writeFileSync(path, content);

