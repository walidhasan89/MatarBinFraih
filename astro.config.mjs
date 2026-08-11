import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://www.matarbinfraih.com',
  integrations: [
    tailwind({ applyBaseStyles: false }),
    sitemap({
      // internal-only kitchen-sink reference, not a real page
      filter: (page) => !page.includes('/styleguide'),
    }),
  ],
});
