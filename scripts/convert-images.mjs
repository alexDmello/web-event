/**
 * scripts/convert-images.mjs
 *
 * One-time conversion script. Run with:
 *   node scripts/convert-images.mjs
 *
 * What it does:
 *   1. Converts all PNG files in /public/assets/images/ to WebP (quality 85)
 *   2. Converts 0012.JPG in /public/assets/05 PHOTOS/Proposal/ to WebP
 *   3. Prints a size-comparison report showing savings per file
 *
 * Requires: sharp  (installed via: npm install --save-dev sharp)
 */

import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

// ─── Jobs to convert ────────────────────────────────────────────────────────
const JOBS = [
  // PNG → WebP for everything in /public/assets/images/
  ...fs.readdirSync(path.join(ROOT, 'public/assets/images'))
    .filter(f => /\.(png|jpg|jpeg)$/i.test(f))
    .map(f => ({
      input:  path.join(ROOT, 'public/assets/images', f),
      output: path.join(ROOT, 'public/assets/images', f.replace(/\.(png|jpg|jpeg)$/i, '.webp')),
      quality: 85
    })),

  // 0012.JPG → 0012.webp (27.5 MB raw JPEG → target ~300–600 KB)
  {
    input:   path.join(ROOT, 'public/assets/05 PHOTOS/Proposal/0012.JPG'),
    output:  path.join(ROOT, 'public/assets/05 PHOTOS/Proposal/0012.webp'),
    quality: 82
  }
];

// ─── Run ─────────────────────────────────────────────────────────────────────
const results = [];

for (const job of JOBS) {
  if (!fs.existsSync(job.input)) {
    console.warn(`⚠  Skipped (not found): ${path.relative(ROOT, job.input)}`);
    continue;
  }

  const inputBytes  = fs.statSync(job.input).size;

  try {
    await sharp(job.input)
      .webp({ quality: job.quality, effort: 5 })
      .toFile(job.output);

    const outputBytes = fs.statSync(job.output).size;
    const saving      = ((1 - outputBytes / inputBytes) * 100).toFixed(1);

    results.push({
      file:    path.relative(ROOT, job.input),
      before:  (inputBytes  / 1024).toFixed(0) + ' KB',
      after:   (outputBytes / 1024).toFixed(0) + ' KB',
      saving:  saving + '%'
    });
  } catch (err) {
    console.error(`✗  Failed: ${path.relative(ROOT, job.input)}\n   ${err.message}`);
  }
}

// ─── Report ──────────────────────────────────────────────────────────────────
console.log('\n──────────────────────────────────────────────────────────');
console.log('  Image Conversion Report');
console.log('──────────────────────────────────────────────────────────');
console.table(results);
console.log('\nDone. Commit the new .webp files and delete the originals if desired.\n');
