// Processes the real MBF client-partner logos (uploaded by the client) into
// optimized WebP assets in public/images/clients/, replacing the generated
// SVG placeholders referenced by LogoStrip.astro. Source files live outside
// the repo (uploaded via chat), so this script is not part of the build.
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const SRC = '/tmp/claude-0/-home-user-MatarBinFraih/da4b9358-b806-532a-b646-f4a5882b3235/scratchpad/logo';
const OUT = path.resolve(process.cwd(), 'public/images/clients');

const logos = [
  ['MBF-Trading-Oilfield-equipment-rental-prides-Client_1.jpeg', 'client-1.webp', 'BJ Services'],
  ['MBF-Trading-Oilfield-equipment-rental-prides-Client_2.jpeg', 'client-2.webp', 'ESNAAD — ADNOC Group'],
  ['MBF-Trading-Oilfield-equipment-rental-prides-Client_3.jpeg', 'client-3.webp', 'Bin Fraih Group'],
  ['MBF-Trading-Oilfield-equipment-rental-prides-Client_4.jpeg', 'client-4.webp', 'Al Ahlia Oil Fields Development Co.'],
  ['MBF-Trading-Oilfield-equipment-rental-prides-Client_7.jpeg', 'client-5.webp', 'Safwan Petroleum Technologies Establishment'],
  ['MBF-Trading-Oilfield-equipment-rental-prides-Client_8.jpeg', 'client-6.webp', 'National Drilling Company'],
  ['MBF-Trading-Oilfield-equipment-rental-prides-Client_9.jpeg', 'client-7.webp', 'Baker Hughes'],
  ['MBF-Trading-Oilfield-equipment-rental-prides-Client_10.jpeg', 'client-8.webp', 'Schlumberger'],
];

await mkdir(OUT, { recursive: true });

for (const [src, dest] of logos) {
  await sharp(path.join(SRC, src))
    .trim({ threshold: 12 })
    .resize({ height: 140, withoutEnlargement: true })
    .webp({ quality: 92 })
    .toFile(path.join(OUT, dest));
  console.log(`${src} -> ${dest}`);
}
