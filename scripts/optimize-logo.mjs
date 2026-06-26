// Re-encode logo.webp at a smaller display size (300x300 max) and higher compression
import sharp from 'sharp';
import fs from 'fs';

const input  = 'public/assets/images/logo.webp';
const output = 'public/assets/images/logo_small.webp';

const before = fs.statSync(input).size;

// Resize to max 300px (covers both loader 140px and hero 180px with 2x DPR)
// and re-encode at quality 80
const info = await sharp(input)
  .resize(300, 300, { fit: 'inside', withoutEnlargement: true })
  .webp({ quality: 80, effort: 6 })
  .toFile(output);

const saving = ((1 - info.size / before) * 100).toFixed(1);
console.log(`logo.webp: Before: ${Math.round(before/1024)} KB  After: ${Math.round(info.size/1024)} KB  Saving: ${saving}%`);

fs.renameSync(output, input);
console.log('Replaced logo.webp with optimized version.');
