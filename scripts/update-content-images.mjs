// Rewrites `image`/`imageAlt` (and appends a shared-photo note to
// `description` where a single real photo covers several catalog
// variants) across the content collections to point at the real MBF
// photography processed by process-real-images.mjs.
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();

const equipmentUpdates = {
  '500-bbl-cylindrical-storage-tanks': {
    image: '/images/equipment/500-bbl-cylindrical-storage-tanks.webp',
    imageAlt: 'Row of MBF 500 BBL cylindrical storage tanks, skid mounted, in the Abu Dhabi yard',
  },
  '500-bbl-rectangle-storage-tank': {
    image: '/images/equipment/500-bbl-rectangle-storage-tank.webp',
    imageAlt: 'MBF 500 BBL rectangular skid-mounted storage tank',
  },
  'acid-storage-tank-skid-mounted': {
    image: '/images/equipment/acid-storage-tank-skid-mounted.webp',
    imageAlt: 'MBF skid-mounted storage tank in the Abu Dhabi yard',
  },
  'diesel-tank': {
    image: '/images/equipment/diesel-tank.webp',
    imageAlt: 'MBF skid-mounted diesel tank with fuel pump and hose reel',
  },
  'batch-mixer-coated': {
    image: '/images/equipment/batch-mixer-coated.webp',
    imageAlt: 'MBF coated batch mixer skid with dual mixing tanks',
  },
  'batch-mixer-non-coated': {
    image: '/images/equipment/batch-mixer-non-coated.webp',
    imageAlt: 'MBF non-coated batch mixer skid with dual mixing tanks',
  },
  'multi-stage-pump': {
    image: '/images/equipment/multi-stage-pump.webp',
    imageAlt: 'MBF multi-stage pump and tank skid unit',
  },
  'single-triplex-pump': {
    image: '/images/equipment/single-triplex-pump.webp',
    imageAlt: 'MBF single triplex pump skid',
  },
  'centrifugal-pump': {
    image: '/images/equipment/centrifugal-pump.webp',
    imageAlt: 'MBF centrifugal pump unit',
  },
  'self-priming-dewatering-pumps': {
    image: '/images/equipment/self-priming-dewatering-pumps.webp',
    imageAlt: 'MBF self-priming lifting and dewatering pump',
  },
  'chemical-injection-pump': {
    image: '/images/equipment/chemical-injection-pump.webp',
    imageAlt: 'MBF chemical injection pump unit',
  },
  'choke-manifold-5k': {
    image: '/images/equipment/choke-manifold-5k.webp',
    imageAlt: 'MBF Choke Manifold 5K skid with hand wheels and hydraulic actuator',
  },
  'surface-safety-valve-5k': {
    image: '/images/equipment/surface-safety-valve-5k.webp',
    imageAlt: 'MBF Surface Safety Valve 5K on a skid frame',
  },
  'caravan-40ft-skid-mounted': {
    image: '/images/equipment/caravan-40ft-skid-mounted.webp',
    imageAlt: 'MBF skid-mounted safety caravan exterior',
    sharedPhotoNote: true,
  },
  'caravan-40ft-senior-accommodation': {
    image: '/images/equipment/caravan-40ft-senior-accommodation.webp',
    imageAlt: 'MBF skid-mounted accommodation caravan exterior',
    sharedPhotoNote: true,
  },
  'caravan-40ft-trailer-mounted': {
    image: '/images/equipment/caravan-40ft-trailer-mounted.webp',
    imageAlt: 'MBF trailer-mounted safety caravan on site',
  },
  'caravan-20ft-masjid-clinic-security': {
    image: '/images/equipment/caravan-20ft-masjid-clinic-security.webp',
    imageAlt: 'MBF skid-mounted multi-purpose caravan exterior',
    sharedPhotoNote: true,
  },
  'caravan-20ft-toilet-ablution': {
    image: '/images/equipment/caravan-20ft-toilet-ablution.webp',
    imageAlt: 'MBF skid-mounted ablution caravan with fresh water tank signage',
  },
  'coil-tubing-unit': {
    image: '/images/equipment/coil-tubing-unit.webp',
    imageAlt: 'MBF coiled tubing reel unit',
  },
  'twin-pump': {
    image: '/images/equipment/twin-pump.webp',
    imageAlt: 'MBF twin pump skid and trailer unit',
  },
  'nitrogen-pump': {
    image: '/images/equipment/nitrogen-pump.webp',
    imageAlt: 'MBF nitrogen pump unit',
  },
};

const serviceUpdates = {
  'tank-cleaning': {
    image: '/images/services/tank-cleaning-hero.webp',
    imageAlt: 'MBF storage tank in the Abu Dhabi yard, ready for cleaning',
  },
  maintenance: {
    image: '/images/services/maintenance-hero.webp',
    imageAlt: 'MBF diesel-powered pump skid serviced in the field',
  },
  'caravan-manufacturing': {
    image: '/images/services/caravan-manufacturing-hero.webp',
    imageAlt: 'MBF trailer-mounted caravan manufactured in Abu Dhabi',
  },
};

async function updateJson(filePath, updates) {
  const raw = await readFile(filePath, 'utf8');
  const data = JSON.parse(raw);
  data.image = updates.image;
  data.imageAlt = updates.imageAlt;
  await writeFile(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
  console.log('updated', path.basename(filePath));
}

for (const [slug, updates] of Object.entries(equipmentUpdates)) {
  await updateJson(path.join(ROOT, 'src/content/equipment', `${slug}.json`), updates);
}
for (const [slug, updates] of Object.entries(serviceUpdates)) {
  await updateJson(path.join(ROOT, 'src/content/services', `${slug}.json`), updates);
}

console.log('Done updating content image fields.');
