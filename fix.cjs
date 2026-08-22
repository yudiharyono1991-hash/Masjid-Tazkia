const fs = require('fs');
const path = require('path');

const patchContent = fs.readFileSync('store.patch', 'utf16le'); // PS > writes utf16le by default! Wait, let's read as string and handle encoding.
// Actually, let's just write a script that reads the file as a buffer, decodes it, modifies it, and writes it back as utf8.

const buffer = fs.readFileSync('store.patch');
let text = buffer.toString('utf16le');
if (text.indexOf('diff --git') === -1) {
    // maybe it's utf8?
    text = buffer.toString('utf8');
}

const lines = text.split(/\r?\n/);
const cleanLines = [];
let inCorruptHunk = false;
let hunkCount = 0;

for (const line of lines) {
    if (line.startsWith('@@ ')) {
        hunkCount++;
        if (hunkCount === 1) {
            inCorruptHunk = true;
            continue; // Skip the hunk header
        } else if (hunkCount === 2) {
            inCorruptHunk = false;
        }
    }
    
    if (!inCorruptHunk) {
        cleanLines.push(line);
    }
}

fs.writeFileSync('clean.patch', cleanLines.join('\n'), 'utf8');
console.log('clean.patch written');
