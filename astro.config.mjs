import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://www.matarbinfraih.com',
  // Always build for the root — `npm run build` also runs
  // scripts/relativize-build.mjs afterward, which rewrites every
  // internal href/src/url() in the output into a path relative to that
  // file. That makes the same dist/ folder work correctly no matter
  // where it's deployed (domain root, a subdomain, or nested at any
  // subfolder depth) without rebuilding or setting any env var.
  base: '/',
  build: {
    // Astro's default `_astro/` output folder for bundled CSS/JS is a
    // known source of broken deploys on some shared hosts — servers or
    // security rules that treat a leading underscore as a "hidden"
    // path can silently block or mangle the whole folder on upload,
    // which reads as "CSS not working" with no obvious cause. A plain
    // name has no such special meaning anywhere.
    assets: 'assets',
  },
  integrations: [
    tailwind({ applyBaseStyles: false }),
    sitemap({
      // internal-only kitchen-sink reference, not a real page
      filter: (page) => !page.includes('/styleguide'),
    }),
  ],
});
