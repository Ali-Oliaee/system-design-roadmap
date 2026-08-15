// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

const SITE = 'https://ali-oliaee.github.io';

// GitHub Pages serves the site from a sub-path, but `astro dev` should serve it
// from the root so http://localhost:4321/ renders the home page.
const isDev = process.argv.includes('dev');
const BASE = isDev ? '/' : '/system-design-roadmap';

export default defineConfig({
  site: SITE,
  base: BASE,
  trailingSlash: 'ignore',
  build: { format: 'directory' },
  integrations: [sitemap()],
  markdown: {
    shikiConfig: { themes: { light: 'github-light', dark: 'github-dark-dimmed' } },
  },
});
