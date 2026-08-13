import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://www.matarbinfraih.com',
  // Deploy path. Defaults to '/' for the real matarbinfraih.com root
  // deployment. For the temporary client-review preview at
  // walidhasan.com/matarbinfraih, build with SITE_BASE=/matarbinfraih set
  // (see src/lib/site.ts's withBase() helper, used everywhere an internal
  // link/asset path is rendered so it resolves correctly either way).
  base: process.env.SITE_BASE || '/',
  integrations: [
    tailwind({ applyBaseStyles: false }),
    sitemap({
      // internal-only kitchen-sink reference, not a real page
      filter: (page) => !page.includes('/styleguide'),
    }),
  ],
});
