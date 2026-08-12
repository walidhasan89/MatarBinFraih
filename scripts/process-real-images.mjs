// Processes the real MBF photography (uploaded by the client) into
// optimized WebP assets in public/images/, replacing the earlier
// generated SVG placeholders. Run once; source files live outside the
// repo (uploaded via chat), so this script is not part of the build.
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const SRC1 = '/tmp/claude-0/-home-user-MatarBinFraih/da4b9358-b806-532a-b646-f4a5882b3235/scratchpad/uploaded-images/file1';
const SRC2 = '/tmp/claude-0/-home-user-MatarBinFraih/da4b9358-b806-532a-b646-f4a5882b3235/scratchpad/uploaded-images/file2';
const OUT = path.resolve(process.cwd(), 'public/images');

async function convert(srcRel, destRel, { width, quality = 82, fit = 'inside' } = {}) {
  const src = srcRel.startsWith('file2/') ? path.join(SRC2, srcRel.slice(6)) : path.join(SRC1, srcRel.slice(6));
  const dest = path.join(OUT, destRel);
  await mkdir(path.dirname(dest), { recursive: true });
  let img = sharp(src).rotate();
  if (width) img = img.resize({ width, fit, withoutEnlargement: true });
  await img.webp({ quality }).toFile(dest);
  console.log(`${srcRel} -> ${destRel}`);
}

// --- Equipment product photos (card + detail page, 4:3 object-cover) ---
const equipment = [
  ['file1/500-BBL-Cylindrical-Storage-Tanks.png', 'equipment/500-bbl-cylindrical-storage-tanks.webp'],
  ['file1/500-BBL-Rectangle-Storage-Tank.png', 'equipment/500-bbl-rectangle-storage-tank.webp'],
  ['file2/MatarbinFraih-2.png', 'equipment/acid-storage-tank-skid-mounted.webp'],
  ['file1/DIESEL-TANK.png', 'equipment/diesel-tank.webp'],
  ['file1/BATCH-MIXER.png', 'equipment/batch-mixer-coated.webp'],
  ['file2/non-coated.jpeg', 'equipment/batch-mixer-non-coated.webp'],
  ['file2/Multi-stage-tank.png', 'equipment/multi-stage-pump.webp'],
  ['file2/SINGLE-TRIPLEX-PUMP.png', 'equipment/single-triplex-pump.webp'],
  ['file1/CENTRIFUGAL-PUMP.png', 'equipment/centrifugal-pump.webp'],
  ['file2/Self-Priming-Lifting-Dewatering-Pumps-.png', 'equipment/self-priming-dewatering-pumps.webp'],
  ['file1/Chemical-Injection-Pump.png', 'equipment/chemical-injection-pump.webp'],
  ['file1/Choke-Manifold-5k.png', 'equipment/choke-manifold-5k.webp'],
  ['file2/SURFACE-SAFETY-VALVE-5K.png', 'equipment/surface-safety-valve-5k.webp'],
  ['file1/MatarbinFraih-1.png', 'equipment/caravan-40ft-trailer-mounted.webp'],
  ['file2/SAFETY-CARAVAN-UNIT.png', 'equipment/caravan-40ft-skid-mounted.webp'],
  ['file2/SAFETY-CARAVAN-UNIT.png', 'equipment/caravan-40ft-senior-accommodation.webp'],
  ['file2/SAFETY-CARAVAN-UNIT.png', 'equipment/caravan-20ft-masjid-clinic-security.webp'],
  ['file2/SAFETY-CARAVAN-UNIT.png', 'equipment/caravan-20ft-toilet-ablution.webp'],
  ['file1/Coil-Tubing-Unit.png', 'equipment/coil-tubing-unit.webp'],
  ['file2/TWIN-PUMP.png', 'equipment/twin-pump.webp'],
  ['file2/NITROGEN-PUMP.png', 'equipment/nitrogen-pump.webp'],
];
for (const [src, dest] of equipment) {
  await convert(src, dest, { width: 1100 });
}

// --- Hero (wide yard panorama) ---
await convert('file1/MatarbinFraih.png', 'hero/hero-oilfield-yard.webp', { width: 1920 });

// --- Services hero + carousel slides ---
await convert('file2/MatarbinFraih-2.png', 'services/tank-cleaning-hero.webp', { width: 1400 });
await convert('file1/Diasel.png', 'services/maintenance-hero.webp', { width: 1400 });
await convert('file1/MatarbinFraih-1.png', 'services/caravan-manufacturing-hero.webp', { width: 1400 });

await convert('file1/MatarbinFraih-1-1.png', 'services/carousel-equipment-rental.webp', { width: 1920 });
await convert('file1/500-BBL-Cylindrical-Storage-Tanks.png', 'services/carousel-tank-cleaning.webp', { width: 1920 });
await convert('file1/Diasel.png', 'services/carousel-maintenance.webp', { width: 1920 });
await convert('file2/SAFETY-CARAVAN-UNIT.png', 'services/carousel-caravan-manufacturing.webp', { width: 1920 });

// --- About ---
await convert('file2/MatarbinFraih-3.png', 'about/about-facility.webp', { width: 1400 });

// --- Projects thumbnails ---
await convert('file2/MatarbinFraih-4.png', 'projects/thumb-tanks.webp', { width: 800 });
await convert('file1/CHEMICAL-INJECTION-PUMP-#U2013-HUSKE.png', 'projects/thumb-rig.webp', { width: 800 });

// --- Home stat card photo (replaces the SVG "field team" placeholder —
// no people/PPE photos were provided, so this is equipment, not a worker) ---
await convert('file2/TWIN-PUMP-2.png', 'home/stat-photo.webp', { width: 900 });

// --- Brand logo (real MBF derrick + wordmark, transparent PNG) ---
await mkdir(path.join(OUT, 'brand'), { recursive: true });
await sharp(path.join(SRC2, 'Matarbinfraih-logo.webp'))
  .resize({ width: 400, withoutEnlargement: true })
  .png()
  .toFile(path.join(OUT, 'brand/logo.png'));
console.log('logo -> brand/logo.png');

// Square favicon crop (derrick icon only, top portion of the lockup).
await sharp(path.join(SRC2, 'Matarbinfraih-logo.webp'))
  .extract({ left: 0, top: 0, width: 509, height: 509 })
  .resize({ width: 128, height: 128 })
  .png()
  .toFile(path.join(process.cwd(), 'public/favicon.png'));
console.log('logo -> favicon.png');

// --- OG share image, cropped from the real hero photo ---
await mkdir(path.join(OUT, 'og'), { recursive: true });
await sharp(path.join(SRC1, 'MatarbinFraih.png'))
  .resize({ width: 1200, height: 630, fit: 'cover', position: 'centre' })
  .png()
  .toFile(path.join(OUT, 'og/og-default.png'));
console.log('hero -> og/og-default.png');

console.log('Done processing real images.');
