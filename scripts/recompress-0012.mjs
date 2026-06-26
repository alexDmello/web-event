import sharp from 'sharp';
import fs from 'fs';

const input = 'public/assets/05 PHOTOS/Proposal/0012.webp';
const output = 'public/assets/05 PHOTOS/Proposal/0012_compressed.webp';

const before = fs.statSync(input).size;
const info = await sharp(input).webp({ quality: 78, effort: 6 }).toFile(output);
const saving = ((1 - info.size / before) * 100).toFixed(1);
console.log(`Before: ${Math.round(before/1024)} KB  After: ${Math.round(info.size/1024)} KB  Saving: ${saving}%`);

// Replace the original with the compressed version
fs.renameSync(output, input);
console.log('Replaced 0012.webp with compressed version.');
