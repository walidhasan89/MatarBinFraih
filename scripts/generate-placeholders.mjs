// One-off generator for local placeholder imagery.
// Outbound network access to stock-photo hosts is blocked by this
// environment's egress policy, so real stock photography could not be
// fetched. This script produces simple, consistent, on-brand SVG (and one
// rasterized PNG for the OG image) placeholders instead, sized per the
// image slot's role from design-system.md §5. Every placeholder is meant
// to be swapped for real MBF photography later.
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const OUT = path.resolve(process.cwd(), 'public/images');

const INK = '#101114';
const INK_SOFT = '#1B1C20';
const AMBER = '#FFC01E';
const AMBER_SOFT = '#FFE8A8';
const GRAY = '#6B6D72';
const WHITE = '#FFFFFF';

function hatch(id, color = WHITE, opacity = 0.06) {
  return `
  <pattern id="${id}" width="14" height="14" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
    <line x1="0" y1="0" x2="0" y2="14" stroke="${color}" stroke-opacity="${opacity}" stroke-width="2" />
  </pattern>`;
}

// Simple line-art glyphs per equipment/category type, drawn on a 200x200 viewbox, centered later.
const ICONS = {
  tank: `<rect x="30" y="70" width="140" height="80" rx="14" fill="none" stroke="currentColor" stroke-width="4"/><line x1="30" y1="95" x2="170" y2="95" stroke="currentColor" stroke-width="3"/><rect x="90" y="45" width="20" height="30" fill="none" stroke="currentColor" stroke-width="4"/><line x1="45" y1="150" x2="45" y2="165" stroke="currentColor" stroke-width="4"/><line x1="155" y1="150" x2="155" y2="165" stroke="currentColor" stroke-width="4"/>`,
  pump: `<circle cx="90" cy="100" r="42" fill="none" stroke="currentColor" stroke-width="4"/><circle cx="90" cy="100" r="10" fill="none" stroke="currentColor" stroke-width="3"/><rect x="132" y="88" width="46" height="24" rx="4" fill="none" stroke="currentColor" stroke-width="4"/><line x1="48" y1="100" x2="20" y2="100" stroke="currentColor" stroke-width="4"/>`,
  valve: `<rect x="70" y="40" width="20" height="40" fill="none" stroke="currentColor" stroke-width="4"/><rect x="40" y="80" width="80" height="34" rx="6" fill="none" stroke="currentColor" stroke-width="4"/><line x1="40" y1="97" x2="10" y2="97" stroke="currentColor" stroke-width="4"/><line x1="120" y1="97" x2="150" y2="97" stroke="currentColor" stroke-width="4"/><line x1="55" y1="30" x2="105" y2="30" stroke="currentColor" stroke-width="4"/>`,
  caravan: `<rect x="24" y="70" width="152" height="60" rx="8" fill="none" stroke="currentColor" stroke-width="4"/><line x1="60" y1="70" x2="60" y2="130" stroke="currentColor" stroke-width="3"/><line x1="110" y1="70" x2="110" y2="130" stroke="currentColor" stroke-width="3"/><circle cx="55" cy="140" r="9" fill="none" stroke="currentColor" stroke-width="3"/><circle cx="145" cy="140" r="9" fill="none" stroke="currentColor" stroke-width="3"/>`,
  unit: `<rect x="35" y="55" width="130" height="70" rx="10" fill="none" stroke="currentColor" stroke-width="4"/><circle cx="70" cy="90" r="14" fill="none" stroke="currentColor" stroke-width="3"/><line x1="100" y1="75" x2="150" y2="75" stroke="currentColor" stroke-width="3"/><line x1="100" y1="90" x2="150" y2="90" stroke="currentColor" stroke-width="3"/><line x1="100" y1="105" x2="140" y2="105" stroke="currentColor" stroke-width="3"/>`,
  rig: `<line x1="100" y1="20" x2="60" y2="150" stroke="currentColor" stroke-width="4"/><line x1="100" y1="20" x2="140" y2="150" stroke="currentColor" stroke-width="4"/><line x1="72" y1="90" x2="128" y2="90" stroke="currentColor" stroke-width="3"/><line x1="80" y1="60" x2="120" y2="60" stroke="currentColor" stroke-width="3"/><line x1="30" y1="150" x2="170" y2="150" stroke="currentColor" stroke-width="4"/>`,
  worker: `<circle cx="100" cy="65" r="26" fill="none" stroke="currentColor" stroke-width="4"/><path d="M55 165 Q55 110 100 108 Q145 110 145 165" fill="none" stroke="currentColor" stroke-width="4"/><path d="M78 55 Q100 40 122 55" fill="none" stroke="currentColor" stroke-width="4"/>`,
  logo: `<rect x="20" y="70" width="24" height="60" fill="currentColor"/><rect x="52" y="50" width="24" height="80" fill="currentColor"/><rect x="84" y="30" width="24" height="100" fill="currentColor"/><rect x="116" y="55" width="24" height="75" fill="currentColor"/><rect x="148" y="80" width="24" height="50" fill="currentColor"/>`,
  avatar: `<circle cx="100" cy="78" r="34" fill="none" stroke="currentColor" stroke-width="4"/><path d="M42 178 Q42 120 100 118 Q158 120 158 178" fill="none" stroke="currentColor" stroke-width="4"/>`,
};

function iconGlyph(icon, x, y, size, color) {
  const body = ICONS[icon] ?? ICONS.unit;
  const scale = size / 200;
  return `<g transform="translate(${x},${y}) scale(${scale})" color="${color}">${body}</g>`;
}

function card({
  w,
  h,
  bg = INK_SOFT,
  hatchColor = WHITE,
  icon = 'unit',
  iconColor = AMBER,
  title,
  subtitle,
  titleColor = WHITE,
  subtitleColor = AMBER_SOFT,
  showCaption = true,
  // Photographic-role placeholders (hero, carousel slides, stat photos,
  // thumbnails) sit *underneath* real page copy the visitor is meant to
  // read, so they skip the big centered icon+title block in favor of a
  // small, unobtrusive corner watermark — otherwise the baked-in SVG text
  // visually collides with the real headline layered on top.
  photoMode = false,
}) {
  const hatchId = 'h' + Math.random().toString(36).slice(2, 8);

  if (photoMode) {
    const iconSize = Math.min(w, h) * 0.16;
    const pad = Math.min(w, h) * 0.05;
    const fontCaption = Math.max(11, Math.min(w, h) * 0.024);
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>${hatch(hatchId, hatchColor, 0.05)}</defs>
  <rect width="${w}" height="${h}" fill="${bg}"/>
  <rect width="${w}" height="${h}" fill="url(#${hatchId})"/>
  ${iconGlyph(icon, pad, h - pad - iconSize, iconSize, iconColor)}
  ${
    showCaption
      ? `<text x="${pad + iconSize + 14}" y="${h - pad - iconSize / 2 + fontCaption * 0.35}" font-family="Arial, sans-serif" font-size="${fontCaption}" fill="#6B6D72">${escapeXml(title ?? 'MBF placeholder photo — swap for real photography')}</text>`
      : ''
  }
</svg>`;
  }

  const iconSize = Math.min(w, h) * 0.34;
  const iconX = w / 2 - iconSize / 2;
  const iconY = h * 0.32 - iconSize / 2;
  const fontTitle = Math.max(16, Math.min(w, h) * 0.055);
  const fontSub = fontTitle * 0.5;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>${hatch(hatchId, hatchColor, bg === WHITE ? 0.05 : 0.07)}</defs>
  <rect width="${w}" height="${h}" fill="${bg}"/>
  <rect width="${w}" height="${h}" fill="url(#${hatchId})"/>
  ${iconGlyph(icon, iconX, iconY, iconSize, iconColor)}
  ${
    title
      ? `<text x="${w / 2}" y="${h * 0.32 + iconSize / 2 + fontTitle * 1.4}" text-anchor="middle" font-family="Arial, sans-serif" font-weight="700" font-size="${fontTitle}" fill="${titleColor}">${escapeXml(title)}</text>`
      : ''
  }
  ${
    subtitle
      ? `<text x="${w / 2}" y="${h * 0.32 + iconSize / 2 + fontTitle * 1.4 + fontSub * 1.8}" text-anchor="middle" font-family="Arial, sans-serif" font-weight="600" font-size="${fontSub}" letter-spacing="1" fill="${subtitleColor}">${escapeXml(subtitle.toUpperCase())}</text>`
      : ''
  }
  ${
    showCaption
      ? `<text x="${w / 2}" y="${h - Math.max(10, h * 0.03)}" text-anchor="middle" font-family="Arial, sans-serif" font-size="${Math.max(9, fontSub * 0.7)}" fill="${bg === WHITE ? GRAY : '#6B6D72'}">MBF placeholder image — swap for real photography</text>`
      : ''
  }
</svg>`;
}

function escapeXml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

const files = [];

function add(rel, svg) {
  files.push({ rel, svg });
}

// NOTE: hero, about-facility, stat-photo, projects thumbnails, services
// hero/carousel images and every equipment product shot are now real MBF
// photography (see scripts/process-real-images.mjs) — this generator only
// covers the slots that still lack a real photo: the MD portrait, client
// logos, and team/testimonial avatars.

add(
  'about/md-portrait.svg',
  card({ w: 900, h: 1100, bg: INK, icon: 'worker', title: 'Managing Director portrait — placeholder photo', photoMode: true })
);

// Client logos x10 (wordmark blocks, white cards)
for (let i = 1; i <= 10; i++) {
  add(
    `clients/client-${i}.svg`,
    card({ w: 320, h: 140, bg: WHITE, hatchColor: INK, icon: 'logo', iconColor: '#B9BABE', title: `Client ${i}`, titleColor: INK, subtitle: undefined, showCaption: false })
  );
}

// Team avatars (4 real team members)
const team = [
  ['team-mohammed-khalil', 'Mohammed Khalil'],
  ['team-mafad-hassan', 'Mafad Hassan'],
  ['team-sajid', 'Sajid'],
  ['team-mohammad-aman', 'Mohammad Aman'],
];
for (const [slug, name] of team) {
  add(`team/${slug}.svg`, card({ w: 500, h: 500, bg: INK_SOFT, icon: 'avatar', title: name, showCaption: false }));
}

// Testimonial/team-voice avatars (reuse team avatars conceptually but distinct files for MD + roles used in the "team commitment" section)
const voices = [
  ['voice-md', 'Matar Mohamed Fraih Al Qubaisi'],
  ['voice-ops', 'Mafad Hassan'],
  ['voice-sales', 'Mohammed Khalil'],
  ['voice-accounts', 'Mohammad Aman'],
];
for (const [slug, name] of voices) {
  add(`team/${slug}.svg`, card({ w: 400, h: 400, bg: INK, icon: 'avatar', title: name, showCaption: false }));
}

// Equipment images (21 items)
const equipment = [
  ['500-bbl-cylindrical-storage-tanks', 'tank', 'Cylindrical Storage Tank'],
  ['500-bbl-rectangle-storage-tank', 'tank', 'Rectangle Storage Tank'],
  ['acid-storage-tank-skid-mounted', 'tank', 'Acid Storage Tank'],
  ['diesel-tank', 'tank', 'Diesel Tank'],
  ['batch-mixer-coated', 'tank', 'Batch Mixer (Coated)'],
  ['batch-mixer-non-coated', 'tank', 'Batch Mixer (Non-Coated)'],
  ['multi-stage-pump', 'pump', 'Multi-Stage Pump'],
  ['single-triplex-pump', 'pump', 'Single Triplex Pump'],
  ['centrifugal-pump', 'pump', 'Centrifugal Pump'],
  ['self-priming-dewatering-pumps', 'pump', 'Dewatering Pump'],
  ['chemical-injection-pump', 'pump', 'Chemical Injection Pump'],
  ['choke-manifold-5k', 'valve', 'Choke Manifold 5K'],
  ['surface-safety-valve-5k', 'valve', 'Surface Safety Valve 5K'],
  ['caravan-40ft-skid-mounted', 'caravan', '40 FT Caravan'],
  ['caravan-40ft-senior-accommodation', 'caravan', 'Senior Accommodation Caravan'],
  ['caravan-40ft-trailer-mounted', 'caravan', 'Trailer-Mounted Caravan'],
  ['caravan-20ft-masjid-clinic-security', 'caravan', 'Multi-Purpose Caravan'],
  ['caravan-20ft-toilet-ablution', 'caravan', 'Ablution Caravan'],
  ['coil-tubing-unit', 'unit', 'Coil Tubing Unit'],
  ['twin-pump', 'pump', 'Twin Pump'],
  ['nitrogen-pump', 'unit', 'Nitrogen Pump'],
];
for (const [slug, icon, label] of equipment) {
  add(`equipment/${slug}.svg`, card({ w: 900, h: 700, bg: INK_SOFT, icon, iconColor: AMBER, title: label }));
}

await mkdir(OUT, { recursive: true });
for (const { rel, svg } of files) {
  const full = path.join(OUT, rel);
  await mkdir(path.dirname(full), { recursive: true });
  await writeFile(full, svg, 'utf8');
}

// Rasterize a single OG image (social crawlers need a raster format).
const ogSvg = card({
  w: 1200,
  h: 630,
  bg: INK,
  icon: 'rig',
  iconColor: AMBER,
  title: 'Matar Bin Fraih Trading & Oilfield Equipment Rental',
  subtitle: 'Abu Dhabi, UAE — Since 1998',
});
await mkdir(path.join(OUT, 'og'), { recursive: true });
await sharp(Buffer.from(ogSvg)).png().toFile(path.join(OUT, 'og/og-default.png'));

console.log(`Generated ${files.length} SVG placeholders + 1 PNG OG image in public/images/`);
