export const SITE = {
  name: 'Matar Bin Fraih',
  legalName: 'Matar Bin Fraih Trading & Oilfield Equipment Rental',
  shortName: 'MBF',
  foundedYear: 1998,
  tagline: 'A trusted name in oilfield equipment manufacturing in the local and regional markets.',
  url: 'https://www.matarbinfraih.com',
  phone: '+971 2 8840 630',
  mobile: '+971 50 61 439 03',
  fax: '+971 2 55 388 67',
  email: 'info@matarbinfraih.com',
  address: 'Abu Rayyal St, Madinat Zayed, Abu Dhabi, UAE',
  addressLocality: 'Madinat Zayed',
  addressRegion: 'Abu Dhabi',
  addressCountry: 'AE',
  mapsUrl: 'https://goo.gl/maps/YD73TKCYau5ChDJy7',
  mapEmbedUrl:
    'https://maps.google.com/maps?q=23%C2%B039%2712.5%22N%2053%C2%B044%2728.2%22E&z=15&output=embed',
  // 23°39'12.5"N 53°44'28.2"E converted to decimal degrees, for geo meta tags + LocalBusiness schema.
  latitude: 23.6535,
  longitude: 53.7412,
  whatsapp: 'https://wa.me/971506143903',
  linkedin: 'https://www.linkedin.com/company/matar-bin-fraih-trading/',
} as const;

/**
 * Prefixes an internal, root-relative path (e.g. "/about",
 * "/images/x.webp") with the configured deploy base path (see
 * astro.config.mjs), so links and asset paths resolve correctly whether
 * the site is built for its domain root or a preview subfolder. External
 * URLs, `mailto:`, and `tel:` links are untouched.
 */
export function withBase(path: string): string {
  if (!path.startsWith('/') || path.startsWith('//')) return path;
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${base}${path}`;
}

export function currentYearsInOperation(): number {
  return new Date().getFullYear() - SITE.foundedYear;
}

export const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about' },
  { label: 'Equipment', href: '/equipment' },
  { label: 'Services', href: '/services' },
  { label: 'Contact', href: '/contact' },
] as const;

export const SERVICE_LINKS = [
  { label: 'Tank Cleaning', href: '/services/tank-cleaning' },
  { label: 'Maintenance', href: '/services/maintenance' },
  { label: 'Caravan Manufacturing', href: '/services/caravan-manufacturing' },
] as const;

export const EQUIPMENT_CATEGORIES = [
  { slug: 'storage-tanks', label: 'Storage Tanks' },
  { slug: 'pumps', label: 'Pumps' },
  { slug: 'well-control', label: 'Well Control' },
  { slug: 'caravans-cabins', label: 'Caravans & Cabins' },
  { slug: 'specialized-units', label: 'Specialized Units' },
] as const;

export function equipmentCategoryLabel(slug: string): string {
  return EQUIPMENT_CATEGORIES.find((c) => c.slug === slug)?.label ?? slug;
}

export function whatsappLink(message: string): string {
  return `https://wa.me/971506143903?text=${encodeURIComponent(message)}`;
}
